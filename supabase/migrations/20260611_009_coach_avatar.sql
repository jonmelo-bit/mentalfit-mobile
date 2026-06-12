-- Phase 2 — give the coach a displayable avatar
--
-- The Chat screen header shows Maya Reyes' avatar. Rather than hardcode it in
-- the client, store it on the coach's row so it can change without an app
-- release. This adds an `avatar_url` column to `coaches` and sets it for the
-- well-known coach (coach@getforte.com) to a UI-generated initials avatar using
-- the app's warm gold accent (#C9A84C) on the dark canvas (#1A2318).
--
-- Run this in the Supabase SQL editor.

alter table public.coaches
  add column if not exists avatar_url text;

update public.coaches
  set avatar_url = 'https://ui-avatars.com/api/?name=Maya+Reyes&background=C9A84C&color=1A2318&bold=true&size=256&font-size=0.4'
  where email = 'coach@getforte.com';
