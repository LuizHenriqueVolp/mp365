import { useEffect, useRef, useState } from "react";
import { BACK_REDIRECT_PATH, CHECKOUT, GARANTIA_DIAS, PAGOS_OTROS, PAGOS_POR_PAIS, PRECIOS, TESTIMONIOS } from "@/config";
import { setupBackRedirect, trackViewContent } from "@/lib/tracking";
import { CTA_CLASS, Check, CheckoutButton, CtaToPlans, Divider, Footer, Rings, Shield, useLightbox, useReveal } from "@/components/ui";

// Réplica de parejas365.lovable.app (mismas fuentes, tamaños, posiciones y colores).
// Cambios pedidos: mockup nuevo, 2 planes lado a lado (Básico → Completo), garantía configurable (GARANTIA_DIAS).

/** Texto de medios de pago según el país (zona horaria del celular). */
function pagoTexto() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return PAGOS_POR_PAIS.find((p) => p.zonas.test(tz))?.texto ?? PAGOS_OTROS;
  } catch { return PAGOS_OTROS; }
}
const PAGO = pagoTexto();

const usd = (n: number) => `US$ ${n.toFixed(2).replace(".", ",")}`;
const img = (name: string, w: number) => `/img/lp/${name}-${w}.webp`;
const srcSet = (name: string, ws: number[]) => ws.map((w) => `${img(name, w)} ${w}w`).join(", ");

const INCLUIDO = [
  { n: "24", t: "Encuentros Completos", d: "Encuentros estructurados con tema, reflexión, actividad, preguntas, compromiso y cierre.", tag: "Hasta 2 encuentros por mes durante 12 meses.", wide: true },
  { n: "50", t: "Dinámicas", d: "Actividades para comunicación, conexión, gratitud, fe, cooperación y crecimiento matrimonial." },
  { n: "40", t: "Rompehielos", d: "Actividades rápidas para iniciar reuniones con un ambiente más ligero y participativo." },
  { n: "100", t: "Preguntas para Conectar", d: "Preguntas organizadas para incentivar conversación, escucha y conexión entre los matrimonios." },
  { n: "01", t: "Manual del Líder", d: "Orientaciones prácticas para preparar, organizar y facilitar los encuentros." },
];

const PASOS = [
  ["01", "ELIGE", "Elige el encuentro o recurso según la necesidad de tu grupo."],
  ["02", "PREPARA", "Revisa las instrucciones y separa lo que vas a utilizar."],
  ["03", "APLICA", "Utiliza el contenido y las actividades siguiendo una estructura clara."],
];

const BENEFICIOS = [
  "Evita comenzar cada reunión desde cero",
  "Reduce el tiempo buscando nuevas ideas",
  "Ten variedad para diferentes momentos del año",
  "Utiliza materiales organizados",
  "Imprime solamente lo que necesites",
  "Reutiliza los recursos dentro de tu ministerio",
];

const BONOS = [
  { img: "bono-conexion", n: 1, r: 54, t: "KIT CONEXIÓN DURANTE LA SEMANA", s: "30 Tarjetas con Versículos + 24 Tarjetas de Retos", d: "Continúa la experiencia después de cada encuentro con mensajes bíblicos y pequeños retos para compartir con los matrimonios.", v: PRECIOS.bonos.conexion, alt: "Mockup del kit conexión durante la semana" },
  { img: "bono-comunicacion", n: 2, r: 24, t: "KIT DE COMUNICACIÓN PARA EVENTOS", s: "12 Invitaciones + 12 Carteles", d: "Divulga reuniones, cenas y encuentros especiales sin tener que crear cada pieza visual desde cero.", v: PRECIOS.bonos.comunicacion, alt: "Mockup del kit de comunicación para eventos" },
  { img: "bono-organizacion", n: 3, r: 17, t: "KIT DE ORGANIZACIÓN MINISTERIAL", s: "6 Planners + 3 Certificados + 8 Separadores", d: "Organiza materiales y actividades con herramientas prácticas y una presentación más cuidada.", v: PRECIOS.bonos.organizacion, alt: "Mockup del kit de organización ministerial" },
];
const TOTAL_BONOS = PRECIOS.bonos.conexion + PRECIOS.bonos.comunicacion + PRECIOS.bonos.organizacion;

const DENTRO = [
  { img: "manual-del-lider", title: "Manual del Líder", d: "Todo lo que necesitas para guiar encuentros que transforman matrimonios." },
  { img: "ejemplo-encuentros", title: "24 Encuentros", d: "Encuentros estructurados para facilitar la preparación del líder." },
  { img: "ejemplo-encuentros-libro", title: "Encuentros por dentro", d: "Reflexiones bíblicas, objetivos y materiales necesarios en cada encuentro." },
  { img: "ejemplo-dinamicas", title: "50 Dinámicas", d: "Actividades explicadas paso a paso, con duración y aplicación práctica." },
  { img: "ejemplo-rompehielos", title: "40 Rompehielos", d: "Actividades rápidas para iniciar reuniones con un ambiente participativo." },
  { img: "ejemplo-preguntas", title: "100 Preguntas para Conectar", d: "Preguntas organizadas por categorías para incentivar la conversación." },
];

const PLAN_BASICO = {
  si: ["Manual del Líder", "24 Encuentros Completos", "6 Hojas de Trabajo Imprimibles", "Acceso de por vida"],
  no: ["50 Dinámicas", "40 Rompehielos", "100 Preguntas para Conectar", "95 Recursos Visuales"],
};
const PLAN_COMPLETO = ["Manual del Líder", "24 Encuentros Completos", "50 Dinámicas", "40 Rompehielos", "100 Preguntas para Conectar", "95 Recursos Visuales", "13 Recursos Digitales Organizados", "Acceso de por vida"];

const FAQ = [
  ["¿El producto es físico o digital?", "Es un producto 100% digital. No recibirás ningún paquete físico. Después de la confirmación del pago recibirás las instrucciones para acceder a los archivos."],
  ["¿En qué formato recibiré los materiales?", "Recibirás los materiales en formato digital PDF, listos para descargar, visualizar e imprimir."],
  ["¿Puedo imprimir los materiales?", "Sí. Puedes descargar e imprimir los materiales que necesites para utilizarlos dentro de tu propio ministerio."],
  ["¿Necesito experiencia para utilizarlo?", "No. El contenido fue organizado para facilitar su uso por líderes, coordinadores, pastores y matrimonios que colaboran en encuentros de pareja."],
  ["¿Puedo utilizar los materiales más de una vez y tengo garantía?", `Sí. Tendrás acceso de por vida y podrás volver a utilizar los materiales dentro de tu propio ministerio. Además, tu compra cuenta con una garantía de ${GARANTIA_DIAS} días conforme a las condiciones del checkout. La reventa o redistribución de los archivos no está permitida.`],
];

function SectionHead({ title, sub, eyebrow }: { title: React.ReactNode; sub?: string; eyebrow?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`${eyebrow ? "mt-3 " : ""}text-balance font-display text-2xl leading-tight text-wine-deep sm:text-3xl md:text-4xl`}>{title}</h2>
      {sub && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{sub}</p>}
    </div>
  );
}

function MiraPorDentro({ onZoom }: { onZoom: (x: { src: string; alt: string }) => void }) {
  const [i, setI] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const go = (d: number) => setI((p) => (p + d + DENTRO.length) % DENTRO.length);
  const scrollBy = (d: number) => {
    const el = row.current; if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: d * ((card?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };
  const cur = DENTRO[i];
  return (
    <>
      <div className="relative mt-8 md:hidden">
        <div ref={row} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {DENTRO.map((x) => (
            <figure key={x.img} className="w-[82%] shrink-0 snap-center rounded-2xl border border-gold-soft/60 bg-card p-3 shadow-soft">
              <button type="button" className="block w-full" aria-label={`Ampliar imagen: ${x.title}`} onClick={() => onZoom({ src: img(x.img, 800), alt: x.title })}>
                <img src={img(x.img, 480)} srcSet={srcSet(x.img, [480, 800])} sizes="82vw" alt={x.title} loading="lazy" decoding="async" width={1122} height={1402} className="w-full rounded-xl object-contain" />
              </button>
              <figcaption className="mt-3 text-center">
                <span className="font-display text-lg text-wine">{x.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{x.d}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Material anterior" className="absolute left-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-card/90 text-lg text-wine shadow-soft backdrop-blur">←</button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Material siguiente" className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/60 bg-card/90 text-lg text-wine shadow-soft backdrop-blur">→</button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Usa las flechas o desliza • Toca para ampliar</p>
      </div>

      <div className="mt-10 hidden items-center gap-5 md:flex">
        <button type="button" onClick={() => go(-1)} aria-label="Material anterior" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/60 bg-card text-wine transition-colors hover:bg-secondary">←</button>
        <figure className="min-w-0 flex-1 rounded-3xl border border-gold-soft/60 bg-card p-5 shadow-premium">
          <button type="button" className="block w-full" aria-label={`Ampliar imagen: ${cur.title}`} onClick={() => onZoom({ src: img(cur.img, 800), alt: cur.title })}>
            <img src={img(cur.img, 800)} alt={cur.title} loading="lazy" decoding="async" width={1122} height={1402} className="mx-auto max-h-[32rem] w-auto max-w-full rounded-2xl object-contain" />
          </button>
          <figcaption className="mt-4 text-center">
            <span className="font-display text-2xl text-wine">{cur.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{cur.d}</span>
          </figcaption>
        </figure>
        <button type="button" onClick={() => go(1)} aria-label="Material siguiente" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/60 bg-card text-wine transition-colors hover:bg-secondary">→</button>
      </div>
      <div className="mt-5 hidden justify-center gap-2 md:flex">
        {DENTRO.map((x, r) => (
          <button key={x.img} type="button" onClick={() => setI(r)} aria-label={`Ir a ${x.title}`} className={`h-2 rounded-full transition-all ${r === i ? "w-7 bg-wine" : "w-2 bg-gold-soft"}`} />
        ))}
      </div>
    </>
  );
}

const PLAN_CTA = `${CTA_CLASS} w-full max-w-none py-5 text-base`;

function PlanCard({ badge, subtitle, tagline, items, excluded = [], priceLabel, price, cta, featured = false }: {
  badge: string; subtitle: string; tagline: string; items: string[]; excluded?: string[];
  priceLabel: React.ReactNode; price: number; cta: React.ReactNode; featured?: boolean;
}) {
  return (
    <div className={`flex flex-col rounded-[2rem] bg-card p-6 shadow-premium sm:p-10 ${featured ? "border-2 border-gold" : "border border-gold/50"}`}>
      <div className="text-center">
        <span className={`inline-block rounded-full px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] ${featured ? "bg-wine-gradient text-primary-foreground" : "bg-secondary text-wine"}`}>{badge}</span>
        <Rings className="mx-auto mt-5 h-7 w-12 text-gold" />
        <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.1em] text-wine-deep sm:text-3xl">Ministerio de Parejas 365</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-brown-warm">{subtitle}</p>
        <p className="mt-5 text-balance font-display text-xl leading-snug text-wine sm:text-2xl">{tagline}</p>
      </div>
      <ul className="mt-7 grid gap-2 sm:grid-cols-2 md:grid-cols-1">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-2 text-sm text-foreground sm:text-base"><Check /><span className="min-w-0">{x}</span></li>
        ))}
        {excluded.map((x) => (
          <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground/70 line-through sm:text-base"><span aria-hidden="true" className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center text-xs">✕</span><span className="min-w-0">{x}</span></li>
        ))}
      </ul>
      <div className="mt-auto">
        <div className="mt-8 rounded-2xl bg-secondary/70 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{priceLabel}</p>
          <p className="mt-1 font-display text-5xl text-wine sm:text-6xl">{usd(price)}</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{PAGO}</p>
        </div>
        <div className="mt-7 flex flex-col items-center">
          {cta}
          <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">Pago seguro • Acceso inmediato • Garantía de {GARANTIA_DIAS} días</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useReveal();
  useEffect(() => { trackViewContent(); }, []);
  useEffect(() => setupBackRedirect(BACK_REDIRECT_PATH), []);
  const [open, setOpen] = useState<number | null>(null);
  const lightbox = useLightbox();

  return (
    <main className="overflow-x-hidden">
      {/* HERO — en la 1.ª pantalla del celular (≈700 px): qué es, el producto, el botón y el precio. */}
      <section data-track="hero" className="relative overflow-hidden bg-cream-gradient pb-12 pt-7 md:section-pad">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-gradient opacity-40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="eyebrow">Para líderes de ministerios de matrimonios</p>
          <h1 className="mt-3 text-balance font-display text-[1.75rem] leading-[1.12] text-wine-deep sm:text-4xl md:text-5xl">24 encuentros para matrimonios, listos para aplicar en tu iglesia</h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Con dinámicas, rompehielos y preguntas. Solo eliges el tema, preparas y aplicas.</p>
          <div className="relative mt-5">
            <div aria-hidden="true" className="absolute inset-6 rounded-[2rem] bg-gold-gradient opacity-30 blur-2xl" />
            <img
              src={img("hero", 1100)} srcSet={srcSet("hero", [640, 1100, 1536])} sizes="(max-width: 768px) 100vw, 672px"
              alt="Todo lo que recibes en Ministerio de Parejas 365: libros, encuentros, dinámicas, rompehielos, preguntas, tarjetas, invitaciones, certificados, planificadores y separadores"
              width={1536} height={1024} fetchPriority="high" decoding="async"
              className="relative mx-auto w-full max-w-2xl rounded-[1.5rem] border border-gold-soft/60 shadow-premium"
            />
          </div>
          <div className="mt-5 flex flex-col items-center">
            <CtaToPlans />
            <p className="mt-3 text-base font-semibold text-wine">Desde {usd(PRECIOS.basico)} · Pago único</p>
            <p className="mt-1 text-sm text-muted-foreground">Acceso inmediato · Garantía de {GARANTIA_DIAS} días</p>
            <p className="mt-1 text-sm text-muted-foreground">{PAGO}</p>
          </div>
        </div>
      </section>

      {/* LO QUE TENDRÁS */}
      <section data-track="incluye" className="bg-background section-pad">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead title="Todo lo que tendrás listo para tus próximos encuentros." sub="Materiales organizados para que puedas elegir lo que necesitas sin comenzar cada reunión desde una página en blanco." />
          <Divider />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {INCLUIDO.map((x) => (
              <li key={x.t} className={`flex flex-col rounded-2xl border border-gold-soft/60 bg-card p-5 shadow-soft sm:p-6 ${x.wide ? "sm:col-span-2" : ""}`}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
                  <span className="shrink-0 font-display text-5xl leading-none text-gold-gradient sm:text-6xl">{x.n}</span>
                  <h3 className="min-w-0 font-display text-xl leading-snug text-wine-deep sm:text-2xl">{x.t}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{x.d}</p>
                {x.tag && <p className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-wine sm:text-sm">{x.tag}</p>}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <p className="rounded-2xl bg-wine-gradient px-5 py-4 text-center font-display text-xl text-primary-foreground sm:text-2xl">+ 95 recursos visuales incluidos</p>
            <p className="rounded-2xl border border-gold/50 bg-secondary/70 px-5 py-4 text-center font-display text-xl text-wine sm:text-2xl">13 recursos digitales listos para usar</p>
          </div>
        </div>
      </section>

      {/* SISTEMA ENCUENTRO LISTO */}
      <section data-track="metodo" className="bg-secondary/50 section-pad">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-display text-2xl leading-tight text-wine-deep sm:text-3xl md:text-4xl">Menos tiempo preparando. Más tiempo cuidando a las personas.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">No necesitas más archivos sueltos. Necesitas recursos que puedas encontrar, preparar y utilizar.</p>
            <p className="mt-5 inline-flex rounded-full border border-gold/60 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-wine">Sistema Encuentro Listo</p>
          </div>
          <ol className="mt-9 grid gap-4 sm:grid-cols-3">
            {PASOS.map(([n, t, d]) => (
              <li key={n} className="rounded-2xl border border-gold-soft/60 bg-card p-5 text-center shadow-soft">
                <p className="font-display text-3xl text-gold">{n}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-wine">{t}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {BENEFICIOS.map((x) => (
              <li key={x} className="flex items-start gap-2.5 rounded-xl bg-card px-4 py-3 text-sm text-foreground shadow-soft sm:text-base"><Check /><span className="min-w-0">{x}</span></li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-gold/50 bg-card p-6 text-center">
            <p className="font-display text-xl text-wine-deep sm:text-2xl">¿Necesito experiencia?</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">No. Los materiales fueron organizados para facilitar su uso por líderes, coordinadores, pastores y matrimonios que sirven en el ministerio.</p>
          </div>
        </div>
      </section>

      {/* BONOS */}
      <section data-track="bonos" className="bg-background section-pad">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead eyebrow="Y eso no es todo" title="También recibirás 95 recursos visuales para completar tus encuentros." sub="Materiales para continuar la experiencia, divulgar actividades y mantener tu ministerio organizado." />
          <div className="mt-10 space-y-6">
            {BONOS.map((b) => (
              <article key={b.img} className="grid items-center gap-6 rounded-3xl border border-gold/45 bg-card p-5 shadow-soft sm:p-7 md:grid-cols-[1fr_1.1fr]">
                <img src={img(b.img, 480)} srcSet={srcSet(b.img, [480, 800])} sizes="(max-width: 768px) 384px, 500px" alt={b.alt} loading="lazy" decoding="async" width={1122} height={1402} className="mx-auto w-full max-w-sm rounded-2xl border border-gold-soft/60 object-contain md:max-w-none" />
                <div>
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <span className="inline-block rounded-full bg-wine-gradient px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-primary-foreground">BONO #{b.n}</span>
                    <span className="inline-block rounded-full border border-gold/60 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-wine">{b.r} RECURSOS</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug text-wine-deep sm:text-2xl">{b.t}</h3>
                  <p className="mt-1 text-sm font-semibold text-brown-warm">{b.s}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{b.d}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="text-sm text-muted-foreground">Valor estimado: <span className="strike-red font-semibold">{usd(b.v)}</span></p>
                    <p className="text-sm font-semibold tracking-[0.1em] text-wine">HOY: <span className="font-display text-2xl uppercase tracking-normal text-gold-gradient">GRATIS</span></p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-wine-gradient p-6 text-center shadow-premium">
            <p className="font-display text-2xl uppercase tracking-[0.06em] text-primary-foreground sm:text-3xl">95 recursos visuales</p>
            <div className="mt-3 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
              <p className="text-sm text-primary-foreground/85 sm:text-base">Valor estimado total: <span className="strike-red font-semibold text-primary-foreground">{usd(TOTAL_BONOS)}</span></p>
              <p className="rounded-full border border-gold/70 px-4 py-1.5 text-sm font-semibold tracking-[0.14em] text-gold">INCLUIDOS EN EL PLAN COMPLETO</p>
            </div>
          </div>
          <div className="mt-10 flex justify-center"><CtaToPlans /></div>
        </div>
      </section>

      {/* MIRA POR DENTRO */}
      <section data-track="por-dentro" className="bg-secondary/50 section-pad">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead title="Mira por dentro lo que vas a recibir." sub="Material real. Sin sorpresas después de la compra." />
          <Divider />
          <MiraPorDentro onZoom={lightbox.open} />
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section data-track="testimonios" className="bg-background section-pad">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brown-warm">Experiencias reales</p>
            <h2 className="mt-3 text-balance font-display text-2xl leading-tight text-wine-deep sm:text-3xl">Lo que dicen quienes ya conocen Ministerio de Parejas 365</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Conoce la experiencia de líderes y matrimonios que utilizaron los materiales.</p>
          </div>
        </div>
        <div className="fb-marquee mt-8">
          <div className="fb-marquee-track">
            {[...TESTIMONIOS, ...TESTIMONIOS].map((t, k) => (
              <figure key={k} aria-hidden={k >= TESTIMONIOS.length ? true : undefined} className="w-[240px] shrink-0 overflow-hidden rounded-2xl border border-gold-soft/60 bg-card shadow-premium sm:w-[290px]">
                <img src={img(t.img, 600)} srcSet={srcSet(t.img, [300, 600])} sizes="(max-width: 640px) 240px, 290px" alt={`Mensaje de ${t.nombre}`} loading="lazy" decoding="async" width={768} height={1376} className="block h-[426px] w-full object-cover object-top sm:h-[515px]" />
              </figure>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center px-5">
          <p className="max-w-xl text-balance text-center font-display text-lg text-wine sm:text-xl">Ahora tú también puedes tener tus próximos encuentros mucho más preparados.</p>
        </div>
      </section>

      {/* PLANES — mismo cartón del original. Celular: Básico y Completo uno debajo del otro; md+: lado a lado. */}
      <section id="oferta" data-track="planes" className="relative scroll-mt-4 overflow-hidden bg-wine-gradient section-pad">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
        <div className="relative mx-auto grid max-w-3xl gap-8 px-5 md:max-w-5xl md:grid-cols-2 md:items-stretch md:gap-6">
          <PlanCard
            badge="PLAN BÁSICO"
            subtitle="Encuentros Listos"
            tagline="Empieza con lo esencial para tus próximos encuentros."
            items={PLAN_BASICO.si}
            excluded={PLAN_BASICO.no}
            priceLabel={<>Pago único</>}
            price={PRECIOS.basico}
            cta={<CheckoutButton href={CHECKOUT.basico} plan="basico" value={PRECIOS.basico} className={PLAN_CTA}><span className="pointer-events-none inline-flex items-center gap-2"><span>Quiero el Básico</span><span aria-hidden="true">→</span></span></CheckoutButton>}
          />
          <PlanCard
            featured
            badge="ACCESO COMPLETO"
            subtitle="Sistema Encuentro Listo"
            tagline="Ten tus próximos encuentros mucho más preparados desde hoy."
            items={PLAN_COMPLETO}
            priceLabel={<>De <span className="font-semibold text-brown-warm line-through decoration-wine/70 decoration-2">{usd(PRECIOS.basico + TOTAL_BONOS)}</span> por solo</>}
            price={PRECIOS.completo}
            cta={<CheckoutButton href={CHECKOUT.completo} plan="completo" value={PRECIOS.completo} className={PLAN_CTA}><span className="pointer-events-none inline-flex items-center gap-2"><span>Quiero el Completo</span><span aria-hidden="true">→</span></span></CheckoutButton>}
          />
        </div>
      </section>

      {/* GARANTÍA */}
      <section data-track="garantia" className="bg-background section-pad">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mx-auto grid h-36 w-36 place-items-center rounded-full border-2 border-gold/70 bg-secondary/70 shadow-soft">
            <div>
              <Shield className="mx-auto h-8 w-8 text-wine" />
              <p className="mt-1 font-display text-sm uppercase leading-tight tracking-[0.12em] text-wine">{GARANTIA_DIAS} días de<br />garantía</p>
            </div>
          </div>
          <h2 className="mt-8 font-display text-2xl leading-tight text-wine-deep sm:text-3xl md:text-4xl">Conoce todo el material con tranquilidad.</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">Después de confirmar tu compra tendrás acceso a Ministerio de Parejas 365 para revisar todo el contenido.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">Si dentro de los primeros {GARANTIA_DIAS} días consideras que el producto no corresponde a lo presentado en esta página, podrás solicitar el reembolso conforme al procedimiento de la plataforma de pago.</p>
          <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-card px-5 py-2.5 text-sm font-semibold text-wine sm:text-base"><Shield className="h-5 w-5 text-gold" />{GARANTIA_DIAS} días para decidir.</p>
        </div>
      </section>

      {/* FAQ */}
      <section data-track="faq" className="bg-secondary/50 section-pad">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-2xl leading-tight text-wine-deep sm:text-3xl md:text-4xl">¿Todavía tienes alguna duda?</h2>
          <p className="mt-4 text-center text-sm text-muted-foreground sm:text-base">Respuestas rápidas antes de comenzar.</p>
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a], r) => {
              const isOpen = open === r;
              return (
                <div key={q} className="overflow-hidden rounded-2xl border border-gold-soft/70 bg-card shadow-soft">
                  <button type="button" onClick={() => setOpen(isOpen ? null : r)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left">
                    <span className="min-w-0 font-display text-lg leading-snug text-wine-deep">{q}</span>
                    <span aria-hidden="true" className={`shrink-0 text-xl text-gold transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{a}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center"><CtaToPlans /></div>
        </div>
      </section>

      <Footer />
      {lightbox.node}
    </main>
  );
}
