/**
 * Web test-progress hook — port of mobile useTestProgress
 * (app-baru/src/hooks/useTestProgress.ts): stats from `submissions`
 * (latihan_id 1 = BM, 2 = BI), GMT+8 weekly minutes.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type TestProgressState = {
  loading: boolean;
  totalTests: number;
  completedCount: number;
  percent: number;
  completedBm: boolean;
  completedBi: boolean;
  averageScore: number | null;
  weeklyMinutes: number[];
};

const TOTAL_TESTS = 2;
const EST_MINUTES_PER_SUBMISSION = 4;

const EMPTY_STATE: TestProgressState = {
  loading: false,
  totalTests: TOTAL_TESTS,
  completedCount: 0,
  percent: 0,
  completedBm: false,
  completedBi: false,
  averageScore: null,
  weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
};

type SubmissionRow = {
  latihan_id: number | null;
  score: number | null;
  created_at: string | null;
};

function gmt8WeekStart(): Date {
  const now = new Date(Date.now() + 8 * 3600 * 1000);
  const dow = (now.getUTCDay() + 6) % 7; // Mon=0
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dow, 0, 0, 0, 0) -
      8 * 3600 * 1000,
  );
  return start;
}

function gmt8WeekEnd(): Date {
  const s = gmt8WeekStart();
  return new Date(s.getTime() + 7 * 24 * 3600 * 1000 - 1);
}

function gmt8DayIndex(d: Date): number {
  const gmt8 = new Date(d.getTime() + 8 * 3600 * 1000);
  return (gmt8.getUTCDay() + 6) % 7;
}

export function useTestProgress(): TestProgressState {
  const { user } = useAuth();
  const [state, setState] = useState<TestProgressState>(EMPTY_STATE);

  const load = useCallback(async () => {
    if (!user?.id) {
      setState(EMPTY_STATE);
      return;
    }
    setState((p) => ({ ...p, loading: true }));
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('latihan_id, score, created_at')
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as SubmissionRow[];
      const doneBm = rows.some((r) => r.latihan_id === 1);
      const doneBi = rows.some((r) => r.latihan_id === 2);
      const completedCount = (doneBm ? 1 : 0) + (doneBi ? 1 : 0);
      const scores = rows
        .map((r) => r.score)
        .filter((n): n is number => typeof n === 'number' && !Number.isNaN(n));
      const averageScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;
      const weeklyMinutes = [0, 0, 0, 0, 0, 0, 0];
      const ws = gmt8WeekStart();
      const we = gmt8WeekEnd();
      for (const r of rows) {
        if (!r.created_at) continue;
        const d = new Date(r.created_at);
        if (Number.isNaN(d.getTime())) continue;
        if (d < ws || d > we) continue;
        weeklyMinutes[gmt8DayIndex(d)] += EST_MINUTES_PER_SUBMISSION;
      }
      setState({
        loading: false,
        totalTests: TOTAL_TESTS,
        completedCount,
        percent: TOTAL_TESTS > 0 ? Math.round((completedCount / TOTAL_TESTS) * 100) : 0,
        completedBm: doneBm,
        completedBi: doneBi,
        averageScore,
        weeklyMinutes,
      });
    } catch (e) {
      console.info('[useTestProgress] fallback 0%:', e instanceof Error ? e.message : e);
      setState({ ...EMPTY_STATE, loading: false });
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return state;
}
