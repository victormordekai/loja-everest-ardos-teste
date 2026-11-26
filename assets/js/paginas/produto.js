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
  // Tamanhos clicáveis: cada clique coloca o tamanho na grade (1º clique preenche a 1ª linha vazia;
  // os seguintes criam linhas novas). O contador sobrescrito mostra quantas linhas têm aquele tamanho.
  const vende = LOJA.podeVender(produto);
  const faixas = [['infantil', t => t + ' INF', t => t], ['adulto', t => t, t => t], ['feminino', t => t + ' FEM', t => t + ' FEM']];
  faixas.forEach(([faixa, valorDe, rotuloDe]) => {
    const alvo = $(`[data-tam-${faixa}]`);
    LOJA.config.tamanhos[faixa].forEach(t => {
      const rotulo = rotuloDe(t);
      if (!vende) { alvo.append(el('span', { text: rotulo })); return; }
      const chip = el('button', { type: 'button', class: 'tamanho-chip', dataset: { valor: valorDe(t), rotulo }, 'aria-label': `Adicionar tamanho ${rotulo} à grade` },
        el('span', { text: rotulo }), el('sup', { class: 'tamanho-chip__conta', 'aria-hidden': 'true' }));
      chip.addEventListener('click', () => colocarTamanho(valorDe(t)));
      alvo.append(chip);
    });
  });
  if (vende) {
    $('[data-dica-tamanhos]').hidden = false;
    // Dica flutuante: abre suave ao passar o mouse (ou focar pelo teclado) num tamanho
    const dica = el('div', { class: 'tamanho-dica', id: 'dica-tamanhos', role: 'tooltip',
      text: 'Clique no tamanho para incluir uma peça na grade. Depois, desça até "Monte seu pedido" para completar nome e número.' });
    document.body.append(dica);
    const mostrarDica = chip => {
      const r = chip.getBoundingClientRect();
      dica.style.left = '0px'; dica.style.top = '0px'; dica.classList.add('visivel');
      const largura = dica.offsetWidth, altura = dica.offsetHeight;
      const x = Math.min(Math.max(8, r.left + r.width / 2 - 24), window.innerWidth - largura - 8);
      dica.style.left = x + 'px'; dica.style.top = (r.top - altura - 12) + 'px';
      dica.style.setProperty('--seta-x', Math.max(14, Math.min(largura - 14, r.left + r.width / 2 - x)) + 'px');
    };
    const esconderDica = () => dica.classList.remove('visivel');
    $$('.tamanho-chip').forEach(chip => {
      chip.setAttribute('aria-describedby', 'dica-tamanhos');
      chip.addEventListener('mouseenter', () => mostrarDica(chip));
      chip.addEventListener('mouseleave', esconderDica);
      chip.addEventListener('focus', () => mostrarDica(chip));
      chip.addEventListener('blur', esconderDica);
    });
    window.addEventListener('scroll', esconderDica, { passive: true });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape') esconderDica(); });
  }

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

  const CHAVE_RASCUNHO = 'produto:' + produto.slug;

  /** Conta quantas linhas usam cada tamanho e pinta os botões de tamanho. */
  function contarTamanhos() {
    const contagem = {};
    $$('.pessoa [name="tamanho"]', caixa).forEach(s => { if (s.value) contagem[s.value] = (contagem[s.value] || 0) + 1; });
    $$('.tamanho-chip').forEach(chip => {
      const n = contagem[chip.dataset.valor] || 0;
      chip.classList.toggle('tamanho-chip--ativo', n > 0);
      chip.setAttribute('aria-pressed', String(n > 0));
      chip.querySelector('.tamanho-chip__conta').textContent = n > 1 ? String(n) : '';
      chip.setAttribute('aria-label', `Adicionar tamanho ${chip.dataset.rotulo} à grade` + (n ? ` (${n} na grade)` : ''));
    });
  }

  function atualizar() {
    LOJA.pessoas.renumerar(caixa, 'Pessoa');
    const n = $$('.pessoa', caixa).length;
    const unitario = LOJA.carrinho.precoUnidade(produto, false);
    resumo.textContent = `${n} ${n === 1 ? 'peça' : 'peças'}` + (unitario === null ? ' · preço a definir' : ' · ' + LOJA.divisao.formatarBRL(unitario * n));
    erros.textContent = ''; sucesso.textContent = '';
    contarTamanhos();
    LOJA.rascunho.salvar(CHAVE_RASCUNHO, $$('.pessoa', caixa).map(LOJA.pessoas.lerBruto));
  }

  function adicionarPessoa(dados, focar) {
    const linha = LOJA.pessoas.criarLinha(produto, dados, atualizar, alvo => {
      if ($$('.pessoa', caixa).length > 1) { alvo.remove(); atualizar(); $('[data-adicionar]').focus(); }
      else { alvo.querySelectorAll('input').forEach(i => { i.value = ''; }); alvo.querySelector('[name="tamanho"]').value = ''; atualizar(); }
    });
    caixa.append(linha); atualizar();
    if (focar) linha.querySelector('select, input').focus();
    return linha;
  }

  /** Clique num tamanho: usa a primeira linha ainda sem tamanho; se não houver, cria outra linha. */
  function colocarTamanho(valor) {
    const vazia = $$('.pessoa [name="tamanho"]', caixa).find(s => !s.value);
    if (vazia) { vazia.value = valor; vazia.removeAttribute('aria-invalid'); atualizar(); return; }
    adicionarPessoa({ tamanho: valor }, false);
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
    LOJA.rascunho.apagar(CHAVE_RASCUNHO);
    sucesso.textContent = '';
    sucesso.append(`${lista.length} ${lista.length === 1 ? 'peça adicionada' : 'peças adicionadas'} ao carrinho. `,
      el('a', { href: 'carrinho.html', text: 'Ir para o carrinho' }));
    sucesso.setAttribute('tabindex', '-1'); sucesso.focus();
  });

  // Volta o que a pessoa já tinha preenchido (rascunho dentro do prazo), ou começa com uma linha.
  const salvo = LOJA.rascunho.ler(CHAVE_RASCUNHO);
  if (Array.isArray(salvo) && salvo.length) salvo.forEach(d => adicionarPessoa(d, false));
  else adicionarPessoa({}, false);
  $('[data-montar]').append(LOJA.rascunho.aviso());
})();
