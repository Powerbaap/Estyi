BEGIN;

ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS request_id uuid,
  ADD COLUMN IF NOT EXISTS clinic_id uuid,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS price numeric,
  ADD COLUMN IF NOT EXISTS price_min numeric,
  ADD COLUMN IF NOT EXISTS price_max numeric,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'sent',
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS offers_request_clinic_country_city_source_idx
ON public.offers (request_id, clinic_id, country, city, source);

CREATE OR REPLACE FUNCTION public.city_matches(rule_cities text[], req_city text)
RETURNS boolean
LANGUAGE sql
AS $$
  SELECT
    CASE
      WHEN rule_cities IS NULL OR array_length(rule_cities, 1) = 0 THEN true
      WHEN req_city IS NULL THEN false
      ELSE lower(req_city) = ANY (
        SELECT lower(c) FROM unnest(rule_cities) AS c
      )
    END;
$$;

CREATE OR REPLACE FUNCTION public.auto_generate_offers_for_request()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_rule record;
  v_country text;
  v_req_cities text[];
  v_city text;
  v_price numeric;
BEGIN
  IF NEW.procedure_name IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.selected_countries IS NULL OR array_length(NEW.selected_countries, 1) = 0 THEN
    RETURN NEW;
  END IF;

  FOR v_rule IN
    SELECT *
    FROM public.clinic_price_rules
    WHERE is_active = true
      AND procedure_name = NEW.procedure_name
      AND country = ANY (NEW.selected_countries)
      AND (region IS NULL OR region = NEW.region)
      AND (sessions IS NULL OR sessions = NEW.sessions)
  LOOP
    v_country := v_rule.country;

    v_price := COALESCE(v_rule.price, v_rule.price_min);
    IF v_price IS NULL THEN
      CONTINUE;
    END IF;

    IF NEW.cities_by_country IS NOT NULL AND NEW.cities_by_country ? v_country THEN
      SELECT COALESCE(
        ARRAY(
          SELECT jsonb_array_elements_text(NEW.cities_by_country -> v_country)
        ),
        ARRAY[]::text[]
      )
      INTO v_req_cities;
    ELSE
      v_req_cities := ARRAY[]::text[];
    END IF;

    IF v_req_cities IS NULL OR array_length(v_req_cities, 1) = 0 THEN
      INSERT INTO public.offers (
        request_id,
        clinic_id,
        country,
        city,
        currency,
        price,
        price_min,
        price_max,
        status,
        source
      )
      VALUES (
        NEW.id,
        v_rule.clinic_id,
        v_country,
        NULL,
        COALESCE(v_rule.currency, 'TRY'),
        v_price,
        v_rule.price_min,
        v_rule.price_max,
        'sent',
        'auto'
      )
      ON CONFLICT (request_id, clinic_id, country, city, source) DO NOTHING;
    ELSE
      FOREACH v_city IN ARRAY v_req_cities
      LOOP
        IF city_matches(v_rule.cities, v_city) THEN
          INSERT INTO public.offers (
            request_id,
            clinic_id,
            country,
            city,
            currency,
            price,
            price_min,
            price_max,
            status,
            source
          )
          VALUES (
            NEW.id,
            v_rule.clinic_id,
            v_country,
            v_city,
            COALESCE(v_rule.currency, 'TRY'),
            v_price,
            v_rule.price_min,
            v_rule.price_max,
            'sent',
            'auto'
          )
          ON CONFLICT (request_id, clinic_id, country, city, source) DO NOTHING;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_generate_offers_on_request_insert ON public.requests;

CREATE TRIGGER auto_generate_offers_on_request_insert
AFTER INSERT ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_offers_for_request();

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY offers_select_own_requests
ON public.offers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.requests r
    WHERE r.id = offers.request_id
      AND r.user_id = auth.uid()
  )
);

CREATE POLICY offers_insert_block_auth
ON public.offers
FOR INSERT
TO authenticated
WITH CHECK (false);

COMMIT;

