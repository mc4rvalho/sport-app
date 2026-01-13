import { prisma } from "@/lib/prisma";
import { salvarConquista, excluirConquista } from "./actions";
import Link from "next/link";

export default async function AdminTrofeus({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const conquistas = await prisma.conquista.findMany({
    orderBy: { ano: "desc" },
  });
  const itemEdit = editId ? conquistas.find((c) => c.id === editId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-2xl hover:scale-110">
            ⬅️
          </Link>
          <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
            Sala de Troféus
          </h1>
        </div>

        <div
          className={`bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800 mb-10 ${
            itemEdit ? "border-yellow-600 bg-yellow-900/10" : ""
          }`}
        >
          <h3 className="text-white font-bold uppercase mb-4 border-b border-zinc-700 pb-2">
            {itemEdit ? "Editando Taça" : "Adicionar Taça"}
          </h3>
          <form
            action={salvarConquista}
            className="grid md:grid-cols-4 gap-4 items-end"
          >
            <input type="hidden" name="id" value={itemEdit?.id || ""} />
            <div className="md:col-span-2">
              <label className="label-admin">Nome</label>
              <input
                name="nome"
                defaultValue={itemEdit?.nome}
                required
                className="input-admin"
                placeholder="Ex: Campeão PE"
              />
            </div>
            <div>
              <label className="label-admin">Ano</label>
              <input
                name="ano"
                defaultValue={itemEdit?.ano}
                required
                className="input-admin"
                placeholder="2026"
              />
            </div>
            <div>
              <label className="label-admin">Tipo</label>
              <select
                name="tipo"
                defaultValue={itemEdit?.tipo}
                className="input-admin"
              >
                <option value="ESTADUAL">Estadual</option>
                <option value="REGIONAL">Regional</option>
                <option value="NACIONAL">Nacional</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="label-admin">URL Foto</label>
              <input
                name="imagemUrl"
                defaultValue={itemEdit?.imagemUrl || ""}
                className="input-admin"
              />
            </div>
            <button
              type="submit"
              className="bg-(--leao-amarelo) text-black font-bold uppercase p-2 rounded hover:brightness-110 h-10.5"
            >
              {itemEdit ? "Salvar" : "+ Adicionar"}
            </button>
          </form>
          {itemEdit && (
            <Link
              href="/admin/trofeus"
              className="text-xs text-red-400 mt-2 block"
            >
              Cancelar
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {conquistas.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-zinc-800 p-4 rounded text-center relative group"
            >
              <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-700">
                <span className="text-3xl">🏆</span>
              </div>
              <strong className="text-white uppercase text-xs block">
                {item.nome}
              </strong>
              <span className="text-(--leao-amarelo) font-bold">
                {item.ano}
              </span>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <Link
                  href={`/admin/trofeus?editId=${item.id}`}
                  className="bg-zinc-800 text-white p-1 rounded text-[10px]"
                >
                  ✏️
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await excluirConquista(item.id);
                  }}
                >
                  <button className="bg-red-900 text-white p-1 rounded text-[10px]">
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
