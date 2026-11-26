/* GRADE DE PESSOAS — linha "uma peça por pessoa", no padrão da Grade Web do Portal Champions ARDOS
 * Usada na página do produto (várias pessoas no mesmo pedido) e na compra coletiva (várias equipes).
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el } = LOJA;

  const ROTULOS = { nome: 'Nome na peça', numero: 'Número', posicao: 'Posição', tamCalcao: 'Calção', variante: 'Cor / variante' };

  function opcoesTamanho(primeiro) {
    const t = LOJA.config.tamanhos;
    return [
      el('option', { value: '', text: primeiro }),
      el('optgroup', { label: 'Adulto' }, t.adulto.map(x => el('option', { value: x, text: x }))),
      el('optgroup', { label: 'Infantil' }, t.infantil.map(x => el('option', { value: x + ' INF', text: x + ' infantil' })))
    ];
  }

  function campo(rotulo, controle, extraClasse) {
    return el('label', { class: extraClasse || null }, el('span', {}, rotulo), controle);
  }

  /** Cria a linha de uma pessoa. dados preenche os campos; posicaoPadrao vale para compra coletiva. */
  function criarLinha(produto, dados, aoMudar, aoRemover, posicaoPadrao) {
    const d = dados || {};
    const linha = el('div', { class: 'pessoa', role: 'group' });
    linha.style.setProperty('--colunas', String(produto.campos.length));
    const numero = el('span', { class: 'pessoa__num', 'aria-hidden': 'true' });
    linha.append(numero);

    produto.campos.forEach(nomeCampo => {
      let controle;
      if (nomeCampo === 'tamanho') {
        controle = el('select', { name: 'tamanho', required: true }, opcoesTamanho('Escolha'));
        linha.append(campo(produto.rotuloTamanho || 'Tamanho', controle, 'meia'));
      } else if (nomeCampo === 'tamCalcao') {
        controle = el('select', { name: 'tamCalcao' }, el('option', { value: 'IGUAL', text: 'Igual à camisa' }), opcoesTamanho('Sem calção').slice(1));
        controle.prepend(el('option', { value: '', text: 'Sem calção' }));
        linha.append(campo(ROTULOS.tamCalcao, controle));
      } else if (nomeCampo === 'posicao') {
        controle = el('select', { name: 'posicao' }, LOJA.config.posicoes.map(p => el('option', { value: p, text: p })));
        linha.append(campo(ROTULOS.posicao, controle));
      } else if (nomeCampo === 'variante') {
        controle = el('select', { name: 'variante' }, produto.variantes.map(v => el('option', { value: v, text: v })));
        linha.append(campo(ROTULOS.variante, controle));
      } else if (nomeCampo === 'numero') {
        controle = el('input', { name: 'numero', inputmode: 'numeric', maxlength: '3', autocomplete: 'off', placeholder: 'Ex.: 10' });
        linha.append(campo(ROTULOS.numero, controle, 'meia'));
      } else if (nomeCampo === 'nome') {
        controle = el('input', { name: 'nome', maxlength: '60', autocomplete: 'off', placeholder: 'Como sai na peça' });
        linha.append(campo(ROTULOS.nome, controle));
      }
    });

    const remover = el('button', { type: 'button', class: 'pessoa__remover', text: '×' });
    linha.append(remover);

    // valores iniciais
    const definir = (nome, valor) => { const c = linha.querySelector(`[name="${nome}"]`); if (c && valor !== undefined && valor !== null) c.value = valor; };
    definir('tamanho', d.tamanho); definir('nome', d.nome); definir('numero', d.numero);
    definir('posicao', d.posicao || posicaoPadrao || 'NÃO SE APLICA');
    definir('tamCalcao', d.tamCalcao === undefined ? 'IGUAL' : d.tamCalcao);
    definir('variante', d.variante || produto.variantes[0]);

    linha.addEventListener('input', ev => {
      const alvo = ev.target;
      if (alvo.name === 'numero') alvo.value = alvo.value.replace(/\D/g, '').slice(0, 3);
      if (alvo.name === 'nome') alvo.value = LOJA.textoMaiusculo(alvo.value);
      alvo.removeAttribute('aria-invalid');
      aoMudar && aoMudar();
    });
    linha.addEventListener('change', () => aoMudar && aoMudar());
    remover.addEventListener('click', () => aoRemover && aoRemover(linha));
    return linha;
  }

  /** Renumera as linhas e atualiza os nomes acessíveis (Pessoa 1, Pessoa 2...). */
  function renumerar(container, rotulo) {
    [...container.querySelectorAll('.pessoa')].forEach((linha, i) => {
      linha.querySelector('.pessoa__num').textContent = String(i + 1);
      linha.setAttribute('aria-label', `${rotulo} ${i + 1}`);
      linha.querySelector('.pessoa__remover').setAttribute('aria-label', `Remover ${rotulo.toLowerCase()} ${i + 1}`);
    });
  }

  function lerLinha(linha) {
    const v = nome => { const c = linha.querySelector(`[name="${nome}"]`); return c ? c.value.trim() : ''; };
    const tamanho = v('tamanho');
    const calcao = v('tamCalcao');
    return {
      tamanho,
      nome: LOJA.textoMaiusculo(v('nome')).trim(),
      numero: v('numero'),
      posicao: v('posicao'),
      tamCalcao: linha.querySelector('[name="tamCalcao"]') ? (calcao === 'IGUAL' ? tamanho : calcao) : undefined,
      variante: v('variante')
    };
  }

  /** Confere uma pessoa; marca os campos com problema e devolve as mensagens. */
  function validarLinha(produto, linha, prefixo) {
    const u = lerLinha(linha); const erros = [];
    const marcar = nome => { const c = linha.querySelector(`[name="${nome}"]`); if (c) c.setAttribute('aria-invalid', 'true'); };
    if (!u.tamanho) { erros.push(`${prefixo}: escolha o tamanho.`); marcar('tamanho'); }
    if (produto.personalizacaoConfirmada && produto.campos.includes('nome') && produto.campos.includes('numero') && !u.nome && !u.numero) {
      erros.push(`${prefixo}: informe o nome ou o número que vai na peça.`); marcar('nome'); marcar('numero');
    }
    return { unidade: u, erros };
  }

  /** Texto curto de uma pessoa para resumos. */
  function descrever(produto, u) {
    const partes = [`${produto.rotuloTamanho || 'Tamanho'} ${u.tamanho}`];
    if (u.nome) partes.push(u.nome);
    if (u.numero) partes.push('nº ' + u.numero);
    if (u.tamCalcao) partes.push('calção ' + u.tamCalcao); else if (produto.campos.includes('tamCalcao')) partes.push('sem calção');
    if (u.posicao && u.posicao !== 'NÃO SE APLICA') partes.push(u.posicao.toLowerCase());
    return partes.join(' · ');
  }

  LOJA.pessoas = { criarLinha, renumerar, lerLinha, validarLinha, descrever };
})();
