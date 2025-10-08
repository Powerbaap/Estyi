import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, Sparkles, Heart, Star, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SafetyGuidelines: React.FC = () => {
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {t('safety.title')}
              </h1>
              <p className="text-gray-600 mt-2">{t('safety.subtitle')}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('safety.description')}
            </p>

            <div className="space-y-8">
              <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span>{t('safety.clinicVerification.title')}</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('safety.clinicVerification.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-sm">{t('safety.clinicVerification.license.title')}</span>
                    </div>
                    <p className="text-gray-700 text-xs">{t('safety.clinicVerification.license.description')}</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-sm">{t('safety.clinicVerification.certificate.title')}</span>
                    </div>
                    <p className="text-gray-700 text-xs">{t('safety.clinicVerification.certificate.description')}</p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-sm">{t('safety.clinicVerification.accreditation.title')}</span>
                    </div>
                    <p className="text-gray-700 text-xs">{t('safety.clinicVerification.accreditation.description')}</p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span>{t('safety.dataEncryption.title')}</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('safety.dataEncryption.description')}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{t('safety.dataEncryption.ssl')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{t('safety.dataEncryption.gdpr')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{t('safety.dataEncryption.server')}</span>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span>{t('safety.secureMessaging.title')}</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('safety.secureMessaging.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('safety.secureMessaging.e2e.title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('safety.secureMessaging.e2e.description')}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('safety.secureMessaging.fileSharing.title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('safety.secureMessaging.fileSharing.description')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>{t('safety.suspiciousActivity.title')}</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('safety.suspiciousActivity.description')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('safety.suspiciousActivity.report.title')}</h4>
                      <p className="text-gray-700 text-sm">{t('safety.suspiciousActivity.report.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-xl border border-yellow-200">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{t('safety.suspiciousActivity.support.title')}</h4>
                      <p className="text-gray-700 text-sm">{t('safety.suspiciousActivity.support.description')}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>{t('safety.tips.title')}</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Star className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{t('safety.tips.personal')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{t('safety.tips.suspicious')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{t('safety.tips.password')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{t('safety.tips.twoFactor')}</span>
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

export default SafetyGuidelines;