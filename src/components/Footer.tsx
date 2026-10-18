import { Logo } from './Icons';

const PRODUCT_LINKS = [
  { label: 'Ciri-ciri', href: '#ciri' },
  { label: 'Cara Ia Berfungsi', href: '#cara' },
  { label: 'Harga', href: '#harga' },
  { label: 'Soalan Lazim', href: '#faq' },
];

// Exam-module links point at matching landing sections — the interactive app
// lives in the MyBertutur mobile app, so there is deliberately no `/app`
// route on this marketing site (a dead `/app` href only served the SPA
// fallback / a confusing reload).
const EXAM_LINKS = [
  { label: 'Ujian Lisan BM (Bahagian A & B)', href: '#cara' },
  { label: 'Ujian Lisan BI (Part 2 / 3 / KBAT)', href: '#cara' },
  { label: 'Mistake Bank', href: '#ciri' },
  { label: 'Graf Kemajuan', href: '#ciri' },
];

const LEGAL_LINKS: Array<{ label: string; href: string } | { label: string; legal: 'privacy' | 'terms' }> = [
  { label: 'Dasar Privasi', legal: 'privacy' },
  { label: 'Terma Perkhidmatan', legal: 'terms' },
  { label: 'Hubungi Sokongan', href: 'mailto:support@mybertutur.com' },
];

export type LegalKind = 'privacy' | 'terms';

export function Footer({ onOpenLegal }: { onOpenLegal: (kind: LegalKind) => void }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#050810]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="inline-flex items-center gap-2.5">
              <Logo size={32} />
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                My<span className="gradient-text">Bertutur</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Latihan Ujian Lisan SPM berkuasa AI — dinilai masa nyata mengikut format peperiksaan
              sebenar. Dibina untuk pelajar Malaysia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Produk
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam modules */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Modul Peperiksaan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXAM_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Perundangan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  {'href' in l ? (
                    <a
                      href={l.href}
                      className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.(l.legal)}
                      className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} MyBertutur · mybertutur.com · Hak cipta terpelihara.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Dikuasakan Gemini AI · Dibina dengan ❤️ untuk pelajar SPM Malaysia
          </p>
        </div>
      </div>
    </footer>
  );
}