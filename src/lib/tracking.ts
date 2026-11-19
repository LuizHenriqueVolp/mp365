import { EVENTS_ENDPOINT, PIXEL_ID, PRECIOS } from "@/config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    MP365_TRACKING?: { metaPixelId: string; utmifyPixelId: string };
  }
}

/** true = pixel da UTMify ativo: ela dispara PageView/ViewContent/IC/Purchase; o site não duplica. */
export const utmifyPixelActive = () => !!window.MP365_TRACKING?.utmifyPixelId;

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
  if (!utmifyPixelActive()) fbq("track", "ViewContent", { content_name: "Ministerio de Parejas 365", content_category: "Producto digital", currency: PRECIOS.moneda, value: PRECIOS.completo });
  logEvent("view_content");
  scheduleTrackingCheck();
}

/** Diagnóstico: aos 4 s e 12 s registra no Neon se o pixel do Meta iniciou de fato no navegador do
 *  visitante (fbq com pixel, cookie _fbp/_fbc, lead da UTMify). Uma vez por sessão. */
function scheduleTrackingCheck() {
  try { if (sessionStorage.getItem("mp365_tc")) return; sessionStorage.setItem("mp365_tc", "1"); } catch { /* ignore */ }
  const check = (t: number) => {
    let pixels: string[] = [];
    try {
      const st = (window.fbq as unknown as { getState?: () => { pixels: { id: string }[] } })?.getState?.();
      pixels = st?.pixels?.map((p) => p.id) ?? [];
    } catch { /* ignore */ }
    let lead = false;
    try { lead = !!localStorage.getItem("lead"); } catch { /* ignore */ }
    // Usa section_view (evento aceito pela função do Neon) com name = tracking_check_Xs.
    logEvent("section_view", {
      name: `tracking_check_${t}s`, t, fbq: typeof window.fbq, pixels, utmify_lead: lead,
      fbp_cookie: /(^|; )_fbp=/.test(document.cookie), fbc_cookie: /(^|; )_fbc=/.test(document.cookie),
      utmify_script: !!document.querySelector('script[src*="utmify.com.br/scripts/pixel"]'),
      ua: navigator.userAgent.slice(0, 200), online: navigator.onLine, visible: document.visibilityState,
    });
  };
  setTimeout(() => check(4), 4000);
  setTimeout(() => check(12), 12000);
}

/** ViewContent de páginas secundarias (solo con el pixel del Meta directo; la UTMify ya lo envía). */
export function trackPageContent(name: string, value: number) {
  if (!utmifyPixelActive()) fbq("track", "ViewContent", { content_name: name, currency: PRECIOS.moneda, value });
}

/** PageView em navegação interna (SPA). A UTMify detecta a troca de URL sozinha. */
export function trackRouteView() {
  if (!utmifyPixelActive()) fbq("track", "PageView");
}

export function trackSectionView(name: string) { logEvent("section_view", { name }); }

/** Clic en botón de compra. Registra el clic; InitiateCheckout solo cuando el pixel de la UTMify
 *  no está activo (la UTMify ya lo dispara al detectar el enlace de la Cakto) y una vez por plano/sesión. */
const fired = new Set<string>();
export function trackCheckoutClick(plan: "basico" | "completo" | "upsell", value: number) {
  if (fired.has(plan)) return; // pointerdown + click no deben contar doble
  fired.add(plan);
  setTimeout(() => fired.delete(plan), 4000);
  if (!utmifyPixelActive()) {
    const key = `mp365_ic_${plan}`;
    let first = true;
    try { first = !sessionStorage.getItem(key); sessionStorage.setItem(key, "1"); } catch { /* ignore */ }
    if (first) {
      const eventID = `ic-${plan}-${sessionId()}`;
      fbq("track", "InitiateCheckout", { value, currency: PRECIOS.moneda, content_name: plan, content_ids: [plan], content_type: "product", num_items: 1 }, { eventID });
    }
  }
  fbq("trackCustom", "ClicComprar", { plan, value, currency: PRECIOS.moneda });
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
