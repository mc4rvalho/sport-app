import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { gerarRanking } from "@/lib/ranking-logic";

// Função para formatar a foto
function formatarFoto(url: string | null | undefined) {
  if (!url) return null;
  if (url.includes("drive.google.com") && url.includes("/file/d/")) {
    try {
      const id = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    } catch {
      return url;
    }
  }
  return url;
}

export default async function Home() {
  // 1. LÓGICA DA PRÓXIMA PARTIDA
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const proximoCampeonato = await prisma.campeonato.findFirst({
    where: {
      data: {
        gte: hoje,
      },
    },
    orderBy: {
      data: "asc",
    },
  });

  const dataDisplay = proximoCampeonato
    ? new Date(proximoCampeonato.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    : "EM BREVE";

  const nomeDisplay = proximoCampeonato
    ? proximoCampeonato.nome
    : "Calendário a definir";

  // 2. DADOS DO PÓDIO E NOTÍCIAS
  const rankingCompleto = await gerarRanking();
  const top3 = rankingCompleto.slice(0, 3);

  const ultimosResultados = await prisma.resultado.findMany({
    take: 5,
    orderBy: { data: "desc" },
    include: { botonista: true, campeonato: true },
  });

  const ultimaNoticia = await prisma.noticia.findFirst({
    where: { publicada: true },
    orderBy: { data: "desc" },
  });

  // Prepara as URLs (Evita erro no JSX)
  const imgTop1 = top3[0] ? formatarFoto(top3[0].fotoUrl) : null;
  const imgTop2 = top3[1] ? formatarFoto(top3[1].fotoUrl) : null;
  const imgTop3 = top3[2] ? formatarFoto(top3[2].fotoUrl) : null;
  const imgNoticia = ultimaNoticia
    ? formatarFoto(ultimaNoticia.imagemUrl)
    : null;

  return (
    <main className="min-h-screen pb-12 bg-[#0a0a0a]">
      {/* HERO SECTION DINÂMICA COM LINK PARA CALENDÁRIO */}
      <Link href="/calendario" className="block cursor-pointer group">
        <section className="bg-black border-b-4 border-(--leao-vermelho) py-10 text-center relative overflow-hidden shadow-xl z-10 hover:bg-[#0f0f0f] transition-colors">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40 mix-blend-overlay"></div>

          {/* Efeito Hover: Borda Amarela sutil ao passar o mouse */}
          <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-(--leao-amarelo) transition-colors duration-500"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-700 px-4 py-1 rounded-full text-zinc-400 text-[10px] font-bold tracking-[3px] uppercase mb-2 group-hover:border-(--leao-amarelo) group-hover:text-(--leao-amarelo) transition-colors">
              <span>Próxima Partida</span>
              <span className="text-xs">↗</span>
            </div>

            {proximoCampeonato ? (
              <>
                <h1 className="text-(--leao-amarelo) font-barlow text-7xl md:text-8xl font-black leading-none mb-1 drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)] group-hover:scale-105 group-hover:text-(--leao-vermelho) transition-transform duration-300">
                  {dataDisplay}
                </h1>
                <h2 className="text-(--leao-vermelho) font-barlow text-2xl md:text-4xl uppercase font-bold tracking-wider max-w-2xl leading-tight px-4 group-hover:text-(--leao-amarelo) transition-colors">
                  {nomeDisplay}
                </h2>
              </>
            ) : (
              <>
                <h1 className="text-zinc-600 font-barlow text-5xl md:text-7xl font-black leading-none mb-2 group-hover:text-zinc-500 transition-colors">
                  EM BREVE
                </h1>
                <h2 className="text-zinc-400 font-barlow text-xl uppercase font-bold tracking-wider">
                  Ver Calendário Completo
                </h2>
              </>
            )}
          </div>
        </section>
      </Link>

      {/* CONTAINER PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 mt-12 relative z-20">
        {/* PÓDIO */}
        {top3.length > 0 && (
          <div className="mb-16 border-b border-zinc-900/50 pb-8">
            <div className="text-center mb-16">
              <h3 className="font-barlow text-3xl uppercase font-bold text-white inline-flex items-center gap-3 before:h-px before:w-12 before:bg-zinc-700 after:h-px after:w-12 after:bg-zinc-700 tracking-wider">
                <span className="text-(--leao-amarelo) text-xl">♛</span>
                <span className="text-(--leao-amarelo)">Líderes da </span>
                <span className="text-(--leao-vermelho)">Temporada</span>
              </h3>
            </div>

            <div className="flex justify-center items-end gap-4 md:gap-12">
              {/* 2º LUGAR */}
              {top3[1] && (
                <div className="flex flex-col items-center group relative top-0">
                  <Link
                    href={`/atleta/${top3[1].id}`}
                    className="relative mb-2 transition-transform group-hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="w-8 h-8 absolute -top-2 -left-2 bg-zinc-400 text-black rounded-full flex items-center justify-center font-black text-xs border-2 border-[#0a0a0a] z-10 shadow-lg">
                      2º
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-zinc-400 overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center">
                      {imgTop2 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgTop2}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <span className="text-4xl text-zinc-600">👤</span>
                      )}
                    </div>
                  </Link>
                  <Link
                    href={`/atleta/${top3[1].id}`}
                    className="font-barlow font-bold uppercase text-lg text-gray-300 text-center leading-tight truncate w-32 hover:text-white transition-colors cursor-pointer"
                  >
                    {top3[1].nome}
                  </Link>
                  <span className="text-xs text-zinc-500 font-bold mt-1 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {top3[1].pontosRanking} Pts
                  </span>
                </div>
              )}

              {/* 1º LUGAR */}
              {top3[0] && (
                <div className="flex flex-col items-center z-10 relative -top-6">
                  <Link
                    href={`/atleta/${top3[0].id}`}
                    className="relative mb-3 transition-transform hover:-translate-y-2 scale-110 cursor-pointer group"
                  >
                    <div className="w-10 h-10 absolute -top-3 -right-3 bg-(--leao-amarelo) text-black rounded-full flex items-center justify-center font-black text-lg border-4 border-[#0a0a0a] z-10 shadow-md">
                      1º
                    </div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl text-(--leao-amarelo) drop-shadow-md animate-pulse">
                      ♔
                    </div>
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-(--leao-amarelo) overflow-hidden bg-zinc-900 shadow-[0_0_30px_rgba(255,215,0,0.2)] ring-4 ring-(--leao-amarelo)/10 ring-offset-4 ring-offset-black group-hover:ring-(--leao-amarelo)/40 transition-all flex items-center justify-center">
                      {imgTop1 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgTop1}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl text-zinc-600">👤</span>
                      )}
                    </div>
                  </Link>
                  <Link
                    href={`/atleta/${top3[0].id}`}
                    className="font-barlow font-black uppercase text-3xl text-(--leao-amarelo) mb-1 text-center leading-none drop-shadow-md tracking-wide truncate w-48 hover:underline cursor-pointer"
                  >
                    {top3[0].nome}
                  </Link>
                  <div className="text-sm bg-(--leao-vermelho) px-4 py-1 rounded-full font-bold shadow-lg uppercase tracking-widest text-white border border-red-900">
                    {top3[0].pontosRanking} PONTOS
                  </div>
                </div>
              )}

              {/* 3º LUGAR */}
              {top3[2] && (
                <div className="flex flex-col items-center group relative top-0">
                  <Link
                    href={`/atleta/${top3[2].id}`}
                    className="relative mb-2 transition-transform group-hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="w-8 h-8 absolute -top-2 -right-2 bg-[#cd7f32] text-black rounded-full flex items-center justify-center font-black text-xs border-2 border-[#0a0a0a] z-10 shadow-lg">
                      3º
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#cd7f32] overflow-hidden bg-zinc-900 shadow-xl flex items-center justify-center">
                      {imgTop3 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgTop3}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <span className="text-4xl text-zinc-600">👤</span>
                      )}
                    </div>
                  </Link>
                  <Link
                    href={`/atleta/${top3[2].id}`}
                    className="font-barlow font-bold uppercase text-lg text-gray-300 text-center leading-tight truncate w-32 hover:text-white transition-colors cursor-pointer"
                  >
                    {top3[2].nome}
                  </Link>
                  <span className="text-xs text-zinc-500 font-bold mt-1 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                    {top3[2].pontosRanking} Pts
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESTO DO CONTEÚDO */}
        <div className="grid lg:grid-cols-2 gap-10 mt-8">
          {/* ÚLTIMOS JOGOS */}
          <div>
            <div className="flex items-center justify-between mb-6 border-l-4 border-(--leao-vermelho) pl-4 bg-linear-to-r from-zinc-900 to-transparent py-2 rounded-r-lg">
              <h3 className="font-barlow text-2xl uppercase font-bold tracking-wide text-(--leao-amarelo)">
                Últimos Resultados
              </h3>
              <Link
                href="/ranking"
                className="text-[10px] font-bold text-zinc-400 hover:text-(--leao-amarelo) uppercase tracking-wider flex items-center gap-1 transition-colors border border-zinc-800 px-2 py-0.5 rounded hover:border-(--leao-amarelo)"
              >
                Ver Ranking →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {ultimosResultados.map((jogo, index) => (
                <div
                  key={jogo.id}
                  className={`bg-[#111] border border-zinc-800/60 p-3 rounded-lg flex items-center justify-between hover:border-zinc-600 hover:bg-[#161616] transition-all group shadow-md ${
                    index === 0 ? "border-l-4 border-l-(--leao-amarelo)" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-inner border border-zinc-800">
                      {jogo.campeonato.tipo.includes("PE") ? "🏆" : "⚽"}
                    </div>
                    <div>
                      <Link
                        href={`/atleta/${jogo.botonista.id}`}
                        className="text-(--leao-vermelho) block uppercase font-barlow text-xl leading-none mb-1 group-hover:text-(--leao-amarelo) transition-colors tracking-tight hover:underline"
                      >
                        {jogo.botonista.nome}
                      </Link>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                        {jogo.campeonato.nome}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black font-barlow text-(--leao-vermelho) leading-none italic group-hover:text-(--leao-amarelo) transition-colors">
                      {jogo.colocacao}º
                    </span>
                    <span className="text-[8px] text-zinc-600 uppercase font-bold mt-0.5 tracking-widest">
                      Colocação
                    </span>
                  </div>
                </div>
              ))}
              {ultimosResultados.length === 0 && (
                <div className="text-zinc-500 text-center py-4 text-xs uppercase font-bold">
                  Nenhum resultado recente.
                </div>
              )}
            </div>
          </div>

          {/* DESTAQUE */}
          <div>
            <div className="flex items-center justify-between mb-6 border-l-4 border-(--leao-vermelho) pl-4 bg-linear-to-r from-zinc-900 to-transparent py-2 rounded-r-lg">
              <h3 className="font-barlow text-2xl uppercase font-bold tracking-wide text-(--leao-amarelo)">
                Destaque do Leão
              </h3>
              <Link
                href="/noticias"
                className="text-[10px] font-bold text-zinc-400 hover:text-(--leao-amarelo) uppercase tracking-wider flex items-center gap-1 transition-colors border border-zinc-800 px-2 py-0.5 rounded hover:border-(--leao-amarelo)"
              >
                Mais Notícias →
              </Link>
            </div>

            {ultimaNoticia ? (
              <Link
                href={ultimaNoticia.link || "/noticias"}
                target={ultimaNoticia.link ? "_blank" : "_self"}
                className="block bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden group hover:border-(--leao-amarelo)/40 transition-all shadow-lg hover:shadow-(--leao-amarelo)/10 relative top-0 hover:-top-1"
              >
                <div className="h-72 overflow-hidden relative flex items-center justify-center bg-black">
                  {imgNoticia ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgNoticia}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <span className="text-5xl grayscale opacity-20">📰</span>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent opacity-90"></div>

                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <span className="inline-block bg-(--leao-vermelho) text-white text-[9px] font-black uppercase px-3 py-1 rounded mb-3 tracking-widest shadow-sm">
                      {new Date(ultimaNoticia.data).toLocaleDateString("pt-BR")}
                    </span>
                    <h4 className="text-white font-barlow text-4xl font-black uppercase leading-none mb-2 group-hover:text-(--leao-amarelo) transition-colors drop-shadow-md">
                      {ultimaNoticia.titulo}
                    </h4>
                    <p className="text-gray-300 text-xs line-clamp-2 max-w-lg leading-relaxed font-medium">
                      {ultimaNoticia.subtitulo}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="h-64 bg-[#111] border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3">
                <span className="text-4xl grayscale opacity-30">📰</span>
                <p className="font-bold uppercase text-xs tracking-widest opacity-50">
                  Sem notícias no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
