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
    hospitalStay: '1 gece',
    results: '6-12 ayda nihai sonuç',
    suitableFor: ['Burun şeklinden memnun olmayanlar', 'Nefes alma zorluğu', 'Burun kemiği eğriliği', '18 yaş üstü'],
    notSuitableFor: ['18 yaş altı', 'Gerçekçi olmayan beklentiler', 'Aktif sigara içenler', 'Kronik hastalığı olanlar'],
    risks: ['Şişlik ve morarma (2-3 hafta)', 'Geçici uyuşukluk', 'Nadir: kanama, enfeksiyon', 'Revizyon gerekebilir (%5-10)'],
    steps: [
      { title: 'Online Konsültasyon', desc: 'Fotoğraf analizi ve 3D simülasyon' },
      { title: 'Ameliyat Öncesi Testler', desc: 'Kan testleri, EKG, anestezi değerlendirmesi' },
      { title: 'Ameliyat (1.5-3 saat)', desc: 'Açık veya kapalı teknikle şekillendirme' },
      { title: 'Hastanede 1 Gece', desc: 'Gözlem, tampon çıkarma' },
      { title: 'Alçı Çıkarma (7. gün)', desc: 'İlk sonuç görülür' },
    ],
    faq: [
      {
        q: 'Ağrılı mı?',
        a: 'Genel anestezi altında yapılır. Sonrasında hafif ağrı, ağrı kesiciyle kontrol edilir.',
      },
      { q: 'Alçı ne zaman çıkar?', a: '7. günde. Bu sürede gözlük takılmaz.' },
      { q: 'Sonuç ne zaman?', a: 'İlk sonuç alçı çıkınca. Nihai sonuç 12 ay sonra.' },
      { q: 'Kaç gün kalmalıyım?', a: '7-10 gün önerilir.' },
    ],
    includes: ['VIP transfer', 'Otel (5-7 gece)', 'Ameliyathane ve hastane', 'Cerrah ve anestezi', 'İlaçlar', 'Kontroller'],
    notIncludes: ['Uçak bileti', 'Ekstra konaklama', 'Revizyon ameliyatı'],
    category: 'Yüz Cerrahisi',
  },
  {
    slug: 'dis-implant',
    procedureKey: 'dis_implant',
    title: 'Diş İmplantı - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Diş implantı rehberi. 2026 fiyatlar, işlem aşamaları ve Türkiye avantajları.',
    summary:
      'Diş implantı, eksik dişlerin yerine titanyum vida ile kalıcı diş kökü yerleştirilmesidir. %95+ başarı oranı. Türkiye Avrupa fiyatının 1/3-1/4 ile dünya lideri.',
    priceRange: {
      turkey: '400 - 1.000 USD',
      europe: '1.500 - 3.500 EUR',
      usa: '3.000 - 6.000 USD',
    },
    duration: '30-60 dk',
    recoveryTime: '3-6 ay',
    anesthesia: 'Lokal anestezi',
    hospitalStay: 'Günübirlik',
    results: 'Kalıcı (20-25+ yıl)',
    suitableFor: ['Eksik dişi olan yetişkinler', 'Çene kemiği yeterli olanlar', 'Köprü istemeyenler'],
    notSuitableFor: ['Çene kemiği yetersiz olanlar', 'Kontrol edilemeyen diyabet', 'Ağır sigara içenler'],
    risks: ['Geçici şişlik', 'Nadir: enfeksiyon', 'İmplant tutmama (%2-5)'],
    steps: [
      { title: '3D Tomografi', desc: 'Çene kemiği değerlendirilir' },
      { title: 'İmplant Yerleştirme', desc: 'Titanyum vida yerleştirilir' },
      { title: 'İyileşme (3-6 ay)', desc: 'Kemik-implant kaynaşması' },
      { title: 'Kron Takma', desc: 'Porselen/zirkonyum diş takılır' },
    ],
    faq: [
      {
        q: 'Ağrılı mı?',
        a: 'Lokal anestezi ile ağrısız. Sonra birkaç gün hafif ağrı normal.',
      },
      { q: 'Ne kadar dayanır?', a: 'İyi bakımla 20-25 yıl, hatta ömür boyu.' },
      { q: 'Kaç gün kalmalıyım?', a: 'Tek implant: 3-5 gün. All-on-4: 7-10 gün.' },
      {
        q: 'All-on-4 nedir?',
        a: "4 implant üzerine tam çene sabit köprü. Türkiye'de 5.000-8.000 USD.",
      },
    ],
    includes: ['Röntgen ve tomografi', 'İmplant', 'Abutment', 'Geçici kron', 'Kontroller'],
    notIncludes: ['Kalıcı kron (150-300 USD/diş)', 'Kemik grefti', 'Uçak bileti', 'Konaklama'],
    category: 'Diş',
  },
  {
    slug: 'zirkonyum-kaplama',
    procedureKey: 'zirkonyum_kaplama',
    title: 'Zirkonyum Diş Kaplama - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Zirkonyum kaplama rehberi. 2026 fiyatları ve Türkiye karşılaştırması.',
    summary:
      "Zirkonyum kaplama, doğal diş görünümüne en yakın, metal içermeyen estetik restorasyondur. Türkiye'de diş başına 150-300 USD ile Avrupa'nın 1/4'ü fiyata.",
    priceRange: {
      turkey: '150 - 300 USD (diş başı)',
      europe: '600 - 1.200 EUR',
      usa: '1.000 - 2.000 USD',
    },
    duration: '5-7 gün',
    recoveryTime: '1-2 gün',
    anesthesia: 'Lokal anestezi',
    hospitalStay: 'Günübirlik',
    results: '10-15+ yıl',
    suitableFor: ['Kırık/aşınmış dişler', 'Renk değişikliği', 'Şekil bozukluğu', 'Eski metal kaplama değişimi'],
    notSuitableFor: ['Çok ince diş minesi', 'Ağır bruksizm', 'Çürük tedavisi tamamlanmamış'],
    risks: ['Geçici hassasiyet', 'Nadir: kaplama kırılması', 'Diş minesi kaybı'],
    steps: [
      { title: 'Dijital Tasarım', desc: 'Gülüş tasarımı ve renk seçimi' },
      { title: 'Diş Hazırlığı', desc: 'Törpüleme' },
      { title: 'Ölçü', desc: 'Dijital ölçü alınır' },
      { title: 'Geçici Kaplama', desc: '3-5 gün bekleme' },
      { title: 'Kalıcı Yerleştirme', desc: 'Zirkonyum kaplamalar yapıştırılır' },
    ],
    faq: [
      {
        q: 'Zirkonyum mu porselen mi?',
        a: 'Zirkonyum daha dayanıklı, metal gerektirmez, diş etinde koyu çizgi olmaz.',
      },
      { q: 'Kaç gün kalmalıyım?', a: '5-7 gün yeterli.' },
      {
        q: '20 diş ne kadar?',
        a: "Türkiye'de 3.000-6.000 USD. Avrupa'da 12.000-24.000 EUR.",
      },
    ],
    includes: ['Röntgen', 'Dijital tasarım', 'Geçici kaplamalar', 'Zirkonyum kaplamalar'],
    notIncludes: ['Uçak bileti', 'Konaklama', 'Kök kanal tedavisi'],
    category: 'Diş',
  },
  {
    slug: 'hollywood-gulus',
    procedureKey: 'gulus_tasarimi',
    title: 'Hollywood Gülüşü - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Hollywood gülüşü rehberi. 2026 fiyatları, veneer vs laminat ve Türkiye avantajları.',
    summary:
      "Hollywood gülüşü, dişlerin veneer/laminat/zirkonyum ile kusursuz görünüme kavuşturulmasıdır. 16-20 diş kaplanır. Türkiye dünya'nın en popüler destinasyonudur.",
    priceRange: {
      turkey: '3.000 - 8.000 USD',
      europe: '12.000 - 30.000 EUR',
      usa: '20.000 - 50.000 USD',
    },
    duration: '5-10 gün',
    recoveryTime: '1-3 gün',
    anesthesia: 'Lokal anestezi',
    hospitalStay: 'Günübirlik',
    results: 'Anında, 10-15+ yıl dayanıklılık',
    suitableFor: ['Diş renk/şekil bozukluğu', 'Dişler arası boşluk', 'Gülüşünden memnun olmayanlar'],
    notSuitableFor: ['Ciddi diş eti hastalığı', 'Ağır bruksizm', 'Gerçekçi olmayan beklentiler'],
    risks: ['Diş hassasiyeti (1-2 hafta)', 'Diş minesi kaybı', 'Nadir: kaplama kırılması'],
    steps: [
      { title: 'Gülüş Analizi', desc: 'Dijital tasarım oluşturulur' },
      { title: '3D Mockup', desc: 'Ağızda önizleme' },
      { title: 'Diş Hazırlığı', desc: 'Tekniğe göre hazırlık' },
      { title: 'Laboratuvar (3-5 gün)', desc: 'Kaplamalar üretilir' },
      { title: 'Yerleştirme', desc: 'Kalıcı kaplamalar takılır' },
    ],
    faq: [
      { q: 'Kalıcı mı?', a: 'Evet, 10-15+ yıl. İyi bakımla 20 yıla kadar.' },
      {
        q: 'Veneer ve laminat farkı?',
        a: 'Laminat minimal törpüleme (0.3mm). Veneer daha fazla törpüleme ama daha dayanıklı.',
      },
      { q: 'Kaç diş?', a: 'Standart 16-20 diş. Sadece üst dişler de yapılabilir.' },
    ],
    includes: ['Röntgen', 'Dijital tasarım', 'Geçici kaplamalar', 'Kalıcı kaplamalar', 'Tüm randevular'],
    notIncludes: ['Uçak bileti', 'Konaklama', 'Kök kanal tedavisi', 'Diş eti estetiği'],
    category: 'Diş',
  },
  {
    slug: 'lazer-epilasyon',
    procedureKey: 'lazer_epilasyon',
    title: 'Lazer Epilasyon - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Lazer epilasyon rehberi. 2026 fiyatlar, seans sayısı ve sonuçlar.',
    summary:
      'Lazer epilasyon, ışık enerjisi ile kıl köklerini kalıcı etkisiz hale getiren işlemdir. 6-10 seans ile %80-90 kalıcı azalma sağlanır.',
    priceRange: {
      turkey: '50 - 500 USD',
      europe: '200 - 2.000 EUR',
      usa: '300 - 3.000 USD',
    },
    duration: '15-60 dk',
    recoveryTime: 'Yok',
    anesthesia: 'Gerek yok',
    hospitalStay: 'Yok',
    results: '6-10 seans sonrası %80-90 kalıcı azalma',
    suitableFor: [
      'Kalıcı tüy azalması isteyenler',
      'Koyu tüylü açık tenli kişiler',
      'Ağdadan kurtulmak isteyenler',
    ],
    notSuitableFor: ['Hamile/emziren kadınlar', 'Aktif cilt enfeksiyonu', 'Çok açık/beyaz tüylü kişiler'],
    risks: ['Geçici kızarıklık', 'Hafif yanma hissi', 'Nadir: pigmentasyon değişikliği'],
    steps: [
      { title: 'Cilt Analizi', desc: 'Uygun lazer türü seçilir' },
      { title: 'Test Atışı', desc: 'Küçük alanda test' },
      { title: 'Lazer Uygulaması', desc: 'Bölge taranır' },
      { title: 'Bakım', desc: 'Soğutucu krem uygulanır' },
    ],
    faq: [
      { q: 'Kaç seans?', a: '6-10 seans, arası 4-6 hafta.' },
      { q: 'Ağrılı mı?', a: 'Hafif lastik çıtlama hissi.' },
      { q: 'Kalıcı mı?', a: '%80-90 kalıcı. Yılda 1-2 idame seansı.' },
    ],
    includes: ['Cilt analizi', 'Test atışı', 'Lazer uygulaması', 'Soğutucu bakım'],
    notIncludes: ['Birden fazla bölge', 'İdame seansları'],
    category: 'Cilt & Dermatoloji',
  },
  {
    slug: 'gogus-buyutme',
    procedureKey: 'gogus_buyutme',
    title: 'Göğüs Büyütme - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Göğüs büyütme rehberi. 2026 fiyatları, implant türleri ve iyileşme.',
    summary:
      "Göğüs büyütme, silikon implant ile göğüs boyutunu artıran cerrahi işlemdir. Türkiye'de FDA onaylı implantlarla Avrupa'nın yarısı fiyata yapılır.",
    priceRange: {
      turkey: '3.000 - 5.500 USD',
      europe: '6.000 - 12.000 EUR',
      usa: '8.000 - 15.000 USD',
    },
    duration: '1-2 saat',
    recoveryTime: '1-2 hafta',
    anesthesia: 'Genel anestezi',
    hospitalStay: '1 gece',
    results: 'Anında görünür, 3-6 ayda yerleşme',
    suitableFor: ['Göğüs boyutu artırmak isteyenler', 'Doğum sonrası hacim kaybı', 'Asimetri düzeltme'],
    notSuitableFor: ['Aktif meme kanseri', 'Hamileler', 'Kontrol edilemeyen kronik hastalık'],
    risks: ['Şişlik (2-3 hafta)', 'Kapsül kontraktürü (%5-10)', 'Nadir: implant yırtılma'],
    steps: [
      { title: 'Konsültasyon', desc: 'İmplant tipi ve boyutu, 3D simülasyon' },
      { title: 'Ameliyat (1-2 saat)', desc: 'Genel anestezi altında implant yerleştirme' },
      { title: 'Hastanede 1 Gece', desc: 'Gözlem' },
      { title: 'İyileşme', desc: 'Destek sütyeni 4-6 hafta' },
    ],
    faq: [
      {
        q: 'Yuvarlak mı anatomik mi?',
        a: 'Yuvarlak dolgun dekolte, anatomik doğal görünüm sağlar.',
      },
      { q: 'Ne kadar dayanır?', a: 'Modern implantlar 10-20+ yıl.' },
      { q: 'Emzirmeyi etkiler mi?', a: 'Genelde hayır.' },
    ],
    includes: [
      'Cerrah ve anestezi',
      'Hastane 1 gece',
      'FDA onaylı implant',
      'Destek sütyeni',
      'İlaçlar',
      'Kontroller',
    ],
    notIncludes: ['Uçak bileti', 'Konaklama'],
    category: 'Göğüs Cerrahisi',
  },
  {
    slug: 'liposuction',
    procedureKey: 'liposuction',
    title: 'Liposuction - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Liposuction rehberi. 2026 fiyatları, VASER vs klasik ve iyileşme.',
    summary:
      'Liposuction, inatçı yağ birikintilerini cerrahi alan vücut şekillendirme işlemidir. VASER, lazer ve klasik teknikleri vardır.',
    priceRange: {
      turkey: '2.000 - 5.000 USD',
      europe: '4.000 - 10.000 EUR',
      usa: '5.000 - 12.000 USD',
    },
    duration: '1-3 saat',
    recoveryTime: '1-2 hafta',
    anesthesia: 'Genel veya lokal+sedasyon',
    hospitalStay: 'Günübirlik veya 1 gece',
    results: '3-6 ayda netleşir',
    suitableFor: ['İnatçı bölgesel yağlar', 'Normal kiloya yakın bireyler', 'Deri elastikiyeti iyi olanlar'],
    notSuitableFor: ['Obez bireyler', 'Deri sarkması fazla olanlar', 'Hamileler'],
    risks: ['Şişlik (2-4 hafta)', 'Geçici uyuşukluk', 'Nadir: seroma', 'Nadir: deri düzensizliği'],
    steps: [
      { title: 'Vücut Analizi', desc: 'Bölgeler işaretlenir' },
      { title: 'Anestezi', desc: 'Lokal veya genel' },
      { title: 'Yağ Aspirasyonu', desc: 'Kanüller ile yağ vakumlanır' },
      { title: 'Korse', desc: '4-6 hafta kompresyon' },
    ],
    faq: [
      { q: 'Kalıcı mı?', a: 'Evet, alınan yağ hücreleri geri gelmez.' },
      { q: 'VASER farkı?', a: 'Ultrasonik enerji ile daha hassas şekillendirme.' },
      { q: 'Yağ transfer edilebilir mi?', a: 'Evet, BBL veya yüz dolgunlaştırma için.' },
    ],
    includes: ['Cerrah ve anestezi', 'Ameliyathane', 'Korse', 'İlaçlar', 'Kontroller'],
    notIncludes: ['Uçak bileti', 'Konaklama', 'VASER ek ücreti'],
    category: 'Vücut Cerrahisi',
  },
  {
    slug: 'karin-germe',
    procedureKey: 'abdominoplasti',
    title: 'Karın Germe - 2026 Rehberi ve Fiyatlar',
    metaDescription: 'Karın germe rehberi. 2026 fiyatları, mini vs tam ve iyileşme süreci.',
    summary:
      'Abdominoplasti, karın bölgesindeki fazla deri ve yağı alarak kasları sıkılaştıran cerrahi işlemdir. Doğum veya kilo kaybı sonrası tercih edilir.',
    priceRange: {
      turkey: '3.000 - 6.000 USD',
      europe: '6.000 - 12.000 EUR',
      usa: '8.000 - 15.000 USD',
    },
    duration: '2-4 saat',
    recoveryTime: '2-3 hafta',
    anesthesia: 'Genel anestezi',
    hospitalStay: '1-2 gece',
    results: 'Anında görünür, 6-12 ayda nihai',
    suitableFor: ['Doğum sonrası karın sarkması', 'Büyük kilo kaybı sonrası', 'Karın kasları ayrılması (diastazis)'],
    notSuitableFor: ['Gelecekte hamilelik planlayanlar', 'Aktif sigara içenler', 'BMI 30 üzeri'],
    risks: ['Şişlik (3-4 hafta)', 'İz (bikini altında)', 'Nadir: seroma', 'Geçici uyuşukluk'],
    steps: [
      { title: 'Konsültasyon', desc: 'Mini veya tam abdominoplasti planı' },
      { title: 'Ameliyat (2-4 saat)', desc: 'Fazla deri/yağ alınır, kaslar dikilir' },
      { title: 'Hastane (1-2 gece)', desc: 'Drenler takılır' },
      { title: 'İyileşme', desc: 'Korse 6-8 hafta, 6 hafta sonra spor' },
    ],
    faq: [
      {
        q: 'Mini ve tam farkı?',
        a: 'Mini sadece göbek altı. Tam tüm karın, göbek yeniden konumlandırılır.',
      },
      {
        q: 'İz kalır mı?',
        a: 'Evet ama bikini altında gizlenir, 12-18 ayda solar.',
      },
      { q: 'Kaç gün kalmalıyım?', a: '7-10 gün.' },
    ],
    includes: ['Cerrah ve anestezi', 'Hastane 1-2 gece', 'Korse', 'İlaçlar', 'Kontroller', 'Transfer'],
    notIncludes: ['Uçak bileti', 'Konaklama', 'Liposuction ek bölge'],
    category: 'Vücut Cerrahisi',
  },
];

export function getGuideBySlug(slug: string): ProcedureGuideInfo | undefined {
  return PROCEDURE_GUIDES.find(g => g.slug === slug);
}

export function getGuideByKey(key: string): ProcedureGuideInfo | undefined {
  return PROCEDURE_GUIDES.find(g => g.procedureKey === key);
}

export function getAllGuideSlugs(): string[] {
  return PROCEDURE_GUIDES.map(g => g.slug);
}
