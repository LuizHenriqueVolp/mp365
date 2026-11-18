import { EVENTS_ENDPOINT, PIXEL_ID, PRECIOS, TRACK_INITIATE_CHECKOUT_ON_CLICK } from "@/config";

declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid", "xcod"];
const STORE = "mp365_attr";

/** Guarda UTMs/fbclid de la primera visita (30 días) para no perderlas al navegar. */
export function captureAttribution() {
  try {
    const qs = new URLSearchParams(location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => { const v = qs.get(k); if (v) found[k] = v; });
    const prev = JSON.parse(localStorage.getItem(STORE) || "null");
    if (Object.keys(found).length) {
      localStorage.setItem(STORE, JSON.stringify({ ...found, _t: Date.now() }));
    } else if (prev && Date.now() - prev._t > 30 * 864e5) {
      localStorage.removeItem(STORE);
    }
  } catch { /* almacenamiento bloqueado: seguimos solo con la URL */ }
}

function attribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null") || {};
    UTM_KEYS.forEach((k) => { if (saved[k]) out[k] = saved[k]; });
  } catch { /* ignore */ }
  const qs = new URLSearchParams(location.search);
  UTM_KEYS.forEach((k) => { const v = qs.get(k); if (v) out[k] = v; });
  return out;
}

/** Cookies _fbp/_fbc ayudan a la Cakto/UTMify a atribuir la compra en la API de Conversiones. */
function fbCookies() {
  const c = Object.fromEntries(document.cookie.split("; ").map((x) => x.split("=")));
  return { fbp: c["_fbp"], fbc: c["_fbc"] };
}

/** Construye la URL de checkout conservando UTMs (sin duplicar parámetros). */
export function checkoutUrl(base: string) {
  try {
    const u = new URL(base, location.origin);
    const a = attribution();
    Object.entries(a).forEach(([k, v]) => { if (!u.searchParams.has(k)) u.searchParams.set(k, v); });
    return u.toString();
  } catch { return base; }
}

export function sessionId() {
  try {
    let id = sessionStorage.getItem("mp365_sid");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("mp365_sid", id); }
    return id;
  } catch { return "na"; }
}

const ENDPOINT = (import.meta.env.VITE_EVENTS_ENDPOINT as string | undefined) || EVENTS_ENDPOINT;

/** Registro propio (Neon) — respaldo independiente del pixel. */
export function logEvent(event: string, data: Record<string, unknown> = {}) {
  if (!ENDPOINT) return;
  const payload = JSON.stringify({
    event, session_id: sessionId(), path: location.pathname, referrer: document.referrer || null,
    ...attribution(), ...fbCookies(), device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
    lang: navigator.language, screen: `${screen.width}x${screen.height}`, data,
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "text/plain" }));
    else fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "text/plain" } });
  } catch { /* nunca bloquear la navegación */ }
}

function fbq(...args: unknown[]) { try { window.fbq?.(...args); } catch { /* ignore */ } }

export function trackViewContent() {
  fbq("track", "ViewContent", { content_name: "Ministerio de Parejas 365", content_category: "Producto digital", currency: PRECIOS.moneda, value: PRECIOS.completo });
  logEvent("view_content");
}

export function trackSectionView(name: string) { logEvent("section_view", { name }); }

/** Clic en botón de compra. Siempre registra un evento personalizado; IC solo si está habilitado. */
const fired = new Set<string>();
export function trackCheckoutClick(plan: "basico" | "completo" | "upsell", value: number) {
  if (fired.has(plan)) return; // pointerdown + click no deben contar doble
  fired.add(plan);
  setTimeout(() => fired.delete(plan), 4000);
  const eventID = `${plan}-${sessionId()}-${Date.now()}`;
  fbq("trackCustom", "ClicComprar", { plan, value, currency: PRECIOS.moneda });
  if (TRACK_INITIATE_CHECKOUT_ON_CLICK) {
    fbq("track", "InitiateCheckout", { value, currency: PRECIOS.moneda, content_name: plan, num_items: 1 }, { eventID });
  }
  logEvent("checkout_click", { plan, value });
}

export { PIXEL_ID };

/** Back redirect (script oficial de la UTMify, adaptado a React): solo en la página de ventas. */
export function setupBackRedirect(path: string) {
  if (!path) return () => {};
  const url = path + (path.includes("?") ? "&" : "?") + location.search.replace("?", "");
  history.pushState({ br: 1 }, "", location.href);
  history.pushState({ br: 1 }, "", location.href);
  history.pushState({ br: 1 }, "", location.href);
  const onPop = () => { logEvent("back_redirect"); setTimeout(() => { location.href = url; }, 1); };
  window.addEventListener("popstate", onPop);
  return () => window.removeEventListener("popstate", onPop);
}

/** Desplazamiento suave sin crear entradas en el historial (no interfiere con el back redirect). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
