/**
 * Tek kaynak: Kullanıcı talep formu ve klinik başvuru uzmanlık alanları bu yapıyı kullanır.
 * Ana başlıklar (kategoriler) ve alt işlemler (params ile).
 */

export interface ProcedureParam {
  type: string;
  options: string[];
}

export interface ProcedureItem {
  key: string;
  name: string;
  params: ProcedureParam[];
}

export interface ProcedureCategory {
  key: string;
  name: string;
  procedures: ProcedureItem[];
}

export const PROCEDURE_CATEGORIES: ProcedureCategory[] = [
  {
    key: 'medikal_estetik',
    name: 'Medikal Estetik – Enjeksiyon & Dolgu',
    procedures: [
      { key: 'prp', name: 'PRP', params: [{ type: 'bolge', options: ['Yüz', 'Saç'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'mezoterapi', name: 'Mezoterapi', params: [{ type: 'bolge', options: ['Yüz', 'Saç', 'Vücut'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'skinbooster_somon_dna', name: 'Skinbooster / Somon DNA', params: [{ type: 'bolge', options: ['Yüz', 'Boyun', 'Dekolte', 'El'] }, { type: 'seans', options: ['1', '3'] }] },
      { key: 'ip_aski', name: 'İp Askı (Thread Lift)', params: [{ type: 'ip_sayisi', options: ['2 ip', '4 ip', '6 ip', '8 ip'] }] },
      { key: 'gidi_eritme_enjeksiyon', name: 'Gıdı Eritme Enjeksiyonu', params: [{ type: 'seans', options: ['1', '2', '3', '4'] }] },
    ],
  },
  {
    key: 'cilt_dermatoloji',
    name: 'Cilt & Dermatoloji – Lazer / Peeling / Tedaviler',
    procedures: [
      { key: 'lazer_epilasyon', name: 'Lazer Epilasyon', params: [{ type: 'bolge', options: ['Yüz', 'Koltuk Altı', 'Bikini', 'Bacak', 'Kol', 'Tüm Vücut'] }, { type: 'seans', options: ['1', '6', '8', '10'] }] },
      { key: 'karbon_peeling', name: 'Karbon Peeling', params: [{ type: 'bolge', options: ['Yüz', 'Sırt'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'hydrafacial', name: 'Hydrafacial / Medikal Cilt Bakımı', params: [{ type: 'bolge', options: ['Yüz', 'Yüz+Boyun'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'kimyasal_peeling', name: 'Kimyasal Peeling', params: [{ type: 'seviye', options: ['Hafif', 'Orta', 'Derin'] }, { type: 'seans', options: ['1', '3'] }] },
      { key: 'fraksiyonel_lazer', name: 'Fraksiyonel Lazer (Cilt Yenileme)', params: [{ type: 'bolge', options: ['Yüz', 'Yüz+Boyun', 'El', 'Skar Bölgesi'] }, { type: 'seans', options: ['1', '3', '5'] }] },
      { key: 'leke_tedavisi_protokolu', name: 'Leke Tedavisi Protokolü', params: [{ type: 'bolge', options: ['Yüz', 'Yüz+Boyun', 'El'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'akne_tedavisi_protokolu', name: 'Akne Tedavisi Protokolü', params: [{ type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'akne_izi_skar', name: 'Akne İzi / Skar Tedavisi', params: [{ type: 'bolge', options: ['Yüz', 'Sırt', 'Skar Bölgesi'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'ben_sigil_et_beni', name: 'Ben/Siğil/Et Beni Alma', params: [{ type: 'adet', options: ['1', '2-5', '6-10', '10+'] }] },
      { key: 'catlak_tedavisi', name: 'Çatlak Tedavisi', params: [{ type: 'bolge', options: ['Karın', 'Basen', 'Bacak', 'Kol'] }, { type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'selulit_tedavisi', name: 'Selülit Tedavisi', params: [{ type: 'bolge', options: ['Basen', 'Bacak', 'Kalça'] }, { type: 'seans', options: ['3', '6', '10'] }] },
      { key: 'kilcal_damar_tedavisi', name: 'Kılcal Damar Tedavisi', params: [{ type: 'bolge', options: ['Yüz', 'Bacak'] }, { type: 'seans', options: ['1', '3', '5'] }] },
      { key: 'cilt_sikilastirma_hifu_rf', name: 'Cilt Sıkılaştırma (HIFU / RF)', params: [{ type: 'bolge', options: ['Yüz', 'Yüz+Boyun', 'Gıdı', 'Karın', 'Kol'] }, { type: 'seans', options: ['1', '3'] }] },
    ],
  },
  {
    key: 'sac_kas',
    name: 'Saç & Kaş – Ekimi ve Tedaviler',
    procedures: [
      { key: 'sac_ekimi_fue', name: 'Saç Ekimi - FUE', params: [{ type: 'greft_araligi', options: ['1500-2500', '2500-3500', '3500-4500', '4500+'] }] },
      { key: 'sac_ekimi_dhi', name: 'Saç Ekimi - DHI', params: [{ type: 'greft_araligi', options: ['1500-2500', '2500-3500', '3500-4500', '4500+'] }] },
      { key: 'sakal_ekimi', name: 'Sakal Ekimi', params: [{ type: 'greft_araligi', options: ['500-1000', '1000-2000', '2000+'] }] },
      { key: 'kas_ekimi', name: 'Kaş Ekimi', params: [{ type: 'greft_araligi', options: ['100-200', '200-400', '400+'] }] },
      { key: 'sac_prp', name: 'Saç PRP', params: [{ type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'sac_mezoterapisi', name: 'Saç Mezoterapisi', params: [{ type: 'seans', options: ['1', '3', '6'] }] },
      { key: 'protez_sac', name: 'Protez Saç', params: [{ type: 'paket', options: ['Başlangıç', 'Standart', 'Premium'] }] },
      { key: 'sac_boyama', name: 'Saç Boyama', params: [{ type: 'sac_uzunlugu', options: ['Kısa', 'Orta', 'Uzun'] }] },
    ],
  },
  {
    key: 'dis',
    name: 'Diş – Estetik & Tedavi',
    procedures: [
      { key: 'dis_beyazlatma', name: 'Diş Beyazlatma', params: [{ type: 'paket', options: ['Ofis', 'Ev Tipi', 'Kombine'] }] },
      { key: 'dis_implant', name: 'Diş İmplantı', params: [{ type: 'adet', options: ['1', '2', '3-5', '6+'] }] },
      { key: 'zirkonyum_kaplama', name: 'Zirkonyum Kaplama', params: [{ type: 'adet', options: ['1-4', '5-8', '9-12', '12+'] }] },
      { key: 'lamina_veneer', name: 'Lamina Veneer (Yaprak Porselen)', params: [{ type: 'adet', options: ['1-4', '5-8', '9-12', '12+'] }] },
      { key: 'gulus_tasarimi', name: 'Gülüş Tasarımı Paketi', params: [{ type: 'paket', options: ['Basic', 'Standard', 'Premium'] }] },
      { key: 'ortodonti_seffaf_plak', name: 'Ortodonti - Şeffaf Plak', params: [{ type: 'plak_paket', options: ['Light', 'Medium', 'Advanced'] }] },
      { key: 'dis_eti_estetigi', name: 'Diş Eti Estetiği (Pembe Estetik)', params: [{ type: 'bolge', options: ['1 Bölge', 'Üst Çene', 'Alt Çene', 'Üst+Alt'] }] },
      { key: 'kanal_tedavisi', name: 'Kanal Tedavisi', params: [{ type: 'dis_tipi', options: ['Ön Diş', 'Küçük Azı', 'Büyük Azı'] }] },
      { key: 'kompozit_dolgu', name: 'Kompozit Dolgu', params: [{ type: 'dis_tipi', options: ['Ön Diş', 'Küçük Azı', 'Büyük Azı'] }, { type: 'adet', options: ['1', '2', '3-5', '6+'] }] },
    ],
  },
  {
    key: 'yuz_cerrahi',
    name: 'Yüz Cerrahisi – Plastik Cerrahi',
    procedures: [
      { key: 'burun_estetigi_rinoplasti', name: 'Burun Estetiği (Rinoplasti)', params: [] },
      { key: 'revizyon_rinoplasti', name: 'Revizyon Rinoplasti', params: [] },
      { key: 'goz_kapagi_estetigi', name: 'Göz Kapağı Estetiği (Blefaroplasti)', params: [{ type: 'taraf', options: ['Üst', 'Alt', 'Üst+Alt'] }] },
      { key: 'yuz_germe_facelift', name: 'Yüz Germe (Facelift)', params: [{ type: 'seviye', options: ['Mini', 'Orta', 'Tam'] }] },
      { key: 'boyun_germe', name: 'Boyun Germe', params: [] },
      { key: 'kas_kaldirma', name: 'Kaş Kaldırma', params: [] },
      { key: 'bisektomi', name: 'Bişektomi', params: [] },
      { key: 'cene_estetigi', name: 'Çene Estetiği', params: [{ type: 'paket', options: ['Genioplasti', 'Çene İmplantı'] }] },
      { key: 'kulak_estetigi_otoplasti', name: 'Kulak Estetiği (Otoplasti)', params: [] },
    ],
  },
  {
    key: 'gogus_cerrahi',
    name: 'Göğüs Cerrahisi',
    procedures: [
      { key: 'gogus_buyutme', name: 'Göğüs Büyütme', params: [{ type: 'implant_tipi', options: ['Round', 'Anatomik', 'Doktor Önerisi'] }] },
      { key: 'gogus_diklestirme', name: 'Göğüs Dikleştirme', params: [] },
      { key: 'gogus_kucultme', name: 'Göğüs Küçültme', params: [] },
      { key: 'jinekomasti', name: 'Jinekomasti (Erkek Meme Küçültme)', params: [] },
    ],
  },
  {
    key: 'vucut_cerrahi',
    name: 'Vücut Cerrahisi & Şekillendirme',
    procedures: [
      { key: 'liposuction', name: 'Liposuction', params: [{ type: 'bolge', options: ['Karın', 'Bel', 'Basen', 'Bacak', 'Kol', 'Gıdı', 'Full Body'] }] },
      { key: 'hd_liposuction', name: 'HD Liposuction / Six-Pack Etching', params: [] },
      { key: 'abdominoplasti', name: 'Abdominoplasti (Karın Germe)', params: [] },
      { key: 'kol_germe', name: 'Kol Germe', params: [] },
      { key: 'bacak_estetigi', name: 'Bacak Estetiği', params: [] },
      { key: 'basen_estetigi', name: 'Basen Estetiği', params: [] },
      { key: 'kalca_bbl', name: 'Kalça Şekillendirme / BBL', params: [] },
      { key: 'mommy_makeover', name: 'Mommy Makeover', params: [] },
      { key: 'full_body_makeover', name: 'Full Body Makeover', params: [] },
      { key: 'boy_uzatma', name: 'Boy Uzatma Ameliyatı', params: [] },
    ],
  },
  {
    key: 'ameliyatsiz_incelme',
    name: 'Ameliyatsız Zayıflama & Bölgesel İncelme',
    procedures: [
      { key: 'soguk_lipoliz', name: 'Soğuk Lipoliz', params: [{ type: 'bolge', options: ['Karın', 'Bel', 'Basen', 'Bacak', 'Kol', 'Gıdı'] }, { type: 'seans', options: ['1', '2', '3'] }] },
      { key: 'bolgesel_incelme_rf', name: 'Bölgesel İncelme (RF / Kavitasyon)', params: [{ type: 'bolge', options: ['Karın', 'Bel', 'Basen', 'Bacak', 'Kol'] }, { type: 'seans', options: ['3', '6', '10'] }] },
      { key: 'lenf_drenaj_masaji', name: 'Lenf Drenaj Masajı', params: [{ type: 'seans', options: ['1', '5', '10'] }] },
      { key: 'medikal_spa_kur', name: 'Medikal Spa / Kür Paketleri', params: [{ type: 'paket', options: ['Relax', 'Detox', 'Post-Op Recovery'] }] },
    ],
  },
  {
    key: 'kadin_sagligi',
    name: 'Kadın Sağlığı – Genital Estetik',
    procedures: [
      { key: 'vajinal_estetik_labioplasti', name: 'Vajinal Estetik (Labioplasti)', params: [] },
      { key: 'vajinal_sikilastirma', name: 'Vajinal Sıkılaştırma (Lazer/RF)', params: [{ type: 'seans', options: ['1', '3', '5'] }] },
    ],
  },
  {
    key: 'erkek_sagligi',
    name: 'Erkek Sağlığı – Androloji Estetik',
    procedures: [
      { key: 'penil_filler', name: 'Penis Kalınlaştırma Dolgusu (Penil Filler)', params: [{ type: 'ml', options: ['2 ml', '4 ml', '6 ml', '8 ml'] }] },
      { key: 'penis_uzatma', name: 'Penis Uzatma Operasyonu', params: [] },
    ],
  },
];

/** Tüm işlem anahtarları (klinik uzmanlık alanları ile birebir) */
export const ALL_PROCEDURE_KEYS: string[] = PROCEDURE_CATEGORIES.flatMap((c) =>
  c.procedures.map((p) => p.key)
);

export function getProcedure(procedureKey: string): ProcedureItem | undefined {
  for (const cat of PROCEDURE_CATEGORIES) {
    const found = cat.procedures.find((p) => p.key === procedureKey);
    if (found) return found;
  }
  return undefined;
}

export function getCategoryForProcedure(procedureKey: string): ProcedureCategory | undefined {
  return PROCEDURE_CATEGORIES.find((c) => c.procedures.some((p) => p.key === procedureKey));
}

/** Arama için: kategori + işlem adına göre filtreler */
export function filterProcedures(query: string): { category: ProcedureCategory; procedure: ProcedureItem }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const result: { category: ProcedureCategory; procedure: ProcedureItem }[] = [];
  for (const category of PROCEDURE_CATEGORIES) {
    for (const procedure of category.procedures) {
      if (category.name.toLowerCase().includes(q) || procedure.name.toLowerCase().includes(q) || procedure.key.toLowerCase().includes(q)) {
        result.push({ category, procedure });
      }
    }
  }
  return result;
}
