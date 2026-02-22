import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

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

const COMPARISONS: CompData[] = [
  {
    slug: 'fue-vs-dhi',
    leftLabel: 'FUE',
    rightLabel: 'DHI',
    title: 'FUE vs DHI Saç Ekimi — Fark, Maliyet ve Hangisi Daha İyi? (2026)',
    metaDesc:
      'FUE ve DHI saç ekimi arasındaki farklar: teknik, maliyet, iyileşme süresi ve sonuçlar. 2026 güncel karşılaştırma.',
    summary:
      'FUE ve DHI saç ekiminde en yaygın iki yöntemdir. İkisi de etkindir; tercih, ekim alanı büyüklüğüne, tıraş tercihine ve klinik donanımına göre değişir. Birinin kesin üstün olduğuna dair bilimsel kanıt bulunmamaktadır.',
    rows: [
      {
        aspect: 'Teknik',
        left: 'Greft çıkarma → kanal açma → yerleştirme (3 aşama)',
        right: 'Choi kalemiyle eş zamanlı ekim (2 aşama)',
        winner: 'equal',
      },
      {
        aspect: 'Tıraş zorunluluğu',
        left: 'Genellikle gerekli',
        right: 'Tıraşsız uygulanabilir',
        winner: 'right',
      },
      {
        aspect: 'Büyük alan kapasitesi',
        left: '4.000–6.000+ greft',
        right: '3.000–4.000 greft için uygun',
        winner: 'left',
      },
      {
        aspect: 'İşlem süresi',
        left: '6–8 saat',
        right: '6–10 saat',
        winner: 'left',
      },
      {
        aspect: 'İyileşme süresi',
        left: '7–10 gün',
        right: '5–7 gün',
        winner: 'right',
      },
      {
        aspect: 'Ortalama maliyet (TR)',
        left: '1.500–4.000 USD',
        right: '2.000–5.000 USD',
        winner: 'left',
      },
      {
        aspect: 'Hassas bölge ekimi',
        left: 'Mümkün, daha fazla adım',
        right: 'Daha hassas kontrol',
        winner: 'right',
      },
      {
        aspect: 'Uzun vadeli sonuç',
        left: '20+ yıllık kanıtlanmış veri',
        right: 'İyi sonuçlar, daha kısa veri',
        winner: 'equal',
      },
    ],
    verdict:
      'Geniş alan için FUE, tıraşsız ekim veya saç çizgisi düzeltme için DHI daha pratiktir. Klinik deneyimi her iki yöntemden çok daha belirleyicidir.',
    faq: [
      {
        q: 'FUE mi DHI mi daha kalıcıdır?',
        a: 'Her iki yöntemde de nakledilen kökler kalıcıdır. Uzun vadeli sonuçlar açısından anlamlı fark bulunmamaktadır.',
      },
      {
        q: 'DHI neden daha pahalı?',
        a: 'Choi kalemi sarf malzemesi ve uzun işlem süresi maliyeti artırır. Aynı greft için DHI genellikle %20–40 daha pahalıdır.',
      },
      {
        q: 'Hangisini seçmeliyim?',
        a: 'Donör yoğunluğunuz, ekim alanı büyüklüğü ve tıraş tercihiniz belirleyicidir. Konsültasyon gerektirir.',
      },
    ],
    url: 'https://estyi.com/karsilastirma/fue-vs-dhi',
  },
  {
    slug: 'turkiye-vs-polonya-sac-ekimi',
    leftLabel: 'Türkiye',
    rightLabel: 'Polonya',
    title: 'Türkiye mi Polonya mı — Saç Ekimi Karşılaştırması 2026',
    metaDesc:
      "Türkiye ve Polonya'da saç ekimi: maliyet, klinik kalitesi, sertifikasyon ve bekleme süreleri. 2026 tarafsız karşılaştırma.",
    summary:
      'Türkiye düşük maliyet ve yüksek hacim avantajı sunarken, Polonya AB sağlık mevzuatı çerçevesinde çalışır. Tercih bütçe, seyahat kolaylığı ve klinik araştırmasına bağlıdır.',
    rows: [
      {
        aspect: 'Ortalama FUE maliyeti',
        left: '1.500–4.000 USD',
        right: '2.500–5.500 USD',
        winner: 'left',
      },
      {
        aspect: 'Regülasyon çerçevesi',
        left: 'Sağlık Bakanlığı denetimi, JCI bazı kliniklerde',
        right: 'AB direktifleri, CE standartları',
        winner: 'equal',
      },
      {
        aspect: 'Uçuş süresi (Batı Avrupa)',
        left: '3–4 saat',
        right: '1–3 saat',
        winner: 'right',
      },
      {
        aspect: 'Yıllık operasyon hacmi',
        left: '500.000+ (küresel lider)',
        right: 'Çok daha düşük',
        winner: 'left',
      },
      {
        aspect: 'Paket kapsamı',
        left: 'Konaklama + transfer genellikle dahil',
        right: 'Değişken',
        winner: 'left',
      },
      {
        aspect: 'Sonuç takibi (uzaklık)',
        left: 'Kontrol için uçuş gerekebilir',
        right: 'Avrupa içiyse daha kolay',
        winner: 'right',
      },
    ],
    verdict:
      'Maliyet öncelikliyse Türkiye avantaj sağlar. AB içinde ikamet edip kontrol erişimi istiyorsanız Polonya pratik olabilir. Her iki ülkedeki kalite bireysel klinik araştırmasına bağlıdır.',
    faq: [
      {
        q: "Türkiye'deki klinikler güvenilir mi?",
        a: 'JCI veya ISO sertifikasyonu, hasta yorumları ve cerrah özgeçmişi kontrol edilmelidir. Akredite ve akredite olmayan pek çok klinik bulunmaktadır.',
      },
      {
        q: 'Komplikasyon riski hangi ülkede daha yüksek?',
        a: 'Risk ülkeden çok kliniğe ve cerraha bağlıdır. Her ülkede iyi ve kötü klinikler mevcuttur.',
      },
    ],
    url: 'https://estyi.com/karsilastirma/turkiye-vs-polonya-sac-ekimi',
  },
  {
    slug: 'istanbul-vs-antalya-estetik',
    leftLabel: 'İstanbul',
    rightLabel: 'Antalya',
    title: 'İstanbul mu Antalya mı — Estetik Turizm Karşılaştırması 2026',
    metaDesc:
      "İstanbul ve Antalya'da estetik operasyon: klinik yoğunluğu, fiyat farkı, ulaşım ve iyileşme ortamı. Tarafsız 2026.",
    summary:
      'İstanbul geniş klinik ağı ve uzmanlaşmış cerrah havuzuyla öne çıkar. Antalya iyileşme sürecini tatil ortamıyla birleştirme imkânı sunar. Fiyatlar benzer düzeydedir.',
    rows: [
      {
        aspect: 'Uzmanlaşmış klinik sayısı',
        left: 'Yüksek (ülkedeki en yoğun merkez)',
        right: 'Orta',
        winner: 'left',
      },
      {
        aspect: 'Cerrah çeşitliliği',
        left: 'Daha geniş uzman havuzu',
        right: 'Daha sınırlı',
        winner: 'left',
      },
      {
        aspect: 'Ortalama fiyat farkı',
        left: 'Referans fiyat',
        right: 'Benzer veya %5–10 düşük',
        winner: 'equal',
      },
      {
        aspect: 'Uluslararası uçuş bağlantısı',
        left: 'Çok güçlü (2 havalimanı)',
        right: 'İyi',
        winner: 'left',
      },
      {
        aspect: 'İyileşme ortamı',
        left: 'Şehir merkezi',
        right: 'Tatil bölgesi, deniz yakın',
        winner: 'right',
      },
    ],
    verdict:
      'Geniş cerrah seçeneği ve uluslararası erişim için İstanbul daha avantajlıdır. İyileşmeyi sıcak iklimde geçirmek isteyenler için Antalya cazip alternatiftir.',
    faq: [
      {
        q: "Antalya'da operasyon sonrası iyileşmek uygun mu?",
        a: 'Antalya’nın ılıman iklimi konforlu olabilir; ancak erken dönemde güneş maruziyetine dikkat edilmelidir.',
      },
    ],
    url: 'https://estyi.com/karsilastirma/istanbul-vs-antalya-estetik',
  },
];

const ComparisonGuide: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = COMPARISONS.find(c => c.slug === slug);
  const { user } = useAuth();

  if (!data) {
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
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://estyi.com' },
      { '@type': 'ListItem', position: 2, name: 'Rehber', item: 'https://estyi.com/fiyat-endeksi' },
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
                Ana Sayfa
              </Link>
              <span>/</span>
              <Link to="/fiyat-endeksi" className="hover:text-white">
                Rehber
              </Link>
              <span>/</span>
              <span className="text-white">Karşılaştırma</span>
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
              {data.leftLabel} ve {data.rightLabel}: Karşılaştırma
            </h2>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Kriter</th>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sonuç: Hangisi Daha Uygun?</h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
              <p className="text-gray-700 leading-relaxed">{data.verdict}</p>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
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
                  Bu karşılaştırma genel bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Kişisel
                  durumunuz ve sağlık geçmişiniz için mutlaka doktorunuzla veya ilgili uzmanla
                  değerlendirme yapın.
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bu karşılaştırma kamuya açık veriler esas alınarak hazırlanmıştır. Bireysel sonuçlar
                  klinik ve cerrah deneyimine göre farklılık gösterir. Son güncelleme: Şubat 2026.
                </p>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Klinik Karşılaştırması Yapmak İster misiniz?</h2>
              <p className="text-indigo-100 mb-6">
                Estyi üzerinden birden fazla sertifikalı klinikten teklif alın ve kendiniz karşılaştırın.
              </p>
              <Link
                to={user ? '/request/new' : '/signup'}
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors"
              >
                Ücretsiz Teklif Al <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Diğer Karşılaştırmalar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMPARISONS.filter(c => c.slug !== data.slug).map(c => (
                <Link
                  key={c.slug}
                  to={`/karsilastirma/${c.slug}`}
                  className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {c.title.split(' —')[0]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.leftLabel} vs {c.rightLabel}
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
