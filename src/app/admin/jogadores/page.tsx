import { prisma } from "@/lib/prisma";
import { salvarBotonista, excluirBotonista } from "./actions";
import Link from "next/link";

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

  const jogadores = await prisma.botonista.findMany({
    orderBy: { nome: "asc" },
    include: { usuario: true },
  });

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

        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            jogadorEditando
              ? "bg-yellow-900/10 border-yellow-700"
              : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {jogadorEditando
                ? `✏️ Editando: ${jogadorEditando.nome}`
                : "➕ Novo Contratado"}
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
            <input type="hidden" name="id" value={jogadorEditando?.id || ""} />

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Nome do Atleta
              </label>
              <input
                name="nome"
                defaultValue={jogadorEditando?.nome}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="Nome Completo"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Categoria
              </label>
              <select
                name="categoria"
                defaultValue={jogadorEditando?.categoria || "ADULTO"}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all cursor-pointer"
              >
                <option value="ADULTO">Adulto</option>
                <option value="MASTER">Master</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                URL da Foto (Google Drive)
              </label>
              <input
                name="fotoUrl"
                defaultValue={jogadorEditando?.fotoUrl || ""}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="md:col-span-2 bg-zinc-900/50 p-5 rounded-lg border border-zinc-800 border-dashed mt-2">
              <label className="text-xs text-(--leao-amarelo) uppercase font-bold block mb-2 tracking-wider">
                🔐 Vincular Login (Área do Atleta)
              </label>
              <p className="text-[10px] text-zinc-500 mb-3">
                Digite o e-mail do usuário cadastrado para que ele veja este
                perfil ao clicar em &quot;Meu Perfil&quot;.
              </p>
              <input
                name="emailVinculo"
                defaultValue={jogadorEditando?.usuario?.email || ""}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="Ex: email@jogador.com"
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
              >
                {jogadorEditando ? "Salvar Alterações" : "Contratar Atleta"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jogadores.map((j) => {
            const avatarUrl = formatarFoto(j.fotoUrl);

            return (
              <div
                key={j.id}
                className={`bg-[#111] border p-4 rounded-xl flex items-center gap-4 group transition-colors ${
                  jogadorEditando?.id === j.id
                    ? "border-(--leao-amarelo) bg-yellow-900/10"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-900 shrink-0 flex items-center justify-center">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-zinc-600">👤</span>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <strong className="text-white block uppercase truncate font-barlow text-lg">
                    {j.nome}
                  </strong>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {j.categoria}
                  </span>
                  {j.usuario ? (
                    <div className="text-[9px] text-green-500 flex items-center gap-1 mt-1 font-mono font-bold">
                      🔗 {j.usuario.email}
                    </div>
                  ) : (
                    <div className="text-[9px] text-zinc-600 mt-1 block font-mono">
                      Sem vínculo
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/jogadores?editId=${j.id}`}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded text-center transition-colors"
                  >
                    Editar
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await excluirBotonista(j.id);
                    }}
                  >
                    <button className="bg-red-900/20 hover:bg-red-900 text-red-500 hover:text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded w-full transition-colors cursor-pointer">
                      Demitir
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
