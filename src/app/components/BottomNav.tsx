import { useRouter, isRouteActive } from '../router';
import { useLanguage } from '../i18n';
import { HomeIcon, BookOpenIcon, AwardIcon, SettingsIcon } from './Icons';

export function BottomNav({ activeRoute }: { activeRoute: string }) {
  const { navigate, path } = useRouter();
  const { t } = useLanguage();

  const navItems = [
    { key: 'dashboard', label: t('nav.home') || 'Home', icon: HomeIcon, route: '/app' as const },
    { key: 'subject', label: t('nav.subject') || 'Subject', icon: BookOpenIcon, route: '/app/academy' as const },
    { key: 'leaderboard', label: t('nav.leaderboard') || 'Rank', icon: AwardIcon, route: '/app/leaderboard' as const },
    { key: 'settings', label: t('nav.settings') || 'Settings', icon: SettingsIcon, route: '/app/settings' as const },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-2.5 left-1/2 z-40 w-[92%] max-w-[396px] -translate-x-1/2 rounded-[26px] border border-slate-200/90 bg-white/95 px-2 py-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(11,17,32,0.95)]"
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const active = isRouteActive(path, item.route) || activeRoute === item.route;
          const IconComponent = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.route)}
              className="relative flex flex-col items-center justify-center py-1 text-center transition active:scale-95"
            >
              {active ? (
                <div className="flex h-10 w-full max-w-[72px] items-center justify-center rounded-[20px] bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] shadow-[0_6px_16px_rgba(124,58,237,0.45)]">
                  <IconComponent size={19} color="#FFFFFF" />
                </div>
              ) : (
                <div className="flex h-10 items-center justify-center">
                  <IconComponent size={19} color="#94A3B8" />
                </div>
              )}
              <span
                className={`mt-0.5 text-[11px] font-bold tracking-tight ${
                  active
                    ? 'text-[#7C3AED] dark:text-white'
                    : 'text-slate-500 dark:text-[#64748B]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
