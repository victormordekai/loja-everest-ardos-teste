/* CARRINHO — rascunho no navegador de quem compra
 * Guarda os itens por LOJA.config.rascunhoHoras horas neste aparelho e navegador.
 * Não é sigilo e não é envio: ninguém além de quem usa este navegador vê o rascunho.
 * Se o navegador bloquear o armazenamento, o carrinho funciona só enquanto a página estiver aberta.
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const CHAVE = 'everest-ardos-carrinho-v1';
  let memoria = null; // reserva quando o armazenamento do navegador não está disponível

  function vazio() {
    const agora = Date.now();
    return { versao: 1, criadoEm: agora, expiraEm: agora + LOJA.config.rascunhoHoras * 3600 * 1000, itens: [] };
  }

  function ler() {
    let dado = memoria;
    try { const bruto = localStorage.getItem(CHAVE); if (bruto) dado = JSON.parse(bruto); } catch (e) { /* armazenamento indisponível */ }
    if (!dado || dado.versao !== 1 || !Array.isArray(dado.itens) || Date.now() > dado.expiraEm) return vazio();
    return dado;
  }

  function gravar(dado) {
    dado.expiraEm = Date.now() + LOJA.config.rascunhoHoras * 3600 * 1000;
    memoria = dado;
    try { localStorage.setItem(CHAVE, JSON.stringify(dado)); } catch (e) { /* segue em memória */ }
    document.dispatchEvent(new CustomEvent('carrinho:mudou'));
  }

  function adicionar(item) { const c = ler(); c.itens.push(Object.assign({ id: LOJA.novoId() }, item)); gravar(c); }
  function remover(id) { const c = ler(); c.itens = c.itens.filter(i => i.id !== id); gravar(c); }
  function limpar() { memoria = null; try { localStorage.removeItem(CHAVE); } catch (e) { /* nada */ } document.dispatchEvent(new CustomEvent('carrinho:mudou')); }

  /** Quantas peças/pessoas existem no carrinho. */
  function quantidade() {
    return ler().itens.reduce((n, item) => n + (item.tipo === 'coletivo'
      ? item.equipes.reduce((m, eq) => m + eq.atletas.length, 0)
      : item.unidades.length), 0);
  }

  /** Preço de uma unidade: o real, se definido; senão o fictício, se a simulação estiver ligada. */
  function precoUnidade(produto, simular) {
    if (Number.isInteger(produto.precoCentavos)) return produto.precoCentavos;
    return simular ? LOJA.config.precoSimulacaoCentavos : null;
  }

  /** Linhas cobráveis: uma por peça avulsa e uma por atleta da compra coletiva. */
  function linhasCobraveis(carrinho, simular) {
    const linhas = []; let semPreco = 0;
    carrinho.itens.forEach(item => {
      if (item.tipo === 'individual') {
        const produto = LOJA.produtoPorSlug(item.slug); if (!produto) return;
        item.unidades.forEach((u, i) => {
          const valor = precoUnidade(produto, simular); if (valor === null) { semPreco++; return; }
          linhas.push({ grupo: 'avulso', participante: item.id + ':' + i, rotulo: produto.nome, valorCentavos: valor });
        });
      } else {
        item.equipes.forEach((eq, e) => {
          const produto = LOJA.produtoPorSlug(eq.slug); if (!produto) return;
          eq.atletas.forEach((a, i) => {
            const valor = precoUnidade(produto, simular); if (valor === null) { semPreco++; return; }
            const quem = [a.nome || `Atleta ${i + 1}`, a.numero ? 'nº ' + a.numero : ''].filter(Boolean).join(' ');
            linhas.push({ grupo: 'coletivo', participante: `${item.id}:${e}:${i}`, rotulo: `${eq.nome} · ${quem}`, valorCentavos: valor });
          });
        });
      }
    });
    return { linhas, semPreco };
  }

  LOJA.carrinho = { ler, gravar, adicionar, remover, limpar, quantidade, precoUnidade, linhasCobraveis };
})();
