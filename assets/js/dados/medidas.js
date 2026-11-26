/* TABELAS DE MEDIDAS ARDOS
 * Fonte [ARQUIVO]: Tabela_medida_ARDOS.zip, enviado por Victor em 26/11/2026
 *   INFANTIL.jpg (camisa infantil) · MASCULINO 1.jpg (camisa masculina)
 *   MASCULINO 2.jpg (calção masculino) · CALÇÃO INFANTIL.JPG
 * Valores transcritos das imagens, sem correção. Medidas em centímetros, com a peça na mesa.
 * Feminino: tabela não recebida (PENDENTE).
 * Conferir antes da publicação oficial:
 *   - camisa masculina, largura (B): G3 71 → G4 83 → G5 89 (salto maior que nos outros tamanhos);
 *   - calção infantil, elástico esticado: valores pequenos na imagem original, lidos com zoom.
 */
window.LOJA = window.LOJA || {};
window.LOJA.medidas = Object.freeze({
  aviso: [
    'É simples descobrir o tamanho: pegue uma peça que você usa no dia a dia e compare as medidas com a tabela.',
    'Na dúvida, escolha o tamanho maior.',
    'Pode haver variação de alguns centímetros, para mais ou para menos.'
  ],
  grupos: [
    {
      id: 'infantil', rotulo: 'Infantil',
      tabelas: [
        { titulo: 'Camisa infantil', peca: 'camisa',
          tamanhos: ['02', '04', '06', '08', '10', '12', '14', '16'],
          linhas: [
            { letra: 'A', nome: 'Altura', valores: [42, 45, 49, 53, 58, 61, 64, 67] },
            { letra: 'B', nome: 'Largura', valores: [28, 30, 34, 38, 41, 43, 45, 47] },
            { letra: 'C', nome: 'Altura da manga', valores: [14, 16, 18, 20, 21, 22, 23, 24] }
          ] },
        { titulo: 'Calção infantil', peca: 'calcao',
          tamanhos: ['04', '06', '08', '10', '12', '14'],
          linhas: [
            { letra: 'A', nome: 'Altura', valores: [28, 30, 32, 33, 35, 37] },
            { letra: 'B', nome: 'Elástico', valores: [21, 22, 23, 25, 26, 28], esticado: [26, 27, 28, 30, 31, 33] },
            { letra: 'C', nome: 'Coxa', valores: [21, 22, 24, 25, 25, 26] },
            { letra: 'D', nome: 'Altura do gancho', valores: [21, 22, 23, 24, 25, 25] }
          ] }
      ]
    },
    {
      id: 'adulto', rotulo: 'Adulto',
      tabelas: [
        { titulo: 'Camisa adulto (masculina)', peca: 'camisa',
          tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3', 'G4', 'G5'],
          linhas: [
            { letra: 'A', nome: 'Altura', valores: [67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87] },
            { letra: 'B', nome: 'Largura', valores: [47, 50, 53, 56, 59, 62, 65, 68, 71, 83, 89] },
            { letra: 'C', nome: 'Altura da manga', valores: [22, 23, 24, 26, 27, 28, 30, 30, 30, 31, 31] }
          ] },
        { titulo: 'Calção adulto (masculino)', peca: 'calcao',
          tamanhos: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'G1', 'G2', 'G3', 'G4'],
          linhas: [
            { letra: 'A', nome: 'Altura', valores: [43, 45, 47, 49, 51, 53, 55, 57, 59, 61] },
            { letra: 'B', nome: 'Largura do elástico', valores: [29, 31, 33, 35, 37, 38, 39, 40, 42, 45], esticado: [38, 40, 42, 44, 46, 48, 50, 52, 55, 58] },
            { letra: 'C', nome: 'Altura do gancho', valores: [27, 28, 29, 30, 30, 31, 32, 33, 34, 35] },
            { letra: 'D', nome: 'Coxa', valores: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38] }
          ] }
      ]
    },
    { id: 'feminino', rotulo: 'Feminino', tabelas: [], pendente: 'Tabela de medidas feminina em preparação. Em caso de dúvida, fale com a ARDOS antes de concluir o pedido.' }
  ]
});
