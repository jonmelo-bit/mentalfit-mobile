-- Phase 2 — seed exercises across the five pillar categories
--
-- Inserts 4 exercises per pillar (Capacity, Composition, Flexibility,
-- Endurance, PACE). Requires the `category` column from migration 002.
--
-- `on conflict do nothing` makes this safe to re-run when a unique
-- constraint exists on the catalog (e.g. on slug); without one, re-running
-- would insert duplicates.

insert into public.mental_fitness_exercises (name, slug, description, category) values
  -- Capacity (working memory, attention span, mental bandwidth)
  ('Box Breathing Reset',        'box-breathing-reset',         'Inhale, hold, exhale, and hold for equal counts of four to widen your attentional capacity before a demanding task.', 'Capacity'),
  ('Single-Task Focus Block',    'single-task-focus-block',     'Work on one task with all notifications off for a fixed block, rebuilding your ability to sustain deep attention.',     'Capacity'),
  ('Working Memory Ladder',      'working-memory-ladder',       'Hold and reorder a growing list of items in your head to stretch the upper limit of your working memory.',            'Capacity'),
  ('Attention Anchor Drill',     'attention-anchor-drill',      'Rest attention on a single anchor and gently return each time it wanders, training capacity to stay present.',         'Capacity'),

  -- Composition (composure, emotional regulation under pressure)
  ('Name It to Tame It',         'name-it-to-tame-it',          'Label the emotion you are feeling in a single word to lower its intensity and regain composure.',                     'Composition'),
  ('Physiological Sigh',         'physiological-sigh',          'Take a double inhale through the nose followed by a long exhale to quickly down-regulate stress in real time.',        'Composition'),
  ('Composure Under Pressure',   'composure-under-pressure',    'Rehearse a high-stakes moment while keeping breathing slow and posture tall to stay composed when it counts.',         'Composition'),
  ('Reframe the Moment',         'reframe-the-moment',          'Restate a stressful situation as a challenge to be met rather than a threat to be feared.',                           'Composition'),

  -- Flexibility (cognitive and psychological flexibility)
  ('Perspective Shift',          'perspective-shift',           'View a sticking point from three different vantage points to loosen rigid thinking.',                                 'Flexibility'),
  ('Values Pivot',               'values-pivot',                'When a plan breaks, choose the next action that still moves you toward what matters most.',                            'Flexibility'),
  ('Defusion Practice',          'defusion-practice',           'Notice a difficult thought as just a thought — "I am having the thought that..." — to create room to choose.',        'Flexibility'),
  ('Yes-And Mindset',            'yes-and-mindset',             'Accept what is happening and add a constructive next step, building adaptability under changing conditions.',          'Flexibility'),

  -- Endurance (mental stamina, grit, sustained effort)
  ('Discomfort Dwell',           'discomfort-dwell',            'Stay with a mild, safe discomfort a little longer than feels comfortable to build tolerance for hard moments.',       'Endurance'),
  ('One More Rep Visualization', 'one-more-rep-visualization',  'Picture yourself pushing through the final, hardest repetition to strengthen follow-through under fatigue.',          'Endurance'),
  ('Grit Interval',              'grit-interval',               'Commit fully to a short, demanding interval, then recover, repeating to train sustained mental effort.',              'Endurance'),
  ('Fatigue Reframe',            'fatigue-reframe',             'Treat the feeling of fatigue as a signal to focus rather than a command to stop.',                                    'Endurance'),

  -- PACE (pacing, tempo, pre-performance rhythm)
  ('Pre-Game PACE Routine',      'pre-game-pace-routine',       'Run a consistent four-step routine before performing to settle into the right tempo and intensity.',                 'PACE'),
  ('Tempo Reset Breath',         'tempo-reset-breath',          'Use a slow, metered breath to reset your internal tempo when you feel yourself rushing.',                            'PACE'),
  ('Energy Pacing Plan',         'energy-pacing-plan',          'Map your effort across the full duration of a task so you finish strong instead of burning out early.',               'PACE'),
  ('Race-Day Rhythm',            'race-day-rhythm',             'Lock into a repeatable cadence of movement and breath to hold a steady, sustainable pace.',                           'PACE')
on conflict do nothing;
