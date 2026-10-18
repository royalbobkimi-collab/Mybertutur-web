import { useCallback, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Reviews } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer, type LegalKind } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LegalDialog } from './components/LegalDialog';
import { CloseIcon } from './components/Icons';

type AuthMode = 'signin' | 'signup';

/** Dismissible banner for OAuth redirect notices (cancelled Google login…). */
function AuthNoticeBanner() {
  const { authNotice, clearAuthNotice } = useAuth();
  useEffect(() => {
    if (!authNotice) return;
    const timer = setTimeout(clearAuthNotice, 12_000);
    return () => clearTimeout(timer);
  }, [authNotice, clearAuthNotice]);
  if (!authNotice) return null;
  return (
    <div className="fixed inset-x-0 top-[72px] z-[90] flex justify-center px-4">
      <div
        role="alert"
        className="flex max-w-xl items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-3 text-sm text-amber-800 shadow-lg dark:border-amber-400/30 dark:bg-[#2a2110] dark:text-amber-200"
      >
        <span className="flex-1">{authNotice}</span>
        <button
          onClick={clearAuthNotice}
          aria-label="Tutup notis"
          className="rounded-full p-1 transition hover:bg-amber-100 dark:hover:bg-white/10"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [legalKind, setLegalKind] = useState<LegalKind | null>(null);

  const openAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);
  const closeLegal = useCallback(() => setLegalKind(null), []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-slate-800 dark:bg-[#070b18] dark:text-slate-100">
        <Navbar onOpenAuth={openAuth} />
        <AuthNoticeBanner />

        <main>
          <Hero onOpenAuth={openAuth} />
          <Features />
          <HowItWorks />
          <FAQ />
          <CTA onOpenAuth={openAuth} />
          {/* Reviews deliberately sit last, after all other content. */}
          <Reviews />
        </main>

        <Footer onOpenLegal={setLegalKind} />

        <AuthModal open={authOpen} onClose={closeAuth} initialMode={authMode} />
        <LegalDialog kind={legalKind} onClose={closeLegal} />
      </div>
    </AuthProvider>
  );
}