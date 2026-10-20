/**
 * Web i18n provider — same dictionary and behaviour as the mobile app's
 * `src/i18n/language.tsx` (default 'en', BM/EN toggle, {placeholder}
 * interpolation). Language is a non-sensitive preference, so localStorage
 * is an acceptable store on the web.
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
import { translations, type Lang, type TranslationKey } from './i18nStrings';

export type { Lang, TranslationKey };

const LANG_STORAGE_KEY = 'app.language';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  tf: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isEnglish: boolean;
};

function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, token: string) => {
    const value = params[token];
    return value === undefined ? match : String(value);
  });
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations.en[key],
  tf: (key, params) =>
    params ? interpolate(translations.en[key], params) : translations.en[key],
  isEnglish: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'bm' || saved === 'en') setLangState(saved);
    } catch {
      // Fail-open to 'en'.
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Preference persistence is best-effort.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = translations[lang];
    return {
      lang,
      setLang,
      t: (key: TranslationKey) => dict[key],
      tf: (key: TranslationKey, params?: Record<string, string | number>) =>
        params ? interpolate(dict[key], params) : dict[key],
      isEnglish: lang === 'en',
    };
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
