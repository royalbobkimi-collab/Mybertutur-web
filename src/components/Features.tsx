import { BookIcon, ChartIcon, MicIcon, SparkIcon, TargetIcon } from './Icons';
import { Reveal } from './Reveal';

/** Key product capabilities, matching the four pillars of the app. */
const FEATURES = [
  {
    icon: SparkIcon,
    title: 'AI Oral Evaluation',
    accent: 'from-brand-500 to-accent-500',
    desc: 'Penilaian sebutan, kelancaran dan tatabahasa secara masa nyata menggunakan Gemini AI. Dapat huraian isi mendalam serta cadangan penambahbaikan serta-merta.',
    bullets: ['Skor 0–100 seketika', 'Maklum balas per-bahagian', 'Kesilapan dikesan automatik'],
  },
  {
    icon: BookIcon,
    title: 'Format Peperiksaan SPM Sebenar',
    accent: 'from-sky-500 to-cyan-400',
    desc: 'Latihan mengikut modul sebenar: Bahasa Melayu (Bahagian A & B) dan Bahasa Inggeris (Part 2, Part 3, KBAT) — lengkap dengan had masa setiap bahagian.',
    bullets: ['Bahagian A · Bacaan', 'Bahagian B · Perbincangan', 'Part 2 / 3 / KBAT'],
  },
  {
    icon: TargetIcon,
    title: 'Practice My Mistakes',
    accent: 'from-rose-500 to-orange-400',
    desc: 'Sistem pintar mengumpul setiap kesilapan anda ke dalam "Mistake Bank" untuk latihan ulangan berfokus — jadi anda sentiasa memperbaiki kelemahan anda.',
    bullets: ['Bank kesilapan peribadi', 'Latihan ulangan pintar', 'Jejaki kemajuan fokus'],
  },
  {
    icon: ChartIcon,
    title: 'Tracker Kemajuan Mingguan',
    accent: 'from-emerald-500 to-teal-400',
    desc: 'Graf aktiviti harian Isnin–Ahad mengikut zon waktu Malaysia (GMT+8), menunjukkan minit latihan anda supaya konsisten setiap minggu.',
    bullets: ['Graf Isnin–Ahad', 'Zon waktu GMT+8', 'Statistik kekal konsisten'],
  },
];

export function Features() {
  return (
    <section id="ciri" className="section">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <SparkIcon size={14} /> Ciri-Ciri Utama
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Semua yang anda perlukan untuk <span className="gradient-text">cemerlang</span> lisan
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Dibina khas untuk pelajar SPM Malaysia, dengan penilaian AI yang ketara, format
          peperiksaan tepat, dan alat untuk kekal konsisten berlatih.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <article className="glass group h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-white shadow-lg`}
              >
                <f.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {f.desc}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {f.bullets.map((b) => (
                  <li
                    key={b}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Subject strip */}
      <Reveal delay={120} className="mt-8">
        <div className="glass flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-5 text-center sm:flex-row sm:gap-6">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Subjek disokong:
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-2 text-sm font-bold text-white">
              <MicIcon size={15} /> Bahasa Melayu
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 px-4 py-2 text-sm font-bold text-brand-700 dark:text-brand-200">
              <MicIcon size={15} /> Bahasa Inggeris
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
