/* UTILITÁRIOS DE TELA
 * Regra da casa: dado entra na tela só por textContent/value. Nada de innerHTML com dado.
 */
(function () {
  'use strict';
  const LOJA = window.LOJA = window.LOJA || {};

  /** Cria um elemento. el('p', {class: 'x', text: 'olá'}, filho1, filho2) */
  function el(tag, atributos, ...filhos) {
    const no = document.createElement(tag);
    Object.entries(atributos || {}).forEach(([nome, valor]) => {
      if (valor === null || valor === undefined || valor === false) return;
      if (nome === 'text') no.textContent = valor;
      else if (nome === 'class') no.className = valor;
      else if (nome.startsWith('on') && typeof valor === 'function') no.addEventListener(nome.slice(2), valor);
      else if (nome === 'dataset') Object.assign(no.dataset, valor);
      else no.setAttribute(nome, valor === true ? '' : String(valor));
    });
    filhos.flat().forEach(f => { if (f !== null && f !== undefined && f !== false) no.append(f instanceof Node ? f : String(f)); });
    return no;
  }

  const $ = (seletor, escopo) => (escopo || document).querySelector(seletor);
  const $$ = (seletor, escopo) => [...(escopo || document).querySelectorAll(seletor)];

  /** Caminho até a raiz do site: '' na página inicial, '../' nas páginas internas. */
  function raiz() { return document.body.dataset.raiz || ''; }
  function imagemProduto(produto) { return raiz() + 'assets/img/produtos/' + produto.imagem.src; }
  function paginaProduto(produto) { return raiz() + 'pages/produto.html#' + encodeURIComponent(produto.slug); }

  function produtoPorSlug(slug) { return LOJA.produtos.find(p => p.slug === slug) || null; }

  /** Pode ser colocado no carrinho? Indisponível nunca; em desenvolvimento só na versão de teste. */
  function podeVender(produto) {
    const s = produto.situacao || 'disponivel';
    if (s === 'indisponivel') return false;
    if (s === 'em-desenvolvimento') return LOJA.config.ambiente === 'TESTE' && LOJA.config.vendaEmDesenvolvimentoNoTeste;
    return true;
  }

  /** Preço para exibir: "R$ 100,00 · valor de teste", "R$ 188,00" ou "Preço a definir". */
  function textoPreco(produto) {
    if (!Number.isInteger(produto.precoCentavos)) return 'Preço a definir';
    return LOJA.divisao.formatarBRL(produto.precoCentavos) + (produto.precoTeste ? ' · valor de teste' : '');
  }

  /** Texto para nome/variante: caixa alta, sem caracteres de controle (como na Grade Web do Portal). */
  function textoMaiusculo(valor) {
    return String(valor || '').normalize('NFC')
      .replace(/[\u0000-\u001F\u007F-\u009F​-‏‪-‮]/g, '')
      .toLocaleUpperCase('pt-BR').trimStart();
  }

  function novoId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  const reduzirMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Object.assign(LOJA, { el, $, $$, raiz, imagemProduto, paginaProduto, produtoPorSlug, podeVender, textoPreco, textoMaiusculo, novoId, reduzirMovimento });
})();
