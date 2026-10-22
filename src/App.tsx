import { useCallback, useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AppOnWeb } from './components/AppOnWeb';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Reviews } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer, type LegalKind } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LegalDialog } from './components/LegalDialog';
import { CloseIcon } from './components/Icons';
import { AdBanner } from './components/AdBanner';

import { RouterProvider, useRouter as useAppRouter } from './app/router';
import { LanguageProvider } from './app/i18n';
import { PreferencesProvider } from './app/preferences';
import { AppRoutes } from './app/routes';

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

function MobileStickyBar() {
  const { navigate } = useAppRouter();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-2xl backdrop-blur-md md:hidden dark:border-white/10 dark:bg-[#070b18]/95">
      <button
        type="button"
        onClick={() => navigate('/app/academy')}
        className="btn-primary w-full !py-3.5 text-center text-sm font-extrabold shadow-glow"
      >
        Guna App di Web (Percuma) →
      </button>
    </div>
  );
}

function LandingPage({
  onOpenAuth,
  onOpenLegal,
}: {
  onOpenAuth: (mode: AuthMode) => void;
  onOpenLegal: (kind: LegalKind) => void;
}) {
  return (
    <div className="min-h-screen bg-white pb-[calc(5rem+env(safe-area-inset-bottom,0px))] text-slate-800 md:pb-0 dark:bg-[#070b18] dark:text-slate-100">
      <Navbar onOpenAuth={onOpenAuth} />
      <AuthNoticeBanner />

      <main>
        <Hero onOpenAuth={onOpenAuth} />
        <AppOnWeb />

        {/* Global responsive banner unit for home/landing visitors */}
        <section className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <AdBanner placement="landing-inline" />
        </section>

        <Features />
        <HowItWorks />
        <FAQ />
        <CTA onOpenAuth={onOpenAuth} />

        {/* Supplementary banner placement above reviews/footer */}
        <section className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <AdBanner placement="landing-footer" />
        </section>

        {/* Reviews deliberately sit last, after all other content. */}
        <Reviews />
      </main>

      <Footer onOpenLegal={onOpenLegal} />
      <MobileStickyBar />
    </div>
  );
}

function Root() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [legalKind, setLegalKind] = useState<LegalKind | null>(null);
  const { path } = useAppRouter();

  const openAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);
  const closeLegal = useCallback(() => setLegalKind(null), []);

  const isAppRoute = path.startsWith('/app');

  return (
    <>
      {isAppRoute ? (
        <LanguageProvider>
          <PreferencesProvider>
            <AppRoutes />
          </PreferencesProvider>
        </LanguageProvider>
      ) : (
        <LandingPage onOpenAuth={openAuth} onOpenLegal={setLegalKind} />
      )}

      <AuthModal open={authOpen} onClose={closeAuth} initialMode={authMode} />
      <LegalDialog kind={legalKind} onClose={closeLegal} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Root />
      </RouterProvider>
    </AuthProvider>
  );
}
