import { prisma } from "@/lib/prisma";

// Esta função roda no SERVIDOR. Nada de API externa!
async function getDashboardData() {
  // 1. Próximo Campeonato
  const proximoCamp = await prisma.campeonato.findFirst({
    where: { data: { gte: new Date() } },
    orderBy: { data: "asc" },
  });

  // 2. Últimos Jogos (Buscando Resultados)
  const ultimosJogos = await prisma.resultado.findMany({
    take: 5,
    orderBy: { id: "desc" },
    include: { botonista: true, campeonato: true },
  });

  return { proximoCamp, ultimosJogos };
}

export default async function Home() {
  const dados = await getDashboardData();

  return (
    <div className="min-h-screen">
      {/* BANNER HERO */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ilha_do_Retiro_-_Sport_x_Botafogo.jpg/1200px-Ilha_do_Retiro_-_Sport_x_Botafogo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full py-20 text-center border-b-4 border-(--leao-vermelho)"
      >
        <h3 className="text-white tracking-[4px] text-xl mb-4 font-bold">
          PRÓXIMO COMPROMISSO
        </h3>

        {dados.proximoCamp ? (
          <div>
            <h1 className="text-6xl font-bold text-(--leao-amarelo) drop-shadow-md my-4">
              {dados.proximoCamp.data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </h1>
            <div className="text-3xl font-bold uppercase text-white">
              {dados.proximoCamp.nome}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic">Aguardando calendário...</div>
        )}
      </div>

      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-center text-3xl font-bold text-(--leao-amarelo) mb-10 border-b border-gray-800 pb-4">
          Painel do Sport
        </h2>

        {/* LISTA DE JOGOS */}
        <div className="grid gap-4">
          <h3 className="text-xl text-white font-bold border-l-4 border-(--leao-vermelho) pl-3">
            ÚLTIMOS RESULTADOS
          </h3>

          {dados.ultimosJogos.length === 0 ? (
            <p className="text-gray-500">Nenhum jogo registrado.</p>
          ) : (
            dados.ultimosJogos.map((jogo) => (
              <div
                key={jogo.id}
                className="bg-zinc-900 p-4 rounded border border-zinc-800 flex justify-between items-center"
              >
                <div>
                  <strong className="text-white block uppercase">
                    {jogo.botonista.nome}
                  </strong>
                  <span className="text-gray-500 text-sm">
                    {jogo.campeonato.nome}
                  </span>
                </div>
                <div className="text-2xl font-bold text-(--leao-amarelo)">
                  {jogo.colocacao}º
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
