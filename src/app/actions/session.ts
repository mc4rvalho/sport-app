"use server";

import { pegarSessao } from "@/lib/auth";

export async function getSessionData() {
  const sessao = await pegarSessao();
  
  if (sessao) {
    return {
      nome: sessao.nome,
      foto: sessao.fotoUrl,
      role: sessao.role
    };
  }
  
  return null;
}