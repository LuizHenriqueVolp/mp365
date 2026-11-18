# -*- coding: utf-8 -*-
import os, html, base64, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "fonts/node_modules/@fontsource")
sys.path.insert(0, os.path.join(ROOT, "content"))

def ff(fam, file, weight, style="normal"):
    return f"@font-face{{font-family:'{fam}';src:url('file://{FONTS}/{file}') format('woff2');font-weight:{weight};font-style:{style};}}"

FONT_CSS = "".join([
    *[ff("Cinzel", f"cinzel/files/cinzel-latin-{w}-normal.woff2", w) for w in (400,600,700)],
    *[ff("Cormorant", f"cormorant-garamond/files/cormorant-garamond-latin-{w}-{s}.woff2", w, s) for w in (500,600,700) for s in ("normal","italic")],
    *[ff("Lora", f"lora/files/lora-latin-{w}-{s}.woff2", w, s) for w in (400,500,600,700) for s in ("normal","italic")],
    *[ff("Montserrat", f"montserrat/files/montserrat-latin-{w}-normal.woff2", w) for w in (400,500,600,700)],
])

BURG = "#6E1426"; BURG_D = "#4A0D19"; GOLD = "#C9A04A"; GOLD_L = "#E6C982"; CREAM = "#FBF6EE"; INK = "#2B1B1E"

LOGO = "file://" + os.path.join(ROOT, "render/logo_round.png")

BASE_CSS = FONT_CSS + f"""
:root{{--b:{BURG};--bd:{BURG_D};--g:{GOLD};--gl:{GOLD_L};--c:{CREAM};--ink:{INK}}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
body{{font-family:Lora,serif;color:var(--ink);font-size:10.6pt;line-height:1.55;background:#fff}}
h1,h2,h3{{font-family:Cinzel,serif;color:var(--b);font-weight:700;line-height:1.15}}
.eyebrow{{font-family:Montserrat,sans-serif;font-size:7.5pt;letter-spacing:.18em;text-transform:uppercase;color:var(--g);font-weight:700}}
.sub{{font-family:Cormorant,serif;font-style:italic;font-size:14pt;color:#7a5a4a}}
.rule{{height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);margin:10px 0}}
.verse{{background:var(--c);border-left:3px solid var(--g);padding:10px 12px;border-radius:0 8px 8px 0;margin:10px 0;box-shadow:0 1px 0 rgba(0,0,0,.04)}}
.verse p{{font-family:Cormorant,serif;font-size:13pt;font-style:italic;line-height:1.3;color:var(--bd)}}
.verse cite{{display:block;margin-top:4px;font-family:Montserrat,sans-serif;font-style:normal;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:var(--g);font-weight:700}}
.box{{background:var(--c);border:1px solid #eadfcf;border-radius:10px;padding:10px 12px;margin:8px 0;break-inside:avoid}}
.tag{{display:inline-block;font-family:Montserrat,sans-serif;font-size:7pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--b);color:#fff;border-radius:20px;padding:3px 9px}}
ul.l{{list-style:none}} ul.l li{{position:relative;padding-left:14px;margin:3px 0}}
ul.l li:before{{content:'';position:absolute;left:2px;top:.62em;width:5px;height:5px;background:var(--g);transform:rotate(45deg)}}
ol.n{{counter-reset:k;list-style:none}} ol.n li{{counter-increment:k;position:relative;padding-left:22px;margin:4px 0}}
ol.n li:before{{content:counter(k);position:absolute;left:0;top:1px;width:16px;height:16px;border-radius:50%;background:var(--b);color:#fff;font:700 7.5pt Montserrat,sans-serif;display:flex;align-items:center;justify-content:center}}
.pb{{break-before:page}}
.lbl{{font-family:Montserrat,sans-serif;font-size:7.5pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--b);margin:10px 0 3px;break-after:avoid}}
.foot-note{{font-size:7.5pt;color:#8b7768;margin-top:10px}}
/* cover */
.cover{{height:100vh;background:radial-gradient(circle at 50% 35%,#8a1d33 0%,var(--b) 45%,var(--bd) 100%);color:#fff;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 12mm;break-after:page}}
.cover:before{{content:'';position:absolute;inset:6mm;border:1px solid rgba(230,201,130,.7);border-radius:4px}}
.cover:after{{content:'';position:absolute;inset:8mm;border:.5px solid rgba(230,201,130,.35);border-radius:3px}}
.cover img{{width:44%;border-radius:50%;box-shadow:0 8px 30px rgba(0,0,0,.35);margin-bottom:9mm}}
.cover .k{{font-family:Montserrat,sans-serif;font-size:8pt;letter-spacing:.3em;text-transform:uppercase;color:var(--gl)}}
.cover h1{{color:#fff;font-size:25pt;margin:4mm 0 3mm;letter-spacing:.02em}}
.cover .s{{font-family:Cormorant,serif;font-style:italic;font-size:15pt;color:#f3e6cf}}
.cover .big{{font-family:Cinzel,serif;font-size:58pt;color:var(--gl);line-height:1;font-weight:700}}
.cover .brand{{position:absolute;bottom:13mm;left:0;right:0;font-family:Cinzel,serif;font-size:9pt;letter-spacing:.2em;color:var(--gl)}}
"""

def esc(s): return html.escape(s, quote=False)

def para(items):
    out=[]; lst=[]
    def flush():
        if lst: out.append("<ul class='l'>"+"".join(f"<li>{esc(x)}</li>" for x in lst)+"</ul>"); lst.clear()
    for t in items:
        if t.startswith("- "): lst.append(t[2:])
        else: flush(); out.append(f"<p style='margin:6px 0'>{esc(t)}</p>")
    flush(); return "".join(out)

def cover(kicker, title, sub, big=None):
    b = f"<div class='big'>{big}</div>" if big else ""
    return f"<section class='cover'><img src='{LOGO}'><div class='k'>{esc(kicker)}</div>{b}<h1>{esc(title)}</h1><div class='s'>{esc(sub)}</div><div class='brand'>MINISTERIO DE PAREJAS 365</div></section>"

RVR = "Texto bíblico tomado de la Santa Biblia Reina-Valera 1960™ © Sociedades Bíblicas en América Latina, 1960. Renovado © Sociedades Bíblicas Unidas, 1988. Utilizado con permiso. Reina-Valera 1960™ es una marca registrada de Sociedades Bíblicas Unidas y puede ser usada solamente bajo licencia."

def legal(extra=""):
    return f"""<section class='pb' style='padding-top:30mm'>
<div class='eyebrow'>Información legal</div><div class='rule'></div>
<p class='foot-note'>© 2026 Ministerio de Parejas 365. Todos los derechos reservados. Este material es para uso personal y ministerial de quien lo adquirió. Puedes imprimir las copias que necesites para tu grupo, pero no está permitida su reventa ni su distribución pública.</p>
<p class='foot-note'>{RVR}</p>
<p class='foot-note'>Las ideas de autores citados se presentan con nuestras propias palabras y con fines educativos. Este material no está afiliado ni respaldado por dichos autores ni por sus editoriales.</p>
<p class='foot-note'>Este material no sustituye la consejería pastoral, psicológica ni médica. Ante situaciones de violencia, adicciones o riesgo, busca ayuda profesional y comunícate con los servicios de emergencia de tu país.</p>{extra}
</section>"""

def doc(body, size="A5", margin="13mm 12mm 14mm", extra_css="", footer=True):
    fcss = f"@page{{size:{size};margin:{margin};@bottom-center{{content:counter(page);font:600 7pt Montserrat;color:{GOLD}}}}} @page:first{{margin:0;@bottom-center{{content:none}}}}" if footer else f"@page{{size:{size};margin:{margin}}} @page:first{{margin:0}}"
    return f"<!doctype html><html lang='es'><head><meta charset='utf-8'><style>{BASE_CSS}{fcss}{extra_css}</style></head><body>{body}</body></html>"

def render_pdf(html_str, out_pdf, size=None, landscape=False):
    from playwright.sync_api import sync_playwright
    tmp = out_pdf + ".html"; open(tmp, "w").write(html_str)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.goto("file://" + tmp); pg.wait_for_timeout(400)
        pg.pdf(path=out_pdf, prefer_css_page_size=True, print_background=True, display_header_footer=False)
        b.close()
    os.remove(tmp)

def render_png(html_str, out_png, w, h, scale=1):
    from playwright.sync_api import sync_playwright
    tmp = out_png + ".html"; open(tmp, "w").write(html_str)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
        pg.goto("file://" + tmp); pg.wait_for_timeout(500)
        pg.screenshot(path=out_png, clip={"x":0,"y":0,"width":w,"height":h}, omit_background=True)
        b.close()
    os.remove(tmp)
