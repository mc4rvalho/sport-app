import { gerarRanking } from "@/lib/ranking-logic";
import Link from "next/link";

// Componente para formatar foto... (mantenha a função formatarFoto aqui)
function formatarFoto(url: string | null) {
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

// O componente agora recebe searchParams para saber qual aba está ativa
export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const params = await searchParams;
  const filtroAtual =
    (params.filtro as "GERAL" | "INTERNO" | "ADULTO" | "MASTER") || "GERAL";

  const ranking = await gerarRanking(filtroAtual);

  const abas = [
    { id: "GERAL", label: "Geral" },
    { id: "INTERNO", label: "Interno" },
    { id: "ADULTO", label: "Adulto" },
    { id: "MASTER", label: "Master" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4">
        {" "}
        {/* Aumentei para 7xl para caber as colunas */}
        <div className="text-center mb-10">
          <h1 className="font-barlow text-5xl uppercase font-black">
            <span className="text-(--leao-amarelo)">Classificação</span>
            <span className="text-(--leao-vermelho)">Oficial</span>
          </h1>
        </div>
        {/* ABAS DE NAVEGAÇÃO */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {abas.map((aba) => (
            <Link
              key={aba.id}
              href={`/ranking?filtro=${aba.id}`}
              className={`px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest border transition-all ${
                filtroAtual === aba.id
                  ? "bg-(--leao-vermelho) text-white border-red-900"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white"
              }`}
            >
              {aba.label}
            </Link>
          ))}
        </div>
        <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-zinc-900 text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Atleta</th>
                <th className="p-4 text-center text-white bg-zinc-800/50">
                  PTS
                </th>
                <th className="p-4 text-center">J</th>
                <th className="p-4 text-center text-green-500">V</th>
                <th className="p-4 text-center text-zinc-500">E</th>
                <th className="p-4 text-center text-red-500">D</th>
                <th className="p-4 text-center">GP</th>
                <th className="p-4 text-center">GC</th>
                <th className="p-4 text-center font-bold text-white">SG</th>
                <th
                  className="p-4 text-center text-blue-400"
                  title="Média Gols Pró"
                >
                  MG+
                </th>
                <th
                  className="p-4 text-center text-red-400"
                  title="Média Gols Contra"
                >
                  MG-
                </th>
                <th className="p-4 text-center text-(--leao-amarelo)">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {ranking.map((atleta, index) => (
                <tr
                  key={atleta.id}
                  className="hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="p-4 text-center font-bold font-barlow text-lg text-zinc-600">
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/atleta/${atleta.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formatarFoto(atleta.fotoUrl)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-white uppercase group-hover:text-(--leao-amarelo) transition-colors">
                        {atleta.nome}
                      </span>
                    </Link>
                  </td>
                  <td className="p-4 text-center font-black text-lg bg-zinc-800/30 text-white">
                    {atleta.pontosRanking}
                  </td>
                  <td className="p-4 text-center font-mono text-zinc-400">
                    {atleta.jogos}
                  </td>
                  <td className="p-4 text-center font-mono text-green-500 font-bold">
                    {atleta.vitorias}
                  </td>
                  <td className="p-4 text-center font-mono text-zinc-500">
                    {atleta.empates}
                  </td>
                  <td className="p-4 text-center font-mono text-red-500">
                    {atleta.derrotas}
                  </td>
                  <td className="p-4 text-center font-mono text-zinc-400">
                    {atleta.golsPro}
                  </td>
                  <td className="p-4 text-center font-mono text-zinc-400">
                    {atleta.golsContra}
                  </td>
                  <td className="p-4 text-center font-mono text-white font-bold">
                    {atleta.saldoGols}
                  </td>
                  <td className="p-4 text-center font-mono text-blue-400 text-xs">
                    {atleta.mediaPro}
                  </td>
                  <td className="p-4 text-center font-mono text-red-400 text-xs">
                    {atleta.mediaContra}
                  </td>
                  <td className="p-4 text-center font-mono text-(--leao-amarelo) font-bold">
                    {atleta.aproveitamento}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
