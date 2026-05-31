import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * A row from the `mental_fitness_exercises` table.
 *
 * `category` is a column added to support the "Browse by category" grid; the
 * table has no duration column. All other fields confirmed via schema probing.
 */
export type Exercise = {
  id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const EXERCISE_FIELDS =
  'id, name, slug, description, category, image_url, created_at, updated_at';

type UseExercisesResult = {
  exercises: Exercise[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Loads all exercises from `mental_fitness_exercises`, ordered by creation
 * time so "the first one" is stable.
 */
export function useExercises(): UseExercisesResult {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (isCurrent: () => boolean = () => true) => {
    if (isCurrent()) {
      setLoading(true);
      setError(null);
    }

    const { data, error: queryError } = await supabase
      .from('mental_fitness_exercises')
      .select(EXERCISE_FIELDS)
      .order('created_at', { ascending: true });

    if (!isCurrent()) return;

    if (queryError) {
      setError(new Error(queryError.message));
      setExercises([]);
    } else {
      setExercises((data as Exercise[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    load(() => active);
    return () => {
      active = false;
    };
  }, [load]);

  const refetch = useCallback(() => load(), [load]);

  return { exercises, loading, error, refetch };
}
