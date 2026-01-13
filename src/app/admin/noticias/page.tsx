import { prisma } from "@/lib/prisma";
import { salvarNoticia, excluirNoticia } from "./actions";
import Link from "next/link";

export default async function AdminNoticias({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const noticias = await prisma.noticia.findMany({ orderBy: { data: "desc" } });
  const itemEdit = editId ? noticias.find((n) => n.id === editId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-2xl hover:scale-110">
            ⬅️
          </Link>
          <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
            Mural de Notícias
          </h1>
        </div>

        <div
          className={`bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800 mb-10 ${
            itemEdit ? "border-yellow-600 bg-yellow-900/10" : ""
          }`}
        >
          <h3 className="text-white font-bold uppercase mb-4 border-b border-zinc-700 pb-2">
            {itemEdit ? "Editando Post" : "Nova Publicação"}
          </h3>
          <form action={salvarNoticia} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={itemEdit?.id || ""} />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-admin">Manchete</label>
                <input
                  name="titulo"
                  defaultValue={itemEdit?.titulo}
                  required
                  className="input-admin"
                  placeholder="Ex: Vitória no Clássico!"
                />
              </div>
              <div>
                <label className="label-admin">Subtítulo</label>
                <input
                  name="subtitulo"
                  defaultValue={itemEdit?.subtitulo || ""}
                  className="input-admin"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-admin">URL Imagem</label>
                <input
                  name="imagemUrl"
                  defaultValue={itemEdit?.imagemUrl || ""}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="label-admin">Link Externo</label>
                <input
                  name="link"
                  defaultValue={itemEdit?.link || ""}
                  className="input-admin"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="publicada"
                defaultChecked={itemEdit ? itemEdit.publicada : true}
                className="w-4 h-4 accent-(--leao-amarelo)"
              />
              <label className="text-white text-sm">
                Publicar Imediatamente
              </label>
            </div>
            <button
              type="submit"
              className="bg-(--leao-verde) text-white font-bold uppercase p-3 rounded hover:brightness-110 w-full md:w-auto self-end"
            >
              {itemEdit ? "Atualizar Post" : "+ Postar"}
            </button>
          </form>
          {itemEdit && (
            <Link
              href="/admin/noticias"
              className="text-xs text-red-400 mt-2 block"
            >
              Cancelar
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((item) => (
            <div
              key={item.id}
              className="bg-[#111] border border-zinc-800 rounded-lg overflow-hidden flex flex-col"
            >
              <div className="p-4 flex-1">
                <span className="text-xs text-gray-500">
                  {new Date(item.data).toLocaleDateString("pt-BR")}
                </span>
                <strong className="text-white block mb-2">{item.titulo}</strong>
              </div>
              <div className="bg-zinc-900 p-3 flex justify-between">
                <Link
                  href={`/admin/noticias?editId=${item.id}`}
                  className="text-xs text-zinc-400 uppercase font-bold hover:text-white"
                >
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await excluirNoticia(item.id);
                  }}
                >
                  <button className="text-xs text-red-500 uppercase font-bold hover:text-red-400">
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
