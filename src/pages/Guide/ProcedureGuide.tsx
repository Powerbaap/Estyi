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
  DollarSign,
  MapPin,
  ArrowRight,
  Star,
  Stethoscope,
  Calendar,
} from 'lucide-react';
import { getGuideBySlug, PROCEDURE_GUIDES } from '../../data/procedureGuideData';
import { useAuth } from '../../contexts/AuthContext';

const ProcedureGuide: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = getGuideBySlug(slug || '');
  const [openFaq, setOpenFaq] = useState<number[]>([0]);
  const { user } = useAuth();

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sayfa Bulunamadı</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const toggleFaq = (i: number) => {
    setOpenFaq(prev => (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]));
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: guide.title,
    description: guide.metaDescription,
    url: `https://estyi.com/rehber/${guide.slug}`,
    mainEntity: {
      '@type': 'MedicalProcedure',
      name: guide.title.split(' - ')[0],
      procedureType: 'https://schema.org/CosmeticProcedure',
      howPerformed: guide.steps.map(s => s.desc).join(' '),
      followup: guide.recoveryTime,
      risks: guide.risks.join(', '),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{guide.title} | Estyi</title>
        <meta name="description" content={guide.metaDescription} />
        <link rel="canonical" href={`https://estyi.com/rehber/${guide.slug}`} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.metaDescription} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
              <Link to="/" className="hover:text-white">
                Ana Sayfa
              </Link>
              <span>/</span>
              <span>Rehber</span>
              <span>/</span>
              <span className="text-white">{guide.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{guide.title.split(' - ')[0]}</h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-6">{guide.summary}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-300" />
                <div className="text-xs text-blue-200">Türkiye Fiyat</div>
                <div className="font-bold text-sm">{guide.priceRange.turkey}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-300" />
                <div className="text-xs text-blue-200">Süre</div>
                <div className="font-bold text-sm">{guide.duration}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-300" />
                <div className="text-xs text-blue-200">İyileşme</div>
                <div className="font-bold text-sm">{guide.recoveryTime}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Stethoscope className="w-5 h-5 mx-auto mb-1 text-pink-300" />
                <div className="text-xs text-blue-200">Anestezi</div>
                <div className="font-bold text-sm">{guide.anesthesia}</div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Fiyat Karşılaştırması (2026)
            </h2>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Ülke</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Fiyat Aralığı</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">Tasarruf</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t bg-green-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Türkiye</span>
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">En Uygun</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-700">{guide.priceRange.turkey}</td>
                    <td className="px-4 py-3 text-green-600 hidden md:table-cell">%60-70 tasarruf</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Avrupa
                    </td>
                    <td className="px-4 py-3 text-gray-700">{guide.priceRange.europe}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">-</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      ABD
                    </td>
                    <td className="px-4 py-3 text-gray-700">{guide.priceRange.usa}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-blue-600" />
              İşlem Süreci
            </h2>
            <div className="space-y-3">
              {guide.steps.map((step, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10 grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Kimler İçin Uygun?
              </h2>
              <ul className="space-y-2">
                {guide.suitableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Kimler İçin Uygun Değil?
              </h2>
              <ul className="space-y-2">
                {guide.notSuitableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Riskler
            </h2>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <ul className="space-y-2">
                {guide.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-2">
              {guide.faq.map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-gray-900 pr-4">{item.q}</h3>
                    {openFaq.includes(i) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq.includes(i) && (
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t pt-3">{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Ücretsiz Fiyat Teklifi Alın</h2>
              <p className="text-blue-100 mb-6">
                Estyi ile birden fazla sertifikalı klinikten anında fiyat teklifi alın.
              </p>
              <Link
                to={user ? "/request/new" : "/signup"}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50"
              >
                Teklif Al <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gray-100 rounded-xl p-5 text-xs text-gray-500">
              <p className="font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Medikal Bilgilendirme
              </p>
              <p>
                Bu sayfa genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Son güncelleme: Şubat 2026.
              </p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Diğer Rehberler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROCEDURE_GUIDES.filter(g => g.slug !== guide.slug)
                .slice(0, 6)
                .map(g => (
                  <Link
                    key={g.slug}
                    to={`/rehber/${g.slug}`}
                    className="bg-white rounded-lg border p-3 hover:shadow-md"
                  >
                    <div className="text-xs text-blue-600 mb-1">{g.category}</div>
                    <div className="font-medium text-gray-900 text-sm">{g.title.split(' - ')[0]}</div>
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
