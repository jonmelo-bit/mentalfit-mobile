import type { Exercise } from '../hooks/useExercises';

/**
 * Tabs in the bottom tab navigator nested under the root stack's `Tabs` route.
 */
export type TabParamList = {
  Reps: undefined;
  Coach: undefined;
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
};

/**
 * Routes in the authenticated root stack. The tab navigator is nested under
 * `Tabs`; the gym flow screens are pushed on top of it.
 */
export type RootStackParamList = {
  Tabs: undefined;
  // Optional category filter. Omitted (via "Enter Gym") = show all exercises;
  // set (via a category tile) = show only that category, with it as the header.
  ExerciseList: { category?: string } | undefined;
  // The exercise is already loaded in the list, so pass it through rather
  // than refetching by id on the detail screen.
  ExerciseDetail: { exercise: Exercise };
  // Edit the signed-in member's profile. Loads its own data on mount, so no
  // params are needed.
  EditProfile: undefined;
};
