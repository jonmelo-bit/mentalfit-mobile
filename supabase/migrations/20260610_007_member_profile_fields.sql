-- Phase 2 — let members update their own profile
--
-- The Edit Profile form writes to columns that already exist on members
-- (first_name, last_name, phone_number), so no new columns are added here.
-- Migration 001 only granted SELECT on members, so this adds the UPDATE policy
-- the Save button needs; without it the update is silently rejected by RLS.

drop policy if exists "Members update own profile" on public.members;
create policy "Members update own profile"
  on public.members
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
