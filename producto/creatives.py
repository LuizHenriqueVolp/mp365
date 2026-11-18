# -*- coding: utf-8 -*-
# Creativos Meta Ads: 1080x1080 (feed), 1080x1350 (feed 4:5), 1080x1920 (stories/reels)
import os
from base import BASE_CSS, render_png, ROOT, BURG, BURG_D, GOLD, GOLD_L, CREAM, LOGO
M = "file://" + ROOT + "/out/mockups-trim/"
S = "file://" + ROOT + "/out/screens/"
OUT = ROOT + "/out/creativos-meta"; os.makedirs(OUT, exist_ok=True)
SIZES = {"1x1": (1080, 1080), "4x5": (1080, 1350), "9x16": (1080, 1920)}

def wrap(w, h, inner, bg):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS} body{{width:{w}px;height:{h}px;margin:0;overflow:hidden}} .wrap{{width:{w}px;height:{h}px;position:relative;overflow:hidden;background:{bg};display:flex;flex-direction:column;align-items:center;text-align:center}}</style></head><body><div class='wrap'>{inner}</div></body></html>"

def pill(t, dark=False):
    c = f"background:{BURG};color:#fff" if not dark else f"background:{GOLD_L};color:{BURG_D}"
    return f"<div style='{c};font:700 30px Montserrat;letter-spacing:.04em;padding:22px 44px;border-radius:60px;box-shadow:0 12px 30px rgba(74,13,25,.3)'>{t}</div>"

def safe(h):  # zonas seguras para stories (14% arriba/abajo)
    return (int(h*0.12), int(h*0.15)) if h > 1500 else (60, 60)

def A(w, h):  # Ángulo dolor/solución
    top, bot = safe(h)
    img_h = {1080: 520, 1350: 700, 1920: 900}[h]
    inner = f"""<div style='padding:{top}px 70px 0'>
<div style='font:700 24px Montserrat;letter-spacing:.24em;color:{GOLD}'>PARA LÍDERES DE MINISTERIOS DE MATRIMONIOS</div>
<div style='font:700 {62 if h!=1920 else 72}px/1.08 Cinzel;color:{BURG};margin-top:22p'>Encuentros de parejas listos para todo el año</div>
<div style='font:italic 500 {38 if h==1080 else 42}px/1.25 Cormorant;color:#6b4a3e;margin-top:16px'>Deja de improvisar cada semana: solo elige, prepara y aplica.</div></div>
<img src='{M}hero-sistema-completo.png' style='height:{img_h}px;margin-top:10px'>
<div style='position:absolute;bottom:{bot}px'>{pill('24 encuentros · 50 dinámicas · 100 preguntas')}</div>"""
    return wrap(w, h, inner, f"radial-gradient(circle at 50% 60%,#fff,{CREAM} 65%)")

def B(w, h):  # Ángulo oferta/inventario (fondo vino)
    top, bot = safe(h)
    items = [("24", "encuentros completos"), ("50", "dinámicas"), ("40", "rompehielos"), ("100", "preguntas para conectar")]
    grid = "".join(f"<div style='border:1.5px solid rgba(230,201,130,.6);border-radius:18px;padding:16px 10px'><div style='font:700 {58 if h==1080 else 66}px Cinzel;color:{GOLD_L};line-height:1'>{n}</div><div style='font:500 22px Montserrat;color:#f3e6cf;margin-top:6px'>{t}</div></div>" for n,t in items)
    img_h = {1080: 400, 1350: 600, 1920: 780}[h]
    inner = f"""<div style='position:absolute;inset:28px;border:2px solid rgba(230,201,130,.5);border-radius:20px'></div>
<div style='padding:{top}px 70px 0;z-index:2'>
<div style='font:700 24px Montserrat;letter-spacing:.24em;color:{GOLD_L}'>MINISTERIO DE PAREJAS 365</div>
<div style='font:700 {58 if h==1080 else 68}px/1.1 Cinzel;color:#fff;margin-top:18px'>Un año entero de encuentros, planificado</div></div>
<img src='{M}plan-completo.png' style='height:{img_h}px;margin-top:6px;z-index:2'>
<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:calc(100% - 120px);z-index:2'>{grid}</div>
<div style='position:absolute;bottom:{bot}px;z-index:2'>{pill('Acceso inmediato · Celular e impresión', dark=True)}</div>"""
    return wrap(w, h, inner, f"radial-gradient(circle at 50% 35%,#8a1d33,{BURG} 50%,{BURG_D})")

def C(w, h):  # Ángulo "mira por dentro"
    top, bot = safe(h)
    ph_w = {1080: 300, 1350: 400, 1920: 360}[h]
    feats = ["Texto bíblico base", "Enseñanza en 3 puntos", "Dinámica en pareja", "Preguntas para grupos", "Oración y compromiso"]
    lst = "".join(f"<div style='display:flex;gap:14px;align-items:center;margin:14px 0;font:500 {30 if h==1080 else 34}px Montserrat;color:{BURG_D};text-align:left'><span style='width:40px;height:40px;border-radius:50%;background:{BURG};color:#fff;display:flex;align-items:center;justify-content:center;font:700 22px Montserrat;flex:none'>✓</span>{f}</div>" for f in feats)
    layout_row = h < 1500
    phone = f"<div style='width:{ph_w}px;height:{int(ph_w*2.05)}px;border-radius:48px;background:#111;padding:12px;box-shadow:0 30px 60px rgba(74,13,25,.35);flex:none'><div style='width:100%;height:100%;border-radius:38px;background:#fff url({S}encuentro-1.png) top center/100% auto no-repeat'></div></div>"
    body = f"<div style='display:flex;gap:50px;align-items:center;margin-top:30px'>{phone}<div>{lst}</div></div>" if layout_row else f"{phone}<div style='margin-top:24px;display:inline-block'>{lst}</div>"
    inner = f"""<div style='padding:{top}px 70px 0'>
<div style='font:700 24px Montserrat;letter-spacing:.24em;color:{GOLD}'>MIRA POR DENTRO</div>
<div style='font:700 {58 if h==1080 else 66}px/1.1 Cinzel;color:{BURG};margin-top:16px'>Cada encuentro,<br>paso a paso</div></div>{body}
<div style='position:absolute;bottom:{bot}px'>{pill('Listo para aplicar · 75 a 90 minutos')}</div>"""
    return wrap(w, h, inner, f"linear-gradient(180deg,#fff,{CREAM})")

if __name__ == "__main__":
    for name, fn in [("A-encuentros-listos", A), ("B-un-ano-planificado", B), ("C-mira-por-dentro", C)]:
        for k, (w, h) in SIZES.items():
            render_png(fn(w, h), f"{OUT}/{name}-{k}.png", w, h); print(name, k)
