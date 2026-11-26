/* DIVISÃO DE PAGAMENTO — regras puras, sem tela (testadas em tests/divisao.test.js)
 *
 * O que faz: divide o valor de uma cobrança em até N links de pagamento e confere
 * se a divisão fecha. Trabalha sempre em centavos (inteiros) para não perder dinheiro
 * em arredondamento.
 * O que NÃO faz: não gera link real, não cobra e não fala com meio de pagamento.
 * Link real só pode ser criado no servidor da ARDOS (ver docs/ADR-002).
 */
(function (raiz) {
  'use strict';

  /** Divide em partes iguais; os centavos que sobram vão para as primeiras partes. */
  function dividirIgual(totalCentavos, partes) {
    if (!Number.isInteger(totalCentavos) || totalCentavos < 0) throw new Error('Total inválido');
    if (!Number.isInteger(partes) || partes < 1) throw new Error('Número de partes inválido');
    const base = Math.floor(totalCentavos / partes);
    const sobra = totalCentavos - base * partes;
    return Array.from({ length: partes }, (_, i) => base + (i < sobra ? 1 : 0));
  }

  /** Confere uma divisão. Devolve { ok, diferenca, erros[] }; diferenca > 0 = falta, < 0 = passou. */
  function validarDivisao(totalCentavos, valores, regras) {
    const max = regras.maxLinks, minimo = regras.minimoCentavos;
    const erros = [];
    if (!Array.isArray(valores) || valores.length < 1) erros.push('Informe ao menos um valor.');
    if (valores.length > max) erros.push(`No máximo ${max} links por cobrança.`);
    valores.forEach((v, i) => {
      if (!Number.isInteger(v)) erros.push(`Link ${i + 1}: valor inválido.`);
      else if (v < minimo) erros.push(`Link ${i + 1}: o valor mínimo é ${formatarBRL(minimo)}.`);
    });
    const soma = valores.reduce((s, v) => s + (Number.isInteger(v) ? v : 0), 0);
    const diferenca = totalCentavos - soma;
    if (diferenca > 0) erros.push(`Faltam ${formatarBRL(diferenca)} para fechar o total.`);
    if (diferenca < 0) erros.push(`A soma passou ${formatarBRL(-diferenca)} do total.`);
    return { ok: erros.length === 0, diferenca, erros };
  }

  /** "1.234,56", "1234,5", "R$ 300" → centavos. Texto que não é valor → null. */
  function lerValorBR(texto) {
    const limpo = String(texto == null ? '' : texto).replace(/R\$|\s/g, '');
    if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(limpo)) return null;
    const [inteiro, frac = ''] = limpo.replace(/\./g, '').split(',');
    return Number(inteiro) * 100 + Number((frac + '00').slice(0, 2));
  }

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  function formatarBRL(centavos) { return moeda.format(centavos / 100).replace(/ /g, ' '); }
  function formatarCampo(centavos) { return (centavos / 100).toFixed(2).replace('.', ','); }

  /**
   * Monta as cobranças a partir das linhas cobráveis do pedido.
   * linhas: [{ grupo: 'avulso'|'coletivo', participante, rotulo, valorCentavos }]
   * modo 'pedido'    → uma cobrança com o total
   * modo 'por-atleta'→ uma cobrança por participante da compra coletiva + uma para os itens avulsos
   */
  function montarCobrancas(linhas, modo) {
    if (modo === 'pedido') {
      const total = linhas.reduce((s, l) => s + l.valorCentavos, 0);
      return [{ chave: 'PEDIDO', rotulo: 'Pedido completo', valorCentavos: total, itens: linhas.length }];
    }
    if (modo !== 'por-atleta') throw new Error('Modo de cobrança desconhecido');
    const mapa = new Map();
    linhas.forEach(l => {
      const chave = l.grupo === 'coletivo' ? 'ATLETA:' + l.participante : 'AVULSOS';
      const rotulo = l.grupo === 'coletivo' ? l.rotulo : 'Itens avulsos';
      const atual = mapa.get(chave) || { chave, rotulo, valorCentavos: 0, itens: 0 };
      atual.valorCentavos += l.valorCentavos; atual.itens += 1;
      mapa.set(chave, atual);
    });
    return [...mapa.values()];
  }

  const api = { dividirIgual, validarDivisao, lerValorBR, formatarBRL, formatarCampo, montarCobrancas };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else { raiz.LOJA = raiz.LOJA || {}; raiz.LOJA.divisao = api; }
})(typeof window !== 'undefined' ? window : globalThis);
