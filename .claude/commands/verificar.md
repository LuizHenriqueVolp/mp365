---
description: Build, tipos e checagem mobile da página de vendas
---
1. Rode `npx tsc --noEmit -p .` e `npm run build`. Corrija qualquer erro.
2. Suba `npx vite preview --port 4173` e abra `http://localhost:4173/?utm_source=FB&utm_campaign=Teste|1` em viewport 390×844.
3. Confirme e relate em uma tabela:
   - Todos os `a[data-plan]` apontam para `pay.cakto.com.br` com as UTMs da URL.
   - `document.documentElement.scrollWidth` é 390 (sem rolagem horizontal).
   - O botão "Quiero mis encuentros listos" rola até `#planes` sem mudar a URL.
   - Tocar em "voltar" leva a `/ultima-oportunidad` com as mesmas UTMs.
   - Nenhum erro no console.
4. Encerre o servidor de preview.
