/* RASCUNHO — guarda o que a pessoa já preencheu, para não perder ao sair e voltar
 * Onde: armazenamento do navegador (localStorage), só neste aparelho e navegador.
 * Por que não cookie: cookie viaja com cada visita ao servidor e tem limite de 4 KB;
 * aqui nada precisa sair do navegador.
 * Prazo: LOJA.config.rascunhoHoras, renovado a cada alteração. Vencido, é apagado ao ler.
 * O que NÃO se guarda: a concordância com o uso dos dados (é marcada de novo a cada pedido).
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const PREFIXO = 'everest-ardos-rascunho:';
  const prazoMs = () => LOJA.config.rascunhoHoras * 3600 * 1000;

  function salvar(chave, dado) {
    try { localStorage.setItem(PREFIXO + chave, JSON.stringify({ expiraEm: Date.now() + prazoMs(), dado })); } catch (e) { /* sem armazenamento: segue sem rascunho */ }
  }
  function ler(chave) {
    try {
      const bruto = localStorage.getItem(PREFIXO + chave); if (!bruto) return null;
      const r = JSON.parse(bruto);
      if (!r || typeof r.expiraEm !== 'number' || Date.now() > r.expiraEm) { localStorage.removeItem(PREFIXO + chave); return null; }
      return r.dado;
    } catch (e) { return null; }
  }
  function apagar(chave) { try { localStorage.removeItem(PREFIXO + chave); } catch (e) { /* nada */ } }
  /** Apaga todos os rascunhos e o carrinho desta loja neste navegador. */
  function apagarTudo() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(PREFIXO)).forEach(k => localStorage.removeItem(k));
    } catch (e) { /* nada */ }
    if (LOJA.carrinho) LOJA.carrinho.limpar();
  }
  /** Texto curto do prazo: "3 dias" ou "24 horas". */
  function prazoTexto() {
    const h = LOJA.config.rascunhoHoras;
    return h % 24 === 0 ? `${h / 24} ${h === 24 ? 'dia' : 'dias'}` : `${h} horas`;
  }

  /** Aviso + botão "Apagar dados salvos", para colocar perto dos formulários. */
  function aviso() {
    const botao = LOJA.el('button', { type: 'button', class: 'botao botao--texto', text: 'Apagar dados salvos' });
    const caixa = LOJA.el('p', { class: 'rascunho-aviso' },
      `O que você preencher fica salvo só neste navegador por até ${prazoTexto()}, para você continuar depois. `, botao);
    botao.addEventListener('click', () => { apagarTudo(); location.reload(); });
    return caixa;
  }

  LOJA.rascunho = { salvar, ler, apagar, apagarTudo, prazoTexto, aviso };
})();
