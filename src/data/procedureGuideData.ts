﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿
export interface ProcedureGuideInfo {
  slug: string;
  procedureKey: string;
  title: LangText;
  metaDescription: LangText;
  summary: LangText;
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
  suitableFor: LangText[];
  notSuitableFor: LangText[];
  risks: LangText[];
  steps: { title: LangText; desc: LangText }[];
  faq: { q: LangText; a: LangText }[];
  category: { tr: string; en: string; ar: string };
}

export type LangText = { tr: string; en: string; ar: string; fr: string; es: string };

export const PROCEDURE_GUIDES: ProcedureGuideInfo[] = [
  {
    slug: 'sac-ekimi-fue',
    procedureKey: 'sac_ekimi_fue',
    title: {
      tr: 'Saç Ekimi FUE - 2026 Rehberi ve Fiyatlar',
      en: 'Hair Transplant FUE - 2026 Guide and Prices',
      ar: 'زراعة الشعر FUE - دليل 2026 والأسعار',
      fr: 'Greffe de cheveux FUE - Guide 2026 et prix',
      es: 'Trasplante capilar FUE - Guía 2026 y precios',
    },
    metaDescription: {
      tr: 'FUE saç ekimi nedir, nasıl yapılır, fiyatları ne kadar? 2026 güncel rehberi, iyileşme süreci ve ülke karşılaştırmaları.',
      en: 'What is FUE hair transplant, how is it done, how much does it cost? 2026 updated guide, recovery process and country comparisons.',
      ar: 'ما هي زراعة الشعر FUE، كيف تتم، وكم تكلفتها؟ دليل محدث لعام 2026، عملية الشفاء ومقارنات الدول.',
      fr: 'Qu’est-ce que la greffe capillaire FUE, comment se déroule-t-elle et combien coûte-t-elle ? Guide 2026, récupération et comparatifs par pays.',
      es: '¿Qué es el trasplante capilar FUE, cómo se realiza y cuánto cuesta? Guía 2026, recuperación y comparativas por país.',
    },
    summary: {
      tr: 'FUE (Follicular Unit Extraction), saç köklerinin donör bölgeden tek tek alınıp kel bölgeye ekilmesi işlemidir. Dikişsizdir, iz bırakmaz ve doğal sonuçlar verir.',
      en: 'FUE (Follicular Unit Extraction) is the process of extracting hair follicles one by one from the donor area and transplanting them to the bald area. It is seamless, leaves no scars and gives natural results.',
      ar: 'FUE (استخراج وحدة بصيلات الشعر) هي عملية استخراج بصيلات الشعر واحدة تلو الأخرى من المنطقة المانحة وزرعها في المنطقة الصلعاء. إنها غير ملحومة ولا تترك ندوبًا وتعطي نتائج طبيعية.',
      fr: 'La FUE (Follicular Unit Extraction) consiste à prélever les follicules un par un dans la zone donneuse puis à les implanter dans la zone dégarnie. Sans points de suture, avec très peu de traces et un résultat naturel.',
      es: 'La FUE (Extracción de Unidades Foliculares) consiste en extraer los folículos uno a uno de la zona donante y trasplantarlos a la zona sin pelo. Sin suturas, con mínimas marcas y resultados naturales.',
    },
    priceRange: {
      india: '1.200 - 2.500 USD',
      mexico: '2.500 - 4.500 USD',
      turkey: '1.500 - 2.500 USD',
      thailand: '2.000 - 3.500 USD',
      poland: '2.500 - 4.000 USD',
      uk: '6.000 - 10.000 USD',
      usa: '8.000 - 15.000 USD',
    },
    duration: { tr: '6 - 8 Saat', en: '6 - 8 Hours', ar: '6 - 8 ساعات' },
    recoveryTime: { tr: '7 - 10 Gün', en: '7 - 10 Days', ar: '7 - 10 أيام' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '12 Ayda Tam Sonuç', en: 'Full Result in 12 Months', ar: 'نتيجة كاملة في 12 شهرًا' },
    suitableFor: [
      {
        tr: 'Erkek tipi kellik yaşayanlar',
        en: 'Those with male pattern baldness',
        ar: 'أولئك الذين يعانون من الصلع الذكوري',
        fr: 'Personnes souffrant d’alopécie androgénétique',
        es: 'Personas con alopecia androgenética',
      },
      {
        tr: 'Donör bölgesi yeterli olanlar',
        en: 'Those with sufficient donor area',
        ar: 'أولئك الذين لديهم منطقة مانحة كافية',
        fr: 'Personnes disposant d’une zone donneuse suffisante',
        es: 'Personas con zona donante suficiente',
      },
      {
        tr: 'Saç çizgisini düzeltmek isteyenler',
        en: 'Those who want to correct hairline',
        ar: 'أولئك الذين يرغبون في تصحيح خط الشعر',
        fr: 'Personnes souhaitant corriger la ligne frontale',
        es: 'Quienes desean corregir la línea de implantación',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Donör alanı çok zayıf olanlar',
        en: 'Those with very weak donor area',
        ar: 'أولئك الذين لديهم منطقة مانحة ضعيفة جدًا',
        fr: 'Personnes avec une zone donneuse très faible',
        es: 'Personas con zona donante muy débil',
      },
      {
        tr: 'Kronik hastalığı olanlar (Doktor onayı gerekir)',
        en: 'Those with chronic diseases (Doctor approval required)',
        ar: 'أولئك الذين يعانون من أمراض مزمنة (مطلوب موافقة الطبيب)',
        fr: 'Personnes atteintes de maladies chroniques (avis médical nécessaire)',
        es: 'Personas con enfermedades crónicas (se requiere aprobación médica)',
      },
    ],
    risks: [
      {
        tr: 'Geçici ödem ve şişlik',
        en: 'Temporary edema and swelling',
        ar: 'وذمة وتورم مؤقت',
        fr: 'Œdème et gonflement temporaires',
        es: 'Edema e hinchazón temporales',
      },
      {
        tr: 'Enfeksiyon riski (düşük)',
        en: 'Infection risk (low)',
        ar: 'خطر العدوى (منخفض)',
        fr: 'Risque d’infection (faible)',
        es: 'Riesgo de infección (bajo)',
      },
      {
        tr: 'Şok dökülme (normal süreç)',
        en: 'Shock loss (normal process)',
        ar: 'تساقط الصدمة (عملية طبيعية)',
        fr: 'Chute de choc (processus normal)',
        es: 'Caída por shock (proceso normal)',
      },
    ],
    steps: [
      {
        title: {
          tr: 'Konsültasyon',
          en: 'Consultation',
          ar: 'استشارة',
          fr: 'Consultation',
          es: 'Consulta',
        },
        desc: {
          tr: 'Saç analizi yapılır, saç çizgisi belirlenir ve greft sayısı hesaplanır.',
          en: 'Hair analysis is performed, hairline is determined and graft number is calculated.',
          ar: 'يتم إجراء تحليل الشعر وتحديد خط الشعر وحساب عدد الطعوم.',
          fr: 'Une analyse capillaire est réalisée, la ligne frontale est définie et le nombre de greffons est calculé.',
          es: 'Se realiza un análisis capilar, se define la línea de implantación y se calcula el número de injertos.',
        },
      },
      {
        title: {
          tr: 'Köklerin Alınması',
          en: 'Extraction',
          ar: 'اقتطاف',
          fr: 'Prélèvement',
          es: 'Extracción',
        },
        desc: {
          tr: 'Lokal anestezi altında mikromotor ile kökler tek tek toplanır.',
          en: 'Roots are collected one by one with a micromotor under local anesthesia.',
          ar: 'يتم جمع الجذور واحدًا تلو الآخر باستخدام محرك دقيق تحت التخدير الموضعي.',
          fr: 'Sous anesthésie locale, les greffons sont prélevés un à un à l’aide d’un micromoteur.',
          es: 'Bajo anestesia local, los injertos se extraen uno a uno con un micromotor.',
        },
      },
      {
        title: {
          tr: 'Kanal Açılması',
          en: 'Channel Opening',
          ar: 'فتح القناة',
          fr: 'Ouverture des canaux',
          es: 'Apertura de canales',
        },
        desc: {
          tr: 'Ekim yapılacak bölgeye safir uçlarla kanallar açılır.',
          en: 'Channels are opened with sapphire tips to the area to be transplanted.',
          ar: 'يتم فتح القنوات بأطراف الياقوت في المنطقة المراد زراعتها.',
          fr: 'Des canaux sont créés dans la zone receveuse à l’aide de lames en saphir.',
          es: 'Se abren canales en la zona receptora con puntas de zafiro.',
        },
      },
      {
        title: {
          tr: 'Ekim İşlemi',
          en: 'Implantation',
          ar: 'زرع',
          fr: 'Implantation',
          es: 'Implantación',
        },
        desc: {
          tr: 'Toplanan kökler açılan kanallara yerleştirilir.',
          en: 'Collected roots are placed in the opened channels.',
          ar: 'يتم وضع الجذور المجمعة في القنوات المفتوحة.',
          fr: 'Les greffons prélevés sont placés dans les canaux ouverts.',
          es: 'Los injertos extraídos se colocan en los canales abiertos.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'FUE saç ekimi ağrılı mı?',
          en: 'Is FUE hair transplant painful?',
          ar: 'هل زراعة الشعر FUE مؤلمة؟',
          fr: 'La greffe de cheveux FUE est-elle douloureuse ?',
          es: '¿Duele el trasplante capilar FUE?',
        },
        a: {
          tr: 'İşlem lokal anestezi altında yapıldığı için ağrı hissedilmez. Sonrasında hafif sızı olabilir.',
          en: 'Since the procedure is performed under local anesthesia, pain is not felt. Afterwards, there may be slight ache.',
          ar: 'نظرًا لأن الإجراء يتم تحت التخدير الموضعي، فلا يشعر بالألم. بعد ذلك، قد يكون هناك ألم طفيف.',
          fr: 'L’intervention se fait sous anesthésie locale, vous ne ressentez donc pas de douleur. Ensuite, une légère gêne peut apparaître.',
          es: 'El procedimiento se realiza con anestesia local, por lo que no se siente dolor. Después puede haber una ligera molestia.',
        },
      },
      {
        q: {
          tr: 'Ne zaman işe dönebilirim?',
          en: 'When can I return to work?',
          ar: 'متى يمكنني العودة إلى العمل؟',
          fr: 'Quand puis-je reprendre le travail ?',
          es: '¿Cuándo puedo volver al trabajo?',
        },
        a: {
          tr: 'Genellikle 3-5 gün içinde sosyal hayata ve ofis işlerine dönülebilir.',
          en: 'Usually, you can return to social life and office work within 3-5 days.',
          ar: 'عادة، يمكنك العودة إلى الحياة الاجتماعية والعمل المكتبي في غضون 3-5 أيام.',
          fr: 'En général, vous pouvez reprendre une vie sociale et un travail de bureau en 3 à 5 jours.',
          es: 'Por lo general, puedes volver a la vida social y al trabajo de oficina en 3 a 5 días.',
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
      fr: 'Greffe de cheveux DHI - Guide 2026 et prix',
      es: 'Trasplante capilar DHI - Guía 2026 y precios',
    },
    metaDescription: {
      tr: 'DHI (Choi Pen) saç ekimi nedir? Tıraşsız saç ekimi avantajları, maliyetleri ve FUE ile farkları.',
      en: 'What is DHI (Choi Pen) hair transplant? Unshaven hair transplant advantages, costs and differences from FUE.',
      ar: 'ما هي زراعة الشعر DHI (قلم تشوي)؟ مزايا زراعة الشعر بدون حلاقة، التكاليف والاختلافات عن FUE.',
      fr: 'Qu’est-ce que la greffe capillaire DHI (stylo Choi) ? Avantages d’une greffe sans rasage, coûts et différences avec la FUE.',
      es: '¿Qué es el trasplante capilar DHI (Choi Pen)? Ventajas del trasplante sin rasurar, costes y diferencias con FUE.',
    },
    summary: {
      tr: 'DHI (Direct Hair Implantation), özel Choi kalemleri kullanılarak kanal açma ve ekim işleminin aynı anda yapıldığı yöntemdir. Daha sık ekim imkanı sunar ve iyileşme süresi daha hızlıdır.',
      en: 'DHI (Direct Hair Implantation) is a method where channel opening and implantation are performed simultaneously using special Choi pens. It offers denser implantation and faster recovery time.',
      ar: 'DHI (زراعة الشعر المباشرة) هي طريقة يتم فيها فتح القناة والزرع في وقت واحد باستخدام أقلام تشوي الخاصة. يوفر إمكانية زراعة أكثر كثافة ووقت شفاء أسرع.',
      fr: 'La DHI (Direct Hair Implantation) utilise des stylos Choi pour ouvrir les canaux et implanter en une seule étape. Elle permet une implantation plus dense et une récupération plus rapide.',
      es: 'La DHI (Implantación Capilar Directa) utiliza plumas Choi para abrir canales e implantar en un solo paso. Permite mayor densidad y una recuperación más rápida.',
    },
    priceRange: {
      india: '1.500 - 3.000 USD',
      mexico: '3.000 - 5.000 USD',
      turkey: '1.800 - 3.000 USD',
      thailand: '2.500 - 4.000 USD',
      poland: '3.000 - 5.000 USD',
      uk: '7.000 - 12.000 USD',
      usa: '9.000 - 16.000 USD',
    },
    duration: { tr: '6 - 8 Saat', en: '6 - 8 Hours', ar: '6 - 8 ساعات' },
    recoveryTime: { tr: '5 - 7 Gün', en: '5 - 7 Days', ar: '5 - 7 أيام' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '12 Ayda Tam Sonuç', en: 'Full Result in 12 Months', ar: 'نتيجة كاملة في 12 شهرًا' },
    suitableFor: [
      {
        tr: 'Tıraşsız ekim isteyenler',
        en: 'Those who want unshaven transplant',
        ar: 'أولئك الذين يريدون زراعة بدون حلاقة',
        fr: 'Personnes souhaitant une greffe sans rasage',
        es: 'Quienes quieren un trasplante sin rasurar',
      },
      {
        tr: 'Daha sık ekim hedefleyenler',
        en: 'Those aiming for denser transplant',
        ar: 'أولئك الذين يهدفون إلى زراعة أكثر كثافة',
        fr: 'Personnes visant une implantation plus dense',
        es: 'Quienes buscan una implantación más densa',
      },
      {
        tr: 'Kadın hastalar için ideal',
        en: 'Ideal for female patients',
        ar: 'مثالي للمرضى الإناث',
        fr: 'Idéal pour les patientes',
        es: 'Ideal para pacientes mujeres',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Çok geniş açıklığı olanlar (FUE daha uygun olabilir)',
        en: 'Those with very large bald areas (FUE might be more suitable)',
        ar: 'أولئك الذين لديهم مناطق صلعاء كبيرة جدًا (قد يكون FUE أكثر ملاءمة)',
        fr: 'Personnes avec des zones dégarnies très étendues (la FUE peut être plus adaptée)',
        es: 'Personas con áreas calvas muy extensas (FUE puede ser más adecuado)',
      },
      {
        tr: 'Kıvırcık saçlılar (Bazen zor olabilir)',
        en: 'Those with curly hair (Sometimes can be difficult)',
        ar: 'أولئك الذين لديهم شعر مجعد (أحيانًا قد يكون صعبًا)',
        fr: 'Personnes aux cheveux bouclés (parfois plus difficile)',
        es: 'Personas con cabello rizado (a veces puede ser más difícil)',
      },
    ],
    risks: [
      {
        tr: 'Daha uzun işlem süresi',
        en: 'Longer procedure time',
        ar: 'وقت إجراء أطول',
        fr: 'Durée d’intervention plus longue',
        es: 'Mayor duración del procedimiento',
      },
      {
        tr: 'Maliyetin FUE’ye göre yüksek olması',
        en: 'Higher cost compared to FUE',
        ar: 'تكلفة أعلى مقارنة بـ FUE',
        fr: 'Coût plus élevé par rapport à la FUE',
        es: 'Costo más alto en comparación con FUE',
      },
    ],
    steps: [
      {
        title: {
          tr: 'Hazırlık',
          en: 'Preparation',
          ar: 'تحضير',
          fr: 'Préparation',
          es: 'Preparación',
        },
        desc: {
          tr: 'Lokal anestezi ve donör bölgeden köklerin toplanması (FUE ile aynı).',
          en: 'Local anesthesia and extraction of roots from donor area (Same as FUE).',
          ar: 'تخدير موضعي وجمع الجذور من المنطقة المانحة (مثل FUE).',
          fr: 'Anesthésie locale et prélèvement des greffons dans la zone donneuse (comme pour la FUE).',
          es: 'Anestesia local y extracción de injertos de la zona donante (igual que FUE).',
        },
      },
      {
        title: {
          tr: 'Choi Kalemi ile Ekim',
          en: 'Implantation with Choi Pen',
          ar: 'الزرع بقلم تشوي',
          fr: 'Implantation avec stylo Choi',
          es: 'Implantación con pluma Choi',
        },
        desc: {
          tr: 'Kökler kalemin içine yerleştirilir ve direkt deriye enjekte edilir.',
          en: 'Roots are placed inside the pen and injected directly into the skin.',
          ar: 'توضع الجذور داخل القلم وتحقن مباشرة في الجلد.',
          fr: 'Les greffons sont placés dans le stylo puis implantés directement dans la peau.',
          es: 'Los injertos se colocan dentro de la pluma y se implantan directamente en la piel.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'FUE mi DHI mı daha iyi?',
          en: 'Is FUE or DHI better?',
          ar: 'أيهما أفضل FUE أم DHI؟',
          fr: 'La FUE ou la DHI est-elle meilleure ?',
          es: '¿Qué es mejor, FUE o DHI?',
        },
        a: {
          tr: 'DHI sıklaştırma ve ön hat için, FUE geniş alanlar için daha iyidir.',
          en: 'DHI is better for densification and hairline, FUE is better for large areas.',
          ar: 'DHI أفضل للتكثيف وخط الشعر، FUE أفضل للمناطق الكبيرة.',
          fr: 'La DHI est souvent préférable pour densifier et travailler la ligne frontale, la FUE est généralement plus adaptée aux zones étendues.',
          es: 'DHI suele ser mejor para densificar y la línea frontal; FUE suele ser mejor para áreas grandes.',
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
      fr: 'Rhinoplastie (chirurgie du nez) - Guide 2026',
      es: 'Rinoplastia (cirugía de nariz) - Guía 2026',
    },
    metaDescription: {
      tr: 'Burun estetiği ameliyatı, fiyatları, iyileşme süreci. Açık ve kapalı rinoplasti farkları.',
      en: 'Rhinoplasty surgery, prices, recovery process. Differences between open and closed rhinoplasty.',
      ar: 'جراحة تجميل الأنف، الأسعار، عملية الشفاء. الفروق بين تجميل الأنف المفتوح والمغلق.',
      fr: 'Chirurgie esthétique du nez : prix, récupération. Différences entre rhinoplastie ouverte et fermée.',
      es: 'Cirugía de rinoplastia: precios y recuperación. Diferencias entre rinoplastia abierta y cerrada.',
    },
    summary: {
      tr: 'Rinoplasti, burnun şeklini ve işlevini düzeltmek için yapılan cerrahi bir işlemdir. Estetik görünümün yanı sıra nefes alma problemlerini de çözer.',
      en: 'Rhinoplasty is a surgical procedure performed to correct the shape and function of the nose. It solves breathing problems as well as aesthetic appearance.',
      ar: 'تجميل الأنف هو إجراء جراحي يتم إجراؤه لتصحيح شكل ووظيفة الأنف. يحل مشاكل التنفس بالإضافة إلى المظهر الجمالي.',
      fr: 'La rhinoplastie est une intervention chirurgicale visant à corriger la forme et la fonction du nez. Elle améliore l’esthétique et peut aussi résoudre des problèmes respiratoires.',
      es: 'La rinoplastia es un procedimiento quirúrgico para corregir la forma y la función de la nariz. Mejora la estética y también puede resolver problemas de respiración.',
    },
    priceRange: {
      india: '2.000 - 4.000 USD',
      mexico: '3.500 - 6.000 USD',
      turkey: '2.500 - 4.500 USD',
      thailand: '3.000 - 5.500 USD',
      poland: '3.000 - 5.000 USD',
      uk: '6.000 - 10.000 USD',
      usa: '8.000 - 15.000 USD',
    },
    duration: { tr: '2 - 4 Saat', en: '2 - 4 Hours', ar: '2 - 4 ساعات' },
    recoveryTime: { tr: '1 - 2 Hafta', en: '1 - 2 Weeks', ar: '1 - 2 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '1 Gece', en: '1 Night', ar: 'ليلة واحدة' },
    results: { tr: '6-12 Ayda Tam Sonuç', en: 'Full Result in 6-12 Months', ar: 'نتيجة كاملة في 6-12 شهرًا' },
    suitableFor: [
      {
        tr: 'Burnundan memnun olmayanlar',
        en: 'Those unhappy with their nose',
        ar: 'أولئك غير الراضين عن أنفهم',
        fr: 'Personnes insatisfaites de l’apparence de leur nez',
        es: 'Personas no satisfechas con su nariz',
      },
      {
        tr: 'Nefes alma sorunu yaşayanlar',
        en: 'Those with breathing problems',
        ar: 'أولئك الذين يعانون من مشاكل في التنفس',
        fr: 'Personnes ayant des difficultés respiratoires',
        es: 'Personas con problemas para respirar',
      },
      {
        tr: 'Travma sonrası deformasyonu olanlar',
        en: 'Those with post-trauma deformity',
        ar: 'أولئك الذين يعانون من تشوه بعد الصدمة',
        fr: 'Personnes présentant une déformation après un traumatisme',
        es: 'Personas con deformidad tras un traumatismo',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Kemik gelişimi tamamlanmamış (18 yaş altı)',
        en: 'Bone development not completed (Under 18)',
        ar: 'لم يكتمل نمو العظام (تحت 18 عامًا)',
        fr: 'Croissance osseuse non terminée (moins de 18 ans)',
        es: 'Desarrollo óseo no completado (menores de 18)',
      },
      {
        tr: 'Gerçekçi olmayan beklentileri olanlar',
        en: 'Those with unrealistic expectations',
        ar: 'أولئك الذين لديهم توقعات غير واقعية',
        fr: 'Personnes ayant des attentes irréalistes',
        es: 'Personas con expectativas poco realistas',
      },
    ],
    risks: [
      {
        tr: 'Kanama ve enfeksiyon',
        en: 'Bleeding and infection',
        ar: 'نزيف وعدوى',
        fr: 'Saignement et infection',
        es: 'Sangrado e infección',
      },
      {
        tr: 'Nefes alma zorluğu (geçici)',
        en: 'Breathing difficulty (temporary)',
        ar: 'صعوبة في التنفس (مؤقت)',
        fr: 'Difficulté respiratoire (temporaire)',
        es: 'Dificultad para respirar (temporal)',
      },
      {
        tr: 'Revizyon gereksinimi (%5-10)',
        en: 'Need for revision (5-10%)',
        ar: 'الحاجة إلى مراجعة (5-10٪)',
        fr: 'Besoin d’une révision (5–10 %)',
        es: 'Necesidad de revisión (5–10 %)',
      },
    ],
    steps: [
      {
        title: { tr: 'Kesi', en: 'Incision', ar: 'شق', fr: 'Incision', es: 'Incisión' },
        desc: {
          tr: 'Burun içinden veya altından kesi yapılır (Açık/Kapalı yöntem).',
          en: 'Incision is made inside or under the nose (Open/Closed method).',
          ar: 'يتم إجراء شق داخل أو تحت الأنف (طريقة مفتوحة/مغلقة).',
          fr: 'Une incision est réalisée à l’intérieur du nez ou sous la columelle (méthode ouverte/fermée).',
          es: 'Se realiza una incisión dentro o debajo de la nariz (método abierto/cerrado).',
        },
      },
      {
        title: { tr: 'Şekillendirme', en: 'Reshaping', ar: 'إعادة تشكيل', fr: 'Remodelage', es: 'Remodelación' },
        desc: {
          tr: 'Kıkırdak ve kemik yapısı yeniden şekillendirilir.',
          en: 'Cartilage and bone structure are reshaped.',
          ar: 'يتم إعادة تشكيل الغضروف وبنية العظام.',
          fr: 'Le cartilage et l’os sont remodelés.',
          es: 'Se remodela la estructura de cartílago y hueso.',
        },
      },
      {
        title: { tr: 'Kapatma', en: 'Closing', ar: 'إغلاق', fr: 'Fermeture', es: 'Cierre' },
        desc: {
          tr: 'Kesiler kapatılır ve atel takılır.',
          en: 'Incisions are closed and a splint is applied.',
          ar: 'يتم إغلاق الشقوق ووضع جبيرة.',
          fr: 'Les incisions sont refermées et une attelle est mise en place.',
          es: 'Se cierran las incisiones y se coloca una férula.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Tamponlar ne zaman çıkar?',
          en: 'When are tampons removed?',
          ar: 'متى تتم إزالة السدادات القطنية؟',
          fr: 'Quand les tampons sont-ils retirés ?',
          es: '¿Cuándo se retiran los tapones?',
        },
        a: {
          tr: 'Genellikle 2-3 gün içinde silikon tamponlar çıkarılır.',
          en: 'Usually silicone tampons are removed within 2-3 days.',
          ar: 'عادة ما تتم إزالة السدادات القطنية السيليكونية في غضون 2-3 أيام.',
          fr: 'En général, les tampons en silicone sont retirés sous 2 à 3 jours.',
          es: 'Por lo general, los tapones de silicona se retiran en 2 a 3 días.',
        },
      },
    ],
    category: { tr: 'Estetik Cerrahi', en: 'Plastic Surgery', ar: 'جراحة التجميل' },
  },
  {
    slug: 'dis-implant',
    procedureKey: 'dis_implanti',
    title: {
      tr: 'Diş İmplantı Tedavisi - 2026 Fiyatları',
      en: 'Dental Implant Treatment - 2026 Prices',
      ar: 'علاج زراعة الأسنان - أسعار 2026',
      fr: 'Traitement par implant dentaire - Prix 2026',
      es: 'Tratamiento con implantes dentales - Precios 2026',
    },
    metaDescription: {
      tr: 'Eksik dişler için implant tedavisi, titanyum vida, All-on-4 tekniği ve maliyetleri.',
      en: 'Implant treatment for missing teeth, titanium screw, All-on-4 technique and costs.',
      ar: 'علاج الزرع للأسنان المفقودة، برغي التيتانيوم، تقنية All-on-4 والتكاليف.',
      fr: 'Traitement des dents manquantes par implant : vis en titane, technique All-on-4 et coûts.',
      es: 'Tratamiento con implantes para dientes ausentes: tornillo de titanio, técnica All-on-4 y costes.',
    },
    summary: {
      tr: 'Diş implantı, eksik dişlerin yerine çene kemiğine yerleştirilen yapay diş kökleridir. Doğal dişe en yakın alternatiftir.',
      en: 'Dental implants are artificial tooth roots placed in the jawbone to replace missing teeth. It is the closest alternative to natural teeth.',
      ar: 'زراعة الأسنان هي جذور أسنان اصطناعية توضع في عظم الفك لتحل محل الأسنان المفقودة. إنه البديل الأقرب للأسنان الطبيعية.',
      fr: 'Les implants dentaires sont des racines artificielles posées dans l’os de la mâchoire pour remplacer des dents manquantes. C’est l’alternative la plus proche d’une dent naturelle.',
      es: 'Los implantes dentales son raíces artificiales colocadas en el hueso maxilar para sustituir dientes ausentes. Es la alternativa más cercana a un diente natural.',
    },
    priceRange: {
      india: '400 - 800 USD',
      mexico: '700 - 1.200 USD',
      turkey: '350 - 700 USD',
      thailand: '800 - 1.500 USD',
      poland: '600 - 1.000 USD',
      uk: '1.500 - 2.500 USD',
      usa: '2.000 - 4.000 USD',
    },
    duration: { tr: '30 Dk - 2 Saat', en: '30 Min - 2 Hours', ar: '30 دقيقة - 2 ساعة' },
    recoveryTime: { tr: '3 - 6 Ay (Kaynama)', en: '3 - 6 Months (Osseointegration)', ar: '3 - 6 أشهر (الاندماج العظمي)' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: 'Ömür Boyu', en: 'Lifetime', ar: 'مدى الحياة' },
    suitableFor: [
      {
        tr: 'Bir veya daha fazla diş eksiği olanlar',
        en: 'Those with one or more missing teeth',
        ar: 'أولئك الذين لديهم سن مفقود أو أكثر',
        fr: 'Personnes ayant une ou plusieurs dents manquantes',
        es: 'Personas con uno o más dientes ausentes',
      },
      {
        tr: 'Kemik yapısı uygun olanlar',
        en: 'Those with suitable bone structure',
        ar: 'أولئك الذين لديهم بنية عظام مناسبة',
        fr: 'Personnes avec une structure osseuse adaptée',
        es: 'Personas con estructura ósea adecuada',
      },
    ],
    notSuitableFor: [
      {
        tr: 'İleri derecede kemik erimesi olanlar (Greft gerekebilir)',
        en: 'Those with advanced osteoporosis (Graft may be needed)',
        ar: 'أولئك الذين يعانون من هشاشة العظام المتقدمة (قد تكون هناك حاجة للتطعيم)',
        fr: 'Personnes avec une résorption osseuse avancée (une greffe peut être nécessaire)',
        es: 'Personas con pérdida ósea avanzada (puede requerirse injerto)',
      },
      {
        tr: 'Kontrolsüz diyabet hastaları',
        en: 'Uncontrolled diabetes patients',
        ar: 'مرضى السكري غير المنضبط',
        fr: 'Personnes atteintes de diabète non contrôlé',
        es: 'Pacientes con diabetes no controlada',
      },
    ],
    risks: [
      { tr: 'Enfeksiyon', en: 'Infection', ar: 'عدوى', fr: 'Infection', es: 'Infección' },
      {
        tr: 'İmplantın kemikle kaynaşmaması (Nadir)',
        en: 'Implant not fusing with bone (Rare)',
        ar: 'عدم التحام الزرعة بالعظم (نادر)',
        fr: 'Non-intégration de l’implant à l’os (rare)',
        es: 'Que el implante no se integre con el hueso (raro)',
      },
    ],
    steps: [
      {
        title: { tr: 'İmplant Yerleştirme', en: 'Implant Placement', ar: 'وضع الزرعة', fr: 'Pose de l’implant', es: 'Colocación del implante' },
        desc: {
          tr: 'Çene kemiğine yuva açılır ve vida yerleştirilir.',
          en: 'A socket is opened in the jawbone and the screw is placed.',
          ar: 'يتم فتح تجويف في عظم الفك ووضع المسمار.',
          fr: 'Un logement est préparé dans l’os de la mâchoire puis la vis est posée.',
          es: 'Se prepara un lecho en el hueso maxilar y se coloca el tornillo.',
        },
      },
      {
        title: { tr: 'İyileşme Süreci', en: 'Healing Process', ar: 'عملية الشفاء', fr: 'Période de cicatrisation', es: 'Proceso de cicatrización' },
        desc: {
          tr: '3-6 ay implantın kemikle kaynaşması beklenir.',
          en: '3-6 months is expected for the implant to fuse with the bone.',
          ar: 'يتوقع 3-6 أشهر لاندماج الزرعة مع العظم.',
          fr: 'On attend 3 à 6 mois pour l’ostéo-intégration de l’implant.',
          es: 'Se esperan 3 a 6 meses para que el implante se integre con el hueso.',
        },
      },
      {
        title: { tr: 'Protez Takılması', en: 'Prosthesis Attachment', ar: 'تثبيت الطرف الاصطناعي', fr: 'Pose de la prothèse', es: 'Colocación de la prótesis' },
        desc: {
          tr: 'Üst yapı (kron) takılarak işlem tamamlanır.',
          en: 'The procedure is completed by attaching the superstructure (crown).',
          ar: 'تكتمل العملية بتركيب البنية الفوقية (التاج).',
          fr: 'L’intervention se termine par la pose de la suprastructure (couronne).',
          es: 'El procedimiento se completa colocando la suprastructura (corona).',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'İmplant işlemi acıtır mı?',
          en: 'Does implant procedure hurt?',
          ar: 'هل إجراء الزرع مؤلم؟',
          fr: 'La pose d’un implant est-elle douloureuse ?',
          es: '¿Duele el procedimiento de implante?',
        },
        a: {
          tr: 'İşlem sırasında hissetmezsiniz, sonrasında ağrı kesicilerle kontrol edilebilir.',
          en: 'You do not feel it during the procedure, afterwards it can be controlled with painkillers.',
          ar: 'لا تشعر به أثناء الإجراء، بعد ذلك يمكن السيطرة عليه بمسكنات الألم.',
          fr: 'Vous ne le sentez pas pendant l’intervention. Ensuite, la douleur se contrôle généralement avec des antalgiques.',
          es: 'No se siente durante el procedimiento; después suele controlarse con analgésicos.',
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
      fr: 'Sourire Hollywood (design du sourire) - 2026',
      es: 'Sonrisa de Hollywood (diseño de sonrisa) - 2026',
    },
    metaDescription: {
      tr: 'Mükemmel gülüş tasarımı, zirkonyum ve lamina kaplamalarla Hollywood Smile estetiği.',
      en: 'Perfect smile design, Hollywood Smile aesthetics with zirconium and laminate veneers.',
      ar: 'تصميم ابتسامة مثالية، جماليات ابتسامة هوليوود مع قشور الزركونيوم والرقائق.',
      fr: 'Design du sourire parfait : esthétique « Hollywood Smile » avec facettes en zircone et facettes laminées.',
      es: 'Diseño de sonrisa perfecto: estética de la Sonrisa de Hollywood con carillas de zirconio y carillas laminadas.',
    },
    summary: {
      tr: 'Hollywood Smile, dişlerin şekil, renk ve boyutunun yüz estetiğine uygun olarak yeniden tasarlandığı kapsamlı bir estetik diş hekimliği işlemidir.',
      en: 'Hollywood Smile is a comprehensive cosmetic dentistry procedure where the shape, color and size of teeth are redesigned in accordance with facial aesthetics.',
      ar: 'ابتسامة هوليوود هي إجراء شامل لطب الأسنان التجميلي حيث يتم إعادة تصميم شكل ولون وحجم الأسنان وفقًا لجماليات الوجه.',
      fr: 'Le sourire Hollywood est une procédure esthétique complète où la forme, la couleur et la taille des dents sont redessinées selon l’esthétique du visage.',
      es: 'La Sonrisa de Hollywood es un procedimiento de estética dental integral donde se rediseñan la forma, el color y el tamaño de los dientes según la estética facial.',
    },
    priceRange: {
      india: '2.500 - 4.500 USD',
      mexico: '4.000 - 7.000 USD',
      turkey: '3.000 - 6.000 USD',
      thailand: '4.000 - 7.000 USD',
      poland: '4.000 - 7.000 USD',
      uk: '10.000 - 20.000 USD',
      usa: '15.000 - 30.000 USD',
    },
    duration: { tr: '5 - 7 Gün', en: '5 - 7 Days', ar: '5 - 7 أيام' },
    recoveryTime: { tr: 'Hemen', en: 'Immediate', ar: 'فوري' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '10-15 Yıl', en: '10-15 Years', ar: '10-15 سنة' },
    suitableFor: [
      {
        tr: 'Diş renginden ve şeklinden memnun olmayanlar',
        en: 'Those unhappy with tooth color and shape',
        ar: 'أولئك غير الراضين عن لون وشكل الأسنان',
        fr: 'Personnes insatisfaites de la couleur ou de la forme de leurs dents',
        es: 'Personas no satisfechas con el color o la forma de sus dientes',
      },
      {
        tr: 'Kırık, çapraşık veya aralıklı dişleri olanlar',
        en: 'Those with broken, crooked or gapped teeth',
        ar: 'أولئك الذين لديهم أسنان مكسورة أو ملتوية أو متباعدة',
        fr: 'Personnes ayant des dents cassées, de travers ou espacées',
        es: 'Personas con dientes rotos, torcidos o separados',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Ciddi diş eti hastalığı olanlar (Önce tedavi gerekir)',
        en: 'Those with severe gum disease (Treatment needed first)',
        ar: 'أولئك الذين يعانون من أمراض اللثة الشديدة (العلاج مطلوب أولاً)',
        fr: 'Personnes avec une maladie gingivale sévère (traitement préalable nécessaire)',
        es: 'Personas con enfermedad periodontal severa (primero se necesita tratamiento)',
      },
    ],
    risks: [
      { tr: 'Diş hassasiyeti', en: 'Tooth sensitivity', ar: 'حساسية الأسنان', fr: 'Sensibilité dentaire', es: 'Sensibilidad dental' },
      {
        tr: 'Kaplamanın kırılması (Sert cisimlerde)',
        en: 'Veneer breaking (On hard objects)',
        ar: 'كسر القشرة (على الأجسام الصلبة)',
        fr: 'Fracture de la facette (sur des objets durs)',
        es: 'Rotura de la carilla (con objetos duros)',
      },
    ],
    steps: [
      {
        title: { tr: 'Tasarım ve Hazırlık', en: 'Design and Preparation', ar: 'التصميم والتحضير', fr: 'Conception et préparation', es: 'Diseño y preparación' },
        desc: {
          tr: 'Dijital gülüş tasarımı yapılır, dişler tıraşlanır ve ölçü alınır.',
          en: 'Digital smile design is done, teeth are shaved and measurements are taken.',
          ar: 'يتم تصميم الابتسامة الرقمية، ويتم حلاقة الأسنان وأخذ القياسات.',
          fr: 'Un design numérique du sourire est réalisé, les dents sont préparées et des mesures sont prises.',
          es: 'Se realiza un diseño digital de sonrisa, se preparan los dientes y se toman medidas.',
        },
      },
      {
        title: { tr: 'Geçici Dişler', en: 'Temporary Teeth', ar: 'أسنان مؤقتة', fr: 'Dents temporaires', es: 'Dientes temporales' },
        desc: {
          tr: 'Kalıcılar gelene kadar geçici kaplamalar takılır.',
          en: 'Temporary veneers are worn until permanent ones arrive.',
          ar: 'يتم ارتداء القشور المؤقتة حتى وصول القشور الدائمة.',
          fr: 'Des facettes temporaires sont posées en attendant les définitives.',
          es: 'Se colocan carillas temporales hasta que lleguen las definitivas.',
        },
      },
      {
        title: { tr: 'Final Uygulama', en: 'Final Application', ar: 'التطبيق النهائي', fr: 'Pose finale', es: 'Aplicación final' },
        desc: {
          tr: 'Özel üretilen kaplamalar yapıştırılır.',
          en: 'Custom-made veneers are bonded.',
          ar: 'يتم لصق القشور المصنوعة خصيصًا.',
          fr: 'Les facettes sur mesure sont collées.',
          es: 'Se cementan las carillas fabricadas a medida.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Doğal görünür mü?',
          en: 'Does it look natural?',
          ar: 'هل يبدو طبيعيا؟',
          fr: 'Est-ce que cela paraît naturel ?',
          es: '¿Se ve natural?',
        },
        a: {
          tr: 'Evet, yüz hatlarınıza ve ten renginize uygun renk ve form seçilir.',
          en: 'Yes, color and form suitable for your facial features and skin tone are selected.',
          ar: 'نعم، يتم اختيار اللون والشكل المناسبين لملامح وجهك ولون بشرتك.',
          fr: 'Oui, la couleur et la forme sont choisies en fonction de vos traits et de votre teint.',
          es: 'Sí, se eligen el color y la forma adecuados a tus rasgos faciales y tono de piel.',
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
      fr: 'Couronnes en zircone - Durables et esthétiques',
      es: 'Coronas de zirconio - Duraderas y estéticas',
    },
    metaDescription: {
      tr: 'Metal desteksiz porselen kaplama olan zirkonyum dişlerin avantajları ve fiyatları.',
      en: 'Advantages and prices of zirconium teeth, which are metal-free porcelain veneers.',
      ar: 'مزايا وأسعار أسنان الزركونيوم، وهي قشور خزفية خالية من المعادن.',
      fr: 'Avantages et prix des couronnes en zircone, des restaurations tout-céramique sans métal.',
      es: 'Ventajas y precios de las coronas de zirconio, restauraciones de porcelana sin metal.',
    },
    summary: {
      tr: 'Zirkonyum, ışık geçirgenliği yüksek, metal içermeyen ve diş etine uyumlu, son derece dayanıklı bir kaplama türüdür.',
      en: 'Zirconium is a highly durable type of crown that has high light transmittance, does not contain metal and is compatible with gums.',
      ar: 'الزركونيوم هو نوع متين للغاية من التيجان يتمتع بنفاذية عالية للضوء، ولا يحتوي على معدن ومتوافق مع اللثة.',
      fr: 'La zircone est une couronne très résistante, sans métal, à haute translucidité et compatible avec les gencives.',
      es: 'El zirconio es una corona muy resistente, sin metal, con alta translucidez y compatible con las encías.',
    },
    priceRange: {
      india: '150 - 300 USD',
      mexico: '300 - 500 USD',
      turkey: '150 - 300 USD',
      thailand: '300 - 600 USD',
      poland: '250 - 450 USD',
      uk: '600 - 1.000 USD',
      usa: '1.000 - 2.000 USD',
    },
    duration: { tr: '3 - 5 Gün', en: '3 - 5 Days', ar: '3 - 5 أيام' },
    recoveryTime: { tr: 'Hemen', en: 'Immediate', ar: 'فوري' },
    anesthesia: { tr: 'Lokal Anestezi', en: 'Local Anesthesia', ar: 'تخدير موضعي' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: '10-15 Yıl', en: '10-15 Years', ar: '10-15 سنة' },
    suitableFor: [
      {
        tr: 'Estetik kaygısı olanlar',
        en: 'Those with aesthetic concerns',
        ar: 'أولئك الذين لديهم مخاوف جمالية',
        fr: 'Personnes ayant des exigences esthétiques',
        es: 'Personas con preocupaciones estéticas',
      },
      {
        tr: 'Metal alerjisi olanlar',
        en: 'Those with metal allergies',
        ar: 'أولئك الذين يعانون من حساسية المعادن',
        fr: 'Personnes allergiques aux métaux',
        es: 'Personas con alergia a metales',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Diş gıcırdatma sorunu olanlar (Gece plağı gerekir)',
        en: 'Those with teeth grinding problems (Night guard needed)',
        ar: 'أولئك الذين يعانون من مشاكل صرير الأسنان (مطلوب واقي ليلي)',
        fr: 'Personnes souffrant de bruxisme (gouttière nocturne nécessaire)',
        es: 'Personas con bruxismo (se necesita férula nocturna)',
      },
    ],
    risks: [
      {
        tr: 'Sıcak-soğuk hassasiyeti (geçici)',
        en: 'Hot-cold sensitivity (temporary)',
        ar: 'حساسية الساخن والبارد (مؤقت)',
        fr: 'Sensibilité au chaud/froid (temporaire)',
        es: 'Sensibilidad al frío/calor (temporal)',
      },
    ],
    steps: [
      {
        title: { tr: 'Hazırlık', en: 'Preparation', ar: 'تحضير', fr: 'Préparation', es: 'Preparación' },
        desc: {
          tr: 'Diş küçültülür ve ölçü alınır.',
          en: 'Tooth is reduced and measurement is taken.',
          ar: 'يتم تصغير السن وأخذ القياس.',
          fr: 'La dent est préparée et une empreinte est prise.',
          es: 'Se prepara el diente y se toma una impresión/medición.',
        },
      },
      {
        title: { tr: 'Prova', en: 'Rehearsal', ar: 'بروفة', fr: 'Essayage', es: 'Prueba' },
        desc: {
          tr: 'Zirkonyum altyapı ve porselen provaları yapılır.',
          en: 'Zirconium infrastructure and porcelain rehearsals are done.',
          ar: 'يتم إجراء بروفات البنية التحتية للزركونيوم والخزف.',
          fr: 'Des essais de l’armature en zircone et de la céramique sont réalisés.',
          es: 'Se realizan pruebas de la estructura de zirconio y de la cerámica.',
        },
      },
      {
        title: { tr: 'Yapıştırma', en: 'Cementation', ar: 'تدعيم', fr: 'Cimentation', es: 'Cementación' },
        desc: {
          tr: 'Kalıcı yapıştırma işlemi yapılır.',
          en: 'Permanent bonding process is done.',
          ar: 'يتم إجراء عملية الترابط الدائم.',
          fr: 'La couronne est fixée de manière permanente.',
          es: 'Se realiza la cementación definitiva.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Zirkonyum renk değiştirir mi?',
          en: 'Does zirconium change color?',
          ar: 'هل يتغير لون الزركونيوم؟',
          fr: 'La zircone change-t-elle de couleur ?',
          es: '¿El zirconio cambia de color?',
        },
        a: {
          tr: 'Hayır, yüzeyi pürüzsüz olduğu için leke tutmaz ve renk değiştirmez.',
          en: 'No, since its surface is smooth, it does not stain or change color.',
          ar: 'لا، نظرًا لأن سطحه أملس، فإنه لا يتلطخ أو يتغير لونه.',
          fr: 'Non, sa surface lisse résiste aux taches et ne change pas de couleur.',
          es: 'No, su superficie lisa resiste las manchas y no cambia de color.',
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
      fr: 'Augmentation mammaire (chirurgie des seins) - 2026',
      es: 'Aumento de pecho (cirugía estética) - 2026',
    },
    metaDescription: {
      tr: 'Silikon implant ile meme büyütme ameliyatı, çeşitleri ve fiyatları.',
      en: 'Breast augmentation surgery with silicone implants, types and prices.',
      ar: 'جراحة تكبير الثدي بزراعة السيليكون، الأنواع والأسعار.',
      fr: 'Augmentation mammaire par implants en silicone : types et prix.',
      es: 'Cirugía de aumento de pecho con implantes de silicona: tipos y precios.',
    },
    summary: {
      tr: 'Meme büyütme, göğüs hacmini artırmak ve şeklini düzeltmek için silikon implantlar veya yağ transferi kullanılarak yapılan cerrahi işlemdir.',
      en: 'Breast augmentation is a surgical procedure performed using silicone implants or fat transfer to increase breast volume and correct its shape.',
      ar: 'تكبير الثدي هو إجراء جراحي يتم إجراؤه باستخدام زراعة السيليكون أو نقل الدهون لزيادة حجم الثدي وتصحيح شكله.',
      fr: 'L’augmentation mammaire est une intervention chirurgicale utilisant des implants en silicone ou un lipofilling pour augmenter le volume et améliorer la forme des seins.',
      es: 'El aumento de pecho es una cirugía que utiliza implantes de silicona o transferencia de grasa para aumentar el volumen y mejorar la forma del pecho.',
    },
    priceRange: {
      india: '2.500 - 4.000 USD',
      mexico: '3.500 - 6.000 USD',
      turkey: '3.000 - 5.000 USD',
      thailand: '3.500 - 6.000 USD',
      poland: '3.500 - 5.500 USD',
      uk: '5.000 - 9.000 USD',
      usa: '6.000 - 12.000 USD',
    },
    duration: { tr: '1 - 2 Saat', en: '1 - 2 Hours', ar: '1 - 2 ساعات' },
    recoveryTime: { tr: '1 - 2 Hafta', en: '1 - 2 Weeks', ar: '1 - 2 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '1 Gece', en: '1 Night', ar: 'ليلة واحدة' },
    results: { tr: '10-15 Yıl (İmplant ömrü)', en: '10-15 Years (Implant life)', ar: '10-15 سنة (عمر الزرعة)' },
    suitableFor: [
      {
        tr: 'Küçük göğüslü kadınlar',
        en: 'Women with small breasts',
        ar: 'النساء ذوات الثدي الصغير',
        fr: 'Femmes ayant une petite poitrine',
        es: 'Mujeres con pecho pequeño',
      },
      {
        tr: 'Emzirme sonrası hacim kaybı yaşayanlar',
        en: 'Those with volume loss after breastfeeding',
        ar: 'أولئك الذين يعانون من فقدان الحجم بعد الرضاعة الطبيعية',
        fr: 'Personnes ayant une perte de volume après l’allaitement',
        es: 'Quienes han perdido volumen tras la lactancia',
      },
      {
        tr: 'Meme asimetrisi olanlar',
        en: 'Those with breast asymmetry',
        ar: 'أولئك الذين يعانون من عدم تناسق الثدي',
        fr: 'Personnes avec asymétrie mammaire',
        es: 'Personas con asimetría mamaria',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Hamile veya emzirenler',
        en: 'Pregnant or breastfeeding women',
        ar: 'النساء الحوامل أو المرضعات',
        fr: 'Femmes enceintes ou allaitantes',
        es: 'Embarazadas o en lactancia',
      },
    ],
    risks: [
      { tr: 'Kapsül kontraktürü', en: 'Capsular contracture', ar: 'تقلص المحفظة', fr: 'Contracture capsulaire', es: 'Contractura capsular' },
      {
        tr: 'İmplant sızıntısı veya yırtılması (nadir)',
        en: 'Implant leakage or rupture (rare)',
        ar: 'تسرب الزرعة أو تمزقها (نادر)',
        fr: 'Fuite ou rupture de l’implant (rare)',
        es: 'Fuga o rotura del implante (raro)',
      },
    ],
    steps: [
      {
        title: { tr: 'Kesi', en: 'Incision', ar: 'شق', fr: 'Incision', es: 'Incisión' },
        desc: {
          tr: 'Meme altı, koltuk altı veya meme başından kesi yapılır.',
          en: 'Incision is made under the breast, armpit or nipple.',
          ar: 'يتم عمل شق تحت الثدي أو الإبط أو الحلمة.',
          fr: 'L’incision se fait sous le sein, à l’aisselle ou autour du mamelon.',
          es: 'La incisión se realiza bajo el pecho, en la axila o alrededor del pezón.',
        },
      },
      {
        title: { tr: 'İmplant Yerleştirme', en: 'Implant Placement', ar: 'وضع الزرعة', fr: 'Mise en place de l’implant', es: 'Colocación del implante' },
        desc: {
          tr: 'Kas altı veya kas üstü plana implant yerleştirilir.',
          en: 'Implant is placed in the submuscular or subglandular plane.',
          ar: 'يتم وضع الزرعة في المستوى تحت العضلي أو تحت الغدي.',
          fr: 'L’implant est placé sous le muscle ou sous la glande mammaire.',
          es: 'El implante se coloca en el plano submuscular o subglandular.',
        },
      },
      {
        title: { tr: 'Kapatma', en: 'Closing', ar: 'إغلاق', fr: 'Fermeture', es: 'Cierre' },
        desc: {
          tr: 'Estetik dikişlerle kapatılır.',
          en: 'Closed with aesthetic sutures.',
          ar: 'مغلق بخيوط تجميلية.',
          fr: 'La fermeture se fait avec des sutures esthétiques.',
          es: 'Se cierra con suturas estéticas.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Emzirmeye engel mi?',
          en: 'Does it prevent breastfeeding?',
          ar: 'هل يمنع الرضاعة الطبيعية؟',
          fr: 'Empêche-t-il l’allaitement ?',
          es: '¿Impide la lactancia?',
        },
        a: {
          tr: 'Genellikle engel değildir, ancak kesi yerine göre değişebilir.',
          en: 'It usually does not prevent it, but it may vary depending on the incision site.',
          ar: 'عاده لا يمنع ذلك، ولكن قد يختلف حسب موقع الشق.',
          fr: 'Généralement non, mais cela peut varier selon le type d’incision.',
          es: 'Por lo general no, pero puede variar según el tipo de incisión.',
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
      fr: 'Liposuccion (lipoaspiration) - 2026',
      es: 'Liposucción - 2026',
    },
    metaDescription: {
      tr: 'Vaser, Lazer ve geleneksel liposuction yöntemleri, fiyatları ve iyileşme süreci.',
      en: 'Vaser, Laser and traditional liposuction methods, prices and recovery process.',
      ar: 'طرق شفط الدهون بالفيزر والليزر والتقليدية، الأسعار وعملية الشفاء.',
      fr: 'Méthodes de liposuccion Vaser, laser et traditionnelles : prix et récupération.',
      es: 'Métodos de liposucción Vaser, láser y tradicional: precios y recuperación.',
    },
    summary: {
      tr: 'Liposuction, vücudun belirli bölgelerinde biriken inatçı yağların vakumla çekilerek vücudun şekillendirilmesi işlemidir.',
      en: 'Liposuction is the process of shaping the body by vacuuming stubborn fats accumulated in certain parts of the body.',
      ar: 'شفط الدهون هو عملية تشكيل الجسم عن طريق شفط الدهون العنيدة المتراكمة في أجزاء معينة من الجسم.',
      fr: 'La liposuccion consiste à aspirer par вакуум les graisses tenaces accumulées dans certaines zones pour remodeler la silhouette.',
      es: 'La liposucción consiste en aspirar con vacío la grasa resistente acumulada en zonas específicas para moldear el cuerpo.',
    },
    priceRange: {
      india: '1.500 - 3.000 USD',
      mexico: '2.500 - 4.500 USD',
      turkey: '2.000 - 4.000 USD',
      thailand: '2.500 - 4.500 USD',
      poland: '2.000 - 3.500 USD',
      uk: '4.000 - 8.000 USD',
      usa: '5.000 - 10.000 USD',
    },
    duration: { tr: '1 - 4 Saat', en: '1 - 4 Hours', ar: '1 - 4 ساعات' },
    recoveryTime: { tr: '1 - 3 Hafta', en: '1 - 3 Weeks', ar: '1 - 3 أسابيع' },
    anesthesia: { tr: 'Genel veya Lokal', en: 'General or Local', ar: 'عام أو موضعي' },
    hospitalStay: { tr: '0 - 1 Gece', en: '0 - 1 Night', ar: '0 - 1 ليلة' },
    results: { tr: 'Kalıcı (Kilo korunursa)', en: 'Permanent (If weight is maintained)', ar: 'دائم (إذا تم الحفاظ على الوزن)' },
    suitableFor: [
      {
        tr: 'Bölgesel yağlanması olanlar',
        en: 'Those with regional fat',
        ar: 'أولئك الذين يعانون من الدهون الموضعية',
        fr: 'Personnes ayant des amas graisseux localisés',
        es: 'Personas con grasa localizada',
      },
      {
        tr: 'İdeal kilosuna yakın olanlar',
        en: 'Those close to their ideal weight',
        ar: 'أولئك القريبون من وزنهم المثالي',
        fr: 'Personnes proches de leur poids idéal',
        es: 'Personas cercanas a su peso ideal',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Obezite hastaları (Zayıflama yöntemi değildir)',
        en: 'Obesity patients (Not a weight loss method)',
        ar: 'مرضى السمنة (ليست طريقة لفقدان الوزن)',
        fr: 'Personnes souffrant d’obésité (ce n’est pas une méthode d’amaigrissement)',
        es: 'Personas con obesidad (no es un método para adelgazar)',
      },
    ],
    risks: [
      { tr: 'Düzensiz cilt yüzeyi', en: 'Irregular skin surface', ar: 'سطح جلد غير منتظم', fr: 'Irrégularités de la peau', es: 'Irregularidades en la piel' },
      { tr: 'Ödem ve morluk', en: 'Edema and bruising', ar: 'وذمة وكدمات', fr: 'Œdème et ecchymoses', es: 'Edema y hematomas' },
    ],
    steps: [
      {
        title: { tr: 'İnfiltrasyon', en: 'Infiltration', ar: 'تسلل', fr: 'Infiltration', es: 'Infiltración' },
        desc: {
          tr: 'Yağları çözmek için özel sıvı enjekte edilir.',
          en: 'Special fluid is injected to dissolve fats.',
          ar: 'يتم حقن سائل خاص لإذابة الدهون.',
          fr: 'Un liquide spécial est injecté pour faciliter la dissolution et l’aspiration des graisses.',
          es: 'Se inyecta un líquido especial para facilitar la disolución y aspiración de la grasa.',
        },
      },
      {
        title: { tr: 'Yağ Parçalama', en: 'Fat Breaking', ar: 'تكسير الدهون', fr: 'Fragmentation des graisses', es: 'Fragmentación de grasa' },
        desc: {
          tr: 'Lazer veya ultrason ile yağlar parçalanır (Vaser/Lazer Lipo).',
          en: 'Fats are broken down with laser or ultrasound (Vaser/Laser Lipo).',
          ar: 'يتم تكسير الدهون بالليزر أو الموجات فوق الصوتية (فيزر/ليزر ليبو).',
          fr: 'Les graisses sont fragmentées par laser ou ultrasons (Vaser/Laser Lipo).',
          es: 'La grasa se fragmenta con láser o ultrasonido (Vaser/Láser Lipo).',
        },
      },
      {
        title: { tr: 'Aspirasyon', en: 'Aspiration', ar: 'شفط', fr: 'Aspiration', es: 'Aspiración' },
        desc: {
          tr: 'Kanüllerle yağlar çekilir.',
          en: 'Fats are sucked out with cannulas.',
          ar: 'يتم شفط الدهون بالقنيات.',
          fr: 'Les graisses sont aspirées à l’aide de canules.',
          es: 'La grasa se aspira mediante cánulas.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Tekrar yağ oluşur mu?',
          en: 'Does fat form again?',
          ar: 'هل تتشكل الدهون مرة أخرى؟',
          fr: 'La graisse revient-elle ?',
          es: '¿Vuelve a formarse grasa?',
        },
        a: {
          tr: 'Alınan yağ hücreleri geri gelmez, ancak kalan hücreler şişebilir.',
          en: 'Removed fat cells do not return, but remaining cells can swell.',
          ar: 'لا تعود الخلايا الدهنية التي تمت إزالتها، ولكن الخلايا المتبقية يمكن أن تنتفخ.',
          fr: 'Les cellules graisseuses retirées ne reviennent pas, mais celles qui restent peuvent augmenter de volume.',
          es: 'Las células grasas extraídas no vuelven, pero las que quedan pueden aumentar de tamaño.',
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
      fr: 'Sleeve gastrectomie (réduction de l’estomac) - 2026',
      es: 'Cirugía de manga gástrica (reducción de estómago) - 2026',
    },
    metaDescription: {
      tr: 'Obezite tedavisinde tüp mide ameliyatı, riskleri, fiyatları ve kilo verme süreci.',
      en: 'Gastric sleeve surgery in obesity treatment, risks, prices and weight loss process.',
      ar: 'جراحة تكميم المعدة في علاج السمنة، المخاطر، الأسعار وعملية إنقاص الوزن.',
      fr: 'Sleeve gastrectomie dans le traitement de l’obésité : risques, prix et perte de poids.',
      es: 'Cirugía de manga gástrica en el tratamiento de la obesidad: riesgos, precios y pérdida de peso.',
    },
    summary: {
      tr: 'Tüp mide (Sleeve Gastrektomi), midenin yaklaşık %80’inin çıkarılarak hacminin küçültüldüğü bir obezite cerrahisidir. İştah hormonu da azaltılır.',
      en: 'Gastric sleeve (Sleeve Gastrectomy) is an obesity surgery where about 80% of the stomach is removed to reduce its volume. Appetite hormone is also reduced.',
      ar: 'تكميم المعدة (استئصال المعدة الكمي) هو جراحة السمنة حيث يتم إزالة حوالي 80٪ من المعدة لتقليل حجمها. يتم تقليل هرمون الشهية أيضًا.',
      fr: 'La sleeve gastrectomie est une chirurgie de l’obésité où environ 80 % de l’estomac est retiré pour réduire son volume. Les hormones de l’appétit diminuent également.',
      es: 'La manga gástrica es una cirugía de obesidad en la que se extrae aproximadamente el 80 % del estómago para reducir su volumen. También disminuyen las hormonas del apetito.',
    },
    priceRange: {
      india: '3.000 - 5.000 USD',
      mexico: '4.000 - 6.500 USD',
      turkey: '2.500 - 4.500 USD',
      thailand: '5.000 - 8.000 USD',
      poland: '4.500 - 6.500 USD',
      uk: '10.000 - 15.000 USD',
      usa: '15.000 - 25.000 USD',
    },
    duration: { tr: '1 - 2 Saat', en: '1 - 2 Hours', ar: '1 - 2 ساعات' },
    recoveryTime: { tr: '2 - 4 Hafta', en: '2 - 4 Weeks', ar: '2 - 4 أسابيع' },
    anesthesia: { tr: 'Genel Anestezi', en: 'General Anesthesia', ar: 'تخدير عام' },
    hospitalStay: { tr: '2 - 3 Gece', en: '2 - 3 Nights', ar: '2 - 3 ليال' },
    results: { tr: 'Kalıcı (Yaşam tarzı değişikliği ile)', en: 'Permanent (With lifestyle change)', ar: 'دائم (مع تغيير نمط الحياة)' },
    suitableFor: [
      {
        tr: 'VKİ 35 üzeri olanlar',
        en: 'Those with BMI over 35',
        ar: 'أولئك الذين لديهم مؤشر كتلة الجسم أكثر من 35',
        fr: 'Personnes avec un IMC supérieur à 35',
        es: 'Personas con IMC superior a 35',
      },
      {
        tr: 'Diyetle kilo veremeyenler',
        en: 'Those who cannot lose weight with diet',
        ar: 'أولئك الذين لا يستطيعون إنقاص الوزن مع النظام الغذائي',
        fr: 'Personnes n’arrivant pas à perdre du poids malgré le régime',
        es: 'Quienes no logran perder peso con dieta',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Ciddi reflüsü olanlar (Gastrik bypass önerilebilir)',
        en: 'Those with severe reflux (Gastric bypass may be suggested)',
        ar: 'أولئك الذين يعانون من ارتجاع شديد (قد يُقترح تحويل مسار المعدة)',
        fr: 'Personnes avec un reflux sévère (un bypass gastrique peut être recommandé)',
        es: 'Personas con reflujo severo (puede recomendarse bypass gástrico)',
      },
    ],
    risks: [
      { tr: 'Kaçak riski', en: 'Leakage risk', ar: 'خطر التسرب', fr: 'Risque de fuite', es: 'Riesgo de fuga' },
      { tr: 'Vitamin eksikliği', en: 'Vitamin deficiency', ar: 'نقص الفيتامينات', fr: 'Carence en vitamines', es: 'Deficiencia de vitaminas' },
    ],
    steps: [
      {
        title: { tr: 'Giriş', en: 'Entry', ar: 'دخول', fr: 'Accès', es: 'Acceso' },
        desc: {
          tr: 'Laparoskopik (kapalı) yöntemle karına girilir.',
          en: 'Abdomen is entered with laparoscopic (closed) method.',
          ar: 'يتم إدخال البطن بطريقة التنظير البطني (المغلقة).',
          fr: 'L’abdomen est abordé par laparoscopie (technique fermée).',
          es: 'Se accede al abdomen mediante laparoscopia (técnica cerrada).',
        },
      },
      {
        title: { tr: 'Kesme', en: 'Cutting', ar: 'قطع', fr: 'Résection', es: 'Resección' },
        desc: {
          tr: 'Midenin büyük kısmı zımbalanarak kesilir ve çıkarılır.',
          en: 'A large part of the stomach is stapled, cut and removed.',
          ar: 'يتم تدبيس جزء كبير من المعدة وقطعه وإزالته.',
          fr: 'Une grande partie de l’estomac est agrafée, sectionnée puis retirée.',
          es: 'Se engrapa, corta y retira una gran parte del estómago.',
        },
      },
    ],
    faq: [
      {
        q: {
          tr: 'Ne kadar kilo veririm?',
          en: 'How much weight will I lose?',
          ar: 'كم سأفقد من الوزن؟',
          fr: 'Combien de poids vais-je perdre ?',
          es: '¿Cuánto peso perderé?',
        },
        a: {
          tr: 'İlk yıl fazla kilonuzun %60-70’ini verebilirsiniz.',
          en: 'You can lose 60-70% of your excess weight in the first year.',
          ar: 'يمكنك أن تفقد 60-70٪ من وزنك الزائد في السنة الأولى.',
          fr: 'Au cours de la première année, vous pouvez perdre 60 à 70 % de votre excès de poids.',
          es: 'En el primer año, puedes perder el 60–70 % del exceso de peso.',
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
      fr: 'Chirurgie oculaire au laser (LASIK/No Touch) - 2026',
      es: 'Cirugía ocular con láser (LASIK/No Touch) - 2026',
    },
    metaDescription: {
      tr: 'Miyop, hipermetrop ve astigmat tedavisi için lazer göz ameliyatı fiyatları ve çeşitleri.',
      en: 'Laser eye surgery prices and types for myopia, hyperopia and astigmatism treatment.',
      ar: 'أسعار وأنواع جراحة العيون بالليزر لعلاج قصر النظر وطول النظر والاستجماتيزم.',
      fr: 'Prix et types de chirurgie лазер pour traiter la myopie, l’hypermétropie et l’astigmatisme.',
      es: 'Precios y tipos de cirugía ocular con láser para tratar miopía, hipermetropía y астигматизмо.',
    },
    summary: {
      tr: 'Lazer göz ameliyatı, korneanın şeklini değiştirerek kırma kusurlarını (gözlük ihtiyacını) düzelten bir işlemdir. LASIK, iLASIK, No Touch gibi yöntemleri vardır.',
      en: 'Laser eye surgery is a procedure that corrects refractive errors (need for glasses) by changing the shape of the cornea. There are methods such as LASIK, iLASIK, No Touch.',
      ar: 'جراحة العيون بالليزر هي إجراء يصحح الأخطاء الانكسارية (الحاجة إلى نظارات) عن طريق تغيير شكل القرنية. هناك طرق مثل LASIK و iLASIK و No Touch.',
      fr: 'La chirurgie oculaire au laser corrige les défauts de réfraction (besoin de lunettes) en remodelant la cornée. Elle inclut des techniques comme LASIK, iLASIK et No Touch.',
      es: 'La cirugía ocular con láser corrige los defectos refractivos (necesidad de gafas) al remodelar la córnea. Incluye técnicas como LASIK, iLASIK y No Touch.',
    },
    priceRange: {
      india: '500 - 1.000 USD',
      mexico: '1.000 - 2.000 USD',
      turkey: '800 - 1.500 USD',
      thailand: '1.500 - 2.500 USD',
      poland: '1.200 - 2.000 USD',
      uk: '3.000 - 5.000 USD',
      usa: '4.000 - 6.000 USD',
    },
    duration: { tr: '10 - 20 Dakika', en: '10 - 20 Minutes', ar: '10 - 20 دقيقة' },
    recoveryTime: { tr: '1 - 3 Gün', en: '1 - 3 Days', ar: '1 - 3 أيام' },
    anesthesia: { tr: 'Damlalı Anestezi', en: 'Drop Anesthesia', ar: 'تخدير قطرة' },
    hospitalStay: { tr: 'Gerekmez', en: 'Not Required', ar: 'غير مطلوب' },
    results: { tr: 'Kalıcı', en: 'Permanent', ar: 'دائم' },
    suitableFor: [
      {
        tr: '18 yaşını doldurmuş olanlar',
        en: 'Those over 18 years old',
        ar: 'أولئك الذين تزيد أعمارهم عن 18 عامًا',
        fr: 'Personnes âgées de plus de 18 ans',
        es: 'Personas mayores de 18 años',
      },
      {
        tr: 'Göz numarası son 1 yıldır değişmeyenler',
        en: 'Those whose eye prescription has not changed for the last 1 year',
        ar: 'أولئك الذين لم تتغير وصفة عينهم خلال العام الماضي',
        fr: 'Personnes dont la correction n’a pas changé au cours de la dernière année',
        es: 'Personas cuya graduación no ha cambiado en el último año',
      },
    ],
    notSuitableFor: [
      {
        tr: 'Kornea yapısı çok ince olanlar',
        en: 'Those with very thin cornea structure',
        ar: 'أولئك الذين لديهم بنية قرنية رقيقة جدا',
        fr: 'Personnes avec une cornée trop fine',
        es: 'Personas con una córnea demasiado fina',
      },
      {
        tr: 'Hamileler',
        en: 'Pregnant women',
        ar: 'النساء الحوامل',
        fr: 'Femmes enceintes',
        es: 'Mujeres embarazadas',
      },
    ],
    risks: [
      { tr: 'Göz kuruluğu', en: 'Dry eyes', ar: 'جفاف العين', fr: 'Sécheresse oculaire', es: 'Ojos secos' },
      {
        tr: 'Gece görüşünde hareler (geçici)',
        en: 'Halos in night vision (temporary)',
        ar: 'هالات في الرؤية الليلية (مؤقت)',
        fr: 'Halos en vision nocturne (temporaires)',
        es: 'Halos en la visión nocturna (temporales)',
      },
    ],
    steps: [
      {
        title: { tr: 'Hazırlık', en: 'Preparation', ar: 'تحضير', fr: 'Préparation', es: 'Preparación' },
        desc: {
          tr: 'Göz uyuşturulur.',
          en: 'Eye is numbed.',
          ar: 'يتم تخدير العين.',
          fr: 'L’œil est anesthésié.',
          es: 'Se anestesia el ojo.',
        },
      },
      {
        title: { tr: 'Lazer Uygulaması', en: 'Laser Application', ar: 'تطبيق الليزر', fr: 'Application du laser', es: 'Aplicación del láser' },
        desc: {
          tr: 'Excimer lazer ile kornea şekillendirilir.',
          en: 'Cornea is shaped with Excimer laser.',
          ar: 'يتم تشكيل القرنية بليزر إكسيمر.',
          fr: 'La cornée est remodelée avec un laser excimer.',
          es: 'Se remodela la córnea con láser excímer.',
        },
      },
    ],
    faq: [
      {
        q: { tr: 'Ağrı olur mu?', en: 'Is there pain?', ar: 'هل يوجد ألم؟', fr: 'Y a-t-il une douleur ?', es: '¿Hay dolor?' },
        a: {
          tr: 'İşlem sırasında ağrı olmaz, sonrasında hafif yanma olabilir.',
          en: 'There is no pain during the procedure, there may be slight burning afterwards.',
          ar: 'لا يوجد ألم أثناء العملية، قد يكون هناك حرقان طفيف بعد ذلك.',
          fr: 'Il n’y a pas de douleur pendant l’intervention, mais une légère sensation de brûlure peut apparaître ensuite.',
          es: 'No hay dolor durante el procedimiento, pero después puede haber una ligera sensación de ardor.',
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

