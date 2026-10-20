import { useState } from 'react';
import { AppShell } from '../shell';
import { useLanguage } from '../i18n';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppPreferences } from '../preferences';
import {
  ChevronRightIcon,
  SlidersIcon,
  UserIcon,
  AwardIcon,
  HeadphonesIcon,
  ShieldIcon,
  LogOutIcon,
} from '../components/Icons';

export function Settings() {
  const { lang, setLang, t, isEnglish } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const prefs = useAppPreferences();
  const [modal, setModal] = useState<string | null>(null);

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split('@')[0] : '') ||
    'Pelajar SPM';

  return (
    <AppShell activeRoute="/app/settings">
      <div className="space-y-4 pb-6">
        {/* Hero Card */}
        <div className="flex items-center gap-3.5 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-purple-500/10 text-xl text-[#7C3AED] dark:bg-purple-950/40">
            ⚙️
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-[#F8FAFC]">
              {t('settings.title') || 'Settings'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              {t('settings.subtitle') || 'Manage preferences and account settings.'}
            </p>
          </div>
        </div>

        {/* Section: DISPLAY */}
        <div className="space-y-1.5">
          <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
            {t('settings.groupDisplay') || 'DISPLAY'}
          </div>
          <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0F172A]">
            <div className="border-b border-slate-100 p-3.5 dark:border-white/5">
              <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                {t('settings.theme') || 'App Theme'}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                {t('settings.themeSub') || 'Choose dark or light theme'}
              </div>
              <div className="mt-2.5 flex rounded-[12px] border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-[#111827]">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 rounded-[9px] py-1.5 text-xs font-extrabold transition ${
                    theme === 'dark'
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🌙 {t('settings.themeDark') || 'Dark'}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 rounded-[9px] py-1.5 text-xs font-extrabold transition ${
                    theme === 'light'
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ☀️ {t('settings.themeLight') || 'Light'}
                </button>
              </div>
            </div>

            <div className="p-3.5">
              <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                {t('settings.language') || 'Language'}
              </div>
              <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                {t('settings.languageSub') || 'Choose Malay or English'}
              </div>
              <div className="mt-2.5 flex rounded-[12px] border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-[#111827]">
                <button
                  type="button"
                  onClick={() => setLang('bm')}
                  className={`flex-1 rounded-[9px] py-1.5 text-xs font-extrabold transition ${
                    lang === 'bm'
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🇲🇾 Bahasa Melayu
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`flex-1 rounded-[9px] py-1.5 text-xs font-extrabold transition ${
                    lang === 'en'
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Section: ACCOUNT */}
        <div className="space-y-1.5">
          <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
            {t('settings.groupAccount') || 'ACCOUNT'}
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm dark:divide-white/5 dark:border-white/10 dark:bg-[#0F172A]">
            <button
              type="button"
              onClick={() => setModal('account')}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-blue-500/10 text-[#2563EB] dark:bg-blue-950/40">
                <UserIcon size={18} color="#2563EB" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {t('settings.accountDetails') || 'Account Details'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {displayName} · {user?.email || 'Akaun Aktif'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </button>

            <button
              type="button"
              onClick={() => setModal('badges')}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-purple-500/10 text-[#7C3AED] dark:bg-purple-950/40">
                <AwardIcon size={18} color="#7C3AED" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {t('settings.myBadges') || 'Badges & Achievements'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {t('settings.myBadgesSub') || 'Track earned badges and progress'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </button>
          </div>
        </div>

        {/* Section: APP */}
        <div className="space-y-1.5">
          <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
            {t('settings.groupApp') || 'APP'}
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm dark:divide-white/5 dark:border-white/10 dark:bg-[#0F172A]">
            <button
              type="button"
              onClick={() => setModal('prefs')}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-purple-500/10 text-[#7C3AED] dark:bg-purple-950/40">
                <SlidersIcon size={18} color="#7C3AED" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {t('settings.appPrefs') || 'App Preferences'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  Speed {prefs.audioSpeed} · Auto-play {prefs.autoPlay ? 'On' : 'Off'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </button>

            <button
              type="button"
              onClick={() => setModal('support')}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-purple-500/10 text-[#7C3AED] dark:bg-purple-950/40">
                <HeadphonesIcon size={18} color="#7C3AED" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {t('settings.support') || 'Customer Service'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {t('settings.supportSub') || 'Help, feedback, or contact us'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </button>
          </div>
        </div>
        {/* Section: SECURITY */}
        <div className="space-y-1.5">
          <div className="px-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
            {t('settings.groupSecurity') || 'SECURITY'}
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-sm dark:divide-white/5 dark:border-white/10 dark:bg-[#0F172A]">
            <button
              type="button"
              onClick={() => setModal('privacy')}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-purple-500/10 text-[#7C3AED] dark:bg-purple-950/40">
                <ShieldIcon size={18} color="#7C3AED" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                  {t('settings.privacy') || 'Privacy Policy'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {t('settings.privacySub') || 'Review data and security terms'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#94A3B8" />
            </button>

            <button
              type="button"
              onClick={async () => {
                await signOut();
                window.location.href = '/';
              }}
              className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-red-500/10 text-[#EF4444] dark:bg-red-950/40">
                <LogOutIcon size={18} color="#EF4444" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-extrabold text-[#EF4444]">
                  {t('settings.logout') || 'Log Out'}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                  {t('settings.logoutSub') || 'Sign out from the app'}
                </div>
              </div>
              <ChevronRightIcon size={18} color="#EF4444" />
            </button>
          </div>
        </div>
      </div>
      {/* Modal Dialog */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#0F172A]"
            onClick={(e) => e.stopPropagation()}
          >
            {modal === 'prefs' && (
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t('prefs.title') || 'App Preferences'}
                </h2>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="text-xs font-bold text-slate-500">Audio Playback Speed</div>
                    <div className="mt-1.5 flex gap-2">
                      {(['0.75x', '1.0x', '1.25x', '1.5x'] as const).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => prefs.setAudioSpeed(sp)}
                          className={`flex-1 rounded-[10px] py-1.5 text-xs font-extrabold ${
                            prefs.audioSpeed === sp
                              ? 'bg-[#7C3AED] text-white'
                              : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Auto-play Question Audio
                    </span>
                    <button
                      type="button"
                      onClick={() => prefs.setAutoPlay(!prefs.autoPlay)}
                      className={`h-6 w-11 rounded-full p-0.5 transition ${
                        prefs.autoPlay ? 'bg-[#7C3AED]' : 'bg-slate-300 dark:bg-white/20'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition ${
                          prefs.autoPlay ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {modal === 'account' && (
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t('account.title') || 'Account Details'}
                </h2>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                    <span className="text-slate-400">Nama:</span>
                    <div className="font-extrabold text-slate-900 dark:text-white">{displayName}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                    <span className="text-slate-400">E-mel:</span>
                    <div className="font-extrabold text-slate-900 dark:text-white">{user?.email || 'Tiada'}</div>
                  </div>
                </div>
              </div>
            )}

            {modal === 'badges' && (
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t('badges.title') || 'Badges & Achievements'}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <div className="text-2xl">🥇</div>
                    <div className="mt-1 font-black">First Test</div>
                  </div>
                  <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                    <div className="text-2xl">🔥</div>
                    <div className="mt-1 font-black">Active Streak</div>
                  </div>
                </div>
              </div>
            )}

            {modal === 'support' && (
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Customer Support</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Untuk sebarang pertanyaan mengenai platform MyBertutur, hubungi kami di support@mybertutur.com.
                </p>
              </div>
            )}

            {modal === 'privacy' && (
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Privacy Policy</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Data rakaman audio anda digunakan secara selamat semata-mata untuk tujuan penilaian kecerdasan buatan (Gemini AI) dan analisis kelemahan lisan anda sendiri.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setModal(null)}
              className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-black text-white dark:bg-white dark:text-slate-900"
            >
              {isEnglish ? 'Close' : 'Tutup'}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
