import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

/**
 * A row from the `members` table. The row's `id` is the Supabase auth user's
 * UID (the members table has no separate user_id column).
 */
export type MemberProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const MEMBER_FIELDS =
  'id, first_name, last_name, email, phone_number, date_of_birth, gender, created_at, updated_at';

type UseMemberProfileResult = {
  member: MemberProfile | null;
  /** Count of the member's exercise_completions rows ("Reps"). */
  repsCount: number | null;
  /** Count of the member's sessions rows ("Sessions"). */
  sessionsCount: number | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Loads the logged-in member's profile from the `members` table (matching
 * `members.id` to the current auth session's user id), along with their
 * exercise-completion and session counts. Re-runs automatically when the
 * signed-in user changes.
 */
export function useMemberProfile(): UseMemberProfileResult {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [member, setMember] = useState<MemberProfile | null>(null);
  const [repsCount, setRepsCount] = useState<number | null>(null);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // `isCurrent` lets the effect discard results after the user id changes,
  // so a stale request can't overwrite fresh state.
  const load = useCallback(
    async (isCurrent: () => boolean = () => true) => {
      if (!userId) {
        if (isCurrent()) {
          setMember(null);
          setRepsCount(null);
          setSessionsCount(null);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (isCurrent()) {
        setLoading(true);
        setError(null);
      }

      const [profileRes, repsRes, sessionsRes] = await Promise.all([
        supabase
          .from('members')
          .select(MEMBER_FIELDS)
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('exercise_completions')
          .select('*', { count: 'exact', head: true })
          .eq('member_id', userId),
        supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('participant_id', userId),
      ]);

      if (!isCurrent()) return;

      const firstError =
        profileRes.error ?? repsRes.error ?? sessionsRes.error ?? null;
      if (firstError) {
        setError(new Error(firstError.message));
        setMember(null);
        setRepsCount(null);
        setSessionsCount(null);
      } else {
        setMember((profileRes.data as MemberProfile | null) ?? null);
        setRepsCount(repsRes.count ?? 0);
        setSessionsCount(sessionsRes.count ?? 0);
      }
      setLoading(false);
    },
    [userId]
  );

  useEffect(() => {
    let active = true;
    load(() => active);
    return () => {
      active = false;
    };
  }, [load]);

  const refetch = useCallback(() => load(), [load]);

  return { member, repsCount, sessionsCount, loading, error, refetch };
}
