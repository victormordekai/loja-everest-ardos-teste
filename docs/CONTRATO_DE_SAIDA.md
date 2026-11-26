# Contrato de Saída — Loja oficial Colégio Everest × ARDOS

Kit Engenharia de Software e UI/UX com IA v2.0 · Opção 1 (com referência) · Gates M0–M4 condensados
Data-base: 26/11/2026 · Situação: **PROPOSTO, aguardando "de acordo" de Rafael ou Victor**

Marcação: **[F]** fato dito ou documentado · **[I]** inferência · **[H]** hipótese a validar.

## 1. Resumo do negócio

A ARDOS produz os uniformes esportivos do Colégio Everest em parceria com a diretoria da escola [F]. A escola não quer administrar pedidos nem pagamentos: a loja é o canal oficial de pedido, e a venda, a cobrança e a entrega ficam com a ARDOS [F]. Quem compra são as famílias e os alunos, cada um o seu, com retirada na escola [F]. Compra pela escola para turmas ou equipes é possível, mas não é o foco [F]. A estrutura de compra segue a do site do Clube Curitibano feito pela ARDOS [F].

## 2. Modelo de negócio

| Bloco | Conteúdo |
|---|---|
| Segmentos | Famílias e alunos do Colégio Everest [F]; organizadores de equipes e turmas [F]; a escola como cliente-parceira [F] |
| Proposta de valor | Uniforme oficial com nome e número, sem a escola precisar administrar pedidos [F]; pagamento dividido em até 3 cartões [F] |
| Canais | Site da loja; divulgação pela escola [I] |
| Receita | Venda por peça ou kit, paga no checkout da ARDOS [F]; preços: PENDENTE |
| Atividades-chave | Atendimento, produção (sublimação, corte, costura), separação por aluno e entrega na escola [I] |
| Parceiros | Diretoria do Colégio Everest [F] |
| Indicadores (proposta) | Pedidos por período; % de pedidos sem correção de grade; % pagos no prazo; tempo até a retirada [H] |

## 3. Posicionamento e mensagens

**Posicionamento [H]:** Para as famílias do Colégio Everest que precisam do uniforme esportivo oficial, a loja Everest × ARDOS é o canal oficial de pedido que entrega a peça personalizada na escola, porque a ARDOS já produz o kit oficial lançado na escola.

Mensagens-chave: (1) uniforme oficial, feito pela ARDOS; (2) uma pessoa ou o time inteiro no mesmo pedido; (3) pagamento dividido em até 3 cartões; (4) retirada na escola.

Tom: claro, não técnico; acolhedor, não infantil; institucional, não burocrático.

## 4. Tradução de atributos

| Atributo | Decisão observável | Verificação |
|---|---|---|
| Oficial | Escudo e cores do manual do Everest; ARDOS como fabricante no topo e no rodapé | Logos só de arquivo oficial |
| Confiável | Aviso de teste, preço "a definir" em vez de número inventado, política de dados | Nenhum dado sem fonte na tela |
| Moderno | Vitrine com entrada em cascata, filtro com reordenação animada, inclinação 3D ao passar o mouse | Animações desligam com "reduzir movimento" |

## 5. Escopo

| Agora (v0.1.0 teste) | Depois | Fora |
|---|---|---|
| Vitrine, página de produto, compra coletiva, carrinho com divisão em até 3 links, privacidade | Preços, tabela de medidas, fotos dos produtos, data de retirada, checkout real com links de pagamento (ADR-002) | Entrega em casa; área do cliente com login; integração automática com o Champions |

## 6. Módulos com gatilho

- **Checkout real com links de pagamento:** entra quando preços, meio de pagamento e responsável pela conciliação estiverem definidos.
- **Envio do pedido ao Champions/Extrator:** entra quando o contrato de dados da loja for aprovado pelo Departamento CORE.
- **Área do cliente:** só se houver pós-venda recorrente.

## 7. Requisitos não funcionais

- Acessibilidade: WCAG 2.2 AA como referência (sem declaração de conformidade).
- LGPD: dados mínimos (aluno, turma, unidade, responsável, e-mail, celular), finalidade e consentimento; nada no repositório.
- Segurança: site estático sem segredo; política de conteúdo (CSP); dado na tela só como texto.
- Desempenho: imagens WebP; sem bibliotecas externas; sem fontes baixadas.
- Manutenção: produtos em `assets/js/dados/produtos.js`; cabeçalho e rodapé em `tools/parciais/`.

## 8. Pendências

| # | Pendência | Responsável | Prazo |
|---|---|---|---|
| 1 | Preço de cada produto (hoje: valor de teste R$ 100,00, decisão de Victor em 26/11/2026) | Comercial / Diretoria | a definir |
| 2 | Tamanhos disponíveis por peça e tabela de medidas | Design / Produção | a definir |
| 3 | Campos de personalização por peça (exceto kit oficial) | Design | a definir |
| 4 | Variantes de cor | Design | a definir |
| 5 | Data, horário e forma da retirada na escola | Comercial + escola | a definir |
| 6 | Meio de pagamento, parcelas e valor mínimo por link (ADR-002) | Diretoria | a definir |
| 7 | Aprovação dos HEX derivados do manual pela escola | Comercial + escola | a definir |
| 8 | Texto final de privacidade com dados cadastrais da ARDOS | Diretoria | a definir |
| 9 | Domínio da loja oficial | Diretoria | a definir |

## 9. Aprovação

PENDENTE: de acordo de Rafael ou Victor, com data, no chat.
