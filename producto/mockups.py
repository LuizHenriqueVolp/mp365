# -*- coding: utf-8 -*-
import os
from base import BASE_CSS, render_png, ROOT, BURG, BURG_D, GOLD, GOLD_L, CREAM, LOGO
C = "file://" + ROOT + "/out/covers/"
P = "file://" + ROOT + "/out/pages/"
S = "file://" + ROOT + "/out/screens/"
OUT = ROOT + "/out/mockups"; os.makedirs(OUT, exist_ok=True)

CSS = BASE_CSS + f"""
body{{margin:0;background:transparent}}
.scene{{position:relative;perspective:2200px}}
.book{{position:absolute;transform-style:preserve-3d}}
.book .front{{position:absolute;inset:0;background-size:cover;background-position:center;border-radius:2px 6px 6px 2px;box-shadow:inset 6px 0 10px rgba(0,0,0,.25)}}
.book .front:after{{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(105deg,rgba(255,255,255,.18),rgba(255,255,255,0) 35%,rgba(0,0,0,.08))}}
.book .spine{{position:absolute;top:0;left:0;height:100%;transform-origin:left;transform:rotateY(-90deg);background:linear-gradient(90deg,{BURG_D},{BURG} 60%,{BURG_D})}}
.book .pages{{position:absolute;top:1.5%;right:0;height:97%;transform-origin:right;transform:rotateY(90deg);background:repeating-linear-gradient(90deg,#fdfaf3 0 2px,#e8dfcf 2px 3px)}}
.shadow{{position:absolute;border-radius:50%;background:radial-gradient(ellipse at center,rgba(40,10,15,.45),rgba(40,10,15,0) 70%);filter:blur(6px)}}
.phone{{position:absolute;border-radius:46px;background:#111;padding:12px;box-shadow:0 30px 60px rgba(30,5,10,.45),inset 0 0 0 2px #333}}
.phone .scr{{width:100%;height:100%;border-radius:36px;background-color:#fff;background-size:100% auto;background-position:top center;background-repeat:no-repeat;position:relative;overflow:hidden}}
.phone .scr:before{{content:'';position:absolute;top:10px;left:50%;transform:translateX(-50%);width:32%;height:22px;background:#111;border-radius:20px;z-index:2}}
.sheet{{position:absolute;background-size:cover;background-position:center;box-shadow:0 14px 30px rgba(30,5,10,.35);border-radius:4px}}
"""

def book(img, x, y, w, rot=-28, depth=None, z=0, tilt=0):
    h = round(w * 1.414); d = depth or round(w * 0.11)
    return f"""<div class='shadow' style='left:{x-10}px;top:{y+h-30}px;width:{w+60}px;height:70px;z-index:{z}'></div>
<div class='book' style='left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotateY({rot}deg) rotateX({tilt}deg);z-index:{z+1}'>
<div class='spine' style='width:{d}px'></div><div class='pages' style='width:{d}px'></div>
<div class='front' style='background-image:url({C}{img}.png)'></div></div>"""

def phone(img, x, y, w, rot=0, z=10):
    h = round(w * 2.05)
    return f"<div class='phone' style='left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg);z-index:{z}'><div class='scr' style='background-image:url({img})'></div></div>"

def sheet(img, x, y, w, ratio=1.294, rot=0, z=5):
    return f"<div class='sheet' style='left:{x}px;top:{y}px;width:{w}px;height:{round(w*ratio)}px;background-image:url({img});transform:rotate({rot}deg);z-index:{z}'></div>"

def scene(name, w, h, inner, bg="transparent"):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS} body{{width:{w}px;height:{h}px;background:{bg}}}</style></head><body><div class='scene' style='width:{w}px;height:{h}px'>{inner}</div></body></html>"
    render_png(html, f"{OUT}/{name}.png", w, h)

def all_scenes():
    # Hero: todo el sistema
    scene("hero-sistema-completo", 1600, 1200,
        book("rompehielos", 300, 150, 300, rot=-30, z=2) + book("preguntas", 1000, 150, 300, rot=-30, z=2) +
        book("manual", 330, 330, 360, rot=-30, z=4) + book("dinamicas", 900, 330, 360, rot=-30, z=4) +
        book("encuentros", 590, 230, 440, rot=-22, z=6) +
        phone(S+"encuentro-1.png", 1180, 560, 260, rot=5, z=9))
    # Plan básico
    scene("plan-basico", 1200, 1000,
        book("manual", 220, 160, 340, rot=22, z=2) + book("encuentros", 560, 110, 400, rot=-14, z=4) + phone(S+"encuentro-1.png", 880, 470, 220, rot=6, z=8))
    # Plan completo
    scene("plan-completo", 1200, 1000,
        sheet(P+"kit1_2.png", 20, 300, 270, rot=-10, z=1) + sheet(C+"kit2.png", 920, 260, 260, rot=9, z=1) +
        book("rompehielos", 170, 120, 250, rot=24, z=2) + book("preguntas", 780, 120, 250, rot=-24, z=2) +
        book("manual", 260, 270, 300, rot=20, z=4) + book("dinamicas", 640, 270, 300, rot=-20, z=4) + book("encuentros", 440, 200, 340, rot=-5, z=6) +
        phone(S+"encuentro-2.png", 900, 560, 190, rot=6, z=9))
    # Bonos
    scene("bono-1-kit-conexion", 1000, 1000, sheet(C+"kit1.png", 130, 140, 400, rot=-6, z=2) + sheet(P+"kit1_2.png", 470, 260, 420, rot=7, z=3) + sheet(P+"kit1_4.png", 330, 420, 360, rot=-2, z=4))
    scene("bono-2-kit-comunicacion", 1000, 1000, sheet(C+"kit2.png", 110, 150, 380, rot=-7, z=2) + sheet("file://"+ROOT+"/out/productos/Bono-2-Invitaciones/Invitacion-03.png", 470, 170, 360, ratio=1.25, rot=6, z=3) + phone("file://"+ROOT+"/out/productos/Bono-2-Invitaciones/Invitacion-12.png", 390, 420, 230, rot=-3, z=5))
    scene("bono-3-kit-organizacion", 1000, 1000, sheet(C+"kit3.png", 90, 130, 380, ratio=0.773, rot=-6, z=2) + sheet(P+"kit3_1.png", 420, 300, 500, ratio=0.773, rot=5, z=3) + sheet(P+"kit3_8.png", 240, 560, 440, ratio=0.773, rot=-3, z=4))
    scene("upsell-retiro", 1100, 1000, book("retiro", 300, 120, 420, rot=-16, z=3) + phone(S+"retiro.png", 700, 420, 220, rot=6, z=8) + sheet(P+"retiro_13.png", 80, 420, 260, ratio=1.414, rot=-8, z=1))
    # Carrusel "Mira por dentro": teléfono sobre fondo crema
    for name, img in [(n,n) for n in ["manual","encuentro-1","encuentro-2","dinamicas","rompehielos","preguntas"]]:
        scene(f"dentro-{name}", 900, 1100, phone(S+img+".png", 240, 70, 420, z=2), bg=f"radial-gradient(circle at 50% 40%,#fff,{CREAM} 70%)")

if __name__ == "__main__":
    all_scenes(); print("ok")
