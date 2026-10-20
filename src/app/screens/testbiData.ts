/**
 * Ujian Lisan BI — jenis & agregat (port testbi.tsx).
 * Part 2 (Individual) + Part 3 (Discussion) + KBAT/HOTS, 60s setiap bahagian.
 */
import type { GeminiMistake } from '../lib/gemini';

export const BI_LATIHAN_ID = 2;
export const MIN_RECORD_SECONDS = 3;
export const BI_PREP_SECONDS = 20;

export const BI_SECTIONS = ['Part 1', 'Part 2', 'Part 3', 'Part 3 · Decision'] as const;
export type BiSectionKey = (typeof BI_SECTIONS)[number];

export const BI_SECTION_LIMITS: Record<BiSectionKey, number> = {
  'Part 1': 60,
  'Part 2': 60,
  'Part 3': 60,
  'Part 3 · Decision': 60,
};

export type BiAIResult = {
  overallScore: number;
  fluency: number;
  grammar: number;
  vocab: number;
  transcription: string;
  feedback: string;
  mistakes?: GeminiMistake[];
};
export type BiPartResult = { section: BiSectionKey } & BiAIResult;

export function aggregateBiResults(collected: BiPartResult[]): BiAIResult {
  const count = Math.max(collected.length, 1);
  const avg = (vs: number[]) => Math.round(vs.reduce((a, v) => a + v, 0) / count);
  return {
    overallScore: avg(collected.map((r) => r.overallScore)),
    fluency: avg(collected.map((r) => r.fluency)),
    grammar: avg(collected.map((r) => r.grammar)),
    vocab: avg(collected.map((r) => r.vocab)),
    transcription: collected.map((r) => r.transcription).filter(Boolean).join('\n\n'),
    feedback: collected.map((r) => r.feedback).filter(Boolean).join('\n\n'),
    mistakes: collected.flatMap((r) => r.mistakes ?? []),
  };
}

export const PART1_QUESTIONS: string[] = [
  'Can you tell me about yourself and your family?',
  'What do you like to do in your free time?',
  'Describe your school and your favourite subject.',
  'Tell me about your hometown and what you like about it.',
  'What are your plans after SPM?',
];

export function biPart1Prompt(): string {
  const q = PART1_QUESTIONS[Math.floor(Math.random() * PART1_QUESTIONS.length)];
  return `SPM ENGLISH 1119/3 Part 1 Introduction. Question: ${q}`;
}

export function biSetLabel(state: string, setNumber: number): string {
  const s = state.charAt(0) + state.slice(1).toLowerCase();
  return `${s} Set ${setNumber}`;
}

export const STORAGE_KEY_BI_RECENT = 'mybertutur.bi_recent_sets';

/**
 * Pilih set BI secara rawak dan elakkan mengulang set terakhir.
 * Disimpan dalam localStorage dengan try/catch.
 */
export function pickRandomBiSetIndex(totalSets: number, currentIdx?: number): number {
  if (totalSets <= 1) return 0;
  let lastIdx: number | null = null;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY_BI_RECENT) : null;
    if (raw !== null && !Number.isNaN(parseInt(raw, 10))) {
      lastIdx = parseInt(raw, 10);
    }
  } catch {}

  const available: number[] = [];
  for (let i = 0; i < totalSets; i++) {
    if (i !== lastIdx && i !== currentIdx) available.push(i);
  }
  const pool = available.length > 0 ? available : Array.from({ length: totalSets }, (_, i) => i);
  const picked = pool[Math.floor(Math.random() * pool.length)] ?? 0;

  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY_BI_RECENT, String(picked));
    }
  } catch {}

  return picked;
}

