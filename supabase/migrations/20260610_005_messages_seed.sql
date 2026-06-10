-- Phase 2 — messages realtime + seed
--
-- 1) Adds `messages` to the `supabase_realtime` publication so the Chat screen's
--    realtime subscription receives INSERT events. Guarded so it is safe to re-run.
-- 2) Seeds 4 sample coach messages (coach@forte.com -> member@forte.com) so the
--    member sees a realistic conversation on first load. Idempotent: it only
--    inserts when the member has no existing messages.
--
-- Run this in the Supabase SQL editor AFTER 20260610_004_messages.sql. The editor
-- runs as a privileged role, so the auth.users lookups below resolve the real
-- user ids without hardcoding any UUIDs.

-- 1) Realtime publication
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

-- 2) Seed sample coach messages
insert into public.messages (sender_id, receiver_id, content, created_at)
select
  coach.id,
  member.id,
  seed.content,
  now() - seed.ago
from
  (select id from auth.users where email = 'coach@forte.com') as coach,
  (select id from auth.users where email = 'member@forte.com') as member,
  (values
    ('Morning Jon — saw you hit your breath rep streak. How''s the body feeling?', interval '52 minutes'),
    ('Solid work this week. Want to swap tomorrow''s focus block for a mobility rep instead? You earned the reset.', interval '38 minutes'),
    ('No pressure either way — just flag it here and I''ll move it on the calendar.', interval '24 minutes'),
    ('Also dropping a short box-breathing drill in your Reps for tonight. Two minutes, before bed.', interval '11 minutes')
  ) as seed(content, ago)
where not exists (
  select 1
  from public.messages m
  where m.receiver_id = (select id from auth.users where email = 'member@forte.com')
     or m.sender_id   = (select id from auth.users where email = 'member@forte.com')
);
