import { verificarAdmin } from "@/lib/auth";
import Link from "next/link";
import { Settings, LogOut, LayoutDashboard } from "lucide-react";

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
      <div className="bg-black border-b border-[#333] p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3 text-leao-amarelo">
          <Settings className="w-6 h-6 animate-spin-slow" />
          <h1 className="font-barlow text-xl text-white uppercase font-bold tracking-wider flex items-center gap-2">
            Painel do Diretor
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 uppercase font-bold text-[10px] tracking-widest"
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">Início</span>
          </Link>

          <div className="h-4 w-px bg-zinc-800"></div>

          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-leao-amarelo transition-colors flex items-center gap-2 uppercase font-bold text-[10px] tracking-widest"
          >
            Sair para o Site <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}
