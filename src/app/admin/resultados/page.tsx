import { prisma } from "@/lib/prisma";
import { salvarResultado, excluirResultado } from "./actions";
import Link from "next/link";

export default async function AdminResultados() {
  // 1. Busca dados para os selects (combobox)
  const campeonatos = await prisma.campeonato.findMany({
    orderBy: { data: "desc" },
  });
  const botonistas = await prisma.botonista.findMany({
    orderBy: { nome: "asc" },
  });

  // 2. Busca os últimos lançamentos para conferência
  const ultimosResultados = await prisma.resultado.findMany({
    take: 10, // Só os 10 últimos
    orderBy: { data: "desc" },
    include: { botonista: true, campeonato: true },
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin"
          className="text-2xl hover:scale-110 transition-transform"
        >
          ⬅️
        </Link>
        <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
          Lançar Súmula
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* === COLUNA DA ESQUERDA: FORMULÁRIO === */}
        <div className="lg:col-span-1 bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800 h-fit sticky top-4">
          <h3 className="text-white font-bold uppercase mb-6 border-b border-zinc-700 pb-2">
            Registrar Desempenho
          </h3>

          <form action={salvarResultado} className="flex flex-col gap-4">
            {/* Seleção de Campeonato e Jogador */}
            <div>
              <label className="label-admin">Campeonato</label>
              <select name="campeonatoId" className="input-admin" required>
                <option value="">Selecione...</option>
                {campeonatos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-admin">Atleta</label>
              <select name="botonistaId" className="input-admin" required>
                <option value="">Selecione...</option>
                {botonistas.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Posição Final */}
            <div>
              <label className="label-admin text-(--leao-amarelo)">
                Colocação Final (Ranking)
              </label>
              <input
                name="colocacao"
                type="number"
                min="1"
                className="input-admin border-yellow-900/50 focus:border-yellow-500"
                placeholder="Ex: 1 para Campeão"
                required
              />
            </div>

            <div className="border-t border-zinc-800 my-2"></div>

            {/* Estatísticas (Grid 3 colunas) */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <label className="text-[10px] uppercase font-bold text-green-500">
                  Vitórias
                </label>
                <input
                  name="vitorias"
                  type="number"
                  className="input-admin text-center"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">
                  Empates
                </label>
                <input
                  name="empates"
                  type="number"
                  className="input-admin text-center"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-red-500">
                  Derrotas
                </label>
                <input
                  name="derrotas"
                  type="number"
                  className="input-admin text-center"
                  defaultValue="0"
                />
              </div>
            </div>

            {/* Gols (Grid 2 colunas) */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <label className="text-[10px] uppercase font-bold text-white">
                  Gols Pró
                </label>
                <input
                  name="golsPro"
                  type="number"
                  className="input-admin text-center"
                  defaultValue="0"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-white">
                  Gols Contra
                </label>
                <input
                  name="golsContra"
                  type="number"
                  className="input-admin text-center"
                  defaultValue="0"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-(--leao-verde) text-white font-bold uppercase p-3 rounded hover:brightness-110 transition-all cursor-pointer"
            >
              💾 Salvar Resultado
            </button>
          </form>
        </div>

        {/* === COLUNA DA DIREITA: HISTÓRICO RECENTE === */}
        <div className="lg:col-span-2">
          <h3 className="text-white font-barlow text-xl uppercase mb-4 pl-2 border-l-4 border-(--leao-vermelho)">
            Últimos Lançamentos
          </h3>

          <div className="flex flex-col gap-2">
            {ultimosResultados.map((item) => (
              <div
                key={item.id}
                className="bg-[#111] border border-zinc-800 p-3 rounded flex justify-between items-center text-sm hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 text-white font-bold w-8 h-8 flex items-center justify-center rounded">
                    {item.colocacao}º
                  </div>
                  <div>
                    <strong className="text-white block uppercase">
                      {item.botonista.nome}
                    </strong>
                    <span className="text-xs text-gray-500">
                      {item.campeonato.nome}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="text-green-500 font-bold">
                      {item.vitorias}V
                    </span>
                    <span>{item.empates}E</span>
                    <span className="text-red-500">{item.derrotas}D</span>
                  </div>

                  <form
                    action={async () => {
                      "use server";
                      await excluirResultado(item.id);
                    }}
                  >
                    <button
                      className="text-red-900 hover:text-red-500 transition-colors p-1"
                      title="Apagar lançamento"
                    >
                      🗑️
                    </button>
                  </form>
                </div>
              </div>
            ))}

            {ultimosResultados.length === 0 && (
              <p className="text-gray-600 italic p-4">
                Nenhum resultado lançado ainda.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
