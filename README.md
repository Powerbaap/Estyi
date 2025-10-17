# Estyi Platform - Production Live

Güncelleme doğrulama: otomatik push testi
# 🏥 Estyi - Sağlık Hizmetleri Platformu

Estyi, hastalar ve klinikler arasında köprü kuran modern bir sağlık hizmetleri platformudur.

> CI/CD test notu: Netlify production deployu tetiklemek için bu dosyada küçük bir değişiklik yapıldı.

## ✨ Özellikler

- 👤 **Kullanıcı Yönetimi**: Güvenli kayıt ve giriş sistemi
- 🏥 **Klinik Yönetimi**: Klinik kayıt ve profil yönetimi
- 💬 **Mesajlaşma**: Gerçek zamanlı hasta-klinik iletişimi
- 📊 **Admin Paneli**: Kapsamlı yönetim araçları
- 🌐 **Çoklu Dil**: Türkçe dil desteği
- 📱 **Responsive**: Mobil uyumlu tasarım

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- PostgreSQL (veritabanı için)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/kullaniciadi/estyi.git
cd estyi
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
cd backend && npm install && cd ..
```

3. **Çevre değişkenlerini ayarlayın**
```bash
cp env.example .env
# .env dosyasını düzenleyin
```

4. **Veritabanını kurun**
```bash
# PostgreSQL'de database_setup.sql dosyasını çalıştırın
```

5. **Projeyi başlatın**
```bash
# Frontend
npm run dev

# Backend (ayrı terminal)
cd backend && npm start
```

## 🛠️ Geliştirme

### Branch Stratejisi
- `main`: Canlı sürüm
- `develop`: Geliştirme sürümü
- `feature/*`: Yeni özellikler
- `hotfix/*`: Acil düzeltmeler

### Commit Kuralları
```
feat: yeni özellik
fix: bug düzeltmesi
docs: dokümantasyon
style: kod formatı
refactor: kod yeniden düzenleme
test: test ekleme
chore: build işlemleri
```

## 📁 Proje Yapısı

```
estyi/
├── src/                    # Frontend kaynak kodları
│   ├── components/         # React bileşenleri
│   ├── pages/             # Sayfa bileşenleri
│   ├── contexts/          # React context'leri
│   ├── services/          # API servisleri
│   └── types/             # TypeScript tipleri
├── backend/               # Backend API
├── public/                # Statik dosyalar
└── docs/                  # Dokümantasyon
```

## 🚀 Deployment

Proje otomatik olarak GitHub Actions ile deploy edilir:

- **Main branch**: Production'a deploy
- **Develop branch**: Staging'e deploy

### GitHub Pages (Production)
- `main` dalına push edildiğinde çalışır (`.github/workflows/deploy.yml`).
- Gerekli Secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`.
- Vite, Pages için `base`'i workflow tarafından `.env` içine `VITE_BASE=/Estyi/` yazarak ayarlar.
- Artifact `dist/` klasöründen yüklenir ve Pages'a deploy edilir.

Doğrulama:
- Actions sekmesinde "Deploy to GitHub Pages" workflow'unu kontrol edin.
- `Deploy` job'ındaki `page_url` alanı üretim URL'sini verir.

### Netlify & Railway (Staging)
- `develop` dalına push edildiğinde çalışır (`.github/workflows/auto-deploy.yml`).
- Netlify Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.
- Railway Secret: `RAILWAY_TOKEN`.

### Sorun Giderme
- Build hata veriyorsa `.env` değerlerinin eksik olup olmadığını kontrol edin.
- Vite `base` yanlış ise, Pages üzerinde CSS/JS yolları 404 verebilir; `VITE_BASE` değerini repo adıyla eşleştirin.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Proje Sahibi: [Adınız]
- Email: [email@example.com]
- GitHub: [@kullaniciadi](https://github.com/kullaniciadi)

## 🙏 Teşekkürler

Bu projeye katkıda bulunan herkese teşekkürler!


