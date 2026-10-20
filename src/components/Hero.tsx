import { ArrowRightIcon, CheckIcon, MicIcon, PlayIcon, SparkIcon } from './Icons';
import { Reveal } from './Reveal';
import { useRouter } from '../app/router';

const STATS = [
  { value: 'RM0', label: 'Sepenuhnya Percuma' },
  { value: 'BM & BI', label: 'Format SPM Sebenar' },
  { value: 'AI', label: 'Penilaian Masa Nyata' },
];

export function Hero({ onOpenAuth }: { onOpenAuth?: (mode: 'signup') => void }) {
  void onOpenAuth;
  const { navigate } = useRouter();
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-500/30 via-accent-500/20 to-sky-400/20 blur-3xl dark:from-brand-600/25 dark:via-accent-600/20 dark:to-sky-500/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl dark:bg-accent-600/15"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:gap-8">
        <div className="max-w-xl">
          <Reveal>
            <span className="eyebrow">
              <SparkIcon size={14} /> Dikuasakan Gemini AI
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Kuasai <span className="gradient-text">Ujian Lisan SPM</span> dengan
              Bimbingan AI Pintar
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Penilaian{' '}
              <strong className="text-slate-800 dark:text-white">masa nyata</strong> untuk
              Ujian Lisan Bahasa Melayu (Bahagian A &amp; B) dan Bahasa Inggeris (Part 2,
              Part 3, KBAT). Dapat markah sebutan, kelancaran, tatabahasa serta maklum
              balas terperinci — serta-merta selepas anda bersalah ujar.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/app/academy')}
                className="btn-primary text-base font-extrabold"
              >
                Guna App di Web (Percuma) <ArrowRightIcon size={18} />
              </button>
              <a href="#cara" className="btn-ghost text-base">
                <PlayIcon size={16} /> Lihat Cara Berfungsi
              </a>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              ⚡ Tiada muat turun. Buka terus dari pelayar web anda.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              {[
                'Tiada kad kredit diperlukan',
                'Format SPM sebenar',
                'Maklum balas AI serta-merta',
              ].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckIcon size={15} className="text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={400}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {s.value}
                  </dt>
                  <dd className="text-xs text-slate-500 dark:text-slate-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <PhoneMockup />
          <FloatingScore />
        </Reveal>
      </div>
    </section>
  );
}

/** Days of the week for the mini progress chart (Isnin–Ahad). */
const WEEK = ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah'];
/** Sample minutes-practiced per day for the mockup chart. */
const WEEK_BARS = [12, 30, 0, 45, 18, 52, 25];
const MAX_MIN = 60;

/** Floating score card that overlays the phone mockup. */
function FloatingScore() {
  return (
    <div className="absolute -left-4 bottom-24 z-20 w-44 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#0d1226]/95 sm:-left-10">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-extrabold text-white">
          88
        </span>
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-white">Skor Lisan AI</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Bahagian A · Bacaan</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          ['Sebutan', 92],
          ['Kelancaran', 85],
          ['Tatabahasa', 88],
        ].map(([label, val]) => (
          <div key={label as string} className="flex items-center gap-2">
            <span className="w-14 text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                style={{ width: `${val}%` }}
              />
            </div>
            <span className="w-6 text-right text-[10px] font-bold text-slate-700 dark:text-slate-200">
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * High-fidelity phone mockup showing the AI oral-test screen plus the weekly
 * progress chart. Purely decorative (aria-hidden) — it communicates the
 * product at a glance without needing a screenshot asset.
 */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[340px]">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-brand-500/30 via-accent-500/20 to-sky-400/20 blur-2xl"
      />
      <div className="relative rounded-[2.6rem] border border-slate-300/70 bg-slate-900 p-2.5 shadow-2xl ring-1 ring-black/10 dark:border-white/15">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-white dark:bg-[#070b18]">
          {/* Status bar + notch */}
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-black" />
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Mikrofon Aktif</span>
            </div>
          </div>

          <div className="space-y-4 px-5 pb-6 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                  Ujian Lisan
                </p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Bahagian A · Bacaan
                </h3>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <MicIcon size={16} />
              </span>
            </div>

            {/* Waveform + timer */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-4 text-white">
              <div className="flex items-end justify-center gap-1">
                {[10, 22, 34, 16, 40, 26, 46, 18, 30, 12, 36, 20].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-white/85"
                    style={{ height: h }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold tabular-nums">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                MERAKAM · 01:24
              </div>
            </div>

            {/* Live AI scorecard */}
            <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Markah AI Langsung
                </p>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Baik
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  ['Sebutan', 92],
                  ['Kelancaran', 85],
                  ['Tatabahasa', 88],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <span className="w-16 text-[10px] text-slate-500 dark:text-slate-400">
                      {label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-[10px] font-bold text-slate-700 dark:text-slate-200">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly progress tracker */}
            <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Aktiviti Mingguan
                </p>
                <span className="text-[10px] text-slate-400">GMT+8</span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-1.5">
                {WEEK.map((d, i) => {
                  const min = WEEK_BARS[i];
                  const h = Math.max(6, Math.round((min / MAX_MIN) * 56));
                  const active = min > 0;
                  return (
                    <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex h-14 w-full items-end">
                        <div
                          className={`w-full rounded-md ${
                            active
                              ? 'bg-gradient-to-t from-brand-500 to-accent-400'
                              : 'bg-slate-200 dark:bg-white/10'
                          }`}
                          style={{ height: active ? h : 6 }}
                        />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400">{d}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
