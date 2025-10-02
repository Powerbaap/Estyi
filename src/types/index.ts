export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'clinic' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: string;
  avatar?: string;
  createdAt: Date;
  isVerified: boolean;
}

export interface Clinic {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  verified: boolean;
  createdAt: Date;
}

export interface TreatmentArea {
  id: string;
  key: string;
  name: {
    tr: string;
    en: string;
    ar: string;
    es: string;
    fr: string;
  };
  description: {
    tr: string;
    en: string;
    ar: string;
    es: string;
    fr: string;
  };
  category: 'facial' | 'body' | 'dental' | 'hair' | 'genital' | 'spa';
  icon: string;
}

// Alfabetik sıralı tedavi alanları
export const TREATMENT_AREAS: TreatmentArea[] = [
  {
    id: '1',
    key: 'abdominoplasty',
    name: {
      tr: 'Abdominoplasti (Karın Germe)',
      en: 'Abdominoplasty (Tummy Tuck)',
      ar: 'شد البطن',
      es: 'Abdominoplastia (Estiramiento del Abdomen)',
      fr: 'Abdominoplastie (Raffermissement du Ventre)'
    },
    description: {
      tr: 'Karın bölgesindeki fazla yağ ve deriyi alarak karın kaslarını sıkılaştırma',
      en: 'Removing excess fat and skin from the abdomen and tightening abdominal muscles',
      ar: 'إزالة الدهون الزائدة والجلد من البطن وتقوية عضلات البطن',
      es: 'Eliminación de grasa y piel excesiva del abdomen y fortalecimiento de músculos abdominales',
      fr: 'Suppression de l\'excès de graisse et de peau de l\'abdomen et raffermissement des muscles abdominaux'
    },
    category: 'body',
    icon: 'scissors'
  },
  {
    id: '2',
    key: 'acne_treatment',
    name: {
      tr: 'Akne Tedavisi',
      en: 'Acne Treatment',
      ar: 'علاج حب الشباب',
      es: 'Tratamiento del Acné',
      fr: 'Traitement de l\'Acné'
    },
    description: {
      tr: 'Akne ve sivilce izlerini tedavi etme',
      en: 'Treatment of acne and pimple scars',
      ar: 'علاج حب الشباب وندوب البثور',
      es: 'Tratamiento del acné y cicatrices de granos',
      fr: 'Traitement de l\'acné et des cicatrices de boutons'
    },
    category: 'facial',
    icon: 'droplets'
  },
  {
    id: '3',
    key: 'anti_aging',
    name: {
      tr: 'Anti-Aging Uygulamaları',
      en: 'Anti-Aging Applications',
      ar: 'تطبيقات مكافحة الشيخوخة',
      es: 'Aplicaciones Anti-Aging',
      fr: 'Applications Anti-Âge'
    },
    description: {
      tr: 'Yaşlanma belirtilerini azaltma ve cildi gençleştirme',
      en: 'Reducing signs of aging and rejuvenating skin',
      ar: 'تقليل علامات الشيخوخة وتجديد البشرة',
      es: 'Reducción de signos de envejecimiento y rejuvenecimiento de la piel',
      fr: 'Réduction des signes de vieillissement et rajeunissement de la peau'
    },
    category: 'facial',
    icon: 'heart'
  },
  {
    id: '4',
    key: 'leg_aesthetics',
    name: {
      tr: 'Bacak Estetiği',
      en: 'Leg Aesthetics',
      ar: 'تجميل الساقين',
      es: 'Estética de Piernas',
      fr: 'Esthétique des Jambes'
    },
    description: {
      tr: 'Bacak şekillendirme ve estetik ameliyatları',
      en: 'Leg shaping and aesthetic surgeries',
      ar: 'تشكيل الساقين وجراحات التجميل',
      es: 'Moldeado de piernas y cirugías estéticas',
      fr: 'Façonnage des jambes et chirurgies esthétiques'
    },
    category: 'body',
    icon: 'activity'
  },
  {
    id: '5',
    key: 'hip_aesthetics',
    name: {
      tr: 'Basen Estetiği',
      en: 'Hip Aesthetics',
      ar: 'تجمل الوركين',
      es: 'Estética de Caderas',
      fr: 'Esthétique des Hanches'
    },
    description: {
      tr: 'Basen bölgesi şekillendirme ve estetik',
      en: 'Hip area shaping and aesthetics',
      ar: 'تشكيل منطقة الوركين والتجميل',
      es: 'Moldeado de área de caderas y estética',
      fr: 'Façonnage de la zone des hanches et esthétique'
    },
    category: 'body',
    icon: 'circle'
  },
  {
    id: '6',
    key: 'botox',
    name: {
      tr: 'Botoks',
      en: 'Botox',
      ar: 'البوتوكس',
      es: 'Botox',
      fr: 'Botox'
    },
    description: {
      tr: 'Yüz kırışıklıklarını azaltma ve önleme',
      en: 'Reducing and preventing facial wrinkles',
      ar: 'تقليل ومنع تجاعيد الوجه',
      es: 'Reducción y prevención de arrugas faciales',
      fr: 'Réduction et prévention des rides faciales'
    },
    category: 'facial',
    icon: 'needle'
  },
  {
    id: '7',
    key: 'height_surgery',
    name: {
      tr: 'Boy Uzatma Ameliyatı',
      en: 'Height Lengthening Surgery',
      ar: 'جراحة إطالة القامة',
      es: 'Cirugía de Alargamiento de Estatura',
      fr: 'Chirurgie d\'Allongement de la Taille'
    },
    description: {
      tr: 'Kemik uzatma ameliyatları ile boy uzatma',
      en: 'Lengthening height through bone lengthening surgeries',
      ar: 'إطالة القامة من خلال جراحات إطالة العظام',
      es: 'Alargamiento de estatura mediante cirugías de alargamiento óseo',
      fr: 'Allongement de la taille par chirurgies d\'allongement osseux'
    },
    category: 'body',
    icon: 'arrow-up'
  },
  {
    id: '8',
    key: 'rhinoplasty',
    name: {
      tr: 'Burun Estetiği (Rinoplasti)',
      en: 'Nose Aesthetics (Rhinoplasty)',
      ar: 'تجمل الأنف (رينوبلاستي)',
      es: 'Estética Nasal (Rinoplastia)',
      fr: 'Esthétique du Nez (Rhinoplastie)'
    },
    description: {
      tr: 'Burun şekli ve fonksiyonunu iyileştirme',
      en: 'Improving nose shape and function',
      ar: 'تحسين شكل ووظيفة الأنف',
      es: 'Mejora de la forma y función de la nariz',
      fr: 'Amélioration de la forme et de la fonction du nez'
    },
    category: 'facial',
    icon: 'smile'
  },
  {
    id: '9',
    key: 'chin_aesthetics',
    name: {
      tr: 'Çene Estetiği',
      en: 'Chin Aesthetics',
      ar: 'تجمل الذقن',
      es: 'Estética de Mentón',
      fr: 'Esthétique du Menton'
    },
    description: {
      tr: 'Çene şekli ve profili iyileştirme',
      en: 'Improving chin shape and profile',
      ar: 'تحسين شكل وملامح الذقن',
      es: 'Mejora de la forma y perfil del mentón',
      fr: 'Amélioration de la forme et du profil du menton'
    },
    category: 'facial',
    icon: 'square'
  },
  {
    id: '10',
    key: 'skin_rejuvenation',
    name: {
      tr: 'Cilt Gençleştirme (Mezoterapi, PRP vb.)',
      en: 'Skin Rejuvenation (Mesotherapy, PRP etc.)',
      ar: 'تجديد البشرة (ميزوثيرابي، PRP إلخ)',
      es: 'Rejuvenecimiento de Piel (Mesoterapia, PRP etc.)',
      fr: 'Rajeunissement de la Peau (Mésothérapie, PRP etc.)'
    },
    description: {
      tr: 'Cildi gençleştirme ve canlandırma tedavileri',
      en: 'Skin rejuvenation and revitalization treatments',
      ar: 'علاجات تجديد البشرة وإحيائها',
      es: 'Tratamientos de rejuvenecimiento y revitalización de la piel',
      fr: 'Traitements de rajeunissement et de revitalisation de la peau'
    },
    category: 'facial',
    icon: 'sparkles'
  },
  {
    id: '11',
    key: 'teeth_whitening',
    name: {
      tr: 'Diş Beyazlatma',
      en: 'Teeth Whitening',
      ar: 'تبييض الأسنان',
      es: 'Blanqueamiento Dental',
      fr: 'Blanchiment des Dents'
    },
    description: {
      tr: 'Diş rengini açma ve beyazlatma',
      en: 'Lightening and whitening tooth color',
      ar: 'تفتيح وتبييض لون الأسنان',
      es: 'Aclarado y blanqueamiento del color dental',
      fr: 'Éclaircissement et blanchiment de la couleur des dents'
    },
    category: 'dental',
    icon: 'tooth'
  },
  {
    id: '12',
    key: 'dental_implant',
    name: {
      tr: 'Diş İmplantı',
      en: 'Dental Implant',
      ar: 'زراعة الأسنان',
      es: 'Implante Dental',
      fr: 'Implant Dentaire'
    },
    description: {
      tr: 'Eksik dişleri implant ile tamamlama',
      en: 'Completing missing teeth with implants',
      ar: 'إكمال الأسنان المفقودة بالزراعة',
      es: 'Completar dientes faltantes con implantes',
      fr: 'Compléter les dents manquantes avec des implants'
    },
    category: 'dental',
    icon: 'tooth'
  },
  {
    id: '13',
    key: 'lip_filler',
    name: {
      tr: 'Dudak Dolgusu',
      en: 'Lip Filler',
      ar: 'حشو الشفاه',
      es: 'Relleno de Labios',
      fr: 'Remplissage des Lèvres'
    },
    description: {
      tr: 'Dudakları dolgunlaştırma ve şekillendirme',
      en: 'Plumping and shaping lips',
      ar: 'تسمين وتشكيل الشفاه',
      es: 'Aumento y modelado de labios',
      fr: 'Gonflement et modelage des lèvres'
    },
    category: 'facial',
    icon: 'heart'
  },
  {
    id: '14',
    key: 'hand_rejuvenation',
    name: {
      tr: 'El Gençleştirme',
      en: 'Hand Rejuvenation',
      ar: 'تجديد اليدين',
      es: 'Rejuvenecimiento de Manos',
      fr: 'Rajeunissement des Mains'
    },
    description: {
      tr: 'El yaşlanma belirtilerini azaltma',
      en: 'Reducing signs of hand aging',
      ar: 'تقليل علامات شيخوخة اليدين',
      es: 'Reducción de signos de envejecimiento de manos',
      fr: 'Réduction des signes de vieillissement des mains'
    },
    category: 'facial',
    icon: 'hand'
  },
  {
    id: '15',
    key: 'under_eye_filler',
    name: {
      tr: 'Göz Altı Işık Dolgusu',
      en: 'Under Eye Light Filler',
      ar: 'حشو الضوء تحت العين',
      es: 'Relleno de Luz Bajo los Ojos',
      fr: 'Remplissage de Lumière Sous les Yeux'
    },
    description: {
      tr: 'Göz altı koyu halkaları ve çöküklükleri doldurma',
      en: 'Filling under eye dark circles and hollows',
      ar: 'ملء الهالات السوداء والفراغات تحت العين',
      es: 'Relleno de ojeras y hundimientos bajo los ojos',
      fr: 'Remplissage des cernes et creux sous les yeux'
    },
    category: 'facial',
    icon: 'eye'
  },
  {
    id: '16',
    key: 'blepharoplasty',
    name: {
      tr: 'Göz Kapağı Estetiği (Blefaroplasti)',
      en: 'Eyelid Aesthetics (Blepharoplasty)',
      ar: 'تجمل الجفون (بلفاروبلاستي)',
      es: 'Estética de Párpados (Blefaroplastia)',
      fr: 'Esthétique des Paupières (Blépharoplastie)'
    },
    description: {
      tr: 'Göz kapağı sarkması ve torbalarını düzeltme',
      en: 'Correcting drooping eyelids and bags',
      ar: 'تصحيح تدلي الجفون والأكياس',
      es: 'Corrección de párpados caídos y bolsas',
      fr: 'Correction des paupières tombantes et des poches'
    },
    category: 'facial',
    icon: 'eye'
  },
  {
    id: '17',
    key: 'breast_augmentation',
    name: {
      tr: 'Göğüs Büyütme',
      en: 'Breast Augmentation',
      ar: 'تكبير الثدي',
      es: 'Aumento de Senos',
      fr: 'Augmentation Mammaire'
    },
    description: {
      tr: 'Göğüs boyutunu artırma ve şekillendirme',
      en: 'Increasing breast size and shaping',
      ar: 'زيادة حجم الثدي وتشكيله',
      es: 'Aumento del tamaño de senos y modelado',
      fr: 'Augmentation de la taille des seins et modelage'
    },
    category: 'body',
    icon: 'heart'
  },
  {
    id: '18',
    key: 'breast_lift',
    name: {
      tr: 'Göğüs Dikleştirme',
      en: 'Breast Lift',
      ar: 'رفع الثدي',
      es: 'Elevación de Senos',
      fr: 'Lifting des Seins'
    },
    description: {
      tr: 'Sarkmış göğüsleri dikleştirme',
      en: 'Lifting sagging breasts',
      ar: 'رفع الثدي المترهل',
      es: 'Elevación de senos caídos',
      fr: 'Remontée des seins tombants'
    },
    category: 'body',
    icon: 'arrow-up'
  },
  {
    id: '19',
    key: 'breast_reduction',
    name: {
      tr: 'Göğüs Küçültme',
      en: 'Breast Reduction',
      ar: 'تصغير الثدي',
      es: 'Reducción de Senos',
      fr: 'Réduction Mammaire'
    },
    description: {
      tr: 'Büyük göğüsleri küçültme',
      en: 'Reducing large breasts',
      ar: 'تصغير الثدي الكبير',
      es: 'Reducción de senos grandes',
      fr: 'Réduction des gros seins'
    },
    category: 'body',
    icon: 'arrow-down'
  },
  {
    id: '20',
    key: 'bbm',
    name: {
      tr: 'Kalça Şekillendirme / BBL (Popo Kaldırma)',
      en: 'Hip Shaping / BBL (Butt Lift)',
      ar: 'تشكيل الوركين / BBL (رفع المؤخرة)',
      es: 'Moldeado de Caderas / BBL (Elevación de Glúteos)',
      fr: 'Façonnage des Hanches / BBL (Lifting des Fesses)'
    },
    description: {
      tr: 'Kalça ve popo bölgesini şekillendirme',
      en: 'Shaping hip and butt area',
      ar: 'تشكيل منطقة الوركين والمؤخرة',
      es: 'Moldeado de área de caderas y glúteos',
      fr: 'Façonnage de la zone des hanches et des fesses'
    },
    category: 'body',
    icon: 'circle'
  },
  {
    id: '21',
    key: 'carbon_peeling',
    name: {
      tr: 'Karbon Peeling',
      en: 'Carbon Peeling',
      ar: 'تقشير الكربون',
      es: 'Peeling de Carbono',
      fr: 'Peeling au Carbone'
    },
    description: {
      tr: 'Karbon maskesi ile cilt temizleme ve yenileme',
      en: 'Skin cleansing and renewal with carbon mask',
      ar: 'تنظيف وتجديد البشرة بقناع الكربون',
      es: 'Limpieza y renovación de piel con máscara de carbono',
      fr: 'Nettoyage et renouvellement de la peau avec masque au carbone'
    },
    category: 'facial',
    icon: 'droplets'
  },
  {
    id: '22',
    key: 'arm_lift',
    name: {
      tr: 'Kol Germe',
      en: 'Arm Lift',
      ar: 'شد الذراعين',
      es: 'Lifting de Brazos',
      fr: 'Lifting des Bras'
    },
    description: {
      tr: 'Sarkmış kolları germe ve şekillendirme',
      en: 'Lifting and shaping sagging arms',
      ar: 'شد وتشكيل الذراعين المترهلين',
      es: 'Elevación y modelado de brazos caídos',
      fr: 'Remontée et modelage des bras tombants'
    },
    category: 'body',
    icon: 'activity'
  },
  {
    id: '23',
    key: 'full_body_makeover',
    name: {
      tr: 'Kombine Estetik Paketleri (Full Body Makeover)',
      en: 'Combined Aesthetic Packages (Full Body Makeover)',
      ar: 'حزم التجميل المجمعة (تجميل الجسم الكامل)',
      es: 'Paquetes Estéticos Combinados (Transformación Corporal Completa)',
      fr: 'Forfaits Esthétiques Combinés (Transformation Corporelle Complète)'
    },
    description: {
      tr: 'Birden fazla bölge için kombine estetik paketleri',
      en: 'Combined aesthetic packages for multiple areas',
      ar: 'حزم التجميل المجمعة لمناطق متعددة',
      es: 'Paquetes estéticos combinados para múltiples áreas',
      fr: 'Forfaits esthétiques combinés pour plusieurs zones'
    },
    category: 'body',
    icon: 'package'
  },
  {
    id: '24',
    key: 'liposuction',
    name: {
      tr: 'Liposuction (Yağ Aldırma)',
      en: 'Liposuction (Fat Removal)',
      ar: 'شفط الدهون',
      es: 'Liposucción (Eliminación de Grasa)',
      fr: 'Liposuccion (Élimination de Graisse)'
    },
    description: {
      tr: 'Vücuttan fazla yağları alma',
      en: 'Removing excess fat from body',
      ar: 'إزالة الدهون الزائدة من الجسم',
      es: 'Eliminación de grasa excesiva del cuerpo',
      fr: 'Suppression de l\'excès de graisse du corps'
    },
    category: 'body',
    icon: 'droplets'
  },
  {
    id: '25',
    key: 'luxury_spa',
    name: {
      tr: 'Lüks Medikal Spa Tedavileri',
      en: 'Luxury Medical Spa Treatments',
      ar: 'علاجات السبا الطبي الفاخر',
      es: 'Tratamientos de Spa Médico de Lujo',
      fr: 'Traitements de Spa Médical de Luxe'
    },
    description: {
      tr: 'Lüks spa ve wellness tedavileri',
      en: 'Luxury spa and wellness treatments',
      ar: 'علاجات السبا والعافية الفاخرة',
      es: 'Tratamientos de spa y bienestar de lujo',
      fr: 'Traitements de spa et bien-être de luxe'
    },
    category: 'spa',
    icon: 'sparkles'
  },
  {
    id: '26',
    key: 'nipple_aesthetics',
    name: {
      tr: 'Meme Ucu Estetiği',
      en: 'Nipple Aesthetics',
      ar: 'تجمل حلمة الثدي',
      es: 'Estética de Pezones',
      fr: 'Esthétique des Mamelons'
    },
    description: {
      tr: 'Meme ucu şekli ve görünümünü iyileştirme',
      en: 'Improving nipple shape and appearance',
      ar: 'تحسين شكل ومظهر حلمة الثدي',
      es: 'Mejora de la forma y apariencia de pezones',
      fr: 'Amélioration de la forme et de l\'apparence des mamelons'
    },
    category: 'body',
    icon: 'circle'
  },
  {
    id: '27',
    key: 'hair_transplant',
    name: {
      tr: 'Saç Ekimi',
      en: 'Hair Transplant',
      ar: 'زراعة الشعر',
      es: 'Trasplante de Cabello',
      fr: 'Greffe de Cheveux'
    },
    description: {
      tr: 'Saç dökülmesi için saç ekimi',
      en: 'Hair transplant for hair loss',
      ar: 'زراعة الشعر لتساقط الشعر',
      es: 'Trasplante de cabello para la pérdida de cabello',
      fr: 'Greffe de cheveux pour la perte de cheveux'
    },
    category: 'hair',
    icon: 'scissors'
  },
  {
    id: '28',
    key: 'beard_transplant',
    name: {
      tr: 'Sakal Ekimi',
      en: 'Beard Transplant',
      ar: 'زراعة اللحية',
      es: 'Trasplante de Barba',
      fr: 'Greffe de Barbe'
    },
    description: {
      tr: 'Sakal ve bıyık ekimi',
      en: 'Beard and mustache transplant',
      ar: 'زراعة اللحية والشارب',
      es: 'Trasplante de barba y bigote',
      fr: 'Greffe de barbe et moustache'
    },
    category: 'hair',
    icon: 'scissors'
  },
  {
    id: '29',
    key: 'facelift',
    name: {
      tr: 'Yüz Germe (Facelift)',
      en: 'Face Lift (Facelift)',
      ar: 'شد الوجه (فيس ليفت)',
      es: 'Lifting Facial (Facelift)',
      fr: 'Lifting du Visage (Facelift)'
    },
    description: {
      tr: 'Yüz sarkmasını düzeltme ve gençleştirme',
      en: 'Correcting facial sagging and rejuvenation',
      ar: 'تصحيح ترهل الوجه والتجديد',
      es: 'Corrección de flacidez facial y rejuvenecimiento',
      fr: 'Correction de l\'affaissement facial et rajeunissement'
    },
    category: 'facial',
    icon: 'smile'
  },
  {
    id: '30',
    key: 'facial_contouring',
    name: {
      tr: 'Yüz Şekillendirme (Dolgu / Jawline)',
      en: 'Facial Contouring (Filler / Jawline)',
      ar: 'تشكيل الوجه (حشو / خط الفك)',
      es: 'Contorneado Facial (Relleno / Línea de Mandíbula)',
      fr: 'Contourage du Visage (Remplissage / Ligne de Mâchoire)'
    },
    description: {
      tr: 'Yüz hatlarını dolgu ile şekillendirme',
      en: 'Shaping facial contours with fillers',
      ar: 'تشكيل ملامح الوجه بالحشو',
      es: 'Modelado de contornos faciales con rellenos',
      fr: 'Façonnage des contours du visage avec des remplissages'
    },
    category: 'facial',
    icon: 'square'
  },
  {
    id: '31',
    key: 'vaginal_aesthetics',
    name: {
      tr: 'Vajinal Estetik (Genital Estetik)',
      en: 'Vaginal Aesthetics (Genital Aesthetics)',
      ar: 'التجميل المهبلي (تجميل الأعضاء التناسلية)',
      es: 'Estética Vaginal (Estética Genital)',
      fr: 'Esthétique Vaginale (Esthétique Génitale)'
    },
    description: {
      tr: 'Kadın genital bölge estetik ameliyatları',
      en: 'Female genital area aesthetic surgeries',
      ar: 'جراحات تجميل منطقة الأعضاء التناسلية الأنثوية',
      es: 'Cirugías estéticas del área genital femenina',
      fr: 'Chirurgies esthétiques de la zone génitale féminine'
    },
    category: 'genital',
    icon: 'heart'
  },
  {
    id: '32',
    key: 'penis_filler',
    name: {
      tr: 'Penis Kalınlaştırma Dolgusu (Penil Filler)',
      en: 'Penis Thickening Filler (Penile Filler)',
      ar: 'حشو تكثيف القضيب (حشو القضيب)',
      es: 'Relleno de Engrosamiento del Pene (Relleno Peneano)',
      fr: 'Remplissage d\'Épaississement du Pénis (Remplissage Pénien)'
    },
    description: {
      tr: 'Penis kalınlaştırma ve şekillendirme',
      en: 'Penis thickening and shaping',
      ar: 'تكثيف وتشكيل القضيب',
      es: 'Engrosamiento y modelado del pene',
      fr: 'Épaississement et modelage du pénis'
    },
    category: 'genital',
    icon: 'activity'
  },
  {
    id: '33',
    key: 'penis_lengthening',
    name: {
      tr: 'Penis Uzatma Operasyonları',
      en: 'Penis Lengthening Operations',
      ar: 'عمليات إطالة القضيب',
      es: 'Operaciones de Alargamiento del Pene',
      fr: 'Opérations d\'Allongement du Pénis'
    },
    description: {
      tr: 'Penis uzunluğunu artırma ameliyatları',
      en: 'Penis length increasing surgeries',
      ar: 'جراحات زيادة طول القضيب',
      es: 'Cirugías de aumento de longitud del pene',
      fr: 'Chirurgies d\'augmentation de la longueur du pénis'
    },
    category: 'genital',
    icon: 'arrow-up'
  },
  {
    id: '34',
    key: 'body_contouring',
    name: {
      tr: 'Vücut Şekillendirme (HD Liposuction, Six-Pack Abdominal Etching)',
      en: 'Body Contouring (HD Liposuction, Six-Pack Abdominal Etching)',
      ar: 'تشكيل الجسم (شفط الدهون عالي الدقة، نحت البطن)',
      es: 'Contorneado Corporal (Liposucción HD, Grabado Abdominal Six-Pack)',
      fr: 'Contourage Corporel (Liposuccion HD, Gravure Abdominale Six-Pack)'
    },
    description: {
      tr: 'Vücut şekillendirme ve kas hatlarını belirginleştirme',
      en: 'Body contouring and muscle definition',
      ar: 'تشكيل الجسم وتحديد العضلات',
      es: 'Contorneado corporal y definición muscular',
      fr: 'Contourage corporel et définition musculaire'
    },
    category: 'body',
    icon: 'activity'
  },
  {
    id: '35',
    key: 'nail_treatment',
    name: {
      tr: 'El Tırnak İşlemleri',
      en: 'Nail Treatment',
      ar: 'علاج الأظافر',
      es: 'Tratamiento de Uñas',
      fr: 'Traitement des Ongles'
    },
    description: {
      tr: 'Tırnak uzatma, şekillendirme ve dekoratif uygulamalar',
      en: 'Nail extension, shaping and decorative applications',
      ar: 'إطالة الأظافر وتشكيلها والتطبيقات الزخرفية',
      es: 'Extensión de uñas, modelado y aplicaciones decorativas',
      fr: 'Extension d\'ongles, modelage et applications décoratives'
    },
    category: 'spa',
    icon: 'scissors'
  },
  {
    id: '36',
    key: 'hair_coloring',
    name: {
      tr: 'Saç Boyama',
      en: 'Hair Coloring',
      ar: 'صبغ الشعر',
      es: 'Tinte de Cabello',
      fr: 'Teinture de Cheveux'
    },
    description: {
      tr: 'Saç boyama, balayage, ombre ve renk uygulamaları',
      en: 'Hair coloring, balayage, ombre and color applications',
      ar: 'صبغ الشعر وتقنيات الباليهاج والأومبري',
      es: 'Tinte de cabello, balayage, ombre y aplicaciones de color',
      fr: 'Teinture de cheveux, balayage, ombre et applications de couleur'
    },
    category: 'hair',
    icon: 'droplets'
  },
  {
    id: '37',
    key: 'hair_prosthesis',
    name: {
      tr: 'Protez Saç',
      en: 'Hair Prosthesis',
      ar: 'شعر صناعي',
      es: 'Cabello Postizo',
      fr: 'Perruque'
    },
    description: {
      tr: 'Saç dökülmesi için protez saç takılması ve bakımı',
      en: 'Hair prosthesis installation and maintenance for hair loss',
      ar: 'تركيب الشعر الصناعي وصيانته لتساقط الشعر',
      es: 'Instalación y mantenimiento de prótesis capilar para la caída del cabello',
      fr: 'Installation et entretien de prothèses capillaires pour la perte de cheveux'
    },
    category: 'hair',
    icon: 'heart'
  },
  {
    id: '38',
    key: 'other_hair_treatments',
    name: {
      tr: 'Diğer Saç İşlemleri',
      en: 'Other Hair Treatments',
      ar: 'إجراءات شعر أخرى',
      es: 'Otros Tratamientos de Cabello',
      fr: 'Autres Traitements de Cheveux'
    },
    description: {
      tr: 'Saç bakımı, şekillendirme ve diğer saç işlemleri',
      en: 'Hair care, styling and other hair treatments',
      ar: 'العناية بالشعر وتصفيفه وإجراءات شعر أخرى',
      es: 'Cuidado del cabello, peinado y otros tratamientos capilares',
      fr: 'Soins des cheveux, coiffage et autres traitements capillaires'
    },
    category: 'hair',
    icon: 'scissors'
  }
];

export interface Offer {
  id: string;
  clinicId: string;
  clinicName: string;
  treatmentArea: string;
  description: string;
  price: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Appointment {
  id: string;
  userId: string;
  clinicId: string;
  treatmentArea: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  clinicId: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
}