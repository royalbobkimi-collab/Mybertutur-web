/** Ujian Lisan BI — kad soalan (Part 2 / Part 3 / KBAT) mengikut reka bentuk app-baru. */
import { BI_SPEAKING_2025_SETS } from '../data/biSpeaking2025';
import type { BI_SECTIONS } from './testbiData';

type BiSet = (typeof BI_SPEAKING_2025_SETS)[number];

export function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function biPromptFor(
  section: (typeof BI_SECTIONS)[number],
  set: BiSet | null,
  cand: 'A' | 'B',
): string {
  if (section === 'Part 1') {
    return 'SPM ENGLISH 1119/3 Part 1 Introduction. Answer the introduction question about yourself.';
  }
  if (!set) return '';
  const chosen = cand === 'A' ? set.candidateA : set.candidateB;
  if (section === 'Part 2') {
    return `SPM ENGLISH 1119/3 Part 2 Individual. Set ${set.state} ${set.setNumber}. Candidate ${cand}: ${chosen.topic}. ${chosen.prompt} Points: ${chosen.points.join(' | ')}`;
  }
  if (section === 'Part 3') {
    return `SPM ENGLISH 1119/3 Part 3 Discussion. Set ${set.state} ${set.setNumber}. Central question: ${set.part3.question}. Discuss using ${set.part3.nodes.length} points: ${set.part3.nodes.join(' | ')}`;
  }
  return `SPM ENGLISH 1119/3 Part 3 · Decision. Set ${set.state} ${set.setNumber}. Topic: ${set.part3.question}. Decision: ${set.part3.hots}`;
}

export function Part1Card() {
  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-2 rounded-[16px] bg-blue-500/10 px-3 py-2 text-xs font-black text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <span>👋</span>
        <span>Part 1 · Introduction (Warm-up)</span>
      </div>

      <div className="rounded-[22px] border border-blue-500/20 bg-blue-500/5 p-4 dark:bg-blue-950/20">
        <div className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">
          Answer the introduction question
        </div>
        <h2 className="mt-1 text-base font-black text-slate-900 dark:text-[#F8FAFC]">
          Tell the examiner about yourself — your family, hobbies, school, hometown, or plans after SPM.
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Speak naturally for about 1 minute. There are no right or wrong answers — just introduce yourself clearly.
        </p>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400">Criteria:</span>
        {['Pronunciation', 'Fluency', 'Vocabulary'].map((c) => (
          <span
            key={c}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Part2Card({ set, candidate }: { set: BiSet; candidate: 'A' | 'B' }) {
  const chosen = candidate === 'A' ? set.candidateA : set.candidateB;
  const other = candidate === 'A' ? set.candidateB : set.candidateA;

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-2 rounded-[16px] bg-emerald-500/10 px-3 py-2 text-xs font-black text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <span>👤</span>
        <span>Your Assigned Task: Candidate {candidate} (1 Minute Limit)</span>
      </div>

      <div className="rounded-[16px] border border-slate-200/80 bg-slate-50 p-2.5 text-xs dark:border-white/10 dark:bg-white/5">
        <span className="font-extrabold text-slate-500">Partner&apos;s Role (Reference):</span>{' '}
        <span className="font-bold text-slate-700 dark:text-slate-300">{other.topic}</span>
      </div>

      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-[#F8FAFC]">{chosen.topic}</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-[#94A3B8]">{chosen.prompt}</p>
      </div>

      <div className="rounded-[20px] border border-amber-500/20 bg-amber-500/5 p-3.5 dark:bg-amber-950/20">
        <div className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">YOU SHOULD SAY:</div>
        <ul className="mt-2 space-y-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
          {chosen.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400">Criteria:</span>
        {['Organisation', 'Vocabulary', 'Fluency'].map((c) => (
          <span key={c} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Part3Card({ set }: { set: BiSet }) {
  const points = set.part3.nodes.slice(0, 3);

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED]">
          SPM PART 3 · VISUAL MIND MAP
        </span>
        <span className="text-[10px] font-bold text-slate-400">
          {set.part3.nodes.length} Points Focus
        </span>
      </div>

      <div className="rounded-[22px] border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-4 text-center dark:bg-[#7C3AED]/20">
        <div className="text-[10px] font-extrabold uppercase text-[#7C3AED]">Central Question</div>
        <h2 className="mt-1 text-base font-black text-slate-900 dark:text-[#F8FAFC]">
          {set.part3.question}
        </h2>
      </div>

      <p className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
        Discuss using all 3 points (1 minute):
      </p>

      {/* 3 Points Nodes */}
      <div className="space-y-2">
        {points.map((n, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[18px] border border-slate-200/80 bg-white p-3 text-xs shadow-sm dark:border-white/10 dark:bg-[#0F172A]"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-black text-white">
              {i + 1}
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{n}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400">Criteria:</span>
        {['Interaction', 'Elaboration', 'Vocabulary'].map((c) => (
          <span
            key={c}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Part3DecisionCard({ set }: { set: BiSet }) {
  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-rose-500">
          SPM PART 3 · DECISION (KBAT / HOTS)
        </span>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          ⚡ Spontan (Tiada masa persediaan)
        </span>
      </div>

      <div className="rounded-[22px] border border-rose-500/20 bg-rose-500/5 p-4 dark:bg-rose-950/20">
        <div className="text-[10px] font-bold text-slate-400">Theme: {set.part3.question}</div>
        <h2 className="mt-1 text-base font-black text-slate-900 dark:text-[#F8FAFC]">
          {set.part3.hots}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          State your viewpoint clearly and provide critical justifications with real-world examples (1 minute limit). In SPM, candidates respond spontaneously without preparation time.
        </p>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400">Criteria:</span>
        {['Critical Thinking', 'Justification', 'Fluency'].map((c) => (
          <span
            key={c}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
