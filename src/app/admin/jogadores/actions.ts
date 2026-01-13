"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarBotonista(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const fotoUrl = formData.get("fotoUrl") as string;
  const emailVinculo = formData.get("emailVinculo") as string;

  try {
    let usuarioId = null;

    // Se digitou um email, busca o ID do usuário
    if (emailVinculo) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: emailVinculo }
      });
      
      if (usuario) {
        usuarioId = usuario.id;
      } else {
        // Opcional: Poderia retornar erro avisando que o email não existe
        console.warn("Usuário não encontrado para vínculo:", emailVinculo);
      }
    }

    const data = {
      nome,
      categoria,
      fotoUrl,
      time: "Sport", // Padrão
      usuarioId: usuarioId // Vincula (ou desvincula se for null)
    };

    if (id) {
      await prisma.botonista.update({ where: { id }, data });
    } else {
      await prisma.botonista.create({ data });
    }

    revalidatePath("/admin/jogadores");
    revalidatePath("/ranking");
  } catch (error) {
    console.error("Erro ao salvar jogador:", error);
  }
}

export async function excluirBotonista(id: string) {
  try {
    await prisma.botonista.delete({ where: { id } });
    revalidatePath("/admin/jogadores");
  } catch (error) {
    console.error("Erro ao excluir jogador:", error);
  }
}