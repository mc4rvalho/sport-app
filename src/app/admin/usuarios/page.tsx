import { prisma } from "@/lib/prisma";
import { salvarUsuario, excluirUsuario } from "./actions";
import Link from "next/link";

export default async function AdminUsuarios({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>;
}) {
  const params = await searchParams;
  const editId = params.editId;

  const usuarios = await prisma.usuario.findMany({ orderBy: { nome: "asc" } });
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

        {/* FORMULÁRIO */}
        <div
          className={`p-6 rounded-lg border border-zinc-800 mb-10 ${
            userEdit ? "bg-yellow-900/10 border-yellow-700" : "bg-[#1a1a1a]"
          }`}
        >
          <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-2">
            <h3 className="text-white font-bold uppercase">
              {userEdit ? `✏️ Editando: ${userEdit.nome}` : "+ Novo Usuário"}
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
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                Nome Completo
              </label>
              <input
                name="nome"
                defaultValue={userEdit?.nome}
                required
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                E-mail de Login
              </label>
              <input
                name="email"
                type="email"
                defaultValue={userEdit?.email}
                required
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder="joao@sport.com"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                Senha de Acesso
              </label>
              <input
                name="senha"
                type="password"
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
                placeholder={
                  userEdit ? "Deixe em branco para manter a atual" : "******"
                }
                required={!userEdit}
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
                Nível de Permissão
              </label>
              <select
                name="role"
                defaultValue={userEdit?.role || "USER"}
                className="w-full bg-black border border-zinc-700 text-white p-3 rounded focus:border-(--leao-amarelo) outline-none"
              >
                <option value="USER">Atleta (Apenas visualiza)</option>
                <option value="ADMIN">Diretor (Acesso Total)</option>
              </select>
            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-(--leao-verde) text-white font-bold uppercase p-4 rounded hover:brightness-110 transition-all cursor-pointer"
            >
              {userEdit ? "💾 Salvar Alterações" : "👤 Criar Login"}
            </button>
          </form>
        </div>

        {/* LISTA DE USUÁRIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((user) => (
            <div
              key={user.id}
              className={`bg-[#111] border p-4 rounded flex items-center gap-4 group transition-colors ${
                userEdit?.id === user.id
                  ? "border-(--leao-amarelo) bg-yellow-900/10"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${
                  user.role === "ADMIN"
                    ? "bg-red-900 text-red-100"
                    : "bg-zinc-800 text-gray-400"
                }`}
              >
                {user.nome.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 overflow-hidden">
                <strong className="text-white block uppercase truncate">
                  {user.nome}
                </strong>
                <span className="text-xs text-zinc-500 block truncate">
                  {user.email}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${
                    user.role === "ADMIN"
                      ? "bg-(--leao-amarelo) text-black"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {user.role === "ADMIN" ? "Admin" : "User"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/admin/usuarios?editId=${user.id}`}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded text-center"
                >
                  Editar
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await excluirUsuario(user.id);
                  }}
                >
                  <button className="bg-red-900/30 hover:bg-red-900 text-red-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded w-full">
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
