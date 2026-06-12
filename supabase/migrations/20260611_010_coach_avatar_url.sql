-- Phase 2 — point the coach avatar at the uploaded asset
--
-- Supersedes the UI-generated initials URL from migration 009. The avatar is
-- now a PNG uploaded to the public `avatars` storage bucket. This updates the
-- well-known coach row (coach@getforte.com) to reference it.
--
-- Assumes the `avatar_url` column already exists (added in migration 009).
-- Run this in the Supabase SQL editor.

update public.coaches
  set avatar_url = 'https://spqzfcvywzsbbynpuuqn.supabase.co/storage/v1/object/public/avatars/maya.png'
  where email = 'coach@getforte.com';
