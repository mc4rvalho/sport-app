import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#111] border-t-4 border-leao-vermelho mt-auto">
      <div className="bg-black py-12 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-leao-vermelho font-barlow font-bold uppercase tracking-[4px] text-xs mb-8">
            Patrocinadores Oficiais
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
            <span className="text-3xl font-black text-leao-vermelho font-barlow tracking-tighter">
              FACSU
            </span>
            <span className="text-3xl font-black text-leao-vermelho font-barlow tracking-tighter">
              WE.TEST
            </span>
            <span className="text-3xl font-black text-leao-vermelho font-barlow tracking-tighter">
              RECIFE TELHAS
            </span>
          </div>
          <div className="mt-10">
            <Link
              href="/contato"
              className="bg-leao-vermelho text-leao-preto rounded-md px-6 py-3 font-barlow font-bold uppercase tracking-wider transition-all duration-300 hover:bg-leao-amarelo hover:text-black hover:border-leao-amarelo cursor-pointer"
            >
              Seja um Patrocinador do Clube
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-1 md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png"
            alt="Sport"
            className="h-14 mb-4 opacity-80"
          />
          <p className="text-zinc-500 max-w-sm leading-relaxed text-xs">
            Departamento de Futebol de Mesa do Sport Club do Recife. Tradição,
            raça e glórias desde a fundação. Pelo Sport Tudo!
          </p>
        </div>
        <div>
          <h4 className="text-leao-amarelo font-barlow font-bold uppercase mb-4 tracking-wider text-sm">
            Navegação
          </h4>
          <ul className="flex flex-col gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wide">
            <li>
              <Link
                href="/noticias"
                className="hover:text-leao-amarelo transition-colors"
              >
                Notícias
              </Link>
            </li>
            <li>
              <Link
                href="/titulos"
                className="hover:text-leao-amarelo transition-colors"
              >
                Sala de Troféus
              </Link>
            </li>
            <li>
              <Link
                href="/ranking"
                className="hover:text-leao-amarelo transition-colors"
              >
                Ranking Oficial
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="hover:text-leao-amarelo transition-colors"
              >
                Sobre o Clube
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-leao-vermelho font-barlow font-bold uppercase mb-4 tracking-wider text-sm">
            Contato
          </h4>
          <ul className="flex flex-col gap-2 text-zinc-500 text-xs">
            <li>Ilha do Retiro - Recife/PE</li>
            <li>futmesa@sportrecife.com.br</li>
          </ul>
        </div>
      </div>

      <div className="bg-black py-4 text-center border-t border-zinc-900">
        <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Sport Club do Recife - Futebol de
          Mesa
        </p>
      </div>
    </footer>
  );
}
