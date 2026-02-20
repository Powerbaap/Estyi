import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">İşlem Rehberleri ve Fiyatlar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              2026 güncel fiyatlar, işlem süreçleri ve ülke karşılaştırmaları ile doğru kararı verin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Saç Ekimi FUE', price: '1.500-4.000 USD', slug: 'sac-ekimi-fue', cat: 'Saç & Kaş' },
              { title: 'Saç Ekimi DHI', price: '2.000-5.000 USD', slug: 'sac-ekimi-dhi', cat: 'Saç & Kaş' },
              { title: 'Burun Estetiği', price: '2.500-5.500 USD', slug: 'burun-estetigi', cat: 'Yüz' },
              { title: 'Diş İmplantı', price: '400-1.000 USD', slug: 'dis-implant', cat: 'Diş' },
              { title: 'Hollywood Gülüşü', price: '3.000-8.000 USD', slug: 'hollywood-gulus', cat: 'Diş' },
              { title: 'Zirkonyum Kaplama', price: '150-300 USD/diş', slug: 'zirkonyum-kaplama', cat: 'Diş' },
              { title: 'Göğüs Büyütme', price: '3.000-5.500 USD', slug: 'gogus-buyutme', cat: 'Göğüs' },
              { title: 'Liposuction', price: '2.000-5.000 USD', slug: 'liposuction', cat: 'Vücut' },
              { title: 'Karın Germe', price: '3.000-6.000 USD', slug: 'karin-germe', cat: 'Vücut' },
            ].map(item => (
              <Link
                key={item.slug}
                to={`/rehber/${item.slug}`}
                className="group border rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all"
              >
                <div className="text-xs text-blue-600 font-medium mb-1">{item.cat}</div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 mb-2">{item.title}</h3>
                <div className="text-green-600 font-semibold text-sm">Türkiye: {item.price}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/fiyat-endeksi"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700"
            >
              Tüm Fiyat Endeksini Gör →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
