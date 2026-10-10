import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
