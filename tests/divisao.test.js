/* Testes do motor de divisão de pagamento. Rodar: node --test tests/ */
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../assets/js/nucleo/divisao.js');
const REGRAS = { maxLinks: 3, minimoCentavos: 100 };

test('exemplo do pedido: R$ 1.000 = 300 + 350 + 350 fecha', () => {
  const r = D.validarDivisao(100000, [30000, 35000, 35000], REGRAS);
  assert.equal(r.ok, true); assert.equal(r.diferenca, 0);
});

test('divisão igual não perde centavo', () => {
  assert.deepEqual(D.dividirIgual(100000, 3), [33334, 33333, 33333]);
  assert.deepEqual(D.dividirIgual(1, 3), [1, 0, 0]);
  for (const total of [1, 99, 100, 18800, 155000, 999999]) for (const n of [1, 2, 3])
    assert.equal(D.dividirIgual(total, n).reduce((a, b) => a + b, 0), total);
});

test('mais de 3 links é recusado', () => {
  const r = D.validarDivisao(400, [100, 100, 100, 100], REGRAS);
  assert.equal(r.ok, false); assert.match(r.erros.join(' '), /No máximo 3/);
});

test('soma que falta ou passa é recusada e informa a diferença', () => {
  const falta = D.validarDivisao(100000, [30000, 35000, 30000], REGRAS);
  assert.equal(falta.ok, false); assert.equal(falta.diferenca, 5000); assert.match(falta.erros.join(' '), /Faltam R\$ 50,00/);
  const passa = D.validarDivisao(100000, [30000, 35000, 40000], REGRAS);
  assert.equal(passa.ok, false); assert.equal(passa.diferenca, -5000);
});

test('valor abaixo do mínimo, zero e NaN são recusados', () => {
  assert.equal(D.validarDivisao(100, [100, 0], REGRAS).ok, false);
  assert.equal(D.validarDivisao(150, [50, 100], REGRAS).ok, false);
  assert.equal(D.validarDivisao(100, [NaN], REGRAS).ok, false);
});

test('leitura de valor em reais', () => {
  assert.equal(D.lerValorBR('300'), 30000);
  assert.equal(D.lerValorBR('333,34'), 33334);
  assert.equal(D.lerValorBR('1.234,5'), 123450);
  assert.equal(D.lerValorBR('R$ 1.000,00'), 100000);
  for (const ruim of ['', 'abc', '1,234', '12.34', '-5', '1e3', '<img>', '10,999'])
    assert.equal(D.lerValorBR(ruim), null, ruim);
});

test('cobranças: pedido inteiro × por atleta', () => {
  const linhas = [
    { grupo: 'avulso', participante: 'a:0', rotulo: 'Calça', valorCentavos: 10000 },
    { grupo: 'coletivo', participante: 'c:0:0', rotulo: 'FUTSAL · ANA nº 10', valorCentavos: 10000 },
    { grupo: 'coletivo', participante: 'c:0:1', rotulo: 'FUTSAL · BIA nº 7', valorCentavos: 10000 },
    { grupo: 'avulso', participante: 'a:1', rotulo: 'Calção', valorCentavos: 5000 }
  ];
  const um = D.montarCobrancas(linhas, 'pedido');
  assert.equal(um.length, 1); assert.equal(um[0].valorCentavos, 35000);
  const varios = D.montarCobrancas(linhas, 'por-atleta');
  assert.equal(varios.length, 3);
  assert.equal(varios.find(c => c.chave === 'AVULSOS').valorCentavos, 15000);
  assert.equal(varios.reduce((s, c) => s + c.valorCentavos, 0), 35000);
  assert.throws(() => D.montarCobrancas(linhas, 'outro'));
});

test('formatação em reais', () => {
  assert.equal(D.formatarBRL(100000), 'R$ 1.000,00');
  assert.equal(D.formatarCampo(33334), '333,34');
});
