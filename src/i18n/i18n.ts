import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tr from "../locales/tr.json";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

// Gelişmiş otomatik dil tespiti fonksiyonu
const detectLanguage = () => {
  // 1. LocalStorage'dan kaydedilmiş dil tercihi
  const savedLanguage = localStorage.getItem('estyi-language');
  if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // 2. Tarayıcı dil ayarları
  const browserLang = navigator.language || navigator.languages?.[0] || '';

  // 3. Bölge ve zaman dilimi bilgisi
  const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();

  // Türkiye tespiti (TR bölgesi veya İstanbul zaman dilimi ya da tarayıcı dili tr)
  const isTurkey =
    locale?.includes('TR') ||
    timeZone === 'Europe/Istanbul' ||
    timeZone === 'Asia/Istanbul' ||
    browserLang?.startsWith('tr');

  // Suudi Arabistan tespiti (SA bölgesi, Riyad zaman dilimi veya tarayıcı dili ar-SA)
  const isSaudiArabia =
    locale?.includes('SA') ||
    timeZone === 'Asia/Riyadh' ||
    browserLang === 'ar-SA';

  if (isTurkey) return 'tr';
  if (isSaudiArabia) return 'ar';

  // Türkiye ve Suudi Arabistan dışı tüm bölgeler için varsayılan İngilizce
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: detectLanguage(),
    fallbackLng: "en",
    interpolation: { 
      escapeValue: false 
    },
    debug: false,
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false,
    keySeparator: '.',
    nsSeparator: ':',
    defaultNS: 'translation',
    ns: 'translation'
  });

// Dil değiştirme fonksiyonu
export const changeLanguage = (lng: string) => {
  localStorage.setItem('estyi-language', lng);
  i18n.changeLanguage(lng);
  
  // Arapça için RTL desteği
  if (lng === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lng;
  }
};

export default i18n;