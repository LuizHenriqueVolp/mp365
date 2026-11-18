# Ministerio de Parejas 365 — Página de vendas LATAM

Página de vendas mobile-first (Vite + React + TypeScript + Tailwind), compatível com a Lovable.

## Páginas
| Rota | Função |
|---|---|
| `/` | Página de vendas (2 planos: Básico US$ 9,90 · Completo US$ 17,90) |
| `/oferta-especial` | Upsell pós-compra: Retiro de Parejas Listo (US$ 14,90) |
| `/gracias` | Obrigado (sem disparar Purchase) |
| `/ultima-oportunidad` | Destino do back redirect da UTMify (Plano Básico em destaque, UTMs preservadas) |
| `/fuentes` | Fontes e gratidão às autoridades citadas (credibilidade, sem insinuar endosso) |
| `/privacidad`, `/terminos` | Legais |

## Já configurado
- Checkout Cakto: Básico `ruo23qa_1338917`, Completo `34tneui_1338932`, Upsell `x8e3ffn_1338948`
- Script de UTMs da UTMify (código oficial) e back redirect para `/ultima-oportunidad`
- 6 depoimentos reais (imagens servidas a partir de parejas365.lovable.app)

## Falta 1 passo (upsell em 1 clique)
Na Cakto: Produto principal → **Upsell/Downsell** → ative a página personalizada → URL `https://parejas365.vercel.app/oferta-especial` → **Gerador de Upsell** → copie o HTML e cole em `UPSELL_CAKTO_HTML` (`src/config.ts`). Sem isso, o upsell usa o link comum e o cliente precisa digitar o cartão de novo.

## Tracking (como medir LPV, checkout iniciado e compra com precisão)

| Evento | Onde dispara | Por quê |
|---|---|---|
| PageView | `index.html` (pixel 984364367619085) | Base da "visualização da página de destino" do Meta |
| ViewContent | Carregamento da página de vendas | Sinal de interesse |
| ClicComprar (personalizado) | Clique nos botões de plano | Mede intenção sem duplicar o IC |
| InitiateCheckout | **Checkout da Cakto** (pixel configurado lá) | Só conta quando o checkout realmente abre |
| Purchase | **Cakto / UTMify** (servidor) | Só o checkout sabe se o pagamento foi aprovado |

**Passos na Cakto:** em cada produto → Pixels/Rastreamento → adicione o pixel `984364367619085` com InitiateCheckout e Purchase ativos (e a API de Conversões, se disponível). Configure a integração com a UTMify (webhook) para ver as vendas por campanha/conjunto/anúncio.

**Se NÃO configurar o pixel na Cakto:** mude `TRACK_INITIATE_CHECKOUT_ON_CLICK` para `true` em `src/config.ts`.

**UTMify:** o script `latest.js` está em `index.html`. Confira no painel da UTMify o snippet exato recomendado para a Cakto e substitua se for diferente. Se usar o **pixel da própria UTMify** (envio pelo servidor), remova o bloco do Meta Pixel do `index.html` para não duplicar eventos e cole o script da UTMify no lugar.

**UTMs:** o site guarda as UTMs da primeira visita por 30 dias e as repassa ao link de checkout no clique (sem duplicar parâmetros).

## Registro próprio no Neon (backup do pixel)
- Projeto Neon: `ministerio-parejas-365-latam` (id `delicate-cloud-41830941`), tabela `eventos`.
- Função Neon `eventos` (código em `neon/functions/eventos.ts`) recebe os eventos do site. URL em `src/config.ts` → `EVENTS_ENDPOINT`.
- Consultas prontas (SQL Editor do Neon):
  - `SELECT * FROM embudo_diario;` → visitas, viram planos e cliques em comprar por dia e campanha
  - `SELECT * FROM scroll_secciones;` → até onde as pessoas rolam a página
- Schema completo: `neon/schema.sql`.

## Publicar pela Lovable
A Lovable **não importa** um repositório já existente: ela cria o próprio repositório ao conectar o GitHub. Caminho recomendado:
1. Crie um projeto em branco na Lovable e conecte ao GitHub (ela cria o repo).
2. Envie este código para esse repositório (push na branch `main`). A sincronização bidirecional traz tudo para a Lovable.
3. Publique pela Lovable e conecte o domínio.

Alternativa sem Lovable: importe o repositório na Vercel ou Netlify (build `npm run build`, saída `dist`). Para SPA, o `public/_redirects` e o `vercel.json` já redirecionam todas as rotas para `index.html`.

## Desenvolvimento
```bash
npm install
npm run dev     # http://localhost:8080
npm run build
```

## Checklist de aceite
- [ ] Links de checkout testados nos 2 planos e no upsell, com `?utm_source=teste` chegando na Cakto
- [ ] Meta Pixel Helper mostra PageView + ViewContent na página e InitiateCheckout no checkout
- [ ] Compra de teste aparece na UTMify e como Purchase no Gerenciador de Eventos
- [ ] Linha nova na tabela `eventos` do Neon após uma visita
- [ ] 390 px sem rolagem horizontal; Lighthouse mobile ≥ 90
