-- Supabase RLS politikaları: kullanıcının ve taleplerin kalıcı olarak yazılıp okunabilmesi için

-- USERS tablosu: kullanıcılar kendi profillerini görebilsin/oluşturabilsin/güncelleyebilsin
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Adminlar: tüm kullanıcıları görüntüleyebilir
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- REQUESTS tablosu: kullanıcılar kendi taleplerini görebilsin/oluşturabilsin/güncelleyebilsin
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Adminlar: tüm talepleri görüntüleyebilir
CREATE POLICY "Admins can view all requests" ON requests
  FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- (Opsiyonel) CLINICS tablosu: klinikler kendi profilini yönetebilsin
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinics can view own profile" ON clinics
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Clinics can insert own profile" ON clinics
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Clinics can update own profile" ON clinics
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Adminlar için klinik yönetimi (JWT içinde role=admin olduğunda)
CREATE POLICY "Admins can view clinics" ON clinics
  FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert clinics" ON clinics
  FOR INSERT
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update clinics" ON clinics
  FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- (Opsiyonel) OFFERS tablosu: klinikler kendi tekliflerini görsün ve kullanıcılar kendi taleplerine gelen teklifleri görebilsin
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinics can view & insert own offers" ON offers
  FOR SELECT USING (auth.uid() = clinic_id)
  WITH CHECK (auth.uid() = clinic_id);

CREATE POLICY "Users can view offers on own requests" ON offers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = offers.request_id AND r.user_id = auth.uid()
    )
  );

-- CLINIC APPLICATIONS tablosu: herkes başvuru oluşturabilsin, admin görebilsin ve yönetsin
ALTER TABLE clinic_applications ENABLE ROW LEVEL SECURITY;

-- Public insert: herkese açık formdan başvuru yapılabilsin
CREATE POLICY "Anyone can insert clinic applications" ON clinic_applications
  FOR INSERT
  WITH CHECK (true);

-- Admin görüntüleme
CREATE POLICY "Admins can view clinic applications" ON clinic_applications
  FOR SELECT
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admin güncelleme
CREATE POLICY "Admins can update clinic applications" ON clinic_applications
  FOR UPDATE
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');