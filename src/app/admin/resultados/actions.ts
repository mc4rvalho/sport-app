"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarResultado(formData: FormData) {
  // Pegando os dados do formulário
  const campeonatoId = formData.get("campeonatoId") as string;
  const botonistaId = formData.get("botonistaId") as string;
  const colocacao = parseInt(formData.get("colocacao") as string);
  
  const vitorias = parseInt(formData.get("vitorias") as string) || 0;
  const empates = parseInt(formData.get("empates") as string) || 0;
  const derrotas = parseInt(formData.get("derrotas") as string) || 0;
  const golsPro = parseInt(formData.get("golsPro") as string) || 0;
  const golsContra = parseInt(formData.get("golsContra") as string) || 0;

  // Cálculo automático de jogos
  const jogos = vitorias + empates + derrotas;

  try {
    await prisma.resultado.create({
      data: {
        campeonatoId,
        botonistaId,
        colocacao,
        divisao: 1, // Padrão 1ª divisão
        jogos,
        vitorias,
        empates,
        derrotas,
        golsPro,
        golsContra
      },
    });

    revalidatePath("/admin/resultados"); // Atualiza a lista
    revalidatePath("/ranking"); // Atualiza o Ranking Oficial lá na Home!
  } catch (error) {
    console.error("Erro ao salvar resultado:", error);
  }
}

export async function excluirResultado(id: string) {
    try {
        await prisma.resultado.delete({ where: { id } });
        revalidatePath("/admin/resultados");
        revalidatePath("/ranking");
    } catch (error) {
        console.error("Erro ao excluir", error);
    }
}