import { notFound, redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/board/KanbanBoard";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .maybeSingle();

  if (!board) notFound();

  const [{ data: columns }, { data: tasks }, { data: members }] = await Promise.all([
    supabase.from("columns").select("*").eq("board_id", boardId).order("position"),
    supabase
      .from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(*)")
      .eq("board_id", boardId)
      .order("position"),
    supabase
      .from("board_members")
      .select("*, profile:profiles(*)")
      .eq("board_id", boardId),
  ]);

  return (
    <KanbanBoard
      board={board}
      initialColumns={columns ?? []}
      initialTasks={tasks ?? []}
      initialMembers={members ?? []}
      currentUserId={user.id}
    />
  );
}
