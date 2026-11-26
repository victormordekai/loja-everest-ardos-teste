/* PÁGINA DO PRODUTO — lê o produto do endereço (produto.html#<slug>, ou ?p=<slug>), mostra e monta a grade de pessoas */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el, $, $$ } = LOJA;

  const slug = decodeURIComponent(location.hash.slice(1)) || new URLSearchParams(location.search).get('p') || '';
  window.addEventListener('hashchange', () => location.reload());
  const produto = LOJA.produtoPorSlug(slug);
  if (!produto) { $('[data-nao-encontrado]').hidden = false; document.title = 'Produto não encontrado · Loja Everest × ARDOS'; return; }

  // Conteúdo do produto
  $('[data-produto]').hidden = false;
  document.title = `${produto.nome} · Loja oficial Colégio Everest × ARDOS`;
  $('[data-trilha-atual]').textContent = produto.nome;
  $('[data-ref]').textContent = `REF ${produto.ref} · ${LOJA.categorias[produto.categoria]}`;
  $('[data-nome]').textContent = produto.nome;
  $('[data-descricao]').textContent = produto.descricao;
  produto.composicao.forEach(c => $('[data-composicao]').append(el('li', { text: c })));
  const foto = $('[data-foto]');
  foto.src = LOJA.imagemProduto(produto); foto.alt = produto.imagem.alt;
  if (produto.imagem.fundo === 'claro') $('[data-foto-caixa]').classList.add('produto__foto--clara');
  $('[data-foto-aviso]').textContent = produto.imagem.tipo === 'mockup'
    ? 'Imagem ilustrativa (mockup neutro). A foto do produto com a arte do Colégio Everest entra aqui.'
    : 'Imagem ilustrativa. A produção segue a arte aprovada.';
  const preco = $('[data-preco]');
  if (Number.isInteger(produto.precoCentavos)) preco.textContent = LOJA.divisao.formatarBRL(produto.precoCentavos) + ' por peça';
  else { preco.textContent = 'Preço a definir'; preco.classList.add('preco--pendente'); }
  LOJA.config.tamanhos.adulto.forEach(t => $('[data-tam-adulto]').append(el('span', { text: t })));
  LOJA.config.tamanhos.infantil.forEach(t => $('[data-tam-infantil]').append(el('span', { text: t })));
  $('[data-aviso-personalizacao]').hidden = produto.personalizacaoConfirmada;

  // Grade de pessoas
  const caixa = $('[data-pessoas]');
  const resumo = $('[data-resumo]');
  const erros = $('[data-erros]');
  const sucesso = $('[data-sucesso]');

  function atualizar() {
    LOJA.pessoas.renumerar(caixa, 'Pessoa');
    const n = $$('.pessoa', caixa).length;
    const unitario = LOJA.carrinho.precoUnidade(produto, false);
    resumo.textContent = `${n} ${n === 1 ? 'peça' : 'peças'}` + (unitario === null ? ' · preço a definir' : ' · ' + LOJA.divisao.formatarBRL(unitario * n));
    erros.textContent = ''; sucesso.textContent = '';
  }

  function adicionarPessoa(dados, focar) {
    const linha = LOJA.pessoas.criarLinha(produto, dados, atualizar, alvo => {
      if ($$('.pessoa', caixa).length > 1) { alvo.remove(); atualizar(); $('[data-adicionar]').focus(); }
      else { alvo.querySelectorAll('input').forEach(i => { i.value = ''; }); atualizar(); }
    });
    caixa.append(linha); atualizar();
    if (focar) linha.querySelector('select, input').focus();
  }

  $('[data-adicionar]').addEventListener('click', () => adicionarPessoa({}, true));

  $('[data-colocar]').addEventListener('click', () => {
    const linhas = $$('.pessoa', caixa);
    const lista = []; const mensagens = [];
    linhas.forEach((linha, i) => { const r = LOJA.pessoas.validarLinha(produto, linha, `Pessoa ${i + 1}`); lista.push(r.unidade); mensagens.push(...r.erros); });
    if (mensagens.length) {
      erros.textContent = mensagens.join('\n'); sucesso.textContent = '';
      const primeiro = caixa.querySelector('[aria-invalid="true"]'); primeiro && primeiro.focus();
      return;
    }
    LOJA.carrinho.adicionar({ tipo: 'individual', slug: produto.slug, unidades: lista });
    caixa.textContent = ''; adicionarPessoa({}, false);
    sucesso.textContent = '';
    sucesso.append(`${lista.length} ${lista.length === 1 ? 'peça adicionada' : 'peças adicionadas'} ao carrinho. `,
      el('a', { href: 'carrinho.html', text: 'Ir para o carrinho' }));
    sucesso.focus && sucesso.setAttribute('tabindex', '-1'); sucesso.focus();
  });

  adicionarPessoa({}, false);
})();
