#!/bin/bash

echo "========================================"
echo "   ESTYI PROJESI TAM DEPLOY SCRIPTI"
echo "========================================"
echo

echo "[1/6] Proje build ediliyor..."
npm run build
if [ $? -ne 0 ]; then
    echo "HATA: Build basarisiz!"
    exit 1
fi
echo "✅ Build tamamlandi!"

echo
echo "[2/6] ZIP dosyasi olusturuluyor..."
cd dist
zip -r ../estyi-build.zip .
cd ..
echo "✅ ZIP dosyasi hazir!"

echo
echo "[3/6] Backend baslatiliyor..."
cd backend
npm start &
cd ..
echo "✅ Backend baslatildi!"

echo
echo "========================================"
echo "   MANUEL ADIMLAR"
echo "========================================"
echo
echo "1. SUPABASE VERITABANI GUNCELLEMESI:"
echo "   - https://supabase.com/dashboard adresine gidin"
echo "   - Projenizi secin"
echo "   - SQL Editor -> New query"
echo "   - database-update.sql dosyasindaki kodu kopyalayip calistirin"
echo
echo "2. NETLIFY DEPLOY:"
echo "   - https://app.netlify.com adresine gidin"
echo "   - Estyi.com sitenizi bulun"
echo "   - Deploys -> Deploy manually"
echo "   - estyi-build.zip dosyasini surukleyip birakin"
echo
echo "3. RAILWAY BACKEND DEPLOY:"
echo "   - https://railway.app adresine gidin"
echo "   - Projenizi secin"
echo "   - Deploy edin"
echo
echo "========================================"
echo "   TEST BILGILERI"
echo "========================================"
echo
echo "Admin: admin@estyi.com / admin123"
echo "Klinik: info@istanbulestetik.com / clinic123"
echo "Kullanici: test@user.com / test123456"
echo
echo "Test URL: http://localhost:5173"
echo "Canli URL: https://estyi.com"
echo

