import React from 'react';
import { FileText, Shield, Users, Globe, Sparkles, Heart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TermsOfUse: React.FC = () => {
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {t('terms.title')}
              </h1>
              <p className="text-gray-600 mt-2">{t('terms.subtitle')}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('terms.description')}
            </p>

            <div className="space-y-8">
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span>{t('terms.serviceUsage.title')}</span>
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>{t('terms.serviceUsage.matching')}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>{t('terms.serviceUsage.approved')}</span>
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-6 border border-pink-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-pink-600" />
                  <span>{t('terms.userResponsibilities.title')}</span>
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{t('terms.userResponsibilities.accurate')}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-pink-500" />
                    <span>{t('terms.userResponsibilities.noMisleading')}</span>
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>{t('terms.clinicResponsibilities.title')}</span>
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>{t('terms.clinicResponsibilities.license')}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>{t('terms.clinicResponsibilities.transparent')}</span>
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span>{t('terms.platformResponsibilities.title')}</span>
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{t('terms.platformResponsibilities.secure')}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-green-500" />
                    <span>{t('terms.platformResponsibilities.notLiable')}</span>
                  </li>
                </ul>
              </section>

              <section className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-yellow-600" />
                  <span>{t('terms.disputeResolution.title')}</span>
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>{t('terms.disputeResolution.mediation')}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-yellow-500" />
                    <span>{t('terms.disputeResolution.court')}</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;