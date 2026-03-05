import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface CompRow {
  aspect: string;
  left: string;
  right: string;
  winner?: 'left' | 'right' | 'equal';
}

interface CompData {
  slug: string;
  title: string;
  metaDesc: string;
  summary: string;
  leftLabel: string;
  rightLabel: string;
  rows: CompRow[];
  verdict: string;
  faq: { q: string; a: string }[];
  url: string;
}

interface ComparisonConfig {
  slug: string;
  localeKey: string;
  url: string;
  rows: { key: string; winner: 'left' | 'right' | 'equal' }[];
  faqKeys: string[];
}

const COMPARISON_CONFIGS: ComparisonConfig[] = [
  {
    slug: 'fue-vs-dhi',
    localeKey: 'fue_vs_dhi',
    url: 'https://estyi.com/karsilastirma/fue-vs-dhi',
    rows: [
      { key: 'technique', winner: 'equal' },
      { key: 'shaving', winner: 'right' },
      { key: 'capacity', winner: 'left' },
      { key: 'duration', winner: 'left' },
      { key: 'recovery', winner: 'right' },
      { key: 'cost', winner: 'left' },
      { key: 'sensitive', winner: 'right' },
      { key: 'longTerm', winner: 'equal' },
    ],
    faqKeys: ['q1', 'q2', 'q3'],
  },
  {
    slug: 'turkiye-vs-polonya-sac-ekimi',
    localeKey: 'turkey_vs_poland',
    url: 'https://estyi.com/karsilastirma/turkiye-vs-polonya-sac-ekimi',
    rows: [
      { key: 'cost', winner: 'left' },
      { key: 'regulation', winner: 'equal' },
      { key: 'flight', winner: 'right' },
      { key: 'volume', winner: 'left' },
      { key: 'package', winner: 'left' },
      { key: 'followup', winner: 'right' },
    ],
    faqKeys: ['q1', 'q2'],
  },
];

const ComparisonGuide: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const config = COMPARISON_CONFIGS.find(c => c.slug === slug);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('comparison.notFound.title')}</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            {t('comparison.notFound.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  const data: CompData = {
    slug: config.slug,
    title: t(`comparison.items.${config.localeKey}.title`),
    metaDesc: t(`comparison.items.${config.localeKey}.metaDesc`),
    summary: t(`comparison.items.${config.localeKey}.summary`),
    leftLabel: t(`comparison.items.${config.localeKey}.leftLabel`),
    rightLabel: t(`comparison.items.${config.localeKey}.rightLabel`),
    verdict: t(`comparison.items.${config.localeKey}.verdict`),
    url: config.url,
    rows: config.rows.map(rowConfig => ({
      aspect: t(`comparison.items.${config.localeKey}.rows.${rowConfig.key}.aspect`),
      left: t(`comparison.items.${config.localeKey}.rows.${rowConfig.key}.left`),
      right: t(`comparison.items.${config.localeKey}.rows.${rowConfig.key}.right`),
      winner: rowConfig.winner,
    })),
    faq: config.faqKeys.map(key => ({
      q: t(`comparison.items.${config.localeKey}.faq.${key}.q`),
      a: t(`comparison.items.${config.localeKey}.faq.${key}.a`),
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('comparison.breadcrumb.home'), item: 'https://estyi.com' },
      { '@type': 'ListItem', position: 2, name: t('comparison.breadcrumb.guide'), item: 'https://estyi.com/fiyat-endeksi' },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title.split(' —')[0],
        item: data.url,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{data.title} | Estyi</title>
        <meta name="description" content={data.metaDesc} />
        <link rel="canonical" href={data.url} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.metaDesc} />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-indigo-200 text-sm mb-4">
              <Link to="/" className="hover:text-white">
                {t('comparison.breadcrumb.home')}
              </Link>
              <span>/</span>
              <Link to="/fiyat-endeksi" className="hover:text-white">
                {t('comparison.breadcrumb.guide')}
              </Link>
              <span>/</span>
              <span className="text-white">{t('comparison.breadcrumb.comparison')}</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{data.title}</h1>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
              <p className="text-base text-white leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('comparison.table.title', { left: data.leftLabel, right: data.rightLabel })}
            </h2>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">{t('comparison.table.criterion')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-green-700">
                      {data.leftLabel}
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-blue-700">
                      {data.rightLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t ${
                        row.winner === 'left'
                          ? 'bg-green-50'
                          : row.winner === 'right'
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">{row.aspect}</td>
                      <td
                        className={`px-4 py-3 text-sm text-gray-700 ${
                          row.winner === 'left' ? 'font-semibold text-green-800' : ''
                        }`}
                      >
                        {row.winner === 'left' && (
                          <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                        )}
                        {row.left}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-gray-700 ${
                          row.winner === 'right' ? 'font-semibold text-blue-800' : ''
                        }`}
                      >
                        {row.winner === 'right' && (
                          <CheckCircle className="w-3 h-3 inline mr-1 text-blue-500" />
                        )}
                        {row.right}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('comparison.verdict.title')}</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="text-gray-700 leading-relaxed">{data.verdict}</p>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('comparison.faq.title')}</h2>
            <div className="space-y-4">
              {data.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {t('comparison.disclaimer.medical')}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t('comparison.disclaimer.data')}
                </p>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">{t('comparison.cta.title')}</h2>
              <p className="text-indigo-100 mb-6">
                {t('comparison.cta.description')}
              </p>
              <Link
                to={user ? '/request/new' : '/signup'}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors"
              >
                {t('comparison.cta.button')} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('comparison.others.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMPARISON_CONFIGS.filter(c => c.slug !== data.slug).map(c => (
                <Link
                  key={c.slug}
                  to={`/karsilastirma/${c.slug}`}
                  className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {t(`comparison.items.${c.localeKey}.title`).split(' —')[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t(`comparison.items.${c.localeKey}.leftLabel`)} vs {t(`comparison.items.${c.localeKey}.rightLabel`)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ComparisonGuide;
