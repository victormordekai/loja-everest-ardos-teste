/* CARRINHO E PAGAMENTO — revisão, dados de retirada e divisão em até 3 links por cobrança
 * VERSÃO DE TESTE: não envia nada e não cria link de pagamento real (ver docs/ADR-002).
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el, $, $$ } = LOJA;
  const D = LOJA.divisao;
  const REGRAS = { maxLinks: LOJA.config.maxLinksPorCobranca, minimoCentavos: LOJA.config.valorMinimoPorLinkCentavos };

  const estado = { simular: false, modo: 'pedido', divisoes: new Map() }; // divisoes: chave → { total, valores[] }
  const form = $('[data-form]');
  const erros = $('[data-erros]');

  LOJA.config.unidades.forEach(u => $('[data-unidades]').append(el('option', { value: u, text: u })));
  form.addEventListener('submit', ev => ev.preventDefault());
  form.addEventListener('input', ev => ev.target.removeAttribute('aria-invalid'));

  // ---------- Itens ----------
  function fotoDe(produto) {
    return el('div', { class: 'item-carrinho__foto' + (produto.imagem.fundo === 'claro' ? ' item-carrinho__foto--clara' : '') },
      el('img', { src: LOJA.imagemProduto(produto), alt: '', loading: 'lazy', width: '88', height: '88' }));
  }

  function desenharItens(carrinho) {
    const lista = $('[data-itens]'); lista.textContent = '';
    carrinho.itens.forEach(item => {
      const remover = el('button', { type: 'button', class: 'botao botao--texto', text: 'Remover' });
      remover.addEventListener('click', () => { LOJA.carrinho.remover(item.id); desenharTudo(); });
      if (item.tipo === 'individual') {
        const produto = LOJA.produtoPorSlug(item.slug); if (!produto) return;
        remover.setAttribute('aria-label', `Remover ${produto.nome}`);
        lista.append(el('li', { class: 'item-carrinho' }, fotoDe(produto),
          el('div', {}, el('h3', { text: produto.nome }),
            el('p', { text: `${item.unidades.length} ${item.unidades.length === 1 ? 'peça' : 'peças'}` }),
            el('ul', {}, item.unidades.map(u => el('li', { text: LOJA.pessoas.descrever(produto, u) })))),
          remover));
      } else {
        const atletas = item.equipes.reduce((n, eq) => n + eq.atletas.length, 0);
        const primeiro = LOJA.produtoPorSlug(item.equipes[0].slug);
        remover.setAttribute('aria-label', 'Remover compra coletiva');
        lista.append(el('li', { class: 'item-carrinho' }, fotoDe(primeiro),
          el('div', {}, el('h3', { text: 'Compra coletiva' }),
            el('p', { text: `${item.equipes.length} ${item.equipes.length === 1 ? 'equipe' : 'equipes'} · ${atletas} ${atletas === 1 ? 'atleta' : 'atletas'}` }),
            item.equipes.map(eq => {
              const produto = LOJA.produtoPorSlug(eq.slug);
              return el('details', {}, el('summary', { text: `${eq.nome} · ${produto.nome} · ${eq.atletas.length}` }),
                el('ul', {}, eq.atletas.map(a => el('li', { text: LOJA.pessoas.descrever(produto, a) }))));
            })),
          remover));
      }
    });
  }

  // ---------- Cobranças ----------
  function garantirDivisao(cobranca) {
    const atual = estado.divisoes.get(cobranca.chave);
    if (atual && atual.total === cobranca.valorCentavos) return atual;
    const nova = { total: cobranca.valorCentavos, valores: [cobranca.valorCentavos] };
    estado.divisoes.set(cobranca.chave, nova); return nova;
  }

  function desenharCobranca(cobranca, indice) {
    const div = garantirDivisao(cobranca);
    const idBase = 'cob-' + indice;
    const seletor = el('select', { id: idBase + '-n' }, [1, 2, 3].slice(0, REGRAS.maxLinks).map(n => el('option', { value: String(n), text: n === 1 ? '1 link (sem dividir)' : `${n} links` })));
    seletor.value = String(div.valores.length);
    const partes = el('div', { class: 'cobranca__partes' });
    const situacao = el('p', { class: 'cobranca__estado', 'aria-live': 'polite' });

    function conferir() {
      const r = D.validarDivisao(div.total, div.valores, REGRAS);
      situacao.className = 'cobranca__estado ' + (r.ok ? 'ok' : 'erro');
      situacao.textContent = r.ok ? `Divisão fecha: ${div.valores.map(D.formatarBRL).join(' + ')} = ${D.formatarBRL(div.total)}` : r.erros.join(' ');
      return r.ok;
    }
    function desenharPartes() {
      partes.textContent = '';
      div.valores.forEach((v, i) => {
        const id = `${idBase}-p${i}`;
        const campo = el('input', { id, inputmode: 'decimal', autocomplete: 'off', value: D.formatarCampo(v) });
        campo.addEventListener('input', () => {
          const lido = D.lerValorBR(campo.value);
          div.valores[i] = lido === null ? NaN : lido;
          campo.setAttribute('aria-invalid', String(lido === null));
          conferir();
        });
        partes.append(el('div', { class: 'campo' }, el('label', { for: id, text: `Link ${i + 1} (R$)` }), campo));
      });
      conferir();
    }
    seletor.addEventListener('change', () => { div.valores = D.dividirIgual(div.total, Number(seletor.value)); desenharPartes(); });
    const igualar = el('button', { type: 'button', class: 'botao botao--texto', text: 'Dividir igualmente' });
    igualar.addEventListener('click', () => { div.valores = D.dividirIgual(div.total, div.valores.length); desenharPartes(); });

    const bloco = el('div', { class: 'cobranca', role: 'group', 'aria-labelledby': idBase + '-t' },
      el('div', { class: 'cobranca__topo' },
        el('h3', { id: idBase + '-t', text: `${cobranca.rotulo} · ${D.formatarBRL(cobranca.valorCentavos)}` }),
        el('div', { class: 'campo' }, el('label', { for: idBase + '-n', text: 'Dividir em' }), seletor)),
      partes, situacao, igualar);
    desenharPartes();
    bloco.conferir = conferir;
    return bloco;
  }

  let blocosCobranca = [];
  function desenharPagamento(carrinho) {
    const temColetivo = carrinho.itens.some(i => i.tipo === 'coletivo');
    $('[data-modo]').hidden = !temColetivo;
    if (!temColetivo) estado.modo = 'pedido';
    const { linhas, semPreco } = LOJA.carrinho.linhasCobraveis(carrinho, estado.simular);
    const precisaSimular = semPreco > 0 || (estado.simular && LOJA.produtos.some(p => p.precoCentavos === null));
    $('[data-sem-preco]').hidden = !precisaSimular;
    const temValorTeste = carrinho.itens.some(i => (i.tipo === 'individual' ? [i.slug] : i.equipes.map(e => e.slug)).some(s => { const p = LOJA.produtoPorSlug(s); return p && p.precoTeste; }));
    $('[data-simulacao-aviso]').hidden = !(estado.simular || temValorTeste);
    const caixa = $('[data-cobrancas]'); caixa.textContent = ''; blocosCobranca = [];
    if (semPreco > 0) {
      caixa.append(el('p', { class: 'aviso', text: 'A divisão aparece aqui quando os preços estiverem definidos (ou com a simulação ligada).' }));
      return { linhas, semPreco };
    }
    const cobrancas = D.montarCobrancas(linhas, estado.modo);
    cobrancas.forEach((c, i) => { const b = desenharCobranca(c, i); blocosCobranca.push({ cobranca: c, bloco: b }); caixa.append(b); });
    return { linhas, semPreco, cobrancas };
  }

  function desenharTotais(carrinho, calc) {
    const t = $('[data-totais]'); t.textContent = '';
    const pecas = LOJA.carrinho.quantidade();
    const total = calc.semPreco ? null : calc.linhas.reduce((s, l) => s + l.valorCentavos, 0);
    t.append(el('div', {}, el('span', { text: 'Peças' }), el('span', { text: String(pecas) })),
      el('div', {}, el('span', { text: 'Cobranças' }), el('span', { text: calc.cobrancas ? String(calc.cobrancas.length) : '—' })),
      el('div', { class: 'total' }, el('span', { text: 'Total' }), el('span', { text: total === null ? 'a definir' : D.formatarBRL(total) })));
    $('[data-concluir]').disabled = total === null;
    $('[data-concluir]').title = total === null ? 'Disponível quando os preços estiverem definidos ou com a simulação ligada' : '';
  }

  function desenharTudo() {
    const carrinho = LOJA.carrinho.ler();
    const vazio = carrinho.itens.length === 0;
    $('[data-vazio]').hidden = !vazio; $('[data-cheio]').hidden = vazio;
    if (vazio) return;
    desenharItens(carrinho);
    const calc = desenharPagamento(carrinho);
    desenharTotais(carrinho, calc);
    $('[data-resultado]').hidden = true; erros.textContent = '';
  }

  $('[data-simular]').addEventListener('change', ev => { estado.simular = ev.target.checked; estado.divisoes.clear(); desenharTudo(); });
  $$('input[name="modo"]').forEach(r => r.addEventListener('change', () => { estado.modo = r.value; desenharTudo(); }));

  // ---------- Conclusão (teste) ----------
  function lerFormulario() {
    const dados = Object.fromEntries(new FormData(form).entries());
    const mensagens = [];
    const exigir = (nome, texto) => { if (!String(dados[nome] || '').trim()) { mensagens.push(texto); form.elements[nome].setAttribute('aria-invalid', 'true'); } };
    exigir('aluno', 'Informe o nome do aluno.');
    exigir('turma', 'Informe a turma ou série.');
    exigir('unidade', 'Escolha a unidade.');
    exigir('responsavel', 'Informe o nome do responsável pela compra.');
    exigir('email', 'Informe o e-mail.');
    exigir('telefone', 'Informe o celular com DDD.');
    if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) { mensagens.push('O e-mail não parece válido. Confira se tem @ e domínio.'); form.elements.email.setAttribute('aria-invalid', 'true'); }
    if (dados.telefone && String(dados.telefone).replace(/\D/g, '').length < 10) { mensagens.push('O celular precisa ter DDD e número.'); form.elements.telefone.setAttribute('aria-invalid', 'true'); }
    if (!dados.consentimento) mensagens.push('Para concluir, marque a concordância com o uso dos dados.');
    return { dados, mensagens };
  }

  let ultimoPedido = null;
  $('[data-concluir]').addEventListener('click', () => {
    const carrinho = LOJA.carrinho.ler();
    const { dados, mensagens } = lerFormulario();
    blocosCobranca.forEach(({ cobranca, bloco }) => { if (!bloco.conferir()) mensagens.push(`Cobrança "${cobranca.rotulo}": a divisão não fecha.`); });
    if (mensagens.length) {
      erros.textContent = mensagens.join('\n');
      const primeiro = form.querySelector('[aria-invalid="true"]') || $('[data-cobrancas] [aria-invalid="true"]');
      if (primeiro) primeiro.focus();
      return;
    }
    erros.textContent = '';

    const codigo = 'TESTE-' + LOJA.novoId().replace(/-/g, '').slice(0, 6).toUpperCase();
    const cobrancas = blocosCobranca.map(({ cobranca }, i) => {
      const valores = estado.divisoes.get(cobranca.chave).valores;
      return { cobranca: i + 1, rotulo: cobranca.rotulo, valorCentavos: cobranca.valorCentavos,
        links: valores.map((v, j) => ({ link: `${codigo}-C${i + 1}-L${j + 1}`, valorCentavos: v, situacao: 'NAO_CRIADO_TESTE' })) };
    });
    ultimoPedido = {
      schema: 'everest.ardos.loja.pedido.teste.v1',
      ambiente: 'TESTE', aviso: 'Pedido de teste: não foi enviado, não gera cobrança e não é pedido oficial da ARDOS.',
      codigoTeste: codigo, geradoEm: new Date().toISOString(), versaoLoja: LOJA.config.versao,
      valoresFicticios: estado.simular || !$('[data-simulacao-aviso]').hidden, modoPagamento: estado.modo,
      retirada: { local: LOJA.config.retirada.local, aluno: dados.aluno.trim(), turma: dados.turma.trim(), unidade: dados.unidade },
      responsavel: { nome: dados.responsavel.trim(), email: dados.email.trim(), telefone: dados.telefone.trim() },
      itens: carrinho.itens.map(i => i.tipo === 'individual' ? { tipo: i.tipo, produto: i.slug, unidades: i.unidades } : { tipo: i.tipo, equipes: i.equipes }),
      cobrancas
    };

    const caixa = $('[data-links]'); caixa.textContent = '';
    cobrancas.forEach(c => caixa.append(el('div', { class: 'cobranca' },
      el('h3', { text: `${c.rotulo} · ${D.formatarBRL(c.valorCentavos)}` }),
      el('div', { class: 'cobranca__links' }, c.links.map(l => el('div', { class: 'link-demo' }, el('span', { text: l.link }), el('strong', { text: D.formatarBRL(l.valorCentavos) })))))));
    $('[data-resultado]').hidden = false; $('#resultado-titulo').focus();
  });

  $('[data-copiar]').addEventListener('click', async () => {
    if (!ultimoPedido) return;
    const aviso = $('[data-copiado]');
    try { await navigator.clipboard.writeText(JSON.stringify(ultimoPedido, null, 2)); aviso.textContent = 'Resumo copiado.'; }
    catch (e) { aviso.textContent = 'Não foi possível copiar neste navegador. Use "Baixar JSON".'; }
  });
  $('[data-baixar]').addEventListener('click', () => {
    if (!ultimoPedido) return;
    const blob = new Blob([JSON.stringify(ultimoPedido, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: `PEDIDO_${ultimoPedido.codigoTeste}.json` });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('[data-limpar]').addEventListener('click', () => {
    LOJA.carrinho.limpar(); form.reset(); ultimoPedido = null; desenharTudo();
    const titulo = $('[data-vazio] h2'); titulo.setAttribute('tabindex', '-1'); titulo.focus();
  });

  desenharTudo();
})();
