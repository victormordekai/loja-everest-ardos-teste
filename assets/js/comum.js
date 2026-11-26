/* COMUM A TODAS AS PÁGINAS — menu no celular e contador do carrinho */
(function () {
  'use strict';
  const LOJA = window.LOJA;

  const botaoMenu = LOJA.$('.topo__menu');
  const nav = LOJA.$('.topo__nav');
  if (botaoMenu && nav) {
    const fechar = () => { nav.classList.remove('aberto'); botaoMenu.setAttribute('aria-expanded', 'false'); botaoMenu.textContent = 'Menu'; };
    botaoMenu.addEventListener('click', () => {
      const abrir = !nav.classList.contains('aberto');
      nav.classList.toggle('aberto', abrir);
      botaoMenu.setAttribute('aria-expanded', String(abrir));
      botaoMenu.textContent = abrir ? 'Fechar' : 'Menu';
      if (abrir) { const primeiro = nav.querySelector('a'); primeiro && primeiro.focus(); }
    });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && nav.classList.contains('aberto')) { fechar(); botaoMenu.focus(); } });
    nav.addEventListener('click', ev => { if (ev.target.closest('a')) fechar(); });
  }

  function atualizarContador() {
    const n = LOJA.carrinho.quantidade();
    LOJA.$$('[data-contador]').forEach(c => { c.textContent = String(n); });
    LOJA.$$('.topo__carrinho').forEach(a => a.setAttribute('aria-label', `Carrinho: ${n} ${n === 1 ? 'item' : 'itens'}`));
  }
  // Ondas: a linha bordô se desenha quando a onda aparece na tela (sem JS ou com "reduzir movimento", fica pronta)
  const ondas = LOJA.$$('[data-onda]');
  if (ondas.length && 'IntersectionObserver' in window && !LOJA.reduzirMovimento()) {
    ondas.forEach(o => o.classList.add('onda--espera'));
    const obsOnda = new IntersectionObserver(entradas => entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('onda--desenha'); obsOnda.unobserve(e.target); }
    }), { threshold: 0.3 });
    ondas.forEach(o => obsOnda.observe(o));
  }

  document.addEventListener('carrinho:mudou', atualizarContador);
  window.addEventListener('storage', atualizarContador);
  atualizarContador();
})();
