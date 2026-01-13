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
    peso = 2; // Exemplo: Estaduais valem mais
  }

  const data = {
    nome,
    data: new Date(dataRaw), // Converte string para Data
    tipo,
    peso,
    fotoUrl: "", // Campo opcional
  };

  try {
    if (id) {
      await prisma.campeonato.update({ where: { id }, data });
    } else {
      await prisma.campeonato.create({ data });
    }
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao salvar campeonato:", error);
  }
}

export async function excluirCampeonato(id: string) {
  try {
    await prisma.campeonato.delete({ where: { id } });
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao excluir campeonato:", error);
  }
}
