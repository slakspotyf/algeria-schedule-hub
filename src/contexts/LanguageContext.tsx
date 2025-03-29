
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, Locale, TranslationKey } from '@/translations';

type LanguageContextType = {
  locale: Locale;
  t: (key: TranslationKey) => string;
  changeLanguage: (newLocale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    // Check for saved language preference
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale && ['en', 'fr', 'ar'].includes(savedLocale)) {
      setLocale(savedLocale);
      document.documentElement.lang = savedLocale;
      if (savedLocale === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    }
  }, []);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    
    // Set RTL direction for Arabic
    if (newLocale === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
