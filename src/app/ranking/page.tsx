import { gerarRanking } from "@/lib/ranking-logic";
import { ItemRanking } from "@/types/ranking"; // Importação do Tipo

// Função para corrigir links do Google Drive
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

export default async function RankingPage() {
  // Busca os dados direto do banco (Server Side)
  const lista = await gerarRanking();

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* CABEÇALHO */}
      <div className="text-center mb-10">
        <h1 className="font-barlow text-5xl text-(--leao-amarelo) uppercase mb-0">
          Classificação Oficial
        </h1>
        <div className="w-20 h-1 bg-(--leao-vermelho) mx-auto mt-2"></div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto border-t-4 border-(--leao-amarelo) bg-[#111] rounded-lg shadow-lg">
        <table className="w-full min-w-225 border-collapse">
          <thead>
            <tr className="bg-black border-b-2 border-[#333] text-sm uppercase font-barlow text-gray-400">
              <th className="p-4 text-center w-12 text-white">#</th>
              <th className="p-4 text-left text-white">Atleta</th>
              <th
                className="p-4 text-center text-(--leao-amarelo) text-lg"
                title="Pontos Ranking"
              >
                P
              </th>
              <th className="p-4 text-center" title="Jogos">
                J
              </th>
              <th className="p-4 text-center" title="Vitórias">
                V
              </th>
              <th className="p-4 text-center" title="Empates">
                E
              </th>
              <th className="p-4 text-center" title="Derrotas">
                D
              </th>
              <th className="p-4 text-center" title="Saldo Gols">
                SG
              </th>
              <th className="p-4 text-center" title="Aproveitamento">
                A%
              </th>
            </tr>
          </thead>
          <tbody>
            {/* AQUI ESTÁ A CORREÇÃO: Tipagem explícita no map */}
            {lista.map((item: ItemRanking, index: number) => {
              const posicao = index + 1;
              const ehG4 = posicao <= 4;
              const ehZ4 = posicao > lista.length - 4 && lista.length > 4;

              // Cor da posição
              let corPosicao = "text-white";
              if (ehG4) corPosicao = "text-(--leao-amarelo)";
              if (ehZ4) corPosicao = "text-(--leao-vermelho)";

              return (
                <tr
                  key={item.nome}
                  className="even:bg-[#1a1a1a] odd:bg-[#222] border-b border-[#333] hover:bg-[#2a2a2a] transition-colors"
                >
                  {/* POSIÇÃO */}
                  <td
                    className={`text-center p-3 font-bold text-lg ${corPosicao}`}
                  >
                    {posicao}
                  </td>

                  {/* NOME + FOTO */}
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#333] overflow-hidden border border-[#555] shrink-0">
                      {item.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={formatarFoto(item.fotoUrl)}
                          alt={item.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="block text-center leading-10 text-lg">
                          👤
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-bold font-barlow text-lg uppercase leading-none">
                        {item.nome}
                      </div>
                      <div className="flex items-center gap-1 mt-1 opacity-70 text-xs uppercase">
                        <span className="text-[10px]">⚽</span>{" "}
                        {item.time || "Sport"}
                      </div>
                    </div>
                  </td>

                  {/* PONTOS (DESTAQUE) */}
                  <td className="text-center p-3 font-bold text-(--leao-amarelo) text-xl bg-[rgba(255,215,0,0.05)]">
                    {item.pontosRanking}
                  </td>

                  {/* ESTATÍSTICAS */}
                  <td className="text-center p-3 text-gray-300">
                    {item.jogos}
                  </td>
                  <td className="text-center p-3 text-white font-bold">
                    {item.vitorias}
                  </td>
                  <td className="text-center p-3 text-gray-400">
                    {item.empates}
                  </td>
                  <td className="text-center p-3 text-red-400">
                    {item.derrotas}
                  </td>

                  <td
                    className={`text-center p-3 font-bold ${
                      item.sg >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.sg > 0 ? `+${item.sg}` : item.sg}
                  </td>

                  <td className="text-center p-3 text-gray-400 text-sm">
                    {item.aproveitamento}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
