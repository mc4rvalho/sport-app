"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs"; // Importante
import { verificarAdmin } from "@/lib/auth";

export async function salvarUsuario(formData: FormData) {
  await verificarAdmin();

  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;
  const role = formData.get("role") as string;

  try {
    const data: { nome: string; email: string; role: string; senha?: string } =
      {
        nome,
        email,
        role,
      };

    // SE tiver senha digitada, criptografa
    if (senha) {
      data.senha = await hash(senha, 10);
    }

    if (id) {
      // Edição: só atualiza senha se o usuário digitou nova
      await prisma.usuario.update({ where: { id }, data });
    } else {
      // Criação: senha é obrigatória
      if (!senha) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await prisma.usuario.create({ data: data as any });
    }

    revalidatePath("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
}

export async function excluirUsuario(id: string) {
  await verificarAdmin();
  try {
    await prisma.usuario.delete({ where: { id } });
    revalidatePath("/admin/usuarios");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}
