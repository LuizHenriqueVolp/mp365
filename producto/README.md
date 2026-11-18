# Fonte dos entregáveis

Textos dos produtos em `content/` (Python, espanhol). Para regenerar PDFs, mockups e criativos:

```bash
pip install playwright pillow pypdfium2 && playwright install chromium
npm i @fontsource/cinzel @fontsource/cormorant-garamond @fontsource/lora @fontsource/montserrat --prefix ../fonts
python3 build_products.py && python3 mockups.py && python3 creatives.py
```
(Os scripts esperam a estrutura `content/`, `render/`, `fonts/`, `out/` — ajuste `ROOT` em `base.py` se necessário.)
