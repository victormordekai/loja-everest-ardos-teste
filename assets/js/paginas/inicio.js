/* PÁGINA INICIAL — vitrine de produtos com filtro e animação
 * Animação: entrada em cascata ao rolar, reordenação suave ao filtrar (técnica FLIP)
 * e leve inclinação 3D ao passar o mouse. Tudo desligado com "reduzir movimento".
 */
(function () {
  'use strict';
  const LOJA = window.LOJA;
  const { el, $, $$ } = LOJA;
  const vitrine = $('[data-vitrine]'); if (!vitrine) return;
  const semMovimentoHero = LOJA.reduzirMovimento();

  // ---------- HERO ----------
  // Duas animações do hero:
  //   'entrada' — completa, só quando a página carrega (faz parte do impacto da abertura);
  //   'pulso'   — leve, ao clicar na imagem e ao voltar ao topo: só a faixa geométrica se move,
  //               a onda se redesenha e imagem e texto fazem um zoom suave, sem aparecer/sumir.
  const hero = $('.hero');
  function animarHero(modo) {
    if (!hero || semMovimentoHero) return;
    hero.classList.remove('hero--anima', 'hero--pulso'); void hero.offsetWidth;
    hero.classList.add(modo === 'entrada' ? 'hero--anima' : 'hero--pulso');
    const onda = $('.onda--hero');
    if (onda && onda.classList.contains('onda--espera')) {
      onda.classList.remove('onda--desenha'); void onda.getBoundingClientRect();
      requestAnimationFrame(() => requestAnimationFrame(() => onda.classList.add('onda--desenha')));
    }
  }
  if (hero) {
    window.setTimeout(() => animarHero('entrada'), document.documentElement.classList.contains('com-abertura') ? 1400 : 0);
    // Volta ao hero rolando de baixo para cima: anima de novo
    if ('IntersectionObserver' in window) {
      let saiu = false;
      new IntersectionObserver(([e]) => {
        if (e.intersectionRatio < 0.15) saiu = true;
        else if (e.intersectionRatio >= 0.6 && saiu) { saiu = false; animarHero('pulso'); }
      }, { threshold: [0, 0.15, 0.6] }).observe(hero);
    }
    // Clique na imagem: anima e leva aos produtos
    const linkHero = $('[data-hero-link]');
    linkHero.addEventListener('click', ev => {
      ev.preventDefault();
      animarHero('pulso');
      window.setTimeout(() => {
        const titulo = $('#produtos-titulo');
        $('#produtos').scrollIntoView({ behavior: semMovimentoHero ? 'auto' : 'smooth' });
        history.replaceState(null, '', '#produtos');
        titulo.focus({ preventScroll: true });
      }, semMovimentoHero ? 0 : 700);
    });
    // Imagens do hero: produtos com lancamento=true; mais de um vira carrossel
    const lancamentos = LOJA.produtos.filter(p => p.lancamento);
    const caixaSlides = $('[data-hero-slides]');
    const legenda = $('[data-hero-legenda]');
    const pontos = $('[data-hero-pontos]');
    const textoLegenda = p => `${p.nome} · lançamento na escola. Imagem ilustrativa: a produção segue a arte aprovada.`;
    if (lancamentos.length) {
      caixaSlides.textContent = '';
      const slides = lancamentos.map((p, i) => el('img', { class: 'hero__slide' + (i === 0 ? ' ativo' : ''), src: LOJA.imagemProduto(p), alt: '', width: '1200', height: '800', decoding: 'async' }));
      slides.forEach(s => caixaSlides.append(s));
      legenda.textContent = textoLegenda(lancamentos[0]);
      if (lancamentos.length > 1) {
        let atual = 0, timer = null;
        const botoes = lancamentos.map((p, i) => {
          const b = el('button', { type: 'button', class: 'hero__ponto', 'aria-label': `Mostrar ${p.nome}`, 'aria-pressed': String(i === 0) });
          b.addEventListener('click', () => { mostrar(i); reiniciar(); });
          pontos.append(b); return b;
        });
        function mostrar(i) {
          atual = (i + slides.length) % slides.length;
          slides.forEach((s, j) => s.classList.toggle('ativo', j === atual));
          botoes.forEach((b, j) => b.setAttribute('aria-pressed', String(j === atual)));
          legenda.textContent = textoLegenda(lancamentos[atual]);
        }
        function reiniciar() { if (timer) clearInterval(timer); if (!semMovimentoHero) timer = setInterval(() => mostrar(atual + 1), LOJA.config.heroIntervaloMs); }
        const vitrineHero = $('[data-hero-vitrine]');
        vitrineHero.addEventListener('mouseenter', () => clearInterval(timer));
        vitrineHero.addEventListener('mouseleave', reiniciar);
        vitrineHero.addEventListener('focusin', () => clearInterval(timer));
        vitrineHero.addEventListener('focusout', reiniciar);
        reiniciar();
      }
    }
  }
  // ---------- VITRINE ----------
  const caixaFiltros = $('[data-filtros]');
  const contagem = $('[data-contagem]');
  const semMovimento = LOJA.reduzirMovimento();
  let filtroAtual = 'todos';

  function precoTexto(produto) {
    if (!Number.isInteger(produto.precoCentavos)) return el('span', { class: 'preco preco--pendente', text: 'Preço a definir' });
    return el('span', { class: 'preco' }, LOJA.divisao.formatarBRL(produto.precoCentavos),
      produto.precoTeste ? el('small', { class: 'preco__nota', text: 'valor de teste' }) : null);
  }

  /** Aviso sobre a foto: produto em desenvolvimento ou fora do catálogo. */
  function avisoSituacao(produto) {
    const M = LOJA.config.mensagens;
    if (produto.situacao === 'em-desenvolvimento') return el('span', { class: 'cartao__aviso' }, el('strong', { text: M.emDesenvolvimento }), el('span', { text: M.emDesenvolvimentoDetalhe }));
    if (produto.situacao === 'indisponivel') return el('span', { class: 'cartao__aviso' }, el('strong', { text: M.indisponivel }));
    return null;
  }

  function cartaoProduto(produto) {
    const seloTexto = produto.selo || (produto.imagem.tipo === 'mockup' ? 'Imagem ilustrativa' : null);
    const classeSituacao = produto.situacao === 'em-desenvolvimento' ? ' cartao--em-breve' : produto.situacao === 'indisponivel' ? ' cartao--em-breve cartao--indisponivel' : '';
    return el('article', { class: 'cartao' + classeSituacao + (produto.lancamento ? ' card_lancamento' : ''), dataset: { categoria: produto.categoria, chave: produto.slug } },
      el('div', { class: 'cartao__midia' + (produto.imagem.fundo === 'claro' ? ' cartao__midia--clara' : '') },
        seloTexto ? el('span', { class: 'selo' + (produto.selo ? ' selo--oficial' : ''), text: seloTexto }) : null,
        el('img', { src: LOJA.imagemProduto(produto), alt: produto.imagem.alt, loading: 'lazy', decoding: 'async', width: '800', height: '600' }),
        avisoSituacao(produto),
        el('span', { class: 'cartao__faixa', 'aria-hidden': 'true' })),
      el('div', { class: 'cartao__corpo' },
        el('span', { class: 'cartao__ref', text: `REF ${produto.ref} · ${LOJA.categorias[produto.categoria]}` }),
        el('h3', { class: 'cartao__nome' }, el('a', { href: LOJA.paginaProduto(produto), text: produto.nome })),
        el('p', { class: 'cartao__resumo', text: produto.resumo }),
        el('div', { class: 'cartao__rodape' }, precoTexto(produto), el('span', { class: 'cartao__acao', 'aria-hidden': 'true', text: LOJA.podeVender(produto) ? 'Escolher →' : 'Ver →' }))));
  }

  function cartaoColetiva() {
    return el('article', { class: 'cartao cartao--coletiva', dataset: { categoria: 'coletiva', chave: 'coletiva' } },
      el('div', { class: 'cartao__midia', 'aria-hidden': 'true' }, el('div', { class: 'icone-time' }, el('span'), el('span'), el('span'))),
      el('div', { class: 'cartao__corpo' },
        el('span', { class: 'cartao__ref', text: 'Para turmas e equipes' }),
        el('h3', { class: 'cartao__nome' }, el('a', { href: LOJA.raiz() + 'pages/coletiva.html', text: 'Compre coletivamente para seu time' })),
        el('p', { class: 'cartao__resumo', text: 'A grade do time inteiro em um pedido, com pagamento único ou um link por atleta.' }),
        el('div', { class: 'cartao__rodape' }, el('span', { class: 'preco', text: 'Pedido do time' }), el('span', { class: 'cartao__acao', 'aria-hidden': 'true', text: 'Montar →' }))));
  }

  // Monta a vitrine uma vez; o filtro só mostra e esconde cartões.
  const cartoes = LOJA.produtos.map(cartaoProduto).concat(cartaoColetiva());
  if (!semMovimento) vitrine.classList.add('revelar');
  cartoes.forEach((c, i) => { c.style.setProperty('--i', String(i % 8)); vitrine.append(c); });

  // Filtros com contagem
  const grupos = [['todos', 'Todos']].concat(Object.entries(LOJA.categorias));
  function contar(cat) { return cat === 'todos' ? LOJA.produtos.length : LOJA.produtos.filter(p => p.categoria === cat).length; }
  grupos.forEach(([valor, rotulo]) => {
    caixaFiltros.append(el('button', { type: 'button', class: 'filtro', 'aria-pressed': String(valor === 'todos'), dataset: { filtro: valor } },
      rotulo, el('span', { text: String(contar(valor)) })));
  });

  function visivel(cartao) {
    const cat = cartao.dataset.categoria;
    return filtroAtual === 'todos' || cat === filtroAtual || cat === 'coletiva';
  }

  function aplicarFiltro(novo) {
    filtroAtual = novo;
    $$('.filtro', caixaFiltros).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === novo)));
    // FLIP: guarda a posição antes, muda, e anima do lugar antigo para o novo.
    const antes = new Map(cartoes.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
    cartoes.forEach(c => { c.hidden = !visivel(c); });
    const n = LOJA.produtos.filter(p => novo === 'todos' || p.categoria === novo).length;
    contagem.textContent = `${n} ${n === 1 ? 'produto' : 'produtos'}` + (novo === 'todos' ? '' : ` em ${LOJA.categorias[novo]}`);
    if (semMovimento || !cartoes[0].animate) return;
    cartoes.filter(c => !c.hidden).forEach((c, i) => {
      const depois = c.getBoundingClientRect(); const inicio = antes.get(c);
      c.classList.add('visivel', 'pronto');
      if (inicio) {
        const dx = inicio.left - depois.left, dy = inicio.top - depois.top;
        if (dx || dy) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' });
      } else {
        c.animate([{ opacity: 0, transform: 'translateY(18px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 40, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      }
    });
  }
  caixaFiltros.addEventListener('click', ev => { const b = ev.target.closest('[data-filtro]'); if (b) aplicarFiltro(b.dataset.filtro); });
  aplicarFiltro('todos');

  // Entrada em cascata ao rolar
  if (!semMovimento && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visivel');
        // depois da entrada, volta a transição curta do hover
        setTimeout(() => e.target.classList.add('pronto'), 900);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    cartoes.forEach(c => obs.observe(c));
  } else {
    cartoes.forEach(c => c.classList.add('visivel', 'pronto'));
  }

  // Inclinação 3D só com mouse (não em toque)
  if (!semMovimento && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cartoes.forEach(c => {
      c.addEventListener('pointermove', ev => {
        const r = c.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }
})();
