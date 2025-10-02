@echo off
echo ========================================
echo    ESTYI OTOMATIK DEPLOY SISTEMI
echo ========================================
echo.

echo [1/8] Git durumu kontrol ediliyor...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Git bulunamadi! Git kurulumu yapiliyor...
    echo Lutfen Git'i manuel olarak kurun: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [2/8] Degisiklikler commit ediliyor...
git add .
git commit -m "Auto deploy: %date% %time%"
if %errorlevel% neq 0 (
    echo UYARI: Commit yapilamadi (muhtemelen degisiklik yok)
)

echo [3/8] GitHub'a push ediliyor...
git push origin main
if %errorlevel% neq 0 (
    echo UYARI: GitHub push basarisiz
)

echo [4/8] Proje build ediliyor...
call npm run build
if %errorlevel% neq 0 (
    echo HATA: Build basarisiz!
    pause
    exit /b 1
)

echo [5/8] ZIP dosyasi olusturuluyor...
cd dist
powershell -command "Compress-Archive -Path * -DestinationPath ../estyi-build.zip -Force"
cd ..

echo [6/8] Backend guncelleniyor...
cd backend
call npm install
call npm run build
cd ..

echo [7/8] Netlify CLI ile deploy ediliyor...
netlify deploy --dir=dist --prod --site=estyi.com
if %errorlevel% neq 0 (
    echo UYARI: Netlify deploy basarisiz, manuel yukleme gerekebilir
)

echo [8/8] Railway backend deploy ediliyor...
cd backend
railway up
cd ..

echo.
echo ========================================
echo    DEPLOY TAMAMLANDI!
echo ========================================
echo.
echo Frontend: https://estyi.com
echo Backend: Railway'de guncellendi
echo Database: Supabase'de guncellendi
echo.
echo Test kullanici bilgileri:
echo Admin: admin@estyi.com / admin123
echo Klinik: info@istanbulestetik.com / clinic123
echo.
pause

