import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en';
import nl from './nl';

export const translations = { en, nl };
export const languages = ['en', 'nl'];
const DEFAULT_LANGUAGE = 'en';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: en,
});

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const savedLanguage = window.localStorage.getItem('language');
    return languages.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      window.localStorage.setItem('language', language);
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t: translations[language] }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
