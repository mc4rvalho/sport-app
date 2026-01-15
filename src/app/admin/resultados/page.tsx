import { prisma } from "@/lib/prisma";
import { salvarResultado, excluirResultado } from "./actions";
import Link from "next/link";

export default async function AdminResultados({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const [resultados, botonistas, campeonatos] = await Promise.all([
    prisma.resultado.findMany({
      orderBy: { data: "desc" },
      include: { botonista: true, campeonato: true },
      take: 50,
    }),
    prisma.botonista.findMany({ orderBy: { nome: "asc" } }),
    prisma.campeonato.findMany({ orderBy: { data: "desc" } }),
  ]);

  const itemEdit = editId ? resultados.find((r) => r.id === editId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
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

        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            itemEdit ? "bg-yellow-900/10 border-yellow-700" : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {itemEdit ? `✏️ Editando Lançamento` : "📝 Novo Resultado"}
            </h3>
            {itemEdit && (
              <Link
                href="/admin/resultados"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar Edição
              </Link>
            )}
          </div>

          <form
            action={salvarResultado}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end"
          >
            <input type="hidden" name="id" value={itemEdit?.id || ""} />

            <div className="col-span-2 md:col-span-3">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Atleta
              </label>
              <select
                name="botonistaId"
                defaultValue={itemEdit?.botonistaId}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none"
                required
              >
                <option value="">Selecione...</option>
                {botonistas.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 md:col-span-3">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Campeonato
              </label>
              <select
                name="campeonatoId"
                defaultValue={itemEdit?.campeonatoId}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none"
                required
              >
                <option value="">Selecione...</option>
                {campeonatos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 md:col-span-6 border-t border-zinc-800 my-2"></div>

            <div>
              <label className="text-xs text-(--leao-amarelo) uppercase font-bold block mb-2 tracking-wider">
                Colocação
              </label>
              <input
                type="number"
                name="colocacao"
                defaultValue={itemEdit?.colocacao || 0}
                className="w-full bg-black border border-zinc-800 text-(--leao-amarelo) font-bold p-3 rounded-lg focus:border-(--leao-amarelo) outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Jogos
              </label>
              <input
                type="number"
                name="jogos"
                defaultValue={itemEdit?.jogos || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-green-500 uppercase font-bold block mb-2 tracking-wider">
                Vitórias
              </label>
              <input
                type="number"
                name="vitorias"
                defaultValue={itemEdit?.vitorias || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Empates
              </label>
              <input
                type="number"
                name="empates"
                defaultValue={itemEdit?.empates || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-zinc-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-red-500 uppercase font-bold block mb-2 tracking-wider">
                Derrotas
              </label>
              <input
                type="number"
                name="derrotas"
                defaultValue={itemEdit?.derrotas || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-red-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-blue-400 uppercase font-bold block mb-2 tracking-wider">
                Gols Pró
              </label>
              <input
                type="number"
                name="golsPro"
                defaultValue={itemEdit?.golsPro || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs text-red-400 uppercase font-bold block mb-2 tracking-wider">
                Gols Contra
              </label>
              <input
                type="number"
                name="golsContra"
                defaultValue={itemEdit?.golsContra || 0}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-red-400 outline-none"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-5 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
              >
                {itemEdit ? "Atualizar Súmula" : "Lançar Resultado"}
              </button>
            </div>
          </form>
        </div>

        <h3 className="text-white font-barlow text-2xl uppercase font-bold mb-4 border-l-4 border-(--leao-vermelho) pl-3">
          Últimos Lançamentos
        </h3>
        <div className="flex flex-col gap-2">
          {resultados.map((r) => (
            <div
              key={r.id}
              className="bg-[#111] border border-zinc-800 p-4 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:border-zinc-600 transition-colors"
            >
              <div className="md:col-span-5 flex items-center gap-4">
                <div className="bg-zinc-900 w-10 h-10 flex items-center justify-center rounded font-bold text-white border border-zinc-800 shrink-0">
                  {r.colocacao}º
                </div>
                <div className="overflow-hidden">
                  <strong className="text-white block uppercase font-barlow truncate">
                    {r.botonista.nome}
                  </strong>
                  <span className="text-zinc-500 text-xs uppercase font-bold truncate block">
                    {r.campeonato.nome}
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-center gap-6 font-mono text-sm">
                <span className="text-green-500 font-bold">{r.vitorias}V</span>
                <span className="text-zinc-500 font-bold">{r.empates}E</span>
                <span className="text-red-500 font-bold">{r.derrotas}D</span>
              </div>

              <div className="md:col-span-3 flex gap-2 justify-end">
                <Link
                  href={`/admin/resultados?editId=${r.id}`}
                  className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded hover:bg-zinc-700 transition-colors"
                >
                  ✏️
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await excluirResultado(r.id);
                  }}
                >
                  <button className="p-2 bg-red-900/20 text-red-500 hover:text-red-400 rounded hover:bg-red-900/40 transition-colors cursor-pointer">
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
