-- Phase 2 — add the category column to the exercise catalog
--
-- Drives the "Browse by category" grid on the Reps screen and the category
-- filter on the exercise list. Values are free text; the app uses the five
-- pillar names (Capacity, Composition, Flexibility, Endurance, PACE).
--
-- Idempotent: `if not exists` makes this safe to re-run.

alter table public.mental_fitness_exercises
  add column if not exists category text;
