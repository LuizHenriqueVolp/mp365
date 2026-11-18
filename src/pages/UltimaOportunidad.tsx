import { useEffect } from "react";
import { CHECKOUT, GARANTIA_DIAS, PRECIOS } from "@/config";
import { logEvent, trackPageContent } from "@/lib/tracking";
import { CheckoutButton, Footer, Trust } from "@/components/ui";

const usd = (n: number) => `US$ ${n.toFixed(2).replace(".", ",")}`;

// Destino del back redirect: resumen corto y directo para quien estaba por salir.
// Sin cronómetros ni escasez falsa.
export default function UltimaOportunidad() {
  useEffect(() => {
    trackPageContent("Back redirect", PRECIOS.basico);
    logEvent("view_content", { page: "ultima-oportunidad" });
  }, []);

  return (
    <main>
      <section className="bg-wine-gradient px-5 pb-10 pt-8 text-center text-white">
        <img src="/img/logo-96.webp" alt="Ministerio de Parejas 365" width={56} height={56} className="mx-auto mb-3 h-14 w-14 rounded-full" />
        <div className="eyebrow text-gold-soft!">Antes de irte</div>
        <h1 className="mx-auto mt-3 max-w-md text-[26px] font-bold leading-tight text-white">Empieza con lo esencial por solo {usd(PRECIOS.basico)}</h1>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-white/85">Manual del Líder + 24 encuentros completos para todo el año. Pago único, acceso inmediato y {GARANTIA_DIAS} días de garantía.</p>
        <img src="/img/plan-basico-480.webp" srcSet="/img/plan-basico-480.webp 480w, /img/plan-basico-800.webp 800w" sizes="(max-width: 640px) 80vw, 400px" width={480} height={453} alt="Plan Básico" className="mx-auto mt-4 w-4/5 max-w-[360px]" />
        <div className="mx-auto mt-5 max-w-sm">
          <CheckoutButton href={CHECKOUT.basico} plan="basico" value={PRECIOS.basico} gold>Quiero el Básico</CheckoutButton>
          <Trust light />
        </div>
      </section>

      <section className="mx-auto max-w-xl px-5 py-10">
        <div className="card">
          <h2 className="text-center text-[20px] font-bold">Lo que recibes hoy</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            {["Manual del Líder: cómo dirigir, ambiente seguro y cuándo derivar", "24 encuentros paso a paso (2 por mes durante 12 meses)", "Texto bíblico, enseñanza, dinámica, preguntas y oración en cada encuentro", "6 hojas de trabajo imprimibles", "Versión para celular y versión para imprimir"].map((x) => (
              <li key={x} className="flex gap-2"><span className="text-green-700">✓</span>{x}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 rounded-2xl border-2 border-oro bg-white p-5 text-center">
          <p className="font-sans text-[14px] text-tinta/80">¿Prefieres todo el sistema con dinámicas, rompehielos, 100 preguntas y los 3 bonos? Plan Completo por {usd(PRECIOS.completo)}.</p>
          <div className="mt-3"><CheckoutButton href={CHECKOUT.completo} plan="completo" value={PRECIOS.completo}>Quiero el Completo</CheckoutButton></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
