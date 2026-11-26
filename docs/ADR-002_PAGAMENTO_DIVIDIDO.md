# ADR-002 — Pagamento dividido em até 3 links

Data: 26/11/2026 · Situação: REGRA PROPOSTA; meio de pagamento PENDENTE

## Pedido (Victor, 26/11/2026)
- Qualquer produto ou valor pode ser pago em até 3 links (até 3 cartões). Exemplo: R$ 1.000 = R$ 300 + R$ 350 + R$ 350.
- Na compra coletiva, o organizador escolhe: um pagamento para o grupo ou um link para cada atleta.

## Regra implementada (assets/js/nucleo/divisao.js)
- Cada **cobrança** é dividida em 1 a 3 **links**, com valores livres.
- A divisão só vale se a soma fecha exatamente o total, em centavos; cada link tem valor mínimo (`valorMinimoPorLinkCentavos`).
- Modo **pedido**: uma cobrança com o total.
- Modo **por atleta**: uma cobrança por atleta da compra coletiva, mais uma para os itens avulsos do mesmo carrinho. Cada uma pode ter até 3 links.
- Testes: `node --test tests/divisao.test.js`.

## O que falta para valer em produção
Link de pagamento real só pode ser criado **no servidor** da ARDOS, com a chave do meio de pagamento guardada lá. Nada disso pode ir para o site.

Caminhos possíveis (decisão da Diretoria):
1. **WooCommerce, como no Clube Curitibano**, com extensão que gere vários links ou pagamentos parciais por pedido.
2. **API de links de pagamento** do meio já usado pela ARDOS, chamada por uma função no servidor que recebe o pedido, recalcula o total (o servidor não confia no valor vindo do navegador) e devolve os links.

Requisitos para qualquer caminho:
- Recalcular preço e total no servidor.
- Idempotência: repetir o envio não cria links duplicados.
- Conciliação: o pedido só vai para produção quando todos os links da cobrança estiverem pagos (ou conforme regra da Diretoria).
- Validade do link e o que acontece se um dos cartões não pagar: PENDENTE.
- Valor mínimo por link e número de parcelas: PENDENTE (dependem do meio de pagamento).
