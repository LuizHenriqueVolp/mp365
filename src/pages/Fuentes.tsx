import { Link } from "react-router-dom";
import { Footer, useReveal } from "@/components/ui";

const AUTORES = [
  { a: "John Gottman y Nan Silver", l: "Siete reglas de oro para vivir en pareja", d: "Décadas de investigación con miles de parejas nos ayudaron a entender los hábitos que fortalecen la amistad, el aprecio y la reparación en el matrimonio: la proporción de interacciones positivas, los «mapas del amor» y los cuatro hábitos que desgastan la relación.", usamos: "Encuentros 3, 7, 10, 11, 12 y 17" },
  { a: "Gary Chapman", l: "Los 5 lenguajes del amor", d: "Su propuesta sencilla y profunda nos recuerda que amar bien implica aprender a amar como el otro necesita ser amado.", usamos: "Encuentro 5 y Retiro (sesión 4)" },
  { a: "Emerson Eggerichs", l: "Amor y respeto", d: "Su lectura de Efesios 5:33 ayudó a muchas parejas a reconocer y romper ciclos de reacción negativa.", usamos: "Encuentro 6 y Retiro (sesión 4)" },
  { a: "Sue Johnson", l: "Abrázame fuerte", d: "Nos enseñó a ver, detrás de muchas discusiones, una pregunta profunda: «¿Estás ahí para mí?».", usamos: "Encuentro 22 y Retiro (sesión 2)" },
  { a: "Timothy Keller y Kathy Keller", l: "El significado del matrimonio", d: "Nos recuerdan que el matrimonio es un pacto que refleja el amor de Cristo y que se vive con la ayuda del evangelio.", usamos: "Manual del Líder (las bases de este material)" },
];

export default function Fuentes() {
  useReveal();
  return (
    <main>
      <header className="bg-wine-gradient px-5 pb-10 pt-8 text-center text-white">
        <Link to="/"><img src="/img/logo-96.webp" alt="Ministerio de Parejas 365" width={64} height={64} className="mx-auto mb-4 rounded-full" /></Link>
        <div className="eyebrow text-gold-soft!">Fuentes y gratitud</div>
        <h1 className="mx-auto mt-3 max-w-md text-[28px] font-bold text-white">Sobre hombros de gigantes</h1>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-white/85">Nuestro fundamento es la Biblia. Y queremos agradecer a quienes, con sus investigaciones y libros, han ayudado a la iglesia a acompañar mejor a los matrimonios.</p>
      </header>
      <section className="mx-auto max-w-xl px-5 py-10">
        <p className="mb-6 text-[16px]">Ministerio de Parejas 365 fue preparado por nuestro <b>Equipo Editorial</b>, formado por servidores que acompañan matrimonios en iglesias locales. En cada encuentro donde usamos una idea de estos autores, los citamos por nombre y explicamos el concepto con nuestras propias palabras.</p>
        <div className="space-y-4">
          {AUTORES.map((x) => (
            <article key={x.a} data-reveal className="card">
              <div className="font-serif text-[21px] italic leading-tight text-vino">{x.l}</div>
              <div className="mt-1 font-sans text-[13px] font-semibold text-oro">{x.a}</div>
              <p className="mt-3 text-[15px] text-tinta/85">{x.d}</p>
              <p className="mt-2 font-sans text-[12.5px] text-tinta/60">Dónde lo citamos: {x.usamos}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-white p-5 text-[14px] text-tinta/75">
          <p><b>Importante:</b> ninguno de estos autores participó en la creación de este material ni lo respalda, y este producto no está afiliado a ellos ni a sus editoriales. Te animamos a leer sus obras completas para profundizar.</p>
          <p className="mt-3">Texto bíblico tomado de la Santa Biblia Reina-Valera 1960™ © Sociedades Bíblicas en América Latina, 1960. Renovado © Sociedades Bíblicas Unidas, 1988. Utilizado con permiso.</p>
        </div>
        <div className="mt-8 text-center"><Link to="/#planes" className="btn-cta">Ver el material →</Link></div>
      </section>
      <Footer />
    </main>
  );
}
