/* CATÁLOGO — um registro por produto.
 * Para trocar a foto: substituir o arquivo em assets/img/produtos/ com o mesmo nome
 * (ou mudar "imagem.src") e trocar "imagem.tipo" para "foto".
 * Para definir o preço: preencher "precoCentavos" (ex.: 18800 = R$ 188,00).
 *
 * campos: o que o comprador informa por peça/pessoa
 *   tamanho   tamanho da peça principal (camisa, calção, calça, agasalho)
 *   nome      nome na peça
 *   numero    número na peça (até 3 dígitos, como no Portal Champions)
 *   posicao   posição no time
 *   tamCalcao tamanho do calção do kit ("igual à camisa" por padrão)
 *   variante  cor/variante
 * personalizacaoConfirmada=false: os campos de personalização são proposta; confirmar com o Design.
 */
window.LOJA = window.LOJA || {};
window.LOJA.categorias = Object.freeze({
  kits: 'Kits',
  camisas: 'Camisas',
  'parte-de-baixo': 'Calções e calças',
  agasalhos: 'Agasalhos'
});

window.LOJA.produtos = Object.freeze([
  {
    slug: 'kit-oficial-everest',
    ref: 'KT · MC + CL',
    nome: 'Kit Oficial Colégio Everest × ARDOS',
    categoria: 'kits',
    resumo: 'Camisa manga curta e calção com a arte oficial do Colégio Everest. Já lançado na escola.',
    descricao: 'O uniforme oficial desenvolvido pela ARDOS para o Colégio Everest: camisa manga curta e calção, personalizados com nome e número.',
    composicao: ['Camisa manga curta (MC)', 'Calção (CL)'],
    imagem: { src: 'kit-oficial-everest.webp', tipo: 'arte', fundo: 'claro',
      alt: 'Kit oficial: camisa azul-marinho com pinceladas bordô e brancas, frente e costas com nome e número 6, e calção azul-marinho com número 6.' },
    selo: 'Lançado na escola',
    precoCentavos: null,
    campos: ['tamanho', 'nome', 'numero', 'posicao', 'tamCalcao', 'variante'],
    rotuloTamanho: 'Camisa',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: true,
    destaque: true
  },
  {
    slug: 'kit-manga-longa',
    ref: 'KT · ML + CL',
    nome: 'Kit Manga Longa',
    categoria: 'kits',
    resumo: 'Camisa manga longa e calção para treinos e jogos em dias frios.',
    descricao: 'Camisa manga longa e calção com a identidade do Colégio Everest. A arte final segue o padrão aprovado pela escola.',
    composicao: ['Camisa manga longa (ML)', 'Calção (CL)'],
    imagem: { src: 'kit-manga-longa.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup neutro do kit manga longa: camisa branca de manga longa e calção branco, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'nome', 'numero', 'posicao', 'tamCalcao', 'variante'],
    rotuloTamanho: 'Camisa',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  },
  {
    slug: 'camisa-babylook',
    ref: 'BL',
    nome: 'Camisa Babylook',
    categoria: 'camisas',
    resumo: 'Camisa de modelagem feminina, manga curta.',
    descricao: 'Camisa babylook com a identidade do Colégio Everest, para atletas e torcida.',
    composicao: ['Camisa babylook (BL)'],
    imagem: { src: 'camisa-babylook.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup neutro da camisa babylook branca, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'nome', 'numero', 'variante'],
    rotuloTamanho: 'Tamanho',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  },
  {
    slug: 'camisa-regata',
    ref: 'REG',
    nome: 'Camisa Regata',
    categoria: 'camisas',
    resumo: 'Regata leve para basquete, vôlei e treinos.',
    descricao: 'Regata com a identidade do Colégio Everest, para modalidades de quadra e treinos.',
    composicao: ['Regata (REG)'],
    imagem: { src: 'camisa-regata.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup neutro da camisa regata cinza com recortes laterais, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'nome', 'numero', 'posicao', 'variante'],
    rotuloTamanho: 'Tamanho',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  },
  {
    slug: 'calcao',
    ref: 'CL',
    nome: 'Calção',
    categoria: 'parte-de-baixo',
    resumo: 'Calção avulso para completar o uniforme.',
    descricao: 'Calção esportivo com a identidade do Colégio Everest, vendido separadamente.',
    composicao: ['Calção (CL)'],
    imagem: { src: 'calcao.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup do calção preto com vivo amarelo nas laterais, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'numero', 'variante'],
    rotuloTamanho: 'Tamanho',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  },
  {
    slug: 'calca',
    ref: 'CA',
    nome: 'Calça',
    categoria: 'parte-de-baixo',
    resumo: 'Calça de agasalho com punho no tornozelo.',
    descricao: 'Calça para aquecimento e uso no dia a dia esportivo, com a identidade do Colégio Everest.',
    composicao: ['Calça (CA)'],
    imagem: { src: 'calca.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup neutro da calça branca com punho no tornozelo, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'variante'],
    rotuloTamanho: 'Tamanho',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  },
  {
    slug: 'corta-vento',
    ref: 'CV',
    nome: 'Corta-vento',
    categoria: 'agasalhos',
    resumo: 'Jaqueta corta-vento com capuz e zíper frontal.',
    descricao: 'Corta-vento com capuz para treinos, viagens e torcida, com a identidade do Colégio Everest.',
    composicao: ['Corta-vento (CV)'],
    imagem: { src: 'corta-vento.webp', tipo: 'mockup', fundo: 'estudio',
      alt: 'Mockup neutro do corta-vento cinza com capuz e zíper, frente e costas.' },
    precoCentavos: null,
    campos: ['tamanho', 'nome', 'variante'],
    rotuloTamanho: 'Tamanho',
    variantes: ['PADRÃO DA ARTE'],
    personalizacaoConfirmada: false
  }
]);
