# Estyi Projesi Test ve Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. Backend Kurulumu
```bash
cd backend
npm install
cp ../env.example .env
# .env dosyasını düzenleyin - SMTP ve Supabase bilgilerini ekleyin
npm start
```

### 2. Frontend Kurulumu
```bash
# Ana dizinde
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### 3. Veritabanı Kurulumu
Supabase Dashboard'da `database_setup_updated.sql` dosyasını çalıştırın.

## 🔧 Environment Değişkenleri

### Backend (.env)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SUPABASE_URL=https://haiafkuaamkxudvvhucv.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
```

### Frontend (.env)
```
VITE_SUPABASE_URL=https://haiafkuaamkxudvvhucv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

## ✅ Test Edilen Özellikler

- [x] Kullanıcı kayıt sistemi
- [x] Email doğrulama sistemi
- [x] Backend-Frontend entegrasyonu
- [x] Supabase veritabanı bağlantısı
- [x] Email gönderme servisi

## 🐛 Bilinen Sorunlar

- Email servisi için Gmail App Password gerekli
- Supabase Service Key backend için gerekli

## 📝 Sonraki Adımlar

1. Gmail SMTP ayarlarını yapın
2. Supabase Service Key'i alın
3. Test kullanıcısı ile kayıt olun
4. Email doğrulama akışını test edin
