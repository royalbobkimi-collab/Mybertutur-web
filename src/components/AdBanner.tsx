import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CONFIG, loadAdSenseScript } from '../lib/adsense';

export type AdBannerPlacement = 'shell-bottom' | 'landing-inline' | 'landing-footer';

interface AdBannerProps {
  /** Responsive ad slot ID. Falls back to ADSENSE_CONFIG.defaultSlotId. */
  slotId?: string;
  /** Placement identifier for layout styling and analytics. */
  placement?: AdBannerPlacement;
  /** Custom class names to augment the outer container. */
  className?: string;
}

/**
 * Standard, policy-compliant Google AdSense responsive banner unit.
 *
 * Requirements:
 * - Uses official `adsbygoogle` push architecture.
 * - Guarded against duplicate pushes in React StrictMode (`pushedRef`).
 * - Reserves vertical layout space (min-height) to prevent Cumulative Layout Shift (CLS).
 * - Never shows simulated or fake ads when unconfigured; renders a clean dev-only preview in development.
 * - In production without valid credentials, collapses gracefully without taking layout space.
 * - Features clear "Iklan / Advertisement" label required by Google Publisher Policies.
 */
export function AdBanner({
  slotId,
  placement = 'shell-bottom',
  className = '',
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);
  const [adError, setAdError] = useState<string | null>(null);

  const effectiveSlotId = slotId || ADSENSE_CONFIG.defaultSlotId;
  const isConfigured = ADSENSE_CONFIG.isEnabled && Boolean(effectiveSlotId);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    let isMounted = true;

    loadAdSenseScript(ADSENSE_CONFIG.clientId)
      .then(() => {
        if (!isMounted || !insRef.current) return;

        // Ensure we only push to adsbygoogle once per mounted element
        if (pushedRef.current) return;
        if (insRef.current.getAttribute('data-adsbygoogle-status')) return;

        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          pushedRef.current = true;
        } catch (err) {
          console.error('[AdSense] Failed to push ad unit:', err);
          if (isMounted) {
            setAdError('Failed to initialize ad unit.');
          }
        }
      })
      .catch((err) => {
        console.warn('[AdSense] Script load error:', err);
        if (isMounted) {
          setAdError('Ad network unavailable.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isConfigured, effectiveSlotId]);

  // Dev placeholder: allows local design verification without serving fake live ads
  if (!isConfigured) {
    if (!ADSENSE_CONFIG.isDev) {
      // In production, render nothing if real AdSense credentials are not yet set
      return null;
    }

    return (
      <div
        className={`w-full overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-2 text-center dark:border-white/10 dark:bg-slate-900/40 ${className}`}
        aria-label="Google AdSense Placeholder"
      >
        <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Iklan / Advertisement (Dev Preview)
        </span>
        <div className="flex h-14 w-full items-center justify-center rounded-lg bg-slate-100/80 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
          AdSense Ready · Set <code className="mx-1 font-mono text-[11px] text-brand-600 dark:text-brand-400">VITE_ADSENSE_CLIENT</code> &amp; <code className="mx-1 font-mono text-[11px] text-brand-600 dark:text-brand-400">VITE_ADSENSE_SLOT</code>
        </div>
      </div>
    );
  }

  if (adError) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      data-ad-placement={placement}
      className={`mybertutur-ad-unit w-full overflow-hidden transition-all ${className}`}
    >
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500 uppercase">
          Iklan / Advertisement
        </span>
      </div>

      <div className="relative min-h-[50px] w-full overflow-hidden rounded-lg bg-slate-50 dark:bg-white/5">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '50px' }}
          data-ad-client={ADSENSE_CONFIG.clientId}
          data-ad-slot={effectiveSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
