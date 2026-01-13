import { pegarSessao } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function MeuPerfil() {
  const sessao = await pegarSessao();

  if (!sessao) {
    redirect("/login");
  }

  // Tenta achar o atleta vinculado a esse usuario
  const atleta = await prisma.botonista.findFirst({
    // CORREÇÃO: Mudamos de 'sessao.sub' para 'sessao.id'
    where: { usuarioId: sessao.id },
  });

  // Se o usuário não tem um perfil de atleta vinculado, mostra aviso
  if (!atleta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Perfil não vinculado</h1>
          <p className="text-zinc-500">
            Seu usuário ({sessao.nome}) não está ligado a um jogador.
          </p>
          {sessao.role === "ADMIN" && (
            <p className="mt-4 text-(--leao-amarelo)">
              Como você é Admin, vá em Botonistas e vincule seu e-mail ao seu
              jogador.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Se achou, redireciona para a página bonita de atleta
  redirect(`/atleta/${atleta.id}`);
}
