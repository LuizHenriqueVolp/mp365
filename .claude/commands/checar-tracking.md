---
description: Auditoria do rastreamento (pixel, UTMify, Cakto, Neon)
---
Audite o rastreamento sem alterar nada e entregue um relatório curto em português:
1. `index.html`: exatamente um `fbq('init', '984364367619085')` e um PageView; script de UTMs da UTMify presente.
2. `src/lib/tracking.ts` e `src/config.ts`: ViewContent no carregamento; `ClicComprar` no clique; `TRACK_INITIATE_CHECKOUT_ON_CLICK` e o motivo do valor atual; nenhum Purchase no site.
3. Todos os botões de compra usam `CheckoutButton`; liste qualquer `<a>` para `pay.cakto.com.br` fora dele.
4. `UPSELL_CAKTO_HTML` preenchido? Se vazio, avise que o upsell não é 1 clique.
5. Lembre o que conferir fora do código: pixel e token da API de Conversão nos 3 produtos da Cakto; integração Cakto → UTMify; padrão de UTMs dos anúncios em `docs/ANUNCIOS.md`.
