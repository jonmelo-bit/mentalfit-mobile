-- Phase 2 — add the category column to the exercise catalog
--
-- Drives the "Browse by category" grid on the Reps screen and the category
-- filter on the exercise list. Values are free text; the app uses the five
-- pillar names (Capacity, Composition, Flexibility, Endurance, PACE).
--
-- Idempotent: `if not exists` makes this safe to re-run.

alter table public.mental_fitness_exercises
  add column if not exists category text;

-- Enforce unique slugs so the seed's `on conflict do nothing` can dedupe and
-- so slugs stay safe to use as stable identifiers. Implemented as a unique
-- index because `create unique index if not exists` is idempotent (Postgres
-- has no `add constraint if not exists`). Fails if duplicate slugs already
-- exist — de-duplicate first if so.
create unique index if not exists mental_fitness_exercises_slug_key
  on public.mental_fitness_exercises (slug);
