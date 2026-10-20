import { useLanguage } from '../i18n';

export function HeroProgressCard({
  firstName,
  eyebrow,
  welcomeText,
  subtitle,
  totalTests,
  avgPct,
}: {
  firstName: string;
  eyebrow: string;
  welcomeText: string;
  subtitle: string;
  totalTests?: number;
  avgPct?: number;
}) {
  const { isEnglish } = useLanguage();
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
      {/* Decorative Corner Glow Circle */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#1D4ED8]/15 dark:bg-[#1D4ED8]/20" />
      <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7C3AED] dark:text-[#A78BFA]">
        {eyebrow}
      </div>
      <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
        {welcomeText}, {firstName}
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-[#94A3B8]">
        {subtitle}
      </p>
      {totalTests !== undefined && avgPct !== undefined && (
        <div className="mt-3 flex items-center gap-4 rounded-[16px] border border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-white/5 dark:bg-white/5">
          <div className="text-center">
            <div className="text-xs font-black text-slate-500 dark:text-[#94A3B8]">{isEnglish ? 'Semua ujian' : 'Ujian'}</div>
            <div className="text-lg font-black text-slate-900 dark:text-[#F8FAFC]">{totalTests}</div>
          </div>
          <div className="h-10 w-px bg-slate-300 dark:bg-white/10" />
          <div className="text-center">
            <div className="text-xs font-black text-slate-500 dark:text-[#94A3B8]">{isEnglish ? 'Purata' : 'Purata'}</div>
            <div className="text-lg font-black text-slate-900 dark:text-[#F8FAFC]">{avgPct}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
