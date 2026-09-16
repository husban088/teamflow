-- ============================================================================
-- TeamFlow — Supabase schema
-- Run this whole file once in your project's SQL Editor (Supabase Dashboard
-- → SQL Editor → New query → paste → Run). Safe to re-run: it drops nothing
-- that already has your data, but re-running CREATE TABLE will error if the
-- tables already exist — that's expected on a second run.
-- ============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.board_members (
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (board_id, user_id)
);

create table if not exists public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  name text not null,
  position int not null default 0,
  color text not null default '#9c7a2a',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  column_id uuid not null references public.columns(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamptz,
  assignee_id uuid references public.profiles(id) on delete set null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  position int not null default 0,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  url text not null,
  filename text not null,
  resource_type text not null default 'raw',
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever someone signs up
-- ----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-add the creator of a board as its owner member
create or replace function public.handle_new_board()
returns trigger as $$
begin
  insert into public.board_members (board_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_board_created on public.boards;
create trigger on_board_created
  after insert on public.boards
  for each row execute procedure public.handle_new_board();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.board_members enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.attachments enable row level security;

-- profiles: anyone signed in can read profiles (needed to show assignees/comments);
-- users can only edit their own.
create policy "profiles are readable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- helper: is the current user a member of a given board?
create or replace function public.is_board_member(target_board_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.board_members
    where board_id = target_board_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

create policy "members can read their boards" on public.boards
  for select using (public.is_board_member(id));

create policy "authenticated users can create boards" on public.boards
  for insert with check (auth.uid() = owner_id);

create policy "owners can update their boards" on public.boards
  for update using (auth.uid() = owner_id);

create policy "owners can delete their boards" on public.boards
  for delete using (auth.uid() = owner_id);

create policy "members can read board membership" on public.board_members
  for select using (public.is_board_member(board_id));

create policy "owners can add members" on public.board_members
  for insert with check (
    exists (select 1 from public.boards where id = board_id and owner_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "owners can remove members" on public.board_members
  for delete using (
    exists (select 1 from public.boards where id = board_id and owner_id = auth.uid())
  );

create policy "members can read columns" on public.columns
  for select using (public.is_board_member(board_id));

create policy "members can manage columns" on public.columns
  for all using (public.is_board_member(board_id))
  with check (public.is_board_member(board_id));

create policy "members can read tasks" on public.tasks
  for select using (public.is_board_member(board_id));

create policy "members can manage tasks" on public.tasks
  for all using (public.is_board_member(board_id))
  with check (public.is_board_member(board_id));

create policy "members can read comments" on public.comments
  for select using (
    exists (select 1 from public.tasks t where t.id = task_id and public.is_board_member(t.board_id))
  );

create policy "members can add comments" on public.comments
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.tasks t where t.id = task_id and public.is_board_member(t.board_id))
  );

create policy "members can read attachments" on public.attachments
  for select using (
    exists (select 1 from public.tasks t where t.id = task_id and public.is_board_member(t.board_id))
  );

create policy "members can add attachments" on public.attachments
  for insert with check (
    auth.uid() = uploaded_by
    and exists (select 1 from public.tasks t where t.id = task_id and public.is_board_member(t.board_id))
  );

-- ----------------------------------------------------------------------------
-- Realtime: broadcast row changes for live collaboration
-- ----------------------------------------------------------------------------

-- Full replica identity so DELETE events carry enough of the old row
-- (e.g. board_id) for realtime filters to match them correctly.
alter table public.tasks replica identity full;
alter table public.columns replica identity full;
alter table public.comments replica identity full;
alter table public.board_members replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table public.tasks;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.columns;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.comments;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.board_members;
  exception when duplicate_object then null;
  end;
end $$;
