import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { DashboardEmptyState } from "@/components/board/DashboardEmptyState";
import { DashboardOverview, type BoardSummary, type MentionSummary } from "@/components/board/DashboardOverview";
import type { Board, Column, Task, Profile } from "@/lib/types";

type StatusBucket = "todo" | "in-progress" | "done";

// Boards can rename their columns freely, so status is inferred from the
// column name rather than assuming a fixed set of column ids.
function classifyColumn(name: string): StatusBucket {
  const n = name.toLowerCase();
  if (n.includes("done") || n.includes("complete") || n.includes("shipped") || n.includes("closed")) return "done";
  if (n.includes("progress") || n.includes("review") || n.includes("doing")) return "in-progress";
  return "todo";
}

// Matches "@Full Name" or "@first" so comments like "cc @Robert Grant" or
// "@robert can you check this" both resolve to a real board member below.
const MENTION_RE = /@([a-zA-Z][\w.'-]*(?:\s+[a-zA-Z][\w.'-]*)?)/g;

export default async function DashboardPage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("board_members").select("board_id, boards(*)").eq("user_id", user.id),
  ]);

  const boards = (memberships ?? [])
    .map((m) => m.boards)
    .flat()
    .filter(Boolean) as unknown as Board[];

  if (boards.length === 0) {
    return <DashboardEmptyState />;
  }

  const boardIds = boards.map((b) => b.id);

  const [{ data: columns }, { data: tasks }, { data: memberRows }, { data: comments }] = await Promise.all([
    supabase.from("columns").select("*").in("board_id", boardIds),
    supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*)")
      .in("board_id", boardIds),
    supabase.from("board_members").select("board_id, profile:profiles(*)").in("board_id", boardIds),
    // RLS already scopes this to comments on tasks the user can see, i.e.
    // exactly the boards above — no extra board_id filter needed.
    supabase.from("comments").select("id, content").order("created_at", { ascending: false }).limit(500),
  ]);

  const columnBucket = new Map<string, StatusBucket>();
  (columns as Column[] | null)?.forEach((c) => columnBucket.set(c.id, classifyColumn(c.name)));

  type BoardAgg = { total: number; todo: number; inProgress: number; done: number };
  const boardAgg = new Map<string, BoardAgg>();
  boardIds.forEach((id) => boardAgg.set(id, { total: 0, todo: 0, inProgress: 0, done: 0 }));

  let totalTasks = 0;
  let totalTodo = 0;
  let totalInProgress = 0;
  let totalDone = 0;
  const activityByDay = new Map<string, number>();

  (tasks as Task[] | null)?.forEach((t) => {
    const bucket = columnBucket.get(t.column_id) ?? "todo";
    const agg = boardAgg.get(t.board_id);
    if (agg) {
      agg.total++;
      if (bucket === "done") agg.done++;
      else if (bucket === "in-progress") agg.inProgress++;
      else agg.todo++;
    }
    totalTasks++;
    if (bucket === "done") totalDone++;
    else if (bucket === "in-progress") totalInProgress++;
    else totalTodo++;

    const day = t.created_at?.slice(0, 10);
    if (day) activityByDay.set(day, (activityByDay.get(day) ?? 0) + 1);
  });

  const activity = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      count: activityByDay.get(key) ?? 0,
    };
  });

  const membersByBoard = new Map<string, { id: string; name: string }[]>();
  const nameToProfile = new Map<string, { id: string; name: string }>();

  (memberRows as unknown as { board_id: string; profile: Profile | null }[] | null)?.forEach((m) => {
    const p = m.profile;
    if (!p) return;
    const name = p.full_name || p.email || "Member";
    const list = membersByBoard.get(m.board_id) ?? [];
    if (!list.find((x) => x.id === p.id)) list.push({ id: p.id, name });
    membersByBoard.set(m.board_id, list);

    nameToProfile.set(name.toLowerCase(), { id: p.id, name });
    const first = name.split(" ")[0];
    if (first && !nameToProfile.has(first.toLowerCase())) {
      nameToProfile.set(first.toLowerCase(), { id: p.id, name });
    }
  });

  const mentionCounts = new Map<string, { name: string; count: number }>();
  (comments as { id: string; content: string }[] | null)?.forEach((c) => {
    const seenInThisComment = new Set<string>();
    for (const match of c.content.matchAll(MENTION_RE)) {
      const raw = match[1].trim().toLowerCase();
      const hit = nameToProfile.get(raw) ?? nameToProfile.get(raw.split(" ")[0]);
      if (!hit || seenInThisComment.has(hit.id)) continue;
      seenInThisComment.add(hit.id);
      const existing = mentionCounts.get(hit.id);
      mentionCounts.set(hit.id, { name: hit.name, count: (existing?.count ?? 0) + 1 });
    }
  });

  const mentions: MentionSummary[] = Array.from(mentionCounts.entries())
    .map(([id, v]) => ({ id, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const boardSummaries: BoardSummary[] = boards
    .map((b) => {
      const agg = boardAgg.get(b.id) ?? { total: 0, todo: 0, inProgress: 0, done: 0 };
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        total: agg.total,
        todo: agg.todo,
        inProgress: agg.inProgress,
        done: agg.done,
        members: membersByBoard.get(b.id) ?? [],
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <DashboardOverview
      userName={profile?.full_name ?? user.email ?? "there"}
      boards={boardSummaries}
      totals={{
        boards: boards.length,
        tasks: totalTasks,
        todo: totalTodo,
        inProgress: totalInProgress,
        done: totalDone,
      }}
      activity={activity}
      mentions={mentions}
    />
  );
}
