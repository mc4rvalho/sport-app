"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/app/actions/session";

export function Navbar() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<{
    nome: string;
    foto: string | null;
    role: string;
  } | null>(null);

  useEffect(() => {
    async function carregarSessao() {
      const dados = await getSessionData();
      if (dados) {
        setUsuario({
          nome: dados.nome,
          foto: dados.foto ?? null,
          role: dados.role,
        });
      }
    }
    carregarSessao();
  }, []);

  async function handleLogout() {
    setUsuario(null);
    document.cookie = "session=; Max-Age=0; path=/;";
    router.push("/login");
    router.refresh();
  }

  function formatarFoto(url: string | null | undefined) {
    if (!url) return "";
    if (url.includes("drive.google.com") && url.includes("/file/d/")) {
      try {
        const id = url.split("/file/d/")[1].split("/")[0];
        return `https://drive.google.com/thumbnail?id=${id}&sz=w200`;
      } catch {
        return url;
      }
    }
    return url;
  }

  const avatarUrl = formatarFoto(usuario?.foto || null);

  const navLinkClass =
    "text-gray-400 font-bold font-barlow text-lg no-underline transition-colors uppercase hover:text-(--leao-amarelo) tracking-wide";
  const menuItemClass =
    "flex items-center gap-3 text-gray-300 px-4 py-3 rounded-lg hover:bg-zinc-800 block text-sm transition-colors font-bold uppercase";

  return (
    <nav className="bg-(--leao-preto) border-b-4 border-(--leao-vermelho) px-6 lg:px-12 py-4 flex justify-between items-center flex-wrap gap-5 shadow-2xl sticky top-0 z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      {/* LADO ESQUERDO: LOGO */}
      <div className="flex items-center gap-4 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png"
          alt="Escudo Sport"
          className="h-14 drop-shadow-md group-hover:scale-105 transition-transform"
        />
        <div className="flex flex-col">
          <span className="font-barlow text-3xl leading-none text-(--leao-amarelo) uppercase font-black tracking-tight">
            Futebol de Mesa
          </span>
          <span className="text-xs text-gray-400 tracking-[3px] uppercase mt-1 font-bold">
            Sport Club do Recife
          </span>
        </div>
      </div>

      {/* LADO DIREITO: LINKS E AVATAR */}
      <ul className="flex gap-8 items-center list-none m-0 p-0">
        <li className="hidden md:block">
          <Link href="/" className={navLinkClass}>
            INÍCIO
          </Link>
        </li>
        <li className="hidden md:block">
          <Link href="/sobre" className={navLinkClass}>
            SOBRE
          </Link>
        </li>
        <li className="hidden md:block">
          <Link href="/noticias" className={navLinkClass}>
            NOTÍCIAS
          </Link>
        </li>
        <li className="hidden md:block">
          <Link href="/titulos" className={navLinkClass}>
            TÍTULOS
          </Link>
        </li>
        <li className="hidden md:block">
          <Link href="/calendario" className={navLinkClass}>
            CALENDÁRIO
          </Link>
        </li>
        <li className="hidden md:block">
          <Link href="/ranking" className={navLinkClass}>
            RANKING
          </Link>
        </li>

        {/* ÁREA DE LOGIN / PERFIL */}
        {usuario ? (
          <>
            <li className="border-l-2 border-zinc-800 h-8 mx-2 hidden md:block"></li>
            <li className="relative">
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-(--leao-amarelo) flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:ring-4 ring-(--leao-amarelo)/30 ring-offset-2 ring-offset-black"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-(--leao-amarelo) font-bold text-xl">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              {menuAberto && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMenuAberto(false)}
                  />
                  <div className="absolute top-16 right-0 w-72 bg-[#111] border border-zinc-800 border-t-4 border-t-(--leao-vermelho) rounded-xl p-2 flex flex-col gap-1 shadow-2xl z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="px-4 py-3 border-b border-zinc-800 mb-2 flex items-center gap-3 bg-zinc-900/50 rounded-t-lg">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-700">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl flex items-center justify-center h-full bg-zinc-800">
                            👤
                          </span>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <strong className="text-white block truncate font-barlow uppercase text-lg leading-none">
                          {usuario.nome}
                        </strong>
                        <span className="text-[10px] text-(--leao-amarelo) font-bold uppercase tracking-wider bg-zinc-800 px-2 py-0.5 rounded-full inline-block mt-1">
                          {usuario.role === "ADMIN"
                            ? "Diretoria 🛡️"
                            : "Atleta ⚽"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/perfil"
                      onClick={() => setMenuAberto(false)}
                      className={menuItemClass}
                    >
                      👤 Meu Perfil
                    </Link>

                    {usuario.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuAberto(false)}
                        className={`${menuItemClass} text-(--leao-amarelo) hover:bg-yellow-900/20`}
                      >
                        ⚙️ Painel do Diretor
                      </Link>
                    )}

                    <div className="border-t border-zinc-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className={`${menuItemClass} text-red-500 hover:bg-red-950/30 hover:text-red-400 w-full text-left cursor-pointer`}
                    >
                      ⬅️ Sair da Conta
                    </button>
                  </div>
                </>
              )}
            </li>
          </>
        ) : (
          <>
            <li className="border-l-2 border-zinc-800 h-8 mx-2 hidden md:block"></li>
            <li>
              <Link
                href="/login"
                className="flex items-center gap-2 text-(--leao-amarelo) border-2 border-(--leao-amarelo) px-6 py-2 rounded-full hover:bg-(--leao-amarelo) hover:text-black transition-all uppercase font-black font-barlow text-sm tracking-wider hover:shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              >
                <span>🦁</span> Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
