import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Exercise } from './useExercises';

const EXERCISE_FIELDS =
  'id, name, slug, description, category, image_url, created_at, updated_at';

// Don't query until the user has typed something meaningful, and wait for a
// pause in typing before hitting the network.
const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

type UseExerciseSearchResult = {
  results: Exercise[];
  loading: boolean;
  // True once the query is long enough to search — i.e. when the dropdown
  // should be shown at all.
  active: boolean;
};

/**
 * Debounced, case-insensitive search of `mental_fitness_exercises` by name.
 * Returns an empty result set (and `active: false`) until the trimmed query
 * reaches {@link MIN_QUERY_LENGTH} characters.
 */
export function useExerciseSearch(query: string): UseExerciseSearchResult {
  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY_LENGTH;

  const [results, setResults] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const handle = setTimeout(async () => {
      const { data, error } = await supabase
        .from('mental_fitness_exercises')
        .select(EXERCISE_FIELDS)
        .ilike('name', `%${trimmed}%`)
        .order('name', { ascending: true });

      if (cancelled) return;

      setResults(error ? [] : ((data as Exercise[]) ?? []));
      setLoading(false);
    }, DEBOUNCE_MS);

    // Cancel the pending query if the term changes (or the component unmounts)
    // before the debounce fires, so only the latest term resolves.
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [trimmed, active]);

  return { results, loading, active };
}
