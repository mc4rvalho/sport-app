import { prisma } from "@/lib/prisma";
import { salvarBotonista, excluirBotonista } from "./actions";
import Link from "next/link";

export default async function AdminBotonistas() {
  // Busca todos os jogadores ordenados por nome
  const botonistas = await prisma.botonista.findMany({
    orderBy: { nome: "asc" },
  });

  return (
    <div>
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

      {/* FORMULÁRIO DE CADASTRO RÁPIDO */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-zinc-800 mb-10">
        <h3 className="text-white font-bold uppercase mb-4 border-b border-zinc-700 pb-2">
          Novo Contratado
        </h3>
        <form
          action={salvarBotonista}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
              Nome do Atleta
            </label>
            <input
              name="nome"
              required
              className="w-full bg-black border border-zinc-700 text-white p-2 rounded"
              placeholder="Ex: Carlinhos Bala"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">
              Categoria
            </label>
            <select
              name="categoria"
              className="w-full bg-black border border-zinc-700 text-white p-2 rounded"
            >
              <option value="ADULTO">Adulto</option>
              <option value="MASTER">Master</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-(--leao-verde) text-white font-bold uppercase p-2 rounded hover:brightness-110 transition-all cursor-pointer"
          >
            + Adicionar
          </button>

          {/* Campo oculto para foto (opcional por enquanto) */}
          <input type="hidden" name="fotoUrl" value="" />
        </form>
      </div>

      {/* LISTA DE JOGADORES */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {botonistas.map((jogador) => (
          <div
            key={jogador.id}
            className="bg-[#111] border border-zinc-800 p-4 rounded text-center relative group hover:border-(--leao-amarelo) transition-colors"
          >
            {/* Botão de Excluir (Só aparece no hover) */}
            <form
              action={async () => {
                "use server";
                await excluirBotonista(jogador.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button className="text-red-500 hover:text-red-400 text-xs font-bold border border-red-900 bg-red-900/20 px-2 py-1 rounded cursor-pointer">
                X
              </button>
            </form>

            {/* CORREÇÃO AQUI: leading-15 em vez de leading-[60px] */}
            <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-3 overflow-hidden border-2 border-zinc-700">
              {jogador.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={jogador.fotoUrl}
                  alt={jogador.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl leading-15">👤</span>
              )}
            </div>

            <strong className="text-white block uppercase text-sm truncate">
              {jogador.nome}
            </strong>
            <span className="text-xs text-gray-500 uppercase">
              {jogador.categoria}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
