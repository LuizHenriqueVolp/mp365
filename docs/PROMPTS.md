# Prompts — Ministerio de Parejas 365 (LATAM)

Todos os prompts abaixo já estão alinhados com a paleta e a tipografia usadas no produto e no site:

| Elemento | Valor |
|---|---|
| Vinho (primária) | `#6E1426` · escuro `#4A0D19` · claro `#8A1D33` |
| Ouro (destaque) | `#C9A04A` · claro `#E6C982` |
| Creme (fundo) | `#FBF6EE` |
| Texto | `#2B1B1E` |
| Títulos | Cinzel (serifada romana, caixa alta e baixa) |
| Citações / versículos | Cormorant Garamond Itálico |
| Corpo de texto | Lora |
| Etiquetas / botões | Montserrat (semibold/bold, caixa alta, espaçamento largo) |

---

## 1. Prompt para o Claude Design — identidade visual do produto

> Cole no Claude Design (tipo "Design System"). Anexe o logo `logo.png`.

```
Crie o design system completo da marca "Ministerio de Parejas 365", um produto digital para líderes de ministérios de casais em igrejas cristãs da América Latina (México, Colômbia, Chile, Peru, Equador e demais países de língua espanhola). Todo texto de exemplo deve estar em espanhol neutro.

Essência da marca: um sistema prático e confiável que tira do líder o peso de improvisar cada encontro. Tom: pastoral, acolhedor, sério e organizado; nunca "guru de marketing". Valores: aliança (pacto), cuidado, ordem, beleza simples. Símbolo: duas alianças entrelaçadas com um coração vinho e uma cruz dourada (ver logo anexo).

Paleta:
- Primária vinho #6E1426 (escuro #4A0D19, claro #8A1D33)
- Dourado #C9A04A (claro #E6C982) — apenas para destaques, filetes, números e ícones
- Creme #FBF6EE como fundo principal; branco #FFFFFF para cartões
- Texto #2B1B1E; texto secundário com 70% de opacidade
- Verde de confirmação discreto #15803D só para checks e garantias

Tipografia:
- Títulos: Cinzel 600/700
- Versículos e frases de destaque: Cormorant Garamond itálico 500
- Corpo: Lora 400/600, mínimo 16 px no celular
- Etiquetas, botões e preços: Montserrat 600/700, caixa alta, tracking 0,15–0,2em

Componentes a documentar (mobile-first, largura base 390 px):
1. Botão principal (vinho, pílula, altura mínima 56 px, brilho sutil animado) e botão dourado sobre fundo vinho
2. Eyebrow + título + filete dourado degradê (padrão de abertura de seção)
3. Cartão de conteúdo (branco, borda #EADFCF, raio 16 px)
4. Bloco de versículo (fundo creme, barra dourada à esquerda, texto em Cormorant itálico, referência em Montserrat dourado)
5. Selo numérico (círculo vinho com número branco) e contador grande dourado (24, 50, 40, 100)
6. Cartão de plano (Básico e Completo com selo "Recomendado")
7. Selo de garantia de 7 dias
8. Barra fixa de CTA no rodapé do celular
9. Capa de e-book A5 (fundo vinho em degradê radial, moldura dourada dupla, logo circular, título em Cinzel branco)
10. Template de criativo para Meta Ads em 1:1, 4:5 e 9:16 (zonas seguras de 14% em cima e embaixo nos stories)
11. Convite para WhatsApp 1080×1350 com campos FECHA / HORA / LUGAR

Regras:
- Dourado nunca em blocos grandes de texto; só destaques.
- Sem fotos de pessoas reais famosas, sem logotipos de outras marcas, sem símbolos de denominações específicas.
- Acessibilidade: contraste AA, alvos de toque ≥ 48 px, respeitar prefers-reduced-motion.
- Inclua do's and don'ts e exemplos lado a lado (certo × errado).
```

---

## 2. Prompts para gerar mockups premium (ChatGPT / imagem)

Os mockups do site foram gerados por código a partir das capas reais. Se quiser versões fotográficas mais sofisticadas para anúncios, use estes prompts. **Sempre anexe a capa real** (pasta `capas/`) para a IA manter o design fiel e não inventar texto.

### 2.1 Hero — sistema completo
```
Fotografia de produto ultrarrealista, estilo e-commerce premium. Sobre uma mesa de madeira clara com luz natural suave vinda da esquerda, organize: 5 livros de capa dura vinho com detalhes dourados (use EXATAMENTE as capas anexas, sem alterar texto), um smartphone moderno mostrando uma página interna creme com títulos vinho, algumas cartas impressas com versículos e uma pequena trança de três cordões (vinho, dourado e creme). Fundo creme #FBF6EE desfocado, profundidade de campo rasa, sombras suaves. Composição centralizada com espaço livre no topo para título. Formato 4:5, 2160×2700 px. Sem pessoas, sem mãos, sem marcas d'água, sem texto adicional.
```

### 2.2 Cena de uso — encontro de casais
```
Fotografia realista e acolhedora de um salão de igreja simples na América Latina à noite, luz quente. Em primeiro plano, sobre uma mesa redonda, um tablet e um livro de capa vinho (capa anexa, não altere o texto), xícaras de café e cartões impressos. Ao fundo, desfocados, casais de 30 a 50 anos de diversas etnias latino-americanas conversando em pares, sorrindo. Formato 1:1, 2048×2048. Rostos desfocados e genéricos, sem pessoas famosas, sem texto adicional.
```

### 2.3 Bônus (um por vez)
```
Mockup flat lay vista de cima, fundo creme texturizado. Mostre o material impresso anexo (cartões recortados / convites / planners) espalhado de forma organizada, com uma tesoura dourada, um lápis e um ramo de eucalipto. Luz suave, sombras curtas, cores fiéis ao arquivo anexo. Formato 1:1, 2048×2048. Não invente texto: use apenas o que aparece nas imagens anexas.
```

### 2.4 Upsell — retiro
```
Fotografia de produto: livro de capa vinho "Retiro de Parejas Listo" (capa anexa, sem alterar texto) apoiado numa manta de linho creme, ao lado de duas taças, velas acesas e uma trança de três cordões. Ao fundo, desfocado, uma fogueira ao ar livre ao entardecer. Formato 4:5. Sem pessoas, sem texto adicional.
```

---

## 3. Prompt para a Lovable (caso queira recriar ou ajustar pela Lovable)

```
Este projeto é uma página de vendas mobile-first (Vite + React + TypeScript + Tailwind) para o produto "Ministerio de Parejas 365" em espanhol neutro para a América Latina. Não altere a copy, as cores, as fontes nem a estrutura sem que eu peça.

Regras que devem ser mantidas em qualquer alteração:
1. O Pixel da Meta 984364367619085 está em index.html (PageView). Não duplique o pixel em nenhum componente.
2. ViewContent dispara em src/pages/Home.tsx; clique em comprar usa CheckoutButton (src/components/ui.tsx), que repassa as UTMs ao checkout da Cakto via checkoutUrl() e registra o evento no Neon (src/lib/tracking.ts). Todo botão de compra novo deve usar CheckoutButton.
3. InitiateCheckout e Purchase são disparados pela Cakto/UTMify. Não adicionar Purchase no site.
4. Preços, links de checkout e testemunhos ficam SOMENTE em src/config.ts.
5. Imagens em /public/img em WebP com srcset; manter loading="lazy" abaixo da dobra e fetchpriority="high" no hero.
6. Manter 390 px sem rolagem horizontal, botões ≥ 48 px, texto ≥ 16 px, e respeitar prefers-reduced-motion.
```
