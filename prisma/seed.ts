import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando a semeadura...");

  // 1. LIMPEZA TOTAL
  await prisma.usuario.deleteMany();
  await prisma.botonista.deleteMany();
  await prisma.resultado.deleteMany();
  await prisma.campeonato.deleteMany();

  // 2. CRIAR ADMIN
  const senhaCriptografada = await hash("Carvalho123@", 14);
  await prisma.usuario.create({
    data: {
      nome: "Matheus Carvalho",
      email: "admin@sportfutmesa.com",
      senha: senhaCriptografada,
      role: "ADMIN",
    },
  });
  console.log("🦁 Usuário ADMIN criado...");

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

  for (const nome of nomes) {
    await prisma.botonista.create({
      data: {
        nome,
        categoria: [
          "André Fenômeno",
          "Bel",
          "Djalma Costa",
          "Marcellus",
          "Pablo Costa",
          "Pentinho",
        ].includes(nome)
          ? "MASTER"
          : "ADULTO",
        time: "Sport",
      },
    });
  }
  console.log("✅ Jogadores criados...");

  // 4. CRIAR CAMPEONATOS
  await prisma.campeonato.create({
    data: {
      nome: "Copa PE",
      data: new Date("2026-02-01T12:00:00Z"),
    },
  });

  const interno = await prisma.campeonato.create({
    data: {
      nome: "1º Interno Sport",
      data: new Date("2026-01-24T12:00:00Z"),
    },
  });
  console.log("✅ Semeadura concluída!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
