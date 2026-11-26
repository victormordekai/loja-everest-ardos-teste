# ADR-001 — Tipo de produto e stack da loja (v0.1.0)

Data: 26/11/2026 · Situação: PROPOSTA

## Contexto
O pedido é uma loja com catálogo, personalização por pessoa, compra coletiva e pagamento dividido. A referência (clubecuritibanoardos.com.br) roda em WordPress com loja no padrão WooCommerce, e o checkout já cai na ARDOS. Ainda não há preços, meio de pagamento definido nem integração com o Champions.

## Opções
1. Montar já em WordPress/WooCommerce, como o Clube Curitibano.
2. Front-end estático (HTML, CSS e JS nativos) para validar a experiência, e decidir o checkout depois.
3. Aplicação com back-end próprio desde o início.

## Decisão
Opção 2 nesta versão de teste. A interface valida fluxo, identidade e regras de divisão sem depender de dados que ainda não existem. O checkout real segue a ADR-002.

## Consequências
- Publicável em hospedagem estática (GitHub Pages) para teste.
- Nada é enviado; o carrinho fica no navegador por até 24 h.
- O catálogo (`produtos.js`) e o motor de divisão (`divisao.js`) podem ser reaproveitados no tema WooCommerce ou em outra solução.
- Sem bibliotecas: scripts clássicos, que também abrem por arquivo local.
