import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Globe, Sparkles, Star } from 'lucide-react';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, ready, i18n } = useTranslation();

  // Dil bazlı fallback sistemi
  const fallbackTexts: Record<string, Record<string, string>> = {
    'footer.description': {
      tr: 'Dünya çapında sertifikalı estetik kliniklerle değişim arayanları buluşturuyoruz.',
      en: 'We bring together people seeking change with certified aesthetic clinics worldwide.',
      ar: 'نوحد بين الراغبين في التغيير وعيادات التجميل المعتمدة في جميع أنحاء العالم.'
    },
    'footer.gdpr': {
      tr: 'GDPR Uyumlu',
      en: 'GDPR Compliant',
      ar: 'متوافق مع GDPR'
    },
    'footer.ssl': {
      tr: 'SSL Şifreli',
      en: 'SSL Encrypted',
      ar: 'مشفر SSL'
    },
    'footer.worldwide': {
      tr: 'Dünya Çapında',
      en: 'Worldwide',
      ar: 'في جميع أنحاء العالم'
    },
    'footer.support': {
      tr: 'Destek',
      en: 'Support',
      ar: 'الدعم'
    },
    'footer.helpCenter': {
      tr: 'Yardım Merkezi',
      en: 'Help Center',
      ar: 'مركز المساعدة'
    },
    'footer.faq': {
      tr: 'SSS',
      en: 'FAQ',
      ar: 'الأسئلة الشائعة'
    },
    'footer.contact': {
      tr: 'İletişim',
      en: 'Contact',
      ar: 'اتصل بنا'
    },
    'footer.security': {
      tr: 'Güvenlik',
      en: 'Security',
      ar: 'الأمان'
    },
    'footer.legal': {
      tr: 'Yasal',
      en: 'Legal',
      ar: 'قانوني'
    },
    'footer.privacyPolicy': {
      tr: 'Gizlilik Politikası',
      en: 'Privacy Policy',
      ar: 'سياسة الخصوصية'
    },
    'footer.termsOfUse': {
      tr: 'Kullanım Şartları',
      en: 'Terms of Use',
      ar: 'شروط الاستخدام'
    },
    'footer.cookiePolicy': {
      tr: 'Çerez Politikası',
      en: 'Cookie Policy',
      ar: 'سياسة ملفات تعريف الارتباط'
    },
    'footer.aboutUs': {
      tr: 'Hakkımızda',
      en: 'About Us',
      ar: 'معلومات عنا'
    },
    'footer.copyright': {
      tr: '© 2026 Estyi. Tüm hakları saklıdır.',
      en: '© 2026 Estyi. All rights reserved.',
      ar: '© 2026 Estyi. جميع الحقوق محفوظة.'
    },
    'footer.trustMessage': {
      tr: '10,000+ güvenilir hasta tarafından tercih ediliyor',
      en: 'Trusted by 10,000+ patients worldwide',
      ar: 'موثوق به من قبل أكثر من 10,000 مريض في جميع أنحاء العالم'
    }
  };

  // Güvenli çeviri fonksiyonu - mevcut dile göre fallback kullan
  const safeTranslate = (key: string) => {
    if (ready) {
      const translation = t(key);
      // Eğer çeviri bulunduysa ve anahtar kendisi değilse kullan
      if (translation && translation !== key) {
        return translation;
      }
    }

    // Fallback: mevcut dile göre uygun metni döndür
    const currentLang = i18n.language || 'tr';
    const fallback = fallbackTexts[key];
    if (fallback && fallback[currentLang]) {
      return fallback[currentLang];
    }

    // Son çare: Türkçe fallback
    if (fallback && fallback.tr) {
      return fallback.tr;
    }

    return key; // Hiçbir şey bulunamazsa anahtarı döndür
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group" onClick={scrollToTopInstant}>
              <div className="group-hover:rotate-12 transition-transform duration-300">
                <Logo />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Estyi</span>
            </Link>
            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-md leading-relaxed">
              {safeTranslate('footer.description')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2 group">
                <Shield className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span>{safeTranslate('footer.gdpr')}</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Lock className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                <span>{safeTranslate('footer.ssl')}</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Globe className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span>{safeTranslate('footer.worldwide')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{safeTranslate('footer.support')}</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.helpCenter')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.faq')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.contact')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/safety-guidelines" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.security')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
              <Star className="w-4 h-4 text-pink-400" />
              <span>{safeTranslate('footer.legal')}</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.privacyPolicy')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.termsOfUse')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.cookiePolicy')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>{safeTranslate('footer.aboutUs')}</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 sm:mt-12 pt-8 sm:pt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            {safeTranslate('footer.copyright')}
          </p>

        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);