import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/ui";
import { GARANTIA_DIAS } from "@/config";

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main>
      <section className="mx-auto max-w-xl px-5 py-10 text-[15px] leading-relaxed">
        <Link to="/" className="font-sans text-[13px] text-vino underline">← Volver</Link>
        <h1 className="mb-5 mt-4 text-[26px] font-bold">{title}</h1>
        <div className="space-y-4 text-tinta/85">{children}</div>
        <p className="mt-8 text-[13px] text-tinta/60">Última actualización: noviembre de 2026.</p>
      </section>
      <Footer />
    </main>
  );
}

export function Privacidad() {
  return (
    <Page title="Política de privacidad">
      <p>Ministerio de Parejas 365 respeta tu privacidad. Esta política explica qué datos recopilamos y cómo los usamos.</p>
      <p><b>Datos de navegación.</b> Usamos cookies y tecnologías similares, como el píxel de Meta y parámetros UTM, para medir visitas, entender qué anuncios funcionan y mejorar nuestras campañas. También registramos eventos anónimos de navegación (páginas vistas y clics en botones) en nuestra propia base de datos.</p>
      <p><b>Datos de compra.</b> Los pagos se procesan en la plataforma de pago (Cakto). Nosotros no almacenamos los datos de tu tarjeta. La plataforma nos comparte tu nombre y correo electrónico para entregarte el producto y darte soporte.</p>
      <p><b>Tus derechos.</b> Puedes solicitar el acceso, la corrección o la eliminación de tus datos a través del soporte de la plataforma de pago (Cakto), indicando el correo de tu compra. Puedes bloquear las cookies desde la configuración de tu navegador.</p>
      <p><b>Terceros.</b> Meta Platforms puede usar los datos del píxel según su propia política de privacidad.</p>
    </Page>
  );
}

export function Terminos() {
  return (
    <Page title="Términos y condiciones">
      <p><b>Producto.</b> Ministerio de Parejas 365 es un producto digital (archivos PDF e imágenes) para apoyar la planificación de encuentros en ministerios de matrimonios. El acceso se envía por correo electrónico después de la confirmación del pago.</p>
      <p><b>Licencia de uso.</b> Al comprar, recibes una licencia personal y ministerial: puedes usar el material e imprimir las copias necesarias para tu ministerio o iglesia local. No está permitida la reventa, la distribución pública ni la publicación del material en internet.</p>
      <p><b>Garantía.</b> Tienes {GARANTIA_DIAS} días desde la compra para solicitar el reembolso por la plataforma de pago, sin necesidad de justificar el motivo.</p>
      <p><b>Alcance.</b> El material es educativo y devocional. No sustituye la consejería pastoral, psicológica ni médica. Ante situaciones de violencia, adicciones o riesgo, busca ayuda profesional y comunícate con los servicios de emergencia de tu país.</p>
      <p><b>Autores citados.</b> Las referencias a obras de otros autores se hacen con fines educativos. Esos autores no están afiliados a este producto ni lo respaldan.</p>
      <p><b>Soporte.</b> Cualquier solicitud se atiende por medio de la plataforma de pago (Cakto), con el correo usado en la compra.</p>
    </Page>
  );
}
