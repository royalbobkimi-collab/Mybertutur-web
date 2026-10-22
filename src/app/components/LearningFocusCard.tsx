import { useRouter } from '../router';

type CategoryTally = { category: string; count: number };

export function LearningFocusCard({
  tallies,
  totalMistakes,
}: {
  tallies: CategoryTally[];
  totalMistakes: number;
}) {
  const { navigate } = useRouter();
  const topCategory = tallies[0]?.category || null;

  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">
          Your Learning Focus
        </h3>
        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-black text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300">
          {totalMistakes} mistakes
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">
        Your AI coach grouped your mistakes so you can fix them faster.
      </p>

      {tallies.length > 0 ? (
        <div className="mt-3 divide-y divide-slate-100 dark:divide-white/5">
          {tallies.slice(0, 4).map((tally, idx) => {
            const dots = ['🔴', '🟠', '🔵', '🟣'];
            return (
              <div key={tally.category} className="flex items-center justify-between py-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span>{dots[idx % dots.length]}</span>
                  <span className="text-slate-800 dark:text-[#F8FAFC]">{tally.category}</span>
                </div>
                <span className="font-extrabold text-[#7C3AED]">{tally.count} mistakes</span>
              </div>
            );
          })}
          {tallies.length > 4 && (
            <div className="pt-2 text-center text-[11px] font-bold text-slate-400">
              +{tallies.length - 4} more categories
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
          ✨ Tiada kesilapan direkodkan lagi. Selesai satu ujian untuk mula mengesan kelemahan!
        </div>
      )}

      {/* AI Coach Box */}
      <div className="mt-3.5 rounded-[18px] border border-blue-500/25 bg-blue-500/5 p-3.5 dark:bg-blue-950/20">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#1D4ED8] text-xs font-black text-white">
            🤖
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              AI Coach
            </div>
            {topCategory && (
              <div className="text-[10px] font-bold text-[#1D4ED8] dark:text-blue-300">
                Fokus: {topCategory}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs italic leading-relaxed text-slate-600 dark:text-slate-300">
          {topCategory
            ? `“Saya nampak anda masih ada ruang untuk memantapkan ${topCategory}. Teruskan latihan ringkas hari ini!”`
            : '“Ambil masa 5 minit untuk berlatih bercakap setiap hari bagi membina keyakinan lisan.”'}
        </p>
      </div>

      {/* Button: 🔥 Practise My Mistakes */}
      <button
        type="button"
        onClick={() => navigate('/app/mistake-bank')}
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#7C3AED] py-3.5 text-center text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(124,58,237,0.4)] transition active:scale-98"
      >
        <span>🔥</span>
        <span>Practise My Mistakes</span>
      </button>
    </div>
  );
}
