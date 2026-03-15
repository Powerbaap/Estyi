
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { getGuideBySlug, PROCEDURE_GUIDES } from '../../data/procedureGuideData';
import type { ProcedureGuideInfo } from '../../data/procedureGuideData';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProcedureGuide: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug || '');
  const [openFaq, setOpenFaq] = useState<number[]>([0]);
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // Dil seçimi: 'tr', 'en', 'ar', 'fr', 'es' (Varsayılan: 'en')
  const rawLang = i18n.language?.split('-')[0] || 'en';
  const currentLang = (['tr', 'en', 'ar', 'fr', 'es'].includes(rawLang) ? rawLang : 'en') as string;

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('guide.notFound', 'Sayfa Bulunamadı')}
          </h1>
          <Link to="/" className="text-blue-600 hover:underline">
            {t('guide.backHome', 'Ana Sayfaya Dön')}
          </Link>
        </div>
      </div>
    );
  }

  const toggleFaq = (i: number) => {
    setOpenFaq(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]));
  };

  const getLangText = (obj: Record<string, string> | undefined, fallback = '') => {
    if (!obj) return fallback;
    return obj[currentLang] || obj['en'] || obj['tr'] || fallback;
  };

  const guideTitle = getLangText(guide.title);
  const guideTitleShort = guideTitle.split(' - ')[0];
  const guideMetaDescription = getLangText(guide.metaDescription);

  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: guideTitle,
    description: guideMetaDescription,
    url: `https://estyi.com/rehber/${guide.slug}`,
    dateModified: '2026-02-01',
    author: {
      '@type': 'Organization',
      name: 'Estyi',
      url: 'https://estyi.com',
    },
    mainEntity: {
      '@type': 'MedicalProcedure',
      name: guideTitleShort,
      procedureType: 'https://schema.org/CosmeticProcedure',
      howPerformed: guide.steps.map((s) => getLangText(s.desc)).join(' '),
      followup: getLangText(guide.recoveryTime),
      risks: guide.risks.map((r) => getLangText(r)).join(', '),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((f) => ({
      '@type': 'Question',
      name: getLangText(f.q),
      acceptedAnswer: {
        '@type': 'Answer',
        text: getLangText(f.a),
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guideTitleShort,
    description: getLangText(guide.summary),
    totalTime: getLangText(guide.duration),
    step: guide.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: getLangText(step.title),
      text: getLangText(step.desc),
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: 'https://estyi.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Rehber',
        item: 'https://estyi.com/fiyat-endeksi',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guideTitleShort,
        item: `https://estyi.com/rehber/${guide.slug}`,
      },
    ],
  };

  const getCountryDisplayName = (countryKey?: string) => {
    if (!countryKey) return '';
    const key = `countries.${countryKey}`;
    const translated = t(key);
    return translated && translated !== key ? translated : countryKey;
  };

  const priceRows = [
    { flag: '🇮🇳', code: 'IN', countryKey: 'india', price: guide.priceRange.india },
    { flag: '🇲🇽', code: 'MX', countryKey: 'mexico', price: guide.priceRange.mexico },
    { flag: '🇹🇷', code: 'TR', countryKey: 'turkey', price: guide.priceRange.turkey },
    { flag: '🇹🇭', code: 'TH', countryKey: 'thailand', price: guide.priceRange.thailand },
    { flag: '🇵🇱', code: 'PL', countryKey: 'poland', price: guide.priceRange.poland },
    { flag: '🇬🇧', code: 'GB', countryKey: 'uk', price: guide.priceRange.uk },
    { flag: '🇺🇸', code: 'US', countryKey: 'usa', price: guide.priceRange.usa },
  ];

  return (
    <>
      <Helmet>
        <title>{guideTitle} | Estyi</title>
        <meta name="description" content={guideMetaDescription} />
        <link rel="canonical" href={`https://estyi.com/rehber/${guide.slug}`} />
        <meta property="og:title" content={guideTitle} />
        <meta property="og:description" content={guideMetaDescription} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-blue-200 text-sm mb-4">
              <Link to="/" className="hover:text-white">
                {t('guide.breadcrumbHome', 'Ana Sayfa')}
              </Link>
              <span>/</span>
              <Link to="/fiyat-endeksi" className="hover:text-white">
                {t('guide.breadcrumbGuide', 'Rehber')}
              </Link>
              <span>/</span>
              <span className="text-white">{guideTitleShort}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{guideTitleShort}</h1>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-base text-white leading-relaxed">{getLangText(guide.summary)}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                <div className="text-xs text-blue-200">{t('guide.duration', 'Süre')}</div>
                <div className="font-bold text-sm">{getLangText(guide.duration)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-300" />
                <div className="text-xs text-blue-200">{t('guide.recovery', 'İyileşme')}</div>
                <div className="font-bold text-sm">{getLangText(guide.recoveryTime)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Stethoscope className="w-5 h-5 mx-auto mb-1 text-pink-300" />
                <div className="text-xs text-blue-200">{t('guide.anesthesia', 'Anestezi')}</div>
                <div className="font-bold text-sm">{getLangText(guide.anesthesia)}</div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('guide.priceComparisonTitle', 'Bu İşlemi Yaptırmak Ne Kadar Tutar?')}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {t('guide.priceComparison', 'Fiyat Karşılaştırması (2026)')}
            </p>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      {t('guide.country', 'Ülke')}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                      {t('guide.priceRange', 'Fiyat Aralığı (USD)')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priceRows.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        <span className="inline-flex items-center gap-2">
                          <span>{row.flag}</span>
                          <span className="text-xs text-gray-400 font-mono">{row.code}</span>
                        <span>{getCountryDisplayName(row.countryKey)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('guide.procedureProcess', 'İşlem Nasıl Gerçekleşir?')}
            </h2>
            <div className="space-y-3">
              {guide.steps.map((step, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{getLangText(step.title)}</h3>
                    <p className="text-gray-600 text-sm mt-1">{getLangText(step.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10 grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {t('guide.suitableFor', 'Kimler İçin Uygun?')}
              </h2>
              <ul className="space-y-2">
                {guide.suitableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {getLangText(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                {t('guide.notSuitableFor', 'Kimler İçin Uygun Değil?')}
              </h2>
              <ul className="space-y-2">
                {guide.notSuitableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {getLangText(item)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('guide.risks', 'Bilinen Riskler Nelerdir?')}
            </h2>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <ul className="space-y-2">
                {guide.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {getLangText(r)}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('guide.faq', 'Sıkça Sorulan Sorular')}
            </h2>
            <div className="space-y-2">
              {guide.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    aria-expanded={openFaq.includes(i)}
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">{getLangText(item.q)}</h3>
                    {openFaq.includes(i) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq.includes(i) && (
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t pt-3">{getLangText(item.a)}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">
                {t('guide.getFreeQuote', 'Ücretsiz Fiyat Teklifi Alın')}
              </h2>
              <p className="text-blue-100 mb-6">
                {t(
                  'guide.getPersonalQuote',
                  'Estyi ile birden fazla sertifikalı klinikten anında fiyat teklifi alın.'
                )}
              </p>
              <Link
                to={user ? '/request/new' : '/signup'}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
              >
                {t('guide.getQuoteBtn', 'Teklif Al')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gray-100 rounded-xl p-5 text-xs text-gray-500">
              <p className="font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                {t('guide.medicalInfo', 'Medikal Bilgilendirme')}
              </p>
              <p>
                {t(
                  'guide.medicalDisclaimer',
                  'Bu sayfa genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez.'
                )}{' '}
                {t('guide.lastUpdated', 'Son güncelleme: Şubat 2026')}
                .
              </p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('guide.otherGuides', 'Diğer Rehberler')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROCEDURE_GUIDES.filter((g) => g.slug !== guide.slug)
                .slice(0, 6)
                .map((g: ProcedureGuideInfo) => (
                  <Link
                    key={g.slug}
                    to={`/rehber/${g.slug}`}
                    className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs text-blue-600 mb-1">{getLangText(g.category as unknown as Record<string, string>)}</div>
                    <div className="font-medium text-gray-900 text-sm">{getLangText(g.title as unknown as Record<string, string>).split(' - ')[0]}</div>
                    <div className="text-xs text-green-600 mt-1">{g.priceRange.turkey}</div>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProcedureGuide;
