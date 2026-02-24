
export interface ProcedureGuideInfo {
  slug: string;
  procedureKey: string;
  title: { tr: string; en: string; ar: string };
  metaDescription: { tr: string; en: string; ar: string };
  summary: { tr: string; en: string; ar: string };
  priceRange: {
    india: string;
    mexico: string;
    turkey: string;
    thailand: string;
    poland: string;
    uk: string;
    usa: string;
  };
  duration: { tr: string; en: string; ar: string };
  recoveryTime: { tr: string; en: string; ar: string };
  anesthesia: { tr: string; en: string; ar: string };
  hospitalStay: { tr: string; en: string; ar: string };
  results: { tr: string; en: string; ar: string };
  suitableFor: { tr: string; en: string; ar: string }[];
  notSuitableFor: { tr: string; en: string; ar: string }[];
  risks: { tr: string; en: string; ar: string }[];
  steps: { title: { tr: string; en: string; ar: string }; desc: { tr: string; en: string; ar: string } }[];
  faq: { q: { tr: string; en: string; ar: string }; a: { tr: string; en: string; ar: string } }[];
  category: { tr: string; en: string; ar: string };
}

export const PROCEDURE_GUIDES: ProcedureGuideInfo[] = [
  {
    slug: 'sac-ekimi-fue',
    procedureKey: 'sac_ekimi_fue',
    title: {
      tr: 'Saç Ekimi FUE - 2026 Rehberi ve Fiyatlar',
      en: 'Hair Transplant FUE - 2026 Guide and Prices',
      ar: 'زراعة الشعر FUE - دليل 2026 والأسعار',
    },
    metaDescription: {
      tr: 'FUE saç ekimi nedir, nasıl yapılır, fiyatları ne kadar? 2026 güncel rehberi, iyileşme süreci ve ülke karşılaştırmaları.',
      en: 'What is FUE hair transplant, how is it done, how much does it cost? 2026 updated guide, recovery process and country comparisons.',
      ar: 'ما هي زراعة الشعر FUE، كيف تتم، وكم تكلفتها؟ دليل محدث لعام 2026، عملية الشفاء ومقارنات الدول.',
    },
    summary: {
      tr: 'FUE (Follicular Unit Extraction), saç köklerinin donör bölgeden tek tek alınıp kel bölgeye ekilmesi işlemidir. Dikişsizdir, iz bırakmaz ve doğal sonuçlar verir.',
      en: 'FUE (Follicular Unit Extraction) is the process of extracting hair follicles one by one from the donor area and transplanting them to the bald area. It is seamless, leaves no scars and gives natural results.',
      ar: 'FUE (استخراج وحدة بصيلات الشعر) هي عملية استخراج بصيلات الشعر واحدة تلو الأخرى من المنطقة المانحة وزرعها في المنطقة الصلعاء. إنها غير ملحومة ولا تترك ندوبًا وتعطي نتائج طبيعية.',
    },
    priceRange: {
      india: '1.200 € - 2.500 €',
      mexico: '2.500 € - 4.500 €',
      turkey: '1.500 € - 2.500 €',
      thailand: '2.000 € - 3.500 €',
      poland: '2.500 € - 4.000 €',
      uk: '6.000 € - 10.000 €',
      usa: '8.000 € - 15.000 €',
    },
    duration: { tr: '6 - 8 Saat', en: '6 - 8 Hours', ar: '6 - 8 ساعات' },
    recoveryTime: { tr: '7 - 10 Gün', en: '7 - 10 Days', ar: '7 - 10 أيام' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '12 Ayda Tam Sonuç', en: 'Full Result in 12 Months', ar: 'نتيجة كاملة في 12 شهرًا' },
    suitableFor: [
      { tr: 'Erkek tipi kellik yaşayanlar', en: 'Those with male pattern baldness', ar: 'أولئك الذين يعانون من الصلع الذكوري' },
      { tr: 'Donör bölgesi yeterli olanlar', en: 'Those with sufficient donor area', ar: 'أولئك الذين لديهم منطقة مانحة كافية' },
      { tr: 'Saç çizgisini düzeltmek isteyenler', en: 'Those who want to correct hairline', ar: 'أولئك الذين يرغبون في تصحيح خط الشعر' },
    ],
    notSuitableFor: [
      { tr: 'Donör alanı çok zayıf olanlar', en: 'Those with very weak donor area', ar: 'أولئك الذين لديهم منطقة مانحة ضعيفة جدًا' },
      { tr: 'Kronik hastalığı olanlar (Doktor onayı gerekir)', en: 'Those with chronic diseases (Doctor approval required)', ar: 'أولئك الذين يعانون من أمراض مزمنة (مطلوب موافقة الطبيب)' },
    ],
    risks: [
      { tr: 'Geçici ödem ve şişlik', en: 'Temporary edema and swelling', ar: 'وذمة وتورم مؤقت' },
      { tr: 'Enfeksiyon riski (düşük)', en: 'Infection risk (low)', ar: 'خطر العدوى (منخفض)' },
      { tr: 'Şok dökülme (normal süreç)', en: 'Shock loss (normal process)', ar: 'تساقط الصدمة (عملية طبيعية)' },
    ],
    steps: [
      {
        title: { tr: 'Konsültasyon', en: 'Consultation', ar: 'استشارة' },
        desc: {
          tr: 'Saç analizi yapılır, saç çizgisi belirlenir ve greft sayısı hesaplanır.',
          en: 'Hair analysis is performed, hairline is determined and graft number is calculated.',
          ar: 'يتم إجراء تحليل الشعر وتحديد خط الشعر وحساب عدد الطعوم.',
        },
      },
      {
        title: { tr: 'Köklerin Alınması', en: 'Extraction', ar: 'اقتطاف' },
        desc: {
          tr: 'Lokal anestezi altında mikromotor ile kökler tek tek toplanır.',
          en: 'Roots are collected one by one with a micromotor under local anesthesia.',
          ar: 'يتم جمع الجذور واحدًا تلو الآخر باستخدام محرك دقيق تحت التخدير الموضعي.',
        },
      },
      {
        title: { tr: 'Kanal Açılması', en: 'Channel Opening', ar: 'فتح القناة' },
        desc: {
          tr: 'Ekim yapılacak bölgeye safir uçlarla kanallar açılır.',
          en: 'Channels are opened with sapphire tips to the area to be transplanted.',
          ar: 'يتم فتح القنوات بأطراف الياقوت في المنطقة المراد زراعتها.',
        },
      },
      {
        title: { tr: 'Ekim İşlemi', en: 'Implantation', ar: 'زرع' },
        desc: {
          tr: 'Toplanan kökler açılan kanallara yerleştirilir.',
          en: 'Collected roots are placed in the opened channels.',
          ar: 'يتم وضع الجذور المجمعة في القنوات المفتوحة.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'FUE saç ekimi ağrılı mı?', en: 'Is FUE hair transplant painful?', ar: 'هل زراعة الشعر FUE مؤلمة؟' },
        a: {
          tr: 'İşlem lokal anestezi altında yapıldığı için ağrı hissedilmez. Sonrasında hafif sızı olabilir.',
          en: 'Since the procedure is performed under local anesthesia, pain is not felt. Afterwards, there may be slight ache.',
          ar: 'نظرًا لأن الإجراء يتم تحت التخدير الموضعي، فلا يشعر بالألم. بعد ذلك، قد يكون هناك ألم طفيف.',
        },
      },
      {
        q: { tr: 'Ne zaman işe dönebilirim?', en: 'When can I return to work?', ar: 'متى يمكنني العودة إلى العمل؟' },
        a: {
          tr: 'Genellikle 3-5 gün içinde sosyal hayata ve ofis işlerine dönülebilir.',
          en: 'Usually, you can return to social life and office work within 3-5 days.',
          ar: 'عادة، يمكنك العودة إلى الحياة الاجتماعية والعمل المكتبي في غضون 3-5 أيام.',
        },
      },
    ],
    category: { tr: 'Saç Ekimi', en: 'Hair Transplant', ar: 'زراعة الشعر' },
  },
  {
    slug: 'sac-ekimi-dhi',
    procedureKey: 'sac_ekimi_dhi',
    title: {
      tr: 'Saç Ekimi DHI - 2026 Rehberi ve Fiyatlar',
      en: 'Hair Transplant DHI - 2026 Guide and Prices',
      ar: 'زراعة الشعر DHI - دليل 2026 والأسعار',
    },
    metaDescription: {
      tr: 'DHI (Choi Pen) saç ekimi nedir? Tıraşsız saç ekimi avantajları, maliyetleri ve FUE ile farkları.',
      en: 'What is DHI (Choi Pen) hair transplant? Unshaven hair transplant advantages, costs and differences from FUE.',
      ar: 'ما هي زراعة الشعر DHI (قلم تشوي)؟ مزايا زراعة الشعر بدون حلاقة، التكاليف والاختلافات عن FUE.',
    },
    summary: {
      tr: 'DHI (Direct Hair Implantation), özel Choi kalemleri kullanılarak kanal açma ve ekim işleminin aynı anda yapıldığı yöntemdir. Daha sık ekim imkanı sunar ve iyileşme süresi daha hızlıdır.',
      en: 'DHI (Direct Hair Implantation) is a method where channel opening and implantation are performed simultaneously using special Choi pens. It offers denser implantation and faster recovery time.',
      ar: 'DHI (زراعة الشعر المباشرة) هي طريقة يتم فيها فتح القناة والزرع في وقت واحد باستخدام أقلام تشوي الخاصة. يوفر إمكانية زراعة أكثر كثافة ووقت شفاء أسرع.',
    },
    priceRange: {
      india: '1.500 € - 3.000 €',
      mexico: '3.000 € - 5.000 €',
      turkey: '1.800 € - 3.000 €',
      thailand: '2.500 € - 4.000 €',
      poland: '3.000 € - 5.000 €',
      uk: '7.000 € - 12.000 €',
      usa: '9.000 € - 16.000 €',
    },
    duration: { tr: '6 - 8 Saat', en: '6 - 8 Hours', ar: '6 - 8 ساعات' },
    recoveryTime: { tr: '5 - 7 Gün', en: '5 - 7 Days', ar: '5 - 7 أيام' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '12 Ayda Tam Sonuç', en: 'Full Result in 12 Months', ar: 'نتيجة كاملة في 12 شهرًا' },
    suitableFor: [
      { tr: 'Tıraşsız ekim isteyenler', en: 'Those who want unshaven transplant', ar: 'أولئك الذين يريدون زراعة بدون حلاقة' },
      { tr: 'Daha sık ekim hedefleyenler', en: 'Those aiming for denser transplant', ar: 'أولئك الذين يهدفون إلى زراعة أكثر كثافة' },
      { tr: 'Kadın hastalar için ideal', en: 'Ideal for female patients', ar: 'مثالي للمرضى الإناث' },
    ],
    notSuitableFor: [
      { tr: 'Çok geniş açıklığı olanlar (FUE daha uygun olabilir)', en: 'Those with very large bald areas (FUE might be more suitable)', ar: 'أولئك الذين لديهم مناطق صلعاء كبيرة جدًا (قد يكون FUE أكثر ملاءمة)' },
      { tr: 'Kıvırcık saçlılar (Bazen zor olabilir)', en: 'Those with curly hair (Sometimes can be difficult)', ar: 'أولئك الذين لديهم شعر مجعد (أحيانًا قد يكون صعبًا)' },
    ],
    risks: [
      { tr: 'Daha uzun işlem süresi', en: 'Longer procedure time', ar: 'وقت إجراء أطول' },
      { tr: 'Maliyetin FUE’ye göre yüksek olması', en: 'Higher cost compared to FUE', ar: 'تكلفة أعلى مقارنة بـ FUE' },
    ],
    steps: [
      {
        title: { tr: 'Hazırlık', en: 'Preparation', ar: 'تحضير' },
        desc: {
          tr: 'Lokal anestezi ve donör bölgeden köklerin toplanması (FUE ile aynı).',
          en: 'Local anesthesia and extraction of roots from donor area (Same as FUE).',
          ar: 'تخدير موضعي وجمع الجذور من المنطقة المانحة (مثل FUE).',
        },
      },
      {
        title: { tr: 'Choi Kalemi ile Ekim', en: 'Implantation with Choi Pen', ar: 'الزرع بقلم تشوي' },
        desc: {
          tr: 'Kökler kalemin içine yerleştirilir ve direkt deriye enjekte edilir.',
          en: 'Roots are placed inside the pen and injected directly into the skin.',
          ar: 'توضع الجذور داخل القلم وتحقن مباشرة في الجلد.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'FUE mi DHI mı daha iyi?', en: 'Is FUE or DHI better?', ar: 'أيهما أفضل FUE أم DHI؟' },
        a: {
          tr: 'DHI sıklaştırma ve ön hat için, FUE geniş alanlar için daha iyidir.',
          en: 'DHI is better for densification and hairline, FUE is better for large areas.',
          ar: 'DHI أفضل للتكثيف وخط الشعر، FUE أفضل للمناطق الكبيرة.',
        },
      },
    ],
    category: { tr: 'Saç Ekimi', en: 'Hair Transplant', ar: 'زراعة الشعر' },
  },
  {
    slug: 'burun-estetigi',
    procedureKey: 'burun_estetigi',
    title: {
      tr: 'Burun Estetiği (Rinoplasti) - 2026 Rehberi',
      en: 'Rhinoplasty (Nose Job) - 2026 Guide',
      ar: 'تجميل الأنف (رينوبلاستي) - دليل 2026',
    },
    metaDescription: {
      tr: 'Burun estetiği ameliyatı, fiyatları, iyileşme süreci. Açık ve kapalı rinoplasti farkları.',
      en: 'Rhinoplasty surgery, prices, recovery process. Differences between open and closed rhinoplasty.',
      ar: 'جراحة تجميل الأنف، الأسعار، عملية الشفاء. الفروق بين تجميل الأنف المفتوح والمغلق.',
    },
    summary: {
      tr: 'Rinoplasti, burnun şeklini ve işlevini düzeltmek için yapılan cerrahi bir işlemdir. Estetik görünümün yanı sıra nefes alma problemlerini de çözer.',
      en: 'Rhinoplasty is a surgical procedure performed to correct the shape and function of the nose. It solves breathing problems as well as aesthetic appearance.',
      ar: 'تجميل الأنف هو إجراء جراحي يتم إجراؤه لتصحيح شكل ووظيفة الأنف. يحل مشاكل التنفس بالإضافة إلى المظهر الجمالي.',
    },
    priceRange: {
      india: '2.000 € - 4.000 €',
      mexico: '3.500 € - 6.000 €',
      turkey: '2.500 € - 4.500 €',
      thailand: '3.000 € - 5.500 €',
      poland: '3.000 € - 5.000 €',
      uk: '6.000 € - 10.000 €',
      usa: '8.000 € - 15.000 €',
    },
    duration: { tr: '2 - 4 Saat', en: '2 - 4 Hours', ar: '2 - 4 ساعات' },
    recoveryTime: { tr: '1 - 2 Hafta', en: '1 - 2 Weeks', ar: '1 - 2 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '1 Gece', en: '1 Night', ar: 'ليلة واحدة' },
    results: { tr: '6-12 Ayda Tam Sonuç', en: 'Full Result in 6-12 Months', ar: 'نتيجة كاملة في 6-12 شهرًا' },
    suitableFor: [
      { tr: 'Burnundan memnun olmayanlar', en: 'Those unhappy with their nose', ar: 'أولئك غير الراضين عن أنفهم' },
      { tr: 'Nefes alma sorunu yaşayanlar', en: 'Those with breathing problems', ar: 'أولئك الذين يعانون من مشاكل في التنفس' },
      { tr: 'Travma sonrası deformasyonu olanlar', en: 'Those with post-trauma deformity', ar: 'أولئك الذين يعانون من تشوه بعد الصدمة' },
    ],
    notSuitableFor: [
      { tr: 'Kemik gelişimi tamamlanmamış (18 yaş altı)', en: 'Bone development not completed (Under 18)', ar: 'لم يكتمل نمو العظام (تحت 18 عامًا)' },
      { tr: 'Gerçekçi olmayan beklentileri olanlar', en: 'Those with unrealistic expectations', ar: 'أولئك الذين لديهم توقعات غير واقعية' },
    ],
    risks: [
      { tr: 'Kanama ve enfeksiyon', en: 'Bleeding and infection', ar: 'نزيف وعدوى' },
      { tr: 'Nefes alma zorluğu (geçici)', en: 'Breathing difficulty (temporary)', ar: 'صعوبة في التنفس (مؤقت)' },
      { tr: 'Revizyon gereksinimi (%5-10)', en: 'Need for revision (5-10%)', ar: 'الحاجة إلى مراجعة (5-10٪)' },
    ],
    steps: [
      {
        title: { tr: 'Kesi', en: 'Incision', ar: 'شق' },
        desc: {
          tr: 'Burun içinden veya altından kesi yapılır (Açık/Kapalı yöntem).',
          en: 'Incision is made inside or under the nose (Open/Closed method).',
          ar: 'يتم إجراء شق داخل أو تحت الأنف (طريقة مفتوحة/مغلقة).',
        },
      },
      {
        title: { tr: 'Şekillendirme', en: 'Reshaping', ar: 'إعادة تشكيل' },
        desc: {
          tr: 'Kıkırdak ve kemik yapısı yeniden şekillendirilir.',
          en: 'Cartilage and bone structure are reshaped.',
          ar: 'يتم إعادة تشكيل الغضروف وبنية العظام.',
        },
      },
      {
        title: { tr: 'Kapatma', en: 'Closing', ar: 'إغلاق' },
        desc: {
          tr: 'Kesiler kapatılır ve atel takılır.',
          en: 'Incisions are closed and a splint is applied.',
          ar: 'يتم إغلاق الشقوق ووضع جبيرة.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Tamponlar ne zaman çıkar?', en: 'When are tampons removed?', ar: 'متى تتم إزالة السدادات القطنية؟' },
        a: {
          tr: 'Genellikle 2-3 gün içinde silikon tamponlar çıkarılır.',
          en: 'Usually silicone tampons are removed within 2-3 days.',
          ar: 'عادة ما تتم إزالة السدادات القطنية السيليكونية في غضون 2-3 أيام.',
        },
      },
    ],
    category: { tr: 'Estetik Cerrahi', en: 'Plastic Surgery', ar: 'جراحة التجميل' },
  },
  {
    slug: 'dis-implanti',
    procedureKey: 'dis_implanti',
    title: {
      tr: 'Diş İmplantı Tedavisi - 2026 Fiyatları',
      en: 'Dental Implant Treatment - 2026 Prices',
      ar: 'علاج زراعة الأسنان - أسعار 2026',
    },
    metaDescription: {
      tr: 'Eksik dişler için implant tedavisi, titanyum vida, All-on-4 tekniği ve maliyetleri.',
      en: 'Implant treatment for missing teeth, titanium screw, All-on-4 technique and costs.',
      ar: 'علاج الزرع للأسنان المفقودة، برغي التيتانيوم، تقنية All-on-4 والتكاليف.',
    },
    summary: {
      tr: 'Diş implantı, eksik dişlerin yerine çene kemiğine yerleştirilen yapay diş kökleridir. Doğal dişe en yakın alternatiftir.',
      en: 'Dental implants are artificial tooth roots placed in the jawbone to replace missing teeth. It is the closest alternative to natural teeth.',
      ar: 'زراعة الأسنان هي جذور أسنان اصطناعية توضع في عظم الفك لتحل محل الأسنان المفقودة. إنه البديل الأقرب للأسنان الطبيعية.',
    },
    priceRange: {
      india: '400 € - 800 €',
      mexico: '700 € - 1.200 €',
      turkey: '350 € - 700 €',
      thailand: '800 € - 1.500 €',
      poland: '600 € - 1.000 €',
      uk: '1.500 € - 2.500 €',
      usa: '2.000 € - 4.000 €',
    },
    duration: { tr: '30 Dk - 2 Saat', en: '30 Min - 2 Hours', ar: '30 دقيقة - 2 ساعة' },
    recoveryTime: { tr: '3 - 6 Ay (Kaynama)', en: '3 - 6 Months (Osseointegration)', ar: '3 - 6 أشهر (الاندماج العظمي)' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: 'Ömür Boyu', en: 'Lifetime', ar: 'مدى الحياة' },
    suitableFor: [
      { tr: 'Bir veya daha fazla diş eksiği olanlar', en: 'Those with one or more missing teeth', ar: 'أولئك الذين لديهم سن مفقود أو أكثر' },
      { tr: 'Kemik yapısı uygun olanlar', en: 'Those with suitable bone structure', ar: 'أولئك الذين لديهم بنية عظام مناسبة' },
    ],
    notSuitableFor: [
      { tr: 'İleri derecede kemik erimesi olanlar (Greft gerekebilir)', en: 'Those with advanced osteoporosis (Graft may be needed)', ar: 'أولئك الذين يعانون من هشاشة العظام المتقدمة (قد تكون هناك حاجة للتطعيم)' },
      { tr: 'Kontrolsüz diyabet hastaları', en: 'Uncontrolled diabetes patients', ar: 'مرضى السكري غير المنضبط' },
    ],
    risks: [
      { tr: 'Enfeksiyon', en: 'Infection', ar: 'عدوى' },
      { tr: 'İmplantın kemikle kaynaşmaması (Nadir)', en: 'Implant not fusing with bone (Rare)', ar: 'عدم التحام الزرعة بالعظم (نادر)' },
    ],
    steps: [
      {
        title: { tr: 'İmplant Yerleştirme', en: 'Implant Placement', ar: 'وضع الزرعة' },
        desc: {
          tr: 'Çene kemiğine yuva açılır ve vida yerleştirilir.',
          en: 'A socket is opened in the jawbone and the screw is placed.',
          ar: 'يتم فتح تجويف في عظم الفك ووضع المسمار.',
        },
      },
      {
        title: { tr: 'İyileşme Süreci', en: 'Healing Process', ar: 'عملية الشفاء' },
        desc: {
          tr: '3-6 ay implantın kemikle kaynaşması beklenir.',
          en: '3-6 months is expected for the implant to fuse with the bone.',
          ar: 'يتوقع 3-6 أشهر لاندماج الزرعة مع العظم.',
        },
      },
      {
        title: { tr: 'Protez Takılması', en: 'Prosthesis Attachment', ar: 'تثبيت الطرف الاصطناعي' },
        desc: {
          tr: 'Üst yapı (kron) takılarak işlem tamamlanır.',
          en: 'The procedure is completed by attaching the superstructure (crown).',
          ar: 'تكتمل العملية بتركيب البنية الفوقية (التاج).',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'İmplant işlemi acıtır mı?', en: 'Does implant procedure hurt?', ar: 'هل إجراء الزرع مؤلم؟' },
        a: {
          tr: 'İşlem sırasında hissetmezsiniz, sonrasında ağrı kesicilerle kontrol edilebilir.',
          en: 'You do not feel it during the procedure, afterwards it can be controlled with painkillers.',
          ar: 'لا تشعر به أثناء الإجراء، بعد ذلك يمكن السيطرة عليه بمسكنات الألم.',
        },
      },
    ],
    category: { tr: 'Diş Tedavisi', en: 'Dental Treatment', ar: 'علاج الأسنان' },
  },
  {
    slug: 'hollywood-gulusu',
    procedureKey: 'hollywood_gulusu',
    title: {
      tr: 'Hollywood Gülüşü (Smile Design) - 2026',
      en: 'Hollywood Smile (Smile Design) - 2026',
      ar: 'ابتسامة هوليوود (تصميم الابتسامة) - 2026',
    },
    metaDescription: {
      tr: 'Mükemmel gülüş tasarımı, zirkonyum ve lamina kaplamalarla Hollywood Smile estetiği.',
      en: 'Perfect smile design, Hollywood Smile aesthetics with zirconium and laminate veneers.',
      ar: 'تصميم ابتسامة مثالية، جماليات ابتسامة هوليوود مع قشور الزركونيوم والرقائق.',
    },
    summary: {
      tr: 'Hollywood Smile, dişlerin şekil, renk ve boyutunun yüz estetiğine uygun olarak yeniden tasarlandığı kapsamlı bir estetik diş hekimliği işlemidir.',
      en: 'Hollywood Smile is a comprehensive cosmetic dentistry procedure where the shape, color and size of teeth are redesigned in accordance with facial aesthetics.',
      ar: 'ابتسامة هوليوود هي إجراء شامل لطب الأسنان التجميلي حيث يتم إعادة تصميم شكل ولون وحجم الأسنان وفقًا لجماليات الوجه.',
    },
    priceRange: {
      india: '2.500 € - 4.500 €',
      mexico: '4.000 € - 7.000 €',
      turkey: '3.000 € - 6.000 €',
      thailand: '4.000 € - 7.000 €',
      poland: '4.000 € - 7.000 €',
      uk: '10.000 € - 20.000 €',
      usa: '15.000 € - 30.000 €',
    },
    duration: { tr: '5 - 7 Gün', en: '5 - 7 Days', ar: '5 - 7 أيام' },
    recoveryTime: { tr: 'Hemen', en: 'Immediate', ar: 'فوري' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '10-15 Yıl', en: '10-15 Years', ar: '10-15 سنة' },
    suitableFor: [
      { tr: 'Diş renginden ve şeklinden memnun olmayanlar', en: 'Those unhappy with tooth color and shape', ar: 'أولئك غير الراضين عن لون وشكل الأسنان' },
      { tr: 'Kırık, çapraşık veya aralıklı dişleri olanlar', en: 'Those with broken, crooked or gapped teeth', ar: 'أولئك الذين لديهم أسنان مكسورة أو ملتوية أو متباعدة' },
    ],
    notSuitableFor: [
      { tr: 'Ciddi diş eti hastalığı olanlar (Önce tedavi gerekir)', en: 'Those with severe gum disease (Treatment needed first)', ar: 'أولئك الذين يعانون من أمراض اللثة الشديدة (العلاج مطلوب أولاً)' },
    ],
    risks: [
      { tr: 'Diş hassasiyeti', en: 'Tooth sensitivity', ar: 'حساسية الأسنان' },
      { tr: 'Kaplamanın kırılması (Sert cisimlerde)', en: 'Veneer breaking (On hard objects)', ar: 'كسر القشرة (على الأجسام الصلبة)' },
    ],
    steps: [
      {
        title: { tr: 'Tasarım ve Hazırlık', en: 'Design and Preparation', ar: 'التصميم والتحضير' },
        desc: {
          tr: 'Dijital gülüş tasarımı yapılır, dişler tıraşlanır ve ölçü alınır.',
          en: 'Digital smile design is done, teeth are shaved and measurements are taken.',
          ar: 'يتم تصميم الابتسامة الرقمية، ويتم حلاقة الأسنان وأخذ القياسات.',
        },
      },
      {
        title: { tr: 'Geçici Dişler', en: 'Temporary Teeth', ar: 'أسنان مؤقتة' },
        desc: {
          tr: 'Kalıcılar gelene kadar geçici kaplamalar takılır.',
          en: 'Temporary veneers are worn until permanent ones arrive.',
          ar: 'يتم ارتداء القشور المؤقتة حتى وصول القشور الدائمة.',
        },
      },
      {
        title: { tr: 'Final Uygulama', en: 'Final Application', ar: 'التطبيق النهائي' },
        desc: {
          tr: 'Özel üretilen kaplamalar yapıştırılır.',
          en: 'Custom-made veneers are bonded.',
          ar: 'يتم لصق القشور المصنوعة خصيصًا.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Doğal görünür mü?', en: 'Does it look natural?', ar: 'هل يبدو طبيعيا؟' },
        a: {
          tr: 'Evet, yüz hatlarınıza ve ten renginize uygun renk ve form seçilir.',
          en: 'Yes, color and form suitable for your facial features and skin tone are selected.',
          ar: 'نعم، يتم اختيار اللون والشكل المناسبين لملامح وجهك ولون بشرتك.',
        },
      },
    ],
    category: { tr: 'Diş Tedavisi', en: 'Dental Treatment', ar: 'علاج الأسنان' },
  },
  {
    slug: 'zirkonyum-kaplama',
    procedureKey: 'zirkonyum_kaplama',
    title: {
      tr: 'Zirkonyum Kaplama - Dayanıklı ve Estetik',
      en: 'Zirconium Crowns - Durable and Aesthetic',
      ar: 'تيجان الزركونيوم - متينة وجمالية',
    },
    metaDescription: {
      tr: 'Metal desteksiz porselen kaplama olan zirkonyum dişlerin avantajları ve fiyatları.',
      en: 'Advantages and prices of zirconium teeth, which are metal-free porcelain veneers.',
      ar: 'مزايا وأسعار أسنان الزركونيوم، وهي قشور خزفية خالية من المعادن.',
    },
    summary: {
      tr: 'Zirkonyum, ışık geçirgenliği yüksek, metal içermeyen ve diş etine uyumlu, son derece dayanıklı bir kaplama türüdür.',
      en: 'Zirconium is a highly durable type of crown that has high light transmittance, does not contain metal and is compatible with gums.',
      ar: 'الزركونيوم هو نوع متين للغاية من التيجان يتمتع بنفاذية عالية للضوء، ولا يحتوي على معدن ومتوافق مع اللثة.',
    },
    priceRange: {
      india: '150 € - 300 €',
      mexico: '300 € - 500 €',
      turkey: '150 € - 300 €',
      thailand: '300 € - 600 €',
      poland: '250 € - 450 €',
      uk: '600 € - 1.000 €',
      usa: '1.000 € - 2.000 €',
    },
    duration: { tr: '3 - 5 Gün', en: '3 - 5 Days', ar: '3 - 5 أيام' },
    recoveryTime: { tr: 'Hemen', en: 'Immediate', ar: 'فوري' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '10-15 Yıl', en: '10-15 Years', ar: '10-15 سنة' },
    suitableFor: [
      { tr: 'Estetik kaygısı olanlar', en: 'Those with aesthetic concerns', ar: 'أولئك الذين لديهم مخاوف جمالية' },
      { tr: 'Metal alerjisi olanlar', en: 'Those with metal allergies', ar: 'أولئك الذين يعانون من حساسية المعادن' },
    ],
    notSuitableFor: [
      { tr: 'Diş gıcırdatma sorunu olanlar (Gece plağı gerekir)', en: 'Those with teeth grinding problems (Night guard needed)', ar: 'أولئك الذين يعانون من مشاكل صرير الأسنان (مطلوب واقي ليلي)' },
    ],
    risks: [
      { tr: 'Sıcak-soğuk hassasiyeti (geçici)', en: 'Hot-cold sensitivity (temporary)', ar: 'حساسية الساخن والبارد (مؤقت)' },
    ],
    steps: [
      {
        title: { tr: 'Hazırlık', en: 'Preparation', ar: 'تحضير' },
        desc: {
          tr: 'Diş küçültülür ve ölçü alınır.',
          en: 'Tooth is reduced and measurement is taken.',
          ar: 'يتم تصغير السن وأخذ القياس.',
        },
      },
      {
        title: { tr: 'Prova', en: 'Rehearsal', ar: 'بروفة' },
        desc: {
          tr: 'Zirkonyum altyapı ve porselen provaları yapılır.',
          en: 'Zirconium infrastructure and porcelain rehearsals are done.',
          ar: 'يتم إجراء بروفات البنية التحتية للزركونيوم والخزف.',
        },
      },
      {
        title: { tr: 'Yapıştırma', en: 'Cementation', ar: 'تدعيم' },
        desc: {
          tr: 'Kalıcı yapıştırma işlemi yapılır.',
          en: 'Permanent bonding process is done.',
          ar: 'يتم إجراء عملية الترابط الدائم.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Zirkonyum renk değiştirir mi?', en: 'Does zirconium change color?', ar: 'هل يتغير لون الزركونيوم؟' },
        a: {
          tr: 'Hayır, yüzeyi pürüzsüz olduğu için leke tutmaz ve renk değiştirmez.',
          en: 'No, since its surface is smooth, it does not stain or change color.',
          ar: 'لا، نظرًا لأن سطحه أملس، فإنه لا يتلطخ أو يتغير لونه.',
        },
      },
    ],
    category: { tr: 'Diş Tedavisi', en: 'Dental Treatment', ar: 'علاج الأسنان' },
  },
  {
    slug: 'meme-buyutme',
    procedureKey: 'meme_buyutme',
    title: {
      tr: 'Meme Büyütme (Göğüs Estetiği) - 2026',
      en: 'Breast Augmentation (Boob Job) - 2026',
      ar: 'تكبير الثدي (تجميل الثدي) - 2026',
    },
    metaDescription: {
      tr: 'Silikon implant ile meme büyütme ameliyatı, çeşitleri ve fiyatları.',
      en: 'Breast augmentation surgery with silicone implants, types and prices.',
      ar: 'جراحة تكبير الثدي بزراعة السيليكون، الأنواع والأسعار.',
    },
    summary: {
      tr: 'Meme büyütme, göğüs hacmini artırmak ve şeklini düzeltmek için silikon implantlar veya yağ transferi kullanılarak yapılan cerrahi işlemdir.',
      en: 'Breast augmentation is a surgical procedure performed using silicone implants or fat transfer to increase breast volume and correct its shape.',
      ar: 'تكبير الثدي هو إجراء جراحي يتم إجراؤه باستخدام زراعة السيليكون أو نقل الدهون لزيادة حجم الثدي وتصحيح شكله.',
    },
    priceRange: {
      india: '2.500 € - 4.000 €',
      mexico: '3.500 € - 6.000 €',
      turkey: '3.000 € - 5.000 €',
      thailand: '3.500 € - 6.000 €',
      poland: '3.500 € - 5.500 €',
      uk: '5.000 € - 9.000 €',
      usa: '6.000 € - 12.000 €',
    },
    duration: { tr: '1 - 2 Saat', en: '1 - 2 Hours', ar: '1 - 2 ساعات' },
    recoveryTime: { tr: '1 - 2 Hafta', en: '1 - 2 Weeks', ar: '1 - 2 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '1 Gece', en: '1 Night', ar: 'ليلة واحدة' },
    results: { tr: '10-15 Yıl (İmplant ömrü)', en: '10-15 Years (Implant life)', ar: '10-15 سنة (عمر الزرعة)' },
    suitableFor: [
      { tr: 'Küçük göğüslü kadınlar', en: 'Women with small breasts', ar: 'النساء ذوات الثدي الصغير' },
      { tr: 'Emzirme sonrası hacim kaybı yaşayanlar', en: 'Those with volume loss after breastfeeding', ar: 'أولئك الذين يعانون من فقدان الحجم بعد الرضاعة الطبيعية' },
      { tr: 'Meme asimetrisi olanlar', en: 'Those with breast asymmetry', ar: 'أولئك الذين يعانون من عدم تناسق الثدي' },
    ],
    notSuitableFor: [
      { tr: 'Hamile veya emzirenler', en: 'Pregnant or breastfeeding women', ar: 'النساء الحوامل أو المرضعات' },
    ],
    risks: [
      { tr: 'Kapsül kontraktürü', en: 'Capsular contracture', ar: 'تقلص المحفظة' },
      { tr: 'İmplant sızıntısı veya yırtılması (nadir)', en: 'Implant leakage or rupture (rare)', ar: 'تسرب الزرعة أو تمزقها (نادر)' },
    ],
    steps: [
      {
        title: { tr: 'Kesi', en: 'Incision', ar: 'شق' },
        desc: {
          tr: 'Meme altı, koltuk altı veya meme başından kesi yapılır.',
          en: 'Incision is made under the breast, armpit or nipple.',
          ar: 'يتم عمل شق تحت الثدي أو الإبط أو الحلمة.',
        },
      },
      {
        title: { tr: 'İmplant Yerleştirme', en: 'Implant Placement', ar: 'وضع الزرعة' },
        desc: {
          tr: 'Kas altı veya kas üstü plana implant yerleştirilir.',
          en: 'Implant is placed in the submuscular or subglandular plane.',
          ar: 'يتم وضع الزرعة في المستوى تحت العضلي أو تحت الغدي.',
        },
      },
      {
        title: { tr: 'Kapatma', en: 'Closing', ar: 'إغلاق' },
        desc: {
          tr: 'Estetik dikişlerle kapatılır.',
          en: 'Closed with aesthetic sutures.',
          ar: 'مغلق بخيوط تجميلية.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Emzirmeye engel mi?', en: 'Does it prevent breastfeeding?', ar: 'هل يمنع الرضاعة الطبيعية؟' },
        a: {
          tr: 'Genellikle engel değildir, ancak kesi yerine göre değişebilir.',
          en: 'It usually does not prevent it, but it may vary depending on the incision site.',
          ar: 'عاده لا يمنع ذلك، ولكن قد يختلف حسب موقع الشق.',
        },
      },
    ],
    category: { tr: 'Estetik Cerrahi', en: 'Plastic Surgery', ar: 'جراحة التجميل' },
  },
  {
    slug: 'liposuction',
    procedureKey: 'liposuction',
    title: {
      tr: 'Liposuction (Yağ Aldırma) - 2026',
      en: 'Liposuction (Fat Removal) - 2026',
      ar: 'شفط الدهون (إزالة الدهون) - 2026',
    },
    metaDescription: {
      tr: 'Vaser, Lazer ve geleneksel liposuction yöntemleri, fiyatları ve iyileşme süreci.',
      en: 'Vaser, Laser and traditional liposuction methods, prices and recovery process.',
      ar: 'طرق شفط الدهون بالفيزر والليزر والتقليدية، الأسعار وعملية الشفاء.',
    },
    summary: {
      tr: 'Liposuction, vücudun belirli bölgelerinde biriken inatçı yağların vakumla çekilerek vücudun şekillendirilmesi işlemidir.',
      en: 'Liposuction is the process of shaping the body by vacuuming stubborn fats accumulated in certain parts of the body.',
      ar: 'شفط الدهون هو عملية تشكيل الجسم عن طريق شفط الدهون العنيدة المتراكمة في أجزاء معينة من الجسم.',
    },
    priceRange: {
      india: '1.500 € - 3.000 €',
      mexico: '2.500 € - 4.500 €',
      turkey: '2.000 € - 4.000 €',
      thailand: '2.500 € - 4.500 €',
      poland: '2.000 € - 3.500 €',
      uk: '4.000 € - 8.000 €',
      usa: '5.000 € - 10.000 €',
    },
    duration: { tr: '1 - 4 Saat', en: '1 - 4 Hours', ar: '1 - 4 ساعات' },
    recoveryTime: { tr: '1 - 3 Hafta', en: '1 - 3 Weeks', ar: '1 - 3 أسابيع' },
    anesthesia: { tr: 'Genel veya Lokal', en: 'General or Local', ar: 'عام أو موضعي' },
    hospitalStay: { tr: '0 - 1 Gece', en: '0 - 1 Night', ar: '0 - 1 ليلة' },
    results: { tr: 'Kalıcı (Kilo korunursa)', en: 'Permanent (If weight is maintained)', ar: 'دائم (إذا تم الحفاظ على الوزن)' },
    suitableFor: [
      { tr: 'Bölgesel yağlanması olanlar', en: 'Those with regional fat', ar: 'أولئك الذين يعانون من الدهون الموضعية' },
      { tr: 'İdeal kilosuna yakın olanlar', en: 'Those close to their ideal weight', ar: 'أولئك القريبون من وزنهم المثالي' },
    ],
    notSuitableFor: [
      { tr: 'Obezite hastaları (Zayıflama yöntemi değildir)', en: 'Obesity patients (Not a weight loss method)', ar: 'مرضى السمنة (ليست طريقة لفقدان الوزن)' },
    ],
    risks: [
      { tr: 'Düzensiz cilt yüzeyi', en: 'Irregular skin surface', ar: 'سطح جلد غير منتظم' },
      { tr: 'Ödem ve morluk', en: 'Edema and bruising', ar: 'وذمة وكدمات' },
    ],
    steps: [
      {
        title: { tr: 'İnfiltrasyon', en: 'Infiltration', ar: 'تسلل' },
        desc: {
          tr: 'Yağları çözmek için özel sıvı enjekte edilir.',
          en: 'Special fluid is injected to dissolve fats.',
          ar: 'يتم حقن سائل خاص لإذابة الدهون.',
        },
      },
      {
        title: { tr: 'Yağ Parçalama', en: 'Fat Breaking', ar: 'تكسير الدهون' },
        desc: {
          tr: 'Lazer veya ultrason ile yağlar parçalanır (Vaser/Lazer Lipo).',
          en: 'Fats are broken down with laser or ultrasound (Vaser/Laser Lipo).',
          ar: 'يتم تكسير الدهون بالليزر أو الموجات فوق الصوتية (فيزر/ليزر ليبو).',
        },
      },
      {
        title: { tr: 'Aspirasyon', en: 'Aspiration', ar: 'شفط' },
        desc: {
          tr: 'Kanüllerle yağlar çekilir.',
          en: 'Fats are sucked out with cannulas.',
          ar: 'يتم شفط الدهون بالقنيات.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Tekrar yağ oluşur mu?', en: 'Does fat form again?', ar: 'هل تتشكل الدهون مرة أخرى؟' },
        a: {
          tr: 'Alınan yağ hücreleri geri gelmez, ancak kalan hücreler şişebilir.',
          en: 'Removed fat cells do not return, but remaining cells can swell.',
          ar: 'لا تعود الخلايا الدهنية التي تمت إزالتها، ولكن الخلايا المتبقية يمكن أن تنتفخ.',
        },
      },
    ],
    category: { tr: 'Estetik Cerrahi', en: 'Plastic Surgery', ar: 'جراحة التجميل' },
  },
  {
    slug: 'tup-mide',
    procedureKey: 'tup_mide',
    title: {
      tr: 'Tüp Mide Ameliyatı (Mide Küçültme) - 2026',
      en: 'Gastric Sleeve Surgery (Stomach Reduction) - 2026',
      ar: 'جراحة تكميم المعدة (تصغير المعدة) - 2026',
    },
    metaDescription: {
      tr: 'Obezite tedavisinde tüp mide ameliyatı, riskleri, fiyatları ve kilo verme süreci.',
      en: 'Gastric sleeve surgery in obesity treatment, risks, prices and weight loss process.',
      ar: 'جراحة تكميم المعدة في علاج السمنة، المخاطر، الأسعار وعملية إنقاص الوزن.',
    },
    summary: {
      tr: 'Tüp mide (Sleeve Gastrektomi), midenin yaklaşık %80’inin çıkarılarak hacminin küçültüldüğü bir obezite cerrahisidir. İştah hormonu da azaltılır.',
      en: 'Gastric sleeve (Sleeve Gastrectomy) is an obesity surgery where about 80% of the stomach is removed to reduce its volume. Appetite hormone is also reduced.',
      ar: 'تكميم المعدة (استئصال المعدة الكمي) هو جراحة السمنة حيث يتم إزالة حوالي 80٪ من المعدة لتقليل حجمها. يتم تقليل هرمون الشهية أيضًا.',
    },
    priceRange: {
      india: '3.000 € - 5.000 €',
      mexico: '4.000 € - 6.500 €',
      turkey: '2.500 € - 4.500 €',
      thailand: '5.000 € - 8.000 €',
      poland: '4.500 € - 6.500 €',
      uk: '10.000 € - 15.000 €',
      usa: '15.000 € - 25.000 €',
    },
    duration: { tr: '1 - 2 Saat', en: '1 - 2 Hours', ar: '1 - 2 ساعات' },
    recoveryTime: { tr: '2 - 4 Hafta', en: '2 - 4 Weeks', ar: '2 - 4 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '2 - 3 Gece', en: '2 - 3 Nights', ar: '2 - 3 ليال' },
    results: { tr: 'Kalıcı (Yaşam tarzı değişikliği ile)', en: 'Permanent (With lifestyle change)', ar: 'دائم (مع تغيير نمط الحياة)' },
    suitableFor: [
      { tr: 'VKİ 35 üzeri olanlar', en: 'Those with BMI over 35', ar: 'أولئك الذين لديهم مؤشر كتلة الجسم أكثر من 35' },
      { tr: 'Diyetle kilo veremeyenler', en: 'Those who cannot lose weight with diet', ar: 'أولئك الذين لا يستطيعون إنقاص الوزن مع النظام الغذائي' },
    ],
    notSuitableFor: [
      { tr: 'Ciddi reflüsü olanlar (Gastrik bypass önerilebilir)', en: 'Those with severe reflux (Gastric bypass may be suggested)', ar: 'أولئك الذين يعانون من ارتجاع شديد (قد يُقترح تحويل مسار المعدة)' },
    ],
    risks: [
      { tr: 'Kaçak riski', en: 'Leakage risk', ar: 'خطر التسرب' },
      { tr: 'Vitamin eksikliği', en: 'Vitamin deficiency', ar: 'نقص الفيتامينات' },
    ],
    steps: [
      {
        title: { tr: 'Giriş', en: 'Entry', ar: 'دخول' },
        desc: {
          tr: 'Laparoskopik (kapalı) yöntemle karına girilir.',
          en: 'Abdomen is entered with laparoscopic (closed) method.',
          ar: 'يتم إدخال البطن بطريقة التنظير البطني (المغلقة).',
        },
      },
      {
        title: { tr: 'Kesme', en: 'Cutting', ar: 'قطع' },
        desc: {
          tr: 'Midenin büyük kısmı zımbalanarak kesilir ve çıkarılır.',
          en: 'A large part of the stomach is stapled, cut and removed.',
          ar: 'يتم تدبيس جزء كبير من المعدة وقطعه وإزالته.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Ne kadar kilo veririm?', en: 'How much weight will I lose?', ar: 'كم سأفقد من الوزن؟' },
        a: {
          tr: 'İlk yıl fazla kilonuzun %60-70’ini verebilirsiniz.',
          en: 'You can lose 60-70% of your excess weight in the first year.',
          ar: 'يمكنك أن تفقد 60-70٪ من وزنك الزائد في السنة الأولى.',
        },
      },
    ],
    category: { tr: 'Obezite Cerrahisi', en: 'Weight Loss Surgery', ar: 'جراحة إنقاص الوزن' },
  },
  {
    slug: 'goz-cizdirme',
    procedureKey: 'goz_cizdirme',
    title: {
      tr: 'Lazer Göz Ameliyatı (LASIK/No Touch) - 2026',
      en: 'Laser Eye Surgery (LASIK/No Touch) - 2026',
      ar: 'جراحة العيون بالليزر (LASIK/No Touch) - 2026',
    },
    metaDescription: {
      tr: 'Miyop, hipermetrop ve astigmat tedavisi için lazer göz ameliyatı fiyatları ve çeşitleri.',
      en: 'Laser eye surgery prices and types for myopia, hyperopia and astigmatism treatment.',
      ar: 'أسعار وأنواع جراحة العيون بالليزر لعلاج قصر النظر وطول النظر والاستجماتيزم.',
    },
    summary: {
      tr: 'Lazer göz ameliyatı, korneanın şeklini değiştirerek kırma kusurlarını (gözlük ihtiyacını) düzelten bir işlemdir. LASIK, iLASIK, No Touch gibi yöntemleri vardır.',
      en: 'Laser eye surgery is a procedure that corrects refractive errors (need for glasses) by changing the shape of the cornea. There are methods such as LASIK, iLASIK, No Touch.',
      ar: 'جراحة العيون بالليزر هي إجراء يصحح الأخطاء الانكسارية (الحاجة إلى نظارات) عن طريق تغيير شكل القرنية. هناك طرق مثل LASIK و iLASIK و No Touch.',
    },
    priceRange: {
      india: '500 € - 1.000 €',
      mexico: '1.000 € - 2.000 €',
      turkey: '800 € - 1.500 €',
      thailand: '1.500 € - 2.500 €',
      poland: '1.200 € - 2.000 €',
      uk: '3.000 € - 5.000 €',
      usa: '4.000 € - 6.000 €',
    },
    duration: { tr: '10 - 20 Dakika', en: '10 - 20 Minutes', ar: '10 - 20 دقيقة' },
    recoveryTime: { tr: '1 - 3 Gün', en: '1 - 3 Days', ar: '1 - 3 أيام' },
    anesthesia: { tr: 'Damlalı Anestezi', en: 'Drop Anesthesia', ar: 'تخدير قطرة' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: 'Kalıcı', en: 'Permanent', ar: 'دائم' },
    suitableFor: [
      { tr: '18 yaşını doldurmuş olanlar', en: 'Those over 18 years old', ar: 'أولئك الذين تزيد أعمارهم عن 18 عامًا' },
      { tr: 'Göz numarası son 1 yıldır değişmeyenler', en: 'Those whose eye prescription has not changed for the last 1 year', ar: 'أولئك الذين لم تتغير وصفة عينهم خلال العام الماضي' },
    ],
    notSuitableFor: [
      { tr: 'Kornea yapısı çok ince olanlar', en: 'Those with very thin cornea structure', ar: 'أولئك الذين لديهم بنية قرنية رقيقة جدا' },
      { tr: 'Hamileler', en: 'Pregnant women', ar: 'النساء الحوامل' },
    ],
    risks: [
      { tr: 'Göz kuruluğu', en: 'Dry eyes', ar: 'جفاف العين' },
      { tr: 'Gece görüşünde hareler (geçici)', en: 'Halos in night vision (temporary)', ar: 'هالات في الرؤية الليلية (مؤقت)' },
    ],
    steps: [
      {
        title: { tr: 'Hazırlık', en: 'Preparation', ar: 'تحضير' },
        desc: {
          tr: 'Göz uyuşturulur.',
          en: 'Eye is numbed.',
          ar: 'يتم تخدير العين.',
        },
      },
      {
        title: { tr: 'Lazer Uygulaması', en: 'Laser Application', ar: 'تطبيق الليزر' },
        desc: {
          tr: 'Excimer lazer ile kornea şekillendirilir.',
          en: 'Cornea is shaped with Excimer laser.',
          ar: 'يتم تشكيل القرنية بليزر إكسيمر.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Ağrı olur mu?', en: 'Is there pain?', ar: 'هل يوجد ألم؟' },
        a: {
          tr: 'İşlem sırasında ağrı olmaz, sonrasında hafif yanma olabilir.',
          en: 'There is no pain during the procedure, there may be slight burning afterwards.',
          ar: 'لا يوجد ألم أثناء العملية، قد يكون هناك حرقان طفيف بعد ذلك.',
        },
      },
    ],
    category: { tr: 'Göz Cerrahisi', en: 'Eye Surgery', ar: 'جراحة العيون' },
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
