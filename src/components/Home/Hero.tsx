import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Heart, Star, ShieldCheck, Zap, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import { useAuth } from '../../contexts/AuthContext';
import PriceRequestModal from '../Dashboard/PriceRequestModal';
import Logo from '../Layout/Logo';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  

  const handlePriceRequestClick = () => {
    // Kullanıcı metadata'sından rolü al
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
    
    if (user && userRole === 'user') {
      setIsRequestModalOpen(true);
    }
  };

  return (
    <>
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 animate-float">
            <Sparkles className="w-8 h-8 text-purple-400 opacity-60" />
          </div>
          <div className="absolute top-40 right-20 animate-float animation-delay-1000">
            <Heart className="w-6 h-6 text-pink-400 opacity-60" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-float animation-delay-2000">
            <Star className="w-5 h-5 text-blue-400 opacity-60" />
          </div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.1%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="animate-bounce">
                <Logo size="lg" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mb-16">
              {user ? (
                (() => {
                  // Kullanıcı metadata'sından rolü al
                  const userRole = user?.user_metadata?.role || user?.app_metadata?.role;
                  
                  if (userRole === 'user') {
                    return (
                      <button
                        onClick={handlePriceRequestClick}
                        className="group inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden"
                      >
                        <span className="relative z-10">{t('home.hero.cta')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                      </button>
                    );
                  } else {
                    return (
                      <div className="inline-flex items-center space-x-3 px-10 py-5 bg-gray-400 text-white rounded-3xl font-bold text-xl cursor-not-allowed opacity-60">
                        <span>{t('home.hero.cta')}</span>
                      </div>
                    );
                  }
                })()
              ) : (
                <Link
                  to="/signup"
                  onClick={scrollToTopInstant}
                  className="group inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden"
                >
                  <span className="relative z-10">{t('home.hero.cta')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
                </Link>
              )}
              

            </div>

            {/* Video Placeholder (click message removed) */}
            <div className="relative inline-block group">
              <div
                onClick={() => {
                  scrollToTopInstant();
                  navigate('/signup');
                }}
                className="w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-3xl transform hover:scale-110 transition-all duration-500 group-hover:rotate-12"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-20 animate-ping group-hover:animate-pulse"></div>
              <div className="absolute -inset-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full opacity-10 animate-pulse"></div>
            </div>
          </div>

          {/* Özellikler: Fiyat Güvencesi, Anında Teklif, Anonim Paylaşım */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Fiyat Güvencesi */}
            <div className="relative group p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-white/60 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-gray-700 font-semibold text-lg tracking-wide text-center">{t('home.heroStats.netPrice')}</div>
              </div>
            </div>

            {/* Anında Teklif */}
            <div className="relative group p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-white/60 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-pink-600" />
                </div>
                <div className="text-gray-700 font-semibold text-lg tracking-wide text-center">{t('home.heroStats.instantOffer')}</div>
              </div>
            </div>

            {/* Anonim Paylaşım */}
            <div className="relative group p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-white/60 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <EyeOff className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-gray-700 font-semibold text-lg tracking-wide text-center">{t('home.heroStats.anonymousSharing')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Request Modal */}
      {isRequestModalOpen && (
        <PriceRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onRequestSubmitted={(request) => {
            setIsRequestModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Hero;
