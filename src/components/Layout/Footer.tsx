import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Globe, Sparkles, Heart, Star } from 'lucide-react';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
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
              Dünya çapında sertifikalı estetik kliniklerle hastaları buluşturuyoruz. Güvenli, şeffaf ve profesyonel hizmet.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2 group">
                <Shield className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span>GDPR Uyumlu</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Lock className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                <span>SSL Şifreli</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <Globe className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span>Dünya Çapında</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Destek</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Yardım Merkezi</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>SSS</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>İletişim</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/safety-guidelines" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Güvenlik</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2">
              <Star className="w-4 h-4 text-pink-400" />
              <span>Yasal</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Gizlilik Politikası</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Kullanım Şartları</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Çerez Politikası</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group" onClick={scrollToTopInstant}>
                  <span>Hakkımızda</span>
                  <div className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"></div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 sm:mt-12 pt-8 sm:pt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
            © 2025 Estyi. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
              <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>10,000+ güvenilir hasta tarafından tercih ediliyor</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;