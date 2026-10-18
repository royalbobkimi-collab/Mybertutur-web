import { createClient } from '@supabase/supabase-js';

/**
 * Normalise a Supabase URL from the build environment.
 *
 * Production once crashed at startup ("Invalid supabaseUrl: Must be a valid
 * HTTP or HTTPS URL") because the Vercel env var contained a pasted Markdown
 * link — `[https://x.supabase.co](https://x.supabase.co)` — which starts with
 * `[` and fails supabase-js validation, leaving the React root blank.
 * This extracts the real URL from that formatting and trims stray whitespace.
 * Values that still aren't http(s) URLs return `undefined` so the app renders
 * with the "not configured" notice instead of crashing.
 */
function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  // Markdown link: [label](https://actual-url)
  const mdMatch = trimmed.match(/\((https?:\/\/[^)\s]+)\)/);
  if (mdMatch) return mdMatch[1];
  return /^https?:\/\//.test(trimmed) ? trimmed : undefined;
}

/** Trim whitespace/newlines accidentally pasted around the publishable key. */
function normalizeSupabaseKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const supabaseAnonKey = normalizeSupabaseKey(
  import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
);

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly during development so misconfiguration is obvious.
  console.warn(
    '[MyBertutur] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Create a .env file (see .env.example).',
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Single shared Supabase client for the web app.
 * The anon key is public and protected by Row Level Security on the backend.
 */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'mybertutur-auth',
    },
  },
);

export type AppUser = {
  id: string;
  email: string | null;
  fullName: string | null;
};
