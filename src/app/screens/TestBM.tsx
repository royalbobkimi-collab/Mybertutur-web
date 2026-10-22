/** Ujian Lisan BM — UI skrin (rakaman + soalan + keputusan). */
import { useState, useEffect, useRef } from 'react';
import { AppShell } from '../shell';
import { InfoDialog, MetricBar } from '../dialogs';
import { useRouter } from '../router';
import { formatTimer } from '../lib/audio';
import { useBmTest } from './useBmTest';
import {
  SECTIONS,
  BM_CRITERIA_A,
  BM_CRITERIA_B,
  scoreColor,
  scoreLabel,
} from './testbmData';

export function TestBM() {
  const { navigate } = useRouter();
  const t = useBmTest();
  const stoppedRef = useRef(false);

  // Timer: SATU sumber masa (countdown dari 300 saat / 05:00 ke 00:00)
  const [countdown, setCountdown] = useState(300);

  // Reset stoppedRef bila rakaman baru bermula
  useEffect(() => {
    if (t.isRecording) {
      stoppedRef.current = false;
      setCountdown(300);
      return;
    }
    setCountdown(300);
  }, [t.isRecording]);

  useEffect(() => {
    if (!t.isRecording) return;
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [t.isRecording]);

  // --- Bank SPM Sebenar (spm_soalan_bank.json) sebagai sumber data tunggal ---
  const bankSet = t.activeBankSet;
  const stimulusTitle =
    t.activeSection === 'Bahagian A (Membaca)'
      ? (bankSet.individu?.tajuk || 'Petikan Rangsangan')
      : (bankSet.kumpulan?.tajuk || 'Bahan Perbincangan');
  const stimulusText =
    t.activeSection === 'Bahagian A (Membaca)'
      ? (bankSet.individu?.bahan || '')
      : (bankSet.kumpulan?.bahan || '');

  // 4 soalan individu Bahagian A (2 Bahan + 2 KBAT)
  const individualQuestions = t.individualQuestions ?? [];
  const questionText = individualQuestions.map((q) => `${q.n}. ${q.text}`).join('\n');

  // Soalan perbincangan Bahagian B (solo practice)
  const groupQuestions = t.groupQuestions ?? [];
  const groupQuestion =
    groupQuestions.length > 0
      ? groupQuestions.map((q) => `${q.n}. ${q.text}`).join('\n')
      : (bankSet.kumpulan?.soalanPerbincangan ||
        'Bincangkan isu ini bersama ahli kumpulan anda dan berikan cadangan serta hujah yang bernas secara lisan dalam tempoh 5 minit.');

  const currentPrompt =
    t.activeSection === 'Bahagian A (Membaca)'
      ? `Tema: ${bankSet.tema} (${stimulusTitle})\nPetikan Rangsangan untuk dibaca (Taksiran Individu):\n"${stimulusText}"\n\nArahan/Soalan:\n${questionText}`
      : `Tema: ${bankSet.tema} (${stimulusTitle})\nBahan Rangsangan (Taksiran Kumpulan):\n"${stimulusText}"\n\nArahan/Soalan:\n${groupQuestion}`;

  const questionForAI = `${currentPrompt}\n\nArahan Penilaian: Pelajar menjawab soalan Ujian Lisan Bahasa Melayu SPM dalam rakaman 5 minit ini berpandukan bahan rangsangan di atas. Sila nilaikan intonasi, sebutan, kelancaran, dan tatabahasa secara menyeluruh.`;
  const result = t.finalResult;

  const handleNextBankSet = () => {
    stoppedRef.current = false;
    t.reset();
  };

  const handleSelectBankSet = (id: string) => {
    if (t.isRecording || t.isAnalyzing) return;
    stoppedRef.current = false;
    t.reset();
    t.selectBankSet(id);
  };

  // Auto-stop: guna stoppedRef supaya t.stop dipanggil SEKALI sahaja per rakaman bila countdown capai 00:00
  useEffect(() => {
    if (t.isRecording && countdown === 0 && !stoppedRef.current) {
      stoppedRef.current = true;
      void t.stop(questionForAI);
    }
  }, [countdown, t.isRecording, t.stop, questionForAI]);

  // Hentikan dengan selamat bila tab/app ke latar (visibilitychange)
  useEffect(() => {
    if (!t.isRecording) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (stoppedRef.current) return;
        stoppedRef.current = true;
        void t.stop(questionForAI).then(() => {
          t.setInfo({
            icon: 'warning',
            title: 'Rakaman Terhenti',
            message: 'Rakaman terhenti. Kekalkan skrin aktif semasa merakam.',
            primaryText: 'Cuba Lagi',
            onPrimary: () => {
              t.setInfo(null);
              stoppedRef.current = false;
              t.reset();
            },
            secondaryText: 'Lihat Keputusan',
            onSecondary: () => t.setInfo(null),
          });
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [t.isRecording, t.stop, questionForAI, t.setInfo, t.reset]);

  const switchSection = (sec: (typeof SECTIONS)[number]) => {
    if (t.isAnalyzing || t.isRecording) return;
    t.setActiveSection(sec);
  };

  return (
    <AppShell
      title="Ujian Lisan BM"
      subtitle="Bahagian A & B — Penilaian AI Sebenar"
      activeRoute="/app/academy"
      onBack="/app/academy"
      hideAds
    >
      {/* 1. Sticky LIVE RECORDING Banner */}
      {t.isRecording && (
        <div className="sticky top-0 z-40 mb-4 rounded-2xl border border-red-500/20 bg-white p-4 shadow-md pt-[calc(1rem+env(safe-area-inset-top,0px))] dark:border-red-500/30 dark:bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-black tracking-widest text-red-500">
                LIVE RECORDING
              </span>
            </div>
            <div className="font-mono text-xl font-black text-red-600">
              {formatTimer(countdown)}
            </div>
          </div>
          <div className="mt-3 flex h-5 items-end justify-center gap-1.5">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 animate-[bounce_0.6s_infinite] rounded-full bg-emerald-500"
                style={{
                  height: `${12 + ((i * 3) % 10)}px`,
                  animationDelay: `${i * 0.09}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Tabs Bahagian A / B (Bersebelahan, aktif ungu, disekat semasa rakam/analisis) */}
      <div className="grid grid-cols-2 gap-2">
        {SECTIONS.map((sec) => {
          const active = sec === t.activeSection;
          return (
            <button
              key={sec}
              disabled={t.isRecording || t.isAnalyzing}
              onClick={() => switchSection(sec)}
              className={`rounded-xl px-3 py-2.5 text-xs font-extrabold transition ${
                active
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
              } ${t.isRecording || t.isAnalyzing ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {sec}
            </button>
          );
        })}
      </div>

      {/* 3. Chip Kriteria Penilaian (4 kriteria tepat app) */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-slate-400">Kriteria:</span>
        {(t.activeSection === 'Bahagian A (Membaca)' ? BM_CRITERIA_A : BM_CRITERIA_B).map((crit) => (
          <span
            key={crit}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-extrabold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            {crit}
          </span>
        ))}
      </div>

      {/* 4. Kaunter soalan: "Soalan X / Y" kiri + nama bahagian kanan */}
      <div className="mt-3.5 flex items-center justify-between rounded-[20px] border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
        <div>
          <div className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">
            {t.activeSection === 'Bahagian A (Membaca)' ? '4 Soalan Individu' : '1 Soalan Perbincangan'}
          </div>
          <div className="text-[11px] font-bold text-slate-400">
            {t.activeSection}
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-black text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-300">
          {t.activeSection === 'Bahagian A (Membaca)' ? 'Taksiran Individu (40 Markah)' : 'Perbincangan (30 Markah)'}
        </span>
      </div>

      {/* Pemilih Set Bank Soalan SPM (10 Set Rasmi) */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
            SET BANK SOALAN SPM (1103/3)
          </span>
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
            {t.bankSets.length} Set Tersedia
          </span>
        </div>

        {/* Carousel mendatar set SPM */}
        <div className="flex gap-2 overflow-x-auto pb-1.5">
          {t.bankSets.map((s, idx) => {
            const isSel = s.id === bankSet.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={t.isRecording || t.isAnalyzing}
                onClick={() => handleSelectBankSet(s.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
                  isSel
                    ? 'bg-[#7C3AED] text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0F172A] dark:text-slate-300'
                }`}
              >
                Set {idx + 1}: {s.tema}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="text-[11px] font-bold text-[#7C3AED]">
            Tema dipilih: {bankSet.tema}
          </div>
          {!t.isRecording && !t.isAnalyzing && (
            <button
              type="button"
              onClick={handleNextBankSet}
              className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-[#7C3AED] hover:bg-purple-500/20"
            >
              Set Seterusnya ↻
            </button>
          )}
        </div>
      </div>


      {/* 5. Kandungan Mengikut Bahagian */}
      {t.activeSection === 'Bahagian A (Membaca)' ? (
        <div className="mt-3 space-y-3">
          {/* Kad Petikan untuk dibaca */}
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED]">
                📖 Petikan untuk dibaca ({stimulusTitle})
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                Bank SPM
              </span>
            </div>

            <div className="mt-3 max-h-[220px] overflow-y-auto rounded-[16px] bg-slate-50 p-3.5 dark:bg-white/5">
              <p className="text-[16px] font-normal leading-[28px] text-slate-800 dark:text-slate-200">
                {stimulusText}
              </p>
            </div>

            <div className="mt-3 rounded-[16px] bg-purple-500/5 p-3 dark:bg-purple-950/20">
              <p className="text-xs text-slate-600 dark:text-[#94A3B8]">
                📝 <span className="font-bold">Arahan:</span> Sila baca petikan bahan rangsangan di atas dengan sebutan dan intonasi yang betul, kemudian jawab 4 soalan individu di bawah secara lisan dalam tempoh 5 minit.
              </p>
            </div>
          </div>

          {/* 4 KAD SOALAN INDIVIDU (2 Berdasarkan Bahan + 2 KBAT) */}
          <div className="space-y-2.5">
            <div className="px-1 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-[#94A3B8]">
              4 Soalan Individu (Jawab secara lisan):
            </div>
            {individualQuestions.map((q) => {
              const isKbat = q.jenis === 'kbat';
              return (
                <div
                  key={q.n}
                  className={`rounded-[20px] border p-4 shadow-sm transition ${
                    isKbat
                      ? 'border-purple-500/30 bg-purple-500/[0.04] dark:border-purple-500/20 dark:bg-purple-950/20'
                      : 'border-blue-500/30 bg-blue-500/[0.04] dark:border-blue-500/20 dark:bg-blue-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-[#F8FAFC]">
                      Soalan {q.n}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                        isKbat
                          ? 'bg-purple-500/15 text-[#7C3AED] dark:text-[#A78BFA]'
                          : 'bg-blue-500/15 text-[#1D4ED8] dark:text-blue-300'
                      }`}
                    >
                      {isKbat ? 'KBAT' : 'Berdasarkan Bahan'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                    {q.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7C3AED]">
                👥 Bahan Rangsangan Perbincangan ({stimulusTitle})
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                Bank SPM
              </span>
            </div>
            <div className="mt-3 max-h-[200px] overflow-y-auto rounded-[16px] bg-slate-50 p-3.5 dark:bg-white/5">
              <p className="text-[16px] font-normal leading-[28px] text-slate-800 dark:text-slate-200">
                {stimulusText}
              </p>
            </div>
            <div className="mt-3.5 rounded-[18px] border border-blue-500/20 bg-blue-500/5 p-3.5 dark:bg-blue-950/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1D4ED8] dark:text-blue-300">
                  SOALAN PERBINCANGAN KUMPULAN (30 MARKAH)
                </span>
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-black text-[#1D4ED8] dark:text-blue-300">
                  Perbincangan
                </span>
              </div>
              <p className="mt-2 text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                {groupQuestion}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-[#94A3B8]">
                📝 <span className="font-bold">Latihan solo. Dalam peperiksaan SPM sebenar ini dijalankan dalam kumpulan 3-5 calon (12-15 minit). Berikan cadangan serta hujah bernas anda dalam rakaman 5 minit.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transkripsi rakaman terkini jika ada */}
      {t.transcripts[t.activeSection] && (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Transkripsi {t.activeSection}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {t.transcripts[t.activeSection]}
          </p>
        </div>
      )}

      {/* 7. Kad Spinner CSS semasa menganalisis */}
      {t.isAnalyzing && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
            Menganalisis rakaman dengan AI...
          </span>
        </div>
      )}

      {/* 8. Butang Kawalan Rakaman — Diletakkan dalam aliran halaman dengan ruang bawah yang mencukupi dari bottom navigation */}
      <div className="mt-6 flex gap-2 pb-6">
        {t.isAnalyzing ? (
          <button
            disabled
            className="flex-1 cursor-not-allowed rounded-[20px] bg-amber-500 py-4 text-base font-extrabold text-white opacity-80"
          >
            Menganalisis...
          </button>
        ) : !t.isRecording ? (
          <button
            onClick={() => {
              void t.start();
            }}
            className="flex-1 rounded-[20px] bg-[#F59E0B] py-4 text-base font-black text-white shadow-[0_6px_20px_rgba(245,158,11,0.35)] transition hover:bg-[#D97706] active:scale-[0.98]"
          >
            🎙️ Mula Rakaman (05:00)
          </button>
        ) : (
          <button
            onClick={() => {
              if (stoppedRef.current) return;
              stoppedRef.current = true;
              void t.stop(questionForAI);
            }}
            className="flex-1 animate-pulse rounded-[20px] bg-[#EF4444] py-4 text-base font-black text-white shadow-[0_6px_20px_rgba(239,68,68,0.35)] transition hover:bg-[#DC2626] active:scale-[0.98]"
          >
            ⏹ Hentikan ({formatTimer(countdown)})
          </button>
        )}
      </div>
      {/* 9. Pulihkan Bahagian Keputusan Modal Penuh */}
      {t.showResult && result && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center"
          onClick={() => t.setShowResult(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl dark:bg-[#0F172A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300 dark:bg-white/20" />
            <div className="text-center">
              <div
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8"
                style={{ borderColor: scoreColor(result.overallScore) }}
              >
                <div>
                  <div
                    className="text-3xl font-black"
                    style={{ color: scoreColor(result.overallScore) }}
                  >
                    {result.overallScore}
                  </div>
                  <div className="text-[10px] text-slate-500">/100</div>
                </div>
              </div>
              <div
                className="mt-2 text-lg font-extrabold"
                style={{ color: scoreColor(result.overallScore) }}
              >
                {scoreLabel(result.overallScore)}
              </div>
              <p className="text-xs text-slate-500">
                Prestasi pertuturan keseluruhan
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <MetricBar label="Sebutan" value={result.sebutan} color="#22C55E" />
              <MetricBar label="Kelancaran" value={result.kelancaran} color="#3B82F6" />
              <MetricBar label="Tatabahasa" value={result.tatabahasa} color="#A855F7" />
            </div>

            {result.transcription && (
              <div className="mt-4 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Transkripsi
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {result.transcription}
                </p>
              </div>
            )}

            {result.feedback && (
              <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Maklum Balas AI
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {result.feedback}
                </p>
              </div>
            )}

            {result.mistakes && result.mistakes.length > 0 && (
              <div className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 dark:bg-rose-950/20">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Kesalahan Dikesan ({result.mistakes.length})
                </div>
                <div className="mt-2 space-y-2">
                  {result.mistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-rose-100 bg-white p-2.5 text-xs dark:border-rose-900/40 dark:bg-slate-900"
                    >
                      <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        Kategori: {m.category}
                      </div>
                      <div className="mt-1 text-slate-800 dark:text-slate-200">
                        <span className="font-semibold text-rose-600">Ujaran anda:</span> "{m.user_answer}"
                      </div>
                      <div className="mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Cadangan betul:</span> "{m.correct_answer}"
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
                Cuba Lagi
              </button>
              <button
                type="button"
                onClick={handleNextBankSet}
                className="rounded-xl bg-[#7C3AED] py-3 text-xs font-black text-white shadow-md hover:bg-[#6D28D9]"
              >
                Set Seterusnya ↻
              </button>
              <button
                type="button"
                onClick={() => {
                  t.setShowResult(false);
                  navigate('/app');
                }}
                className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <InfoDialog config={t.info} onClose={() => t.setInfo(null)} />
    </AppShell>
  );
}
