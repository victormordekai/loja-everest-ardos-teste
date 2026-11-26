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
  // Galeria: foto principal + outras fotos (produto.fotos) + espaços vazios até LOJA.config.fotosPorProduto
  const foto = $('[data-foto]');
  const caixaFoto = $('[data-foto-caixa]');
  const fotos = [produto.imagem].concat(produto.fotos || []);
  const fundoDe = f => f.fundo || produto.imagem.fundo;
  function mostrarFoto(i) {
    foto.src = LOJA.raiz() + 'assets/img/produtos/' + fotos[i].src; foto.alt = fotos[i].alt;
    caixaFoto.classList.toggle('produto__foto--clara', fundoDe(fotos[i]) === 'claro');
    $$('[data-miniaturas] button').forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
  }
  const listaMini = $('[data-miniaturas]');
  for (let i = 0; i < Math.max(LOJA.config.fotosPorProduto, fotos.length); i++) {
    if (fotos[i]) {
      const b = el('button', { type: 'button', class: 'miniatura' + (fundoDe(fotos[i]) === 'claro' ? ' miniatura--clara' : ''), 'aria-label': `Ver foto ${i + 1}` },
        el('img', { src: LOJA.raiz() + 'assets/img/produtos/' + fotos[i].src, alt: '', loading: 'lazy', width: '96', height: '72' }));
      b.addEventListener('click', () => mostrarFoto(i));
      listaMini.append(el('li', {}, b));
    } else {
      listaMini.append(el('li', {}, el('span', { class: 'miniatura miniatura--vazia', text: 'Foto em breve' })));
    }
  }
  mostrarFoto(0);

  // Zoom: com o mouse, acompanha o ponteiro; no toque, um toque liga e o dedo arrasta; outro toque desliga.
  function moverZoom(ev) {
    const r = caixaFoto.getBoundingClientRect();
    caixaFoto.style.setProperty('--zx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    caixaFoto.style.setProperty('--zy', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }
  caixaFoto.addEventListener('pointerenter', ev => { if (ev.pointerType === 'mouse') { caixaFoto.classList.add('zoom'); moverZoom(ev); } });
  caixaFoto.addEventListener('pointerleave', ev => { if (ev.pointerType === 'mouse') caixaFoto.classList.remove('zoom'); });
  caixaFoto.addEventListener('pointermove', ev => { if (caixaFoto.classList.contains('zoom')) moverZoom(ev); });
  caixaFoto.addEventListener('pointerdown', ev => {
    if (ev.pointerType === 'mouse') return;
    const ligar = !caixaFoto.classList.contains('zoom');
    caixaFoto.classList.toggle('zoom', ligar); caixaFoto.classList.toggle('zoom-toque', ligar);
    if (ligar) moverZoom(ev);
  });
  $('[data-zoom-dica]').textContent = window.matchMedia('(hover: hover)').matches ? 'Passe o mouse na foto para ampliar.' : 'Toque na foto para ampliar e arraste o dedo.';
  $('[data-foto-aviso]').textContent = produto.imagem.tipo === 'mockup'
    ? 'Imagem ilustrativa (mockup neutro). A foto do produto com a arte do Colégio Everest entra aqui.'
    : 'Imagem ilustrativa. A produção segue a arte aprovada.';
  const preco = $('[data-preco]');
  preco.textContent = LOJA.textoPreco(produto) + (Number.isInteger(produto.precoCentavos) ? ' por peça' : '');
  if (!Number.isInteger(produto.precoCentavos) || produto.precoTeste) preco.classList.add('preco--pendente');
  const M = LOJA.config.mensagens; const situacao = $('[data-situacao]');
  if (produto.situacao === 'em-desenvolvimento') { situacao.hidden = false; situacao.textContent = `${M.emDesenvolvimento}. ${M.emDesenvolvimentoDetalhe}` + (LOJA.podeVender(produto) ? ' Nesta versão de teste, você já pode montar o pedido.' : ''); }
  if (produto.situacao === 'indisponivel') { situacao.hidden = false; situacao.textContent = M.indisponivel + '.'; }
  if (!LOJA.podeVender(produto)) { $('[data-montar]').hidden = true; }
  LOJA.config.tamanhos.infantil.forEach(t => $('[data-tam-infantil]').append(el('span', { text: t })));
  LOJA.config.tamanhos.adulto.forEach(t => $('[data-tam-adulto]').append(el('span', { text: t })));
  LOJA.config.tamanhos.feminino.forEach(t => $('[data-tam-feminino]').append(el('span', { text: t + ' FEM' })));

  // Painel (HUD) da tabela de medidas
  const hud = $('[data-hud-medidas]');
  const botaoMedidas = $('[data-abrir-medidas]');
  let medidasMontadas = false;
  botaoMedidas.addEventListener('click', () => {
    if (!medidasMontadas) { LOJA.tabelaMedidas.montar(hud.querySelector('[data-medidas]')); medidasMontadas = true; }
    if (hud.showModal) hud.showModal(); else hud.setAttribute('open', '');
    hud.querySelector('.medidas__faixas button').focus();
  });
  const fecharHud = () => { if (hud.close) hud.close(); else hud.removeAttribute('open'); };
  $('[data-fechar-medidas]').addEventListener('click', fecharHud);
  hud.addEventListener('click', ev => { if (ev.target === hud) fecharHud(); }); // clique fora do painel
  hud.addEventListener('close', () => botaoMedidas.focus());
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
