"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verificarAdmin } from "@/lib/auth";

export async function salvarCampeonato(formData: FormData) {
  await verificarAdmin(); // Protege a ação

  const id = formData.get("id") as string;
  const nome = formData.get("nome") as string;
  const dataRaw = formData.get("data") as string;
  const tipo = formData.get("tipo") as string;

  let peso = 1;
  if (tipo === "ETAPA PE" || tipo === "COPA PE") peso = 2;
  else if (tipo === "NACIONAL" || tipo === "INTERNACIONAL") peso = 3;

  const data = {
    nome,
    data: new Date(dataRaw),
    tipo,
    peso,
    fotoUrl: "",
  };

  try {
    if (id) {
      await prisma.campeonato.update({ where: { id }, data });
    } else {
      await prisma.campeonato.create({ data });
    }
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
    revalidatePath("/calendario");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

export async function excluirCampeonato(id: string) {
  await verificarAdmin(); // Protege a ação
  try {
    await prisma.campeonato.delete({ where: { id } });
    revalidatePath("/admin/campeonatos");
    revalidatePath("/ranking");
    revalidatePath("/calendario");
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}
