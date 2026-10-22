// Type definitions for Google AdSense on window
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export interface AdSenseConfig {
  /** Publisher ID, e.g. "ca-pub-1234567890123456". Empty string when unconfigured. */
  clientId: string;
  /** Responsive display ad unit slot ID for general banner placements. */
  defaultSlotId: string;
  /** Optional slot ID for public landing page placements. Falls back to defaultSlotId. */
  landingSlotId: string;
  /** True only when a valid ca-pub-* identifier has been configured via VITE_ADSENSE_CLIENT. */
  isEnabled: boolean;
  /** True in Vite development mode (`import.meta.env.DEV`). */
  isDev: boolean;
}

const rawClient = (import.meta.env.VITE_ADSENSE_CLIENT || '').trim();
const rawDefaultSlot = (import.meta.env.VITE_ADSENSE_SLOT || '').trim();
const rawLandingSlot = (import.meta.env.VITE_ADSENSE_SLOT_LANDING || '').trim();

// Ensure the publisher ID is strictly well-formed before marking enabled.
// Real Google AdSense client IDs start with "ca-pub-" followed by 16 numeric digits.
const isValidPublisherId = /^ca-pub-\d{10,20}$/.test(rawClient);

export const ADSENSE_CONFIG: AdSenseConfig = {
  clientId: isValidPublisherId ? rawClient : '',
  defaultSlotId: rawDefaultSlot,
  landingSlotId: rawLandingSlot || rawDefaultSlot,
  isEnabled: isValidPublisherId,
  isDev: Boolean(import.meta.env.DEV),
};

const ADSENSE_SCRIPT_ID = 'mybertutur-google-adsense-script';
let scriptLoadPromise: Promise<void> | null = null;

/**
 * Loads the official Google AdSense script (adsbygoogle.js) exactly once.
 * Reuses existing script tags to prevent duplicate script execution.
 */
export function loadAdSenseScript(clientId: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!clientId || !clientId.startsWith('ca-pub-')) {
    return Promise.reject(new Error('Invalid or missing Google AdSense Client ID.'));
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  const existing = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    if (existing.getAttribute('data-loaded') === 'true') {
      return Promise.resolve();
    }
    scriptLoadPromise = new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('AdSense script failed to load')), { once: true });
    });
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;

    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = () => {
      scriptLoadPromise = null;
      script.remove();
      reject(new Error('Failed to load Google AdSense library.'));
    };

    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}
