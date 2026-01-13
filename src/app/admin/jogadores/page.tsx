import { prisma } from "@/lib/prisma";
import { salvarBotonista, excluirBotonista } from "./actions";
import Link from "next/link";

// Formata URL de foto (CORRIGIDO PARA LINK DIRETO)
function formatarFoto(url: string | null) {
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

export default async function AdminJogadores({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  // Busca jogadores
  const jogadores = await prisma.botonista.findMany({
    orderBy: { nome: "asc" },
    include: { usuario: true },
  });

  // Se tiver editId, busca o jogador específico para preencher o form
  const jogadorEditando = editId
    ? jogadores.find((j) => j.id === editId)
    : null;

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
            Gerenciar Elenco
          </h1>
        </div>

        {/* FORMULÁRIO (Criação ou Edição) */}
        <div
          className={`p-6 rounded-lg border border-zinc-800 mb-10 ${
            jogadorEditando
              ? "bg-yellow-900/10 border-yellow-700"
              : "bg-[#1a1a1a]"
          }`}
        >
          <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-2">
            <h3 className="text-white font-bold uppercase">
              {jogadorEditando
                ? `✏️ Editando: ${jogadorEditando.nome}`
                : "+ Novo Contratado"}
            </h3>
            {jogadorEditando && (
              <Link
                href="/admin/jogadores"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar Edição
              </Link>
            )}
          </div>

          <form
            action={salvarBotonista}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
          >
            {/* Campo Oculto ID (para edição) */}
            <input type="hidden" name="id" value={jogadorEditando?.id || ""} />

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                Nome do Atleta
              </label>
              <input
                name="nome"
                defaultValue={jogadorEditando?.nome}
                required
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder="Nome Completo"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                Categoria
              </label>
              <select
                name="categoria"
                defaultValue={jogadorEditando?.categoria || "ADULTO"}
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
              >
                <option value="ADULTO">Adulto</option>
                <option value="MASTER">Master</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                URL da Foto (Perfil)
              </label>
              <input
                name="fotoUrl"
                defaultValue={jogadorEditando?.fotoUrl || ""}
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder="https://drive.google.com/..."
              />
            </div>

            {/* VINCULAR USUÁRIO */}
            <div className="md:col-span-2 bg-zinc-900 p-4 rounded border border-zinc-800">
              <label className="text-xs text-(--leao-amarelo) uppercase font-bold block mb-1">
                🔐 Vincular Login (Área do Atleta)
              </label>
              {/* CORREÇÃO: Usando &quot; para aspas duplas, que é o padrão seguro do HTML */}
              <p className="text-[10px] text-gray-500 mb-2">
                Digite o e-mail do usuário cadastrado para que ele veja este
                perfil ao clicar em &quot;Meu Perfil&quot;.
              </p>
              <input
                name="emailVinculo"
                defaultValue={jogadorEditando?.usuario?.email || ""}
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder="Ex: email@jogador.com"
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-(--leao-verde) text-white font-bold uppercase p-4 rounded hover:brightness-110 transition-all cursor-pointer"
            >
              {jogadorEditando ? "💾 Salvar Alterações" : "📝 Contratar Atleta"}
            </button>
          </form>
        </div>

        {/* LISTA DE JOGADORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jogadores.map((j) => (
            <div
              key={j.id}
              className={`bg-[#111] border p-4 rounded flex items-center gap-4 group transition-colors ${
                jogadorEditando?.id === j.id
                  ? "border-(--leao-amarelo) bg-yellow-900/10"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-900 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formatarFoto(j.fotoUrl)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <strong className="text-white block uppercase truncate">
                  {j.nome}
                </strong>
                <span className="text-xs text-zinc-500 uppercase block">
                  {j.categoria}
                </span>
                {j.usuario ? (
                  <span className="text-[10px] text-green-500 flex items-center gap-1 mt-1">
                    🔗 {j.usuario.email}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-600 mt-1 block">
                    Sem vínculo
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/jogadores?editId=${j.id}`}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded text-center"
                >
                  Editar
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await excluirBotonista(j.id);
                  }}
                >
                  <button className="bg-red-900/30 hover:bg-red-900 text-red-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded w-full">
                    Demitir
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
