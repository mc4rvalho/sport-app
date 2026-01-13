export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Adicionamos a linha abaixo para o ESLint não reclamar */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png"
            alt="Sport"
            className="w-24 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="font-barlow text-5xl text-white uppercase font-black mb-4">
            Sobre o Departamento
          </h1>
          <div className="h-1 w-20 bg-(--leao-vermelho) mx-auto rounded"></div>
        </div>

        <div className="bg-[#111] border border-zinc-800 p-8 rounded-2xl text-zinc-300 space-y-6 leading-relaxed text-lg">
          <p>
            O Departamento de Futebol de Mesa do{" "}
            <strong className="text-(--leao-amarelo)">
              Sport Club do Recife
            </strong>{" "}
            é referência na modalidade em Pernambuco e no Brasil.
          </p>
          <p>
            Fundado com o objetivo de promover a prática do futebol de botão
            (Regra 12 Toques), o Leão da Ilha acumula títulos estaduais e
            regionais, formando campeões e integrando gerações de botonistas
            apaixonados.
          </p>

          <h3 className="text-white font-bold text-xl pt-4">
            🦁 Nossos Valores
          </h3>
          <ul className="list-disc pl-5 space-y-2 marker:text-(--leao-vermelho)">
            <li>Paixão pelo Sport acima de tudo.</li>
            <li>Fair play e respeito aos adversários.</li>
            <li>Excelência técnica e competitividade.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
