import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendário Oficial | Sport Club do Recife",
  description: "Agenda de competições da temporada.",
};

interface EventoCalendario {
  id: string;
  nome: string;
  data: Date;
  tipo: string;
  local: string;
}

function getEstiloEvento(nome: string, tipo: string) {
  const nomeUpper = nome.toUpperCase();
  const tipoUpper = tipo.toUpperCase();

  // 1. TGR
  if (nomeUpper.includes("TGR") || tipoUpper === "TGR") {
    return {
      border: "border-l-emerald-600",
      badge: "bg-emerald-600 text-white",
      icon: "⚽",
      label: "TGR",
    };
  }

  // 2. Interno
  if (nomeUpper.includes("INTERNO")) {
    return {
      border: "border-l-leao-vermelho",
      badge: "bg-leao-vermelho text-black",
      icon: "🦁",
      label: "Interno",
    };
  }

  // 3. Copa PE
  if (nomeUpper.includes("COPA") && nomeUpper.includes("PE")) {
    return {
      border: "border-l-zinc-400",
      badge: "bg-zinc-400 text-black",
      icon: "🥈",
      label: "Copa PE",
    };
  }

  // 4. Estadual
  if (
    nomeUpper.includes("ETAPA") ||
    tipoUpper === "ESTADUAL" ||
    tipoUpper === "ETAPA PE"
  ) {
    return {
      border: "border-l-leao-amarelo",
      badge: "bg-leao-amarelo text-black",
      icon: "🏆",
      label: "Estadual",
    };
  }

  // 5. Nacionais
  if (tipoUpper === "NACIONAL") {
    return {
      border: "border-l-blue-600",
      badge: "bg-blue-600 text-white",
      icon: "🇧🇷",
      label: "Nacional",
    };
  }

  // 6. Internacionais
  if (tipoUpper === "INTERNACIONAL") {
    return {
      border: "border-l-purple-600",
      badge: "bg-purple-600 text-white",
      icon: "🌎",
      label: "Mundial",
    };
  }

  return {
    border: "border-l-zinc-700",
    badge: "bg-zinc-800 text-zinc-400",
    icon: "📅",
    label: "Evento",
  };
}

export default async function CalendarioPage() {
  const campeonatosDB = await prisma.campeonato.findMany({
    orderBy: { data: "asc" },
  });

  const todosEventos: EventoCalendario[] = campeonatosDB.map((c) => ({
    id: c.id,
    nome: c.nome,
    data: c.data,
    tipo: c.tipo,
    local: "Ilha do Retiro",
  }));

  todosEventos.sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  const eventosPorMes: Record<string, EventoCalendario[]> = {};

  todosEventos.forEach((evento) => {
    const dataObj = new Date(evento.data);
    const mesAno = dataObj.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const chave = mesAno.charAt(0).toUpperCase() + mesAno.slice(1);

    if (!eventosPorMes[chave]) {
      eventosPorMes[chave] = [];
    }
    eventosPorMes[chave].push(evento);
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-barlow text-5xl md:text-6xl text-white uppercase font-black mb-4 tracking-tight">
            Calendário <span className="text-leao-amarelo">Oficial</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Programe-se para os compromissos do Leão na temporada.
          </p>
        </div>

        <div className="space-y-12">
          {Object.keys(eventosPorMes).map((mes) => (
            <div
              key={mes}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="sticky top-24 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm py-4 border-b border-zinc-800 mb-6">
                <h2 className="text-3xl font-barlow font-black text-white uppercase tracking-wide flex items-center gap-3">
                  <span className="text-leao-vermelho">📅</span> {mes}
                </h2>
              </div>

              <div className="grid gap-4">
                {eventosPorMes[mes].map((evento) => {
                  const estilo = getEstiloEvento(evento.nome, evento.tipo);
                  const dataObj = new Date(evento.data);
                  const dia = dataObj.getUTCDate();
                  const diaSemana = dataObj.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    timeZone: "UTC",
                  });

                  return (
                    <div
                      key={evento.id}
                      className={`bg-[#111] border border-zinc-800 border-l-4 ${estilo.border} p-5 rounded-r-xl flex flex-col md:flex-row md:items-center gap-6 hover:bg-zinc-900 transition-colors group relative overflow-hidden`}
                    >
                      <div className="flex flex-col items-center justify-center min-w-20 text-center border-r border-zinc-800 md:border-0 pr-4 md:pr-0">
                        <span className="text-4xl font-barlow font-black text-white leading-none group-hover:scale-110 transition-transform">
                          {dia}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">
                          {diaSemana}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${estilo.badge}`}
                          >
                            {estilo.label}
                          </span>
                          <span className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-1">
                            📍 {evento.local}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-barlow font-bold text-white uppercase group-hover:text-leao-amarelo transition-colors">
                          {evento.nome}
                        </h3>
                      </div>
                      <div className="hidden md:block text-4xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all grayscale group-hover:grayscale-0">
                        {estilo.icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(eventosPorMes).length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-xl font-barlow uppercase font-bold">
              Nenhuma competição agendada no momento.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
