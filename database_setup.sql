-- Users tablosu
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'clinic', 'admin')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- RLS (Row Level Security) Politikaları
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users tablosu için RLS politikaları
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Clinics tablosu için RLS politikaları
CREATE POLICY "Clinics can view their own profile" ON clinics
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clinics can update their own profile" ON clinics
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Clinics can insert their own profile" ON clinics
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Requests tablosu için RLS politikaları
CREATE POLICY "Users can view their own requests" ON requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Offers tablosu için RLS politikaları
CREATE POLICY "Users can view offers for their requests" ON offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = offers.request_id 
      AND requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinics can view offers they made" ON offers
  FOR SELECT USING (auth.uid() = clinic_id);

CREATE POLICY "Clinics can insert offers" ON offers
  FOR INSERT WITH CHECK (auth.uid() = clinic_id);

CREATE POLICY "Users can update offers for their requests" ON offers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE requests.id = offers.request_id 
      AND requests.user_id = auth.uid()
    )
  );

-- Messages tablosu için RLS politikaları
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    conversation_id LIKE '%' || auth.uid()::text || '%'
  );

CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Admin kullanıcısı oluştur
INSERT INTO users (id, email, name, role) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@estyi.com',
  'Admin User',
  'admin'
);

-- Örnek klinik kullanıcısı
INSERT INTO users (id, email, name, role) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'info@istanbulestetik.com',
  'İstanbul Estetik Merkezi',
  'clinic'
);

INSERT INTO clinics (id, name, email, status, specialties) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'İstanbul Estetik Merkezi',
  'info@istanbulestetik.com',
  'active',
  ARRAY['Rhinoplasty', 'Hair Transplant']
); 