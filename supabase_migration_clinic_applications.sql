-- Supabase Migration: clinic_applications table, RLS policies, indexes, trigger (idempotent)
-- Run this in Supabase Dashboard > SQL

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table
CREATE TABLE IF NOT EXISTS public.clinic_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name TEXT NOT NULL,
  country TEXT,
  specialties TEXT[] DEFAULT '{}',
  website TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  description TEXT,
  certificate_urls TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  submitted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.clinic_applications ENABLE ROW LEVEL SECURITY;

-- Policies (created only if missing)
DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'clinic_applications' AND policyname = 'Anyone can insert clinic applications'
) THEN
  CREATE POLICY "Anyone can insert clinic applications" ON public.clinic_applications
    FOR INSERT
    WITH CHECK (true);
END IF;
END $$;

DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'clinic_applications' AND policyname = 'Admins can view clinic applications'
) THEN
  CREATE POLICY "Admins can view clinic applications" ON public.clinic_applications
    FOR SELECT
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
END IF;
END $$;

DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'clinic_applications' AND policyname = 'Admins can update clinic applications'
) THEN
  CREATE POLICY "Admins can update clinic applications" ON public.clinic_applications
    FOR UPDATE
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
END IF;
END $$;

-- Optional: allow applicants to view their own submissions
DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'clinic_applications' AND policyname = 'Applicants can view own applications'
) THEN
  CREATE POLICY "Applicants can view own applications" ON public.clinic_applications
    FOR SELECT
    USING (submitted_by = auth.uid());
END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clinic_applications_status ON public.clinic_applications(status);
CREATE INDEX IF NOT EXISTS idx_clinic_applications_created_at ON public.clinic_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_clinic_applications_email ON public.clinic_applications(email);

-- updated_at trigger (function defined if missing, then trigger created if missing)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
IF NOT EXISTS (
  SELECT 1 FROM pg_trigger WHERE tgname = 'update_clinic_applications_updated_at'
) THEN
  CREATE TRIGGER update_clinic_applications_updated_at
  BEFORE UPDATE ON public.clinic_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END IF;
END $$;

-- Metadata
COMMENT ON TABLE public.clinic_applications IS 'Clinic onboarding applications';