/**
 * Web Gemini client — SAME backend contract as the mobile app's
 * `src/lib/gemini.ts`: every request is proxied through the Supabase Edge
 * Function `evaluate-oral`; the Gemini API key NEVER reaches the browser.
 * Prompts, JSON schema and sanitisation are ported verbatim so mobile and
 * web produce identical evaluation contracts.
 */
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const EDGE_FUNCTION_NAME = 'evaluate-oral';
const GEMINI_TIMEOUT_MS = 45_000;
const GEMINI_MAX_OUTPUT_TOKENS = 8_192;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} (timeout selepas ${Math.round(ms / 1000)}s).`)),
      ms,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

type GeminiCandidate = {
  content?: { parts?: Array<{ text?: string }> };
  finishReason?: string;
  promptFeedback?: { blockReason?: string };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

/** User-facing error raised when Gemini cuts its response short. */
export class TruncatedGeminiResponseError extends Error {
  readonly isGeminiTruncated = true;
  readonly finishReason: string;
  constructor(finishReason: string, hasPartialJson: boolean, message: string) {
    super(message);
    this.name = 'TruncatedGeminiResponseError';
    this.finishReason = finishReason;
    void hasPartialJson;
  }
}

function assertUsableGeminiResponse(
  data: GeminiResponse,
  label: string,
): { rawText: string } {
  const candidate = data?.candidates?.[0];
  const finishReason = candidate?.finishReason ?? '';
  const rawText = candidate?.content?.parts?.[0]?.text ?? '';

  if (finishReason && finishReason !== 'STOP') {
    const message =
      finishReason === 'MAX_TOKENS'
        ? `Gemini response for ${label} was cut short (MAX_TOKENS). Please record a shorter answer.`
        : `Gemini response stopped with reason: ${finishReason}`;
    throw new TruncatedGeminiResponseError(finishReason, false, message);
  }
  if (!rawText.trim()) {
    console.error(`[gemini] Empty text for ${label} — candidate:`, JSON.stringify(candidate));
    throw new Error(`Gemini returned empty text for ${label}`);
  }
  return { rawText };
}

export type EvaluatedSubject = 'bm' | 'bi';

export type GeminiMistake = {
  original_question: string;
  user_answer: string;
  correct_answer: string;
  category: string;
  ai_explanation: string;
};

export type GeminiEvaluationResult = {
  sebutan?: number;
  kelancaran?: number;
  tatabahasa?: number;
  fluency?: number;
  grammar?: number;
  vocab?: number;
  score: number;
  transcription: string;
  feedback: string;
  mistakes: GeminiMistake[];
};

export type PracticeQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  category: string;
};

export type MistakeContextItem = {
  category: string;
  original_question?: string;
  user_answer?: string;
  correct_answer?: string;
  ai_explanation?: string;
};

type GeminiProxyBody = {
  promptText: string;
  language?: EvaluatedSubject;
  audioBase64?: string;
  mimeType?: string;
  generationConfig?: Record<string, unknown>;
};

/** Shared budget-aware output contract (same wording as the app). */
const OUTPUT_CONTRACT_EN = [
  '',
  'OUTPUT BUDGET (strict — your response is cut off if you exceed it):',
  '- "transcription": verbatim only. No commentary, no quotes, no notes.',
  '- "feedback": AT MOST 2 short sentences. No bullet points, no headings, no lists.',
  '- "mistakes": AT MOST 3 errors, most important first. Fewer is better.',
  '- "ai_explanation": ONE short sentence each, no more than 15 words.',
  '- Use plain text only. Never use markdown, code fences, or escape sequences.',
  '- Do NOT restate the question and do NOT add any key outside the schema below.',
].join('\n');

const OUTPUT_CONTRACT_BM = [
  '',
  'HAD KOS OUTPUT (ketat — respons akan dipotong jika melebihi):',
  '- "transcription": transkrip perkataan sahaja. Tiada komen, tanda petik, atau nota.',
  '- "feedback": MAKSIMUM 2 ayat pendek. Tiada poin, tajuk, atau senarai.',
  '- "mistakes": MAKSIMUM 3 kesilapan, yang paling penting didahulukan. Kurang lebih baik.',
  '- "ai_explanation": SATU ayat pendek setiap satu, tidak melebihi 15 perkataan.',
  '- Guna teks biasa sahaja. Jangan guna markdown, backtick, atau urutan escape.',
  '- JANGAN ulang semula soalan dan JANGAN tambah kunci lain di luar skema di bawah.',
].join('\n');

/** Bina arahan (prompt) untuk Gemini mengikut subjek & bahagian ujian. */
export function buildPrompt(
  subject: EvaluatedSubject,
  sectionTitle: string,
  questionPrompt: string,
): string {
  const mistakeSchema =
    '[{"original_question": "...", "user_answer": "...", "correct_answer": "...", "category": "...", "ai_explanation": "..."}]';
  const schema =
    subject === 'bm'
      ? `{"sebutan": 0-100, "kelancaran": 0-100, "tatabahasa": 0-100, "score": 0-100, "transcription": "...", "feedback": "...", "mistakes": ${mistakeSchema}}`
      : `{"fluency": 0-100, "grammar": 0-100, "vocab": 0-100, "score": 0-100, "transcription": "...", "feedback": "...", "mistakes": ${mistakeSchema}}`;

  if (subject === 'bm') {
    return [
      'Anda adalah penilai rasmi ujian lisan Bahasa Melayu (SPM).',
      'Dengarkan rakaman audio pelajar dan nilai jawapan kepada soalan berikut.',
      '',
      `Bahagian ujian: ${sectionTitle}`,
      `Soalan: ${questionPrompt}`,
      '',
      'Sila lakukan perkara berikut:',
      '1. Transkripsikan jawapan pelajar dengan tepat ke dalam medan "transcription".',
      '2. Nilai setiap kriteria daripada 0 hingga 100:',
      '   - "sebutan" — ketepatan sebutan & intonasi,',
      '   - "kelancaran" — kelancaran bercakap tanpa tersekat,',
      '   - "tatabahasa" — ketepatan tatabahasa.',
      '3. Kira markah keseluruhan "score" (0-100).',
      '   PERATURAN PEMARKAHAN KETAT (AUDIT INTEGRITI):',
      '   - Jika rakaman HANYA membaca semula petikan tanpa menghuraikan/menjawab soalan, markah keseluruhan maksimum TIDAK BOLEH melebihi 25, dan sebutkan dalam feedback bahawa pelajar perlu menjawab soalan, bukan sekadar membaca teks.',
      '   - Jika rakaman senyap, tiada jawapan, tidak berkaitan langsung, atau hanya bunyi latar, berikan markah 0 untuk semua kriteria.',
      '4. Tulis "feedback" ringkas dan membina dalam Bahasa Melayu.',
      '',
      '5. Di dalam medan "mistakes", senaraikan kesalahan tatabahasa yang SEBENAR yang dilakukan oleh pelajar (maksimum 3 kesilapan, paling penting dahulu). Setiap objek mesti HANYA mempunyai lima medan ini:',
      '   - "original_question": soalan/topik yang diberi kepada pelajar (salin daripada bahagian "Soalan:" di atas).',
      '   - "user_answer": ayat/frasa yang SALAH yang betul-betul diucapkan pelajar (petik tepat daripada transkripsi anda).',
      '   - "correct_answer": versi yang telah dibetulkan untuk ayat/frasa yang sama.',
      '   - "category": peraturan tatabahasa yang dilanggar, contohnya "Kata Sendi", "Kata Majmuk", "Penjodoh Bilangan", "Kata Ganda", "Imbuhan meN-".',
      '   - "ai_explanation": penjelasan pendek dan bersemangat dalam Bahasa Melayu (maksimum 15 perkataan).',
      'Jika tiada kesalahan yang jelas, kembalikan "mistakes": [].',
      '',
      OUTPUT_CONTRACT_BM,
      '',
      'PENTING: Kembalikan HANYA objek JSON yang sah tanpa teks lain, dengan skema ini:',
      schema,
    ].join('\n');
  }

  return [
    'You are an official SPM English speaking test examiner.',
    "Listen to the student's audio recording and assess their answer to the following task.",
    '',
    `Test section: ${sectionTitle}`,
    `Question: ${questionPrompt}`,
    '',
    'Please do the following:',
    '1. Transcribe the student\'s response accurately into the "transcription" field.',
    '2. Rate each criterion from 0 to 100:',
    '   - "fluency" — flow, pace and coherence,',
    '   - "grammar" — grammatical accuracy,',
    '   - "vocab" — range and appropriateness of vocabulary.',
    '3. Calculate an overall "score" (0-100).',
    '   STRICT SCORING RULES (INTEGRITY AUDIT):',
    '   - If the student ONLY reads the prompt/text verbatim without addressing the task points or providing elaboration, maximum overall score MUST NOT exceed 25, and explicitly note in feedback that the student must answer the prompt rather than simply reading it.',
    '   - If the recording is silent, irrelevant noise, or empty of spoken answers, give 0 for all criteria.',
    '4. Write concise, constructive "feedback" in English.',
    '',
    '5. In the "mistakes" array, list the REAL grammatical errors the student actually made (up to 3, most important first). Each object must contain exactly these five keys:',
    '   - "original_question": the task the student was asked to do (copy from the "Question:" section above).',
    '   - "user_answer": the EXACT wrong sentence/phrase the student said (quote it directly from your transcription).',
    '   - "correct_answer": the corrected version of that exact sentence.',
    '   - "category": the grammar rule broken, e.g. "Tenses", "Subject-verb agreement", "Prepositions", "Article usage", "Vocabulary choice".',
    '   - "ai_explanation": a short, encouraging explanation in English.',
    'If there are no clear errors, return "mistakes": [].',
    '',
    OUTPUT_CONTRACT_EN,
    '',
    'IMPORTANT: Respond with ONLY a valid JSON object and nothing else, using exactly this schema:',
    schema,
  ].join('\n');
}

/** Selamatkan markah kepada integer 0-100 (fallback jika tidak sah). */
function clampScore(value: unknown, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

/** Hurai teks jawapan Gemini -> objek JSON. */
function parseJsonText(text: string, rawForDebug?: string): Record<string, unknown> {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch (parseErr) {
    console.error('[Gemini Raw Text Failed to Parse]:', rawForDebug ?? cleaned);
    throw parseErr;
  }
}

const MAX_MISTAKES_PER_RECORDING = 5;

/** Hurai medan "mistakes" daripada Gemini; buang yang tidak lengkap. */
function sanitizeMistakes(rawMistakes: unknown): GeminiMistake[] {
  if (!Array.isArray(rawMistakes)) return [];
  const result: GeminiMistake[] = [];
  for (const item of rawMistakes) {
    if (!item || typeof item !== 'object') continue;
    const m = item as Record<string, unknown>;
    const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
    const original_question = str(m.original_question);
    const user_answer = str(m.user_answer);
    const correct_answer = str(m.correct_answer);
    const category = str(m.category);
    const ai_explanation = str(m.ai_explanation);
    if (!user_answer || !correct_answer || !category) continue;
    result.push({ original_question, user_answer, correct_answer, category, ai_explanation });
    if (result.length >= MAX_MISTAKES_PER_RECORDING) break;
  }
  return result;
}

/** Panggil Edge Function evaluate-oral (JWT sesi dilampir automatik). */
async function invokeGeminiViaEdgeFunction(
  body: GeminiProxyBody,
): Promise<GeminiResponse> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase tidak dikonfigurasi — penilaian AI tidak tersedia.');
  }
  const { data, error } = await withTimeout(
    supabase.functions.invoke(EDGE_FUNCTION_NAME, {
      body: {
        audioBase64: body.audioBase64,
        promptText: body.promptText,
        language: body.language,
        ...(body.mimeType ? { mimeType: body.mimeType } : {}),
        ...(body.generationConfig ? { generationConfig: body.generationConfig } : {}),
      },
    }),
    GEMINI_TIMEOUT_MS,
    'Panggilan Gemini (Edge Function evaluate-oral)',
  );

  if (error) {
    let message = error.message || 'Panggilan Edge Function gagal.';
    let isApiKeyError = false;
    const ctx = (
      error as { context?: { json?: () => Promise<{ error?: string; details?: string }> } }
    ).context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const errBody = await ctx.json();
        if (errBody?.error) {
          message = errBody.details ? `${errBody.error}: ${errBody.details}` : errBody.error;
        }
        if (
          errBody?.error &&
          (String(errBody.error).includes('PERMISSION_DENIED') ||
            String(errBody.error).includes('API key') ||
            String(errBody.error).includes('API_KEY'))
        ) {
          isApiKeyError = true;
        }
        if (errBody?.error && String(errBody.error).includes('belum dikonfigurasi')) {
          isApiKeyError = true;
        }
      } catch {
        /* kekalkan mesej asal sekiranya badan bukan JSON */
      }
    }
    const apiError = new Error(message) as Error & { isGeminiApiKeyError?: boolean };
    apiError.isGeminiApiKeyError = isApiKeyError;
    throw apiError;
  }

  return (data ?? {}) as GeminiResponse;
}

export function encodeMimeType(mimeType: string): string {
  return mimeType.replace(/;.*/, '');
}

export async function evaluateAudioRecording(args: {
  audioBase64: string;
  subject: EvaluatedSubject;
  sectionTitle: string;
  questionPrompt: string;
  audioUri?: string;
  mimeType?: string;
}): Promise<GeminiEvaluationResult> {
  if (!args.audioBase64 || !args.audioBase64.trim()) {
    throw new Error('Audio base64 is empty.');
  }
  const audioBase64 = args.audioBase64.trim();

  const promptText = buildPrompt(args.subject, args.sectionTitle, args.questionPrompt);

  const data = await invokeGeminiViaEdgeFunction({
    promptText,
    language: args.subject,
    audioBase64,
    mimeType: args.mimeType ?? 'audio/wav',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
      maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
    },
  });

  const { rawText } = assertUsableGeminiResponse(data, 'audio recording');
  const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = parseJsonText(cleanedText, rawText);
  const score = clampScore(parsed.score, 0);

  return {
    sebutan: clampScore(parsed.sebutan, score),
    kelancaran: clampScore(parsed.kelancaran, score),
    tatabahasa: clampScore(parsed.tatabahasa, score),
    fluency: clampScore(parsed.fluency, score),
    grammar: clampScore(parsed.grammar, score),
    vocab: clampScore(parsed.vocab, score),
    score,
    transcription: typeof parsed.transcription === 'string' ? parsed.transcription : '',
    feedback: typeof parsed.feedback === 'string' ? parsed.feedback : '',
    mistakes: sanitizeMistakes(parsed.mistakes),
  };
}
