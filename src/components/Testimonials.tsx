import { QuoteIcon, SparkIcon, StarIcon } from './Icons';
import { Reveal } from './Reveal';

const TESTIMONIALS = [
  {
    name: 'Nur Aina',
    role: 'Calon SPM 2026 · BM',
    quote:
      'Dulu saya takut salah ujar depan cikgu. Dengan MyBertutur, saya boleh latih berkali-kali dan nampak sendiri markah saya naik dari 55 ke 82 untuk Bahagian A!',
    accent: 'from-brand-500 to-accent-600',
  },
  {
    name: 'Daniel Lim',
    role: 'Calon SPM 2026 · BI',
    quote:
      'Bahagian KBAT paling menyusahkan. Maklum balas AI beri contoh ayat lebih matang dan tunjuk silap tatabahasa saya secara langsung. Sangat membantu!',
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    name: 'Farah Haziqah',
    role: 'Guru Sains Sosial',
    quote:
      'Saya cadangkan kepada pelajar saya supaya berlatih setiap minggu. Graf kemajuan GMT+8 memudahkan saya pantau konsistensi mereka dari rumah.',
    accent: 'from-emerald-500 to-teal-400',
  },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="section">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <SparkIcon size={14} /> Testimoni Pelajar
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Dipercayai <span className="gradient-text">pelajar & guru</span> di seluruh Malaysia
        </h2>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size={16} />
            ))}
          </span>
          4.8 / 5 daripada lebih 12,000 pelajar
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 110}>
            <figure className="glass flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <QuoteIcon size={26} className="text-brand-500/50" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-sm font-extrabold text-white`}
                >
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
