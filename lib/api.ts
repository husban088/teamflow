import { createClient } from "@/lib/supabase/client";
import type { Priority } from "@/lib/types";

// Default columns every new board starts with — kept here as the single
// source of truth for the client; the actual inserts happen inside the
// create_board_with_defaults DB function (supabase/migrations/003_*.sql).

export async function createBoard(name: string, description: string) {
  const supabase = createClient();

  // owner_id is filled server-side from auth.uid() (see migration 002).
  // Board + its 3 default columns used to be two sequential requests (insert
  // board, wait, insert columns); create_board_with_defaults (migration 003)
  // does both in one round trip, so "New board" → click Create feels instant
  // instead of waiting through two network hops before navigating.
  const { data: board, error } = await supabase
    .rpc("create_board_with_defaults", {
      board_name: name,
      board_description: description || null,
    })
    .single();
  if (error) throw error;

  return board as { id: string; name: string; description: string | null; owner_id: string; created_at: string };
}

export async function deleteBoard(boardId: string) {
  const supabase = createClient();
  // RLS only allows the board owner to delete (see schema.sql policy
  // "owners can delete their boards"); columns/tasks/members/comments/
  // attachments all cascade from boards via FK "on delete cascade".
  //
  // IMPORTANT: a plain .delete().eq("id", boardId) with no .select() can
  // return success with zero rows affected if RLS silently filters the row
  // out (e.g. you're not the owner) — Postgres/PostgREST doesn't treat that
  // as an error. That was causing the "board deleted" toast to show, then
  // the same board reappearing later, because nothing was actually removed.
  // Selecting the deleted row back lets us tell a real failure from a no-op.
  const { data, error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Board wasn't deleted — you may not be its owner.");
  }
}

export async function inviteMember(boardId: string, email: string) {
  const supabase = createClient();
  const { data: profile, error: findError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (findError) throw findError;
  if (!profile) {
    throw new Error("No TeamFlow account found with that email yet.");
  }

  const { error } = await supabase
    .from("board_members")
    .insert({ board_id: boardId, user_id: profile.id, role: "member" });
  if (error) {
    if (error.code === "23505") throw new Error("That person is already on this board.");
    throw error;
  }
}

export async function createTask(params: {
  boardId: string;
  columnId: string;
  title: string;
  position: number;
}) {
  const supabase = createClient();
  // created_by is filled server-side from auth.uid() — see migration 002.
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      board_id: params.boardId,
      column_id: params.columnId,
      title: params.title,
      position: params.position,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(
  taskId: string,
  patch: Partial<{
    title: string;
    description: string | null;
    deadline: string | null;
    assignee_id: string | null;
    priority: Priority;
    column_id: string;
    position: number;
  }>
) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").update(patch).eq("id", taskId);
  if (error) throw error;
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}

export async function addComment(taskId: string, content: string) {
  const supabase = createClient();
  // user_id is filled server-side from auth.uid() — see migration 002.
  // Select the row straight back (with the author's profile joined) instead
  // of just inserting blind — the caller shows this immediately rather than
  // waiting on the realtime "postgres_changes" event, which is what made a
  // comment you just wrote only appear after closing and reopening the task.
  const { data, error } = await supabase
    .from("comments")
    .insert({ task_id: taskId, content })
    .select("*, profile:profiles(*)")
    .single();
  if (error) throw error;
  return data;
}

export async function addAttachment(params: {
  taskId: string;
  url: string;
  filename: string;
  resourceType: string;
}) {
  const supabase = createClient();
  // uploaded_by is filled server-side from auth.uid() — see migration 002.
  const { error } = await supabase.from("attachments").insert({
    task_id: params.taskId,
    url: params.url,
    filename: params.filename,
    resource_type: params.resourceType,
  });
  if (error) throw error;
}

export async function createColumn(boardId: string, name: string, position: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("columns")
    .insert({ board_id: boardId, name, position, color: "#8b5cf6" });
  if (error) throw error;
}
