import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, DollarSign, Globe, Calendar, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PROCEDURE_GUIDES } from '../../data/procedureGuideData';
import { useAuth } from '../../contexts/AuthContext';

const PriceIndex: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentDate = new Date().toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });
  const { user } = useAuth();

  const getCategoryName = (trName: string) => {
    const guide = PROCEDURE_GUIDES.find(g => g.category?.tr === trName);
    return (
      guide?.category?.[i18n.language as 'tr' | 'en' | 'ar'] ||
      guide?.category?.en ||
      guide?.category?.tr ||
      trName
    );
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: t('priceIndex.title'),
    description: t('priceIndex.subtitle'),
    url: 'https://estyi.com/fiyat-endeksi',
    creator: {
      '@type': 'Organization',
      name: 'Estyi',
    },
  };

  const categories = [
    {
      name: getCategoryName('Saç Ekimi'),
      items: PROCEDURE_GUIDES.filter(
        g => g.category?.tr === 'Saç Ekimi' || g.category?.en === 'Hair Transplant'
      ),
    },
    {
      name: getCategoryName('Estetik Cerrahi'),
      items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Estetik Cerrahi'),
    },
    {
      name: getCategoryName('Diş Tedavisi'),
      items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Diş Tedavisi'),
    },
    {
      name: getCategoryName('Vücut Şekillendirme'),
      items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Vücut Şekillendirme'),
    },
    {
      name: getCategoryName('Göğüs Cerrahisi'),
      items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Göğüs Cerrahisi'),
    },
    {
      name: getCategoryName('Cilt & Dermatoloji'),
      items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Cilt & Dermatoloji'),
    },
  ].filter(c => c.items.length > 0);

  return (
    <>
      <Helmet>
        <title>{t('priceIndex.title')} | Estyi</title>
        <meta name="description" content={t('priceIndex.subtitle')} />
        <link rel="canonical" href="https://estyi.com/fiyat-endeksi" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 text-emerald-200 text-sm mb-3">
              <Link to="/" className="hover:text-white">
                {t('common.home', 'Ana Sayfa')}
              </Link>
              <span>/</span>
              <span className="text-white">{t('priceIndex.title')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('priceIndex.title')}</h1>
            <p className="text-lg text-emerald-100 mb-6 max-w-2xl">{t('priceIndex.subtitle')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <BarChart3 className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">{PROCEDURE_GUIDES.length}+</div>
                <div className="text-xs text-emerald-200">{t('priceIndex.procedures')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Globe className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">7</div>
                <div className="text-xs text-emerald-200">{t('priceIndex.countries')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">{currentDate}</div>
                <div className="text-xs text-emerald-200">{t('priceIndex.updated')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">7</div>
                <div className="text-xs text-emerald-200">{t('priceIndex.comparison')}</div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div>
            <p className="text-gray-700 leading-relaxed">{t('priceIndex.intro')}</p>
          </div>
          {categories.map(cat => (
            <section key={cat.name} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                          {t('priceIndex.procedure')}
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">🇮🇳</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">🇲🇽</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">🇹🇷</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">🇹🇭</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">
                          🇵🇱
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">
                          🇬🇧
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">
                          🇺🇸
                        </th>
                        <th className="w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map(item => (
                        <tr key={item.slug} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link
                              to={`/rehber/${item.slug}`}
                              className="font-medium text-gray-900 hover:text-blue-600"
                            >
                              {(item.title?.tr || item.title?.en || '').split(' - ')[0]}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">{item.priceRange.india}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">{item.priceRange.mexico}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">{item.priceRange.turkey}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">{item.priceRange.thailand}</td>
                          <td className="px-4 py-3 text-xs text-gray-700 hidden md:table-cell">
                            {item.priceRange.poland}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700 hidden md:table-cell">
                            {item.priceRange.uk}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700 hidden md:table-cell">
                            {item.priceRange.usa}
                          </td>
                          <td className="px-4 py-3">
                            <Link to={`/rehber/${item.slug}`} className="text-blue-600">
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">{t('priceIndex.cta')}</h2>
              <p className="text-blue-100 mb-6">{t('priceIndex.ctaDescription')}</p>
              <Link
                to={user ? '/request/new' : '/signup'}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50"
              >
                <DollarSign className="w-5 h-5" />
                {t('priceIndex.ctaButton')}
              </Link>
            </div>
          </section>
          <div className="bg-gray-100 rounded-xl p-5 text-xs text-gray-500">
            <p className="font-semibold text-gray-600 mb-2">{t('priceIndex.about')}</p>
            <p>
              {t('priceIndex.aboutText')} {currentDate} {t('priceIndex.updated').toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceIndex;
