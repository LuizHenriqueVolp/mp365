// ============================================================
// CONFIGURACIÓN CENTRAL — edita SOLO este archivo para cambiar
// precios, enlaces de checkout y tracking.
// ============================================================

// Pixel do Meta e pixel da UTMify: configurados em index.html (window.MP365_TRACKING).
export const PIXEL_ID = "984364367619085";

// Garantia (dias) — aparece em toda a página, FAQ e termos.
export const GARANTIA_DIAS = 14;

// Medios de pago que muestra la página según el país del visitante (detectado por la zona horaria
// del celular, sin llamadas externas). Deben coincidir con los medios activos en la Cakto.
export const PAGOS_POR_PAIS: { pais: string; zonas: RegExp; texto: string }[] = [
  { pais: "MX", zonas: /^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Hermosillo|Mazatlan|Bahia_Banderas|Tijuana)$/, texto: "Paga con OXXO, SPEI, Mercado Pago o tarjeta." },
  { pais: "CO", zonas: /^America\/Bogota$/, texto: "Paga con PSE, Nequi o tarjeta." },
];
export const PAGOS_OTROS = "Paga con tarjeta, PayPal y otros medios locales.";

// Enlaces de checkout de la Cakto.
export const CHECKOUT = {
  basico: "https://pay.cakto.com.br/ruo23qa_1338917",
  completo: "https://pay.cakto.com.br/34tneui_1338932",
  // Upsell: SOLO se usa si todavía no pegaste el código del "Gerador de Upsell" (UPSELL_CAKTO_HTML).
  // Con el enlace simple el cliente tiene que volver a escribir la tarjeta; con el código de la Cakto es 1 clic.
  upsellAceptar: "https://pay.cakto.com.br/x8e3ffn_1338948",
  upsellRechazar: "/gracias",
};

// Pega aquí el HTML que genera la Cakto en Producto → Upsell/Downsell → "Gerador de Upsell"
// (usando como URL la página https://parejas365.vercel.app/oferta-especial). Activa la compra en 1 clic.
export const UPSELL_CAKTO_HTML = ``;

export const PRECIOS = {
  moneda: "USD",
  basico: 5.9,
  completo: 9.9,
  upsell: 14.9,
  // Valor individual de referencia de cada bono (no es precio tachado).
  bonos: { conexion: 9.9, comunicacion: 7.9, organizacion: 6.9 },
};

// Tracking (decidido automaticamente em src/lib/tracking.ts):
// - Com o pixel da UTMify (utmifyPixelId em index.html): a UTMify dispara PageView, ViewContent,
//   InitiateCheckout e Purchase. O site não dispara nenhum evento padrão (evita duplicar).
// - Sem ele: pixel do Meta direto → PageView (index.html), ViewContent ao abrir a página e
//   InitiateCheckout no clique do botão de compra (os checkouts da Cakto NÃO têm pixel configurado).
//   Purchase precisa vir da Cakto (pixel no produto) ou da UTMify.

// Back redirect (script de la UTMify): si la persona toca "atrás" en la página de ventas,
// la lleva a esta página conservando las UTMs. Déjalo vacío ("") para desactivarlo.
export const BACK_REDIRECT_PATH = "/ultima-oportunidad";

// Testimonios reales y autorizados (capturas de mensajes), copiados a /public/img/lp/.
export const TESTIMONIOS: { nombre: string; img: string }[] = [
  { nombre: "Rosa Fernández", img: "fb1" },
  { nombre: "Ana Lucía Ríos", img: "fb2" },
  { nombre: "Sofía Castillo", img: "fb3" },
  { nombre: "Carlos Méndez", img: "fb4" },
  { nombre: "Javier Morales", img: "fb5" },
  { nombre: "Andrés y Valeria Gómez", img: "fb6" },
];

// Registro propio de eventos (Neon Function "eventos", proyecto Neon "ministerio-parejas-365-latam").
// Es una URL pública de solo escritura: no expone credenciales.
export const EVENTS_ENDPOINT = "https://br-steep-rain-bbt2orfy-eventos.compute.c-15.us-east-1.aws.neon.tech/";
