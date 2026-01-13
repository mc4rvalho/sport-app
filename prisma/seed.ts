import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a semeadura completa...");

  // 1. LIMPEZA (Apenas tabelas que existem no seu schema atual)
  // A ordem importa para evitar erro de chave estrangeira
  await prisma.resultado.deleteMany();
  await prisma.campeonato.deleteMany();
  await prisma.botonista.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.noticia.deleteMany();
  await prisma.conquista.deleteMany();
  await prisma.pagina.deleteMany();

  // 2. CRIAR ADMIN
  const senhaHash = await hash("123456", 8);
  await prisma.usuario.create({
    data: {
      nome: "Admin Sport",
      email: "admin@sport.com",
      senha: senhaHash,
      role: "ADMIN",
    },
  });

  // 3. CRIAR BOTONISTAS
  const nomes = [
    "André Fenômeno",
    "André Luiz",
    "Bel",
    "Cimar",
    "Djalma Costa",
    "Flavio AFA",
    "Jef Lira",
    "Jeronimo Gomes",
    "Johnes",
    "Léo Morais",
    "Marcellus",
    "Matheus Carvalho",
    "Pablo Costa",
    "Papa",
    "Paulinho",
    "Pedro Drope",
    "Pentinho",
  ];

  // Array para guardar os IDs (Agora como STRING, pois seu schema usa UUID)
  const atletasIds: string[] = [];

  for (const nome of nomes) {
    const isMaster = [
      "André Fenômeno",
      "Bel",
      "Djalma Costa",
      "Marcellus",
      "Pablo Costa",
      "Pentinho",
    ].includes(nome);

    const novoAtleta = await prisma.botonista.create({
      data: {
        nome,
        categoria: isMaster ? "MASTER" : "ADULTO",
        time: "Sport",
      },
    });
    atletasIds.push(novoAtleta.id);
  }
  console.log(`✅ ${atletasIds.length} Atletas criados.`);

  // 4. CRIAR CAMPEONATOS
  const campInterno = await prisma.campeonato.create({
    data: {
      nome: "1º Interno Sport",
      data: new Date("2026-01-24T12:00:00Z"),
      tipo: "INTERNO",
      peso: 1.0,
    },
  });

  await prisma.campeonato.create({
    data: {
      nome: "Copa Pernambuco",
      data: new Date("2026-02-01T12:00:00Z"),
      tipo: "COPA",
      peso: 2.0,
    },
  });

  console.log(`✅ Campeonatos criados.`);

  // 5. GERAR RESULTADOS ALEATÓRIOS
  console.log("🎲 Simulando partidas...");

  for (let i = 0; i < 50; i++) {
    // Sorteia um ID de atleta
    const atletaId = atletasIds[Math.floor(Math.random() * atletasIds.length)];

    const vitorias = Math.floor(Math.random() * 5); // 0 a 4
    const empates = Math.floor(Math.random() * 3); // 0 a 2
    const derrotas = Math.floor(Math.random() * 3); // 0 a 2
    const jogos = vitorias + empates + derrotas;

    // Evita criar registro se não jogou
    if (jogos === 0) continue;

    const gp = vitorias * 2 + empates + Math.floor(Math.random() * 5);
    const gc = derrotas * 2 + empates + Math.floor(Math.random() * 3);

    // Posição aleatória entre 1 e 20
    const colocacao = Math.floor(Math.random() * 20) + 1;

    await prisma.resultado.create({
      data: {
        botonistaId: atletaId,
        campeonatoId: campInterno.id,
        colocacao: colocacao,
        divisao: 1,
        jogos,
        vitorias,
        empates,
        derrotas,
        golsPro: gp,
        golsContra: gc,
      },
    });
  }

  // 6. CRIAR PÁGINAS BÁSICAS (Para não dar erro no "Sobre")
  await prisma.pagina.create({
    data: {
      slug: "sobre",
      titulo: "NOSSA HISTÓRIA",
      conteudo: "Fundado em 1905, o Sport Club do Recife...",
    },
  });

  console.log(`✅ Resultados e Páginas gerados!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
