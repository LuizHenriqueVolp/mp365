# Ministerio de Parejas 365 — página de vendas LATAM

Página de vendas mobile-first de um produto digital (PDF) para líderes de ministérios de casais em igrejas cristãs da América Latina. Copy em **espanhol neutro**; documentação e conversa com o dono em **português**.

## Stack
Vite + React 18 + TypeScript + Tailwind 4 (`@tailwindcss/vite`; tema em `src/index.css`, copiado de parejas365.lovable.app: Cormorant Garamond + Jost, paleta wine/gold/cream). Sem backend próprio: o registro de eventos usa uma Neon Function (`neon/`).

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # gera dist/
```

## Mapa do projeto
| Caminho | O que é |
|---|---|
| `src/config.ts` | **Único lugar** de preços, links de checkout Cakto, back redirect, depoimentos e endpoint do Neon |
| `src/pages/Home.tsx` | Página de vendas (`/`), réplica visual de parejas365.lovable.app com 2 planos lado a lado |
| `src/pages/OfertaEspecial.tsx` | Upsell pós-compra (`/oferta-especial`), aceita o HTML do "Gerador de Upsell" da Cakto |
| `src/pages/UltimaOportunidad.tsx` | Destino do back redirect |
| `src/pages/Fuentes.tsx` | Fontes e gratidão aos autores citados |
| `src/components/ui.tsx` | `CheckoutButton`, `CtaToPlans`, `Footer`, ornamentos SVG, lightbox |
| `src/lib/tracking.ts` | UTMs, eventos do pixel, back redirect, registro no Neon |
| `index.html` | `window.MP365_TRACKING` (pixel Meta 984364367619085 / pixel UTMify) e script de UTMs da UTMify |
| `public/img/lp/` | Imagens da página de vendas em WebP (hero 640/1100/1536, demais 480/800, depoimentos 300/600) |
| `neon/` | Função `eventos` e `schema.sql` (projeto Neon `delicate-cloud-41830941`) |
| `producto/` | Fonte em Python dos PDFs, mockups e criativos |
| `docs/` | Prompts (Claude Design, ChatGPT, Lovable) e textos de anúncios |

## Regras que não podem ser quebradas
1. **Pixel:** só em `index.html` (`window.MP365_TRACKING`). Nunca adicionar outro `fbq('init')`.
   - O pixel do Meta é carregado **sempre direto** e dispara PageView imediatamente (com `fbq.disablePushState = true` por causa do back redirect). Não mover isso para depois da UTMify: ela espera até 5 s pela consulta de IP e pelo servidor dela, e as visitas que saem antes não geram "visualização da página de destino" (deu 0 LPV em 18/11).
   - `utmifyPixelId` preenchido → a UTMify envia ViewContent, InitiateCheckout (regras de texto "QUIERO EL BASICO"/"QUIERO EL COMPLETO") e Purchase (navegador + API de Conversões). O site não dispara ViewContent nem IC.
   - Vazio → o site dispara ViewContent ao abrir a página e InitiateCheckout no clique (1 vez por plano por sessão). Os checkouts da Cakto **não** têm pixel.
2. **Nunca disparar Purchase no site.** Purchase vem da UTMify (webhook da Cakto) ou do pixel no produto da Cakto — nunca os dois junto com o site.
3. **Todo botão de compra usa `CheckoutButton`** (repassa UTMs ao checkout e registra o clique). Nunca `<a href>` direto para a Cakto.
4. **Rolagem até os planos usa `scrollToId()`**, não `href="#..."` com navegação: entradas no histórico disparam o back redirect.
5. **Garantia:** `GARANTIA_DIAS` em `src/config.ts` (14). Não escrever o número à mão.
6. **Depoimentos, números e provas só reais.** Nada de escassez falsa, cronômetro que reinicia ou depoimento inventado.
7. **Anúncios Meta:** não afirmar características pessoais do público (religião): "Para líderes de ministerios…", nunca "¿Eres cristiano?".
8. **Espanhol neutro** (ustedes, celular, computadora). Versículos na RVR1960, com a referência.
9. **Mobile primeiro:** 390 px sem rolagem horizontal, botões ≥ 48 px, texto ≥ 16 px, imagens WebP com `srcset`, `loading="lazy"` abaixo da dobra, respeitar `prefers-reduced-motion`.
10. Credenciais (Neon, tokens) nunca no repositório.

## Antes de terminar qualquer alteração
Rode `/verificar` (build sem erros, links de checkout com UTMs, 390 px sem rolagem horizontal).
