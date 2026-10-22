import { AppShell } from '../shell';
import { useRouter } from '../router';
import { useLanguage } from '../i18n';
import { useTestProgress } from '../hooks';
import { ChevronRightIcon, MicIcon, GlobeIcon, BookOpenIcon } from '../components/Icons';

export function Academy() {
  const { navigate } = useRouter();
  const { isEnglish } = useLanguage();
  const progress = useTestProgress();

  return (
    <AppShell activeRoute="/app/academy">
      <div className="space-y-4 pb-6">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">
              {isEnglish ? 'Subject' : 'Subjek'}
            </h1>
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-black text-[#7C3AED] dark:bg-purple-950/40 dark:text-[#A78BFA]">
              {isEnglish ? 'Focused learning' : 'Pembelajaran Terfokus'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
            {isEnglish ? 'Access resources and launch test sets from one place.' : 'Akses sumber dan mulakan set ujian dari satu tempat.'}
          </p>

          <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[18px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
              <div className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">{progress.percent}%</div>
              <div className="mt-0.5 text-[10px] font-bold text-slate-400">{isEnglish ? 'Progress' : 'Kemajuan'}</div>
            </div>
            <div className="rounded-[18px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
              <div className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">2</div>
              <div className="mt-0.5 text-[10px] font-bold text-slate-400">{isEnglish ? 'Subjects' : 'Subjek'}</div>
            </div>
            <div className="rounded-[18px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
              <div className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">{progress.completedCount}/2</div>
              <div className="mt-0.5 text-[10px] font-bold text-slate-400">{isEnglish ? 'Tests done' : 'Ujian siap'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => navigate('/app/testbm')}
            className="flex w-full items-center justify-between rounded-[24px] border border-slate-200/80 bg-white p-4 text-left shadow-sm transition active:scale-98 dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#7C3AED]/15 text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#A78BFA]">
                <MicIcon size={20} color="#7C3AED" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">
                    {isEnglish ? 'Malay Oral Test (UBBM)' : 'Ujian Lisan BM (UBBM)'}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {isEnglish
                    ? 'Part A & B with instant AI evaluation. Unlimited practice.'
                    : 'Bahagian A & B dengan pemarkahan AI serta-merta. Latihan tanpa had.'}
                </div>
              </div>
            </div>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/testbi')}
            className="flex w-full items-center justify-between rounded-[24px] border border-slate-200/80 bg-white p-4 text-left shadow-sm transition active:scale-98 dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[#7C3AED]/15 text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#A78BFA]">
                <GlobeIcon size={20} color="#7C3AED" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">
                    {isEnglish ? 'English Oral Test (UBBI)' : 'Ujian Lisan BI (UBBI)'}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {isEnglish
                    ? 'Part 1, Part 2, Part 3 & Decision. Unlimited practice.'
                    : 'Part 1, Part 2, Part 3 & Decision. Latihan tanpa had.'}
                </div>
              </div>
            </div>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/library')}
            className="flex w-full items-center justify-between rounded-[24px] border border-slate-200/80 bg-white p-4 text-left shadow-sm transition active:scale-98 dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-blue-500/10 text-[#1D4ED8] dark:bg-blue-950/50 dark:text-[#60A5FA]">
                <BookOpenIcon size={20} color="#1D4ED8" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">{isEnglish ? 'Browse library' : 'Koleksi Peribahasa'}</div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">Koleksi peribahasa dan simpulan bahasa SPM.</div>
              </div>
            </div>
            <ChevronRightIcon size={20} color="#94A3B8" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
