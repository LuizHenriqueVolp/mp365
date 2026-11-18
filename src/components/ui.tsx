import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { checkoutUrl, scrollToId, trackCheckoutClick, trackSectionView } from "@/lib/tracking";

/** Activa la animación de entrada de todos los [data-reveal] y registra secciones vistas. */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
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

/** Contador animado cuando entra en pantalla. */
export function Counter({ to, className = "" }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1100;
      const step = (t: number) => { const p = Math.min(1, (t - start) / dur); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className={className}>{n}</span>;
}

/** Botón que lleva a la sección de planes. */
export function CtaToPlans({ children = "Quiero mis encuentros listos", gold = false }: { children?: ReactNode; gold?: boolean }) {
  return (
    <a href="#planes" onClick={(e) => { e.preventDefault(); scrollToId("planes"); }} className={`btn-cta pulse-soft ${gold ? "btn-gold" : ""}`}>
      {children} <span aria-hidden>→</span>
    </a>
  );
}

/** Botón que abre el checkout. El enlace ya sale con las UTMs (sin esperas ni JavaScript bloqueante):
 *  el evento se dispara en el primer toque (pointerdown) y la navegación es inmediata. */
export function CheckoutButton({ href, plan, value, children, gold = false }: { href: string; plan: "basico" | "completo" | "upsell"; value: number; children: ReactNode; gold?: boolean }) {
  const [url, setUrl] = useState(href);
  useEffect(() => { setUrl(checkoutUrl(href)); }, [href]);
  const fire = () => trackCheckoutClick(plan, value);
  return (
    <a
      href={url}
      onPointerDown={fire}
      onClick={(e) => { fire(); (e.currentTarget as HTMLAnchorElement).href = checkoutUrl(href); }}
      className={`btn-cta ${gold ? "btn-gold" : ""}`}
      data-plan={plan}
    >
      {children}
    </a>
  );
}

export function Trust({ light = false }: { light?: boolean }) {
  const c = light ? "text-white/85" : "text-tinta/70";
  return (
    <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-sans text-[12px] font-medium ${c}`}>
      <span>🔒 Pago seguro</span><span>⚡ Acceso inmediato</span><span>🛡️ Garantía de 7 días</span>
    </div>
  );
}

export function Section({ id, track, className = "", children }: { id?: string; track?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} data-reveal data-track={track} className={`mx-auto w-full max-w-xl px-5 py-12 ${className}`}>
      {children}
    </section>
  );
}

export function Title({ eyebrow, children, sub }: { eyebrow?: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6 text-center">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h2 className="text-[26px] font-bold sm:text-[30px]">{children}</h2>
      {sub && <p className="mt-3 text-[16px] text-tinta/80">{sub}</p>}
      <div className="gold-rule mx-auto mt-4 w-40" />
    </div>
  );
}

/** CTA fijo en el celular: aparece después del hero y se oculta en la sección de planes. */
export function StickyCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const plans = document.getElementById("planes");
      const y = window.scrollY;
      let inPlans = false;
      if (plans) { const r = plans.getBoundingClientRect(); inPlans = r.top < window.innerHeight * 0.8 && r.bottom > 0; }
      setShow(y > 650 && !inPlans);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-oro/30 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}>
      <a href="#planes" onClick={(e) => { e.preventDefault(); scrollToId("planes"); }} className="btn-cta !min-h-[50px] text-[14px]">Ver planes desde US$ 9,90 →</a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-vino-900 px-5 pb-28 pt-10 text-center text-[13px] text-white/75 md:pb-10">
      <img src="/img/logo-96.webp" alt="Ministerio de Parejas 365" width={64} height={64} className="mx-auto mb-3 rounded-full" loading="lazy" />
      <nav className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2 font-sans">
        <Link to="/fuentes" className="underline-offset-2 hover:underline">Fuentes y gratitud</Link>
        <Link to="/privacidad" className="underline-offset-2 hover:underline">Política de privacidad</Link>
        <Link to="/terminos" className="underline-offset-2 hover:underline">Términos y condiciones</Link>
      </nav>
      <p className="mx-auto max-w-md">© {new Date().getFullYear()} Ministerio de Parejas 365. Producto digital independiente para apoyar la planificación de ministerios de matrimonios. No sustituye la consejería pastoral ni profesional.</p>
      <p className="mx-auto mt-3 max-w-md text-[11px] text-white/55">Este sitio no forma parte de Facebook ni de Meta Platforms, Inc., y no está respaldado por Meta de ninguna manera. Los autores citados en el material no están afiliados a este producto ni lo respaldan.</p>
    </footer>
  );
}
