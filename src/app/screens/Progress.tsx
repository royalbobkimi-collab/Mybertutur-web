/** Progress — sejarah & skor ujian lisan dari `submissions` + `test_results`. */
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../shell';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../i18n';
import { fetchSubmissions, getTestResults, type SubmissionRow } from '../lib/data';

function fmtWhen(iso: string, en: boolean): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(en ? 'en-GB' : 'ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(en ? 'en-GB' : 'ms-MY', { hour: '2-digit', minute: '2-digit' });
}

export function Progress() {
  const { user } = useAuth();
  const { isEnglish } = useLanguage();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [testStats, setTestStats] = useState<{ count: number; avg: number | null }>({ count: 0, avg: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) { setRows([]); setLoading(false); return; }
    setError(null);
    setLoading(true);
    try {
      const [subs, results] = await Promise.all([
        fetchSubmissions(user.id),
        getTestResults(user.id).catch(() => []),
      ]);
      setRows(subs);
      const avg = results.length
        ? Math.round(results.reduce((a, r) => a + r.overall_score, 0) / results.length)
        : null;
      setTestStats({ count: results.length, avg });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { void load(); }, [load]);

  const scores = rows.filter((r) => typeof r.score === 'number').map((r) => r.score as number);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <AppShell
      title={isEnglish ? 'Progress' : 'Kemajuan'}
      subtitle={isEnglish ? 'Test history & scores' : 'Sejarah & skor ujian anda'}
      activeRoute="/app/settings"
      onBack="/app"
    >
      <div className="space-y-3.5 pb-6">
        {/* Sumber 1: test_results — sumber sama dengan kad Home (HeroProgressCard) */}
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#7C3AED] dark:text-[#A78BFA]">
            {isEnglish ? 'AI Test Results' : 'Keputusan Ujian AI'}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-[14px] bg-slate-50 py-2.5 dark:bg-white/5">
              <div className="text-xl font-black text-slate-900 dark:text-[#F8FAFC]">{testStats.count}</div>
              <div className="text-[10px] font-bold text-slate-400">{isEnglish ? 'Tests completed' : 'Ujian selesai'}</div>
            </div>
            <div className="rounded-[14px] bg-slate-50 py-2.5 dark:bg-white/5">
              <div className="text-xl font-black text-[#7C3AED] dark:text-[#A78BFA]">{testStats.avg ?? '—'}</div>
              <div className="text-[10px] font-bold text-slate-400">{isEnglish ? 'Average score' : 'Purata markah'}</div>
            </div>
          </div>
        </div>

        {/* Sumber 2: submissions — sejarah langkah ujian */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">{rows.length}</div>
            <div className="text-[11px] font-bold text-slate-400">{isEnglish ? 'Submissions' : 'Hantaran'}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="text-2xl font-black text-[#7C3AED] dark:text-[#A78BFA]">{avg ?? '—'}</div>
            <div className="text-[11px] font-bold text-slate-400">{isEnglish ? 'Average' : 'Purata'}</div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {loading && <p className="py-12 text-center text-sm font-bold text-slate-400">Memuatkan…</p>}
          {error && !loading && (
            <div className="rounded-[18px] border border-red-500/30 bg-red-500/10 p-4 text-center text-xs">
              <p className="font-bold text-red-500">{error}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-2 rounded-full bg-[#7C3AED] px-4 py-1.5 text-xs font-extrabold text-white"
              >
                Cuba Lagi
              </button>
            </div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-white/10">
              <div className="text-3xl">📊</div>
              <div className="mt-2 font-bold text-slate-600 dark:text-slate-300">
                {isEnglish ? 'No tests yet — start with BM or BI.' : 'Belum ada ujian — mulakan dengan BM atau BI.'}
              </div>
            </div>
          )}
          {!loading &&
            !error &&
            rows.map((r) => (
              <div
                key={r.id}
                className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.latihan_id === 1 ? '🎤' : '🌍'}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">
                    {r.latihan_id === 1
                      ? 'Ujian Lisan BM'
                      : r.latihan_id === 2
                      ? 'Ujian Lisan BI'
                      : `Latihan ${r.latihan_id}`}
                  </span>
                  <span className="ml-auto rounded-[12px] bg-[#7C3AED] px-2.5 py-1 text-xs font-black text-white shadow-sm">
                    {r.score ?? '—'}
                  </span>
                </div>
                <div className="mt-1 text-[11px] font-semibold text-slate-400">
                  {fmtWhen(r.created_at, isEnglish)}
                </div>
                {r.feedback && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {r.feedback}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
    </AppShell>
  );
}
