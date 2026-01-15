"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/auth";

export async function salvarResultado(formData: FormData) {
  await verificarAdmin();

  const id = formData.get("id") as string;
  const botonistaId = formData.get("botonistaId") as string;
  const campeonatoId = formData.get("campeonatoId") as string;
  const colocacao = parseInt(formData.get("colocacao") as string);
  const jogos = parseInt(formData.get("jogos") as string);
  const vitorias = parseInt(formData.get("vitorias") as string);
  const empates = parseInt(formData.get("empates") as string);
  const derrotas = parseInt(formData.get("derrotas") as string);
  const golsPro = parseInt(formData.get("golsPro") as string);
  const golsContra = parseInt(formData.get("golsContra") as string);

  const data = {
    botonistaId,
    campeonatoId,
    colocacao,
    jogos,
    vitorias,
    empates,
    derrotas,
    golsPro,
    golsContra,
    divisao: 1,
    data: new Date(),
  };

  try {
    if (id) {
      await prisma.resultado.update({ where: { id }, data });
    } else {
      await prisma.resultado.create({ data });
    }
    revalidatePath("/admin/resultados");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

export async function excluirResultado(id: string) {
  await verificarAdmin();
  try {
    await prisma.resultado.delete({ where: { id } });
    revalidatePath("/admin/resultados");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}
