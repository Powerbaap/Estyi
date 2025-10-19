-- Add password column to clinic_applications if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'clinic_applications'
      AND column_name = 'password'
  ) THEN
    ALTER TABLE public.clinic_applications
      ADD COLUMN password text;
  END IF;
END $$;

-- Optional: ensure email column exists and is not null
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'clinic_applications'
      AND column_name = 'email'
  ) THEN
    ALTER TABLE public.clinic_applications
      ADD COLUMN email text;
  END IF;
END $$;

-- Optional: add index to speed up lookups by email
CREATE INDEX IF NOT EXISTS idx_clinic_applications_email ON public.clinic_applications (email);