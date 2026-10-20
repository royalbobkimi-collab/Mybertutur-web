export function TestProgressCard({
  count,
  avgPct,
  loading,
  title,
  labelCompleted,
  labelAverage,
}: {
  count: number;
  avgPct: number | null;
  loading: boolean;
  title: string;
  labelCompleted: string;
  labelAverage: string;
}) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
      <h2 className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">
        {title}
      </h2>
      <div className="mt-3.5 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-500 dark:text-[#94A3B8]">
            {labelCompleted}
          </div>
          <div className="mt-1 text-3xl font-black text-slate-900 dark:text-[#F8FAFC]">
            {loading ? '…' : count}
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-white/10"
            />
            {avgPct != null && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - avgPct / 100)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            )}
          </svg>
          <div className="absolute text-center">
            <div className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">
              {loading ? '…' : avgPct == null ? '—' : `${avgPct}%`}
            </div>
            <div className="text-[9px] font-bold text-slate-400">
              {labelAverage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
