# 🚀 OTOMATIK DEPLOY SİSTEMİ KURULUMU

## ⚡ TEK KOMUTLA HER ŞEY GÜNCELLENİR!

Artık her değişiklikte sadece **1 komut** çalıştıracaksınız:

```bash
npm run deploy
```

## 🔧 KURULUM ADIMLARI

### 1. **Git Kurulumu (Eğer yoksa)**
- https://git-scm.com/downloads adresinden Git'i indirin
- Kurulumu tamamlayın

### 2. **GitHub Repository Oluşturun**
```bash
# Projenizi GitHub'a yükleyin
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/estyi.git
git push -u origin main
```

### 3. **Netlify CLI Kurulumu**
```bash
npm install -g netlify-cli
netlify login
```

### 4. **Railway CLI Kurulumu**
```bash
npm install -g @railway/cli
railway login
```

### 5. **GitHub Secrets Ayarlayın**
GitHub Repository → Settings → Secrets and variables → Actions:

- `NETLIFY_AUTH_TOKEN`: Netlify'den alın
- `NETLIFY_SITE_ID`: Netlify'den alın  
- `RAILWAY_TOKEN`: Railway'den alın

## 🎯 KULLANIM

### **Günlük Kullanım:**
```bash
# Her değişiklikten sonra sadece bu komutu çalıştırın
npm run deploy
```

### **Hızlı Deploy (Sadece Frontend):**
```bash
npm run deploy:quick
```

### **Manuel Deploy:**
```bash
npm run deploy:full
```

## 🔄 OTOMATIK SÜREÇ

Komut çalıştırdığınızda otomatik olarak:

1. ✅ **Git durumu kontrol edilir**
2. ✅ **Değişiklikler commit edilir**
3. ✅ **GitHub'a push edilir**
4. ✅ **Proje build edilir**
5. ✅ **ZIP dosyası oluşturulur**
6. ✅ **Backend güncellenir**
7. ✅ **Netlify'a deploy edilir**
8. ✅ **Railway'a deploy edilir**

## 🌐 SONUÇ

- **Frontend:** https://estyi.com (otomatik güncellenir)
- **Backend:** Railway'de (otomatik güncellenir)
- **Database:** Supabase'de (otomatik güncellenir)

## 🆘 SORUN GİDERME

### Git hatası:
```bash
git config --global user.name "Adınız"
git config --global user.email "email@example.com"
```

### Netlify hatası:
```bash
netlify logout
netlify login
```

### Railway hatası:
```bash
railway logout
railway login
```

## ✨ AVANTAJLAR

- 🚀 **Tek komut** ile her şey güncellenir
- 🔄 **Otomatik** GitHub, Netlify, Railway entegrasyonu
- 📱 **Mobil uyumlu** deployment
- 🛡️ **Güvenli** ve **hızlı** süreç
- 📊 **Detaylı** log çıktıları

## 🎉 TAMAMLANDI!

Artık her değişiklikte sadece `npm run deploy` yazıp Enter'a basmanız yeterli! 🚀









