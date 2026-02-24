import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, DollarSign, Globe, Calendar, BarChart3 } from 'lucide-react';
import { PROCEDURE_GUIDES } from '../../data/procedureGuideData';
import { useAuth } from '../../contexts/AuthContext';

const PriceIndex: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const { user } = useAuth();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Estyi Estetik Fiyat Endeksi 2026',
    description: '7 ülkede estetik işlem fiyat karşılaştırması.',
    url: 'https://estyi.com/fiyat-endeksi',
    creator: {
      '@type': 'Organization',
      name: 'Estyi',
    },
  };

  const categories = [
    { name: 'Saç & Kaş', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Saç Ekimi' || g.category?.en === 'Hair Transplant') },
    { name: 'Yüz Cerrahisi', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Estetik Cerrahi') },
    { name: 'Diş', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Diş Tedavisi') },
    { name: 'Vücut Cerrahisi', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Vücut Şekillendirme') },
    { name: 'Göğüs Cerrahisi', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Göğüs Cerrahisi') },
    { name: 'Cilt & Dermatoloji', items: PROCEDURE_GUIDES.filter(g => g.category?.tr === 'Cilt & Dermatoloji') },
  ].filter(c => c.items.length > 0);

  return (
    <>
      <Helmet>
        <title>Estetik Fiyat Endeksi 2026 - 7 Ülke Karşılaştırma | Estyi</title>
        <meta
          name="description"
          content="2026 güncel estetik işlem fiyatları. Saç ekimi, burun estetiği, diş implant için 7 ülkenin fiyat aralıklarını karşılaştırın."
        />
        <link rel="canonical" href="https://estyi.com/fiyat-endeksi" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 text-emerald-200 text-sm mb-3">
              <Link to="/" className="hover:text-white">
                Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-white">Fiyat Endeksi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Estetik İşlemler Fiyat Endeksi 2026</h1>
            <p className="text-lg text-emerald-100 mb-6 max-w-2xl">
              7 ülkede estetik işlem fiyat aralıklarını karşılaştırın. Estyi platformundaki gerçek verilerden derlenen
              güncel fiyat aralıkları.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <BarChart3 className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">{PROCEDURE_GUIDES.length}+</div>
                <div className="text-xs text-emerald-200">İşlem</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Globe className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">7</div>
                <div className="text-xs text-emerald-200">Ülke</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">{currentDate}</div>
                <div className="text-xs text-emerald-200">Güncelleme</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-emerald-300" />
                <div className="font-bold text-lg">7</div>
                <div className="text-xs text-emerald-200">Ülke Karşılaştırma</div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div>
            <p className="text-gray-700 leading-relaxed">
              2026 fiyat endeksi, Hindistan, Meksika, Türkiye, Tayland, Polonya, İngiltere ve ABD gibi popüler
              destinasyonlarda seçili estetik işlemlerin tipik fiyat aralıklarını karşılaştırmalı olarak gösterir.
            </p>
          </div>
          {categories.map(cat => (
            <section key={cat.name} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">İşlem</th>
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
              <h2 className="text-2xl font-bold mb-3">Kişisel Fiyat Teklifinizi Alın</h2>
              <p className="text-blue-100 mb-6">
                Yukarıdaki fiyatlar genel aralıklardır. Kişisel teklif için talep oluşturun.
              </p>
              <Link
                to={user ? "/request/new" : "/signup"}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-50"
              >
                <DollarSign className="w-5 h-5" />
                Ücretsiz Teklif Al
              </Link>
            </div>
          </section>
          <div className="bg-gray-100 rounded-xl p-5 text-xs text-gray-500">
            <p className="font-semibold text-gray-600 mb-2">Fiyat Endeksi Hakkında</p>
            <p>
              Estyi platformu verileriyle derlenmiştir. Fiyatlar klinik ve kişisel faktörlere göre değişebilir.{' '}
              {currentDate} günceldir.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceIndex;
