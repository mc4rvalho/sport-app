"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarConquista(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const ano = formData.get("ano") as string;
  const tipo = formData.get("tipo") as string;
  const imagemUrl = formData.get("imagemUrl") as string;

  try {
    const data = { nome, ano, tipo, imagemUrl };

    if (id) {
      await prisma.conquista.update({ where: { id }, data });
    } else {
      await prisma.conquista.create({ data });
    }

    revalidatePath("/admin/trofeus");
    revalidatePath("/titulos"); // Atualiza a página pública de Títulos
  } catch (error) {
    console.error("Erro ao salvar conquista:", error);
  }
}

export async function excluirConquista(id: string) {
  try {
    await prisma.conquista.delete({ where: { id } });
    revalidatePath("/admin/trofeus");
    revalidatePath("/titulos");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}