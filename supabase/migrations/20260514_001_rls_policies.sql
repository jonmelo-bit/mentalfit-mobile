-- Phase 2 — Row Level Security policies
--
-- Lets a signed-in member read their own profile/activity and record their
-- own exercise completions, and lets any authenticated user read the shared
-- exercise catalog. Assumes the underlying tables already exist.
--
-- Note: in addition to `members` and `mental_fitness_exercises`, this also
-- covers `exercise_completions` (insert + read) and `sessions` (read) —
-- without those the "Enter Gym" completion insert and the Home screen
-- Reps/Sessions counts would not work.
--
-- Policies are dropped-then-created so this file is safe to re-run.

-- members: a member can read their own row (members.id == auth uid)
alter table public.members enable row level security;

drop policy if exists "Members read own profile" on public.members;
create policy "Members read own profile"
  on public.members
  for select
  to authenticated
  using (id = auth.uid());

-- mental_fitness_exercises: shared catalog, readable by any signed-in user
alter table public.mental_fitness_exercises enable row level security;

drop policy if exists "Authenticated can read exercises" on public.mental_fitness_exercises;
create policy "Authenticated can read exercises"
  on public.mental_fitness_exercises
  for select
  to authenticated
  using (true);

-- exercise_completions: a member can insert and read only their own rows
alter table public.exercise_completions enable row level security;

drop policy if exists "Members insert own completions" on public.exercise_completions;
create policy "Members insert own completions"
  on public.exercise_completions
  for insert
  to authenticated
  with check (member_id = auth.uid());

drop policy if exists "Members read own completions" on public.exercise_completions;
create policy "Members read own completions"
  on public.exercise_completions
  for select
  to authenticated
  using (member_id = auth.uid());

-- sessions: a member can read sessions they participate in
alter table public.sessions enable row level security;

drop policy if exists "Members read own sessions" on public.sessions;
create policy "Members read own sessions"
  on public.sessions
  for select
  to authenticated
  using (participant_id = auth.uid());
