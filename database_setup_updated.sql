-- Users tablosu (güncellenmiş)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(8) UNIQUE NOT NULL, -- 8 haneli rastgele ID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'clinic', 'admin')) DEFAULT 'user',
  password TEXT, -- bcrypt ile hashlenmiş
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification codes tablosu
CREATE TABLE verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT, -- Email adresi (opsiyonel, user_id ile birlikte kullanılabilir)
  code VARCHAR(6) NOT NULL, -- 6 haneli doğrulama kodu
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics tablosu
CREATE TABLE clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  location TEXT,
  status TEXT CHECK (status IN ('active', 'pending', 'rejected')) DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requests tablosu
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  procedure TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'closed', 'completed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offers tablosu
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages tablosu
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id UUID NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'clinic')) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcısı oluştur
INSERT INTO users (id, user_id, email, name, role, is_verified) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'A1234567',
  'admin@estyi.com',
  'Admin User',
  'admin',
  TRUE
);

-- Örnek klinik kullanıcısı
INSERT INTO users (id, user_id, email, name, role, is_verified) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'C8765432',
  'info@istanbulestetik.com',
  'İstanbul Estetik Merkezi',
  'clinic',
  TRUE
);

INSERT INTO clinics (id, name, email, status, specialties) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'İstanbul Estetik Merkezi',
  'info@istanbulestetik.com',
  'active',
  ARRAY['Rhinoplasty', 'Hair Transplant']
); 