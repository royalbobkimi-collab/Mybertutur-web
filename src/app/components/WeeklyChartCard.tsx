export function WeeklyChartCard({
  weeklyMinutes,
  isEnglish,
}: {
  weeklyMinutes: number[];
  isEnglish: boolean;
}) {
  const dayLabels = isEnglish
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const total = weeklyMinutes.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
      <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
        ⏱️ ≈ {total} min this week
      </div>
      <div className="mt-3 flex items-end justify-between gap-1.5 pt-2">
        {dayLabels.map((lbl, idx) => {
          const val = weeklyMinutes[idx] ?? 0;
          const isToday = idx === todayIndex;
          const barH = Math.max(8, Math.min(64, (val / 60) * 64));
          return (
            <div key={lbl} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="relative flex h-16 w-full items-end justify-center">
                <div
                  className={`w-3.5 rounded-full transition-all ${
                    isToday
                      ? 'bg-[#7C3AED] ring-2 ring-[#7C3AED]/40'
                      : val > 0
                      ? 'bg-[#7C3AED]'
                      : 'bg-slate-200 dark:bg-white/10'
                  }`}
                  style={{ height: `${barH}px` }}
                />
              </div>
              <span
                className={`text-[10px] font-extrabold ${
                  isToday ? 'text-[#7C3AED]' : 'text-slate-400 dark:text-[#64748B]'
                }`}
              >
                {lbl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
