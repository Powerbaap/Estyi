
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Shield,
  Heart,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { getGuideBySlug, PROCEDURE_GUIDES } from '../../data/procedureGuideData';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProcedureGuide: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug || '');
  const [openFaq, setOpenFaq] = useState<number[]>([0]);
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // Dil seçimi: 'tr', 'en', 'ar' (Varsayılan: 'tr')
  const currentLang = (['tr', 'en', 'ar'].includes(i18n.language?.split('-')[0]) 
    ? i18n.language.split('-')[0] 
    : 'tr') as 'tr' | 'en' | 'ar';

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

  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: guide.title[currentLang],
    description: guide.metaDescription[currentLang],
    url: `https://estyi.com/rehber/${guide.slug}`,
    dateModified: '2026-02-01',
    author: {
      '@type': 'Organization',
      name: 'Estyi',
      url: 'https://estyi.com',
    },
    mainEntity: {
      '@type': 'MedicalProcedure',
      name: guide.title[currentLang].split(' - ')[0],
      procedureType: 'https://schema.org/CosmeticProcedure',
      howPerformed: guide.steps.map((s: any) => s.desc[currentLang]).join(' '),
      followup: guide.recoveryTime[currentLang],
      risks: guide.risks.map((r: any) => r[currentLang]).join(', '),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((f: any) => ({
      '@type': 'Question',
      name: f.q[currentLang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a[currentLang],
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title[currentLang].split(' - ')[0],
    description: guide.summary[currentLang],
    totalTime: guide.duration[currentLang],
    step: guide.steps.map((step: any, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title[currentLang],
      text: step.desc[currentLang],
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
        name: guide.title[currentLang].split(' - ')[0],
        item: `https://estyi.com/rehber/${guide.slug}`,
      },
    ],
  };

  const countryNames = {
    india: { tr: 'Hindistan', en: 'India', ar: 'الهند' },
    mexico: { tr: 'Meksika', en: 'Mexico', ar: 'المكسيك' },
    turkey: { tr: 'Türkiye', en: 'Turkey', ar: 'تركيا' },
    thailand: { tr: 'Tayland', en: 'Thailand', ar: 'تايلاند' },
    poland: { tr: 'Polonya', en: 'Poland', ar: 'بولندا' },
    uk: { tr: 'İngiltere', en: 'UK', ar: 'المملكة المتحدة' },
    usa: { tr: 'ABD', en: 'USA', ar: 'الولايات المتحدة الأمريكية' },
  };

  const priceRows = [
    { flag: '🇮🇳', code: 'IN', name: countryNames.india[currentLang], price: guide.priceRange.india },
    { flag: '🇲🇽', code: 'MX', name: countryNames.mexico[currentLang], price: guide.priceRange.mexico },
    { flag: '🇹🇷', code: 'TR', name: countryNames.turkey[currentLang], price: guide.priceRange.turkey },
    { flag: '🇹🇭', code: 'TH', name: countryNames.thailand[currentLang], price: guide.priceRange.thailand },
    { flag: '🇵🇱', code: 'PL', name: countryNames.poland[currentLang], price: guide.priceRange.poland },
    { flag: '🇬🇧', code: 'GB', name: countryNames.uk[currentLang], price: guide.priceRange.uk },
    { flag: '🇺🇸', code: 'US', name: countryNames.usa[currentLang], price: guide.priceRange.usa },
  ];

  return (
    <>
      <Helmet>
        <title>{guide.title[currentLang]} | Estyi</title>
        <meta name="description" content={guide.metaDescription[currentLang]} />
        <link rel="canonical" href={`https://estyi.com/rehber/${guide.slug}`} />
        <meta property="og:title" content={guide.title[currentLang]} />
        <meta property="og:description" content={guide.metaDescription[currentLang]} />
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
              <span className="text-white">{guide.title[currentLang].split(' - ')[0]}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{guide.title[currentLang].split(' - ')[0]}</h1>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-6 border border-white/20">
              <p className="text-base text-white leading-relaxed">{guide.summary[currentLang]}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                <div className="text-xs text-blue-200">{t('guide.duration', 'Süre')}</div>
                <div className="font-bold text-sm">{guide.duration[currentLang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-300" />
                <div className="text-xs text-blue-200">{t('guide.recovery', 'İyileşme')}</div>
                <div className="font-bold text-sm">{guide.recoveryTime[currentLang]}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Stethoscope className="w-5 h-5 mx-auto mb-1 text-pink-300" />
                <div className="text-xs text-blue-200">{t('guide.anesthesia', 'Anestezi')}</div>
                <div className="font-bold text-sm">{guide.anesthesia[currentLang]}</div>
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
                          <span>{row.name}</span>
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
              {guide.steps.map((step: any, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title[currentLang]}</h3>
                    <p className="text-gray-600 text-sm mt-1">{step.desc[currentLang]}</p>
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
                {guide.suitableFor.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item[currentLang]}
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
                {guide.notSuitableFor.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item[currentLang]}
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
                {guide.risks.map((r: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {r[currentLang]}
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
              {guide.faq.map((item: any, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    aria-expanded={openFaq.includes(i)}
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">{item.q[currentLang]}</h3>
                    {openFaq.includes(i) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq.includes(i) && (
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t pt-3">{item.a[currentLang]}</div>
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
              {PROCEDURE_GUIDES.filter((g: any) => g.slug !== guide.slug)
                .slice(0, 6)
                .map((g: any) => (
                  <Link
                    key={g.slug}
                    to={`/rehber/${g.slug}`}
                    className="bg-white rounded-lg border p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs text-blue-600 mb-1">{g.category[currentLang]}</div>
                    <div className="font-medium text-gray-900 text-sm">{g.title[currentLang].split(' - ')[0]}</div>
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
