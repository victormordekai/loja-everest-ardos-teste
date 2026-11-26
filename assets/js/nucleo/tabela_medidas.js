/* TABELA DE MEDIDAS — monta Infantil / Adulto / Feminino em qualquer recipiente
 * Usada no painel (HUD) da página do produto e na página tabela_de_medidas.html.
 * Abrir uma faixa fecha a anterior. Dados em assets/js/dados/medidas.js.
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el } = LOJA;
  const NS = 'http://www.w3.org/2000/svg';
  let contador = 0;

  function s(tag, attrs, ...filhos) {
    const no = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => no.setAttribute(k, String(v)));
    filhos.forEach(f => no.append(f instanceof Node ? f : document.createTextNode(String(f))));
    return no;
  }
  /** Seta com rótulo: de (x1,y1) a (x2,y2), letra em (lx,ly). */
  function cota(idPonta, x1, y1, x2, y2, letra, lx, ly) {
    return s('g', { class: 'cota' },
      s('line', { x1, y1, x2, y2, 'marker-start': `url(#${idPonta})`, 'marker-end': `url(#${idPonta})` }),
      s('text', { x: lx, y: ly }, letra));
  }
  function desenho(peca, titulo) {
    const svg = s('svg', { viewBox: '0 0 220 200', class: 'medidas__desenho', role: 'img', 'aria-label': `Desenho de referência: ${titulo}` });
    const p = 'ponta-' + (++contador); // id único por desenho
    svg.append(s('defs', {}, s('marker', { id: p, viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' },
      s('path', { d: 'M0,0 L10,5 L0,10 z' }))));
    if (peca === 'camisa') {
      svg.append(s('path', { class: 'peca', d: 'M80 20 Q110 38 140 20 L182 40 L204 82 L176 94 L164 72 L164 186 L56 186 L56 72 L44 94 L16 82 L38 40 Z' }));
      svg.append(cota(p, 70, 30, 70, 184, 'A', 58, 112), cota(p, 58, 140, 162, 140, 'B', 106, 133), cota(p, 146, 30, 196, 80, 'C', 176, 46));
    } else {
      svg.append(s('path', { class: 'peca', d: 'M50 28 L170 28 L184 172 L122 172 L110 92 L98 172 L36 172 Z' }));
      svg.append(s('line', { class: 'cos', x1: 50, y1: 44, x2: 170, y2: 44 }));
      svg.append(cota(p, 24, 30, 24, 170, 'A', 12, 104), cota(p, 52, 16, 168, 16, 'B', 106, 12), cota(p, 110, 46, 110, 90, 'C', 116, 72), cota(p, 124, 160, 182, 160, 'D', 150, 154));
    }
    return svg;
  }

  function tabela(t) {
    const id = 'med-' + (++contador);
    const cab = el('tr', {}, el('th', { scope: 'col', text: 'Medida' }), t.tamanhos.map(tam => el('th', { scope: 'col', text: tam })));
    const linhas = t.linhas.map(l => el('tr', {},
      el('th', { scope: 'row' }, el('span', { class: 'medidas__letra', text: l.letra }), ' ' + l.nome),
      l.valores.map((v, i) => el('td', {}, `${v} cm`, l.esticado ? el('small', { text: `esticado: ${l.esticado[i]} cm` }) : null))));
    return el('figure', { class: 'medidas__tabela' },
      el('figcaption', { id, text: t.titulo + ' (cm)' }),
      el('div', { class: 'medidas__corpo' },
        desenho(t.peca, t.titulo),
        el('div', { class: 'medidas__rolagem', role: 'region', tabindex: '0', 'aria-labelledby': id },
          el('table', {}, el('thead', {}, cab), el('tbody', {}, linhas)),
          el('p', { class: 'medidas__dica', text: 'Arraste a tabela para o lado para ver todos os tamanhos.' }))));
  }

  /** Monta o seletor e os painéis dentro de `alvo`. */
  function montar(alvo) {
    const M = LOJA.medidas;
    alvo.textContent = '';
    const botoes = el('div', { class: 'medidas__faixas', role: 'group', 'aria-label': 'Escolha a faixa de tamanho' });
    const paineis = el('div', { class: 'medidas__paineis' });
    M.grupos.forEach(g => {
      const idPainel = `painel-${g.id}-${++contador}`;
      const botao = el('button', { type: 'button', class: 'filtro', 'aria-expanded': 'false', 'aria-controls': idPainel, text: g.rotulo });
      const painel = el('section', { id: idPainel, class: 'medidas__painel', hidden: true, 'aria-label': `Tabela de medidas ${g.rotulo}` },
        g.tabelas.length ? g.tabelas.map(tabela) : el('p', { class: 'aviso', text: g.pendente }));
      botao.addEventListener('click', () => {
        const abrir = botao.getAttribute('aria-expanded') !== 'true';
        botoes.querySelectorAll('button').forEach(b => b.setAttribute('aria-expanded', 'false'));
        paineis.querySelectorAll('.medidas__painel').forEach(p => { p.hidden = true; });
        if (abrir) { botao.setAttribute('aria-expanded', 'true'); painel.hidden = false; }
      });
      botoes.append(botao); paineis.append(painel);
    });
    alvo.append(
      el('p', { class: 'medidas__instrucao', text: 'Toque em uma faixa para ver a tabela. Medidas da peça, em centímetros.' }),
      botoes, paineis,
      el('ul', { class: 'medidas__avisos' }, M.aviso.map(a => el('li', { text: a }))));
  }

  LOJA.tabelaMedidas = { montar };
})();
