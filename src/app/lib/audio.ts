/**
 * Web audio recorder — MediaRecorder-based replacement for the mobile app's
 * expo-audio layer (app-baru/src/lib/audioSafe.ts). Same guarantees:
 * real recording only, no mock scores; short/silent clips are rejected by
 * the caller (MIN_RECORD_SECONDS).
 */
export type WebRecording = {
  blob: Blob;
  mimeType: string;
  durationSeconds: number;
  objectUrl: string;
};

type RecorderState = {
  stream: MediaStream;
  recorder: MediaRecorder;
  chunks: Blob[];
  startedAt: number;
  mimeType: string;
};

let active: RecorderState | null = null;

export function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/mp4',
    'audio/aac',
    'audio/webm',
    'audio/ogg;codecs=opus',
  ];
  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      /* ignore */
    }
  }
  // Biarkan pelayar pilih format lalai tersendiri (contoh: Safari iOS memilih audio/mp4 secara automatik)
  return undefined;
}

export function hasGetUserMedia(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

export function isAudioRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    hasGetUserMedia()
  );
}

export async function requestMicPermission(): Promise<{
  granted: boolean;
  reason?: 'denied' | 'blocked' | 'unsupported';
}> {
  if (!hasGetUserMedia()) return { granted: false, reason: 'unsupported' };
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return { granted: true };
  } catch (e) {
    const err = e as { name?: string };
    if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
      return { granted: false, reason: 'denied' };
    }
    if (err?.name === 'NotFoundError' || err?.name === 'NotReadableError') {
      return { granted: false, reason: 'blocked' };
    }
    return { granted: false, reason: 'denied' };
  }
}

export async function startWebRecording(): Promise<void> {
  if (active) throw new Error('Rakaman sudah berjalan.');
  if (!hasGetUserMedia()) {
    const err = new Error('Buka di Safari atau Chrome');
    (err as unknown as { code: string }).code = 'UNSUPPORTED_BROWSER';
    throw err;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
    });
  } catch (e) {
    const errObj = e as { name?: string };
    if (errObj?.name === 'NotAllowedError' || errObj?.name === 'PermissionDeniedError') {
      const err = new Error('Benarkan akses mikrofon di Tetapan pelayar anda, kemudian cuba lagi');
      (err as unknown as { code: string }).code = 'PERMISSION_DENIED';
      throw err;
    }
    throw e;
  }

  const mimeType = pickMimeType();
  const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data);
  };
  const startedAt = Date.now();
  active = {
    stream,
    recorder,
    chunks,
    startedAt,
    mimeType: recorder.mimeType || mimeType || '',
  };
  recorder.start(250);
}

export async function stopWebRecording(): Promise<WebRecording> {
  const current = active;
  if (!current) throw new Error('Tiada rakaman aktif.');
  active = null;
  const { stream, recorder, chunks, startedAt, mimeType } = current;
  const blob: Blob = await new Promise((resolve, reject) => {
    recorder.onerror = () => reject(new Error('Rakaman gagal.'));
    recorder.onstop = () => {
      const detected = recorder.mimeType || mimeType;
      resolve(new Blob(chunks, detected ? { type: detected } : undefined));
    };
    try {
      recorder.stop();
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Rakaman gagal.'));
    }
  });
  stream.getTracks().forEach((t) => t.stop());
  const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  const actualMime = blob.type || recorder.mimeType || mimeType || 'audio/mp4';
  return {
    blob,
    mimeType: actualMime,
    durationSeconds,
    objectUrl: URL.createObjectURL(blob),
  };
}

export function cancelWebRecording(): void {
  const current = active;
  active = null;
  if (!current) return;
  try {
    current.recorder.stop();
  } catch {
    /* ignore */
  }
  current.stream.getTracks().forEach((t) => t.stop());
}

export function isRecording(): boolean {
  return active !== null;
}

export async function webBlobToBase64(blob: Blob): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Fail audio tidak dapat dibaca.'));
    reader.readAsDataURL(blob);
  });
  const idx = dataUrl.indexOf(',');
  return idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
}

export function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
