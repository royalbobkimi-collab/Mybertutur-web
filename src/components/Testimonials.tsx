import { QuoteIcon, SparkIcon } from './Icons';
import { Reveal } from './Reveal';

/**
 * User reviews section.
 *
 * Deliberately shows a clean empty state: MyBertutur has no genuine user
 * reviews yet, and fabricating names, ratings or quotations would
 * misrepresent the product. When real, validated reviews exist they can be
 * rendered here (ideally fetched from a database with moderation) without
 * changing the section layout.
 */
export function Reviews() {
  return (
    <section id="ulasan" className="section">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <SparkIcon size={14} /> Ulasan Pengguna
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Apa kata <span className="gradient-text">pengguna</span>
        </h2>
      </Reveal>

      <Reveal delay={100}>
        <div className="glass mx-auto mt-12 flex max-w-2xl flex-col items-center rounded-3xl p-10 text-center">
          <QuoteIcon size={26} className="text-brand-500/50" />
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Ulasan pengguna akan dipaparkan di sini.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
