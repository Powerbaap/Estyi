# Estyi Platform - Temiz Çekirdek

Bu proje, Estyi platformunun güncel ve temizlenmiş çalışma sürümüdür. Eski platform bağımlılıkları (Netlify, Railway, Vercel) ve artık dosyalar temizlenmiştir.

## 🚀 Başlangıç

### 1. Gereksinimler
- Node.js (v18+)
- npm

### 2. Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Backend bağımlılıklarını yükle
cd backend
npm install
```

### 3. Yapılandırma
`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli anahtarları doldurun:
- **Frontend**: Kök dizindeki `.env`
- **Backend**: `backend/.env`

### 4. Çalıştırma
```bash
# Frontend (Vite)
npm run dev

# Backend (Express)
cd backend
npm run dev
```

## 🛠️ Proje Yapısı
- `src/`: React + Vite + Tailwind frontend uygulaması.
- `backend/`: Node.js + Express API sunucusu.
- `public/`: Statik varlıklar.

## 📦 Dağıtım (Deploy)
Proje "temiz çekirdek" halindedir ve herhangi bir Node.js destekli platforma (Docker, VPS, PaaS) dağıtılabilir. Standart build komutu:
```bash
npm run build
```

---
*Yedeklenen eski dosyalar `cleanup_backup_20260213/` klasöründe bulunmaktadır.*


