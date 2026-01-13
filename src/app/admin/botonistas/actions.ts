"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function salvarBotonista(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const fotoUrl = formData.get("fotoUrl") as string;

  try {
    if (id) {
      // EDITAR
      await prisma.botonista.update({
        where: { id },
        data: { nome, categoria, fotoUrl },
      });
    } else {
      // CRIAR NOVO
      await prisma.botonista.create({
        data: { nome, categoria, fotoUrl, time: "Sport" },
      });
    }

    revalidatePath("/admin/botonistas"); // Atualiza a lista na hora
  } catch (error) {
    console.error("Erro ao salvar botonista:", error);
  }
}

export async function excluirBotonista(id: string) {
  try {
    await prisma.botonista.delete({ where: { id } });
    revalidatePath("/admin/botonistas");
  } catch (error) {
    console.error("Erro ao excluir botonista:", error);
  }
}
