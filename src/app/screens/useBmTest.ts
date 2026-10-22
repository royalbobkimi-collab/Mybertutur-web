/** Ujian Lisan BM — rakaman + penilaian Gemini (hook). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluateAudioRecording, TruncatedGeminiResponseError } from '../lib/gemini';
import {
  handleSubmitToSupabase,
  saveMistakes,
  saveTestResult,
  claimDailyTestCompletion,
  fetchDailyTestStatus,
  type MistakeBankRow,
} from '../lib/data';
import { startWebRecording, stopWebRecording } from '../lib/audio';
import { cancelWebRecording, webBlobToBase64 } from '../lib/audio';
import type { InfoDialogConfig } from '../dialogs';
import { BM_LATIHAN_ID, MIN_RECORD_SECONDS, SECTIONS } from './testbmData';
import { aggregateBmResults } from './testbmData';
import type { AIResult, PartResult, SectionKey } from './testbmData';
import type { SpMBank, SpMSet, SpMSoalan } from '../types/bmOral';
import spmBankRaw from '../data/spm_soalan_bank.json';

const BANK_SETS: SpMSet[] = ((spmBankRaw as unknown as SpMBank).bm || []) as SpMSet[];

function parseQuestionsFromSet(set: SpMSet | undefined): {
  individual: SpMSoalan[];
  group: SpMSoalan[];
} {
  if (!set) return { individual: [], group: [] };
  const individual: SpMSoalan[] = (set.individu?.soalan || []).map((q) => ({
    n: q.n,
    text: q.teks,
    jenis: q.jenis,
  }));
  const group: SpMSoalan[] = set.kumpulan?.soalanPerbincangan
    ? [{ n: 1, text: set.kumpulan.soalanPerbincangan, jenis: 'perbincangan' }]
    : [];
  return { individual, group };
}

function pickRandomSet(excludeId?: string): SpMSet {
  if (BANK_SETS.length === 0) {
    return {
      id: 'bm-fallback',
      tema: 'Umum',
      individu: { tajuk: 'Umum', bahan: '', soalan: [] },
      kumpulan: { tajuk: 'Umum', bahan: '', soalanPerbincangan: '' },
    };
  }
  const pool = BANK_SETS.filter((s) => s.id !== excludeId);
  const candidates = pool.length > 0 ? pool : BANK_SETS;
  return candidates[Math.floor(Math.random() * candidates.length)] ?? BANK_SETS[0];
}

export function useBmTest() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>(SECTIONS[0]);
  const [activeBankSet, setActiveBankSet] = useState<SpMSet>(() => pickRandomSet());
  const [individualQuestions, setIndividualQuestions] = useState<SpMSoalan[]>(() => {
    const initial = pickRandomSet();
    return parseQuestionsFromSet(initial).individual;
  });
  const [groupQuestions, setGroupQuestions] = useState<SpMSoalan[]>(() => {
    const initial = pickRandomSet();
    return parseQuestionsFromSet(initial).group;
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const [info, setInfo] = useState<InfoDialogConfig>(null);
  const [finalResult, setFinalResult] = useState<AIResult | null>(null);
  const [transcripts, setTranscripts] = useState<Partial<Record<SectionKey, string>>>({});
  const collectedRef = useRef<PartResult[]>([]);
  const mistakesRef = useRef<MistakeBankRow[]>([]);
  const submittedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const spmDataRef = useRef<{ sets: SpMSet[]; soalan: SpMSoalan[] } | null>(null);

  // Sync questions whenever activeBankSet changes
  useEffect(() => {
    const parsed = parseQuestionsFromSet(activeBankSet);
    setIndividualQuestions(parsed.individual);
    setGroupQuestions(parsed.group);
    spmDataRef.current = {
      sets: BANK_SETS,
      soalan: parsed.individual,
    };
  }, [activeBankSet]);


  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [isRecording]);

  useEffect(() => () => cancelWebRecording(), []);

  const reset = useCallback(() => {
    cancelWebRecording();
    submittedRef.current = false;
    collectedRef.current = [];
    mistakesRef.current = [];
    setFinalResult(null);
    setTranscripts({});
    setShowResult(false);
    setIsRecording(false);
    setIsAnalyzing(false);
    setTimer(0);
    setActiveSection(SECTIONS[0]);
    setActiveBankSet((prev) => pickRandomSet(prev?.id));
  }, []);

  const start = useCallback(async () => {
    if (isAnalyzing || isRecording) return;

    // Sekat permulaan jika had harian telah dicapai (1 UBBM sehari waktu Malaysia)
    if (user) {
      try {
        const status = await fetchDailyTestStatus(user.id);
        if (status.bmDone) {
          setInfo({
            icon: 'warning',
            title: 'Limit Test Reached',
            message: 'Limit test for today, come back tomorrow',
            primaryText: 'Dashboard',
            onPrimary: () => {
              setInfo(null);
              if (typeof window !== 'undefined') window.location.href = '/app';
            },
            secondaryText: 'Tutup',
            onSecondary: () => setInfo(null),
          });
          return;
        }
      } catch (e) {
        console.warn('[testbm] daily limit pre-check error:', e);
        // Fail-closed: elak mula ujian sekiranya status kuota tidak dapat disahkan
        setInfo({
          icon: 'warning',
          title: 'Pengesahan Had Gagal',
          message: 'Status had ujian harian tidak dapat disahkan buat masa ini. Sila periksa sambungan internet dan cuba sebentar lagi.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            void start();
          },
          secondaryText: 'Dashboard',
          onSecondary: () => {
            setInfo(null);
            if (typeof window !== 'undefined') window.location.href = '/app';
          },
        });
        return;
      }
    }

    try {
      // getUserMedia dipanggil HANYA sekali dalam handler klik ini
      await startWebRecording();
      setTimer(0);
      setIsRecording(true);
    } catch (err) {
      cancelWebRecording();
      const code = (err as { code?: string })?.code;
      const message = err instanceof Error ? err.message : String(err);

      if (code === 'UNSUPPORTED_BROWSER' || message.includes('Safari atau Chrome')) {
        setInfo({
          icon: 'warning',
          title: 'Pelayar Tidak Menyokong Mikrofon',
          message: 'Buka di Safari atau Chrome untuk merakam suara dan menerima penilaian AI.',
          primaryText: 'Tutup',
          onPrimary: () => setInfo(null),
        });
        return;
      }

      if (code === 'PERMISSION_DENIED' || message.includes('Tetapan')) {
        setInfo({
          icon: 'warning',
          title: 'Kebenaran Mikrofon Diperlukan',
          message: 'Benarkan akses mikrofon di Tetapan pelayar anda, kemudian cuba lagi.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            void start();
          },
          secondaryText: 'Tutup',
          onSecondary: () => setInfo(null),
        });
        return;
      }

      setInfo({
        icon: 'warning',
        title: 'Rakaman Gagal',
        message: `Mikrofon tidak dapat dimulakan.\n\nDetail: ${message}`,
        primaryText: 'Cuba Lagi',
        onPrimary: () => {
          setInfo(null);
          void start();
        },
        secondaryText: 'Tutup',
        onSecondary: () => setInfo(null),
      });
    }
  }, [isAnalyzing, isRecording]);

  const stop = useCallback(async (questionForAI?: string) => {
    if (isAnalyzing || !isRecording) return;
    setIsRecording(false);
    if (submittedRef.current) { cancelWebRecording(); return; }
    setIsAnalyzing(true);
    try {
      const rec = await stopWebRecording();
      if (rec.durationSeconds < MIN_RECORD_SECONDS || rec.blob.size < 1000) {
        setInfo({
          icon: 'warning',
          title: 'Tiada Suara Dikesan',
          message: 'Rakaman terlalu pendek atau senyap. Sila rakam semula.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Tutup',
          onSecondary: () => setInfo(null),
        });
        return;
      }
      const base64 = await webBlobToBase64(rec.blob);

      // Pastikan ada prompt Gemini yang lengkap dan sah
      let prompt = (questionForAI && questionForAI !== '__auto__') ? questionForAI : '';
      if (!prompt.trim()) {
        if (activeSection === 'Bahagian A (Membaca)') {
          const qs = (activeBankSet.individu?.soalan || []).map((q) => `${q.n}. ${q.teks}`).join('\n');
          prompt = `Tema: ${activeBankSet.tema}\nPetikan Rangsangan untuk dibaca (Taksiran Individu):\n"${activeBankSet.individu?.bahan || ''}"\n(Bank Soalan SPM)\n\nArahan/Soalan:\n${qs}\n\nArahan Penilaian: Pelajar menjawab soalan Ujian Lisan Bahasa Melayu SPM dalam rakaman ini berpandukan bahan rangsangan di atas. Sila nilaikan intonasi, sebutan, kelancaran, dan tatabahasa secara menyeluruh.`;
        } else {
          const qGroup = activeBankSet.kumpulan?.soalanPerbincangan || 'Bincangkan isu ini bersama ahli kumpulan anda dan berikan cadangan serta hujah yang bernas secara lisan.';
          prompt = `Tema: ${activeBankSet.tema}\nBahan Rangsangan (Taksiran Kumpulan):\n"${activeBankSet.kumpulan?.bahan || ''}"\n(Bank Soalan SPM)\n\nArahan/Soalan:\n${qGroup}\n\nArahan Penilaian: Pelajar menjawab soalan Ujian Lisan Bahasa Melayu SPM dalam rakaman ini berpandukan bahan rangsangan di atas. Sila nilaikan intonasi, sebutan, kelancaran, dan tatabahasa secara menyeluruh.`;
        }
      }

      const gemini = await evaluateAudioRecording({
        audioBase64: base64, subject: 'bm',
        sectionTitle: activeSection, questionPrompt: prompt,
        mimeType: rec.mimeType,
      });
      const dynamic: AIResult = {
        overallScore: gemini.score,
        sebutan: gemini.sebutan ?? gemini.score,
        kelancaran: gemini.kelancaran ?? gemini.score,
        tatabahasa: gemini.tatabahasa ?? gemini.score,
        transcription: gemini.transcription, feedback: gemini.feedback,
        mistakes: gemini.mistakes,
      };
      if (user && gemini.mistakes && gemini.mistakes.length > 0) {
        const captured: MistakeBankRow[] = gemini.mistakes.map((m) => ({
          user_id: user.id, subject_id: 'bm',
          original_question: m.original_question || prompt,
          user_answer: m.user_answer, correct_answer: m.correct_answer,
          category: m.category, ai_explanation: m.ai_explanation,
        }));
        mistakesRef.current = [...mistakesRef.current, ...captured];
      }
      const collected = [...collectedRef.current, { section: activeSection, ...dynamic }];
      collectedRef.current = collected;
      setTranscripts((p) => ({ ...p, [activeSection]: gemini.transcription }));
      const idx = SECTIONS.indexOf(activeSection);
      if (idx < SECTIONS.length - 1) {
        setActiveSection(SECTIONS[idx + 1]);
        return;
      }
      const final = aggregateBmResults(collected);
      submittedRef.current = true;
      setFinalResult(final);
      setShowResult(true);
      // Jangan simpan score 0 ke submissions bila AI gagal atau markah 0
      if (user && final.overallScore > 0) {
        let subRes: { id: number } | null = null;
        try {
          subRes = await handleSubmitToSupabase({
            user_id: user.id, latihan_id: BM_LATIHAN_ID,
            score: final.overallScore, feedback: final.feedback,
            transcription: final.transcription ?? null,
          });
        } catch (e) { console.warn('[testbm] submit gagal:', e); }

        try {
          await saveTestResult({
            user_id: user.id,
            subject: 'bm',
            topic_title: 'Ujian Lisan BM (UBBM)',
            section_type: 'full_test',
            overall_score: final.overallScore,
            breakdown_scores: {
              sebutan: final.sebutan,
              kelancaran: final.kelancaran,
              tatabahasa: final.tatabahasa,
            },
            feedback: final.feedback,
            transcription: final.transcription ?? '',
          });
        } catch (e) { console.warn('[testbm] saveTestResult error:', e); }

        // Tuntut kuota harian secara atomik di database
        try {
          await claimDailyTestCompletion('bm', subRes?.id ?? null);
        } catch (e) {
          console.warn('[testbm] claim daily limit error:', e);
        }

        if (mistakesRef.current.length > 0) {
          try { await saveMistakes(mistakesRef.current); }
          catch (e) { console.warn('[testbm] mistake_bank gagal:', e); }
          finally { mistakesRef.current = []; }
        }
      }
    } catch (err) {
      const errStr = err instanceof Error ? err.message : String(err);
      const isQuota = /429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(errStr);

      if (isQuota) {
        setInfo({
          icon: 'warning',
          title: 'Sistem Sedang Sibuk',
          message: 'Sistem sedang sibuk. Cuba lagi sebentar.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Tutup',
          onSecondary: () => setInfo(null),
        });
      } else if (err instanceof TruncatedGeminiResponseError) {
        setInfo({
          icon: 'warning',
          title: 'Jawapan Terlalu Panjang',
          message: 'Jawapan terlalu panjang — TIADA markah diberikan.\n\nSila rakam semula dengan jawapan lebih ringkas.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Tutup',
          onSecondary: () => setInfo(null),
        });
      } else {
        setInfo({
          icon: 'warning',
          title: 'Penilaian AI Tidak Tersedia',
          message: 'Maaf, sistem AI tidak dapat memproses rakaman anda buat masa ini. Sila pastikan audio jelas dan cuba rakam sekali lagi.',
          primaryText: 'Cuba Lagi',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Tutup',
          onSecondary: () => setInfo(null),
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, isRecording, activeSection, user, reset, activeBankSet]);

  const selectBankSet = useCallback((id: string) => {
    const found = BANK_SETS.find((s) => s.id === id);
    if (found) setActiveBankSet(found);
  }, []);

  return {
    activeSection,
    setActiveSection,
    isRecording,
    isAnalyzing,
    showResult,
    setShowResult,
    timer,
    info,
    setInfo,
    finalResult,
    transcripts,
    start,
    stop,
    reset,
    individualQuestions,
    groupQuestions,
    activeBankSet,
    selectBankSet,
    bankSets: BANK_SETS,
  };
}
