/** /app/* routes with auth guard — rendered from App.tsx. */
import { useState, useEffect } from 'react';
import { useRouter } from './router';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Dashboard } from './screens/Dashboard';
import { Academy } from './screens/Academy';
import { TestBM } from './screens/TestBM';
import { TestBI } from './screens/TestBI';
import { Leaderboard } from './screens/Leaderboard';
import { Library } from './screens/Library';
import { Progress } from './screens/Progress';
import { MistakeBank } from './screens/MistakeBank';
import { Settings } from './screens/Settings';

function LoginRequired() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const { path, navigate } = useRouter();

  // Simpan laluan sasaran secara automatik bila pengguna tidak login cuba buka skrin /app/*
  useEffect(() => {
    try {
      if (path && path.startsWith('/app')) {
        sessionStorage.setItem('redirect_after_login', path);
      }
    } catch {}
  }, [path]);

  const handleOpen = (m: 'signin' | 'signup') => {
    try {
      sessionStorage.setItem('redirect_after_login', path);
    } catch {}
    setMode(m);
    setOpen(true);
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F4F6FB] px-4 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1.5rem+env(safe-area-inset-top,0px))] dark:bg-[#060816]">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-2xl">
          🔒
        </div>
        <h1 className="mt-2.5 text-lg font-black text-slate-900 dark:text-white">
          Log Masuk Diperlukan
        </h1>
        <p className="mt-1 text-xs font-bold text-violet-600 dark:text-violet-400">
          Daftar percuma untuk guna app di web
        </p>

        {/* Butang terus di atas (above the fold) tanpa perlu scroll */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => handleOpen('signup')}
            className="btn-primary w-full !py-3 text-sm font-extrabold shadow-md"
          >
            Daftar Percuma (Mula Ujian) →
          </button>
          <button
            onClick={() => handleOpen('signin')}
            className="rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            Sudah Ada Akaun? Log Masuk
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-slate-400 dark:text-slate-400">
          Akses penuh modul BM &amp; BI, markah sebutan AI, dan mistake bank tanpa sebarang muat turun.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-2 w-full rounded-full py-1 text-xs font-semibold text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
        >
          ← Kembali ke Laman Utama
        </button>
      </div>
      <AuthModal open={open} onClose={() => setOpen(false)} initialMode={mode} />
    </div>
  );
}

export function AppRoutes() {
  const { path, navigate } = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      try {
        const dest = sessionStorage.getItem('redirect_after_login');
        if (dest && dest !== path && dest.startsWith('/app')) {
          sessionStorage.removeItem('redirect_after_login');
          navigate(dest as any);
        }
      } catch {}
    }
  }, [user, path, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center dark:bg-[#060816]">
        <div className="text-sm text-slate-500">Memuatkan…</div>
      </div>
    );
  }
  if (!user) return <LoginRequired />;

  if (path === '/app' || path === '/app/') return <Dashboard />;
  if (path === '/app/academy') return <Academy />;
  if (path === '/app/testbm') return <TestBM />;
  if (path === '/app/testbi') return <TestBI />;
  if (path === '/app/leaderboard') return <Leaderboard />;
  if (path === '/app/library') return <Library />;
  if (path === '/app/progress') return <Progress />;
  if (path === '/app/mistake-bank') return <MistakeBank />;
  if (path === '/app/settings') return <Settings />;
  return <Dashboard />;
}
