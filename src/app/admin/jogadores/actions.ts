"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/auth";

export async function salvarBotonista(formData: FormData) {
  await verificarAdmin();

  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const fotoUrl = formData.get("fotoUrl") as string;
  const emailVinculo = formData.get("emailVinculo") as string;

  try {
    let usuarioId = null;

    if (emailVinculo) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: emailVinculo },
      });
      if (usuario) usuarioId = usuario.id;
    }

    const data = {
      nome,
      categoria,
      fotoUrl,
      time: "Sport",
      usuarioId: usuarioId,
    };

    if (id) {
      await prisma.botonista.update({ where: { id }, data });
    } else {
      await prisma.botonista.create({ data });
    }

    revalidatePath("/admin/jogadores");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

export async function excluirBotonista(id: string) {
  await verificarAdmin();
  try {
    await prisma.botonista.delete({ where: { id } });
    revalidatePath("/admin/jogadores");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}
