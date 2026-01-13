import { prisma } from "@/lib/prisma";
import { ItemRanking } from "@/types/ranking"; // Importe o tipo

export async function gerarRanking(
  filtroCategoria?: string
): Promise<ItemRanking[]> {
  const resultados = await prisma.resultado.findMany({
    include: { botonista: true, campeonato: true },
  });

  // Usamos um tipo parcial aqui enquanto construímos o objeto
  const ranking: Record<
    string,
    Omit<ItemRanking, "sg" | "aproveitamento" | "mgPro" | "mgContra"> & {
      gp: number;
      gc: number;
    }
  > = {};

  resultados.forEach((jogo) => {
    if (filtroCategoria && jogo.botonista.categoria !== filtroCategoria) return;

    const id = jogo.botonistaId;

    if (!ranking[id]) {
      ranking[id] = {
        nome: jogo.botonista.nome,
        fotoUrl: jogo.botonista.fotoUrl,
        time: jogo.botonista.time,
        categoria: jogo.botonista.categoria,
        pontosRanking: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gp: 0,
        gc: 0,
      };
    }

    ranking[id].jogos += jogo.jogos;
    ranking[id].vitorias += jogo.vitorias;
    ranking[id].empates += jogo.empates;
    ranking[id].derrotas += jogo.derrotas;
    ranking[id].gp += jogo.golsPro;
    ranking[id].gc += jogo.golsContra;

    let pontosPartida = 0;
    const tipo = jogo.campeonato.tipo;
    const pos = jogo.colocacao;

    if (tipo === "COPA" || tipo === "ETAPA") {
      if (pos === 1) pontosPartida = 100;
      else if (pos === 2) pontosPartida = 97;
      else if (pos === 3) pontosPartida = 94;
      else pontosPartida = Math.max(0, 97 - pos);
    } else {
      if (pos === 1) pontosPartida = 50;
      else if (pos === 2) pontosPartida = 47;
      else if (pos === 3) pontosPartida = 44;
      else pontosPartida = Math.max(0, 47 - pos);
    }

    ranking[id].pontosRanking += pontosPartida;
  });

  const listaFinal: ItemRanking[] = Object.values(ranking).map((r) => {
    const saldoGols = r.gp - r.gc;
    const ptGanhos = r.vitorias * 3 + r.empates;
    const ptPossiveis = r.jogos * 3;
    const aproveitamento = r.jogos > 0 ? (ptGanhos / ptPossiveis) * 100 : 0;

    return {
      ...r,
      sg: saldoGols,
      aproveitamento: aproveitamento.toFixed(1),
      mgPro: r.jogos > 0 ? (r.gp / r.jogos).toFixed(2) : "0.00",
      mgContra: r.jogos > 0 ? (r.gc / r.jogos).toFixed(2) : "0.00",
    };
  });

  return listaFinal.sort((a, b) => {
    if (b.pontosRanking !== a.pontosRanking)
      return b.pontosRanking - a.pontosRanking;
    return b.vitorias - a.vitorias;
  });
}
