import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PerfilAtleta({ params }: PageProps) {
  const { id } = await params;

  const atleta = await prisma.botonista.findUnique({
    where: { id },
    include: {
      resultados: {
        orderBy: { data: "desc" },
        include: { campeonato: true },
      },
    },
  });

  if (!atleta) return notFound();

  const totalJogos = atleta.resultados.reduce((acc, r) => acc + r.jogos, 0);
  const totalTitulos = atleta.resultados.filter(
    (r) => r.colocacao === 1
  ).length;

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20 pt-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* CABEÇALHO */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-leao-vermelho opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative shrink-0">
            <div className="w-48 h-48 rounded-full border-[6px] border-leao-vermelho overflow-hidden bg-zinc-900 shadow-[0_0_30px_rgba(211,9,21,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formatarFoto(atleta.fotoUrl)}
                alt={atleta.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <span className="text-zinc-500 font-bold uppercase tracking-[4px] text-xs mb-2 block">
              Ficha Técnica
            </span>
            <h1 className="text-white font-barlow text-5xl md:text-6xl font-black uppercase leading-none mb-4">
              {atleta.nome}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
              <span className="bg-leao-vermelho text-leao-preto font-bold px-4 py-1 rounded text-sm uppercase shadow-lg border border-red-900">
                {atleta.categoria}
              </span>
              {atleta.time && (
                <span className="bg-zinc-800 text-zinc-300 font-bold px-4 py-1 rounded text-sm uppercase border border-zinc-700">
                  {atleta.time}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-12">
            <div className="text-center">
              <span className="block text-5xl font-black text-leao-amarelo font-barlow leading-none">
                {totalTitulos}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 block">
                Títulos
              </span>
            </div>
            <div className="text-center">
              <span className="block text-5xl font-black text-leao-vermelho font-barlow leading-none">
                {totalJogos}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 block">
                Jogos
              </span>
            </div>
            <div className="text-center">
              <span className="block text-5xl font-black text-leao-amarelo font-barlow leading-none">
                {atleta.resultados.length}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 block">
                Torneios
              </span>
            </div>
          </div>
        </div>

        {/* LISTA DE ATUAÇÕES */}

        <h2 className="text-leao-amarelo font-barlow text-3xl uppercase font-bold mb-6 flex items-center gap-3">
          Últimas <span className="text-leao-vermelho">Atuações</span>
        </h2>

        <div className="flex flex-col gap-4">
          {atleta.resultados.map((resultado) => {
            const saldo = resultado.golsPro - resultado.golsContra;
            const aproveitamento =
              resultado.jogos > 0
                ? (
                    ((resultado.vitorias * 3 + resultado.empates) /
                      (resultado.jogos * 3)) *
                    100
                  ).toFixed(1)
                : "0.0";
            const mediaPro =
              resultado.jogos > 0
                ? (resultado.golsPro / resultado.jogos).toFixed(2)
                : "0.00";
            const mediaContra =
              resultado.jogos > 0
                ? (resultado.golsContra / resultado.jogos).toFixed(2)
                : "0.00";

            return (
              <div
                key={resultado.id}
                className="bg-[#111] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <strong className="text-leao-vermelho text-xl uppercase font-barlow block mb-1">
                      {resultado.campeonato.nome}
                    </strong>
                    <span className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-2">
                      📅{" "}
                      {new Date(resultado.campeonato.data).toLocaleDateString(
                        "pt-BR",
                        { timeZone: "UTC" }
                      )}
                      {resultado.colocacao === 1 && (
                        <span className="text-leao-amarelo flex items-center gap-1 ml-2">
                          🏆 CAMPEÃO
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-4xl font-black font-barlow leading-none ${
                        resultado.colocacao === 1
                          ? "text-leao-amarelo"
                          : "text-white"
                      }`}
                    >
                      {resultado.colocacao}º
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold block">
                      Lugar
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-10 gap-y-4 gap-x-2 text-center border-t border-zinc-900 pt-4">
                  <div>
                    <span className="text-white font-bold font-mono text-lg block">
                      {resultado.jogos}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      J
                    </span>
                  </div>
                  <div>
                    <span className="text-green-500 font-bold font-mono text-lg block">
                      {resultado.vitorias}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      V
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-bold font-mono text-lg block">
                      {resultado.empates}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      E
                    </span>
                  </div>
                  <div>
                    <span className="text-red-500 font-bold font-mono text-lg block">
                      {resultado.derrotas}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      D
                    </span>
                  </div>
                  <div className="hidden md:block w-px bg-zinc-800 mx-auto h-full"></div>
                  <div>
                    <span className="text-zinc-300 font-mono text-lg block">
                      {resultado.golsPro}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      GP
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-300 font-mono text-lg block">
                      {resultado.golsContra}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      GC
                    </span>
                  </div>
                  <div>
                    <span className="text-white font-bold font-mono text-lg block">
                      {saldo}
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">
                      SG
                    </span>
                  </div>
                  <div className="hidden md:block w-px bg-zinc-800 mx-auto h-full"></div>
                  <div className="col-span-4 md:col-span-2 flex justify-between md:justify-around px-4 md:px-0">
                    <div className="text-center">
                      <span className="text-white font-bold font-mono text-lg block">
                        {aproveitamento}%
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase font-bold">
                        A%
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-zinc-400 font-mono text-lg block">
                        {mediaPro}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase font-bold">
                        MG+
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-zinc-400 font-mono text-lg block">
                        {mediaContra}
                      </span>
                      <span className="text-[9px] text-zinc-600 uppercase font-bold">
                        MG-
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {atleta.resultados.length === 0 && (
            <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 font-bold uppercase">
              Este atleta ainda não disputou partidas nesta temporada.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
