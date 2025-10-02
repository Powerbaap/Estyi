-- Veritabanı güncelleme scripti
-- Bu scripti Supabase SQL Editor'da çalıştırın

-- 1. Users tablosuna eksik alanları ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(8) UNIQUE,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password TEXT;

-- 2. Verification codes tablosunu oluştur
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS politikalarını etkinleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 4. Verification codes için RLS politikaları
CREATE POLICY IF NOT EXISTS "Users can view their own verification codes" 
ON verification_codes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own verification codes" 
ON verification_codes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own verification codes" 
ON verification_codes FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Users tablosu için RLS politikaları
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- 6. Admin kullanıcısı oluştur (eğer yoksa)
INSERT INTO users (id, user_id, email, name, role, is_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'A1234567',
  'admin@estyi.com',
  'Admin User',
  'admin',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 7. Örnek klinik kullanıcısı (eğer yoksa)
INSERT INTO users (id, user_id, email, name, role, is_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'C8765432',
  'info@istanbulestetik.com',
  'İstanbul Estetik Merkezi',
  'clinic',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 8. Clinics tablosuna örnek veri (eğer yoksa)
INSERT INTO clinics (id, name, email, status, specialties) 
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'İstanbul Estetik Merkezi',
  'info@istanbulestetik.com',
  'active',
  ARRAY['Rhinoplasty', 'Hair Transplant']
) ON CONFLICT (id) DO NOTHING;

-- 9. Index'ler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);

-- 10. Eski verification codes'ları temizle (24 saatten eski)
DELETE FROM verification_codes 
WHERE expires_at < NOW() - INTERVAL '24 hours';

-- Başarı mesajı
SELECT 'Database updated successfully! Email verification system is ready.' as message;
