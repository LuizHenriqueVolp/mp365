# -*- coding: utf-8 -*-
import os, sys
from base import *
from encuentros_a import ENCUENTROS_A
from encuentros_b import ENCUENTROS_B
from manual import MANUAL
from dinamicas import DINAMICAS
from rompehielos_preguntas import ROMPEHIELOS, PREGUNTAS
from anexos_bonos import *
from retiro import *

OUT = os.path.join(ROOT, "out/productos"); os.makedirs(OUT, exist_ok=True)
MOB = os.path.join(ROOT, "out/productos/Version-Celular"); os.makedirs(MOB, exist_ok=True)
def both(body, name):
    render_pdf(doc(body), f"{OUT}/{name}.pdf")
    render_pdf(doc(body, size="108mm 192mm", margin="9mm 8mm 11mm"), f"{MOB}/{name}-CELULAR.pdf")
ENC = ENCUENTROS_A + ENCUENTROS_B

FUENTES = [
("John Gottman y Nan Silver", "Siete reglas de oro para vivir en pareja", "Décadas de investigación con miles de parejas nos ayudaron a entender los hábitos que fortalecen la amistad, el aprecio y la reparación en el matrimonio."),
("Gary Chapman", "Los 5 lenguajes del amor", "Su propuesta sencilla y profunda nos recuerda que amar bien implica aprender a amar como el otro necesita."),
("Emerson Eggerichs", "Amor y respeto", "Su lectura de Efesios 5:33 ayudó a muchas parejas a reconocer y romper ciclos de reacción negativa."),
("Sue Johnson", "Abrázame fuerte", "Nos enseñó a ver, detrás de muchas discusiones, una pregunta profunda: «¿Estás ahí para mí?»."),
("Timothy Keller y Kathy Keller", "El significado del matrimonio", "Nos recuerdan que el matrimonio es un pacto que refleja el amor de Cristo y que se vive con la ayuda del evangelio."),
]

def fuentes_section():
    items = "".join(f"<div class='box'><div class='lbl' style='margin-top:0'>{esc(a)}</div><p><i>{esc(t)}</i></p><p style='font-size:9.5pt;margin-top:3px'>{esc(d)}</p></div>" for a,t,d in FUENTES)
    return f"""<section class='pb'><div class='eyebrow'>Fuentes y gratitud</div><h2 style='font-size:17pt;margin:4px 0'>Sobre hombros de gigantes</h2><div class='rule'></div>
<p>Este sistema fue preparado por el <b>Equipo Editorial de Ministerio de Parejas 365</b>, formado por servidores que acompañan matrimonios en iglesias locales. Nuestro fundamento es la Biblia. Además, queremos expresar nuestra gratitud a autores e investigadores cuyas obras publicadas han enriquecido la forma en que la iglesia acompaña a los matrimonios:</p>
{items}
<p class='foot-note'>Ninguno de estos autores participó en la creación de este material ni lo respalda. Citamos sus ideas con nuestras propias palabras y te animamos a leer sus libros completos para profundizar.</p></section>"""

def toc(title, entries):
    rows = "".join(f"<div style='display:flex;gap:8px;border-bottom:1px dotted #d8c8b0;padding:4px 0'><span style='font:700 8pt Montserrat;color:{GOLD};min-width:22px'>{n}</span><span>{esc(t)}</span></div>" for n,t in entries)
    return f"<section class='pb'><div class='eyebrow'>Contenido</div><h2 style='font-size:17pt;margin:4px 0 8px'>{esc(title)}</h2>{rows}</section>"

# ---------- 1. MANUAL DEL LÍDER ----------
def manual():
    body = cover("Guía de inicio", "Manual del Líder", "Todo lo que necesitas para dirigir con confianza, aunque sea tu primer año")
    body += toc("Manual del Líder", [(f"{i+1:02d}", t) for i,(t,_) in enumerate(MANUAL)] + [("—", "Fuentes y gratitud")])
    for i,(t,ps) in enumerate(MANUAL):
        body += f"<section class='pb'><div class='eyebrow'>Capítulo {i+1:02d}</div><h2 style='font-size:18pt;margin:4px 0'>{esc(t)}</h2><div class='rule'></div>{para(ps)}</section>"
    body += fuentes_section() + legal()
    both(body, "01-Manual-del-Lider")

# ---------- 2. 24 ENCUENTROS ----------
def encuentro_html(e):
    ens = "".join(f"<div class='box'><div class='lbl' style='margin-top:0'>{i+1}. {esc(t)}</div><p>{esc(x)}</p></div>" for i,(t,x) in enumerate(e["ensenanza"]))
    din_name, pasos = e["dinamica"]
    return f"""<section class='pb'>
<div style='display:flex;justify-content:space-between;align-items:center'><span class='tag'>Encuentro {e['n']:02d}</span><span class='eyebrow'>{esc(e['mes'])}</span></div>
<h2 style='font-size:19pt;margin:8px 0 2px'>{esc(e['titulo'])}</h2><div class='sub'>{esc(e['sub'])}</div>
<div class='verse'><p>«{esc(e['vers'][0])}»</p><cite>{esc(e['vers'][1])} · RVR1960</cite></div>
<div class='lbl'>Objetivo</div><p>{esc(e['objetivo'])}</p>
<div class='lbl'>Materiales</div><ul class='l'>{''.join(f'<li>{esc(m)}</li>' for m in e['materiales'])}</ul>
<div class='lbl'>Bienvenida · 10 min</div><p>{esc(e['bienvenida'])}</p>
<div class='lbl'>Rompehielos · 10 min</div><p>{esc(e['rompehielo'])}</p>
<div class='lbl'>Enseñanza · 20 min</div>{ens}
<div class='lbl'>Dinámica en pareja · 20 min — «{esc(din_name)}»</div><ol class='n'>{''.join(f'<li>{esc(p)}</li>' for p in pasos)}</ol>
<div class='lbl'>Para conversar en grupos · 15 min</div><ul class='l'>{''.join(f'<li>{esc(q)}</li>' for q in e['preguntas'])}</ul>
<div class='box' style='background:#F6EEDF;border-color:#E6D3AE'><div class='lbl' style='margin-top:0'>Compromiso de la semana</div><p>{esc(e['compromiso'])}</p></div>
<div class='lbl'>Oración de cierre</div><p style='font-family:Cormorant,serif;font-style:italic;font-size:12.5pt'>{esc(e['oracion'])}</p>
<div class='box' style='border-left:3px solid {BURG}'><div class='lbl' style='margin-top:0'>Nota para el líder</div><p style='font-size:9.5pt'>{esc(e['nota'])}</p></div>
</section>"""

def encuentros():
    body = cover("Programa anual", "Encuentros Listos", "Un año completo de encuentros para tu ministerio de matrimonios", big="24")
    body += toc("24 Encuentros", [(f"{e['n']:02d}", f"{e['titulo']} — {e['mes'].split('· ')[1]}") for e in ENC] + [("A", "Anexos: hojas de trabajo")])
    for e in ENC: body += encuentro_html(e)
    for t,ps in ANEXOS:
        body += f"<section class='pb'><div class='eyebrow'>Hoja de trabajo · puedes imprimirla</div><h2 style='font-size:16pt;margin:4px 0'>{esc(t)}</h2><div class='rule'></div><div style='font-size:11pt;line-height:2'>{para(ps)}</div></section>"
    body += legal()
    both(body, "02-24-Encuentros-Listos")

# ---------- 3. 50 DINÁMICAS ----------
def dinamicas():
    body = cover("Banco de recursos", "Dinámicas para Parejas", "Para conectar, reír, orar y crecer juntos", big="50")
    cats = []
    for d in DINAMICAS:
        if d[0] not in cats: cats.append(d[0])
    body += f"<section class='pb'><div class='eyebrow'>Cómo usar este banco</div><h2 style='font-size:17pt;margin:4px 0'>Elige según el objetivo</h2><div class='rule'></div><p>Las dinámicas están organizadas por categoría. Cada una indica objetivo, tiempo y materiales. Puedes usarlas para reemplazar la dinámica de un encuentro, para un evento especial o para un retiro.</p>" + "".join(f"<div class='box'><b>{esc(c)}</b> · {sum(1 for d in DINAMICAS if d[0]==c)} dinámicas</div>" for c in cats) + "</section>"
    n = 0
    for c in cats:
        body += f"<section class='pb'><div class='eyebrow'>Categoría</div><h2 style='font-size:18pt;margin:4px 0 6px'>{esc(c)}</h2><div class='rule'></div>"
        for d in [x for x in DINAMICAS if x[0]==c]:
            n += 1
            body += f"<div class='box'><div style='display:flex;justify-content:space-between;align-items:center'><span class='tag'>{n:02d}</span><span class='eyebrow'>{esc(d[3])}</span></div><h3 style='font-size:12.5pt;margin:6px 0 2px'>{esc(d[1])}</h3><p style='font-size:9pt;color:#7a5a4a'><b>Objetivo:</b> {esc(d[2])} · <b>Materiales:</b> {esc(d[4])}</p><p style='margin-top:4px'>{esc(d[5])}</p></div>"
        body += "</section>"
    body += legal()
    both(body, "03-50-Dinamicas")

# ---------- 4. 40 ROMPEHIELOS ----------
def rompehielos():
    body = cover("Banco de recursos", "Rompehielos", "Para empezar cada encuentro con risas y confianza", big="40")
    n = 0
    for cat, items in ROMPEHIELOS:
        body += f"<section class='pb'><div class='eyebrow'>Categoría</div><h2 style='font-size:18pt;margin:4px 0 6px'>{esc(cat)}</h2><div class='rule'></div>"
        for it in items:
            n += 1
            body += f"<div class='box' style='display:flex;gap:10px;align-items:flex-start'><span class='tag' style='flex:none'>{n:02d}</span><p>{esc(it)}</p></div>"
        body += "</section>"
    body += legal()
    both(body, "04-40-Rompehielos")

# ---------- 5. 100 PREGUNTAS ----------
def preguntas():
    body = cover("Para usar en pareja", "Preguntas para Conectar", "Conversaciones que acercan el corazón", big="100")
    body += "<section class='pb'><div class='eyebrow'>Cómo usarlas</div><h2 style='font-size:17pt;margin:4px 0'>Una pregunta puede cambiar una noche</h2><div class='rule'></div>" + para(["Úsalas en los encuentros, en citas o en casa. Algunas sugerencias:", "- Elijan un lugar tranquilo y sin pantallas.", "- Escuchen sin interrumpir y sin corregir.", "- Respondan con sinceridad y con cariño.", "- Las preguntas de la sección «Para profundizar» requieren un momento de calma: no las usen en medio de una discusión."]) + "</section>"
    n = 0
    for cat, items in PREGUNTAS:
        body += f"<section class='pb'><div class='eyebrow'>{len(items)} preguntas</div><h2 style='font-size:18pt;margin:4px 0 6px'>{esc(cat)}</h2><div class='rule'></div>"
        for it in items:
            n += 1
            body += f"<div style='display:flex;gap:10px;padding:6px 0;border-bottom:1px dotted #dccbb2'><span style='font:700 9pt Cinzel;color:{GOLD};min-width:26px'>{n:02d}</span><span>{esc(it)}</span></div>"
        body += "</section>"
    body += legal()
    both(body, "05-100-Preguntas-para-Conectar")

# ---------- BONO 1: KIT CONEXIÓN (Carta, imprimible) ----------
CARD_CSS = f".grid{{display:grid;grid-template-columns:1fr 1fr;gap:5mm}} .card{{height:58mm;border:1px dashed #c9b28a;border-radius:6px;background:#fff;padding:7mm 6mm;display:flex;flex-direction:column;justify-content:center;text-align:center;break-inside:avoid;position:relative}} .card .q{{font-family:Cormorant,serif;font-style:italic;font-size:14pt;line-height:1.25;color:{BURG_D}}} .card .r{{font:700 7pt Montserrat;letter-spacing:.15em;text-transform:uppercase;color:{GOLD};margin-top:6px}} .card .a{{font-size:9pt;margin-top:6px;color:#6b5a4f}} .card.dark{{background:linear-gradient(160deg,{BURG},{BURG_D});border:none;color:#fff}} .card.dark .q{{color:#fff;font-family:Cinzel;font-style:normal;font-size:12pt}} .card .no{{position:absolute;top:4mm;left:0;right:0;font:700 7pt Montserrat;letter-spacing:.2em;color:{GOLD}}}"

def kit_conexion():
    body = cover("Bono 1", "Kit Conexión Durante la Semana", "30 tarjetas con versículos y 24 retos semanales para que el encuentro continúe en casa")
    body += "<section class='pb'><div class='eyebrow'>Cómo usar</div><h2 style='font-size:18pt;margin:4px 0'>El encuentro continúa en casa</h2><div class='rule'></div>" + para(["Imprime las tarjetas en papel grueso (cartulina de 180 a 240 g), recórtalas por la línea punteada y entrégalas a las parejas al final de cada encuentro.", "- Tarjetas con versículos: para colocar en el espejo, en el refrigerador o en la billetera. Cada una incluye una frase de aplicación.", "- Retos semanales: una acción concreta para practicar entre un encuentro y otro.", "Consejo: también puedes enviar la foto de una tarjeta por WhatsApp al grupo cada lunes."]) + "</section>"
    cards = "".join(f"<div class='card'><div class='no'>VERSÍCULO {i+1:02d}</div><div class='q'>«{esc(t)}»</div><div class='r'>{esc(r)} · RVR1960</div><div class='a'>{esc(a)}</div></div>" for i,(t,r,a) in enumerate(TARJETAS_VERSICULOS))
    body += f"<section class='pb'><div class='grid'>{cards}</div></section>"
    retos = "".join(f"<div class='card dark'><div class='no'>RETO {i+1:02d}</div><div class='q'>{esc(t)}</div><div class='r' style='color:{GOLD_L}'>Ministerio de Parejas 365</div></div>" for i,t in enumerate(RETOS))
    body += f"<section class='pb'><div class='grid'>{retos}</div></section>"
    body += legal()
    render_pdf(doc(body, size="Letter", margin="12mm", extra_css=CARD_CSS), f"{OUT}/Bono-1-Kit-Conexion.pdf")

# ---------- BONO 2: KIT COMUNICACIÓN ----------
def kit_comunicacion():
    body = cover("Bono 2", "Kit de Comunicación para Eventos", "12 invitaciones, 12 carteles y mensajes listos para WhatsApp")
    body += "<section class='pb'><div class='eyebrow'>Cómo usar</div><h2 style='font-size:18pt;margin:4px 0'>Que nadie se quede sin enterarse</h2><div class='rule'></div>" + para(["Este kit incluye:", "- 12 invitaciones digitales en formato vertical (carpeta «Invitaciones»), listas para enviar por WhatsApp o publicar en Instagram. Completa la fecha, la hora y el lugar con cualquier editor de imágenes o con el texto del mensaje.", "- 12 carteles para imprimir en tamaño carta y colocar en la iglesia (en las páginas siguientes).", "- 4 mensajes modelo para WhatsApp: invitación, recordatorio, agradecimiento y seguimiento."])
    body += "<div class='lbl'>Mensajes modelo para WhatsApp</div>"
    for w in WHATSAPP:
        t = w.replace("{nombre}","[Nombre]").replace("{día}","[día]").replace("{hora}","[hora]").replace("{tema}","[tema]").replace("{lugar}","[lugar]")
        body += f"<div class='box' style='background:#E9F7E6;border-color:#cfe8c8'>{esc(t)}</div>"
    body += "</section>"
    for mes, tit, txt in INVITACIONES:
        body += f"""<section class='pb' style='height:100%'><div style='height:252mm;border-radius:10px;background:radial-gradient(circle at 50% 30%,#8a1d33,{BURG} 50%,{BURG_D});color:#fff;text-align:center;padding:18mm 14mm;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative'>
<div style='position:absolute;inset:6mm;border:1px solid rgba(230,201,130,.6);border-radius:6px'></div>
<img src='{LOGO}' style='width:45mm;border-radius:50%;margin-bottom:8mm'>
<div class='eyebrow' style='color:{GOLD_L};font-size:10pt'>Encuentro de Parejas · {esc(mes)}</div>
<h1 style='color:#fff;font-size:30pt;margin:6mm 0'>{esc(tit)}</h1>
<p style='font-family:Cormorant;font-style:italic;font-size:17pt;color:#f3e6cf;max-width:140mm'>{esc(txt)}</p>
<div style='margin-top:12mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:5mm;width:100%;font:600 10pt Montserrat'>
{''.join(f"<div style='border:1px solid {GOLD_L};border-radius:8px;padding:5mm 2mm'><div style='font-size:7.5pt;letter-spacing:.2em;color:{GOLD_L}'>{k}</div><div style='margin-top:3mm;border-bottom:1px solid rgba(255,255,255,.5);height:6mm'></div></div>" for k in ('FECHA','HORA','LUGAR'))}
</div></div></section>"""
    body += legal()
    render_pdf(doc(body, size="Letter", margin="12mm"), f"{OUT}/Bono-2-Kit-Comunicacion-Carteles.pdf")
    # invitaciones digitales 1080x1350
    inv_dir = f"{OUT}/Bono-2-Invitaciones"; os.makedirs(inv_dir, exist_ok=True)
    for i,(mes,tit,txt) in enumerate(INVITACIONES):
        h = f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS} body{{width:1080px;height:1350px;margin:0}}</style></head><body><div style='width:1080px;height:1350px;background:radial-gradient(circle at 50% 30%,#8a1d33,{BURG} 50%,{BURG_D});color:#fff;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:90px;position:relative'><div style='position:absolute;inset:36px;border:2px solid rgba(230,201,130,.6);border-radius:14px'></div><img src='{LOGO}' style='width:260px;border-radius:50%;margin-bottom:46px;box-shadow:0 20px 60px rgba(0,0,0,.4)'><div style='font:700 26px Montserrat;letter-spacing:.25em;color:{GOLD_L}'>ENCUENTRO DE PAREJAS · {esc(mes.upper())}</div><div style='font:700 76px/1.08 Cinzel;margin:36px 0'>{esc(tit)}</div><div style='font:italic 500 40px/1.3 Cormorant;color:#f3e6cf'>{esc(txt)}</div><div style='margin-top:60px;font:600 30px Montserrat;border:2px solid {GOLD_L};border-radius:60px;padding:22px 50px;color:{GOLD_L}'>📅 [Fecha] · ⏰ [Hora] · 📍 [Lugar]</div></div></body></html>"
        render_png(h, f"{inv_dir}/Invitacion-{i+1:02d}.png", 1080, 1350)

# ---------- BONO 3: KIT ORGANIZACIÓN ----------
def kit_organizacion():
    body = cover("Bono 3", "Kit de Organización Ministerial", "6 planners, 3 certificados y 8 separadores para un ministerio ordenado")
    for t, cols in PLANNERS:
        rows = 16 if t != "Planner anual del ministerio" else 12
        first = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"] if rows == 12 else [""]*rows
        if t == "Planificador de encuentro":
            first = ["Bienvenida","Rompehielos","Enseñanza","Dinámica","Grupos","Compromiso","Oración","Refrigerio"]; rows = 8
        td = "style='border:1px solid #e3d5bf;height:%s;padding:3px 6px'" % ("12mm" if rows<=12 else "7.6mm")
        trs = "".join("<tr>" + f"<td {td}>{first[r]}</td>" + "".join(f"<td {td}></td>" for _ in cols[1:]) + "</tr>" for r in range(rows))
        body += f"<section class='pb'><div class='eyebrow'>Planner</div><h2 style='font-size:18pt;margin:4px 0'>{esc(t)}</h2><div class='rule'></div><p style='font-size:9pt'>Ministerio: ______________________  Año: ________</p><table style='width:100%;border-collapse:collapse;margin-top:6px;font:9pt Montserrat'><tr>{''.join(f'<th style=\"background:{BURG};color:#fff;padding:6px;text-align:left;font-weight:600\">{esc(c)}</th>' for c in cols)}</tr>{trs}</table></section>"
    for t, txt in CERTIFICADOS:
        body += f"""<section class='pb'><div style='height:180mm;border:3px double {GOLD};border-radius:6px;background:#fff;padding:14mm;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center'>
<img src='{LOGO}' style='width:30mm;border-radius:50%'><div class='eyebrow' style='margin-top:5mm'>Ministerio de Parejas</div>
<h1 style='font-size:28pt;margin:4mm 0'>{esc(t)}</h1><p style='font-family:Cormorant;font-style:italic;font-size:14pt'>Otorgado a</p>
<div style='width:70%;border-bottom:1px solid {GOLD};height:12mm'></div><p style='margin-top:6mm;max-width:150mm'>{esc(txt)}</p>
<div style='display:flex;gap:30mm;margin-top:14mm;font:9pt Montserrat'><div style='border-top:1px solid #999;padding-top:2mm;width:55mm'>Pastor</div><div style='border-top:1px solid #999;padding-top:2mm;width:55mm'>Líder del ministerio</div></div>
<p style='font:8pt Montserrat;color:#888;margin-top:6mm'>Fecha: ____ / ____ / ________</p></div></section>"""
    seps = "".join(f"<div style='height:86mm;background:linear-gradient(180deg,{BURG},{BURG_D});border-radius:6px;color:#fff;padding:5mm 4mm;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:space-between'><img src='{LOGO}' style='width:18mm;border-radius:50%'><div style='font:italic 600 13pt/1.2 Cormorant'>«{esc(t)}»</div><div style='font:700 7pt Montserrat;letter-spacing:.15em;color:{GOLD_L}'>{esc(r.upper())}</div></div>" for r,t in SEPARADORES)
    body += f"<section class='pb'><div class='eyebrow'>Separadores · imprimir y recortar</div><div style='display:grid;grid-template-columns:repeat(4,1fr);gap:5mm;margin-top:4mm'>{seps}</div></section>"
    body += legal()
    render_pdf(doc(body, size="Letter landscape", margin="12mm"), f"{OUT}/Bono-3-Kit-Organizacion.pdf")

# ---------- UPSELL: RETIRO ----------
def retiro():
    body = cover("Edición especial", "Retiro de Parejas Listo", "«Cordón de Tres»: un retiro completo, de la invitación a la renovación de pacto")
    body += toc("Retiro de Parejas", [("01","Por qué un retiro"),("02","Dos formatos"),("03","Cronograma completo"),("04","Seis sesiones"),("05","Dos noches especiales"),("06","Devocionales en pareja"),("07","Ceremonia de renovación de pacto"),("08","Logística paso a paso"),("09","Equipos de servicio"),("10","Presupuesto modelo"),("11","Formulario de inscripción y qué llevar")])
    body += f"<section class='pb'><div class='eyebrow'>01</div><h2 style='font-size:18pt;margin:4px 0'>Por qué un retiro</h2><div class='rule'></div>{para(RETIRO_INTRO)}<div class='verse'><p>«Y si alguno prevaleciere contra uno, dos le resistirán; y cordón de tres dobleces no se rompe pronto.»</p><cite>Eclesiastés 4:12 · RVR1960</cite></div><div class='eyebrow' style='margin-top:12px'>02 · Dos formatos</div>" + "".join(f"<div class='box'><b>{esc(a)}</b><p>{esc(b)}</p></div>" for a,b in RETIRO_FORMATOS) + "</section>"
    body += "<section class='pb'><div class='eyebrow'>03</div><h2 style='font-size:18pt;margin:4px 0'>Cronograma completo</h2><div class='rule'></div>"
    for dia, items in RETIRO_CRONOGRAMA:
        body += f"<div class='lbl'>{dia}</div>" + "".join(f"<div style='display:flex;gap:10px;padding:3px 0;border-bottom:1px dotted #dccbb2'><b style='font:700 9pt Montserrat;color:{BURG};min-width:40px'>{h}</b><span>{esc(a)}</span></div>" for h,a in items)
    body += "</section>"
    for t, ref, vtxt, ens, din in RETIRO_SESIONES:
        body += f"<section class='pb'><span class='tag'>04 · Sesiones</span><h2 style='font-size:18pt;margin:8px 0 4px'>{esc(t)}</h2><div class='verse'><p>«{esc(vtxt)}»</p><cite>{esc(ref)} · RVR1960</cite></div><div class='lbl'>Enseñanza · 30 min</div><p>{esc(ens)}</p><div class='lbl'>Dinámica · 25 min</div><p>{esc(din)}</p><div class='lbl'>Para conversar en pareja · 15 min</div><ul class='l'><li>¿Qué me habló Dios en esta sesión?</li><li>¿Qué paso concreto vamos a dar juntos?</li></ul></section>"
    body += "<section class='pb'><div class='eyebrow'>05</div><h2 style='font-size:18pt;margin:4px 0'>Dos noches especiales</h2><div class='rule'></div>" + "".join(f"<div class='box'><b>{esc(a)}</b><p>{esc(b)}</p></div>" for a,b in RETIRO_NOCHES)
    body += "<div class='eyebrow' style='margin-top:12px'>06 · Devocionales en pareja</div>" + "".join(f"<div class='box'><b>{esc(a)}</b> — {esc(r)}<p>{esc(b)}</p></div>" for a,r,b in RETIRO_DEVOCIONALES) + "</section>"
    body += f"<section class='pb'><div class='eyebrow'>07</div><h2 style='font-size:18pt;margin:4px 0'>Ceremonia de renovación de pacto</h2><div class='rule'></div>{para(RETIRO_CEREMONIA)}</section>"
    body += "<section class='pb'><div class='eyebrow'>08</div><h2 style='font-size:18pt;margin:4px 0'>Logística paso a paso</h2><div class='rule'></div>" + "".join(f"<div class='lbl'>{esc(a)}</div><ul class='l'>" + "".join(f"<li>☐ {esc(x)}</li>" for x in b) + "</ul>" for a,b in RETIRO_LOGISTICA) + "</section>"
    body += "<section class='pb'><div class='eyebrow'>09</div><h2 style='font-size:18pt;margin:4px 0'>Equipos de servicio</h2><div class='rule'></div>" + "".join(f"<div class='box'><b>{esc(a)}</b> · Responsable: __________<p style='font-size:9.5pt'>{esc(b)}</p></div>" for a,b in RETIRO_EQUIPOS)
    body += f"<div class='eyebrow' style='margin-top:12px'>10 · Presupuesto modelo</div><table style='width:100%;border-collapse:collapse;font:9pt Montserrat;margin-top:4px'><tr><th style='background:{BURG};color:#fff;padding:5px;text-align:left'>Concepto</th><th style='background:{BURG};color:#fff;padding:5px'>Base</th><th style='background:{BURG};color:#fff;padding:5px'>Monto</th></tr>" + "".join(f"<tr><td style='padding:5px;border-bottom:1px solid #e5d8c4'>{esc(a)}</td><td style='padding:5px;border-bottom:1px solid #e5d8c4;text-align:center'>{b}</td><td style='border-bottom:1px solid #e5d8c4'></td></tr>" for a,b in RETIRO_PRESUPUESTO) + "</table><p class='foot-note'>Costo sugerido por pareja = (total ÷ número de parejas) + 10 % para becas de parejas que no puedan pagar.</p></section>"
    body += "<section class='pb'><div class='eyebrow'>11</div><h2 style='font-size:18pt;margin:4px 0'>Formulario de inscripción</h2><div class='rule'></div>" + "".join(f"<p style='margin:9px 0'>{esc(x)}: ______________________________</p>" for x in RETIRO_INSCRIPCION) + "<div class='lbl'>Qué llevar</div><ul class='l'>" + "".join(f"<li>{esc(x)}</li>" for x in RETIRO_QUE_LLEVAR) + "</ul></section>"
    body += legal()
    both(body, "Upsell-Retiro-de-Parejas-Listo")

if __name__ == "__main__":
    which = sys.argv[1:] or ["manual","encuentros","dinamicas","rompehielos","preguntas","kit_conexion","kit_comunicacion","kit_organizacion","retiro"]
    for w in which: globals()[w](); print("ok", w)
