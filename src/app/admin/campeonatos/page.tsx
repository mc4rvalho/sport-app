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
          <Link href="/admin" className="text-2xl hover:scale-110">
            ⬅️
          </Link>
          <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
            Campeonatos
          </h1>
        </div>

        <div
          className={`bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800 mb-10 ${
            campEditando ? "border-yellow-600 bg-yellow-900/10" : ""
          }`}
        >
          <h3 className="text-white font-bold uppercase mb-4 border-b border-zinc-700 pb-2">
            {campEditando
              ? `Editando: ${campEditando.nome}`
              : "🏆 Nova Competição"}
          </h3>
          <form
            action={salvarCampeonato}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <input type="hidden" name="id" value={campEditando?.id || ""} />

            <div className="md:col-span-2">
              <label className="label-admin">Nome do Torneio</label>
              <input
                name="nome"
                defaultValue={campEditando?.nome}
                required
                className="input-admin"
                placeholder="Ex: IV Copa Leão"
              />
            </div>

            <div>
              <label className="label-admin">Data de Início</label>
              <input
                name="data"
                type="date"
                defaultValue={
                  campEditando
                    ? new Date(campEditando.data).toISOString().split("T")[0]
                    : ""
                }
                required
                className="input-admin"
              />
            </div>

            <div>
              <label className="label-admin">Tipo</label>
              <select
                name="tipo"
                defaultValue={campEditando?.tipo || "INTERNO"}
                className="input-admin"
              >
                <option value="INTERNO">Interno (Peso 1)</option>
                <option value="COPA">Copa/Etapa (Peso 2)</option>
              </select>
            </div>

            <button
              type="submit"
              className="md:col-start-4 bg-(--leao-verde) text-white font-bold uppercase p-2 rounded hover:brightness-110 h-10.5"
            >
              {campEditando ? "Salvar" : "+ Criar"}
            </button>
          </form>
          {campEditando && (
            <Link
              href="/admin/campeonatos"
              className="text-xs text-red-400 mt-2 block"
            >
              Cancelar Edição
            </Link>
          )}
        </div>

        {/* LISTA */}
        <div className="flex flex-col gap-3">
          {campeonatos.map((camp) => (
            <div
              key={camp.id}
              className="bg-[#111] border border-zinc-800 p-4 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center text-2xl ${
                    camp.tipo === "COPA"
                      ? "bg-yellow-900/30 text-yellow-500"
                      : "bg-zinc-800 text-gray-400"
                  }`}
                >
                  {camp.tipo === "COPA" ? "🏆" : "⚽"}
                </div>
                <div>
                  <strong className="text-white block text-lg uppercase font-barlow">
                    {camp.nome}
                  </strong>
                  <span className="text-xs text-gray-500 uppercase">
                    📅 {new Date(camp.data).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/campeonatos?editId=${camp.id}`}
                  className="bg-zinc-800 px-3 py-2 rounded text-xs font-bold text-white uppercase hover:bg-zinc-700"
                >
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await excluirCampeonato(camp.id);
                  }}
                >
                  <button className="bg-red-900/20 px-3 py-2 rounded text-xs font-bold text-red-500 uppercase hover:bg-red-900/40">
                    Excluir
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
