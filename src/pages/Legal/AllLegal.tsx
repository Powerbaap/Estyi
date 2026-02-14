import React, { useEffect } from 'react';
import { FileText, Shield, User, Building2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SECTIONS = [
  { id: 'terms', icon: FileText },
  { id: 'privacy', icon: Shield },
  { id: 'noticeAtCollection', icon: FileText },
  { id: 'consent', icon: User },
  { id: 'ageGate', icon: User },
  { id: 'medicalDisclaimer', icon: AlertCircle },
  { id: 'clinicAgreement', icon: Building2 },
  { id: 'dataSecurity', icon: Shield },
] as const;

const AllLegal: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const renderContent = (key: string) => {
    const raw = t(key);
    if (!raw || raw === key) return null;
    const paragraphs = raw.split(/\n\n+/);
    return (
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {p.trim()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 sm:p-12">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {t('legal.full.pageTitle')}
              </h1>
              <p className="text-gray-600 mt-2">{t('legal.full.pageSubtitle')}</p>
            </div>
          </div>

          {/* Table of contents */}
          <nav className="mb-12 rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('legal.full.tocTitle')}</h2>
            <ul className="space-y-2">
              {SECTIONS.map(({ id, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {t(`legal.full.${id}Title`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {SECTIONS.map(({ id, icon: Icon }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Icon className="w-5 h-5" />
                  </span>
                  {t(`legal.full.${id}Title`)}
                </h2>
                {renderContent(`legal.full.${id}Content`)}
              </section>
            ))}
          </div>

          <p className="mt-12 text-sm text-gray-500 text-center">
            {t('legal.full.lastUpdated')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllLegal;
