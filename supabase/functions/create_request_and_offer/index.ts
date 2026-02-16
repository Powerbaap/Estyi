import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

type Payload = {
  procedure_name: string;
  procedure_category?: string | null;
  region?: string | null;
  sessions?: number | null;
  selected_countries: string[];
  cities_by_country: Record<string, string[]>;
  gender?: string | null;
  notes?: string | null;
};

const allowedOrigins = new Set([
  "https://estyi.com",
  "http://localhost:5173",
  "http://localhost:3000",
]);

const norm = (s: string) => (s ?? "").trim().toLowerCase();

function getCorsHeaders(origin: string | null) {
  const fallbackOrigin = "https://estyi.com";
  const useOrigin =
    origin && allowedOrigins.has(origin) ? origin : fallbackOrigin;

  return {
    "Access-Control-Allow-Origin": useOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

function cityMatches(ruleCities: string[], reqCity: string) {
  if (!ruleCities || ruleCities.length === 0) return true;
  return ruleCities.some((c) => norm(c) === norm(reqCity));
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  const jsonResponse = (body: unknown, init?: ResponseInit) => {
    const baseHeaders = {
      "Content-Type": "application/json",
      ...corsHeaders,
    };

    if (init?.headers) {
      return new Response(JSON.stringify(body), {
        ...init,
        headers: { ...baseHeaders, ...init.headers },
      });
    }

    return new Response(JSON.stringify(body), {
      ...init,
      headers: baseHeaders,
    });
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization" }, { status: 401 });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;
    const body = (await req.json()) as Payload;

    if (
      !body?.procedure_name ||
      !Array.isArray(body.selected_countries) ||
      body.selected_countries.length === 0
    ) {
      return jsonResponse({ error: "Invalid payload" }, { status: 400 });
    }

    const requestInsert = {
      user_id: userId,
      procedure_name: body.procedure_name,
      procedure_category: body.procedure_category ?? null,
      region: body.region ?? null,
      sessions: body.sessions ?? null,
      selected_countries: body.selected_countries,
      cities_by_country: body.cities_by_country ?? {},
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
      return jsonResponse(
        {
          error: reqErr.message,
          details: reqErr.details,
          hint: reqErr.hint,
        },
        { status: 400 }
      );
    }

    const requestId = requestRow.id as string;

    const { data: rules, error: rulesErr } = await admin
      .from("clinic_price_rules")
      .select("*")
      .eq("is_active", true)
      .eq("procedure_name", body.procedure_name)
      .in("country", body.selected_countries);

    if (rulesErr) {
      return jsonResponse(
        {
          request: requestRow,
          offers: [],
          offers_error: rulesErr.message,
        },
        { status: 200 }
      );
    }

    const citiesByCountry = body.cities_by_country ?? {};
    const offersToUpsert: any[] = [];

    for (const rule of rules ?? []) {
      if (rule.region && !body.region) continue;
      if (rule.region && body.region && norm(rule.region) !== norm(body.region))
        continue;

      if (rule.sessions && (body.sessions === null || body.sessions === undefined))
        continue;
      if (
        rule.sessions &&
        body.sessions &&
        Number(rule.sessions) !== Number(body.sessions)
      )
        continue;

      const country = rule.country as string;
      const reqCities = Array.isArray(citiesByCountry[country])
        ? citiesByCountry[country]
        : [];

      const basePrice =
        rule.price ??
        (typeof rule.price_min === "number" ? rule.price_min : null);

      if (!reqCities || reqCities.length === 0) {
        offersToUpsert.push({
          request_id: requestId,
          clinic_id: rule.clinic_id,
          source: "auto",
          country,
          city: null,
          currency: rule.currency,
          price: basePrice,
          price_min: rule.price_min ?? null,
          price_max: rule.price_max ?? null,
          status: "sent",
          note: null,
        });
        continue;
      }

      for (const city of reqCities) {
        if (!cityMatches(rule.cities ?? [], city)) continue;

        offersToUpsert.push({
          request_id: requestId,
          clinic_id: rule.clinic_id,
          source: "auto",
          country,
          city,
          currency: rule.currency,
          price: basePrice,
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
        return jsonResponse(
          {
            request: requestRow,
            offers: [],
            offers_error: upErr.message,
          },
          { status: 200 }
        );
      }
    }

    const { data: offers } = await admin
      .from("offers")
      .select("*")
      .eq("request_id", requestId);

    return jsonResponse(
      { request: requestRow, offers: offers ?? [] },
      { status: 200 }
    );
  } catch (e: any) {
    return jsonResponse(
      {
        error: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
});

