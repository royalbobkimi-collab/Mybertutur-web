import { useCallback, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer, type LegalKind } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LegalDialog } from './components/LegalDialog';

type AuthMode = 'signin' | 'signup';

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

        <main>
          <Hero onOpenAuth={openAuth} />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing onOpenAuth={openAuth} />
          <FAQ />
          <CTA onOpenAuth={openAuth} />
        </main>

        <Footer onOpenLegal={setLegalKind} />

        <AuthModal open={authOpen} onClose={closeAuth} initialMode={authMode} />
        <LegalDialog kind={legalKind} onClose={closeLegal} />
      </div>
    </AuthProvider>
  );
}