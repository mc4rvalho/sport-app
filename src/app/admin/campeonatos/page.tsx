import { prisma } from "@/lib/prisma";
import { salvarCampeonato, excluirCampeonato } from "./actions";
import Link from "next/link";

export default async function AdminCampeonatos({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const campeonatos = await prisma.campeonato.findMany({
    orderBy: { data: "desc" },
  });
  const campEditando = editId ? campeonatos.find((c) => c.id === editId) : null;

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
            Campeonatos
          </h1>
        </div>

        {/* FORMULÁRIO PADRONIZADO */}
        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            campEditando ? "bg-yellow-900/10 border-yellow-700" : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {campEditando
                ? `✏️ Editando: ${campEditando.nome}`
                : "🏆 Nova Competição"}
            </h3>
            {campEditando && (
              <Link
                href="/admin/campeonatos"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar
              </Link>
            )}
          </div>

          <form
            action={salvarCampeonato}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end"
          >
            <input type="hidden" name="id" value={campEditando?.id || ""} />

            {/* INPUT NOME */}
            <div className="lg:col-span-1">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Nome do Torneio
              </label>
              <input
                name="nome"
                defaultValue={campEditando?.nome}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all"
                placeholder="Ex: IV Copa Leão"
              />
            </div>

            {/* INPUT DATA */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Data de Início
              </label>
              <input
                name="data"
                type="date"
                defaultValue={
                  campEditando
                    ? new Date(campEditando.data).toISOString().split("T")[0]
                    : ""
                }
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all scheme-dark"
              />
            </div>

            {/* INPUT TIPO (Atualizado) */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Tipo de Competição
              </label>
              <select
                name="tipo"
                defaultValue={campEditando?.tipo || "INTERNO"}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all cursor-pointer"
              >
                <option value="INTERNO">Interno</option>
                <option value="COPA PE">Copa Pernambuco</option>
                <option value="ETAPA PE">Etapa Pernambucana</option>
                <option value="TGR">TGR (Taça Grande Recife)</option>
              </select>
            </div>

            {/* BOTÃO PADRONIZADO (Igual Resultados) */}
            <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
              <button
                type="submit"
                className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
              >
                {campEditando ? "Salvar Alterações" : "Criar Campeonato"}
              </button>
            </div>
          </form>
        </div>

        {/* LISTA DE CAMPEONATOS */}
        <div className="flex flex-col gap-3">
          {campeonatos.map((camp) => (
            <div
              key={camp.id}
              className="bg-[#111] border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border border-zinc-800 ${
                    camp.tipo.includes("PE")
                      ? "bg-blue-900/20 text-blue-400"
                      : "bg-zinc-900 text-gray-400"
                  }`}
                >
                  {camp.tipo.includes("PE") ? "🏆" : "⚽"}
                </div>
                <div>
                  <strong className="text-white block text-lg uppercase font-barlow leading-none mb-1">
                    {camp.nome}
                  </strong>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-zinc-800">
                      {camp.tipo}
                    </span>
                    <span className="text-[10px] text-zinc-500 py-0.5 font-bold uppercase tracking-wider">
                      📅 {new Date(camp.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/campeonatos?editId=${camp.id}`}
                  className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded hover:bg-zinc-700 transition-colors"
                >
                  ✏️
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await excluirCampeonato(camp.id);
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
