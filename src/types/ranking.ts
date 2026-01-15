// Centraliza a tipagem do Ranking para usar em todo o app
export interface ItemRanking {
  id: string; // Adicionado ID para chaves do React
  nome: string;
  fotoUrl: string | null;
  time: string | null;
  categoria: string;

  // Estatísticas
  pontosRanking: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;

  // Nomes completos facilitam a leitura no código
  golsPro: number;
  golsContra: number;
  saldoGols: number;

  // Strings formatadas
  aproveitamento: string;
  mediaPro: string;
  mediaContra: string;
}
