import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Lang, SUPPORTED_LANGS, TranslationDict, translations } from "../i18n/translations";

const STORAGE_KEY = "portfolio.lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (SUPPORTED_LANGS as string[]).includes(stored)) return stored as Lang;
  // Detection navigateur, fallback FR (audience principale)
  const nav = window.navigator.language?.toLowerCase() ?? "fr";
  return nav.startsWith("en") ? "en" : "fr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((prev) => (prev === "fr" ? "en" : "fr")), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t: translations[lang] }),
    [lang, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage doit etre utilise dans <LanguageProvider>");
  }
  return ctx;
}

/** Raccourci : retourne uniquement le dictionnaire pour la langue courante. */
export function useT(): TranslationDict {
  return useLanguage().t;
}
