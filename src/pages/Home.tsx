import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BACK_REDIRECT_PATH, CHECKOUT, PRECIOS, TESTIMONIOS } from "@/config";
import { setupBackRedirect, trackViewContent } from "@/lib/tracking";
import { CheckoutButton, Counter, CtaToPlans, Footer, Section, StickyCta, Title, Trust, useReveal } from "@/components/ui";

const usd = (n: number) => `US$ ${n.toFixed(2).replace(".", ",")}`;

const DOLORES = [
  "Llega el día del encuentro y todavía no sabes qué vas a enseñar.",
  "Buscas ideas en internet y encuentras material suelto, sin orden ni base bíblica.",
  "Repites las mismas dinámicas y sientes que el grupo pierde el interés.",
  "Sirves con amor, pero con poco tiempo: trabajo, familia y ministerio a la vez.",
];

const INCLUIDO = [
  { n: 24, t: "Encuentros completos", d: "Dos por mes durante 12 meses. Cada uno con texto bíblico, enseñanza en 3 puntos, dinámica, preguntas y oración." },
  { n: 50, t: "Dinámicas", d: "Comunicación, conexión, diversión, vida espiritual, perdón y grupo grande." },
  { n: 40, t: "Rompehielos", d: "Rápidos, para conocerse, en movimiento y con propósito espiritual." },
  { n: 100, t: "Preguntas para conectar", d: "En 8 categorías, para los encuentros, las citas y la vida diaria." },
  { n: 1, t: "Manual del Líder", d: "Cómo dirigir, crear un ambiente seguro, manejar situaciones difíciles y saber cuándo derivar." },
];

const DENTRO = [
  { img: "dentro-encuentro-1", cap: "Encuentro 1: el diseño de Dios para el matrimonio" },
  { img: "dentro-encuentro-2", cap: "Cada encuentro, paso a paso" },
  { img: "dentro-manual", cap: "Manual del Líder" },
  { img: "dentro-dinamicas", cap: "50 dinámicas con objetivo y tiempo" },
  { img: "dentro-rompehielos", cap: "40 rompehielos" },
  { img: "dentro-preguntas", cap: "100 preguntas para conectar" },
];

const AGENDA = [
  ["10 min", "Bienvenida", "Recibe a cada pareja con un guion sencillo."],
  ["10 min", "Rompehielos", "Risas y confianza desde el primer minuto."],
  ["20 min", "Enseñanza", "Texto bíblico y tres puntos claros, listos para leer."],
  ["20 min", "Dinámica en pareja", "El corazón del encuentro: una experiencia que se recuerda."],
  ["15 min", "Conversación en grupos", "Preguntas que abren el corazón sin exponer a nadie."],
  ["10 min", "Compromiso y oración", "Un paso práctico para la semana y oración de cierre."],
];

const MESES = [
  ["Fundamentos", "El diseño de Dios · Prioridades"], ["Comunicación", "Palabras que edifican · Escuchar"],
  ["Amor que se expresa", "Lenguajes del amor · Amor y respeto"], ["Conflictos sanos", "Discutir sin herir · El perdón"],
  ["Finanzas y metas", "Finanzas en pareja · Sueños"], ["Amistad e intimidad", "Amigos para siempre · Gratitud"],
  ["Vida espiritual", "Orar juntos · Familia de origen"], ["Familia", "Criar en unidad · Intimidad"],
  ["Temporadas", "Bajo presión · Las estaciones"], ["Servicio", "Servirse · Confianza"],
  ["Renovación", "Descanso · Sanar heridas"], ["Propósito", "Matrimonio con propósito · Renovación del pacto"],
];

const BONOS = [
  { img: "bono-1-kit-conexion", t: "Kit Conexión Durante la Semana", d: "30 tarjetas con versículos y 24 retos semanales para que el encuentro continúe en casa.", v: PRECIOS.bonos.conexion },
  { img: "bono-2-kit-comunicacion", t: "Kit de Comunicación para Eventos", d: "12 invitaciones digitales para WhatsApp, 12 carteles para imprimir y mensajes listos para invitar y hacer seguimiento.", v: PRECIOS.bonos.comunicacion },
  { img: "bono-3-kit-organizacion", t: "Kit de Organización Ministerial", d: "6 planners (anual, mensual, asistencia, presupuesto y más), 3 certificados y 8 separadores.", v: PRECIOS.bonos.organizacion },
];

const FUENTES = [
  ["John Gottman y Nan Silver", "Siete reglas de oro para vivir en pareja"],
  ["Gary Chapman", "Los 5 lenguajes del amor"],
  ["Emerson Eggerichs", "Amor y respeto"],
  ["Sue Johnson", "Abrázame fuerte"],
  ["Timothy y Kathy Keller", "El significado del matrimonio"],
];

const FAQ = [
  ["¿El material es físico o digital?", "Es 100 % digital (PDF). Recibes el acceso en tu correo electrónico inmediatamente después de la confirmación del pago."],
  ["¿Puedo usarlo en el celular?", "Sí. Cada libro viene en dos formatos: una versión diseñada para leer cómodamente en el celular y una versión A5 para imprimir."],
  ["¿Puedo imprimir y compartir con mi equipo?", "Puedes imprimir todas las copias que necesites para tu ministerio. No está permitida la reventa ni la distribución pública."],
  ["¿Necesito experiencia para usarlo?", "No. Los encuentros están pensados para líderes sin experiencia previa: cada parte tiene tiempos, instrucciones y una nota para el líder."],
  ["¿Sirve para cualquier iglesia?", "Está pensado para iglesias cristianas de diferentes denominaciones. Se centra en principios bíblicos sobre el matrimonio y usa la versión Reina-Valera 1960."],
  ["¿En qué moneda pago?", "El precio está en dólares estadounidenses. Tu banco o tarjeta hace la conversión a tu moneda local; según tu país, el checkout puede mostrar otras formas de pago."],
  ["¿Y si el material no es lo que esperaba?", "Tienes 7 días de garantía. Si no te sirve, solicitas el reembolso por la plataforma de pago y recibes el 100 % de tu dinero."],
  ["¿Reemplaza la consejería matrimonial?", "No. Es un recurso para encuentros grupales. El Manual del Líder explica cuándo y cómo derivar casos que necesitan acompañamiento pastoral o profesional."],
];

export default function Home() {
  useReveal();
  useEffect(() => { trackViewContent(); }, []);
  useEffect(() => setupBackRedirect(BACK_REDIRECT_PATH), []);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="overflow-x-hidden">
      {/* Barra superior */}
      <div className="bg-vino-900 px-4 py-2 text-center font-sans text-[12px] font-semibold tracking-wide text-oro-light">
        Para líderes de ministerios de matrimonios
      </div>

      {/* HERO */}
      <header className="relative bg-[radial-gradient(circle_at_50%_0%,#fff_0%,#FBF6EE_60%)] px-5 pb-10 pt-7 text-center">
        <img src="/img/logo-96.webp" alt="Ministerio de Parejas 365" width={56} height={56} className="mx-auto mb-3 h-12 w-12 rounded-full shadow" />
        <div className="eyebrow">Sistema para líderes de matrimonios</div>
        <h1 className="mx-auto mt-3 max-w-lg text-[27px] font-bold leading-[1.14] sm:text-[36px]">
          Un año completo de encuentros de parejas, listos para aplicar
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[17px] text-tinta/80">
          24 encuentros paso a paso, 50 dinámicas, 40 rompehielos y 100 preguntas. Deja de improvisar cada semana y dedica tu tiempo a <b>cuidar a las parejas</b>.
        </p>
        <img
          src="/img/hero-640.webp" srcSet="/img/hero-640.webp 640w, /img/hero-1100.webp 1100w" sizes="(max-width: 640px) 100vw, 560px"
          width={640} height={560} alt="Libros y celular con el sistema Ministerio de Parejas 365" fetchPriority="high"
          className="mx-auto mt-5 w-full max-w-[560px]"
        />
        <div className="mx-auto mt-4 max-w-sm"><CtaToPlans /><Trust /></div>
        <p className="mt-3 font-sans text-[13px] font-semibold text-vino">Desde US$ 9,90 · pago único</p>
        <p className="mt-1 font-sans text-[12px] text-tinta/60">📱 Versión para celular + 🖨️ versión para imprimir</p>
      </header>

      {/* DOLOR */}
      <div className="bg-white">
        <Section track="dolor">
          <Title eyebrow="¿Te identificas?">Liderar matrimonios es un privilegio. Prepararlo todo cada semana agota.</Title>
          <ul className="space-y-3">
            {DOLORES.map((d) => (
              <li key={d} className="flex gap-3 rounded-xl bg-crema p-4"><span className="text-vino">✕</span><span>{d}</span></li>
            ))}
          </ul>
          <p className="mt-6 text-center font-serif text-[24px] italic text-vino">No te falta llamado. Te falta un sistema.</p>
        </Section>
      </div>

      {/* QUÉ RECIBES */}
      <Section id="incluye" track="incluye">
        <Title eyebrow="Todo listo para tus próximos encuentros" sub="Organizado para un año entero, para que solo tengas que elegir, preparar y aplicar.">Lo que vas a recibir</Title>
        <div className="space-y-3">
          {INCLUIDO.map((x) => (
            <div key={x.t} className="card flex items-start gap-4">
              <div className="min-w-[64px] text-center font-display text-[34px] font-bold leading-none text-oro"><Counter to={x.n} /></div>
              <div><h3 className="text-[17px] font-bold">{x.t}</h3><p className="mt-1 text-[15px] text-tinta/80">{x.d}</p></div>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-oro bg-white/60 p-4 text-center font-sans text-[14px]">
            + 6 hojas de trabajo imprimibles · versión celular y versión para imprimir
          </div>
        </div>
      </Section>

      {/* MÉTODO */}
      <div className="bg-vino-900 text-white">
        <Section track="metodo">
          <div className="mb-6 text-center">
            <div className="eyebrow">Sistema Encuentro Listo</div>
            <h2 className="mt-2 text-[26px] font-bold text-white">Menos tiempo preparando. Más tiempo cuidando a las personas.</h2>
          </div>
          <div className="grid gap-3">
            {[["1", "Elige", "Abre el calendario anual y elige el encuentro del mes."], ["2", "Prepara", "Lee el encuentro, reúne materiales sencillos y ora por las parejas."], ["3", "Aplica", "Sigue el guion con tiempos sugeridos. Sin improvisar."]].map(([n, t, d]) => (
              <div key={n} className="flex items-center gap-4 rounded-2xl border border-oro/40 bg-white/5 p-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-oro-light font-display text-[20px] font-bold text-vino-900">{n}</span>
                <div><div className="font-display text-[19px] text-oro-light">{t}</div><p className="text-[15px] text-white/85">{d}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[15px] text-white/80">¿Primera vez como líder? Los materiales están pensados para líderes sin experiencia previa.</p>
        </Section>
      </div>

      {/* MIRA POR DENTRO */}
      <section data-reveal data-track="por-dentro" className="py-12">
        <div className="px-5"><Title eyebrow="Mira por dentro" sub="Desliza para ver las páginas →">Así es el material en tu celular</Title></div>
        <div className="snap-row">
          {DENTRO.map((x) => (
            <figure key={x.img} className="rounded-3xl bg-white p-2 shadow-sm">
              <img src={`/img/${x.img}-420.webp`} srcSet={`/img/${x.img}-420.webp 420w, /img/${x.img}-700.webp 700w`} sizes="300px" width={420} height={513} loading="lazy" alt={x.cap} className="rounded-2xl" />
              <figcaption className="px-2 py-2 text-center font-sans text-[13px] font-semibold text-vino">{x.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ESTRUCTURA */}
      <div className="bg-white">
        <Section track="estructura">
          <Title eyebrow="75 a 90 minutos" sub="Cada uno de los 24 encuentros sigue la misma estructura probada.">Cómo es un encuentro</Title>
          <ol className="relative ml-3 border-l-2 border-oro/50">
            {AGENDA.map(([t, h, d]) => (
              <li key={h} className="mb-5 ml-5">
                <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-vino" />
                <div className="font-sans text-[12px] font-bold uppercase tracking-wider text-oro">{t}</div>
                <div className="font-display text-[18px] text-vino">{h}</div>
                <p className="text-[15px] text-tinta/80">{d}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {/* CALENDARIO */}
      <Section track="calendario">
        <Title eyebrow="12 meses · 24 encuentros" sub="Una progresión pensada para que el grupo crezca mes a mes.">Tu año ya está planificado</Title>
        <div className="grid grid-cols-2 gap-2">
          {MESES.map(([t, d], i) => (
            <div key={t} className="rounded-xl border border-[#eadfcf] bg-white p-3">
              <div className="font-sans text-[11px] font-bold uppercase tracking-wider text-oro">Mes {i + 1}</div>
              <div className="font-display text-[15px] leading-tight text-vino">{t}</div>
              <div className="mt-1 text-[12.5px] leading-snug text-tinta/70">{d}</div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-sm"><CtaToPlans /></div>
      </Section>

      {/* BONOS */}
      <div className="bg-[linear-gradient(180deg,#fff,#FBF6EE)]">
        <Section track="bonos">
          <Title eyebrow="Incluidos en el plan Completo" sub="Recursos para que el ministerio funcione fuera del encuentro también.">3 bonos de regalo</Title>
          <div className="space-y-5">
            {BONOS.map((b, i) => (
              <div key={b.t} className="card overflow-hidden !p-0">
                <img src={`/img/${b.img}-480.webp`} srcSet={`/img/${b.img}-480.webp 480w, /img/${b.img}-800.webp 800w`} sizes="(max-width: 640px) 100vw, 520px" width={480} height={460} loading="lazy" alt={b.t} className="mx-auto w-full bg-crema" />
                <div className="p-5">
                  <div className="eyebrow">Bono {i + 1}</div>
                  <h3 className="mt-1 text-[19px] font-bold">{b.t}</h3>
                  <p className="mt-2 text-[15px] text-tinta/80">{b.d}</p>
                  <div className="mt-3 flex items-center justify-between font-sans text-[13px]">
                    <span className="text-tinta/60">Valor individual: {usd(b.v)}</span>
                    <span className="rounded-full bg-vino px-3 py-1 font-bold text-white">Incluido</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* FUNDAMENTOS / AUTORIDAD */}
      <Section track="fundamentos">
        <Title eyebrow="Base sólida" sub="Cada encuentro parte de la Biblia (RVR1960) y se apoya en obras reconocidas sobre el matrimonio, citadas con claridad.">Fundamentado en la Palabra y en autores reconocidos</Title>
        <div className="space-y-2">
          {FUENTES.map(([a, l]) => (
            <div key={a} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-crema text-[18px]">📖</span>
              <div><div className="font-serif text-[18px] italic leading-tight text-vino">{l}</div><div className="font-sans text-[12.5px] text-tinta/70">{a}</div></div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[13px] text-tinta/60">Preparado por el Equipo Editorial de Ministerio de Parejas 365. Los autores citados no están afiliados a este producto ni lo respaldan.</p>
        <p className="mt-2 text-center"><Link to="/fuentes" className="font-sans text-[14px] font-semibold text-vino underline underline-offset-4">Ver fuentes y agradecimientos →</Link></p>
      </Section>

      {/* TESTIMONIOS (reales y autorizados) */}
      {TESTIMONIOS.length > 0 && (
        <section data-reveal data-track="testimonios" className="bg-white py-12">
          <div className="px-5"><Title eyebrow="Testimonios" sub="Desliza para ver más →">Lo que dicen quienes ya conocen Ministerio de Parejas 365</Title></div>
          <div className="snap-row">
            {TESTIMONIOS.map((t) => (
              <figure key={t.nombre} className="overflow-hidden rounded-2xl border border-[#eadfcf] bg-crema shadow-sm">
                <img src={t.img} alt={`Mensaje de ${t.nombre}`} loading="lazy" decoding="async" width={340} height={420} className="h-auto w-full" />
                <figcaption className="px-3 py-2 text-center font-sans text-[13px] font-semibold text-vino">{t.nombre}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mx-auto mt-4 max-w-sm px-5"><CtaToPlans>Quiero mis encuentros listos</CtaToPlans></div>
        </section>
      )}

      {/* PARA QUIÉN */}
      <div className="bg-white">
        <Section track="para-quien">
          <Title eyebrow="Para quién es">¿Este material es para ti?</Title>
          <div className="card">
            {["Líderes de ministerios de matrimonios, nuevos o con experiencia.", "Pastores que quieren fortalecer los matrimonios de su iglesia.", "Parejas que dirigen células o grupos pequeños de matrimonios.", "Iglesias que quieren iniciar un ministerio de parejas."].map((x) => (
              <p key={x} className="flex gap-3 py-1.5"><span className="text-green-700">✓</span>{x}</p>
            ))}
            <div className="gold-rule my-3" />
            {["No es terapia de pareja ni consejería profesional.", "No es un curso en video: es material listo para leer y aplicar."].map((x) => (
              <p key={x} className="flex gap-3 py-1.5 text-tinta/70"><span className="text-vino">✕</span>{x}</p>
            ))}
          </div>
        </Section>
      </div>

      {/* PLANES */}
      <section id="planes" data-reveal data-track="planes" className="bg-[radial-gradient(circle_at_50%_0%,#8A1D33,#6E1426_45%,#4A0D19)] px-5 py-14">
        <div className="mx-auto max-w-xl">
          <div className="mb-8 text-center">
            <div className="eyebrow !text-oro-light">Elige tu plan</div>
            <h2 className="mt-2 text-[28px] font-bold text-white">Empieza hoy tu año de encuentros</h2>
            <p className="mt-2 text-[15px] text-white/80">Pago único · Acceso inmediato · Tuyo para siempre</p>
          </div>

          {/* Completo primero en el celular */}
          <div className="relative rounded-3xl border-2 border-oro-light bg-white p-6 shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-oro-light px-4 py-1 font-sans text-[12px] font-bold uppercase tracking-wider text-vino-900">⭐ Recomendado</div>
            <h3 className="text-center text-[22px] font-bold">Plan Completo</h3>
            <img src="/img/plan-completo-480.webp" srcSet="/img/plan-completo-480.webp 480w, /img/plan-completo-800.webp 800w" sizes="(max-width: 640px) 90vw, 480px" width={480} height={366} loading="lazy" alt="Plan Completo" className="mx-auto my-3" />
            <ul className="space-y-1.5 text-[15px]">
              {["Manual del Líder", "24 encuentros completos", "50 dinámicas", "40 rompehielos", "100 preguntas para conectar", "6 hojas de trabajo imprimibles", "Versión celular + versión para imprimir"].map((x) => <li key={x} className="flex gap-2"><span className="text-green-700">✓</span>{x}</li>)}
              {BONOS.map((b, i) => <li key={b.t} className="flex gap-2 font-semibold text-vino"><span>🎁</span>Bono {i + 1}: {b.t}</li>)}
            </ul>
            <div className="mt-5 text-center">
              <div className="font-sans text-[13px] text-tinta/60">Pago único</div>
              <div className="font-display text-[46px] font-bold leading-none text-vino">{usd(PRECIOS.completo)}</div>
              <div className="mt-1 font-sans text-[13px] font-semibold text-green-800">Solo {usd(PRECIOS.completo - PRECIOS.basico)} más que el Básico y te llevas todo</div>
            </div>
            <div className="mt-4"><CheckoutButton href={CHECKOUT.completo} plan="completo" value={PRECIOS.completo}>Quiero el plan Completo →</CheckoutButton></div>
            <Trust />
          </div>

          <div className="mt-6 rounded-3xl bg-white/95 p-6">
            <h3 className="text-center text-[20px] font-bold">Plan Básico</h3>
            <img src="/img/plan-basico-480.webp" srcSet="/img/plan-basico-480.webp 480w, /img/plan-basico-800.webp 800w" sizes="(max-width: 640px) 80vw, 400px" width={480} height={453} loading="lazy" alt="Plan Básico" className="mx-auto my-3 w-3/4" />
            <ul className="space-y-1.5 text-[15px]">
              {["Manual del Líder", "24 encuentros completos", "6 hojas de trabajo imprimibles", "Versión celular + versión para imprimir"].map((x) => <li key={x} className="flex gap-2"><span className="text-green-700">✓</span>{x}</li>)}
              {["50 dinámicas, 40 rompehielos y 100 preguntas", "Los 3 bonos"].map((x) => <li key={x} className="flex gap-2 text-tinta/45 line-through"><span>✕</span>{x}</li>)}
            </ul>
            <div className="mt-5 text-center"><div className="font-display text-[36px] font-bold leading-none text-vino">{usd(PRECIOS.basico)}</div></div>
            <div className="mt-4"><CheckoutButton href={CHECKOUT.basico} plan="basico" value={PRECIOS.basico}><span className="normal-case">Quiero solo el Básico</span></CheckoutButton></div>
          </div>
          <p className="mt-5 text-center font-sans text-[12.5px] text-white/75">Precios en dólares estadounidenses. Tu banco hace la conversión a tu moneda local.</p>
        </div>
      </section>

      {/* GARANTÍA */}
      <Section track="garantia" className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-oro bg-white font-display text-[15px] font-bold leading-tight text-vino shadow">7 DÍAS<br />DE GARANTÍA</div>
        <h2 className="mt-5 text-[24px] font-bold">Conoce todo el material con tranquilidad</h2>
        <p className="mt-3 text-[16px] text-tinta/80">Tienes 7 días para revisar cada encuentro. Si sientes que no es para tu ministerio, solicitas el reembolso por la plataforma de pago y te devolvemos el 100 % de tu dinero. Sin preguntas incómodas.</p>
      </Section>

      {/* FAQ */}
      <div className="bg-white">
        <Section track="faq">
          <Title eyebrow="Dudas frecuentes">Preguntas frecuentes</Title>
          <div className="divide-y divide-[#eadfcf] rounded-2xl border border-[#eadfcf] bg-white">
            {FAQ.map(([q, a], i) => (
              <div key={q}>
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-4 text-left font-sans text-[15px] font-semibold text-vino" aria-expanded={open === i}>
                  {q}<span className={`text-oro transition-transform ${open === i ? "rotate-45" : ""}`}>＋</span>
                </button>
                <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><p className="overflow-hidden px-4 text-[15px] text-tinta/80"><span className="block pb-4">{a}</span></p></div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* CIERRE */}
      <Section track="cierre" className="text-center">
        <p className="font-serif text-[22px] italic text-vino">«Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto.»</p>
        <p className="mt-2 font-sans text-[12px] font-bold uppercase tracking-widest text-oro">Eclesiastés 4:12 · RVR1960</p>
        <h2 className="mt-6 text-[24px] font-bold">Tu próximo encuentro puede estar listo hoy</h2>
        <div className="mx-auto mt-5 max-w-sm"><CtaToPlans /><Trust /></div>
      </Section>

      <Footer />
      <StickyCta />
    </main>
  );
}
