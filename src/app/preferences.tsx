/**
 * Web preferences store — port of the mobile app's PreferencesProvider
 * (app-baru/src/state/PreferencesProvider.tsx). localStorage replaces
 * AsyncStorage; the same defaults and keys semantics are kept.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AudioSpeed = '0.75x' | '1.0x' | '1.25x' | '1.5x';

export const AUDIO_SPEEDS: AudioSpeed[] = ['0.75x', '1.0x', '1.25x', '1.5x'];

export function audioSpeedToRate(speed: AudioSpeed): number {
  switch (speed) {
    case '0.75x':
      return 0.75;
    case '1.25x':
      return 1.25;
    case '1.5x':
      return 1.5;
    case '1.0x':
    default:
      return 1.0;
  }
}

export type AppPreferences = {
  autoPlay: boolean;
  haptics: boolean;
  audioSpeed: AudioSpeed;
};

const STORAGE_KEY = 'app.preferences.v1';

const DEFAULTS: AppPreferences = {
  autoPlay: true,
  haptics: false,
  audioSpeed: '1.0x',
};

type PreferencesContextValue = AppPreferences & {
  ready: boolean;
  setAutoPlay: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setAudioSpeed: (v: AudioSpeed) => void;
};

const PreferencesContext = createContext<PreferencesContextValue>({
  ...DEFAULTS,
  ready: false,
  setAutoPlay: () => {},
  setHaptics: () => {},
  setAudioSpeed: () => {},
});

function loadInitial(): AppPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return {
      autoPlay: typeof parsed.autoPlay === 'boolean' ? parsed.autoPlay : DEFAULTS.autoPlay,
      haptics: typeof parsed.haptics === 'boolean' ? parsed.haptics : DEFAULTS.haptics,
      audioSpeed:
        parsed.audioSpeed && AUDIO_SPEEDS.includes(parsed.audioSpeed)
          ? parsed.audioSpeed
          : DEFAULTS.audioSpeed,
    };
  } catch {
    return DEFAULTS;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AppPreferences>(() =>
    typeof window === 'undefined' ? DEFAULTS : loadInitial(),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefs(loadInitial());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // best-effort
    }
  }, [prefs, ready]);

  const setAutoPlay = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, autoPlay: v }));
  }, []);
  const setHaptics = useCallback((v: boolean) => {
    setPrefs((p) => ({ ...p, haptics: v }));
  }, []);
  const setAudioSpeed = useCallback((v: AudioSpeed) => {
    setPrefs((p) => ({ ...p, audioSpeed: v }));
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({ ...prefs, ready, setAutoPlay, setHaptics, setAudioSpeed }),
    [prefs, ready, setAutoPlay, setHaptics, setAudioSpeed],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppPreferences(): PreferencesContextValue {
  return useContext(PreferencesContext);
}
