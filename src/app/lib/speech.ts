/**
 * Audio soalan menggunakan Web SpeechSynthesis API.
 * Tiada auto-play — hanya dimainkan selepas interaksi sentuhan pengguna.
 * Jika suara bahasa sasaran (cth. ms-MY) tiada dalam pelayar/peranti,
 * butang disembunyikan tanpa ralat/crash.
 */
import { useEffect, useState, useCallback, useRef } from 'react';

export function useQuestionSpeech(text: string, lang: 'ms-MY' | 'en-US' | 'en-GB' = 'ms-MY') {
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceAvailable(false);
      return;
    }

    const checkVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        const prefix = lang.split('-')[0].toLowerCase();
        const match = voices.find(
          (v) => v.lang.toLowerCase() === lang.toLowerCase() || v.lang.toLowerCase().startsWith(prefix),
        );
        if (match) {
          voiceRef.current = match;
          setVoiceAvailable(true);
        } else {
          voiceRef.current = null;
          setVoiceAvailable(false);
        }
      } catch {
        setVoiceAvailable(false);
      }
    };

    checkVoices();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
      }
    };
  }, [text]);

  const toggle = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
      setIsPlaying(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying, text, lang]);

  return { voiceAvailable, isPlaying, toggle };
}
