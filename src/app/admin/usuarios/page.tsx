import { prisma } from "@/lib/prisma";
import { salvarUsuario, excluirUsuario } from "./actions";
import Link from "next/link";

function formatarFoto(url: string | null | undefined) {
  if (!url) return "";
  if (url.includes("drive.google.com") && url.includes("/file/d/")) {
    try {
      const id = url.split("/file/d/")[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w200`;
    } catch {
      return url;
    }
  }
  return url;
}

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    include: { botonista: true },
  });

  const userEdit = editId ? usuarios.find((u) => u.id === editId) : null;

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
            Controle de Acesso
          </h1>
        </div>

        <div
          className={`p-8 rounded-xl border border-zinc-800 mb-12 shadow-xl ${
            userEdit ? "bg-yellow-900/10 border-yellow-700" : "bg-[#141414]"
          }`}
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-700 pb-4">
            <h3 className="text-white font-bold uppercase text-lg flex items-center gap-2">
              {userEdit ? `✏️ Editando: ${userEdit.nome}` : "👤 Novo Usuário"}
            </h3>
            {userEdit && (
              <Link
                href="/admin/usuarios"
                className="text-xs text-red-400 hover:underline uppercase font-bold"
              >
                Cancelar Edição
              </Link>
            )}
          </div>

          <form
            action={salvarUsuario}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end"
          >
            <input type="hidden" name="id" value={userEdit?.id || ""} />

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Nome Completo
              </label>
              <input
                name="nome"
                defaultValue={userEdit?.nome}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                E-mail de Login
              </label>
              <input
                name="email"
                type="email"
                defaultValue={userEdit?.email}
                required
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder="joao@sport.com"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Senha de Acesso
              </label>
              <input
                name="senha"
                type="password"
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all placeholder:text-zinc-700"
                placeholder={
                  userEdit ? "Deixe em branco para manter a atual" : "******"
                }
                required={!userEdit}
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-2 tracking-wider">
                Nível de Permissão
              </label>
              <select
                name="role"
                defaultValue={userEdit?.role || "USER"}
                className="w-full bg-black border border-zinc-800 text-white p-3 rounded-lg focus:border-(--leao-amarelo) outline-none transition-all cursor-pointer"
              >
                <option value="USER">Atleta (Apenas visualiza)</option>
                <option value="ADMIN">Diretor (Acesso Total)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <button
                type="submit"
                className="w-full md:w-auto bg-black text-(--leao-amarelo) border-2 border-(--leao-amarelo) font-black uppercase px-8 py-3 rounded-lg hover:bg-(--leao-vermelho) hover:text-white hover:border-(--leao-vermelho) transition-all cursor-pointer shadow-lg tracking-widest"
              >
                {userEdit ? "Salvar Alterações" : "Criar Login"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((user) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dadosBotonista = user.botonista as any;
            const fotoVinculada = Array.isArray(dadosBotonista)
              ? dadosBotonista[0]?.fotoUrl
              : dadosBotonista?.fotoUrl;

            const avatarUrl = formatarFoto(fotoVinculada);

            return (
              <div
                key={user.id}
                className={`bg-[#111] border p-5 rounded-xl flex items-center gap-4 group transition-all hover:-translate-y-1 ${
                  userEdit?.id === user.id
                    ? "border-(--leao-amarelo) bg-yellow-900/10"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 ${
                    user.role === "ADMIN"
                      ? "border-red-900"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className={`text-xl font-bold ${
                        user.role === "ADMIN" ? "text-red-500" : "text-zinc-500"
                      }`}
                    >
                      {user.nome.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-white block uppercase truncate font-barlow text-lg leading-none">
                      {user.nome}
                    </strong>
                    {user.role === "ADMIN" && (
                      <span className="text-[9px] bg-red-900 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 block truncate font-mono">
                    {user.email}
                  </span>

                  {fotoVinculada ? (
                    <span className="text-[9px] text-(--leao-verde) flex items-center gap-1 mt-1 font-bold uppercase">
                      ● Atleta Vinculado
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-700 flex items-center gap-1 mt-1 font-bold uppercase">
                      ○ Apenas Usuário
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/admin/usuarios?editId=${user.id}`}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded text-center transition-colors border border-zinc-800"
                  >
                    Editar
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await excluirUsuario(user.id);
                    }}
                  >
                    <button className="bg-red-900/10 hover:bg-red-900 text-red-700 hover:text-white text-[10px] uppercase font-bold px-3 py-2 rounded w-full transition-colors cursor-pointer border border-red-900/20 hover:border-red-900">
                      Excluir
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
