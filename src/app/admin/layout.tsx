import { verificarAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Esta função verifica o cookie. Se não for admin, redireciona pro login.
  await verificarAdmin();

  return (
    <div className="min-h-screen bg-[#111] pb-20">
      {/* Barra de Navegação do Admin */}
      <div className="bg-black border-b border-[#333] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <h1 className="font-barlow text-xl text-white uppercase font-bold tracking-wider">
            Painel do Diretor
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white hover:underline"
        >
          Voltar ao Site
        </Link>
      </div>

      {/* Conteúdo das Páginas Admin */}
      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}
