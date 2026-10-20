import { useRouter } from '../app/router';
import { Reveal } from './Reveal';
import { ArrowRightIcon, CheckIcon, SparkIcon } from './Icons';

export function AppOnWeb() {
  const { navigate } = useRouter();

  const BULLETS = [
    {
      title: 'Ujian Lisan BM & BI',
      desc: 'Modul lengkap format SPM sebenar: Bahagian A & B (BM) serta Part 2, Part 3 & KBAT (BI).',
    },
    {
      title: 'Penilaian AI serta-merta',
      desc: 'Dikuasakan Gemini AI dengan markah sebutan, kelancaran, tatabahasa dan maklum balas mendalam.',
    },
    {
      title: 'Mistake Bank & Graf Kemajuan',
      desc: 'Kumpul kesilapan bertutur untuk latih tubi pintar serta graf kemajuan mingguan.',
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-slate-200/80 bg-slate-50/70 py-20 dark:border-white/10 dark:bg-[#070c1c]/70 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">
                <SparkIcon size={14} /> Akses Terus Tanpa Muat Turun
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                MyBertutur App, <span className="gradient-text">Kini di Web</span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Gunakan modul latihan lisan SPM terus dari pelayar web anda — tanpa perlu memuat turun aplikasi.
              </p>
            </Reveal>

            <div className="mt-8 space-y-3.5">
              {BULLETS.map((b, idx) => (
                <Reveal key={b.title} delay={200 + idx * 80}>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <CheckIcon size={14} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{b.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Butang Besar Mula Sekarang */}
            <Reveal delay={480} className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/app/academy')}
                className="btn-primary w-full !py-4 text-base font-extrabold shadow-glow sm:w-auto sm:!px-10"
              >
                Mula Sekarang (Percuma di Web) <ArrowRightIcon size={20} />
              </button>
            </Reveal>

            {/* Dua Kad Pautan Terus */}
            <Reveal delay={540} className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate('/app/testbm')}
                  className="glass group flex items-center justify-between rounded-2xl p-4 text-left transition hover:border-violet-500 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 text-lg text-violet-600">
                      🎤
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Pautan Terus</div>
                      <div className="text-sm font-extrabold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        Ujian Lisan BM →
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/app/testbi')}
                  className="glass group flex items-center justify-between rounded-2xl p-4 text-left transition hover:border-sky-500 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600/10 text-lg text-sky-600">
                      🌍
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Pautan Terus</div>
                      <div className="text-sm font-extrabold text-slate-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
                        Ujian Lisan BI →
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Mockup Skrin App (Skor 88) */}
          <div className="lg:col-span-5">
            <Reveal delay={240} className="relative mx-auto w-full max-w-sm">
              <div className="relative rounded-[2.5rem] border-4 border-slate-800 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#0c1122]">
                {/* Header bingkai: label contoh & speaker */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                    Contoh paparan
                  </span>
                  <div className="h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    Live Web
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-sm font-black text-white">M</span>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">MyBertutur Web App</div>
                      <div className="text-[10px] text-slate-400">Format SPM Sebenar</div>
                    </div>
                  </div>
                </div>

                {/* Score 88 Display */}
                <div className="mt-4 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-transparent p-4 text-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                    Skor Lisan AI
                  </span>
                  <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500 bg-white shadow-md dark:bg-slate-900">
                    <div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">88</div>
                      <div className="text-[9px] text-slate-400">/100</div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Cemerlang (Penilaian AI)
                  </div>
                </div>

                {/* Breakdown Metrics */}
                <div className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-white/10 dark:bg-white/5">
                  {[
                    { label: 'Sebutan', val: 92, color: 'bg-emerald-500' },
                    { label: 'Kelancaran', val: 85, color: 'bg-blue-500' },
                    { label: 'Tatabahasa', val: 88, color: 'bg-violet-500' },
                  ].map((m) => (
                    <div key={m.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-600 dark:text-slate-300">{m.label}</span>
                        <span className="text-slate-900 dark:text-white">{m.val}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-600 px-3.5 py-2.5 text-white">
                  <span className="text-xs font-extrabold">🎤 Ujian Lisan BM &amp; BI</span>
                  <span className="text-[10px] font-bold text-violet-200">05:00 HAD MASA</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
