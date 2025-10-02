import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tr from "../locales/tr.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr }
    },
    lng: "tr", // Varsayılan dil
    fallbackLng: "tr", // Fallback dil
    interpolation: { 
      escapeValue: false 
    },
    debug: false, // Debug modunu kapat
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false,
    keySeparator: '.',
    nsSeparator: ':'
  });

export default i18n;