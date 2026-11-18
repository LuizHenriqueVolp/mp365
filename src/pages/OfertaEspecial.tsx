import { useEffect, useRef } from "react";
import { CHECKOUT, PRECIOS, UPSELL_CAKTO_HTML } from "@/config";
import { logEvent, trackPageContent } from "@/lib/tracking";
import { CheckoutButton, Footer, Trust, useReveal } from "@/components/ui";

const usd = (n: number) => `US$ ${n.toFixed(2).replace(".", ",")}`;

/** Inserta el HTML del "Gerador de Upsell" de la Cakto y ejecuta sus scripts (compra en 1 clic). */
function CaktoUpsell({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !html) return;
    el.innerHTML = html;
    el.querySelectorAll("script").forEach((old) => {
      const s = document.createElement("script");
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.text = old.text;
      old.replaceWith(s);
    });
    el.addEventListener("click", () => logEvent("checkout_click", { plan: "upsell", value: PRECIOS.upsell }), { once: true });
  }, [html]);
  return <div ref={ref} className="cakto-upsell" />;
}

const INCLUYE = [
  "Dos formatos listos: retiro de un día o de fin de semana",
  "Cronograma completo, hora por hora",
  "6 sesiones con texto bíblico, enseñanza y dinámica",
  "Cena de gala «Como el primer día» con guion de preguntas",
  "Fogata de testimonios y 2 devocionales en pareja",
  "Ceremonia de renovación de pacto con texto de votos",
  "Logística paso a paso: 90, 60, 30 y 7 días antes",
  "Equipos de servicio, presupuesto modelo y formulario de inscripción",
];

export default function OfertaEspecial() {
  useReveal();
  useEffect(() => {
    trackPageContent("Upsell Retiro de Parejas", PRECIOS.upsell);
    logEvent("upsell_view");
  }, []);

  return (
    <main>
      <div className="bg-green-700 px-4 py-2.5 text-center font-sans text-[13px] font-bold text-white">✅ ¡Tu compra fue aprobada! Revisa tu correo electrónico.</div>
      <section className="mx-auto max-w-xl px-5 pb-10 pt-8 text-center">
        <div className="eyebrow">Espera: oferta única para esta página</div>
        <h1 className="mt-3 text-[28px] font-bold leading-tight">Lleva a tus parejas a un retiro inolvidable, sin organizarlo desde cero</h1>
        <p className="mt-4 text-[17px] text-tinta/80">Agrega el <b>Retiro de Parejas Listo «Cordón de Tres»</b>: todo lo que necesitas para organizar un retiro completo, de la invitación a la renovación de pacto.</p>
        <img src="/img/upsell-retiro-480.webp" srcSet="/img/upsell-retiro-480.webp 480w, /img/upsell-retiro-800.webp 800w" sizes="(max-width: 640px) 100vw, 520px" width={480} height={432} alt="Retiro de Parejas Listo" className="mx-auto mt-5" />
      </section>

      <section data-reveal className="mx-auto max-w-xl px-5 pb-8">
        <div className="card">
          <h2 className="mb-3 text-center text-[20px] font-bold">Lo que incluye</h2>
          <ul className="space-y-2 text-[15px]">{INCLUYE.map((x) => <li key={x} className="flex gap-2"><span className="text-green-700">✓</span>{x}</li>)}</ul>
        </div>
        <p className="mt-5 text-center text-[15px] text-tinta/80">Un retiro bien organizado puede lograr en un fin de semana lo que a veces no se logra en meses de reuniones. Con esta guía, tu equipo sabe exactamente qué hacer en cada momento.</p>
      </section>

      <section data-reveal className="bg-wine-gradient px-5 py-10 text-center text-white">
        <div className="mx-auto max-w-sm">
          <div className="font-sans text-[13px] text-white/75">Solo en esta página · pago único</div>
          <div className="font-display text-[48px] font-bold leading-none text-oro-light">{usd(PRECIOS.upsell)}</div>
          {UPSELL_CAKTO_HTML ? (
            <div className="mt-5 rounded-2xl bg-white p-4 text-tinta"><CaktoUpsell html={UPSELL_CAKTO_HTML} /></div>
          ) : (
            <>
              <div className="mt-5"><CheckoutButton href={CHECKOUT.upsellAceptar} plan="upsell" value={PRECIOS.upsell} gold>Sí, quiero agregar el Retiro →</CheckoutButton></div>
              <a href={CHECKOUT.upsellRechazar} onClick={() => logEvent("upsell_decline")} className="mt-6 inline-block font-sans text-[13px] text-white/70 underline underline-offset-4">No, gracias. Prefiero organizar el retiro por mi cuenta.</a>
            </>
          )}
          <Trust light />
        </div>
      </section>
      <Footer />
    </main>
  );
}
