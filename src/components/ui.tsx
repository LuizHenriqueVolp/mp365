import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { GARANTIA_DIAS } from "@/config";
import { checkoutUrl, scrollToId, trackCheckoutClick, trackSectionView } from "@/lib/tracking";

/** Registra secciones vistas ([data-track]) y activa la animación de [data-reveal]. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-track]");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          const name = (e.target as HTMLElement).dataset.track;
          if (name) trackSectionView(name);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ---------- Ornamentos (SVG copiados del original) ---------- */
export const Rings = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 48 32" className={className} fill="none" aria-hidden="true">
    <circle cx="18" cy="18" r="11" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="30" cy="18" r="11" stroke="currentColor" strokeWidth="1.4" />
    <path d="M24 2v8M20.5 5.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const Leaf = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 21c0-6 3-9 9-9-1 5-4 8-9 9Zm0 0c0-6-3-9-9-9 1 5 4 8 9 9Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
export const Check = ({ className = "mt-0.5 h-5 w-5 shrink-0 text-gold" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
    <path d="M6 10.3l2.6 2.5L14.2 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Shield = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 21c4.5-2 7-5.4 7-9.6V5.6L12 3 5 5.6v5.8C5 15.6 7.5 19 12 21Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M8.8 12l2.2 2.2L15.4 9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Divider = ({ className = "mt-6" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <span className="h-px w-14 bg-gold-gradient" />
    <Leaf className="h-4 w-4 text-gold" />
    <span className="h-px w-14 bg-gold-gradient" />
  </div>
);

/** Clases del botón del original. */
export const CTA_CLASS =
  "cta-highlight relative z-10 inline-flex w-full min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-transform duration-200 [touch-action:manipulation] [-webkit-tap-highlight-color:transparent] hover:[@media(hover:hover)]:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:text-base bg-wine-gradient shadow-premium";

export const trustText = `Pago seguro • Acceso inmediato • Garantía de ${GARANTIA_DIAS} días`;

/** Botón que baja hasta los planes (sin crear entradas en el historial). */
export function CtaToPlans({ children = "QUIERO MIS ENCUENTROS LISTOS", trust = false }: { children?: ReactNode; trust?: boolean }) {
  return (
    <div className="flex w-full flex-col items-center">
      <a href="#oferta" role="button" onClick={(e) => { e.preventDefault(); scrollToId("oferta"); }} className={`${CTA_CLASS} max-w-md`}>
        <span className="pointer-events-none inline-flex items-center gap-2"><span>{children}</span><span aria-hidden="true">→</span></span>
      </a>
      {trust && <p className="mt-3 text-xs text-muted-foreground sm:text-sm">{trustText}</p>}
    </div>
  );
}

/** Botón que abre el checkout: el enlace ya sale con las UTMs, el evento se dispara en el
 *  primer toque (pointerdown) y la navegación es inmediata. */
export function CheckoutButton({ href, plan, value, children, gold = false, className }: { href: string; plan: "basico" | "completo" | "upsell"; value: number; children: ReactNode; gold?: boolean; className?: string }) {
  const [url, setUrl] = useState(href);
  useEffect(() => { setUrl(checkoutUrl(href)); }, [href]);
  const fire = () => trackCheckoutClick(plan, value);
  return (
    <a
      href={url}
      rel="noopener"
      onPointerDown={fire}
      onClick={(e) => { fire(); (e.currentTarget as HTMLAnchorElement).href = checkoutUrl(href); }}
      className={className ?? `btn-cta ${gold ? "btn-gold" : ""}`}
      data-plan={plan}
    >
      {children}
    </a>
  );
}

export function Trust({ light = false }: { light?: boolean }) {
  return <p className={`mt-3 text-center text-xs sm:text-sm ${light ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{trustText}</p>;
}

export function Section({ id, track, className = "", children }: { id?: string; track?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-track={track} className={`mx-auto w-full max-w-xl px-5 py-12 ${className}`}>
      {children}
    </section>
  );
}

export function Title({ eyebrow, children, sub }: { eyebrow?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6 text-center">
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="text-balance font-display text-2xl leading-tight text-wine-deep sm:text-3xl">{children}</h2>
      {sub && <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{sub}</p>}
      <Divider className="mt-4" />
    </div>
  );
}

/** Rodapé igual ao original (sem o aviso sobre o Meta). */
export function Footer() {
  const links: [string, string][] = [["/privacidad", "Política de Privacidad"], ["/terminos", "Términos y Condiciones"], ["/fuentes", "Fuentes"]];
  return (
    <footer className="bg-wine-gradient px-5 py-10">
      <div className="mx-auto max-w-4xl text-center">
        <Rings className="mx-auto h-6 w-10 text-gold" />
        <p className="mt-3 font-display text-lg uppercase tracking-[0.16em] text-primary-foreground">Ministerio de Parejas 365</p>
        <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map(([to, label]) => (
            <Link key={to} to={to} className="inline-flex min-h-11 items-center text-sm text-primary-foreground/85 underline-offset-4 transition-colors hover:text-gold hover:underline">{label}</Link>
          ))}
        </nav>
        <div className="mx-auto mt-6 h-px w-40 bg-gold-gradient" />
        <p className="mt-5 text-xs text-primary-foreground/75">© {new Date().getFullYear()} Ministerio de Parejas 365. Todos los derechos reservados.</p>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-primary-foreground/60">Producto digital independiente creado para apoyar la planificación y organización de actividades en ministerios de matrimonios.</p>
      </div>
    </footer>
  );
}

/** Lightbox simple para ampliar imágenes. */
export function useLightbox() {
  const [img, setImg] = useState<{ src: string; alt: string } | null>(null);
  const close = useRef(() => setImg(null)).current;
  useEffect(() => {
    if (!img) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [img, close]);
  const node = img ? (
    <div role="dialog" aria-modal="true" aria-label={img.alt} onClick={close} className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/80 p-5 backdrop-blur-sm">
      <img src={img.src} alt={img.alt} className="max-h-[85vh] w-auto max-w-full rounded-2xl border border-gold/50" />
      <button type="button" onClick={close} aria-label="Cerrar imagen" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-gold/60 text-gold">✕</button>
    </div>
  ) : null;
  return { open: setImg, node };
}
