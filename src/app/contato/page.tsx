import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Sport Club do Recife",
  description: "Fale com o departamento de futebol de mesa.",
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl text-leao-amarelo uppercase font-black mb-2">
            Fale <span className="text-leao-vermelho">Conosco</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Canal oficial para dúvidas, imprensa e parcerias comerciais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-[#111] p-8 md:p-12 rounded-2xl border border-zinc-800 shadow-2xl">
          <div className="flex flex-col justify-center space-y-10">
            <div>
              <h3 className="text-leao-amarelo font-barlow text-2xl font-bold uppercase mb-3">
                Sala Otávio Coutinho
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Av. Sport Club do Recife
                <br />
                Ilha do Retiro, Recife - PE
                <br />
                CEP: 50750-560
              </p>
            </div>
            <div>
              <h3 className="text-leao-vermelho font-barlow text-2xl font-bold uppercase mb-3">
                Seja Patrocinador
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Associe sua marca ao maior clube do Nordeste. Preencha o
                formulário e selecione o assunto &quot;Patrocínio&quot;.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <span className="text-zinc-500 text-xs font-bold uppercase block mb-1">
                E-mail Direto
              </span>
              <a
                href="mailto:futmesa@sportrecife.com.br"
                className="text-zinc-200 font-bold text-lg hover:text-leao-amarelo transition-colors"
              >
                sportrecife.futmesa@gmail.com
              </a>
            </div>
          </div>

          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 tracking-wider">
                Nome Completo
              </label>
              <input
                type="text"
                className="w-full bg-black border border-zinc-800 rounded p-3 text-zinc-300 focus:border-leao-amarelo outline-none transition-colors placeholder:text-zinc-800"
                placeholder="Digite seu nome"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                className="w-full bg-black border border-zinc-800 rounded p-3 text-zinc-300 focus:border-leao-amarelo outline-none transition-colors placeholder:text-zinc-800"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 tracking-wider">
                Assunto
              </label>
              <select className="w-full bg-black border border-zinc-800 rounded p-3 text-zinc-300 focus:border-leao-amarelo outline-none transition-colors cursor-pointer">
                <option>Quero ser patrocinador</option>
                <option>Imprensa / Mídia</option>
                <option>Dúvidas Gerais</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1 tracking-wider">
                Mensagem
              </label>
              <textarea
                rows={4}
                className="w-full bg-black border border-zinc-800 rounded p-3 text-zinc-300 focus:border-leao-amarelo outline-none transition-colors placeholder:text-zinc-800"
                placeholder="Escreva sua mensagem..."
              ></textarea>
            </div>
            <button type="button" className="btn-sport w-full mt-2">
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
