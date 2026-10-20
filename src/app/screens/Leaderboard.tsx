import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../shell';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../i18n';
import { fetchLeaderboard, type LeaderboardEntry } from '../lib/data';

export function Leaderboard() {
  const { user } = useAuth();
  const { isEnglish } = useLanguage();
  const [scope, setScope] = useState<'global' | 'personal'>('global');
  const [filter, setFilter] = useState<1 | 2 | null>(null);
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      setRows(await fetchLeaderboard(filter));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  const displayedRows = scope === 'personal' && user?.id ? rows.filter((r) => r.user_id === user.id) : rows;

  return (
    <AppShell activeRoute="/app/leaderboard">
      <div className="space-y-3.5 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">
            {isEnglish ? 'Leaderboard' : 'Papan Pendahulu'}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
            {isEnglish ? 'Real scores from all learners' : 'Markah sebenar semua pelajar'}
          </p>
        </div>

        {/* Global / Personal Segmented Scope */}
        <div className="flex rounded-[14px] border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-[#111827]">
          <button
            type="button"
            onClick={() => setScope('global')}
            className={`flex-1 rounded-[10px] py-2 text-xs font-black transition ${
              scope === 'global' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            🌍 Global
          </button>
          <button
            type="button"
            onClick={() => setScope('personal')}
            className={`flex-1 rounded-[10px] py-2 text-xs font-black transition ${
              scope === 'personal' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            👤 {isEnglish ? 'Personal' : 'Peribadi'}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          {([
            { key: 'all', value: null, label: isEnglish ? '🌐 All' : '🌐 Semua' },
            { key: 'bm', value: 1, label: '🇲🇾 BM' },
            { key: 'bi', value: 2, label: '🇬🇧 BI' },
          ] as { key: string; value: 1 | 2 | null; label: string }[]).map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setFilter(o.value)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                filter === o.value
                  ? 'bg-[#1D4ED8] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-[#0F172A] dark:text-slate-400'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2 pt-1">
          {loading && <div className="py-12 text-center text-sm font-bold text-slate-400">Memuatkan markah…</div>}

          {error && !loading && (
            <div className="rounded-[18px] border border-red-500/30 bg-red-500/10 p-4 text-center text-xs">
              <p className="font-bold text-red-500">{error}</p>
              <button type="button" onClick={() => void load()} className="mt-2 rounded-full bg-[#7C3AED] px-4 py-1.5 text-xs font-extrabold text-white">Cuba Lagi</button>
            </div>
          )}

          {!loading && !error && displayedRows.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-white/10">
              <div className="text-3xl">🏆</div>
              <div className="mt-2 font-bold text-slate-600 dark:text-slate-300">
                {isEnglish ? 'No scores yet — be the first!' : 'Tiada markah lagi — jadilah yang pertama!'}
              </div>
            </div>
          )}

          {!loading && !error && displayedRows.map((r, i) => {
            const mine = user?.id && r.user_id === user.id;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-3 rounded-[20px] border p-3.5 shadow-sm transition ${
                  mine ? 'border-[#7C3AED] bg-purple-500/10' : 'border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#0F172A]'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-sm font-black text-white">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                    {r.user_name || 'Pelajar'}{mine ? ' (Anda)' : ''}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {r.latihan_id === 1 ? '🇲🇾 Bahasa Melayu' : '🇬🇧 English'} · {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#7C3AED] text-sm font-black text-white shadow-sm">
                  {r.score ?? '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

