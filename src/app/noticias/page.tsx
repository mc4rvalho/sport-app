import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Função auxiliar para formatar imagem
function formatarImagem(url: string | null) {
  if (!url) return "";
  if (url.includes("drive.google.com") && url.includes("/file/d/")) {
    try {
      const id = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
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
    <main className="min-h-screen bg-[#0a0a0a] pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* CABEÇALHO */}
        <div className="text-center mb-16">
          <h1 className="font-barlow text-5xl md:text-6xl text-(--leao-amarelo) uppercase font-black mb-4">
            Notícias do <span className="text-(--leao-vermelho)">Leão</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Fique por dentro de tudo que rola no departamento
          </p>
        </div>

        {/* GRID DE NOTÍCIAS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticias.map((item) => (
            <Link
              key={item.id}
              href={item.link || "#"}
              target={item.link ? "_blank" : "_self"}
              className="group bg-[#111] border border-zinc-800 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-(--leao-vermelho)/20 block"
            >
              {/* IMAGEM DE CAPA */}
              <div className="h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                {item.imagemUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formatarImagem(item.imagemUrl)}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-4xl grayscale opacity-20">📰</span>
                  </div>
                )}
              </div>

              {/* CONTEÚDO */}
              <div className="p-6">
                <span className="text-[10px] font-bold text-(--leao-amarelo) uppercase tracking-wider mb-2 block">
                  {new Date(item.data).toLocaleDateString("pt-BR")}
                </span>

                <h3 className="text-white font-barlow text-2xl font-bold uppercase leading-none mb-3 group-hover:text-(--leao-vermelho) transition-colors line-clamp-2">
                  {item.titulo}
                </h3>

                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
                  {item.subtitulo}
                </p>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-600 uppercase group-hover:text-white transition-colors">
                    Ler mais
                  </span>
                  <span className="text-zinc-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {noticias.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-600 font-bold uppercase">
              Nenhuma notícia publicada.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
