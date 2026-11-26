/* COMPRA COLETIVA — várias equipes, uma linha por atleta (padrão da Grade Web do Portal Champions ARDOS) */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el, $, $$ } = LOJA;
  const caixa = $('[data-equipes]');
  const erros = $('[data-erros]');
  const revisao = $('[data-revisao]');
  let contadorEquipes = 0;
  let pedidoConferido = null;

  function produtoDa(equipe) { return LOJA.produtoPorSlug(equipe.querySelector('[name="produto"]').value); }

  function atualizar() {
    let atletas = 0; let semPreco = false; let total = 0;
    $$('.equipe', caixa).forEach((equipe, i) => {
      equipe.querySelector('h2').textContent = `Equipe ${i + 1}`;
      equipe.setAttribute('aria-label', `Equipe ${i + 1}`);
      const linhas = equipe.querySelector('.pessoas');
      LOJA.pessoas.renumerar(linhas, 'Atleta');
      const n = $$('.pessoa', linhas).length; atletas += n;
      equipe.querySelector('[data-conta]').textContent = `${n} ${n === 1 ? 'atleta' : 'atletas'}`;
      const unit = LOJA.carrinho.precoUnidade(produtoDa(equipe), false);
      if (unit === null) semPreco = true; else total += unit * n;
    });
    const nEq = $$('.equipe', caixa).length;
    $('[data-totais]').textContent = `${nEq} ${nEq === 1 ? 'equipe' : 'equipes'} · ${atletas} ${atletas === 1 ? 'atleta' : 'atletas'} · ` +
      (semPreco ? 'preço a definir' : LOJA.divisao.formatarBRL(total));
    revisao.hidden = true; pedidoConferido = null; erros.textContent = '';
  }

  function adicionarAtleta(equipe, dados, focar) {
    const produto = produtoDa(equipe);
    const linhas = equipe.querySelector('.pessoas');
    const linha = LOJA.pessoas.criarLinha(produto, dados, atualizar, alvo => {
      if ($$('.pessoa', linhas).length > 1) { alvo.remove(); atualizar(); equipe.querySelector('[data-novo-atleta]').focus(); }
      else { alvo.querySelectorAll('input').forEach(i => { i.value = ''; }); atualizar(); }
    }, 'LINHA');
    linhas.append(linha); atualizar();
    if (focar) linha.querySelector('select, input').focus();
  }

  /** Troca de peça: refaz as linhas mantendo o que ainda se aplica. */
  function trocarProduto(equipe) {
    const linhas = equipe.querySelector('.pessoas');
    const dados = $$('.pessoa', linhas).map(l => LOJA.pessoas.lerLinha(l));
    linhas.textContent = '';
    dados.forEach(d => adicionarAtleta(equipe, Object.assign({}, d, { tamCalcao: d.tamCalcao === undefined ? undefined : d.tamCalcao || '' }), false));
  }

  function novaEquipe(focar) {
    contadorEquipes++;
    const idNome = 'equipe-nome-' + contadorEquipes, idProduto = 'equipe-produto-' + contadorEquipes;
    const seletor = el('select', { id: idProduto, name: 'produto' }, LOJA.produtos.filter(LOJA.podeVender).map(p => el('option', { value: p.slug, text: p.nome + (p.situacao === 'em-desenvolvimento' ? ' (em desenvolvimento)' : '') })));
    const equipe = el('section', { class: 'equipe', role: 'group' },
      el('div', { class: 'equipe__topo' },
        el('h2', { text: 'Equipe' }),
        el('div', { class: 'campo' }, el('label', { for: idNome, text: 'Nome do time ou da turma' }),
          el('input', { id: idNome, name: 'nomeEquipe', maxlength: '90', autocomplete: 'off', placeholder: 'Ex.: Futsal Sub-15' })),
        el('div', { class: 'campo' }, el('label', { for: idProduto, text: 'Peça do time' }), seletor),
        el('button', { type: 'button', class: 'botao botao--texto', 'data-remover-equipe': '', text: 'Remover equipe' })),
      el('div', { class: 'pessoas' }),
      el('div', { class: 'resumo-linha' },
        el('button', { type: 'button', class: 'botao botao--secundario', 'data-novo-atleta': '', text: '＋ Adicionar atleta' }),
        el('strong', { 'data-conta': '' })));
    caixa.append(equipe);
    equipe.querySelector('[name="nomeEquipe"]').addEventListener('input', ev => { ev.target.value = LOJA.textoMaiusculo(ev.target.value); ev.target.removeAttribute('aria-invalid'); atualizar(); });
    seletor.addEventListener('change', () => trocarProduto(equipe));
    equipe.querySelector('[data-novo-atleta]').addEventListener('click', () => adicionarAtleta(equipe, {}, true));
    equipe.querySelector('[data-remover-equipe]').addEventListener('click', () => {
      if ($$('.equipe', caixa).length > 1) { equipe.remove(); atualizar(); $('[data-nova-equipe]').focus(); }
      else { erros.textContent = 'O pedido precisa de pelo menos uma equipe.'; }
    });
    adicionarAtleta(equipe, {}, false);
    if (focar) equipe.querySelector('[name="nomeEquipe"]').focus();
  }

  function ler() {
    const mensagens = [];
    const equipes = $$('.equipe', caixa).map((equipe, e) => {
      const produto = produtoDa(equipe);
      const campoNome = equipe.querySelector('[name="nomeEquipe"]');
      const nome = campoNome.value.trim();
      if (!nome) { mensagens.push(`Equipe ${e + 1}: informe o nome do time ou da turma.`); campoNome.setAttribute('aria-invalid', 'true'); }
      const rotulo = nome || `Equipe ${e + 1}`;
      const atletas = $$('.pessoa', equipe).map((linha, i) => {
        const r = LOJA.pessoas.validarLinha(produto, linha, `${rotulo} / atleta ${i + 1}`);
        mensagens.push(...r.erros); return r.unidade;
      });
      // números repetidos no mesmo time: aviso, não bloqueio
      const vistos = {}; atletas.forEach(a => { if (a.numero) vistos[a.numero] = (vistos[a.numero] || 0) + 1; });
      const repetidos = Object.keys(vistos).filter(k => vistos[k] > 1);
      return { nome: rotulo, slug: produto.slug, atletas, repetidos };
    });
    return { equipes, mensagens };
  }

  function mostrarRevisao(equipes) {
    const lista = $('[data-revisao-lista]'); lista.textContent = '';
    equipes.forEach(eq => {
      const produto = LOJA.produtoPorSlug(eq.slug);
      const porTamanho = {}; eq.atletas.forEach(a => { porTamanho[a.tamanho] = (porTamanho[a.tamanho] || 0) + 1; });
      lista.append(el('div', { class: 'produto__bloco' },
        el('h3', { text: `${eq.nome} · ${produto.nome}` }),
        el('p', { text: `${eq.atletas.length} ${eq.atletas.length === 1 ? 'atleta' : 'atletas'}` }),
        el('div', { class: 'etiquetas' }, Object.entries(porTamanho).map(([t, n]) => el('span', { text: `${t} × ${n}` }))),
        eq.repetidos.length ? el('p', { class: 'aviso', text: `Atenção: número repetido neste time (${eq.repetidos.join(', ')}). Confira se é isso mesmo.` }) : null));
    });
  }

  $('[data-nova-equipe]').addEventListener('click', () => novaEquipe(true));
  $('[data-conferir]').addEventListener('click', () => {
    const { equipes, mensagens } = ler();
    if (mensagens.length) {
      erros.textContent = mensagens.join('\n'); revisao.hidden = true;
      const primeiro = caixa.querySelector('[aria-invalid="true"]'); primeiro && primeiro.focus();
      return;
    }
    erros.textContent = ''; pedidoConferido = equipes;
    mostrarRevisao(equipes); revisao.hidden = false; $('#revisao-titulo').focus();
  });
  $('[data-confirmar]').addEventListener('click', () => {
    if (!pedidoConferido) return;
    LOJA.carrinho.adicionar({ tipo: 'coletivo', equipes: pedidoConferido.map(eq => ({ nome: eq.nome, slug: eq.slug, atletas: eq.atletas })) });
    location.href = 'carrinho.html';
  });

  novaEquipe(false);
})();
