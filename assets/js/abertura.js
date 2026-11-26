/* ABERTURA — animação de entrada da página inicial
 * Roda no <head> (sem defer) para marcar a página antes da primeira pintura e evitar piscar.
 * Mostra uma vez por sessão do navegador; não aparece com "reduzir movimento".
 * Se este arquivo não carregar, a página abre normalmente (a abertura começa escondida no CSS).
 */
(function () {
  'use strict';
  var CHAVE = 'everest-ardos-abertura-vista';
  var raiz = document.documentElement;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem(CHAVE)) return;
    sessionStorage.setItem(CHAVE, '1');
  } catch (e) { /* sem armazenamento: mostra a abertura mesmo assim */ }
  raiz.classList.add('com-abertura');
  // Duração total da abertura; o CSS também esconde sozinho, por segurança.
  window.setTimeout(function () { raiz.classList.add('abertura-fim'); }, 1500);
  window.setTimeout(function () { raiz.classList.remove('com-abertura', 'abertura-fim'); }, 2300);
})();
