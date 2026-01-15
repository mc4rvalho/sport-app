import { prisma } from "@/lib/prisma";
// Importa a interface unificada
import { ItemRanking } from "@/types/ranking";

// Lógica de Pontuação por Posição
function calcularPontosPorColocacao(
  posicao: number,
  nomeCampeonato: string
): number {
  const nome = nomeCampeonato.toUpperCase();
  let base = 0;

  // REGRA 1: Torneios de Peso Alto (100 pts)
  if (nome.includes("ETAPA PE") || nome.includes("COPA PE")) {
    base = 100;
  }
  // REGRA 2: Torneios de Peso Médio (50 pts)
  else if (nome.includes("INTERNO") || nome.includes("TGR")) {
    base = 50;
  } else {
    return 0; // Outros não pontuam no ranking oficial
  }

  // Sistema de Decaimento de Pontos
  if (posicao === 1) return base;
  if (posicao === 2) return base - 3;
  if (posicao === 3) return base - 6;

  // Do 4º em diante, cai 1 ponto por posição
  const pontos = base - 6 - (posicao - 3);

  return pontos > 0 ? pontos : 0;
}

export async function gerarRanking(
  filtro: "GERAL" | "INTERNO" | "ADULTO" | "MASTER" = "GERAL"
): Promise<ItemRanking[]> {
  // Busca tudo do banco (otimização: poderia filtrar no banco, mas a lógica JS é complexa)
  const resultados = await prisma.resultado.findMany({
    include: {
      botonista: true,
      campeonato: true,
    },
  });

  const stats: Record<string, ItemRanking> = {};

  for (const r of resultados) {
    let deveContar = false;
    const nomeCamp = r.campeonato.nome.toUpperCase();

    // === LÓGICA DE FILTRAGEM ===
    if (filtro === "GERAL") {
      // Aceita Copa PE, Interno, TGR. Exclui explicitamente Etapa PE.
      if (
        nomeCamp.includes("COPA PE") ||
        nomeCamp.includes("INTERNO") ||
        nomeCamp.includes("TGR")
      ) {
        deveContar = true;
      }
      if (nomeCamp.includes("ETAPA PE")) deveContar = false;
    } else if (filtro === "INTERNO") {
      if (nomeCamp.includes("INTERNO")) deveContar = true;
    } else if (filtro === "ADULTO") {
      // Todos os campeonatos, mas apenas atletas Adultos
      const validos = ["ETAPA PE", "COPA PE", "INTERNO", "TGR"];
      if (
        validos.some((c) => nomeCamp.includes(c)) &&
        r.botonista.categoria === "ADULTO"
      ) {
        deveContar = true;
      }
    } else if (filtro === "MASTER") {
      // Todos os campeonatos, mas apenas atletas Master
      const validos = ["ETAPA PE", "COPA PE", "INTERNO", "TGR"];
      if (
        validos.some((c) => nomeCamp.includes(c)) &&
        r.botonista.categoria === "MASTER"
      ) {
        deveContar = true;
      }
    }

    if (!deveContar) continue;

    // === INICIALIZAÇÃO DO OBJETO SE NÃO EXISTIR ===
    if (!stats[r.botonistaId]) {
      stats[r.botonistaId] = {
        id: r.botonistaId,
        nome: r.botonista.nome,
        fotoUrl: r.botonista.fotoUrl,
        time: r.botonista.time,
        categoria: r.botonista.categoria,
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
      };
    }

    // === ACUMULAÇÃO DE ESTATÍSTICAS ===
    const s = stats[r.botonistaId];
    s.jogos += r.jogos;
    s.vitorias += r.vitorias;
    s.empates += r.empates;
    s.derrotas += r.derrotas;
    s.golsPro += r.golsPro;
    s.golsContra += r.golsContra;
    s.saldoGols += r.golsPro - r.golsContra;

    // Calcula pontos deste torneio específico e soma
    s.pontosRanking += calcularPontosPorColocacao(r.colocacao, nomeCamp);
  }

  // === CÁLCULOS FINAIS (Médias e %) ===
  const ranking = Object.values(stats).map((atleta) => {
    const ptsPossiveis = atleta.jogos * 3;

    const aproveitamento =
      ptsPossiveis > 0
        ? (
            ((atleta.vitorias * 3 + atleta.empates) / ptsPossiveis) *
            100
          ).toFixed(1)
        : "0.0";

    const mediaPro =
      atleta.jogos > 0 ? (atleta.golsPro / atleta.jogos).toFixed(2) : "0.00";

    const mediaContra =
      atleta.jogos > 0 ? (atleta.golsContra / atleta.jogos).toFixed(2) : "0.00";

    return { ...atleta, aproveitamento, mediaPro, mediaContra };
  });

  // === ORDENAÇÃO ===
  // 1. Pontos | 2. Vitórias | 3. Saldo de Gols
  return ranking.sort((a, b) => {
    if (b.pontosRanking !== a.pontosRanking)
      return b.pontosRanking - a.pontosRanking;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    return b.saldoGols - a.saldoGols;
  });
}
