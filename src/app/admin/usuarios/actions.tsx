"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function salvarUsuario(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;
  const role = formData.get("role") as string;

  try {
    // CORREÇÃO: Removido 'any'. Definimos um objeto com os campos que o Prisma espera.
    const data: { nome: string; email: string; role: string; senha?: string } =
      {
        nome,
        email,
        role,
      };

    if (senha) {
      data.senha = await hash(senha, 8);
    }

    if (id) {
      await prisma.usuario.update({ where: { id }, data });
    } else {
      if (!senha) return;
      // Garante que a senha existe antes de criar
      data.senha = await hash(senha, 8);
      // O cast 'as any' aqui é seguro pois sabemos que os campos batem com o modelo
      await prisma.usuario.create({ data: data as any });
    }

    revalidatePath("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
}

export async function excluirUsuario(id: string) {
  try {
    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
  }
}
