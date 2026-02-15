-- Clean up existing tables (be careful, this will delete data)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS offer_snapshots CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS clinic_price_list CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS clinic_applications CASCADE;
DROP TABLE IF EXISTS clinics CASCADE;
DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table (Sync with Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'clinic', 'admin')) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clinics table
CREATE TABLE clinics (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  location TEXT, -- format: "Country/City"
  status TEXT CHECK (status IN ('active', 'pending', 'rejected')) DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  countries TEXT[] DEFAULT '{}',
  cities_by_country JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Clinic Applications
CREATE TABLE clinic_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  country TEXT,
  city TEXT,
  countries TEXT[] DEFAULT '{}',
  cities_by_country JSONB DEFAULT '{}'::jsonb,
  specialties TEXT[] DEFAULT '{}',
  description TEXT,
  certificate_urls TEXT[] DEFAULT '{}',
  certificate_files JSONB DEFAULT '[]'::jsonb,
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  submitted_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Clinic Price List (Static offers pool)
CREATE TABLE clinic_price_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  procedure_key TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  duration TEXT, -- e.g., "3 days"
  guarantee TEXT, -- e.g., "1 year"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Requests table
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  procedure_key TEXT NOT NULL,
  description TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'expired', 'completed', 'cancelled')) DEFAULT 'active',
  country TEXT,
  city TEXT,
  countries TEXT[] DEFAULT '{}',
  cities_tr TEXT[] DEFAULT '{}',
  cities_by_country JSONB DEFAULT '{}'::jsonb,
  params JSONB DEFAULT '{}'::jsonb,
  age INTEGER,
  gender TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_requests_expires_at ON requests(expires_at);

-- 6. Offer Snapshots (Immutable record of accepted offer)
CREATE TABLE offer_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  duration TEXT,
  guarantee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Conversations
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_snapshot_id UUID REFERENCES offer_snapshots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS & Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_price_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 1. Users Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 2. Clinics Policies
CREATE POLICY "Clinics are viewable by everyone" ON clinics FOR SELECT USING (true);
CREATE POLICY "Clinics can update their own data" ON clinics FOR UPDATE USING (auth.uid() = id);

-- 3. Clinic Price List Policies
CREATE POLICY "Price list is viewable by everyone" ON clinic_price_list FOR SELECT USING (true);
CREATE POLICY "Clinics can manage their own price list" ON clinic_price_list FOR ALL USING (auth.uid() = clinic_id);

-- 4. Requests Policies
CREATE POLICY "Users can manage their own requests" ON requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Clinics can view matching requests" ON requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM clinics c
    WHERE c.id = auth.uid()
    AND c.status = 'active'
    AND (
      c.specialties IS NULL
      OR array_length(c.specialties, 1) IS NULL
      OR requests.procedure_key = ANY(c.specialties)
    )
    AND (
      (
        requests.countries IS NOT NULL
        AND array_length(requests.countries, 1) > 0
        AND split_part(c.location, '/', 1) = ANY(requests.countries)
      )
      OR (
        requests.country IS NOT NULL
        AND split_part(c.location, '/', 1) = requests.country
      )
    )
    AND (
      requests.cities_tr IS NULL
      OR array_length(requests.cities_tr, 1) = 0
      OR (
        split_part(c.location, '/', 1) = 'turkey'
        AND split_part(c.location, '/', 2) <> ''
        AND requests.cities_tr @> ARRAY[split_part(c.location, '/', 2)]
      )
    )
    AND (
      requests.cities_by_country IS NULL
      OR NOT (requests.cities_by_country ? split_part(c.location, '/', 1))
      OR (
        split_part(c.location, '/', 2) <> ''
        AND (requests.cities_by_country -> split_part(c.location, '/', 1)) ? split_part(c.location, '/', 2)
      )
    )
  )
);

-- 5. Offer Snapshots Policies
CREATE POLICY "Participants can view offer snapshots" ON offer_snapshots FOR SELECT USING (
  auth.uid() = clinic_id OR 
  EXISTS (SELECT 1 FROM requests r WHERE r.id = request_id AND r.user_id = auth.uid())
);

-- 6. Conversations Policies
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (auth.uid() = user_id OR auth.uid() = clinic_id);

-- 7. Messages Policies
CREATE POLICY "Participants can manage messages" ON messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = conversation_id
    AND (c.user_id = auth.uid() OR c.clinic_id = auth.uid())
  )
);

-- Account Linking Trigger (Upsert into public.users on auth.users change)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
