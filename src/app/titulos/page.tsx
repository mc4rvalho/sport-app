import { prisma } from "@/lib/prisma";

export default async function TitulosPage() {
  const conquistas = await prisma.conquista.findMany({
    orderBy: { ano: "desc" },
  });

  // Agrupar contagem por tipo (Opcional, para o dashboard)
  const total = conquistas.length;
  const estaduais = conquistas.filter((c) => c.tipo === "ESTADUAL").length;
  const regionais = conquistas.filter((c) => c.tipo === "REGIONAL").length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="font-barlow text-5xl md:text-6xl text-(--leao-amarelo) uppercase font-black mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            Sala de Troféus
          </h1>
          <p className="text-white max-w-2xl mx-auto text-lg leading-relaxed">
            A história do Sport Club do Recife no futebol de mesa é feita de
            glórias. Confira nossa galeria de conquistas oficiais.
          </p>
        </div>

        {/* PLACAR DE CONQUISTAS */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-16 border-y border-zinc-800 py-8 bg-zinc-900/20">
          <div className="text-center border-r border-zinc-800">
            <span className="block text-4xl font-black text-white font-barlow">
              {total}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              Total
            </span>
          </div>
          <div className="text-center border-r border-zinc-800">
            <span className="block text-4xl font-black text-(--leao-amarelo) font-barlow">
              {estaduais}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              Estaduais
            </span>
          </div>
          <div className="text-center border-r border-zinc-800 md:border-r-0">
            <span className="block text-4xl font-black text-white font-barlow">
              {regionais}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              Regionais
            </span>
          </div>
          <div className="text-center hidden md:block">
            <span className="block text-4xl font-black text-(--leao-vermelho) font-barlow">
              ∞
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
              Paixão
            </span>
          </div>
        </div>

        {/* GRID DE TAÇAS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {conquistas.map((taca) => (
            <div
              key={taca.id}
              className="bg-[#111] border border-zinc-800 p-6 rounded-xl flex flex-col items-center hover:border-(--leao-amarelo) hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* IMAGEM DA TAÇA */}
              <div className="h-40 w-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-(--leao-amarelo) opacity-0 group-hover:opacity-5 blur-2xl transition-opacity rounded-full"></div>
                {taca.imagemUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={taca.imagemUrl}
                    alt={taca.nome}
                    className="max-h-full max-w-full object-contain drop-shadow-xl z-10"
                  />
                ) : (
                  <span className="text-6xl z-10">🏆</span>
                )}
              </div>

              <span className="text-(--leao-vermelho) font-black text-3xl font-barlow mb-1">
                {taca.ano}
              </span>

              <h3 className="text-white font-bold uppercase text-center text-sm leading-tight min-h-10 flex items-center justify-center">
                {taca.nome}
              </h3>

              <span className="mt-4 text-[10px] bg-zinc-900 text-zinc-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                {taca.tipo}
              </span>
            </div>
          ))}
        </div>

        {conquistas.length === 0 && (
          <div className="text-center py-20 bg-[#111] rounded-xl border border-dashed border-zinc-800">
            <span className="text-4xl block mb-2">🦁</span>
            <p className="text-zinc-500 font-bold uppercase">
              Nenhum troféu cadastrado ainda.
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Acesse o painel para adicionar conquistas.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
