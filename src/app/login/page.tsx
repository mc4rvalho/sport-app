"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import Link from "next/link";

const initialState = {
  erro: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-[#111] p-8 rounded-lg border border-[#333] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-(--leao-vermelho)"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-barlow text-white uppercase font-bold mb-2">
            Acesso Restrito
          </h1>
          <p className="text-gray-500 text-sm">
            Departamento de Futebol de Mesa
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-400 text-xs uppercase font-bold mb-2 ml-1">
              E-mail Oficial
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@sport.com"
              className="w-full bg-[#050505] border border-[#333] text-white p-3 rounded focus:border-(--leao-amarelo) focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase font-bold mb-2 ml-1">
              Senha de Acesso
            </label>
            <input
              name="senha"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#050505] border border-[#333] text-white p-3 rounded focus:border-(--leao-amarelo) focus:outline-none transition-colors"
            />
          </div>

          {state?.erro && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded text-sm text-center border border-red-900">
              ⚠️ {state.erro}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-(--leao-vermelho) text-white font-bold font-barlow uppercase py-3 rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Validando..." : "ENTRAR NO SISTEMA"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-(--leao-amarelo) transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}
