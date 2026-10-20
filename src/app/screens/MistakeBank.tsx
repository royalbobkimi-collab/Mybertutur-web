/** Mistake Bank — rekod kesilapan dari ujian lisan. */
import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../shell';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../i18n';
import { fetchMistakes, type MistakeBankRecord } from '../lib/data';

const MASTERY_LABELS: Record<number, { label: string; color: string }> = {
  0: { label: 'Baru', color: 'text-slate-500 dark:text-slate-400' },
  1: { label: 'Sedang belajar', color: 'text-amber-600 dark:text-amber-400' },
  2: { label: 'Hampir mahir', color: 'text-blue-600 dark:text-blue-400' },
  3: { label: 'Dikuasai', color: 'text-emerald-600 dark:text-emerald-400' },
};

export function MistakeBank() {
  const { user } = useAuth();
  const { t, isEnglish } = useLanguage();
  const [records, setRecords] = useState<MistakeBankRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMasteryHelp, setShowMasteryHelp] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) { setRecords([]); setLoading(false); return; }
    setError(null);
    setLoading(true);
    try {
      setRecords(await fetchMistakes(user.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { void load(); }, [load]);

  return (
    <AppShell
      title={`📝 ${t('drawer.mistakeBank')}`}
      subtitle={isEnglish ? 'Mistakes from oral tests' : 'Kesilapan daripada ujian lisan'}
      activeRoute="/app/settings"
      onBack="/app"
    >
      <div className="space-y-3 pb-6">
        {/* Mastery level help */}
        <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-2.5 dark:bg-white/5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {isEnglish ? 'Mastery levels' : 'Aras penguasaan'}
          </span>
          <button
            type="button"
            onClick={() => setShowMasteryHelp((v) => !v)}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-black text-slate-600 transition hover:bg-slate-300 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
            aria-label={isEnglish ? 'Show mastery level explanations' : 'Tunjuk penerangan aras penguasaan'}
          >
            ?
          </button>
        </div>
        {showMasteryHelp && (
          <div className="rounded-[16px] border border-slate-200 bg-white p-3.5 text-xs shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="font-black text-slate-700 dark:text-slate-300">
              {isEnglish ? 'What do these levels mean?' : 'Apa maksud aras ini?'}
            </div>
            <ul className="mt-2 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-24 font-bold text-slate-500 dark:text-slate-400">Baru</span>
                <span className="text-slate-600 dark:text-slate-300">{isEnglish ? 'Just recorded — not yet reviewed' : 'Baru direkod — belum ditinjau'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-24 font-bold text-amber-600 dark:text-amber-400">Sedang belajar</span>
                <span className="text-slate-600 dark:text-slate-300">{isEnglish ? 'Answered correctly 1 time' : 'Dijawab betul 1 kali'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-24 font-bold text-blue-600 dark:text-blue-400">Hampir mahir</span>
                <span className="text-slate-600 dark:text-slate-300">{isEnglish ? 'Answered correctly 2 times' : 'Dijawab betul 2 kali'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-24 font-bold text-emerald-600 dark:text-emerald-400">Dikuasai</span>
                <span className="text-slate-600 dark:text-slate-300">{isEnglish ? 'Mastered — no longer shown' : 'Dikuasai — tidak dipaparkan lagi'}</span>
              </li>
            </ul>
          </div>
        )}
        {loading && <p className="py-12 text-center text-sm font-bold text-slate-400">Memuatkan…</p>}
        {error && !loading && (
          <div className="rounded-[20px] border border-red-500/30 bg-red-500/10 p-4 text-center text-xs">
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
        {!loading && !error && records.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-white/10">
            <div className="text-3xl">📝</div>
            <div className="mt-2 font-bold text-slate-600 dark:text-slate-300">
              {isEnglish ? 'No mistakes recorded yet.' : 'Tiada kesilapan direkodkan lagi.'}
            </div>
          </div>
        )}
        {!loading && !error && records.map((m) => (
          <div
            key={m.id}
            className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#7C3AED] dark:bg-purple-950/40">
                {m.subject_id === 'bm' ? 'BM' : 'BI'} · {m.category}
              </span>
              <span className={`ml-auto text-[10px] font-bold ${MASTERY_LABELS[m.mastery_level]?.color ?? 'text-slate-400'}`}>
                {MASTERY_LABELS[m.mastery_level]?.label ?? `Lv ${m.mastery_level}`}
              </span>
            </div>
            <p className="mt-2 text-xs">
              <span className="font-bold text-red-500">✕ Ujaran anda:</span> &ldquo;{m.user_answer}&rdquo;
            </p>
            <p className="mt-1 text-xs">
              <span className="font-bold text-emerald-500">✓ Cadangan betul:</span> &ldquo;{m.correct_answer}&rdquo;
            </p>
            {m.ai_explanation && (
              <p className="mt-2 rounded-[14px] bg-slate-50 p-2.5 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
                💡 {m.ai_explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
