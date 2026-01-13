"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarNoticia(formData: FormData) {
  const id = formData.get("id") as string;
  const titulo = formData.get("titulo") as string;
  const subtitulo = formData.get("subtitulo") as string;
  const link = formData.get("link") as string;
  const imagemUrl = formData.get("imagemUrl") as string;

  // Checkbox vem como "on" se marcado, ou null se não
  const publicada = formData.get("publicada") === "on";

  try {
    // CORREÇÃO: Adicionamos o campo 'conteudo' que é obrigatório no banco.
    // Usamos o subtítulo como conteúdo ou uma string vazia para não dar erro.
    const data = {
      titulo,
      subtitulo,
      link,
      imagemUrl,
      publicada,
      conteudo: subtitulo || "",
    };

    if (id) {
      await prisma.noticia.update({ where: { id }, data });
    } else {
      await prisma.noticia.create({ data });
    }

    revalidatePath("/admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/"); // Atualiza a Home também
  } catch (error) {
    console.error("Erro ao salvar notícia:", error);
  }
}

export async function excluirNoticia(id: string) {
  try {
    await prisma.noticia.delete({ where: { id } });
    revalidatePath("/admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
  }
}
