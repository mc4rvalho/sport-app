import { prisma } from "@/lib/prisma";
import { salvarNoticia, excluirNoticia } from "./actions";
import Link from "next/link";

// Formata URL da imagem (Google Drive ou Link Direto)
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
          <Link
            href="/admin"
            className="text-2xl hover:scale-110 transition-transform"
          >
            ⬅️
          </Link>
          <h1 className="font-barlow text-4xl text-(--leao-amarelo) uppercase font-bold">
            Mural de Notícias
          </h1>
        </div>

        {/* FORMULÁRIO PADRONIZADO */}
        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            itemEdit ? "bg-yellow-900/10 border-yellow-700" : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {itemEdit ? `✏️ Editando Post` : "📰 Nova Publicação"}
            </h3>
            {itemEdit && (
              <Link
                href="/admin/noticias"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar Edição
              </Link>
            )}
          </div>

          <form action={salvarNoticia} className="flex flex-col gap-6">
            <input type="hidden" name="id" value={itemEdit?.id || ""} />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                  Manchete (Título)
                </label>
                <input
                  name="titulo"
                  defaultValue={itemEdit?.titulo}
                  required
                  className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Ex: Vitória no Clássico!"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                  Subtítulo (Resumo)
                </label>
                <input
                  name="subtitulo"
                  defaultValue={itemEdit?.subtitulo || ""}
                  className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Resumo curto da notícia..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
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
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                  Link Externo (Opcional)
                </label>
                <input
                  name="link"
                  defaultValue={itemEdit?.link || ""}
                  className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                  placeholder="Link para matéria completa..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800 w-fit">
              <input
                type="checkbox"
                name="publicada"
                defaultChecked={itemEdit ? itemEdit.publicada : true}
                className="w-5 h-5 accent-(--leao-amarelo) cursor-pointer"
                id="pub"
              />
              <label
                htmlFor="pub"
                className="text-white text-sm font-bold uppercase cursor-pointer select-none"
              >
                Publicar Imediatamente
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
              >
                {itemEdit ? "Atualizar Post" : "Postar Notícia"}
              </button>
            </div>
          </form>
        </div>

        {/* LISTA DE NOTÍCIAS COM FOTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((item) => {
            const imgUrl = formatarImagem(item.imagemUrl);

            return (
              <div
                key={item.id}
                className={`bg-[#111] border rounded-xl overflow-hidden flex flex-col group transition-all ${
                  itemEdit?.id === item.id
                    ? "border-(--leao-amarelo)"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {/* ÁREA DA IMAGEM */}
                <div className="h-40 bg-zinc-900 relative overflow-hidden">
                  {imgUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-700">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  {/* Status de Publicação */}
                  {!item.publicada && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                      RASCUNHO
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">
                    {new Date(item.data).toLocaleDateString("pt-BR")}
                  </span>
                  <strong className="text-white text-lg font-barlow leading-tight mb-2 line-clamp-2">
                    {item.titulo}
                  </strong>
                  <p className="text-zinc-500 text-xs line-clamp-2 mb-4 flex-1">
                    {item.subtitulo}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                    <Link
                      href={`/admin/noticias?editId=${item.id}`}
                      className="text-xs font-bold text-zinc-400 hover:text-white uppercase transition-colors bg-zinc-900 px-3 py-1.5 rounded"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await excluirNoticia(item.id);
                      }}
                    >
                      <button className="text-xs font-bold text-red-900 hover:text-red-500 uppercase transition-colors px-2">
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
