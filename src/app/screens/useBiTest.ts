/** Ujian Lisan BI — hook rakaman + Gemini (bahagian 1/2). */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluateAudioRecording } from '../lib/gemini';
import { TruncatedGeminiResponseError } from '../lib/gemini';
import {
  handleSubmitToSupabase,
  saveMistakes,
  claimDailyTestCompletion,
  fetchDailyTestStatus,
  type MistakeBankRow,
} from '../lib/data';
import { startWebRecording, stopWebRecording } from '../lib/audio';
import { cancelWebRecording, webBlobToBase64 } from '../lib/audio';
import type { InfoDialogConfig } from '../dialogs';
import { BI_SECTION_LIMITS, BI_SECTIONS } from './testbiData';
import { aggregateBiResults } from './testbiData';
import type { BiAIResult, BiPartResult, BiSectionKey } from './testbiData';

export function useBiTest() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<BiSectionKey>('Part 1');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BI_SECTION_LIMITS['Part 1']);
  const [info, setInfo] = useState<InfoDialogConfig>(null);
  const [finalResult, setFinalResult] = useState<BiAIResult | null>(null);
  const [transcripts, setTranscripts] = useState<Partial<Record<BiSectionKey, string>>>({});
  const collectedRef = useRef<BiPartResult[]>([]);
  const submittedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const stoppingRef = useRef(false);
  const limit = BI_SECTION_LIMITS[activeSection];

  useEffect(() => { setTimeLeft(BI_SECTION_LIMITS[activeSection]); }, [activeSection]);
  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    cancelWebRecording();
  }, []);

  const autoStopRef = useRef<((q: string) => Promise<void>) | null>(null);

  const start = useCallback(async () => {
    if (isAnalyzing || isRecording) return;

    // Sekat permulaan jika had harian telah dicapai (1 UBBI sehari waktu Malaysia)
    if (user) {
      try {
        const status = await fetchDailyTestStatus(user.id);
        if (status.biDone) {
          setInfo({
            icon: 'warning',
            title: 'Limit Test Reached',
            message: 'Limit test for today, come back tomorrow',
            primaryText: 'Dashboard',
            onPrimary: () => {
              setInfo(null);
              if (typeof window !== 'undefined') window.location.href = '/app';
            },
            secondaryText: 'Close',
            onSecondary: () => setInfo(null),
          });
          return;
        }
      } catch (e) {
        console.warn('[testbi] daily limit pre-check error:', e);
        // Fail-closed: prevent starting if limit check cannot be verified
        setInfo({
          icon: 'warning',
          title: 'Limit Check Failed',
          message: 'Unable to verify your daily test allowance at this moment. Please check your connection and try again.',
          primaryText: 'Try Again',
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
      await startWebRecording();
      setIsRecording(true);
      setTimeLeft(limit);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) window.clearInterval(timerRef.current);
            const fn = autoStopRef.current;
            if (fn) void fn('__auto__');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      cancelWebRecording();
      const code = (err as { code?: string })?.code;
      const message = err instanceof Error ? err.message : String(err);

      if (code === 'UNSUPPORTED_BROWSER' || message.includes('Safari atau Chrome')) {
        setInfo({
          icon: 'warning',
          title: 'Browser Unsupported',
          message: 'Buka di Safari atau Chrome untuk menggunakan mikrofon dan penilaian AI.',
          primaryText: 'Close',
          onPrimary: () => setInfo(null),
        });
        return;
      }

      if (code === 'PERMISSION_DENIED' || message.includes('Tetapan')) {
        setInfo({
          icon: 'warning',
          title: 'Microphone Permission Needed',
          message: 'Benarkan akses mikrofon di Tetapan pelayar anda, kemudian cuba lagi.',
          primaryText: 'Try Again',
          onPrimary: () => {
            setInfo(null);
            void start();
          },
          secondaryText: 'Close',
          onSecondary: () => setInfo(null),
        });
        return;
      }

      setInfo({
        icon: 'warning',
        title: 'Recording Failed',
        message: `The microphone could not start.\n\nDetail: ${message}`,
        primaryText: 'Try Again',
        onPrimary: () => {
          setInfo(null);
          void start();
        },
        secondaryText: 'Close',
        onSecondary: () => setInfo(null),
      });
    }
  }, [isAnalyzing, isRecording, limit]);

  const finish = useCallback(async (questionForAI: string, elapsed: number) => {
    setIsRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (submittedRef.current) { cancelWebRecording(); return; }
    setIsAnalyzing(true);
    try {
      const rec = await stopWebRecording();
      const heard = elapsed > 0 ? elapsed : rec.durationSeconds;
      if (heard < 3 || rec.blob.size < 1000) {
        setInfo({ icon: 'warning', title: 'No Speech Detected', message: 'Recording too short or silent. Please record again.' });
        return;
      }
      const base64 = await webBlobToBase64(rec.blob);
      const prompt = questionForAI === '__auto__' ? '' : questionForAI;
      const gemini = await evaluateAudioRecording({
        audioBase64: base64, subject: 'bi',
        sectionTitle: activeSection, questionPrompt: prompt || activeSection,
        mimeType: rec.mimeType,
      });
      const dynamic: BiAIResult = {
        overallScore: gemini.score,
        fluency: gemini.fluency ?? gemini.score,
        grammar: gemini.grammar ?? gemini.score,
        vocab: gemini.vocab ?? gemini.score,
        transcription: gemini.transcription,
        feedback: gemini.feedback,
        mistakes: gemini.mistakes,
      };
      if (user && gemini.mistakes.length > 0) {
        const captured: MistakeBankRow[] = gemini.mistakes.map((m) => ({
          user_id: user.id, subject_id: 'bi',
          original_question: m.original_question || prompt || activeSection,
          user_answer: m.user_answer, correct_answer: m.correct_answer,
          category: m.category, ai_explanation: m.ai_explanation,
        }));
        try { await saveMistakes(captured); } catch (e) { console.warn('[testbi] mistake_bank gagal:', e); }
      }
      const collected = [...collectedRef.current, { section: activeSection, ...dynamic }];
      collectedRef.current = collected;
      setTranscripts((p) => ({ ...p, [activeSection]: gemini.transcription }));
      const idx = BI_SECTIONS.indexOf(activeSection);
      if (idx < BI_SECTIONS.length - 1) {
        setActiveSection(BI_SECTIONS[idx + 1]);
        return;
      }
      const final = aggregateBiResults(collected);
      submittedRef.current = true;
      setFinalResult(final);
      setShowResult(true);
      // Jangan simpan score 0 ke submissions bila AI gagal atau markah 0
      if (user && final.overallScore > 0) {
        let subRes: { id: number } | null = null;
        try {
          subRes = await handleSubmitToSupabase({
            user_id: user.id, latihan_id: 2,
            score: final.overallScore, feedback: final.feedback,
            transcription: final.transcription ?? null,
          });
        } catch (e) { console.warn('[testbi] submit gagal:', e); }

        // Tuntut kuota harian secara atomik di database
        try {
          await claimDailyTestCompletion('bi', subRes?.id ?? null);
        } catch (e) {
          console.warn('[testbi] claim daily limit error:', e);
        }
      }
    } catch (err) {
      const errStr = err instanceof Error ? err.message : String(err);
      const isQuota = /429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(errStr);

      if (isQuota) {
        setInfo({
          icon: 'warning',
          title: 'System Busy',
          message: 'Sistem sedang sibuk. Cuba lagi sebentar.',
          primaryText: 'Try Again',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Close',
          onSecondary: () => setInfo(null),
        });
      } else if (err instanceof TruncatedGeminiResponseError) {
        setInfo({
          icon: 'warning',
          title: 'Answer Too Long',
          message: 'Answer too long — NO score given.\n\nPlease record again with a shorter answer.',
          primaryText: 'Try Again',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Close',
          onSecondary: () => setInfo(null),
        });
      } else {
        setInfo({
          icon: 'warning',
          title: 'AI Evaluation Unavailable',
          message: 'Could not be evaluated right now. Please ensure your audio is clear and try recording again.',
          primaryText: 'Try Again',
          onPrimary: () => {
            setInfo(null);
            reset();
          },
          secondaryText: 'Close',
          onSecondary: () => setInfo(null),
        });
      }
    } finally {
      setIsAnalyzing(false);
      stoppingRef.current = false;
    }
  }, [activeSection, user]);

  const stop = useCallback(async (questionForAI: string) => {
    if (isAnalyzing || !isRecording || stoppingRef.current) return;
    stoppingRef.current = true;
    const elapsed = limit - timeLeft;
    await finish(questionForAI, elapsed);
  }, [isAnalyzing, isRecording, limit, timeLeft, finish]);

  useEffect(() => {
    autoStopRef.current = (q: string) => stop(q === '__auto__' ? '' : q);
  }, [stop]);

  const reset = useCallback(() => {
    submittedRef.current = false;
    collectedRef.current = [];
    setFinalResult(null);
    setTranscripts({});
    setShowResult(false);
    setActiveSection('Part 1');
  }, []);

  return {
    activeSection, setActiveSection, isRecording, isAnalyzing,
    showResult, setShowResult, timeLeft, limit, info, setInfo,
    finalResult, transcripts, start, stop, reset,
  };
}
