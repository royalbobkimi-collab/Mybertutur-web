/** Shared dialogs + metric bars for test screens. */

export type InfoDialogConfig = {
  icon: 'info' | 'warning' | 'error' | 'lock';
  title: string;
  message: string;
  primaryText?: string;
  onPrimary?: () => void;
  secondaryText?: string;
  onSecondary?: () => void;
} | null;

export function InfoDialog({ config, onClose }: { config: InfoDialogConfig; onClose: () => void }) {
  if (!config) return null;
  const iconBg =
    config.icon === 'error'
      ? 'bg-red-500/15 text-red-500'
      : config.icon === 'warning' || config.icon === 'lock'
        ? 'bg-amber-500/15 text-amber-500'
        : 'bg-blue-500/15 text-blue-500';
  const glyph = config.icon === 'error' ? '✕' : config.icon === 'lock' ? '🔒' : config.icon === 'warning' ? '⚠' : 'ℹ';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={config.title}
      >
        <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-xl ${iconBg}`}>
          {glyph}
        </div>
        <h2 className="text-lg font-extrabold">{config.title}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {config.message}
        </p>
        <div className="mt-5 flex gap-2">
          {config.secondaryText ? (
            <button
              onClick={config.onSecondary ?? onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10"
            >
              {config.secondaryText}
            </button>
          ) : null}
          <button
            onClick={config.onPrimary ?? onClose}
            className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-extrabold text-white"
          >
            {config.primaryText ?? 'Faham'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-24 shrink-0 truncate text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${v}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-extrabold">{v}%</span>
    </div>
  );
}
