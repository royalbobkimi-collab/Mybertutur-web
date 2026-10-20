import { useEffect, useState } from 'react';
import { AppShell } from '../shell';
import { useRouter } from '../router';
import { useLanguage } from '../i18n';
import { useAuth } from '../../context/AuthContext';
import { useTestProgress } from '../hooks';
import { getTestResults, fetchUnmasteredMistakes, fetchDailyTestStatus, type DailyTestStatus } from '../lib/data';
import { ChevronRightIcon, BookOpenIcon, CloseIcon } from '../components/Icons';
import { LearningFocusCard } from '../components/LearningFocusCard';
import { WeeklyChartCard } from '../components/WeeklyChartCard';
import { TestProgressCard } from '../components/TestProgressCard';
import { HeroProgressCard } from '../components/HeroProgressCard';

type CategoryTally = { category: string; count: number };

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome|CriOS/.test(ua) && !(window.navigator as any).standalone;
}

export function Dashboard() {
  const { navigate } = useRouter();
  const { t, isEnglish } = useLanguage();
  const { user } = useAuth();
  const progress = useTestProgress();

  const [stats, setStats] = useState({ loading: false, count: 0, avg: null as number | null });
  const [tallies, setTallies] = useState<CategoryTally[]>([]);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showPwaTip, setShowPwaTip] = useState(false);
  const [dailyStatus, setDailyStatus] = useState<DailyTestStatus | null>(null);

  useEffect(() => {
    setShowPwaTip(isIosSafari());
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    setStats((s) => ({ ...s, loading: true }));

    void fetchDailyTestStatus(user.id)
      .then((st) => { if (active) setDailyStatus(st); })
      .catch((err) => console.warn('[dashboard] daily limit error:', err));

    void getTestResults(user.id)
      .then((rows) => {
        if (!active) return;
        const avg = rows.length ? Math.round(rows.reduce((a, r) => a + r.overall_score, 0) / rows.length) : null;
        setStats({ loading: false, count: rows.length, avg });
      })
      .catch(() => { if (active) setStats({ loading: false, count: 0, avg: null }); });

    void fetchUnmasteredMistakes(user.id)
      .then((records) => {
        if (!active) return;
        const byCat = new Map<string, number>();
        for (const m of records) {
          const k = (m.category ?? '').trim();
          if (k) byCat.set(k, (byCat.get(k) ?? 0) + 1);
        }
        setTallies(Array.from(byCat.entries()).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count));
        setTotalMistakes(records.length);
      })
      .catch(() => {});

    return () => { active = false; };
  }, [user?.id]);

  const name = (user?.user_metadata?.full_name as string) || (user?.email ? user.email.split('@')[0] : '') || 'Pelajar';
  const first = name.split(' ')[0] || 'Pelajar';
  const avgPct = stats.avg == null ? null : Math.max(0, Math.min(100, stats.avg));

  return (
    <AppShell activeRoute="/app">
      <div className="space-y-3.5 pb-6">
        {showPwaTip && (
          <div className="flex items-center justify-between rounded-[18px] border border-blue-200 bg-blue-50/90 p-3 text-xs text-blue-900 dark:border-blue-800/40 dark:bg-blue-950/40 dark:text-blue-200">
            <div className="flex-1 pr-2">
              <span className="font-bold">📱 Tambah ke Skrin Utama:</span> Ketik Share &gt; &apos;Add to Home Screen&apos;.
            </div>
            <button type="button" onClick={() => setShowPwaTip(false)} className="rounded-lg p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-300">
              <CloseIcon size={16} />
            </button>
          </div>
        )}

        <HeroProgressCard
          firstName={first}
          eyebrow={t('home.eyebrow') || 'PROGRESS ANALYSIS'}
          welcomeText={t('home.title') || 'Welcome back'}
          subtitle={t('home.subtitle') || 'Practice speaking daily and track your improvement.'}
          totalTests={stats.count}
          avgPct={avgPct ?? undefined}
        />

        {/* Status Had Ujian Harian SPM (UBBM & UBBI) — Reset Tengah Malam Malaysia */}
        <div className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {isEnglish ? 'DAILY SPM ALLOWANCE' : 'KUOTA UJIAN HARIAN SPM'}
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              Reset 12:00 AM MYT
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/app/testbm')}
              className="flex items-center justify-between rounded-[16px] border border-slate-100 bg-slate-50/80 p-3 text-left transition hover:border-purple-300 dark:border-white/5 dark:bg-white/5"
            >
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-[#F8FAFC]">
                  UBBM (Bahasa Melayu)
                </div>
                <div className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {dailyStatus?.bmDone ? 'Selesai hari ini' : '1 ujian tersedia'}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  dailyStatus?.bmDone
                    ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {dailyStatus?.bmDone ? '0/1' : '1/1'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/app/testbi')}
              className="flex items-center justify-between rounded-[16px] border border-slate-100 bg-slate-50/80 p-3 text-left transition hover:border-purple-300 dark:border-white/5 dark:bg-white/5"
            >
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-[#F8FAFC]">
                  UBBI (English)
                </div>
                <div className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {dailyStatus?.biDone ? 'Selesai hari ini' : '1 ujian tersedia'}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  dailyStatus?.biDone
                    ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {dailyStatus?.biDone ? '0/1' : '1/1'}
              </span>
            </button>
          </div>
        </div>

        {/* FIX: 24 ujian & 64% actual progress from query (useTestProgress hook). */}
        <TestProgressCard
          count={stats.count}
          avgPct={avgPct}
          loading={stats.loading}
          title={t('home.progressTitle') || 'Test Progress'}
          labelCompleted={t('home.completedTests') || 'Tests completed'}
          labelAverage={t('home.averageScore') || 'Average score'}
        />

        <WeeklyChartCard weeklyMinutes={progress.weeklyMinutes} isEnglish={isEnglish} />

        <LearningFocusCard tallies={tallies} totalMistakes={totalMistakes} />

        <button
          type="button"
          onClick={() => navigate('/app/library')}
          className="flex w-full items-center justify-between rounded-[24px] border border-slate-200/80 bg-white p-4 text-left shadow-sm transition active:scale-98 dark:border-white/10 dark:bg-[#0F172A]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#DBEAFE] text-xl text-[#1D4ED8] dark:bg-blue-950/40">
              <BookOpenIcon size={20} color="#1D4ED8" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#7C3AED] dark:text-[#A78BFA]">
                FEATURED LIBRARY
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">
                Peribahasa &amp; Kosa Kata
              </div>
              <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Koleksi rujukan lisan SPM lengkap
              </div>
            </div>
          </div>
          <ChevronRightIcon size={20} color="#94A3B8" />
        </button>

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">Word Bank</span>
          <button
            type="button"
            onClick={() => navigate('/app/library')}
            className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-extrabold text-[#1D4ED8] dark:bg-blue-950/40 dark:text-[#60A5FA]"
          >
            See all →
          </button>
        </div>
      </div>
    </AppShell>
  );
}

