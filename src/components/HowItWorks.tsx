import { BookIcon, ChartIcon, MicIcon, SparkIcon } from './Icons';
import { Reveal } from './Reveal';

const STEPS = [
  {
    icon: BookIcon,
    tag: 'Langkah 1',
    title: 'Pilih Subjek & Bahagian',
    desc: 'Pilih Bahasa Melayu (Bahagian A Bacaan / Bahagian B Perbincangan) atau Bahasa Inggeris (Part 2, Part 3, KBAT) mengikut modul SPM sebenar.',
  },
  {
    icon: MicIcon,
    tag: 'Langkah 2',
    title: 'Rakam Jawapan Lisan',
    desc: 'Bercakap seperti dalam peperiksaan sebenar dengan pemasa setiap bahagian. Anda boleh rakam dan dengar semula jawapan anda.',
  },
  {
    icon: SparkIcon,
    tag: 'Langkah 3',
    title: 'AI Nilai Serta-Merta',
    desc: 'Gemini AI menilai sebutan, kelancaran dan tatabahasa, mengesan kesilapan, lalu memberi cadangan penambahbaikan yang spesifik.',
  },
  {
    icon: ChartIcon,
    tag: 'Langkah 4',
    title: 'Jejaki & Perbaiki',
    desc: 'Setiap kesilapan disimpan ke Mistake Bank untuk latihan berfokus, sementara graf mingguan GMT+8 menunjukkan konsistensi anda.',
  },
];

export function HowItWorks() {
  return (
    <section id="cara" className="section">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <SparkIcon size={14} /> Cara Ia Berfungsi
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Empat langkah mudah menuju <span className="gradient-text">markah cemerlang</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Dari memilih soalan hingga memperbaiki kelemahan — keseluruhan aliran direka supaya
          tumpuan anda hanya pada satu perkara: menjadi lebih baik setiap hari.
        </p>
      </Reveal>

      <div className="relative mt-16">
        {/* Connecting line (desktop only) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent lg:block"
        />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 110}>
                <div className="glass group relative h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-lg">
                        <s.icon size={26} />
                      </div>
                      <span className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white dark:bg-white dark:text-slate-900">
                        {i + 1}
                      </span>
                    </div>
                    <span className="mt-5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
                      {s.tag}
                    </span>
                    <h3 className="mt-1.5 text-lg font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
