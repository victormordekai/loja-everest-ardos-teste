/* ABERTURA — animação de entrada da página inicial
 * Roda no <head> (sem defer) para marcar a página antes da primeira pintura e evitar piscar.
 * Acontece a cada carregamento ou recarga da página inicial (pedido de Victor, 26/11/2026).
 * Não aparece com "reduzir movimento". Se este arquivo não carregar, a página abre normalmente.
 */
(function () {
  'use strict';
  var raiz = document.documentElement;
  try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { /* segue */ }
  raiz.classList.add('com-abertura');
  // Duração total da abertura; o CSS também esconde sozinho, por segurança.
  window.setTimeout(function () { raiz.classList.remove('com-abertura'); }, 2300);
})();
