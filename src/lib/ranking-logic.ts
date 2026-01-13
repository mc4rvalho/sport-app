import { prisma } from "@/lib/prisma";

export interface ItemRanking {
  id: string;
  nome: string;
  fotoUrl: string | null;
  pontosRanking: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
  mediaPro: string; // Novo: MG+
  mediaContra: string; // Novo: MG-
  aproveitamento: string; // %
  categoria: string;
  time: string | null;
}

// Aceita um tipo de filtro
export async function gerarRanking(
  filtro: "GERAL" | "INTERNO" | "ADULTO" | "MASTER" = "GERAL"
): Promise<ItemRanking[]> {
  const resultados = await prisma.resultado.findMany({
    include: {
      botonista: true,
      campeonato: true,
    },
  });

  const stats: Record<string, ItemRanking> = {};

  for (const r of resultados) {
    // === LÓGICA DE FILTRAGEM (Item 3) ===
    let deveContar = false;

    if (filtro === "GERAL") {
      // Geral: Tudo exceto "Etapa PE" (Verifique se o nome exato no banco contém 'Etapa PE')
      if (!r.campeonato.nome.includes("Etapa PE")) deveContar = true;
    } else if (filtro === "INTERNO") {
      // Apenas tipo INTERNO
      if (r.campeonato.tipo === "INTERNO") deveContar = true;
    } else if (filtro === "ADULTO") {
      // Apenas jogadores da categoria ADULTO
      if (r.botonista.categoria === "ADULTO") deveContar = true;
    } else if (filtro === "MASTER") {
      // Apenas jogadores da categoria MASTER
      if (r.botonista.categoria === "MASTER") deveContar = true;
    }

    if (!deveContar) continue; // Pula esse registro se não passar no filtro

    // === INICIALIZAÇÃO ===
    if (!stats[r.botonistaId]) {
      stats[r.botonistaId] = {
        id: r.botonistaId,
        nome: r.botonista.nome,
        fotoUrl: r.botonista.fotoUrl,
        pontosRanking: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        golsPro: 0,
        golsContra: 0,
        saldoGols: 0,
        mediaPro: "0.00",
        mediaContra: "0.00",
        aproveitamento: "0.0",
        categoria: r.botonista.categoria,
        time: r.botonista.time,
      };
    }

    // === SOMA ===
    const s = stats[r.botonistaId];
    s.jogos += r.jogos;
    s.vitorias += r.vitorias;
    s.empates += r.empates;
    s.derrotas += r.derrotas;
    s.golsPro += r.golsPro;
    s.golsContra += r.golsContra;
    s.saldoGols += r.golsPro - r.golsContra;

    // Pontos (Item 5: PTS)
    const pontosJogo = r.vitorias * 3 + r.empates;
    s.pontosRanking += pontosJogo * r.campeonato.peso;
  }

  // === CÁLCULOS FINAIS (Médias e %) ===
  const ranking = Object.values(stats).map((atleta) => {
    const ptsPossiveis = atleta.jogos * 3;

    // Aproveitamento
    const aproveitamento =
      ptsPossiveis > 0
        ? (
            ((atleta.vitorias * 3 + atleta.empates) / ptsPossiveis) *
            100
          ).toFixed(1)
        : "0.0";

    // Médias de Gols (Item 5)
    const mediaPro =
      atleta.jogos > 0 ? (atleta.golsPro / atleta.jogos).toFixed(2) : "0.00";
    const mediaContra =
      atleta.jogos > 0 ? (atleta.golsContra / atleta.jogos).toFixed(2) : "0.00";

    return { ...atleta, aproveitamento, mediaPro, mediaContra };
  });

  // Ordenar
  return ranking.sort((a, b) => {
    if (b.pontosRanking !== a.pontosRanking)
      return b.pontosRanking - a.pontosRanking;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    return b.saldoGols - a.saldoGols;
  });
}
