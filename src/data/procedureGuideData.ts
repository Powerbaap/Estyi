export interface ProcedureGuideInfo {
  slug: string;
  procedureKey: string;
  title: string;
  metaDescription: string;
  summary: string;
  priceRange: {
    turkey: string;
    europe: string;
    usa: string;
  };
  duration: string;
  recoveryTime: string;
  anesthesia: string;
  hospitalStay: string;
  results: string;
  suitableFor: string[];
  notSuitableFor: string[];
  risks: string[];
  steps: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  includes: string[];
  notIncludes: string[];
  category: string;
}

export const PROCEDURE_GUIDES: ProcedureGuideInfo[] = [
  {
    slug: 'sac-ekimi-fue',
    procedureKey: 'sac_ekimi_fue',
    title: 'Saç Ekimi FUE - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Saç ekimi FUE hakkında her şey. 2026 fiyatlar, süreç, iyileşme ve ülke karşılaştırması.',
    summary:
      'FUE saç ekimi, saç köklerinin tek tek alınıp seyrek bölgelere nakledildiği minimal invaziv yöntemdir. Türkiye yılda 500.000+ operasyonla dünya lideridir.',
    priceRange: {
      turkey: '1.500 - 4.000 USD',
      europe: '4.000 - 12.000 EUR',
      usa: '8.000 - 15.000 USD',
    },
    duration: '6-8 saat',
    recoveryTime: '7-10 gün',
    anesthesia: 'Lokal anestezi',
    hospitalStay: 'Günübirlik',
    results: '12-18 ayda tam sonuç',
    suitableFor: [
      'Erkek tipi saç dökülmesi',
      'Donör bölgesi yeterli olanlar',
      '22 yaş üstü bireyler',
      'Saç çizgisi düzeltmek isteyenler',
    ],
    notSuitableFor: [
      'Donör bölgesi zayıf olanlar',
      'Aktif dökülme devam edenler',
      'Kontrol edilemeyen diyabet',
      'Keloid yatkınlığı',
    ],
    risks: [
      'Geçici şişlik ve morarma (3-5 gün)',
      'Şok dökülme (2-4. hafta, normaldir)',
      'Nadir: enfeksiyon',
      'Donör bölgede geçici uyuşukluk',
    ],
    steps: [
      { title: 'Online Konsültasyon', desc: 'Fotoğraf analizi, greft sayısı ve plan belirlenir' },
      { title: 'Greft Çıkarma (2-3 saat)', desc: 'Mikro punch ile tek tek saç kökleri alınır' },
      { title: 'Kanal Açma', desc: 'Doğal saç yönüne uygun mikro kanallar açılır' },
      { title: 'Greft Yerleştirme (2-3 saat)', desc: 'Kökler doğal açı ve yönde tek tek yerleştirilir' },
      { title: 'Bandaj ve Taburcu', desc: 'Aynı gün otele dönüş, ertesi gün kontrol' },
    ],
    faq: [
      { q: 'FUE saç ekimi kalıcı mı?', a: 'Evet, nakledilen kökler genetik olarak dökülmeye dirençlidir ve ömür boyu kalıcıdır.' },
      { q: 'Kaç greft gerekir?', a: 'Hafif: 1500-2500, orta: 2500-3500, ileri: 3500-5000+ greft.' },
      { q: 'Ağrılı mı?', a: 'Lokal anestezi ile yapılır, işlem sırasında ağrı hissedilmez.' },
      { q: 'Ne zaman sonuç görülür?', a: '3 ayda çıkmaya başlar, 6 ayda belirgin fark, 12-18 ayda tam sonuç.' },
      {
        q: 'Türkiye neden tercih ediliyor?',
        a: 'Yılda 500.000+ operasyon deneyimi, son teknoloji ve Avrupa fiyatının 1/3ü.',
      },
    ],
    includes: ['Havalimanı transferi', 'Otel (2-3 gece)', 'İlaçlar ve bakım ürünleri', 'PRP tedavisi', 'Kontrol muayeneleri'],
    notIncludes: ['Uçak bileti', 'Ekstra konaklama', 'Kişisel harcamalar'],
    category: 'Saç & Kaş',
  },
  {
    slug: 'sac-ekimi-dhi',
    procedureKey: 'sac_ekimi_dhi',
    title: 'Saç Ekimi DHI - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'DHI saç ekimi rehberi. 2026 fiyatlar, FUE farkları, Choi kalemi ve tıraşsız ekim.',
    summary:
      'DHI, Choi kalemi ile saç köklerinin kanal açmadan doğrudan ekildiği ileri tekniktir. Tıraşsız uygulanabilir, hassas bölgelerde tercih edilir.',
    priceRange: {
      turkey: '2.000 - 5.000 USD',
      europe: '5.000 - 15.000 EUR',
      usa: '10.000 - 20.000 USD',
    },
    duration: '6-10 saat',
    recoveryTime: '5-7 gün',
    anesthesia: 'Lokal anestezi',
    hospitalStay: 'Günübirlik',
    results: '12-18 ayda tam sonuç',
    suitableFor: ['Saç çizgisi restorasyonu', 'Tıraşsız ekim isteyenler', 'Hassas bölge ekimi', 'Yoğunlaştırma isteyenler'],
    notSuitableFor: ['Çok geniş alan ekim gerekenler', 'Donör yetersiz olanlar', '5000+ greft gerektirenler'],
    risks: ['Geçici şişlik', 'Şok dökülme (normal)', 'Nadir: enfeksiyon'],
    steps: [
      { title: 'Konsültasyon', desc: 'Saç analizi ve DHI uygunluk değerlendirmesi' },
      { title: 'Lokal Anestezi', desc: 'Donör ve alıcı bölgeye uygulanır' },
      { title: 'Greft Çıkarma', desc: 'FUE ile tek tek kökler alınır' },
      { title: 'Choi Kalemiyle Ekim', desc: 'Kanal açma ve yerleştirme eş zamanlı' },
      { title: 'Kontrol', desc: 'Ertesi gün kontrol muayenesi' },
    ],
    faq: [
      {
        q: 'DHI ile FUE farkı?',
        a: 'DHI Choi kalemi kullanır, kanal açma ve yerleştirme eş zamanlı. Daha hassas ama daha pahalı.',
      },
      { q: 'Tıraşsız mümkün mü?', a: 'Evet, DHI en büyük avantajı. Kadınlar ve uzun saçlılar için ideal.' },
      { q: 'Kaç greft ekilir?', a: 'Tek seansta 2000-4000 greft.' },
    ],
    includes: ['Transfer', 'Otel (2-3 gece)', 'İlaçlar', 'PRP', 'Kontroller'],
    notIncludes: ['Uçak bileti', 'Ekstra konaklama'],
    category: 'Saç & Kaş',
  },
  {
    slug: 'burun-estetigi',
    procedureKey: 'burun_estetigi_rinoplasti',
    title: 'Burun Estetiği (Rinoplasti) - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Burun estetiği rehberi. 2026 fiyatları, ameliyat süreci, iyileşme ve Türkiye avantajları.',
    summary:
      'Rinoplasti, burnun şeklini veya fonksiyonunu düzeltmek için yapılan cerrahi işlemdir. Türkiye yılda 100.000+ rinoplasti ile dünyanın en deneyimli ülkelerindendir.',
    priceRange: {
      turkey: '2.500 - 5.500 USD',
      europe: '6.000 - 12.000 EUR',
      usa: '8.000 - 15.000 USD',
    },
    duration: '1.5-3 saat',
    recoveryTime: '7-14 gün',
    anesthesia: '',
    hospitalStay: '',
    results: '',
    suitableFor: [],
    notSuitableFor: [],
    risks: [],
    steps: [],
    faq: [],
    includes: [],
    notIncludes: [],
    category: 'Burun',
  },
];

