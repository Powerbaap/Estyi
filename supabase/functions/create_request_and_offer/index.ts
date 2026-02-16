import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- ENV (sakın URL/key hardcode etme) ----
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Admin client (service role) -> DB insert/upsert buradan
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---- CORS ----
// FRONTEND_URL tek origin olarak kullanılacak (prod). Local dev de desteklenir.
const FRONTEND_URL = (Deno.env.get("FRONTEND_URL") || "https://estyi.com").trim();

const allowedOrigins = new Set<string>([
  FRONTEND_URL,
  "https://estyi.com",
  "http://localhost:5173",
  "http://localhost:3000",
]);

function corsHeaders(origin: string | null) {
  const useOrigin =
    origin && allowedOrigins.has(origin) ? origin : FRONTEND_URL || "https://estyi.com";

  return {
    "Access-Control-Allow-Origin": useOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

function json(body: unknown, init: ResponseInit = {}, origin: string | null = null) {
  const headers = {
    "Content-Type": "application/json",
    ...corsHeaders(origin),
    ...(init.headers ?? {}),
  };
  return new Response(JSON.stringify(body), { ...init, headers });
}

function norm(s: string) {
  return (s ?? "").trim().toLowerCase();
}

function cityMatches(ruleCities: unknown, reqCity: string) {
  const list = Array.isArray(ruleCities) ? ruleCities : [];
  if (list.length === 0) return true;
  return list.some((c) => norm(String(c)) === norm(reqCity));
}

// ---- Types ----
type Payload = {
  procedure_name: string;
  procedure_category?: string | null;
  region?: string | null;
  sessions?: number | null;

  selected_countries: string[];
  cities_by_country?: Record<string, string[]>;

  gender?: string | null;
  notes?: string | null;
};

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  // 1) Preflight: CORS hatasının ana sebebi buydu -> her zaman 200 dön
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders(origin) });
  }

  // 2) Sadece POST
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 }, origin);
  }

  try {
    // 3) Auth zorunlu (client invoke otomatik Authorization gönderir)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization" }, { status: 401 }, origin);
    }

    // 4) user doğrula (anon key + Authorization ile)
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ error: "Unauthorized" }, { status: 401 }, origin);
    }
    const userId = userData.user.id;

    // 5) Body parse + minimal validation
    let body: Payload;
    try {
      body = (await req.json()) as Payload;
    } catch {
      return json({ error: "Invalid JSON" }, { status: 400 }, origin);
    }

    if (!body?.procedure_name || typeof body.procedure_name !== "string") {
      return json({ error: "procedure_name required" }, { status: 400 }, origin);
    }
    if (!Array.isArray(body.selected_countries) || body.selected_countries.length === 0) {
      return json({ error: "selected_countries required" }, { status: 400 }, origin);
    }

    const selectedCountries = body.selected_countries.map((c) => String(c));
    const citiesByCountry: Record<string, string[]> =
      body.cities_by_country && typeof body.cities_by_country === "object"
        ? body.cities_by_country
        : {};

    // 6) requests insert (SADECE mevcut kolonlar)
    const requestInsert = {
      user_id: userId,
      procedure_name: body.procedure_name,
      procedure_category: body.procedure_category ?? null,
      region: body.region ?? null,
      sessions: typeof body.sessions === "number" ? body.sessions : null,
      selected_countries: selectedCountries,
      cities_by_country: citiesByCountry,
      gender: body.gender ?? null,
      notes: body.notes ?? null,
      status: "open",
    };

    const { data: requestRow, error: reqErr } = await admin
      .from("requests")
      .insert(requestInsert)
      .select("*")
      .single();

    if (reqErr) {
      return json(
        { error: reqErr.message, details: reqErr.details, hint: reqErr.hint },
        { status: 400 },
        origin
      );
    }

    const requestId = requestRow.id as string;

    // 7) clinic_price_rules -> offers üret (TEK FİYAT)
    // Not: tek fiyat için rule.price varsa onu, yoksa rule.price_min'i kullanıyoruz.
    const { data: rules, error: rulesErr } = await admin
      .from("clinic_price_rules")
      .select("*")
      .eq("is_active", true)
      .eq("procedure_name", body.procedure_name)
      .in("country", selectedCountries);

    if (rulesErr) {
      // request oluştu ama offers üretilemedi -> yine 200 dön, UI bozulmasın
      return json(
        { request: requestRow, offers: [], offers_error: rulesErr.message },
        { status: 200 },
        origin
      );
    }

    const offersToUpsert: any[] = [];
    for (const rule of rules ?? []) {
      // region match (kuralda region varsa, body region ile aynı olmalı)
      if (rule.region && !body.region) continue;
      if (rule.region && body.region && norm(String(rule.region)) !== norm(String(body.region)))
        continue;

      // sessions match (kuralda sessions varsa)
      if (rule.sessions && (body.sessions === null || body.sessions === undefined)) continue;
      if (
        rule.sessions &&
        body.sessions &&
        Number(rule.sessions) !== Number(body.sessions)
      )
        continue;

      const country = String(rule.country);
      const reqCities = Array.isArray(citiesByCountry[country])
        ? citiesByCountry[country]
        : [];

      const price =
        typeof rule.price === "number"
          ? rule.price
          : typeof rule.price_min === "number"
          ? rule.price_min
          : null;

      if (!reqCities || reqCities.length === 0) {
        offersToUpsert.push({
          request_id: requestId,
          clinic_id: rule.clinic_id,
          source: "auto",
          country,
          city: null,
          currency: rule.currency,
          price,
          price_min: rule.price_min ?? null,
          price_max: rule.price_max ?? null,
          status: "sent",
          note: null,
        });
        continue;
      }

      for (const city of reqCities) {
        if (!cityMatches(rule.cities, city)) continue;

        offersToUpsert.push({
          request_id: requestId,
          clinic_id: rule.clinic_id,
          source: "auto",
          country,
          city,
          currency: rule.currency,
          price,
          price_min: rule.price_min ?? null,
          price_max: rule.price_max ?? null,
          status: "sent",
          note: null,
        });
      }
    }

    if (offersToUpsert.length > 0) {
      const { error: upErr } = await admin
        .from("offers")
        .upsert(offersToUpsert, {
          onConflict: "request_id,clinic_id,country,city,source",
        });

      if (upErr) {
        return json(
          { request: requestRow, offers: [], offers_error: upErr.message },
          { status: 200 },
          origin
        );
      }
    }

    const { data: offers, error: offersErr } = await admin
      .from("offers")
      .select("*")
      .eq("request_id", requestId);

    if (offersErr) {
      return json(
        { request: requestRow, offers: [], offers_error: offersErr.message },
        { status: 200 },
        origin
      );
    }

    return json(
      { request: requestRow, offers: offers ?? [] },
      { status: 200 },
      origin
    );
  } catch (e: any) {
    return json(
      { error: e?.message || "Unknown error", details: e?.stack ?? null },
      { status: 500 },
      origin
    );
  }
});
