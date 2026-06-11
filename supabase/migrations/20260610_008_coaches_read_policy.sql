-- Phase 2 — let members read the coach's row
--
-- The Chat screen resolves the message receiver by querying the `coaches` table
-- for email = 'coach@getforte.com' (see ChatScreen.tsx). For that lookup to
-- return a row, an authenticated member needs SELECT access to it. This adds a
-- read policy scoped to that single well-known coach row, so it doesn't expose
-- every coach's details.
--
-- Run this in the Supabase SQL editor. Enabling RLS makes the table deny-by-
-- default, so the policy below is what (re-)grants the scoped read.

alter table public.coaches enable row level security;

drop policy if exists "Members read coach profile" on public.coaches;
create policy "Members read coach profile"
  on public.coaches
  for select
  to authenticated
  using (email = 'coach@getforte.com');
