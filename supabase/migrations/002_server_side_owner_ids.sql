-- ============================================================================
-- Fix: "new row violates row-level security policy for table boards"
--
-- Root cause: the client was sending owner_id / created_by / user_id /
-- uploaded_by itself (read from supabase.auth.getUser() in the browser).
-- In edge cases (stale session cache, multiple tabs, a session refresh that
-- just happened) that client-side value can be a beat behind the auth.uid()
-- that Postgres sees for the actual insert request, so the RLS check
-- `auth.uid() = owner_id` fails even though the user is genuinely signed in.
--
-- Fix: make these columns default to auth.uid() on the database side, and
-- stop sending them from the client entirely (see lib/api.ts). Postgres then
-- always fills them from the same session that is performing the insert, so
-- there's nothing left to go out of sync.
--
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run.
-- ============================================================================

alter table public.boards
  alter column owner_id set default auth.uid();

alter table public.tasks
  alter column created_by set default auth.uid();

alter table public.comments
  alter column user_id set default auth.uid();

alter table public.attachments
  alter column uploaded_by set default auth.uid();
