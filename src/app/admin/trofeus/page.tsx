import { prisma } from "@/lib/prisma";
import { salvarConquista, excluirConquista } from "./actions";
import Link from "next/link";

function formatarImagem(url: string | null) {
  if (!url) return "";
  if (url.includes("drive.google.com") && url.includes("/file/d/")) {
    try {
      const id = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    } catch {
      return url;
    }
  }
  return url;
}

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
          <Link
            href="/admin"
            className="text-2xl hover:scale-110 transition-transform"
          >
            ⬅️
          </Link>
          <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
            Sala de Troféus
          </h1>
        </div>

        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            itemEdit ? "bg-yellow-900/10 border-yellow-700" : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {itemEdit ? `✏️ Editando Taça` : "🏆 Adicionar Taça"}
            </h3>
            {itemEdit && (
              <Link
                href="/admin/trofeus"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar Edição
              </Link>
            )}
          </div>

          <form
            action={salvarConquista}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
            <input type="hidden" name="id" value={itemEdit?.id || ""} />

            <div className="md:col-span-2">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Nome da Conquista
              </label>
              <input
                name="nome"
                defaultValue={itemEdit?.nome}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="Ex: Campeão Pernambucano"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Ano
              </label>
              <input
                name="ano"
                defaultValue={itemEdit?.ano}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="2026"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Tipo
              </label>
              <select
                name="tipo"
                defaultValue={itemEdit?.tipo}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all cursor-pointer"
              >
                <option value="ESTADUAL">Estadual</option>
                <option value="REGIONAL">Regional</option>
                <option value="NACIONAL">Nacional</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                URL da Imagem
              </label>
              <input
                name="imagemUrl"
                defaultValue={itemEdit?.imagemUrl || ""}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
            >
              {itemEdit ? "Salvar" : "+ Adicionar"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {conquistas.map((item) => {
            const imgUrl = formatarImagem(item.imagemUrl);

            return (
              <div
                key={item.id}
                className={`bg-[#111] border rounded-xl p-4 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 relative ${
                  itemEdit?.id === item.id
                    ? "border-(--leao-amarelo)"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div className="h-32 w-full flex items-center justify-center mb-4 bg-zinc-900/50 rounded-lg overflow-hidden">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt=""
                      className="h-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <span className="text-5xl grayscale opacity-30">🏆</span>
                  )}
                </div>

                <strong className="text-white text-sm font-barlow uppercase leading-tight min-h-10 flex items-center justify-center mb-1">
                  {item.nome}
                </strong>

                <span className="text-(--leao-amarelo) font-black text-2xl">
                  {item.ano}
                </span>

                <span className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded uppercase font-bold mt-2 border border-zinc-800">
                  {item.tipo}
                </span>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-lg p-1 backdrop-blur-sm border border-zinc-800">
                  <Link
                    href={`/admin/trofeus?editId=${item.id}`}
                    className="p-1.5 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await excluirConquista(item.id);
                    }}
                  >
                    <button
                      className="p-1.5 hover:bg-red-900/50 rounded text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
