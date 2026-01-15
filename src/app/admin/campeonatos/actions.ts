"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarCampeonato(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const dataRaw = formData.get("data") as string;
  const tipo = formData.get("tipo") as string;

  // Lógica de Peso automática baseada no Tipo
  let peso = 1;
  if (tipo === "ETAPA PE" || tipo === "COPA PE") {
    peso = 2; // Estaduais valem mais
  } else if (tipo === "NACIONAL" || tipo === "INTERNACIONAL") {
    peso = 3; // Nacionais/Mundiais valem ainda mais
  }

  const data = {
    nome,
    // new Date("YYYY-MM-DD") cria a data em UTC 00:00 automaticamente, o que é correto
    data: new Date(dataRaw),
    tipo,
    peso,
    fotoUrl: "",
  };

  try {
    if (id) {
      await prisma.campeonato.update({ where: { id }, data });
    } else {
      await prisma.campeonato.create({ data });
    }
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
    revalidatePath("/calendario"); // Atualiza o calendário também
  } catch (error) {
    console.error("Erro ao salvar campeonato:", error);
  }
}

export async function excluirCampeonato(id: string) {
  try {
    await prisma.campeonato.delete({ where: { id } });
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
    revalidatePath("/calendario");
  } catch (error) {
    console.error("Erro ao excluir campeonato:", error);
  }
}
