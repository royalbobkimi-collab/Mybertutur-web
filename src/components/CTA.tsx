import { ArrowRightIcon, MicIcon } from './Icons';
import { Reveal } from './Reveal';

/** Final conversion banner before the footer. */
export function CTA({ onOpenAuth }: { onOpenAuth: (mode: 'signup') => void }) {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-8 py-16 text-center shadow-glow sm:px-16 sm:py-20">
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl"
          />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <MicIcon size={30} className="text-white" />
            </div>

            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Bersedia untuk cemerlang dalam Ujian Lisan SPM?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              MyBertutur percuma sepenuhnya untuk semua pelajar — daftar dan mula berlatih dalam
              beberapa saat. Tiada kad kredit diperlukan.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => onOpenAuth('signup')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-brand-700 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-slate-50 active:scale-100 sm:w-auto"
              >
                Mula Latihan Percuma <ArrowRightIcon size={18} />
              </button>
              <a
                href="#ciri"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/10 sm:w-auto"
              >
                Ketahui Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}