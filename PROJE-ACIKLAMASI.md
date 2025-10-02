# Estyi Platform - Proje Açıklaması

## Proje Özeti
Estyi, estetik tedavi arayan hastaları dünya çapındaki sertifikalı kliniklerle buluşturan yenilikçi bir platformdur. Platform, hastaların kimliklerini paylaşmadan fotoğraflarını yükleyerek fiyat teklifleri almalarını sağlar.

## Teknik Yapı

### Frontend (React + TypeScript + Vite)
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Context API
- **Routing**: React Router DOM 7.7.1
- **Form Management**: React Hook Form 7.61.1 + Zod 4.0.10
- **Icons**: Lucide React 0.525.0
- **Internationalization**: i18next 25.3.2 + react-i18next 15.6.1

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: Supabase (PostgreSQL)
- **Email Service**: Nodemailer 6.9.7
- **CORS**: cors 2.8.5

### Database (Supabase PostgreSQL)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage (for photos)

## Mevcut Özellikler

### 1. Kullanıcı Yönetimi
- **3 Kullanıcı Tipi**:
  - `user`: Değişim Arayan (Hasta)
  - `clinic`: Değişim Yaratan (Klinik)
  - `admin`: Sistem Yöneticisi

- **Kimlik Doğrulama**:
  - Email/şifre ile giriş
  - Email doğrulama sistemi
  - Mock kullanıcılar (test için)
  - Supabase Auth entegrasyonu

### 2. Çoklu Dil Desteği
- **Desteklenen Diller**: Türkçe, İngilizce, Arapça, İspanyolca, Fransızca
- **i18next** ile tam entegrasyon
- **Dinamik dil değiştirme**
- **Tüm UI metinleri çevrilmiş**

### 3. Tedavi Alanları (38 Farklı Kategori)
- **Facial**: Rinoplasti, Botoks, Dudak Dolgusu, Yüz Germe, vb.
- **Body**: Göğüs Cerrahisi, Liposuction, Karın Germe, vb.
- **Dental**: Diş İmplantı, Diş Beyazlatma
- **Hair**: Saç Ekimi, Sakal Ekimi, Saç Boyama
- **Genital**: Vajinal Estetik, Penis Estetiği
- **Spa**: Lüks Medikal Spa, El Tırnak İşlemleri

### 4. Hasta Paneli (Değişim Arayan)
- **Fiyat Talep Sistemi**:
  - Fotoğraf yükleme (5-10 adet)
  - Tedavi alanı seçimi
  - Ülke seçimi (10 ülke)
  - Yaş, cinsiyet, tedavi tarihi
  - Ek detaylar ve notlar

- **Teklif Yönetimi**:
  - Gelen teklifleri görüntüleme
  - Teklifleri kabul/reddetme
  - Klinik profillerini inceleme
  - Mesajlaşma sistemi

### 5. Klinik Paneli (Değişim Yaratan)
- **Klinik Profil Yönetimi**:
  - Temel bilgiler (ad, adres, telefon, website)
  - Uzmanlık alanları
  - Klinik fotoğrafları
  - Belgeler ve sertifikalar
  - Çok dilli açıklamalar

- **Talep Yönetimi**:
  - Gelen hasta taleplerini görüntüleme
  - Teklif gönderme sistemi
  - Fiyat aralığı belirleme
  - Süre ve hastanede kalış bilgisi
  - Ek hizmetler (otel, transfer, konsültasyon)

- **Üyelik Planları**:
  - **Temel Plan**: 50 hasta talebi/ay, temel analitik
  - **Professional Plan**: Sınırsız talep, gelişmiş analitik, video görüşmeler
  - **Enterprise Plan**: Özel hesap yöneticisi, API erişimi

### 6. Admin Paneli
- **Kullanıcı Yönetimi**: Tüm kullanıcıları görüntüleme ve yönetme
- **Klinik Yönetimi**: Klinik onayları ve yönetimi
- **Talep Yönetimi**: Tüm talepleri izleme
- **Mesaj Yönetimi**: Platform mesajlarını yönetme
- **Raporlar**: Detaylı analitik ve raporlar
- **Ayarlar**: Sistem ayarları
- **Değişiklik Kontrolü**: Versiyon yönetimi

### 7. Mesajlaşma Sistemi
- **Gerçek Zamanlı Mesajlaşma**
- **Çok Dilli Çeviri Desteği**
- **Dosya ve Fotoğraf Paylaşımı**
- **Okundu Bilgisi**
- **Bildirim Sistemi**

### 8. Güvenlik Özellikleri
- **Veri Şifreleme**: Tüm veriler SSL ile korunur
- **Row Level Security**: Supabase RLS politikaları
- **Fotoğraf Güvenliği**: Şifrelenmiş saklama
- **Klinik Doğrulama**: Lisans ve sertifika kontrolü

## Veritabanı Yapısı

### Ana Tablolar
1. **users**: Kullanıcı bilgileri ve rolleri
2. **clinics**: Klinik bilgileri ve durumları
3. **requests**: Hasta talepleri
4. **offers**: Klinik teklifleri
5. **messages**: Mesajlaşma sistemi
6. **verification_codes**: Email doğrulama kodları

### RLS Politikaları
- Kullanıcılar sadece kendi verilerini görebilir
- Klinikler sadece kendi tekliflerini yönetebilir
- Adminler tüm verilere erişebilir

## Çeviri Sistemi

### Mevcut Çeviriler
- **Türkçe**: Tam çeviri mevcut
- **İngilizce**: Eksik çeviriler var
- **Arapça, İspanyolca, Fransızca**: Kısmi çeviri

### Çeviri Dosyaları
- `src/locales/tr.json`: Türkçe çeviriler
- `src/i18n/i18n.ts`: i18next konfigürasyonu

## Eksik Özellikler ve Tamamlanması Gerekenler

### 1. Çeviri Sistemi
- **İngilizce çevirileri tamamlanmalı**
- **Eksik dil dosyaları oluşturulmalı**:
  - `src/locales/en.json`
  - `src/locales/ar.json`
  - `src/locales/es.json`
  - `src/locales/fr.json`

### 2. Backend API Geliştirmeleri
- **Eksik API endpoint'leri**:
  - Kullanıcı profil güncelleme
  - Fotoğraf yükleme
  - Talep oluşturma
  - Teklif gönderme
  - Mesajlaşma
  - Bildirim sistemi

### 3. Frontend Bileşenleri
- **Eksik sayfalar**:
  - Profil düzenleme sayfaları
  - Fotoğraf yükleme bileşenleri
  - Gerçek zamanlı mesajlaşma
  - Bildirim merkezi

### 4. Veritabanı Geliştirmeleri
- **Eksik tablolar**:
  - `user_profiles`: Detaylı kullanıcı profilleri
  - `clinic_profiles`: Klinik detay bilgileri
  - `notifications`: Bildirim sistemi
  - `appointments`: Randevu sistemi
  - `reviews`: Değerlendirme sistemi

### 5. Ödeme Sistemi
- **Stripe/PayPal entegrasyonu**
- **Üyelik planı ödemeleri**
- **Fatura sistemi**

### 6. Güvenlik Geliştirmeleri
- **Rate limiting**
- **Input validation**
- **File upload güvenliği**
- **API authentication**

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı
- SMTP email servisi

### Kurulum Adımları
1. **Dependencies yükleme**:
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Environment variables**:
   ```bash
   # .env dosyası oluştur
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

3. **Database kurulumu**:
   ```sql
   -- database_setup.sql dosyasını çalıştır
   ```

4. **Backend başlatma**:
   ```bash
   cd backend
   npm run dev
   ```

5. **Frontend başlatma**:
   ```bash
   npm run dev
   ```

## Deployment

### Frontend (Netlify/Vercel)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Supabase keys

### Backend (Railway/Heroku)
- **Start command**: `npm start`
- **Environment variables**: Database ve SMTP ayarları

## Test Kullanıcıları

### Admin Kullanıcıları
- `admin@estyi.com` / `admin123`
- `system@estyi.com` / `system123`

### Klinik Kullanıcıları
- `info@istanbulestetik.com` / `clinic123`
- `info@hairworld.com` / `clinic456`

### Normal Kullanıcılar
- `test@user.com` / `test123456`

## Önemli Notlar

### 1. Güvenlik
- Tüm API endpoint'leri authentication gerektirir
- Fotoğraflar şifrelenmiş olarak saklanır
- RLS politikaları aktif

### 2. Performans
- Lazy loading kullanılmalı
- Image optimization gerekli
- Database query'leri optimize edilmeli

### 3. SEO
- Meta tags eksik
- Sitemap oluşturulmalı
- Open Graph tags eklenmeli

### 4. Analytics
- Google Analytics entegrasyonu
- User behavior tracking
- Conversion tracking

## Sonraki Adımlar

1. **Çeviri sistemini tamamla**
2. **Eksik API endpoint'lerini geliştir**
3. **Frontend bileşenlerini tamamla**
4. **Test yazıları ekle**
5. **Performance optimizasyonu yap**
6. **Security audit yap**
7. **Production deployment**

## İletişim ve Destek

Proje hakkında sorularınız için:
- **Email**: [Proje sahibi email]
- **Documentation**: Bu dosya
- **Code Comments**: Kod içinde detaylı açıklamalar mevcut

---

**Not**: Bu proje, estetik sektöründe güvenli ve şeffaf bir platform oluşturmayı hedeflemektedir. Tüm geliştirmeler bu hedef doğrultusunda yapılmalıdır.

