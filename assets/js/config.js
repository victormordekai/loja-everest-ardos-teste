/* LOJA OFICIAL COLÉGIO EVEREST × ARDOS — CONFIGURAÇÃO
 * Tudo o que está aqui é público: nada de chave, senha, token ou endereço interno.
 * O que estiver como null está PENDENTE de decisão e aparece assim na tela.
 */
window.LOJA = window.LOJA || {};
window.LOJA.config = Object.freeze({
  versao: 'v0.4.1',
  ambiente: 'TESTE',                 // TESTE: nada é enviado nem cobrado
  dataVersao: '26/11/2026',

  // Pagamento dividido (pedido de Victor, 26/11/2026)
  maxLinksPorCobranca: 3,            // até 3 cartões/links por cobrança
  valorMinimoPorLinkCentavos: 100,   // R$ 1,00 — mínimo real depende do meio de pagamento: PENDENTE
  parcelasMaximasCartao: null,       // PENDENTE (o Clube Curitibano usa até 6x; não vale para este cliente sem decisão)

  // Produtos em desenvolvimento podem ser comprados só na versão de teste (para validar pedidos).
  vendaEmDesenvolvimentoNoTeste: true,
  mensagens: {
    emDesenvolvimento: 'Produto em desenvolvimento',
    emDesenvolvimentoDetalhe: 'Em breve, descrições e valores atualizados.',
    indisponivel: 'Produto sem estoque ou fora do catálogo'
  },

  // Simulação: preços ainda não definidos. Valor fictício, só para testar a divisão.
  precoSimulacaoCentavos: 10000,     // R$ 100,00 por item — FICTÍCIO

  // Retirada na escola [F: retirada na escola, resposta de 26/11/2026]
  retirada: { local: 'No Colégio Everest', data: null, horario: null },

  // Unidades [F: site oficial do Colégio Everest, consultado em 26/11/2026]
  unidades: [
    'Unidade Kinder — Mossunguê',
    'Unidade Fundamental ao Médio — Santa Felicidade'
  ],

  // Rascunho do carrinho no navegador
  rascunhoHoras: 24,

  // Contatos ARDOS [ARQUIVO: rodapé do Portal Champions ARDOS, composer/footer.html]
  ardos: {
    whatsappTexto: '(41) 99765-0283',
    whatsappUrl: 'https://api.whatsapp.com/send?phone=5541997650283',
    telefoneTexto: '(41) 3349-8356',
    telefoneUrl: 'tel:+554133498356',
    email: 'contato@ardos.com.br',
    site: 'https://www.ardos.com.br/'
  },
  everest: { site: 'https://www.colegioeverest.curitiba.br/pt-br/home' },

  // Grade de referência ARDOS [ARQUIVO: vocabulário de grade do Extrator Mestre V005.4]
  // Ordem na tela: infantil, adulto, feminino (pedido de Victor, 26/11/2026).
  // Feminino usa o modificador FEM do Extrator; grade feminina própria e tabela de medidas: PENDENTES.
  tamanhos: {
    infantil: ['02', '04', '06', '08', '10', '12', '14', '16'],
    adulto: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3', 'G4', 'G5'],
    feminino: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3', 'G4', 'G5']
  },
  fotosPorProduto: 4,                // espaços de foto na página do produto (os vazios mostram "Foto em breve")
  // Posições [ARQUIVO: Grade Web do Portal Champions ARDOS], mais "não se aplica" para compra individual
  posicoes: ['NÃO SE APLICA', 'LINHA', 'GOLEIRO', 'ÁRBITRO', 'COMISSÃO TÉCNICA', 'OUTRO']
});
