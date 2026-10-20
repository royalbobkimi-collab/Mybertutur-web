import { useRouter, isRouteActive } from '../router';
import { useAuth } from '../../context/AuthContext';
import { LogoHeader } from '../shell';
import { CloseIcon, LogOutIcon } from './Icons';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function Drawer({ open, onClose }: DrawerProps) {
  const { navigate, path } = useRouter();
  const { user, signOut } = useAuth();

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Pelajar SPM';
  const firstInitial = (displayName.charAt(0) || 'P').toUpperCase();
  const userHandle = user?.email ? `@${user.email.split('@')[0]}` : '@pelajar';

  const menuItems = [
    { key: 'utama', icon: '🏠', label: 'Home', route: '/app' },
    { key: 'ujian', icon: '🎤', label: 'Oral Test (BM)', route: '/app/testbm' },
    { key: 'ujianbi', icon: '🗣️', label: 'Oral Test (BI)', route: '/app/testbi' },
    { key: 'analisis', icon: '📈', label: 'Performance Analysis', route: '/app/leaderboard' },
    { key: 'peti', icon: '📚', label: 'Word Bank & Library', route: '/app/library' },
    { key: 'mistake', icon: '📝', label: 'Mistake Bank', route: '/app/mistake-bank' },
    { key: 'progress', icon: '📊', label: 'Progress Record', route: '/app/progress' },
    { key: 'leaderboard', icon: '🏆', label: 'Leaderboard', route: '/app/leaderboard' },
    { key: 'tetapan', icon: '⚙️', label: 'Settings', route: '/app/settings' },
  ];

  const handleMenuClick = (route: string) => {
    onClose();
    navigate(route as any);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#0F172A]">
        <div className="flex items-center justify-between pb-3">
          <LogoHeader size="small" />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          {/* Profile Card */}
          <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50 p-3.5 dark:border-white/10 dark:bg-[#111827]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#2563EB] text-xl font-black text-white shadow-lg">
              {firstInitial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                {displayName}
              </div>
              <div className="truncate text-xs text-slate-500 dark:text-[#94A3B8]">
                Pelajar SPM Aktif
              </div>
              <div className="truncate text-[11px] font-bold text-[#7C3AED]">
                {userHandle}
              </div>
            </div>
          </div>

          {/* Account Settings Yellow Card */}
          <button
            type="button"
            onClick={() => handleMenuClick('/app/settings')}
            className="mb-4 flex w-full items-center gap-3 rounded-[18px] border border-[#FDE68A] bg-[#FEF3C7] p-3 text-left shadow-sm dark:border-amber-500/30 dark:bg-amber-950/30"
          >
            <span className="text-xl">⚙️</span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-black text-[#92400E] dark:text-amber-200">
                Account Settings
              </div>
              <div className="text-[11px] text-[#B45309] dark:text-amber-400">
                Edit name, preferences, theme
              </div>
            </div>
          </button>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = isRouteActive(path, item.route);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleMenuClick(item.route)}
                  className={`flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left text-sm font-bold transition active:scale-98 ${
                    active
                      ? 'border border-[#BFDBFE] bg-[#DBEAFE] text-[#1D4ED8] dark:border-blue-700/40 dark:bg-[#1E3A8A]/30 dark:text-[#93C5FD]'
                      : 'border border-slate-200/60 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/5 dark:bg-[#111827] dark:text-slate-200'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Logout */}
        <div className="border-t border-slate-200 pt-3 dark:border-white/10">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await signOut();
              navigate('/');
            }}
            className="flex w-full items-center gap-3 rounded-[18px] border border-red-200 bg-red-50 px-3.5 py-3 text-left text-sm font-bold text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400"
          >
            <LogOutIcon size={18} color="#EF4444" />
            <span>Log Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
