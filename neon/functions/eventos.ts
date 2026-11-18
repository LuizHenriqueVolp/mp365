// Neon Function "eventos": recibe eventos de la página y los guarda en Postgres.
// DATABASE_URL lo inyecta Neon automáticamente.
import { createHash } from "node:crypto";
// Consulta vía el endpoint HTTP de Neon (mismo protocolo del driver @neondatabase/serverless),
// sin dependencias: el bundle queda mínimo.
const DB = process.env.DATABASE_URL || "";
const SQL_URL = DB ? `https://${new URL(DB).hostname.replace(/^[^.]+\./, "api.")}/sql` : "";
async function sql(query: string, params: unknown[]) {
  const r = await fetch(SQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Neon-Connection-String": DB },
    body: JSON.stringify({ query, params }),
  });
  if (!r.ok) throw new Error(await r.text());
}

const ALLOWED = (process.env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED.includes("*") ? "*" : (origin && ALLOWED.some((a) => origin.endsWith(a)) ? origin : ALLOWED[0]),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});
const s = (v: unknown, max = 300) => (typeof v === "string" && v ? v.slice(0, max) : null);
const EVENTS = new Set(["view_content", "section_view", "checkout_click", "upsell_view", "upsell_decline", "thank_you_view", "back_redirect"]);

export default {
  async fetch(req: Request): Promise<Response> {
    const origin = req.headers.get("origin");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (req.method === "GET") return new Response("ok", { headers: cors(origin) });
    if (req.method !== "POST") return new Response("method", { status: 405, headers: cors(origin) });
    try {
      const raw = await req.text();
      if (raw.length > 8000) return new Response("too large", { status: 413, headers: cors(origin) });
      const b = JSON.parse(raw);
      if (!EVENTS.has(b.event)) return new Response("bad event", { status: 400, headers: cors(origin) });
      const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
      const ipHash = ip ? createHash("sha256").update(ip + (process.env.IP_SALT || "mp365")).digest("hex").slice(0, 32) : null;
      const country = req.headers.get("cf-ipcountry") || req.headers.get("x-vercel-ip-country") || req.headers.get("x-country") || null;
      await sql(
        `INSERT INTO eventos (event, session_id, path, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, src, sck, fbclid, fbp, fbc, device, lang, screen, country, ip_hash, data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
        [b.event, s(b.session_id, 60), s(b.path), s(b.referrer, 500), s(b.utm_source), s(b.utm_medium), s(b.utm_campaign), s(b.utm_content), s(b.utm_term),
         s(b.src), s(b.sck), s(b.fbclid, 500), s(b.fbp), s(b.fbc, 500), s(b.device, 20), s(b.lang, 20), s(b.screen, 20), country, ipHash,
         b.data && typeof b.data === "object" ? JSON.stringify(b.data).slice(0, 2000) : null]
      );
      return new Response(null, { status: 204, headers: cors(origin) });
    } catch {
      return new Response("error", { status: 400, headers: cors(origin) });
    }
  },
};
