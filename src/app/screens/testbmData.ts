/**
 * Ujian Lisan BM — set soalan "1 teks bacaan + Soalan 1-4" setiap bahagian.
 *
 * STRUKTUR DATA SEMENTARA (Langkah 1): soalan masih hardcoded kerana TIADA
 * jadual soalan di Supabase (disahkan: app + web dua-dua hardcoded selama ini).
 * Bentuk di bawah direka supaya sebutir set boleh diganti dengan fetch Supabase
 * kemudian TANPA mengubah UI: setiap bahagian = satu teks bacaan + 4 soalan.
 * Tuan akan bekalkan data sebenar; cuma isi medan reading/questions.
 */
export const BM_LATIHAN_ID = 1;
export const MIN_RECORD_SECONDS = 3;
/** Had masa rakaman BM: 5 minit (spec Langkah 1). */
export const BM_TIME_LIMIT_SECONDS = 5 * 60;

export const SECTIONS = ['Bahagian A (Membaca)', 'Bahagian B (Perbincangan)'] as const;
export type SectionKey = (typeof SECTIONS)[number];

/** Satu soalan individu (Soalan 1-4). */
export type BmQuestion = { n: number; text: string };
/** Satu set bahagian: teks/tema bacaan + 4 soalan. */
export type BmSectionSet = { readingTitle: string; reading: string; questions: BmQuestion[] };
/** Keserasian lama: topik tunggal (title + prompt). */
export type SampleQuestion = { title: string; prompt: string };

const q = (n: number, text: string): BmQuestion => ({ n, text });

export const SECTION_SETS: Record<SectionKey, BmSectionSet> = {
  'Bahagian A (Membaca)': {
    readingTitle: 'Peranan Belia dalam Memajukan Negara',
    reading:
      'Belia merupakan aset penting negara. Mereka bukan sahaja pewaris kepimpinan masa depan, ' +
      'malah penggerak utama dalam bidang pendidikan, teknologi dan pembangunan masyarakat. ' +
      'Baca petikan ini dengan intonasi, sebutan dan kelancaran yang betul sebelum menjawab soalan-soalan berikut.',
    questions: [
      q(1, 'Huraikan peranan belia dalam memajukan negara.'),
      q(2, 'Bagaimanakah belia boleh memberi sumbangan positif kepada masyarakat?'),
      q(3, 'Apakah cabaran utama yang dihadapi oleh belia pada masa kini?'),
      q(4, 'Cadangkan langkah-langkah untuk memupuk semangat kepimpinan dalam kalangan belia.'),
    ],
  },
  'Bahagian B (Perbincangan)': {
    readingTitle: 'Isu Alam Sekitar di Malaysia',
    reading:
      'Pencemaran alam sekitar semakin membimbangkan. Sungai tercemar, pembuangan sampah haram ' +
      'dan perubahan iklim menjejaskan kehidupan seharian. Setiap rakyat memainkan peranan ' +
      'dalam menjaga kelestarian alam. Bincangkan tema ini berpandukan soalan-soalan berikut.',
    questions: [
      q(1, 'Bincangkan cabaran utama alam sekitar di Malaysia.'),
      q(2, 'Apakah punca utama pencemaran alam sekitar di negara kita?'),
      q(3, 'Cadangkan tiga langkah praktikal yang boleh diambil oleh rakyat biasa.'),
      q(4, 'Sejauh manakah pendidikan alam sekitar berkesan memupuk kesedaran masyarakat?'),
    ],
  },
};

/** Keserasian lama — terbit daripada SECTION_SETS supaya hook tidak berubah. */
export const SECTION_QUESTIONS: Record<SectionKey, SampleQuestion[]> = {
  'Bahagian A (Membaca)': SECTION_SETS['Bahagian A (Membaca)'].questions.map((s) => ({
    title: `Soalan ${s.n}`,
    prompt: s.text,
  })),
  'Bahagian B (Perbincangan)': SECTION_SETS['Bahagian B (Perbincangan)'].questions.map((s) => ({
    title: `Soalan ${s.n}`,
    prompt: s.text,
  })),
};

import type { GeminiMistake } from '../lib/gemini';
import { BM_TEXTBOOK_TOPICS, type BmTextbookTopic } from '../data/bmTextbookTopics';
import { BM_ORAL_THEMES } from '../data/naskahCalon';
import type {
  BmOralTheme,
  BmOralExercise,
  SpMSoalan,
  SpMSet,
  SpMBank,
  SpmSoalan,
  SpmSet,
  SpmBank,
} from '../types/bmOral';

export {
  BM_TEXTBOOK_TOPICS,
  type BmTextbookTopic,
  BM_ORAL_THEMES,
  type BmOralTheme,
  type BmOralExercise,
  type SpMSoalan,
  type SpMSet,
  type SpMBank,
  type SpmSoalan,
  type SpmSet,
  type SpmBank,
};

export const STORAGE_KEY_BM_RECENT = 'mybertutur.bm_recent_themes';

/** Semak jika tema mengandungi pautan URL mentah luar */
export function hasExternalUrlSource(theme: BmOralTheme): boolean {
  return [...theme.individual, ...theme.group].some((e) =>
    /https?:\/\//i.test((e.sourceReference || '') + ' ' + (e.sourceTitle || '')),
  );
}

/** Senarai tema bersih daripada sumber URL mentah luar untuk pemilihan lalai */
export const BM_CLEAN_ORAL_THEMES = BM_ORAL_THEMES.filter((t) => !hasExternalUrlSource(t));

/**
 * Pilih tema BM secara rawak dan elak mengulang 5 tema terakhir.
 * Set dengan sumber URL laman web luar ditapis daripada pemilihan lalai.
 * Disimpan dalam localStorage dengan try/catch selamat.
 */
export function pickRandomBmTheme(currentId?: string): BmOralTheme {
  let recentIds: string[] = [];
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY_BM_RECENT) : null;
    if (raw) recentIds = JSON.parse(raw);
    if (!Array.isArray(recentIds)) recentIds = [];
  } catch {
    recentIds = [];
  }

  // Gunakan kumpulan tema bersih (tanpa URL mentah) secara lalai
  const basePool = BM_CLEAN_ORAL_THEMES.length > 0 ? BM_CLEAN_ORAL_THEMES : BM_ORAL_THEMES;

  const available = basePool.filter(
    (t) => !recentIds.slice(-5).includes(t.id) && t.id !== currentId,
  );
  const pool = available.length > 0 ? available : basePool;
  const picked = pool[Math.floor(Math.random() * pool.length)] || basePool[0];

  try {
    if (typeof window !== 'undefined') {
      const updated = [...recentIds.filter((id) => id !== picked.id), picked.id].slice(-5);
      window.localStorage.setItem(STORAGE_KEY_BM_RECENT, JSON.stringify(updated));
    }
  } catch {}

  return picked;
}

/** Chip kriteria penilaian BM 4 kriteria rasmi SPM */
export const BM_CRITERIA_A: string[] = ['Intonasi', 'Kelancaran', 'Sebutan', 'Pemahaman'];
export const BM_CRITERIA_B: string[] = ['Idea', 'Keyakinan', 'Hujah', 'Tatabahasa'];
export const BM_CRITERIA: string[] = BM_CRITERIA_A;

export type AIResult = {
  overallScore: number;
  sebutan: number;
  kelancaran: number;
  tatabahasa: number;
  transcription: string;
  feedback: string;
  mistakes?: GeminiMistake[];
};
export type PartResult = { section: SectionKey } & AIResult;

export function scoreColor(s: number): string {
  return s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : '#EF4444';
}
export function scoreLabel(s: number): string {
  if (s >= 90) return 'Excellent';
  if (s >= 75) return 'Very Good';
  if (s >= 60) return 'Good';
  return 'Needs Practice';
}

export function aggregateBmResults(collected: PartResult[]): AIResult {
  const count = Math.max(collected.length, 1);
  const avg = (vs: number[]) => Math.round(vs.reduce((a, v) => a + v, 0) / count);
  return {
    overallScore: avg(collected.map((r) => r.overallScore)),
    sebutan: avg(collected.map((r) => r.sebutan)),
    kelancaran: avg(collected.map((r) => r.kelancaran)),
    tatabahasa: avg(collected.map((r) => r.tatabahasa)),
    transcription: collected.map((r) => r.transcription).filter(Boolean).join('\n\n'),
    feedback: collected.map((r) => r.feedback).filter(Boolean).join(' '),
    mistakes: collected.flatMap((r) => r.mistakes ?? []),
  };
}

