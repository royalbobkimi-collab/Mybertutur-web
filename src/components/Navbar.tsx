import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRightIcon, Logo, MenuIcon, MoonIcon, SunIcon } from './Icons';

const NAV_LINKS = [
  { label: 'Ciri-ciri', href: '#ciri' },
  { label: 'Cara Ia Berfungsi', href: '#cara' },
  { label: 'Harga', href: '#harga' },
  { label: 'Soalan Lazim', href: '#faq' },
];

export function Navbar({ onOpenAuth }: { onOpenAuth: (mode: 'signin' | 'signup') => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b18]/80'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My<span className="gradient-text">Bertutur</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Tukar tema"
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <a
                href="/app"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-500/10 dark:text-brand-200"
              >
                Dashboard <ArrowRightIcon size={15} />
              </a>
              <button
                onClick={() => void signOut()}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Log Keluar
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2.5 sm:flex">
              <button
                onClick={() => onOpenAuth('signin')}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Log Masuk
              </button>
              <button onClick={() => onOpenAuth('signup')} className="btn-primary !px-5 !py-2.5 text-sm">
                Cuba Percuma
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full border border-slate-200 p-2 text-slate-600 md:hidden dark:border-white/10 dark:text-slate-300"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden dark:border-white/10 dark:bg-[#0b1024]">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2">
              {user ? (
                <button
                  onClick={() => void signOut()}
                  className="btn-ghost flex-1 !py-2.5 text-sm"
                >
                  Log Keluar
                </button>
              ) : (
                <>
                  <button onClick={() => onOpenAuth('signin')} className="btn-ghost flex-1 !py-2.5 text-sm">
                    Log Masuk
                  </button>
                  <button onClick={() => onOpenAuth('signup')} className="btn-primary flex-1 !py-2.5 text-sm">
                    Cuba Percuma
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
