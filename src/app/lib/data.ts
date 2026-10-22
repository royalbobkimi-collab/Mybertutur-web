/**
 * Web data layer — same tables, queries and contracts as the mobile app's
 * `src/lib/supabase.ts` + `src/lib/testResults.ts`, but Supabase-only:
 * persistent learning data ALWAYS comes from the real backend (no local
 * cache standing in for account records). RLS protects every row via the
 * authenticated session attached by supabase-js.
 */
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export { isSupabaseConfigured };

/* ───────────────────────────────────────────────────────────
 * Mistake Bank (table `mistake_bank`, migration 20260816)
 * ─────────────────────────────────────────────────────────── */

export type MistakeBankRow = {
  user_id: string;
  subject_id: string;
  original_question: string;
  user_answer: string;
  correct_answer: string;
  category: string;
  ai_explanation: string;
};

export type MistakeBankRecord = MistakeBankRow & {
  id: string;
  mastery_level: number;
  created_at: string;
};

export async function saveMistakes(rows: MistakeBankRow[]): Promise<void> {
  if (rows.length === 0) return;
  const { error } = await supabase.from('mistake_bank').insert(rows);
  if (error) throw new Error(error.message);
}

export async function fetchMistakes(userId: string): Promise<MistakeBankRecord[]> {
  const { data, error } = await supabase
    .from('mistake_bank')
    .select(
      'id,user_id,subject_id,original_question,user_answer,correct_answer,ai_explanation,category,mastery_level,created_at',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as MistakeBankRecord[];
}

export async function fetchUnmasteredMistakes(
  userId: string,
): Promise<Pick<MistakeBankRecord, 'category'>[]> {
  const { data, error } = await supabase
    .from('mistake_bank')
    .select('category')
    .eq('user_id', userId)
    .lt('mastery_level', 3)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`${error.message} [${error.code ?? 'unknown'}]`);
  return (data ?? []) as Pick<MistakeBankRecord, 'category'>[];
}

export async function incrementCategoryMastery(
  userId: string,
  category: string,
): Promise<number> {
  const { data: existing, error: fetchError } = await supabase
    .from('mistake_bank')
    .select('id, mastery_level')
    .eq('user_id', userId)
    .eq('category', category)
    .lt('mastery_level', 3);
  if (fetchError) throw new Error(fetchError.message);

  const rows = existing ?? [];
  if (rows.length === 0) return 0;

  let updated = 0;
  for (const row of rows) {
    const next = Math.min((row.mastery_level ?? 0) + 1, 3);
    const { error } = await supabase
      .from('mistake_bank')
      .update({ mastery_level: next })
      .eq('id', row.id);
    if (error) throw new Error(error.message);
    updated += 1;
  }
  return updated;
}

/* --- Submissions (table `submissions`) --- */

export type SubmitResultParams = {
  user_id: string;
  /** 1 = Bahasa Melayu, 2 = Bahasa Inggeris. */
  latihan_id: number;
  score: number;
  feedback?: string;
  transcription?: string | null;
};

export async function handleSubmitToSupabase(
  params: SubmitResultParams,
): Promise<{ id: number } | null> {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: params.user_id,
      latihan_id: params.latihan_id,
      score: params.score,
      feedback: params.feedback ?? '',
      transcription: params.transcription ?? '',
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data as { id: number } | null;
}

export type SubmissionRow = {
  id: number;
  latihan_id: number | null;
  score: number | null;
  feedback: string | null;
  transcription?: string | null;
  created_at: string;
};

export async function fetchSubmissions(userId: string): Promise<SubmissionRow[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('id, latihan_id, score, feedback, transcription, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as SubmissionRow[];
}

/* --- Test results (table `test_results`, migration 20261004) --- */

export type TestResultQuestionBreakdown = {
  question: number;
  score: number;
  feedback: string;
};

export type GeminiMistake = {
  original_question: string;
  user_answer: string;
  correct_answer: string;
  category: string;
  ai_explanation: string;
};

export type TestResult = {
  id: string;
  user_id: string;
  subject?: 'bm' | 'bi' | null;
  topic_title: string;
  section_type: string;
  overall_score: number;
  breakdown_scores: Record<string, number>;
  feedback: string;
  created_at: string;
  transcription?: string;
  weaknesses?: string[];
  mistakes_detected?: GeminiMistake[];
  improved_suggestion?: string;
  question_breakdown?: TestResultQuestionBreakdown[] | null;
  section_feedback?: Record<string, string> | null;
};

export type SaveTestResult = Omit<TestResult, 'id' | 'created_at'>;

function makeResultId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
  });
}

/** Tolak nilai rosak/rekod lama sebelum disimpan ke pangkalan data. */
function sanitizeFullAssessment(input: SaveTestResult): Partial<TestResult> {
  const cleanStringList = (value: unknown): string[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    const list = value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
    return list.length > 0 ? list.map((v) => v.trim()) : undefined;
  };
  const cleanMistakes = (value: unknown): GeminiMistake[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    const list = value.filter((m): m is GeminiMistake => {
      if (!m || typeof m !== 'object') return false;
      const mm = m as Record<string, unknown>;
      return (
        typeof mm.user_answer === 'string' &&
        typeof mm.correct_answer === 'string' &&
        typeof mm.category === 'string'
      );
    });
    return list.length > 0 ? list : undefined;
  };

  return {
    transcription:
      typeof input.transcription === 'string' && input.transcription.trim()
        ? input.transcription.trim()
        : undefined,
    weaknesses: cleanStringList(input.weaknesses),
    mistakes_detected: cleanMistakes(input.mistakes_detected),
    improved_suggestion:
      typeof input.improved_suggestion === 'string' && input.improved_suggestion.trim()
        ? input.improved_suggestion.trim()
        : undefined,
  };
}

function isTestResult(value: unknown, userId: string): value is TestResult {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<TestResult>;
  return (
    typeof r.id === 'string' &&
    r.user_id === userId &&
    typeof r.topic_title === 'string' &&
    typeof r.section_type === 'string' &&
    typeof r.overall_score === 'number' &&
    typeof r.feedback === 'string' &&
    typeof r.created_at === 'string'
  );
}

export async function saveTestResult(result: SaveTestResult): Promise<void> {
  const saved: TestResult = {
    ...result,
    ...sanitizeFullAssessment(result),
    id: makeResultId(),
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('test_results').insert(saved);
  if (error) {
    const isSchemaError = /column|does not exist|schema cache|PGRST204/i.test(error.message);
    if (isSchemaError) {
      // Migrasi lajur penuh belum dijalankan — simpan lajur asas sahaja.
      const {
        transcription: _t,
        weaknesses: _w,
        mistakes_detected: _m,
        improved_suggestion: _i,
        question_breakdown: _q,
        section_feedback: _sf,
        ...baseResult
      } = saved;
      const retry = await supabase.from('test_results').insert(baseResult);
      if (!retry.error) return;
      throw new Error(`Could not sync test result to the server: ${retry.error.message}`);
    }
    throw new Error(`Could not sync test result to the server: ${error.message}`);
  }
}

export async function getTestResults(userId: string): Promise<TestResult[]> {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && Array.isArray(data) && data.length > 0) {
      return data.filter((r) => isTestResult(r, userId));
    }
  } catch {
    /* fallback to submissions */
  }

  // Sandaran telus: muat daripada jadual submissions jika test_results kosong
  try {
    const subs = await fetchSubmissions(userId);
    return subs.map((s) => ({
      id: String(s.id),
      user_id: userId,
      subject: (s.latihan_id === 1 ? 'bm' : 'bi') as 'bm' | 'bi',
      topic_title: s.latihan_id === 1 ? 'Ujian Lisan BM (UBBM)' : 'Ujian Lisan BI (UBBI)',
      section_type: 'full_test',
      overall_score: typeof s.score === 'number' ? s.score : 0,
      breakdown_scores: {},
      feedback: s.feedback || '',
      transcription: s.transcription || '',
      created_at: s.created_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

/**
 * Statistik pantas pengguna diselaraskan terus daripada submissions & test_results
 * (jumlah ujian selesai & purata skor sebenar) supaya angka Home = Progress.
 */
export async function fetchUserTestStats(
  userId: string,
): Promise<{ count: number; avg: number | null }> {
  try {
    const [subsRes, testResultsRes] = await Promise.all([
      supabase.from('submissions').select('score').eq('user_id', userId),
      supabase.from('test_results').select('overall_score').eq('user_id', userId),
    ]);

    const subs = Array.isArray(subsRes.data) ? subsRes.data : [];
    const testResults = Array.isArray(testResultsRes.data) ? testResultsRes.data : [];

    const totalCount = subs.length || testResults.length;
    const validScores = subs.length
      ? subs
          .map((r) => r.score)
          .filter((s): s is number => typeof s === 'number' && !Number.isNaN(s) && s > 0)
      : testResults
          .map((r) => r.overall_score)
          .filter((s): s is number => typeof s === 'number' && !Number.isNaN(s) && s > 0);

    const avg = validScores.length
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : null;

    return { count: totalCount, avg };
  } catch (err) {
    console.warn('[fetchUserTestStats] error:', err);
  }
  return { count: 0, avg: null };
}

/* --- Profiles (table `profiles`) --- */

export type ProfileRow = {
  name: string | null;
  email: string | null;
  created_at: string | null;
};

export async function fetchProfile(userId: string): Promise<Partial<ProfileRow> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name,email,created_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Partial<ProfileRow> | null) ?? null;
}

export type UpsertProfileParams = {
  user_id: string;
  name?: string | null;
  email?: string | null;
};

export async function upsertProfile(
  params: UpsertProfileParams,
): Promise<Partial<ProfileRow> | null> {
  // Hantar hanya medan yang DISEDIAKAN — elakkan undefined menimpa data sedia ada.
  const body: { user_id: string } & Record<string, unknown> = {
    user_id: params.user_id,
  };
  if (params.name !== undefined) body.name = params.name ?? null;
  if (params.email !== undefined) body.email = params.email ?? null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert(body, { onConflict: 'user_id' })
    .select('name,email,created_at')
    .single();
  if (error) throw new Error(error.message);
  return (data as Partial<ProfileRow> | null) ?? null;
}

export async function updateAuthProfileMetadata(fields: {
  full_name?: string;
}): Promise<void> {
  const { error } = await supabase.auth.updateUser({ data: fields });
  if (error) throw new Error(error.message);
}

/* --- Leaderboard (submissions joined with profiles) --- */

export type LeaderboardEntry = {
  id: number;
  user_id: string;
  latihan_id: number | null;
  score: number | null;
  user_name: string;
  created_at: string;
};

export async function fetchLeaderboard(
  latihanFilter: number | null,
): Promise<LeaderboardEntry[]> {
  // 1. Cuba panggil RPC selamat get_public_leaderboard jika telah dicipta di Supabase
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_leaderboard', {
      p_latihan_id: latihanFilter,
    });
    if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData.map((r: any) => ({
        id: Number(r.id),
        user_id: String(r.user_id),
        latihan_id: r.latihan_id != null ? Number(r.latihan_id) : null,
        score: r.score != null ? Number(r.score) : null,
        created_at: String(r.created_at),
        user_name: String(r.display_name || '').trim() || `Pelajar ${String(r.user_id).slice(0, 4)}`,
      }));
    }
  } catch {
    // Abaikan jika RPC belum wujud
  }

  // 2. Fallback query terus ke submissions
  let query = supabase
    .from('submissions')
    .select('id, user_id, score, latihan_id, created_at')
    .not('score', 'is', null)
    .order('score', { ascending: false })
    .limit(100);
  if (latihanFilter !== null) query = query.eq('latihan_id', latihanFilter);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Array<{
    id: number;
    user_id: string;
    latihan_id: number | null;
    score: number | null;
    created_at: string;
  }>;

  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const nameById = new Map<string, string>();
  if (userIds.length > 0) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, username, name')
        .in('user_id', userIds);
      if (!profileError && profileData) {
        for (const p of profileData as Array<{
          user_id: string;
          username?: string | null;
          name?: string | null;
        }>) {
          const raw = (p.username || p.name || '').trim();
          const safe = raw.includes('@') ? raw.split('@')[0] : raw;
          if (safe) nameById.set(p.user_id, safe);
        }
      }
    } catch {
      // RLS pada profiles menyekat bacaan user lain
    }
  }

  return rows.map((r) => {
    const foundName = nameById.get(r.user_id);
    const fallbackName = `Pelajar ${r.user_id.slice(0, 4)}`;
    return {
      ...r,
      user_name: foundName || fallbackName,
    };
  });
}

/* --- Daily test limit status and claim (1 UBBM + 1 UBBI per Malaysia calendar day) --- */

export type DailyTestStatus = {
  klDate: string;
  bmDone: boolean;
  biDone: boolean;
};

/**
 * Dapatkan tarikh Malaysia (Asia/Kuala_Lumpur) dalam format YYYY-MM-DD.
 */
export function getMalaysiaDateString(): string {
  try {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kuala_Lumpur',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Semak status had harian ujian untuk pengguna semasa secara selamat dari Supabase.
 * Reset setiap tengah malam waktu Malaysia (Asia/Kuala_Lumpur).
 */
export async function fetchDailyTestStatus(userId: string): Promise<DailyTestStatus> {
  const klDate = getMalaysiaDateString();
  let bmDone = false;
  let biDone = false;

  // 1) Cuba RPC server-side jika migrasi 20261020 telah dijalankan di Supabase
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('my_daily_test_status');
    if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
      const row = rpcData[0] as { kl_date?: string; bm_done?: boolean; bi_done?: boolean };
      if (row.bm_done) bmDone = true;
      if (row.bi_done) biDone = true;
    }
  } catch {
    /* fallback to table checks */
  }

  // 2) Semakan jadual daily_test_completions
  try {
    const { data: completions, error: cErr } = await supabase
      .from('daily_test_completions')
      .select('subject')
      .eq('user_id', userId)
      .eq('kl_date', klDate);

    if (!cErr && Array.isArray(completions)) {
      for (const row of completions) {
        if (row.subject === 'bm') bmDone = true;
        if (row.subject === 'bi') biDone = true;
      }
    }
  } catch {
    /* fallback to submissions check */
  }

  // 3) Semakan telus jadual submissions untuk hari ini (waktu Malaysia UTC+8)
  // Memastikan had sentiasa berkuatkuasa walaupun RPC/daily_test_completions belum dikemas kini
  if (!bmDone || !biDone) {
    try {
      const [year, month, day] = klDate.split('-').map(Number);
      const startOfKlDayUtc = new Date(Date.UTC(year, month - 1, day, 0 - 8, 0, 0)).toISOString();
      const endOfKlDayUtc = new Date(Date.UTC(year, month - 1, day, 23 - 8, 59, 59, 999)).toISOString();

      const { data: subs, error: subsErr } = await supabase
        .from('submissions')
        .select('latihan_id, score, created_at')
        .eq('user_id', userId)
        .gte('created_at', startOfKlDayUtc)
        .lte('created_at', endOfKlDayUtc);

      if (!subsErr && Array.isArray(subs)) {
        for (const s of subs) {
          if (s.score != null && s.score > 0) {
            if (s.latihan_id === 1) bmDone = true;
            if (s.latihan_id === 2) biDone = true;
          }
        }
      }
    } catch (err) {
      console.warn('[daily-limit] Submissions check error:', err);
    }
  }

  return { klDate, bmDone, biDone };
}

/**
 * Tuntut kuota ujian harian sebaik sahaja ujian berjaya diserahkan.
 * Menghalang sebarang cubaan serentak di peringkat server.
 */
export async function claimDailyTestCompletion(
  subject: 'bm' | 'bi',
  submissionId?: number | string | null,
): Promise<{ success: boolean; alreadyDone: boolean }> {
  try {
    // Hantar submissionId null jika bukan integer untuk elak ralat sintaks bigint di Postgres
    const safeSubmissionId =
      typeof submissionId === 'number' && Number.isInteger(submissionId)
        ? submissionId
        : null;

    const { data, error } = await supabase.rpc('claim_daily_test', {
      p_subject: subject,
      p_submission_id: safeSubmissionId,
    });
    if (!error && typeof data === 'boolean') {
      return { success: data, alreadyDone: !data };
    }
  } catch {
    /* RPC might not be deployed yet */
  }

  // Cuba insert terus ke jadual daily_test_completions jika RPC belum tersedia
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (user) {
      const klDate = getMalaysiaDateString();
      const payload: { user_id: string; subject: string; kl_date: string; submission_id?: number | null } = {
        user_id: user.id,
        subject,
        kl_date: klDate,
      };
      if (typeof submissionId === 'number' && Number.isInteger(submissionId)) {
        payload.submission_id = submissionId;
      }
      const { error: insErr } = await supabase.from('daily_test_completions').insert(payload);
      if (!insErr) {
        return { success: true, alreadyDone: false };
      }
      if (insErr.code === '23505') {
        // Unique violation — limit reached for today
        return { success: false, alreadyDone: true };
      }
    }
  } catch (err) {
    console.warn('[daily-limit] Direct claim insert failed:', err);
  }

  return { success: true, alreadyDone: false };
}

/* --- Support tickets (Edge Function submit-support-ticket) --- */

export type SupportTicketInput = {
  category: string;
  message: string;
};

export async function submitSupportTicket(
  input: SupportTicketInput,
): Promise<{
  ok: boolean;
  emailSent?: boolean;
  error?: string;
  reason?: 'auth_required' | 'email_not_configured' | 'email_delivery_failed';
}> {
  if (!input || !input.message || !input.message.trim()) {
    return { ok: false, error: 'Mesej tidak boleh kosong.' };
  }
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Perkhidmatan sokongan tidak dikonfigurasi.' };
  }
  try {
    const { data, error } = await supabase.functions.invoke('submit-support-ticket', {
      body: {
        category: input.category?.trim() || 'lain-lain',
        message: input.message.trim(),
      },
    });
    if (error) {
      const status = (error as { context?: { status?: number } }).context?.status;
      return {
        ok: false,
        reason:
          status === 401 || error.message.toLowerCase().includes('jwt')
            ? 'auth_required'
            : undefined,
        error:
          status === 401
            ? 'Sesi log masuk telah tamat. Log masuk semula dan cuba lagi.'
            : error.message,
      };
    }
    if (!data?.ticketSaved) {
      return {
        ok: false,
        reason: data?.reason === 'auth_required' ? 'auth_required' : undefined,
        error:
          typeof data?.error === 'string' ? data.error : 'Tiket sokongan tidak dapat disimpan.',
      };
    }
    return {
      ok: true,
      emailSent: data.emailSent === true,
      reason: data.emailSent === true ? undefined : data.reason,
      error: typeof data.emailError === 'string' ? data.emailError : undefined,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Ralat tidak dijangka.' };
  }
}

/* --- Word Bank (table word_bank) for the Library --- */

export type WordBankRow = Record<string, unknown>;

export async function fetchWordBankRows(): Promise<WordBankRow[]> {
  const pageSize = 1000;
  const rows: WordBankRow[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from('word_bank')
      .select('*')
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`Unable to load the Word Bank: ${error.message}`);
    const page = data ?? [];
    rows.push(...(page as WordBankRow[]));
    if (page.length < pageSize) break;
  }
  return rows;
}
