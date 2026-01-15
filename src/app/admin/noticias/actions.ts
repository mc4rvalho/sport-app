"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/auth";

export async function salvarNoticia(formData: FormData) {
  await verificarAdmin();

  const id = formData.get("id") as string;
  const titulo = formData.get("titulo") as string;
  const subtitulo = formData.get("subtitulo") as string;
  const link = formData.get("link") as string;
  const imagemUrl = formData.get("imagemUrl") as string;
  const publicada = formData.get("publicada") === "on";

  try {
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
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

export async function excluirNoticia(id: string) {
  await verificarAdmin();
  try {
    await prisma.noticia.delete({ where: { id } });
    revalidatePath("/admin/noticias");
    revalidatePath("/noticias");
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}
