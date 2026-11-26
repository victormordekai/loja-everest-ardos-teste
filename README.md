# Loja oficial Colégio Everest × ARDOS · v0.2.0 (teste)

Loja de uniformes esportivos personalizados do Colégio Everest, produzidos e vendidos pela ARDOS.
**Versão de teste:** nada é enviado nem cobrado. Todos os produtos usam o valor de teste R$ 100,00; preços reais, tabela de medidas e data de retirada ainda não estão definidos.

## Situação dos produtos (`situacao` em `produtos.js`)
| Situação | Na vitrine | Venda |
|---|---|---|
| `disponivel` | Normal | Sim |
| `em-desenvolvimento` | Foto em cinza e afastada, com "Produto em desenvolvimento · Em breve, descrições e valores atualizados." | Só na versão de teste (`vendaEmDesenvolvimentoNoTeste`) |
| `indisponivel` | Foto em cinza, com "Produto sem estoque ou fora do catálogo" | Nunca |

Para lançar um produto: troque a foto, preencha `precoCentavos`, apague `precoTeste` e mude `situacao` para `disponivel`.

## O que tem
| Página | Para quê |
|---|---|
| `index.html` | Vitrine animada com filtro, como funciona, compra coletiva e dúvidas |
| `pages/produto.html#<slug>` | Produto, tamanhos e grade de pessoas (tamanho, nome, número, posição, calção, variante) |
| `pages/coletiva.html` | Compra do time: várias equipes, uma linha por atleta (padrão da Grade Web do Portal Champions) |
| `pages/carrinho.html` | Revisão, quem retira na escola e divisão do pagamento em até 3 links por cobrança |
| `pages/privacidade.html` | Dados pessoais (texto de trabalho) |

## Como rodar
Abra `index.html` no navegador, ou sirva a pasta:
```
python3 -m http.server 8000
```

## Onde mexer
| Quero mudar | Arquivo |
|---|---|
| Produto, preço, foto, campos de personalização | `assets/js/dados/produtos.js` (instruções no topo) |
| Foto de um produto | `assets/img/produtos/<slug>.webp` (mesmo nome) |
| Tamanhos, posições, contatos, unidades, regras de divisão | `assets/js/config.js` |
| Cores e fontes | `assets/css/tokens.css` (cada valor diz a origem) |
| Cabeçalho, rodapé, versão | `tools/parciais/` e depois `python3 tools/montar_paginas.py` |
| Texto das páginas | `tools/fontes/` e depois `python3 tools/montar_paginas.py` |

Não edite `index.html` e `pages/*.html` direto: eles são gerados.

## Testes
```
node --test tests/divisao.test.js          # regras de divisão do pagamento
python3 tests/teste_navegador.py http://127.0.0.1:8000/ capturas/   # fluxos no navegador (Playwright + Chrome)
```

## Decisões e pendências
- `docs/CONTRATO_DE_SAIDA.md` — modelo de negócio, escopo e pendências.
- `docs/ADR-001_TIPO_DE_PRODUTO_E_STACK.md` — por que site estático nesta versão.
- `docs/ADR-002_PAGAMENTO_DIVIDIDO.md` — regra dos 3 links e o que falta para o pagamento real.

## Segurança e dados
- Site estático: tudo aqui é público. Nenhuma chave, senha ou endereço interno.
- O carrinho fica só no navegador de quem compra, por até 24 horas.
- Nenhum dado real de aluno ou pedido entra neste repositório.

## Direitos
Código © 2026 ARDOS, todos os direitos reservados. As marcas Colégio Everest e ARDOS pertencem aos seus titulares e não estão licenciadas para reuso.

Vestimos Identidades. Entregamos Confiança.
