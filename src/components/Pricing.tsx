import { CheckIcon, SparkIcon } from './Icons';
import { Reveal } from './Reveal';

type Plan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  accent: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

const PLANS: Plan[] = [
  {
    name: 'Percuma',
    price: 'RM0',
    period: 'selamanya',
    tagline: 'Mula berlatih lisan hari ini tanpa sebarang kos.',
    accent: 'from-sky-500 to-cyan-400',
    features: [
      '3 latihan lisan seminggu',
      'Penilaian AI asas (skor 0–100)',
      'Akses Bahagian A & B (BM)',
      'Akses Part 2, 3 & KBAT (BI)',
      'Graf kemajuan mingguan',
    ],
    cta: 'Cuba Percuma',
  },
  {
    name: 'Premium',
    price: 'RM9',
    period: 'sebulan',
    tagline: 'Untuk pelajar serius yang menyasarkan A+ dalam SPM.',
    accent: 'from-brand-600 to-accent-600',
    highlight: true,
    badge: 'Paling Popular',
    features: [
      'Latihan lisan TANPA HAD',
      'Penilaian AI penuh + huraian isi mendalam',
      'Mistake Bank + latihan ulangan pintar',
      'Maklum balas terperinci setiap bahagian',
      'Simpan sejarah & jejak kemajuan penuh',
      'Prioriti pemprosesan (lebih pantas)',
      'Sokongan pelanggan keutamaan',
    ],
    cta: 'Mulakan Percubaan 7 Hari',
  },
  {
    name: 'Sekolah',
    price: 'RM49',
    period: 'sebulan / kelas',
    tagline: 'Untuk guru & sekolah melatih satu kelas sekaligus.',
    accent: 'from-emerald-500 to-teal-400',
    features: [
      'Semua ciri Premium',
      'Sehingga 40 pelajar setiap kelas',
      'Papan pemuka guru (kelas)',
      'Laporan kemajuan setiap pelajar',
      'Eksport data & laporan PDF',
      'Latihan mengikut sukatan KSSM',
    ],
    cta: 'Hubungi Kami',
  },
];

export function Pricing({ onOpenAuth }: { onOpenAuth: (mode: 'signup') => void }) {
  return (
    <section id="harga" className="section">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">
          <SparkIcon size={14} /> Harga
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Berpatutan untuk setiap <span className="gradient-text">pelajar</span>
        </h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Mulakan secara percuma. Naik taraf apabila anda bersedia untuk pergi lebih jauh — tiada
          kontrak tersembunyi, batalkan bila-bila masa.
        </p>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 100} className="h-full">
            <article
              className={`glass relative flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                p.highlight
                  ? 'border-brand-500/50 shadow-glow lg:scale-[1.03]'
                  : 'hover:shadow-card'
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  {p.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{p.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="gradient-text text-4xl font-extrabold tracking-tight">
                  {p.price}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">/ {p.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${p.accent} text-white`}
                    >
                      <CheckIcon size={12} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onOpenAuth('signup')}
                className={p.highlight ? 'btn-primary mt-8 w-full' : 'btn-ghost mt-8 w-full'}
              >
                {p.cta}
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          💳 Pembayaran selamat via FPX, kad kredit & e-wallet · Harga termasuk SST · Pelajar
          sekolah kerajaan layari percuma melalui program digital KPM.
        </p>
      </Reveal>
    </section>
  );
}