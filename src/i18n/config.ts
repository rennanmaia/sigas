import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { ptBR } from "./locales/pt-BR"

i18n
  .use(initReactI18next)
  .init({
    lng: "pt-BR",
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false
    },
    resources: {
      "pt-BR": ptBR
    }
  });

export default i18n;
