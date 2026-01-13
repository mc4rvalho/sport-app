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
  mediaPro: string;
  mediaContra: string;
  aproveitamento: string;
  categoria: string;
  time: string | null;
}

// Função para calcular pontos pela colocação e tipo de torneio
function calcularPontosPorColocacao(
  posicao: number,
  nomeCampeonato: string
): number {
  const nome = nomeCampeonato.toUpperCase();
  let base = 0;

  // GRUPO 1: Etapa PE e Copa PE (Valem MAIS agora: 100 pts)
  if (nome.includes("ETAPA PE") || nome.includes("COPA PE")) {
    base = 100;
  }
  // GRUPO 2: Interno e TGR (Valem MENOS agora: 50 pts)
  else if (nome.includes("INTERNO") || nome.includes("TGR")) {
    base = 50;
  } else {
    return 0; // Outros tipos não pontuam
  }

  // Regra de Pontuação:
  // 1º (Base)
  // 2º (Base - 3)
  // 3º (Base - 6)
  // 4º (Base - 7), 5º (Base - 8)... (Cai de 1 em 1 a partir daqui)

  if (posicao === 1) return base;
  if (posicao === 2) return base - 3;
  if (posicao === 3) return base - 6;

  // Para 4º em diante: Base - 6 - (diferença de posições a partir do 3º)
  const pontos = base - 6 - (posicao - 3);

  return pontos > 0 ? pontos : 0; // Nunca retorna negativo
}

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
    let deveContar = false;
    const nomeCamp = r.campeonato.nome.toUpperCase();

    // === LÓGICA DE FILTRAGEM RIGOROSA ===

    if (filtro === "GERAL") {
      // Regra GERAL: Copa PE, Interno e TGR.
      if (
        nomeCamp.includes("COPA PE") ||
        nomeCamp.includes("INTERNO") ||
        nomeCamp.includes("TGR")
      ) {
        deveContar = true;
      }
      // EXCLUSÃO EXPLÍCITA: Se for "Etapa PE", remove (mesmo que coincida com outra regra)
      if (nomeCamp.includes("ETAPA PE")) {
        deveContar = false;
      }
    } else if (filtro === "INTERNO") {
      // Regra INTERNO: Somente Interno
      if (nomeCamp.includes("INTERNO")) {
        deveContar = true;
      }
    } else if (filtro === "ADULTO") {
      // Regra ADULTO: Todos os campeonatos, mas só atletas Adultos
      const campeonatosValidos = ["ETAPA PE", "COPA PE", "INTERNO", "TGR"];
      const ehCampeonatoValido = campeonatosValidos.some((c) =>
        nomeCamp.includes(c)
      );

      if (ehCampeonatoValido && r.botonista.categoria === "ADULTO") {
        deveContar = true;
      }
    } else if (filtro === "MASTER") {
      // Regra MASTER: Todos os campeonatos, mas só atletas Masters
      const campeonatosValidos = ["ETAPA PE", "COPA PE", "INTERNO", "TGR"];
      const ehCampeonatoValido = campeonatosValidos.some((c) =>
        nomeCamp.includes(c)
      );

      if (ehCampeonatoValido && r.botonista.categoria === "MASTER") {
        deveContar = true;
      }
    }

    if (!deveContar) continue;

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

    // === SOMA DE ESTATÍSTICAS ===
    const s = stats[r.botonistaId];
    s.jogos += r.jogos;
    s.vitorias += r.vitorias;
    s.empates += r.empates;
    s.derrotas += r.derrotas;
    s.golsPro += r.golsPro;
    s.golsContra += r.golsContra;
    s.saldoGols += r.golsPro - r.golsContra;

    // === PONTUAÇÃO (NOVA LÓGICA) ===
    const pontosDoTorneio = calcularPontosPorColocacao(r.colocacao, nomeCamp);
    s.pontosRanking += pontosDoTorneio;
  }

  // === CÁLCULOS FINAIS ===
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

  // Ordenar: Pontos > Vitórias > Saldo
  return ranking.sort((a, b) => {
    if (b.pontosRanking !== a.pontosRanking)
      return b.pontosRanking - a.pontosRanking;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    return b.saldoGols - a.saldoGols;
  });
}
