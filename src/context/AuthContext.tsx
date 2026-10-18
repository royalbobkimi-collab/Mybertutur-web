import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** Whether Supabase env keys are present (used to gate auth UI). */
  isSupabaseConfigured: boolean;
  /**
   * One-shot human-readable notice from an OAuth redirect (e.g. the user
   * cancelled the Google consent screen). Set once per redirect, cleared
   * by the UI after it has been displayed.
   */
  authNotice: string | null;
  clearAuthNotice: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

/**
 * Read an OAuth error left in the URL after a Supabase → Google redirect
 * (implicit flow returns `#error=...`, PKCE-style returns `?error=...`).
 * Returns a friendly Malay message, or null when no error is present.
 * When an error IS found the error params are scrubbed from the URL so a
 * refresh doesn't replay the message (the real auth code / tokens, if any,
 * are untouched).
 */
function readOAuthErrorFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const query = new URLSearchParams(window.location.search);
  const hashStr = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  const hash = new URLSearchParams(hashStr);

  const get = (key: string) => query.get(key) ?? hash.get(key);
  const code = get('error_code') ?? get('error');
  const description = get('error_description') ?? '';
  if (!code) return null;

  // Scrub only the error params; keep everything else intact.
  const url = new URL(window.location.href);
  ['error', 'error_code', 'error_description', 'error_description'].forEach((k) =>
    url.searchParams.delete(k),
  );
  url.hash = '';
  window.history.replaceState({}, '', url.toString());

  if (/access_denied|cancelled|consent/i.test(`${code} ${description}`)) {
    return 'Log masuk Google dibatalkan. Anda boleh cuba semula bila-bila masa.';
  }
  if (/redirect/i.test(description)) {
    return 'Pengalihan log masuk tidak berjaya. Sila hubungi pentadbir untuk semak tetapan Redirect URL.';
  }
  return 'Log masuk Google tidak berjaya. Sila cuba semula.';
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toFriendlyError(err: unknown): string {
  const message =
    (err as { message?: string })?.message ??
    'Something went wrong. Please try again.';
  // Map the most common Supabase auth errors to human-friendly copy.
  if (/invalid login credentials/i.test(message)) {
    return 'Email atau kata laluan salah. Sila cuba lagi.';
  }
  if (/user already registered/i.test(message)) {
    return 'Email ini sudah berdaftar. Sila log masuk.';
  }
  if (/password should be/i.test(message)) {
    return 'Kata laluan mestilah sekurang-kurangnya 6 aksara.';
  }
  if (/unable to validate email/i.test(message)) {
    return 'Format email tidak sah.';
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Surface OAuth redirect errors (cancelled consent, bad redirect URL…)
    // exactly once, then clean them from the URL.
    const oauthError = readOAuthErrorFromUrl();
    if (oauthError && mounted) setAuthNotice(oauthError);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(toFriendlyError(error));
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw new Error(toFriendlyError(error));
    },
    [],
  );

  const signInWithGoogle = useCallback(async () => {
    // Redirect back to the landing page: this marketing site has no `/app`
    // route — pointing OAuth here only reloaded index.html via the SPA
    // fallback after login, with no session feedback at all.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(toFriendlyError(error));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const clearAuthNotice = useCallback(() => setAuthNotice(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isSupabaseConfigured,
      authNotice,
      clearAuthNotice,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [session, loading, authNotice, clearAuthNotice, signIn, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
