# Ministerio de Parejas 365 — página de vendas LATAM

Página de vendas mobile-first de um produto digital (PDF) para líderes de ministérios de casais em igrejas cristãs da América Latina. Copy em **espanhol neutro**; documentação e conversa com o dono em **português**.

## Stack
Vite + React 18 + TypeScript + Tailwind 3 (compatível com Lovable). Sem backend próprio: o registro de eventos usa uma Neon Function (`neon/`).

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # gera dist/
```

## Mapa do projeto
| Caminho | O que é |
|---|---|
| `src/config.ts` | **Único lugar** de preços, links de checkout Cakto, back redirect, depoimentos e endpoint do Neon |
| `src/pages/Home.tsx` | Página de vendas (`/`) |
| `src/pages/OfertaEspecial.tsx` | Upsell pós-compra (`/oferta-especial`), aceita o HTML do "Gerador de Upsell" da Cakto |
| `src/pages/UltimaOportunidad.tsx` | Destino do back redirect |
| `src/pages/Fuentes.tsx` | Fontes e gratidão aos autores citados |
| `src/components/ui.tsx` | `CheckoutButton`, `CtaToPlans`, `StickyCta`, `Footer`, animações |
| `src/lib/tracking.ts` | UTMs, eventos do pixel, back redirect, registro no Neon |
| `index.html` | Meta Pixel 984364367619085 (PageView) e script de UTMs da UTMify |
| `public/img/` | Mockups em WebP (versões 480/800 ou 640/1100) |
| `neon/` | Função `eventos` e `schema.sql` (projeto Neon `delicate-cloud-41830941`) |
| `producto/` | Fonte em Python dos PDFs, mockups e criativos |
| `docs/` | Prompts (Claude Design, ChatGPT, Lovable) e textos de anúncios |

## Regras que não podem ser quebradas
1. **Pixel:** só em `index.html`. Nunca adicionar outro `fbq('init')`.
2. **Purchase e InitiateCheckout** vêm da Cakto/UTMify. Não disparar Purchase no site. IC só se `TRACK_INITIATE_CHECKOUT_ON_CLICK = true`.
3. **Todo botão de compra usa `CheckoutButton`** (repassa UTMs ao checkout e registra o clique). Nunca `<a href>` direto para a Cakto.
4. **Rolagem até os planos usa `scrollToId()`**, não `href="#..."` com navegação: entradas no histórico disparam o back redirect.
5. **Depoimentos, números e provas só reais.** Nada de escassez falsa, cronômetro que reinicia ou depoimento inventado.
6. **Anúncios Meta:** não afirmar características pessoais do público (religião): "Para líderes de ministerios…", nunca "¿Eres cristiano?".
7. **Espanhol neutro** (ustedes, celular, computadora). Versículos na RVR1960, com a referência.
8. **Mobile primeiro:** 390 px sem rolagem horizontal, botões ≥ 48 px, texto ≥ 16 px, imagens WebP com `srcset`, `loading="lazy"` abaixo da dobra, respeitar `prefers-reduced-motion`.
9. Credenciais (Neon, tokens) nunca no repositório.

## Antes de terminar qualquer alteração
Rode `/verificar` (build sem erros, links de checkout com UTMs, 390 px sem rolagem horizontal).
