import { useState, type ReactNode } from 'react';
import { useRouter } from './router';
import { useAuth } from '../context/AuthContext';
import { ArrowBackIcon } from './components/Icons';
import { Drawer } from './components/Drawer';
import { BottomNav } from './components/BottomNav';

export function LogoHeader({ size = 'small', label = 'MyBertutur' }: { size?: 'small' | 'medium'; label?: string }) {
  const logoSize = size === 'small' ? 30 : 36;
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative overflow-hidden rounded-[10px] bg-[#0F172A] shadow-sm"
        style={{ width: logoSize, height: logoSize }}
      >
        <div className="absolute rounded-[6px] bg-[#FFFFFF]" style={{ width: logoSize * 0.55, height: logoSize * 0.55, top: 0, left: 0 }} />
        <div className="absolute rounded-[6px] bg-[#D4AF37]" style={{ width: logoSize * 0.25, height: logoSize * 0.25, top: 0, right: 0 }} />
        <div className="absolute rounded-[6px] bg-[#0B3D91]" style={{ width: logoSize * 0.35, height: logoSize * 0.35, bottom: logoSize * 0.12, left: 0 }} />
        <div className="absolute rounded-[6px] bg-[#D81B60]" style={{ width: logoSize * 0.6, height: logoSize * 0.6, bottom: 0, right: 0 }} />
      </div>
      <span className="text-[17px] font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
        {label}
      </span>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  activeRoute,
  onBack,
  children,
  hideNav = false,
}: {
  title?: string;
  subtitle?: string;
  activeRoute: string;
  onBack?: string;
  children: ReactNode;
  hideNav?: boolean;
}) {
  const { navigate, path } = useRouter();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Pelajar';
  const firstInitial = (displayName.charAt(0) || 'P').toUpperCase();

  const isMainTab =
    !onBack &&
    (path === '/app' ||
      path === '/app/' ||
      path === '/app/academy' ||
      path === '/app/leaderboard' ||
      path === '/app/settings');

  return (
    <div
      className="min-h-[100dvh] w-full bg-[#030611] text-slate-900 transition-colors dark:text-[#F8FAFC]"
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Centered Mobile Frame (Max 430px) */}
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col bg-[#F4F6FB] shadow-2xl dark:border-x dark:border-white/5 dark:bg-[#060816]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-[#F4F6FB]/90 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-[#060816]/90">
          {isMainTab ? (
            <>
              {/* Hamburger button: 46x46 radius 16 */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Buka menu"
                className="flex h-[44px] w-[44px] flex-col items-center justify-center gap-1 rounded-[16px] border border-slate-200/80 bg-white shadow-sm transition active:scale-95 dark:border-white/10 dark:bg-white/5"
              >
                <div className="h-[2.5px] w-5 rounded-full bg-slate-800 dark:bg-[#F8FAFC]" />
                <div className="h-[2.5px] w-5 rounded-full bg-slate-800 dark:bg-[#F8FAFC]" />
                <div className="h-[2.5px] w-5 rounded-full bg-slate-800 dark:bg-[#F8FAFC]" />
              </button>

              <LogoHeader size="small" />

              {/* Avatar button: 46x46 radius 16 */}
              <button
                type="button"
                onClick={() => navigate('/app/settings')}
                aria-label="Profil & Tetapan"
                className="flex h-[44px] w-[44px] items-center justify-center rounded-[16px] bg-[#2563EB] text-base font-black text-white shadow-md transition active:scale-95"
              >
                {firstInitial}
              </button>
            </>
          ) : (
            <>
              {/* Inner screen back button */}
              <button
                type="button"
                onClick={() => navigate((onBack || '/app') as any)}
                aria-label="Kembali"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[16px] border border-slate-200 bg-white text-slate-800 shadow-sm transition active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-[#F8FAFC]"
              >
                <ArrowBackIcon size={20} />
              </button>
              <div className="min-w-0 flex-1 px-3 text-center">
                <h1 className="truncate text-base font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {title || 'MyBertutur'}
                </h1>
                {subtitle && (
                  <p className="truncate text-[11px] text-slate-500 dark:text-[#94A3B8]">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="w-[42px]" />
            </>
          )}
        </header>

        {/* Content Area */}
        <main className={`flex-1 px-4 ${hideNav ? 'pb-8' : 'pb-[92px]'} pt-3`}>
          {children}
        </main>

        {/* Floating Bottom Nav */}
        {!hideNav && <BottomNav activeRoute={activeRoute} />}

        {/* Sliding Hamburger Drawer */}
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  );
}

