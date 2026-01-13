"use server";

import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { criarSessao } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LoginState {
  erro: string;
}

// Correção: prevState pode ser 'unknown' ou 'LoginState'
export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { botonista: true },
  });

  if (!usuario) {
    return { erro: "E-mail não encontrado." };
  }

  const senhaBate = await compare(senha, usuario.senha);
  if (!senhaBate) {
    return { erro: "Senha incorreta." };
  }

  await criarSessao({
    id: usuario.id,
    nome: usuario.nome,
    role: usuario.role,
    fotoUrl: usuario.botonista?.fotoUrl || "",
  });

  redirect("/admin");

  // O redirect interrompe a execução, mas o TS pede retorno
  return { erro: "" };
}
