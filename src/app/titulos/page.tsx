import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sala de Troféus | Sport Club do Recife - Futebol de Mesa",
  description: "Nossa história de glórias e conquistas.",
};

// Função para formatar imagem (Google Drive)
function formatarImagem(url: string | null) {
  if (!url) return "";
  if (url.includes("drive.google.com") && url.includes("/file/d/")) {
    try {
      const id = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w500`;
    } catch {
      return url;
    }
  }
  return url;
}

export default async function TitulosPage() {
  // Busca todas as conquistas ordenadas por ano (mais recente primeiro)
  const conquistas = await prisma.conquista.findMany({
    orderBy: { ano: "desc" },
  });

  // Cálculos automáticos das quantidades
  const total = conquistas.length;
  const estaduais = conquistas.filter((c) => c.tipo === "ESTADUAL").length;
  const regionais = conquistas.filter((c) => c.tipo === "REGIONAL").length;
  const nacionais = conquistas.filter((c) => c.tipo === "NACIONAL").length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* CABEÇALHO */}
        <div className="text-center mb-16">
          <h1 className="font-barlow text-5xl md:text-6xl text-(--leao-amarelo) uppercase font-black mb-4 tracking-tight">
            Sala de <span className="text-(--leao-vermelho)">Troféus</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            A história do Sport Club do Recife no futebol de mesa é feita de
            glórias. Confira nossa galeria de conquistas oficiais.
          </p>
        </div>

        {/* PLACAR DE CONQUISTAS (STATISTICS) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 border-y border-zinc-800 py-8 bg-[#111] rounded-xl">
          {/* TOTAL */}
          <div className="text-center border-r border-zinc-800 last:border-0">
            <span className="block text-4xl md:text-5xl font-black text-(--leao-amarelo) font-barlow mb-1">
              {total}
            </span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest">
              Total de Títulos
            </span>
          </div>

          {/* ESTADUAIS */}
          <div className="text-center border-r border-zinc-800 last:border-0">
            <span className="block text-4xl md:text-5xl font-black text-(--leao-vermelho) font-barlow mb-1">
              {estaduais}
            </span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest">
              Estaduais
            </span>
          </div>

          {/* REGIONAIS */}
          <div className="text-center border-r border-zinc-800 last:border-0">
            <span className="block text-4xl md:text-5xl font-black text-(--leao-amarelo) font-barlow mb-1">
              {regionais}
            </span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest">
              Regionais
            </span>
          </div>

          {/* NACIONAIS (Substituindo a "Paixão") */}
          <div className="text-center">
            <span className="block text-4xl md:text-5xl font-black text-(--leao-vermelho) font-barlow mb-1">
              {nacionais}
            </span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase font-bold tracking-widest">
              Nacionais
            </span>
          </div>
        </div>

        {/* GRID DE TAÇAS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {conquistas.map((item) => {
            const imgUrl = formatarImagem(item.imagemUrl);

            return (
              <div
                key={item.id}
                className="bg-[#111] border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-(--leao-amarelo) hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Efeito de brilho ao passar o mouse */}
                <div className="absolute inset-0 bg-linear-to-b from-(--leao-amarelo)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Ano */}
                <span className="text-4xl font-black text-zinc-800 absolute top-2 right-4 group-hover:text-(--leao-amarelo)/20 transition-colors select-none">
                  {item.ano}
                </span>

                {/* Imagem */}
                <div className="h-40 w-full flex items-center justify-center mb-6 relative z-10">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt={item.nome}
                      referrerPolicy="no-referrer"
                      className="h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-6xl grayscale opacity-20">🏆</span>
                  )}
                </div>

                {/* Textos */}
                <div className="relative z-10">
                  <h3 className="text-(--leao-vermelho) font-barlow font-bold uppercase text-lg leading-tight mb-2">
                    {item.nome}
                  </h3>
                  <div className="flex justify-center gap-2">
                    <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded border border-zinc-800 uppercase font-bold tracking-wider">
                      {item.tipo}
                    </span>
                    <span className="text-[10px] bg-(--leao-amarelo) text-black px-2 py-1 rounded font-black">
                      {item.ano}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MENSAGEM SE VAZIO */}
        {conquistas.length === 0 && (
          <div className="text-center py-20 p-8 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-xl font-barlow uppercase font-bold">
              Nenhuma conquista cadastrada ainda.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
