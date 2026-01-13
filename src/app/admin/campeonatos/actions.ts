"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarCampeonato(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const data = formData.get("data") as string; // Vem como YYYY-MM-DD do input date
  const tipo = formData.get("tipo") as string;

  try {
    const dataFormatada = new Date(data); // Converte string para Data Real

    if (id) {
      await prisma.campeonato.update({
        where: { id },
        data: { nome, data: dataFormatada, tipo },
      });
    } else {
      await prisma.campeonato.create({
        data: { 
          nome, 
          data: dataFormatada, 
          tipo,
          peso: tipo === "COPA" ? 2.0 : 1.0 // Lógica simples de peso
        },
      });
    }

    revalidatePath("/admin/campeonatos");
  } catch (error) {
    console.error("Erro ao salvar campeonato:", error);
  }
}

export async function excluirCampeonato(id: string) {
  try {
    await prisma.campeonato.delete({ where: { id } });
    revalidatePath("/admin/campeonatos");
  } catch (error) {
    console.error("Erro ao excluir campeonato (provavelmente tem jogos vinculados):", error);
  }
}