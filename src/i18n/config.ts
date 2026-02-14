import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { ptBR } from "./locales/pt-BR"
import { enUS } from "./locales/en-US"

const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('i18nLanguage') || "pt-BR";
  }
  return "pt-BR";
};

i18n
  .use(initReactI18next)
  .init({
    lng: getSavedLanguage(),
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false
    },
    resources: {
      "pt-BR": {
        ...ptBR
      },
      "en-US": {
        ...enUS
      }
    }
  });

// Persist language preference to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nLanguage', lng);
    // Update HTML lang attribute
    document.documentElement.lang = lng;

    window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { detail: { language: lng } }));
  }
});
export default i18n;
