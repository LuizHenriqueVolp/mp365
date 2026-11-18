import { useEffect } from "react";
import { Link } from "react-router-dom";
import { logEvent } from "@/lib/tracking";
import { Footer } from "@/components/ui";

// Página de agradecimiento post-compra. NO dispara Purchase: la compra la informa la Cakto/UTMify
// (fuente confiable). Así se evita contar compras duplicadas o falsas.
export default function Gracias() {
  useEffect(() => { logEvent("thank_you_view"); }, []);
  return (
    <main>
      <section className="mx-auto max-w-xl px-5 py-14 text-center">
        <img src="/img/logo-192.webp" alt="Ministerio de Parejas 365" width={96} height={96} className="mx-auto rounded-full shadow" />
        <h1 className="mt-6 text-[28px] font-bold">¡Gracias por tu compra!</h1>
        <p className="mt-4 text-[17px] text-tinta/80">En unos minutos recibirás en tu correo electrónico el acceso a todo el material. Revisa también la carpeta de spam o promociones.</p>
        <div className="card mt-6 text-left text-[15px]">
          <p className="font-semibold text-vino">Tus primeros pasos:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Lee el Manual del Líder (menos de una hora).</li>
            <li>Elige la fecha de tu primer encuentro.</li>
            <li>Envía la invitación del mes 1 a tus parejas.</li>
          </ol>
        </div>
        <p className="mt-6 text-[14px] text-tinta/70">¿No recibiste el correo? Revisa la carpeta de spam o promociones, o busca el mensaje de la Cakto con los datos de tu compra.</p>
        <Link to="/" className="mt-6 inline-block font-sans text-[14px] text-vino underline">Volver al inicio</Link>
      </section>
      <Footer />
    </main>
  );
}
