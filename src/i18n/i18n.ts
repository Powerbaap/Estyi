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
  const browserLang = navigator.language || navigator.languages?.[0];
  
  // 3. IP tabanlı konum tespiti
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const region = Intl.DateTimeFormat().resolvedOptions().locale;
  
  // Arapça tespiti
  const arabicLanguages = ['ar', 'ar-SA', 'ar-AE', 'ar-EG', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-IQ', 'ar-KW', 'ar-QA', 'ar-BH', 'ar-OM', 'ar-YE', 'ar-MA', 'ar-TN', 'ar-DZ', 'ar-LY', 'ar-SD'];
  const arabicTimezones = [
    'Asia/Riyadh', 'Asia/Dubai', 'Africa/Cairo', 'Asia/Amman', 
    'Asia/Beirut', 'Asia/Damascus', 'Asia/Baghdad', 'Asia/Kuwait', 
    'Asia/Qatar', 'Asia/Bahrain', 'Asia/Muscat', 'Asia/Aden', 
    'Africa/Casablanca', 'Africa/Tunis', 'Africa/Algiers', 
    'Africa/Tripoli', 'Africa/Khartoum'
  ];
  
  // Türkçe tespiti
  const turkishLanguages = ['tr', 'tr-TR'];
  const turkishTimezones = ['Europe/Istanbul', 'Asia/Istanbul'];
  
  // İngilizce tespiti
  const englishLanguages = ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-NZ', 'en-ZA', 'en-IE'];
  const englishTimezones = [
    'America/New_York', 'America/Los_Angeles', 'America/Chicago', 
    'Europe/London', 'Europe/Dublin', 'Australia/Sydney', 
    'Australia/Melbourne', 'Pacific/Auckland'
  ];
  
  // Dil tespiti öncelik sırası
  if (arabicLanguages.includes(browserLang) || arabicTimezones.includes(timezone) || region?.includes('AR')) {
    return 'ar';
  } else if (turkishLanguages.includes(browserLang) || turkishTimezones.includes(timezone) || region?.includes('TR')) {
    return 'tr';
  } else if (englishLanguages.includes(browserLang) || englishTimezones.includes(timezone) || region?.includes('EN')) {
    return 'en';
  } else if (browserLang?.startsWith('ar')) {
    return 'ar';
  } else if (browserLang?.startsWith('tr')) {
    return 'tr';
  } else if (browserLang?.startsWith('en')) {
    return 'en';
  }
  
  // Varsayılan olarak İngilizce (uluslararası erişim için)
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