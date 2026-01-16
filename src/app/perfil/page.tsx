import { pegarSessao } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function MeuPerfil() {
  const sessao = await pegarSessao();

  if (!sessao) {
    redirect("/login");
  }

  const atleta = await prisma.botonista.findFirst({
    where: { usuarioId: sessao.id },
  });

  if (!atleta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Perfil não vinculado</h1>
          <p className="text-zinc-500">
            Seu usuário ({sessao.nome}) não está ligado a um jogador.
          </p>
          {sessao.role === "ADMIN" && (
            <p className="mt-4 text-leao-amarelo">
              Como você é Admin, vá em Botonistas e vincule seu e-mail ao seu
              jogador.
            </p>
          )}
        </div>
      </div>
    );
  }

  redirect(`/atleta/${atleta.id}`);
}
