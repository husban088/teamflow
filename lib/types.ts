export type Priority = "low" | "medium" | "high";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Board = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
};

export type BoardMember = {
  board_id: string;
  user_id: string;
  role: "owner" | "member";
  profile?: Profile;
};

export type Column = {
  id: string;
  board_id: string;
  name: string;
  position: number;
  color: string;
};

export type Task = {
  id: string;
  board_id: string;
  column_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  assignee_id: string | null;
  priority: Priority;
  position: number;
  created_by: string;
  created_at: string;
  assignee?: Profile | null;
};

export type Comment = {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
};

export type Attachment = {
  id: string;
  task_id: string;
  url: string;
  filename: string;
  resource_type: string;
  uploaded_by: string;
  created_at: string;
};

// Minimal Database type so the Supabase client stays typed without
// generating the full CLI schema. Extend with `supabase gen types` later if needed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
