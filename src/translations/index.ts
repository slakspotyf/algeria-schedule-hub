
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';

export type Locale = 'en' | 'fr' | 'ar';

export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  fr,
  ar
};

export const localeNames = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
};
