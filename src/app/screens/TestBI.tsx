/** Ujian Lisan BI — skrin utama (tabs + rakaman + hasil). */
import { useState, useEffect, useRef } from 'react';
import { AppShell } from '../shell';
import { InfoDialog, MetricBar } from '../dialogs';
import { useRouter } from '../router';
import { BI_SPEAKING_2025_SETS } from '../data/biSpeaking2025';
import { useBiTest } from './useBiTest';
import { BI_SECTIONS, BI_PREP_SECONDS, biSetLabel, pickRandomBiSetIndex } from './testbiData';
import { scoreColor, scoreLabel } from './testbmData';
import { Part1Card, Part2Card, Part3Card, Part3DecisionCard, biPromptFor, fmt } from './TestBIcards';

export function TestBI() {
  const { navigate } = useRouter();
  const t = useBiTest();
  const [setIndex, setSetIndex] = useState(() => pickRandomBiSetIndex(BI_SPEAKING_2025_SETS.length));
  const [candidate] = useState<'A' | 'B'>(() => (Math.random() < 0.5 ? 'A' : 'B'));
  const [prepTimeLeft, setPrepTimeLeft] = useState(BI_PREP_SECONDS);
  const [isPrepping, setIsPrepping] = useState(false);
  const prepTimerRef = useRef<number | null>(null);
  const set = BI_SPEAKING_2025_SETS[setIndex] ?? BI_SPEAKING_2025_SETS[0];
  const prompt = biPromptFor(t.activeSection, set, candidate);
  const result = t.finalResult;
  const step = BI_SECTIONS.indexOf(t.activeSection) + 1;
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (t.isRecording) stoppedRef.current = false;
  }, [t.isRecording]);

  // Batal countdown persediaan bila tukar bahagian
  useEffect(() => {
    if (prepTimerRef.current) {
      window.clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
    setIsPrepping(false);
    setPrepTimeLeft(BI_PREP_SECONDS);
  }, [t.activeSection]);

  const handleNextSet = () => {
    stoppedRef.current = false;
    t.reset();
    setSetIndex(pickRandomBiSetIndex(BI_SPEAKING_2025_SETS.length, setIndex));
  };

  const handleNextQuestion = () => {
    stoppedRef.current = false;
    t.reset();
    if (t.activeSection === 'Part 1') {
      t.setActiveSection('Part 2');
    } else if (t.activeSection === 'Part 2') {
      t.setActiveSection('Part 3');
    } else if (t.activeSection === 'Part 3') {
      t.setActiveSection('Part 3 · Decision');
    } else {
      setSetIndex(pickRandomBiSetIndex(BI_SPEAKING_2025_SETS.length, setIndex));
      t.setActiveSection('Part 1');
    }
  };

  // Hentikan dengan selamat bila tab/app ke latar (visibilitychange)
  useEffect(() => {
    if (!t.isRecording) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (stoppedRef.current) return;
        stoppedRef.current = true;
        void t.stop(prompt).then(() => {
          t.setInfo({
            icon: 'warning',
            title: 'Recording Paused',
            message: 'Rakaman terhenti. Kekalkan skrin aktif semasa merakam.',
            primaryText: 'Try Again',
            onPrimary: () => {
              t.setInfo(null);
              stoppedRef.current = false;
              t.reset();
            },
            secondaryText: 'View Result',
            onSecondary: () => t.setInfo(null),
          });
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [t.isRecording, t.stop, prompt, t.setInfo, t.reset]);

  return (
    <AppShell
      title="SPM English Speaking"
      subtitle="Ujian Lisan · Latihan Interaktif"
      activeRoute="/app/academy"
      onBack="/app/academy"
      hideAds
    >
      <div className="space-y-4 pb-6">
        {/* Stepper with percentage & 3 dots */}
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-900 dark:text-[#F8FAFC]">Step {step} of {BI_SECTIONS.length}</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`h-2 w-2 rounded-full transition-all ${
                    dot === step
                      ? 'w-5 bg-[#7C3AED]'
                      : dot < step
                      ? 'bg-[#1D4ED8]'
                      : 'bg-slate-200 dark:bg-white/10'
                  }`}
                />
              ))}
              <span className="ml-1 text-slate-400">{Math.round((step / BI_SECTIONS.length) * 100)}%</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] transition-all duration-300"
              style={{ width: `${(step / BI_SECTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Section Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {BI_SECTIONS.map((sec) => {
            const active = sec === t.activeSection;
            return (
              <button
                key={sec}
                disabled={t.isAnalyzing || t.isRecording}
                onClick={() => t.setActiveSection(sec)}
                className={`rounded-[14px] py-2 text-xs font-black transition ${
                  active
                    ? 'bg-[#7C3AED] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0F172A] dark:text-slate-300'
                } ${t.isAnalyzing || t.isRecording ? 'opacity-50' : ''}`}
              >
                {sec}
              </button>
            );
          })}
        </div>

        {/* Question Prompt Card */}
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED]">
                {t.activeSection}
              </span>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-[#7C3AED]">
                {biSetLabel(set.state, set.setNumber)}
              </span>
            </div>
            {!t.isRecording && !t.isAnalyzing && (
              <button
                type="button"
                onClick={handleNextSet}
                className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-[#7C3AED] hover:bg-purple-500/20"
              >
                Tukar Set →
              </button>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-black ${
                t.isRecording && t.timeLeft <= 10
                  ? 'bg-red-500/15 text-red-500'
                  : 'bg-amber-500/15 text-amber-600'
              }`}
            >
              {t.isRecording ? '⏱ ' + fmt(t.timeLeft) : 'Limit ' + fmt(t.limit)}
            </span>
          </div>

          {t.activeSection === 'Part 1' && <Part1Card />}
          {t.activeSection === 'Part 2' && <Part2Card set={set} candidate={candidate} />}
          {t.activeSection === 'Part 3' && <Part3Card set={set} />}
          {t.activeSection === 'Part 3 · Decision' && <Part3DecisionCard set={set} />}
        </div>

        {/* Live Recording Sticky Bar */}
        {t.isRecording && (
          <div className="sticky top-0 z-40 rounded-[20px] border border-red-500/30 bg-white p-4 shadow-lg dark:border-red-500/40 dark:bg-[#0F172A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-red-500" />
                <span className="text-xs font-black tracking-widest text-red-500">RECORDING...</span>
              </div>
              <span className="font-mono text-xl font-black text-red-600">{fmt(t.timeLeft)}</span>
            </div>
            <div className="mt-3 flex h-5 items-end justify-center gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 animate-[bounce_0.6s_infinite] rounded-full bg-emerald-500"
                  style={{ height: `${12 + ((i * 3) % 10)}px`, animationDelay: `${i * 0.09}s` }}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-[11px] font-semibold text-slate-500">
              Recording in progress... auto-stops in {fmt(t.timeLeft)}
            </p>
          </div>
        )}

        {/* Recording Card & Buttons */}
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          {isPrepping ? (
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                PREP {fmt(prepTimeLeft)}
              </div>
              <div className="mx-auto mt-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-2xl text-white shadow-[0_8px_24px_rgba(245,158,11,0.4)]">
                🎯
              </div>
              <p className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                Prepare your answer…
              </p>
            </div>
          ) : !t.isRecording ? (
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                READY · {fmt(t.limit)} LIMIT
              </div>
              <button
                type="button"
                onClick={() => {
                  // HOTS / Part 3 · Decision is spontaneous in real SPM (no prep time given).
                  // Candidates prepare only for Part 2 (Individual) and Part 3 (Mind map discussion).
                  const needsPrep =
                    t.activeSection === 'Part 2' ||
                    t.activeSection === 'Part 3';
                  if (needsPrep) {
                    setPrepTimeLeft(BI_PREP_SECONDS);
                    setIsPrepping(true);
                    prepTimerRef.current = window.setInterval(() => {
                      setPrepTimeLeft((prev) => {
                        if (prev <= 1) {
                          window.clearInterval(prepTimerRef.current!);
                          setIsPrepping(false);
                          void t.start();
                          return 0;
                        }
                        return prev - 1;
                      });
                    }, 1000);
                  } else {
                    void t.start();
                  }
                }}
                disabled={t.isAnalyzing}
                className="mx-auto mt-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED] text-2xl text-white shadow-[0_8px_24px_rgba(124,58,237,0.4)] transition hover:bg-[#6D28D9] active:scale-95 disabled:opacity-50"
              >
                🎤
              </button>
              <p className="mt-2 text-xs font-bold text-slate-500 dark:text-[#94A3B8]">
                {t.isAnalyzing
                  ? 'Analyzing with Gemini AI…'
                  : t.activeSection === 'Part 3 · Decision'
                  ? 'Tap microphone to speak spontaneously (1 min limit)'
                  : 'Tap microphone to begin (1 min limit)'}
              </p>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => void t.stop(prompt)}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_8px_24px_rgba(239,68,68,0.4)] transition hover:bg-red-700 active:scale-95 animate-pulse"
              >
                <div className="h-5 w-5 rounded-[4px] bg-white" />
              </button>
              <p className="mt-2 text-xs font-black text-red-500">
                Tap square to stop &amp; submit
              </p>
            </div>
          )}
        </div>

        {/* SPM Speaking Tips Card */}
        <div className="rounded-[22px] border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs font-black text-slate-800 dark:text-[#F8FAFC]">
            💡 SPM Speaking Tips
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li>• Use discourse markers: <em>Furthermore, In addition, Consequently</em>.</li>
            <li>• Elaborate points with real-life examples to fill your 1 minute.</li>
            <li>• Maintain smooth pacing and natural pronunciation.</li>
          </ul>
        </div>
      </div>

      {t.showResult && result && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center" onClick={() => t.setShowResult(false)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl dark:bg-[#0F172A]" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300 dark:bg-white/20" />
            <div className="text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8" style={{ borderColor: scoreColor(result.overallScore) }}>
                <div>
                  <div className="text-3xl font-black" style={{ color: scoreColor(result.overallScore) }}>{result.overallScore}</div>
                  <div className="text-[10px] text-slate-500">/100</div>
                </div>
              </div>
              <div className="mt-2 text-lg font-extrabold" style={{ color: scoreColor(result.overallScore) }}>{scoreLabel(result.overallScore)}</div>
            </div>
            <div className="mt-4 space-y-2">
              <MetricBar label="Fluency" value={result.fluency} color="#22C55E" />
              <MetricBar label="Grammar" value={result.grammar} color="#3B82F6" />
              <MetricBar label="Vocab" value={result.vocab} color="#A855F7" />
            </div>
            {result.transcription && (
              <div className="mt-4 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Transcription</div>
                <p className="mt-1 text-sm">{result.transcription}</p>
              </div>
            )}
            {result.feedback && (
              <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">AI Feedback</div>
                <p className="mt-1 text-sm">{result.feedback}</p>
              </div>
            )}
            {result.mistakes && result.mistakes.length > 0 && (
              <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 dark:bg-rose-950/20">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Detected Mistakes ({result.mistakes.length})
                </div>
                <div className="mt-2 space-y-2">
                  {result.mistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-rose-100 bg-white p-2.5 text-xs dark:border-rose-900/40 dark:bg-slate-900"
                    >
                      <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        Category: {m.category}
                      </div>
                      <div className="mt-1 text-slate-800 dark:text-slate-200">
                        <span className="font-semibold text-rose-600">You said:</span> "{m.user_answer}"
                      </div>
                      <div className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Better way:</span> "{m.correct_answer}"
                      </div>
                      {m.ai_explanation && (
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {m.ai_explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  stoppedRef.current = false;
                  t.reset();
                }}
                className="rounded-xl border border-slate-200 bg-white py-3 text-xs font-black text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="rounded-xl bg-[#7C3AED] py-3 text-xs font-black text-white shadow-md hover:bg-[#6D28D9]"
              >
                Next Part →
              </button>
              <button
                type="button"
                onClick={() => {
                  t.setShowResult(false);
                  navigate('/app');
                }}
                className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <InfoDialog config={t.info} onClose={() => t.setInfo(null)} />
    </AppShell>
  );
}

