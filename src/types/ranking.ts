export interface ItemRanking {
  nome: string;
  fotoUrl?: string | null;
  time?: string | null;
  categoria: string;
  pontosRanking: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gp: number;
  gc: number;
  sg: number;
  aproveitamento: string;
  mgPro: string;
  mgContra: string;
}
