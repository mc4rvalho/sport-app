import { verificarAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protege todas as páginas filhas (/admin/...)
  await verificarAdmin();

  return (
    <div className="min-h-screen bg-[#111] pb-20">
      {/* Navbar simplificada do Admin */}
      <div className="bg-black border-b border-[#333] p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <h1 className="font-barlow text-xl text-white uppercase font-bold tracking-wider">
            Painel do Diretor
          </h1>
        </div>
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-white hover:underline transition-colors"
        >
          Sair para o Site
        </Link>
      </div>

      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}
