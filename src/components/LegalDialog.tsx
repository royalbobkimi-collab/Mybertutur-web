import { useEffect } from 'react';
import type { LegalKind } from './Footer';
import { CloseIcon } from './Icons';

const LEGAL_COPY: Record<LegalKind, { title: string; body: string[] }> = {
  privacy: {
    title: 'Dasar Privasi',
    body: [
      'MyBertutur menyimpan data akaun anda (email dan nama) dan rekod latihan anda di Supabase supaya kemajuan anda kekal merentas peranti.',
      'Rakaman audio hanya digunakan untuk menjana penilaian AI anda dan tidak dikongsi dengan pihak ketiga.',
      'Anda boleh meminta pemadaman data dengan menghubungi support@mybertutur.com.',
    ],
  },
  terms: {
    title: 'Terma Perkhidmatan',
    body: [
      'MyBertutur ialah alat latihan pendidikan; markah AI adalah panduan pembelajaran, bukan markah peperiksaan rasmi.',
      'Jangan kongsi kata laluan anda. Anda bertanggungjawab ke atas kandungan yang anda muat naik.',
      'Pelan percuma tertakluk pada had latihan mingguan seperti yang dipaparkan pada halaman harga.',
    ],
  },
};

/** Simple modal for privacy / terms — previously these footer links went nowhere (`href="#"`). */
export function LegalDialog({
  kind,
  onClose,
}: {
  kind: LegalKind | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (kind) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [kind, onClose]);

  if (!kind) return null;
  const copy = LEGAL_COPY[kind];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-[#0d1226]">
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <CloseIcon size={18} />
        </button>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {copy.title}
        </h2>
        <div className="mt-4 space-y-3">
          {copy.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
