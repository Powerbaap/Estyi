# 🚀 ESTYI PROJESI TAM DEPLOY REHBERI

## ⚡ HIZLI BAŞLATMA

### Windows için:
```bash
deploy-all.bat
```

### Mac/Linux için:
```bash
chmod +x deploy-all.sh
./deploy-all.sh
```

## 📋 ADIM ADIM DEPLOY

### 1. 🏗️ PROJE BUILD
```bash
npm run build
```
✅ Proje build edildi ve `dist` klasörü oluşturuldu

### 2. 📦 ZIP HAZIRLAMA
```bash
# Windows
cd dist
powershell -command "Compress-Archive -Path * -DestinationPath ../estyi-build.zip -Force"

# Mac/Linux
cd dist
zip -r ../estyi-build.zip .
```
✅ `estyi-build.zip` dosyası hazır

### 3. 🗄️ SUPABASE VERİTABANI GÜNCELLEMESİ
1. https://supabase.com/dashboard → Projenizi seçin
2. **SQL Editor** → **New query**
3. `database-update.sql` dosyasındaki kodu kopyalayıp çalıştırın
4. ✅ Veritabanı güncellendi

### 4. 🌐 NETLIFY FRONTEND DEPLOY
1. https://app.netlify.com → Estyi.com sitenizi bulun
2. **Deploys** → **Deploy manually**
3. `estyi-build.zip` dosyasını sürükleyip bırakın
4. ✅ Frontend canlıya alındı

### 5. ⚙️ RAILWAY BACKEND DEPLOY
1. https://railway.app → Projenizi seçin
2. **Deploy** butonuna tıklayın
3. ✅ Backend canlıya alındı

## 🔑 GİRİŞ BİLGİLERİ

### Admin Kullanıcıları:
- **Email:** `admin@estyi.com` | **Şifre:** `admin123`
- **Email:** `system@estyi.com` | **Şifre:** `system123`

### Klinik Kullanıcıları:
- **Email:** `info@istanbulestetik.com` | **Şifre:** `clinic123`
- **Email:** `info@hairworld.com` | **Şifre:** `clinic456`

### Normal Kullanıcı:
- **Email:** `test@user.com` | **Şifre:** `test123456`

## 🌐 URL'LER

- **Test:** http://localhost:5173
- **Canlı:** https://estyi.com

## ⚠️ ÖNEMLİ NOTLAR

1. **Environment Variables:** Backend'de `.env` dosyası oluşturmayı unutmayın
2. **Email Servisi:** Gmail App Password gerekli
3. **Supabase Service Key:** Backend için gerekli

## 🆘 SORUN GİDERME

### Build hatası:
```bash
npm install
npm run build
```

### Backend hatası:
```bash
cd backend
npm install
npm start
```

### Veritabanı hatası:
- Supabase Dashboard'da SQL Editor'ı kontrol edin
- `database-update.sql` dosyasını tekrar çalıştırın

## ✅ BAŞARI KONTROLÜ

1. ✅ Frontend build edildi
2. ✅ ZIP dosyası oluşturuldu
3. ✅ Supabase veritabanı güncellendi
4. ✅ Netlify'a yüklendi
5. ✅ Railway'a yüklendi
6. ✅ Test kullanıcıları ile giriş yapılabiliyor

**🎉 Projeniz tamamen canlıya alındı!**

