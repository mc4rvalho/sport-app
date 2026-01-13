import Link from "next/link";
import { pegarSessao } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const sessao = await pegarSessao();

  // Proteção: Apenas ADMIN
  if (!sessao || sessao.role !== "ADMIN") {
    redirect("/");
  }

  const menuItems = [
    {
      label: "Lançar Súmula",
      icon: "📝",
      desc: "Resultados & Estatísticas",
      href: "/admin/resultados",
      color: "border-red-900 bg-red-900/10",
    },
    {
      label: "Campeonatos",
      icon: "⚽",
      desc: "Criar competições",
      href: "/admin/campeonatos",
      color: "border-zinc-800 bg-zinc-900",
    },
    {
      label: "Botonistas",
      icon: "👤",
      desc: "Gerenciar elenco",
      href: "/admin/jogadores",
      color: "border-zinc-800 bg-zinc-900",
    },
    {
      label: "Notícias",
      icon: "📰",
      desc: "Publicar no Boletim",
      href: "/admin/noticias",
      color: "border-zinc-800 bg-zinc-900",
    },
    {
      label: "Sala de Troféus",
      icon: "🏆",
      desc: "Gerenciar Conquistas",
      href: "/admin/trofeus",
      color: "border-zinc-800 bg-zinc-900",
    },
    {
      label: "Usuários",
      icon: "🔐",
      desc: "Criar Contas de Acesso",
      href: "/admin/usuarios",
      color: "border-zinc-800 bg-zinc-900",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-barlow text-4xl text-white uppercase font-bold mb-2 flex items-center gap-3">
          <span className="text-zinc-500">⚙️</span> Painel de Controle
        </h1>
        <p className="text-zinc-500 mb-12 uppercase tracking-widest text-sm">
          Gerenciamento do Departamento
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group border ${item.color} p-8 rounded-xl hover:scale-105 transition-all duration-300 hover:border-(--leao-amarelo)`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform w-fit">
                {item.icon}
              </div>
              <h2 className="text-white font-barlow text-2xl font-bold uppercase mb-1">
                {item.label}
              </h2>
              <p className="text-zinc-500 text-sm font-bold uppercase">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
