import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('estyi-cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('estyi-cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('estyi-cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-700">
            {t('cookies.bannerText')}{' '}
            <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              {t('cookies.learnMore')}
            </a>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {t('cookies.decline')}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-colors"
          >
            {t('cookies.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
