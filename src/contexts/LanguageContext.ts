import { createContext, useContext } from 'react';
import { Language } from '../utils/i18n';

export const LanguageContext = createContext<Language>('ko');

export function useLanguage(): Language {
  return useContext(LanguageContext);
}
