/** Library — cari + tapis koleksi peribahasa / kosa kata. */
import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../shell';
import { useLanguage } from '../i18n';
import { libraryData, type LibraryCategory } from '../data/libraryData';
import { fetchWordBankRows } from '../lib/data';

const ALL_CATS: LibraryCategory[] = [
  'Peribahasa', 'Simpulan Bahasa', 'Penjodoh Bilangan',
  'Tatabahasa', 'Vocab BI', 'Umum', 'Sosial', 'Pendidikan',
  'Perniagaan', 'Teknologi', 'Alam Sekitar', 'Sastera', 'Seni', 'Sains', 'Profesional',
];

export function Library() {
  const { isEnglish } = useLanguage();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<LibraryCategory | 'Semua'>('Semua');
  const [extra, setExtra] = useState<typeof libraryData>([]);

  useEffect(() => {
    let on = true;
    void fetchWordBankRows()
      .then((rows) => {
        if (!on) return;
        const mapped = rows.slice(0, 500).map((r, i) => {
          const o = r as Record<string, unknown>;
          const str = (k: string) => (typeof o[k] === 'string' ? (o[k] as string) : '');
          const c = str('category');
          return {
            id: `wb-${i}`,
            category: (ALL_CATS.includes(c as LibraryCategory) ? c : 'Umum') as LibraryCategory,
            title: str('title') || str('word') || str('term'),
            meaning: str('meaning') || str('definition') || str('maksud'),
            example: str('example') || str('contoh'),
          };
        }).filter((e) => e.title);
        setExtra(mapped);
      })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  const items = useMemo(() => {
    const all = [...extra, ...libraryData];
    const q = query.trim().toLowerCase();
    const seen = new Set<string>();
    return all.filter((e) => {
      if (cat !== 'Semua' && e.category !== cat) return false;
      if (q && !`${e.title} ${e.meaning} ${e.example}`.toLowerCase().includes(q)) return false;
      const key = `${e.category}:${e.title.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 300);
  }, [query, cat, extra]);

  return (
    <AppShell title={isEnglish ? 'Library' : 'Perpustakaan'} subtitle={isEnglish ? 'Proverbs, idioms & vocabulary' : 'Peribahasa, simpulan bahasa & kosa kata'} activeRoute="/app/academy" onBack="/app/academy">
      <div className="flex items-center gap-2 rounded-[20px] border border-slate-200/80 bg-white px-3.5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
        <span>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isEnglish ? 'Search…' : 'Cari perkataan / peribahasa…'}
          className="h-12 flex-1 bg-transparent text-base outline-none dark:text-white"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        )}
      </div>

      <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1">
        {(['Semua', ...ALL_CATS] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
              cat === c
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0F172A] dark:text-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs font-bold text-slate-400">{items.length} entri</p>
      <div className="mt-2 space-y-2.5 pb-6">
        {items.map((e) => (
          <div
            key={e.id}
            className="rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#7C3AED] dark:bg-purple-950/40">
                {e.category}
              </span>
              {e.type && <span className="text-[10px] font-bold text-slate-400">{e.type}</span>}
            </div>
            <h3 className="mt-2 text-base font-black text-slate-900 dark:text-[#F8FAFC]">{e.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{e.meaning}</p>
            {e.example && (
              <p className="mt-2 rounded-[12px] bg-slate-50 p-2 text-xs italic text-slate-500 dark:bg-white/5 dark:text-slate-400">
                “{e.example}”
              </p>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="py-12 text-center text-xs font-bold text-slate-400">Tiada hasil ditemui.</p>}
      </div>
    </AppShell>
  );
}
