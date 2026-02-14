import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage language switching and current language
 * Provides access to i18n instance and current language code
 */
export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isPortuguese = currentLanguage.startsWith('pt');
  const isEnglish = currentLanguage.startsWith('en');

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    // Ensure localStorage is updated
    localStorage.setItem('i18nLanguage', code);
  };

  const toggleLanguage = () => {
    const newLang = isPortuguese ? 'en-US' : 'pt-BR';
    changeLanguage(newLang);
  };

  return {
    currentLanguage,
    isPortuguese,
    isEnglish,
    changeLanguage,
    toggleLanguage,
    i18n,
  };
}
