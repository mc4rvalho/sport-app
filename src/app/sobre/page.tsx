import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Trophy,
  Users,
  Briefcase,
  ClipboardList,
  Brain,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre | Sport Club do Recife",
  description: "Conheça a história do futebol de mesa do Leão.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen pb-20 bg-[#0a0a0a]">
      <section className="bg-black border-b border-zinc-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png"
            alt=""
            className="w-96 translate-x-1/3 -translate-y-1/3 grayscale"
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-leao-amarelo font-barlow font-bold uppercase tracking-[4px] text-sm mb-3 block">
            Desde 1905
          </span>
          <h1 className="font-barlow text-6xl md:text-8xl text-leao-amarelo uppercase font-black leading-none max-w-4xl tracking-tighter">
            Pelo Sport <br />
            <span className="text-leao-vermelho">Tudo!</span>
          </h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-20 space-y-20">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl text-leao-amarelo font-black uppercase mb-6 leading-none">
              A Tradição nas <span className="text-leao-vermelho">Mesas</span>
            </h2>
            <div className="w-12 h-1 bg-leao-amarelo"></div>
          </div>
          <div className="w-full md:w-2/3 space-y-6 text-zinc-400 text-lg leading-relaxed font-roboto">
            <p>
              Desde 1905, o{" "}
              <strong className="text-leao-vermelho">
                Sport Club do Recife
              </strong>{" "}
              impõe sua grandeza. Mas foi em maio de 2010 que o rugido do Leão
              ganhou um novo território oficial: as mesas de botão.
            </p>
            <p>
              O que começou com partidas apaixonadas na histórica{" "}
              <strong className="text-leao-amarelo">
                Sala Otávio Coutinho
              </strong>{" "}
              , localizada sob a vibração da geral da Jovem, transformou-se em
              uma das equipes mais tradicionais do futebol de mesa pernambucano.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#111] p-8 rounded-xl border border-zinc-800 hover:border-leao-vermelho transition-colors group">
            <div className="mb-6 block group-hover:scale-110 transition-transform w-fit text-zinc-500 group-hover:text-leao-vermelho">
              <Shield className="w-12 h-12" />
            </div>
            <h3 className="text-leao-amarelo font-barlow font-bold uppercase text-xl mb-3 group-hover:text-leao-vermelho transition-colors">
              Raça
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Entrega total em cada partida. Defendemos as cores rubro-negras
              até o último segundo.
            </p>
          </div>
          <div className="bg-[#111] p-8 rounded-xl border border-zinc-800 hover:border-leao-amarelo transition-colors group">
            <div className="mb-6 block group-hover:scale-110 transition-transform w-fit text-zinc-500 group-hover:text-leao-amarelo">
              <Trophy className="w-12 h-12" />
            </div>
            <h3 className="text-leao-vermelho font-barlow font-bold uppercase text-xl mb-3 group-hover:text-leao-amarelo transition-colors">
              Excelência
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A busca incessante por títulos. Nossa missão é formar campeões.
            </p>
          </div>
          <div className="bg-[#111] p-8 rounded-xl border border-zinc-800 hover:border-blue-500 transition-colors group">
            <div className="mb-6 block group-hover:scale-110 transition-transform w-fit text-zinc-500 group-hover:text-blue-500">
              <Users className="w-12 h-12" />
            </div>
            <h3 className="text-leao-verde font-barlow font-bold uppercase text-xl mb-3 group-hover:text-blue-500 transition-colors">
              União
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Mais que um time, somos uma família unida pelo amor ao esporte.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl text-white font-barlow font-black uppercase mb-8 border-l-4 border-leao-amarelo pl-4">
            Quem Faz Acontecer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#111] p-5 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-leao-vermelho transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-xl border border-zinc-700 group-hover:border-leao-vermelho group-hover:text-leao-vermelho transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-leao-vermelho text-lg block uppercase font-barlow leading-none mb-1">
                  Renato César
                </strong>
                <span className="text-leao-amarelo text-[10px] font-bold uppercase tracking-widest border border-leao-amarelo px-2 py-0.5 rounded-full">
                  Diretor
                </span>
              </div>
            </div>
            <div className="bg-[#111] p-5 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-leao-vermelho transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-xl border border-zinc-700 group-hover:border-leao-vermelho group-hover:text-leao-vermelho transition-colors">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-leao-vermelho text-lg block uppercase font-barlow leading-none mb-1">
                  Papa
                </strong>
                <span className="text-leao-amarelo text-xs font-bold uppercase tracking-wider">
                  Coordenador
                </span>
              </div>
            </div>
            <div className="bg-[#111] p-5 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-leao-vermelho transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-xl border border-zinc-700 group-hover:border-leao-vermelho group-hover:text-leao-vermelho transition-colors">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-leao-vermelho text-lg block uppercase font-barlow leading-none mb-1">
                  André Luiz
                </strong>
                <span className="text-leao-amarelo text-xs font-bold uppercase tracking-wider">
                  Técnico
                </span>
              </div>
            </div>
            <div className="bg-[#111] p-5 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-leao-vermelho transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-xl border border-zinc-700 group-hover:border-leao-vermelho group-hover:text-leao-vermelho transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-leao-vermelho text-lg block uppercase font-barlow leading-none mb-1">
                  Matheus Carvalho
                </strong>
                <span className="text-leao-amarelo text-xs font-bold uppercase tracking-wider">
                  Capitão
                </span>
              </div>
            </div>
            <div className="bg-[#111] p-5 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-leao-vermelho transition-colors group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-xl border border-zinc-700 group-hover:border-leao-vermelho group-hover:text-leao-vermelho transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-leao-vermelho text-lg block uppercase font-barlow leading-none mb-1">
                  Flavio Afa
                </strong>
                <span className="text-leao-amarelo text-xs font-bold uppercase tracking-wider">
                  Social Media
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-2xl text-center">
          <h2 className="text-3xl text-white font-barlow font-black uppercase mb-4">
            Faça parte dessa história
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Quer defender as cores do Sport nos torneios estaduais e nacionais?
            Entre em contato e saiba como participar das nossas seletivas.
          </p>
          <Link href="/contato" className="btn-sport">
            Entrar em Contato
          </Link>
        </div>
      </section>
    </main>
  );
}
