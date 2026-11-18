// ============================================================
// CONFIGURACIÓN CENTRAL — edita SOLO este archivo para cambiar
// precios, enlaces de checkout y tracking.
// ============================================================

export const PIXEL_ID = "984364367619085";

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
// (usando como URL la página https://TU-DOMINIO/oferta-especial). Activa la compra en 1 clic.
export const UPSELL_CAKTO_HTML = ``;

export const PRECIOS = {
  moneda: "USD",
  basico: 9.9,
  completo: 17.9,
  upsell: 14.9,
  // Valor individual de referencia de cada bono (no es precio tachado).
  bonos: { conexion: 9.9, comunicacion: 7.9, organizacion: 6.9 },
};

// Tracking:
// - PageView: automático (index.html).
// - ViewContent: al cargar la página de ventas.
// - InitiateCheckout: lo dispara el CHECKOUT de la Cakto (pixel configurado allá) cuando el checkout abre.
//   Si NO configuras el pixel en la Cakto, cambia a true para dispararlo en el clic (evita duplicar).
// - Purchase: SIEMPRE desde la Cakto / UTMify (solo el checkout sabe si se aprobó).
export const TRACK_INITIATE_CHECKOUT_ON_CLICK = false;

// Back redirect (script de la UTMify): si la persona toca "atrás" en la página de ventas,
// la lleva a esta página conservando las UTMs. Déjalo vacío ("") para desactivarlo.
export const BACK_REDIRECT_PATH = "/ultima-oportunidad";

// Testimonios reales y autorizados (capturas de mensajes). Imágenes servidas desde la página anterior;
// si un día la desactivas, copia los archivos a /public/img/testimonios/ y cambia las rutas.
export const TESTIMONIOS: { nombre: string; img: string }[] = [
  { nombre: "Rosa Fernández", img: "https://parejas365.lovable.app/assets/fb1-Ci0AEi57.webp" },
  { nombre: "Ana Lucía Ríos", img: "https://parejas365.lovable.app/assets/fb2-1X4j5uqx.webp" },
  { nombre: "Sofía Castillo", img: "https://parejas365.lovable.app/assets/fb3-R3nctPl4.webp" },
  { nombre: "Carlos Méndez", img: "https://parejas365.lovable.app/assets/fb4-DAmMlVss.webp" },
  { nombre: "Javier Morales", img: "https://parejas365.lovable.app/assets/fb5-TpGIuP5G.webp" },
  { nombre: "Andrés y Valeria Gómez", img: "https://parejas365.lovable.app/assets/fb6-DS1U6ENr.webp" },
];

// Registro propio de eventos (Neon Function "eventos", proyecto Neon "ministerio-parejas-365-latam").
// Es una URL pública de solo escritura: no expone credenciales.
export const EVENTS_ENDPOINT = "https://br-steep-rain-bbt2orfy-eventos.compute.c-15.us-east-1.aws.neon.tech/";
