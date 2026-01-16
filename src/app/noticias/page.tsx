import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias | Sport Club do Recife - Futebol de Mesa",
  description: "Fique por dentro das últimas novidades.",
};

function formatarData(data: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}

function formatarImagem(url: string | null) {
  if (!url) return "";
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

export default async function NoticiasPage() {
  const noticias = await prisma.noticia.findMany({
    where: { publicada: true },
    orderBy: { data: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-barlow text-5xl md:text-6xl text-white uppercase font-black mb-4 tracking-tight">
            <span className="text-leao-amarelo">Últimas</span>{" "}
            <span className="text-leao-vermelho">Notícias</span>
          </h1>
          <div className="w-24 h-1 bg-leao-vermelho mx-auto mb-6"></div>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Acompanhe o dia a dia, resultados dos torneios e novidades do nosso
            departamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((noticia, index) => {
            const imgUrl = formatarImagem(noticia.imagemUrl);
            const destaqueClass =
              index === 0 ? "md:col-span-2 lg:col-span-3" : "";
            const alturaImagem = index === 0 ? "h-80 md:h-[500px]" : "h-72";

            return (
              <article
                key={noticia.id}
                className={`bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-leao-amarelo transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] ${destaqueClass}`}
              >
                <div
                  className={`${alturaImagem} bg-black relative overflow-hidden flex items-center justify-center`}
                >
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={noticia.titulo}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/50">
                      <span className="text-5xl grayscale opacity-20">🦁</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-leao-vermelho text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-lg z-10">
                    {formatarData(noticia.data)}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-white font-barlow text-2xl uppercase font-bold leading-tight mb-3 group-hover:text-leao-amarelo transition-colors">
                    {noticia.titulo}
                  </h2>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                    {noticia.subtitulo}
                  </p>
                  {noticia.link && (
                    <a
                      href={noticia.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-leao-amarelo font-bold uppercase text-sm tracking-wider hover:underline w-fit"
                    >
                      Leia mais <span className="text-lg">↗</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
          {noticias.length === 0 && (
            <div className="col-span-full text-center py-20 p-8 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500 text-xl font-barlow uppercase font-bold">
                Nenhuma notícia publicada no momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
