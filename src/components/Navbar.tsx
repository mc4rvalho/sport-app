"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuario, setUsuario] = useState<{
    nome: string;
    foto: string | null;
    token: string | null;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("sport_token");
    const nome = localStorage.getItem("sport_nome");
    const foto = localStorage.getItem("sport_foto");

    if (token && nome) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsuario({ nome, foto, token });
    }
    
  }, []);

  function handleLogout() {
    localStorage.clear();
    setUsuario(null);
    router.push("/login");
    router.refresh();
  }

  function formatarFoto(url: string | null) {
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

  // 👇 ATUALIZADO PARA SINTAXE V4: text-(--leao-amarelo)
  const navLinkClass =
    "text-white font-bold font-barlow text-lg no-underline transition-colors uppercase hover:text-(--leao-amarelo)";

  const menuItemClass =
    "text-gray-300 p-2 rounded hover:bg-zinc-800 block text-sm transition-colors";

  return (
    <nav className="bg-(--leao-preto) border-b-4 border-(--leao-vermelho) px-8 py-4 flex justify-between items-center flex-wrap gap-5 shadow-lg sticky top-0 z-50">
      {/* LOGO */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png"
          alt="Escudo Sport"
          className="h-13.75 drop-shadow-md"
        />
        {/* Nota: h-13.75 pode não funcionar nativamente sem config, h-[55px] é garantido no JIT */}

        <div className="flex flex-col">
          <span className="font-barlow text-3xl leading-none text-(--leao-amarelo) uppercase font-bold">
            Futebol de Mesa
          </span>
          <span className="text-xs text-gray-400 tracking-[2px] uppercase mt-1">
            Sport Club do Recife
          </span>
        </div>
      </div>

      {/* LINKS */}
      <ul className="flex gap-6 items-center list-none m-0 p-0">
        <li>
          <Link href="/" className={navLinkClass}>
            INÍCIO
          </Link>
        </li>
        <li>
          <Link href="/sobre" className={navLinkClass}>
            SOBRE
          </Link>
        </li>
        <li>
          <Link href="/noticias" className={navLinkClass}>
            NOTÍCIAS
          </Link>
        </li>
        <li>
          <Link href="/titulos" className={navLinkClass}>
            TÍTULOS
          </Link>
        </li>
        <li>
          <Link href="/ranking" className={navLinkClass}>
            RANKING
          </Link>
        </li>

        {/* LOGIN / PERFIL */}
        {usuario ? (
          <>
            <li className="border-l border-gray-600 h-8 mx-2"></li>
            <li className="relative">
              <div
                onClick={() => setMenuAberto(!menuAberto)}
                className="w-11 h-11 rounded-full bg-zinc-800 border-2 border-(--leao-amarelo) flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-(--leao-amarelo) font-bold text-lg">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {menuAberto && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuAberto(false)}
                  />
                  <div className="absolute top-14 right-0 w-64 bg-[#1a1a1a] border border-zinc-700 border-t-4 border-t-(--leao-vermelho) rounded-lg p-4 flex flex-col gap-2 shadow-2xl z-50">
                    <div className="border-b border-zinc-700 pb-2 mb-1">
                      <strong className="text-white block truncate">
                        {usuario.nome}
                      </strong>
                      <span className="text-xs text-gray-400">Logado</span>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setMenuAberto(false)}
                      className={menuItemClass}
                    >
                      👤 Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`${menuItemClass} text-red-500 border-t border-zinc-800 mt-2 pt-2 w-full text-left`}
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
            <li className="border-l border-gray-600 h-8 mx-2"></li>
            <li>
              <Link
                href="/login"
                className="nav-link text-(--leao-amarelo) border border-(--leao-vermelho) px-4 py-1 hover:bg-(--leao-vermelho) hover:text-white transition-colors uppercase font-bold font-barlow"
              >
                🔐 LOGIN
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
