-- Phase 2 — messages reseed for the @getforte.com accounts
--
-- Migration 005 seeded the conversation for the *.forte.com accounts. The
-- active accounts are now *.getforte.com, so this reseeds the same sample
-- coach -> member conversation using those emails.
--
-- It also adds a SELECT policy so a signed-in member can read the coach's
-- `members` row by email. The Chat screen looks the coach up directly on mount
-- (members.email = 'coach@getforte.com') to know who to address messages to;
-- without this policy the existing "Members read own profile" policy
-- (id = auth.uid()) would hide the coach row and the send button would stay
-- disabled. Policies are OR'd, so this only widens reads to the coach row.
--
-- Run this in the Supabase SQL editor AFTER 20260610_004_messages.sql. The
-- editor runs as a privileged role, so the auth.users lookups below resolve the
-- real user ids without hardcoding any UUIDs.

-- 1) Let authenticated members read the coach's profile row (needed for the
--    Chat screen's coach lookup).
drop policy if exists "Members read coach profile" on public.members;
create policy "Members read coach profile"
  on public.members
  for select
  to authenticated
  using (email = 'coach@getforte.com');

-- 2) Reseed sample coach messages for the @getforte.com pair.
insert into public.messages (sender_id, receiver_id, content, created_at)
select
  coach.id,
  member.id,
  seed.content,
  now() - seed.ago
from
  (select id from auth.users where email = 'coach@getforte.com') as coach,
  (select id from auth.users where email = 'member@getforte.com') as member,
  (values
    ('Morning Jon — saw you hit your breath rep streak. How''s the body feeling?', interval '52 minutes'),
    ('Solid work this week. Want to swap tomorrow''s focus block for a mobility rep instead? You earned the reset.', interval '38 minutes'),
    ('No pressure either way — just flag it here and I''ll move it on the calendar.', interval '24 minutes'),
    ('Also dropping a short box-breathing drill in your Reps for tonight. Two minutes, before bed.', interval '11 minutes')
  ) as seed(content, ago)
where not exists (
  select 1
  from public.messages m
  where m.receiver_id = (select id from auth.users where email = 'member@getforte.com')
     or m.sender_id   = (select id from auth.users where email = 'member@getforte.com')
);
