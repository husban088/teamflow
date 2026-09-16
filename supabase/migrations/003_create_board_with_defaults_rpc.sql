-- ============================================================================
-- Speed up "New board": one round trip instead of two
--
-- Before: the client sent an INSERT into boards, waited for it to come
-- back, then sent a second INSERT into columns. Two sequential network
-- round trips to Supabase before the button could stop spinning — on a
-- slower connection that's very noticeable.
--
-- This wraps both inserts (board + its three default columns) in a single
-- Postgres function, called once via supabase.rpc(). owner_id still comes
-- from auth.uid() inside the function (same server-side-only trust model as
-- migration 002 — the client never sends its own id), and it runs in one
-- transaction so you never end up with a board that has no columns.
--
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run.
-- ============================================================================

create or replace function public.create_board_with_defaults(
  board_name text,
  board_description text
)
returns public.boards
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_board public.boards;
begin
  insert into public.boards (name, description)
  values (board_name, board_description)
  returning * into new_board;

  insert into public.columns (board_id, name, position, color)
  values
    (new_board.id, 'To do', 0, '#8b8398'),
    (new_board.id, 'In progress', 1, '#8b5cf6'),
    (new_board.id, 'Done', 2, '#2dd4bf');

  return new_board;
end;
$$;

-- security invoker (the default, spelled out for clarity) means this runs
-- as the calling user, so the existing RLS policies on boards/columns still
-- apply exactly as before — this is purely a network optimization, not a
-- permissions change.
grant execute on function public.create_board_with_defaults(text, text) to authenticated;
