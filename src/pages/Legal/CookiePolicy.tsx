import React from 'react';
import { Cookie, Settings, Shield, Sparkles, Heart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CookiePolicy: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 sm:p-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Cookie className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                {t('cookie.title')}
              </h1>
              <p className="text-gray-600 mt-2">{t('cookie.subtitle')}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('cookie.description')}
            </p>

            <div className="space-y-8">
              <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-yellow-600" />
                  <span>{t('cookie.types.title')}</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-yellow-500" />
                      <span>{t('cookie.types.essential.title')}</span>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {t('cookie.types.essential.description')}
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{t('cookie.types.analytics.title')}</span>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {t('cookie.types.analytics.description')}
                    </p>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>{t('cookie.types.language.title')}</span>
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {t('cookie.types.language.description')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>{t('cookie.management.title')}</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('cookie.management.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('cookie.management.accept.title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('cookie.management.accept.description')}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('cookie.management.reject.title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('cookie.management.reject.description')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Cookie className="w-5 h-5 text-green-600" />
                  <span>{t('cookie.settings.title')}</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-green-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('cookie.settings.essential.title')}</h4>
                      <p className="text-gray-700 text-sm">{t('cookie.settings.essential.status')}</p>
                    </div>
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-green-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('cookie.settings.analytics.title')}</h4>
                      <p className="text-gray-700 text-sm">{t('cookie.settings.analytics.status')}</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-green-200">
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('cookie.settings.language.title')}</h4>
                      <p className="text-gray-700 text-sm">{t('cookie.settings.language.status')}</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                      <div className="w-4 h-4 bg-white rounded-full ml-1"></div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;