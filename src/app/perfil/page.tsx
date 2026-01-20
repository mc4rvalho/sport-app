import { pegarSessao } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserX, ShieldAlert } from "lucide-react";

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
        <div className="text-center flex flex-col items-center max-w-md px-6">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border-2 border-zinc-800">
            <UserX className="w-10 h-10 text-zinc-600" />
          </div>

          <h1 className="text-3xl font-barlow font-bold uppercase mb-2 text-white">
            Perfil não vinculado
          </h1>

          <p className="text-zinc-500 mb-6 leading-relaxed">
            O usuário <strong className="text-white">{sessao.nome}</strong> está
            logado, mas não encontramos um perfil de atleta ligado a esta conta.
          </p>

          {sessao.role === "ADMIN" && (
            <div className="bg-yellow-900/10 border border-leao-amarelo/20 p-4 rounded-xl flex items-start gap-3 text-left">
              <ShieldAlert className="w-5 h-5 text-leao-amarelo shrink-0 mt-0.5" />
              <div>
                <p className="text-leao-amarelo font-bold text-sm uppercase mb-1">
                  Aviso de Administrador
                </p>
                {/* CORREÇÃO AQUI: Trocado "Vincular Login" por &quot;Vincular Login&quot; */}
                <p className="text-zinc-400 text-xs">
                  Vá até a gestão de <strong>Botonistas</strong> e edite o seu
                  perfil de atleta para inserir o e-mail
                  <span className="text-white font-mono ml-1">
                    {sessao.nome}
                  </span>
                  no campo &quot;Vincular Login&quot;.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  redirect(`/atleta/${atleta.id}`);
}
