import { useMemo } from "react";
import { Trophy, Zap, TrendingUp } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";

interface ResultadosTabProps {
  tournamentSlug: string;
  /** Disciplina activa, seleccionada desde DisciplinasTab */
  disciplina: string;
}

export function ResultadosTab({ tournamentSlug, disciplina }: ResultadosTabProps) {
  const allMatches = getMatchesByTournament(tournamentSlug);

  // Solo finalizados de esta disciplina, ordenados por fecha descendente
  const resultados = useMemo(() => {
    return allMatches
      .filter((m) => m.status === "finished" && m.sport === disciplina)
      .sort(
        (a, b) =>
          new Date(b.date + "T" + b.time).getTime() -
          new Date(a.date + "T" + a.time).getTime()
      );
  }, [allMatches, disciplina]);

  if (resultados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Trophy className="w-14 h-14 text-muted-foreground opacity-20" />
        <div>
          <p className="text-lg font-bold text-muted-foreground">Sin resultados aún</p>
          <p className="text-sm text-muted-foreground mt-1">
            Los partidos finalizados de <strong>{disciplina}</strong> aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Resumen rápido */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
        <TrendingUp className="w-4 h-4" />
        <span>
          <strong className="text-foreground">{resultados.length}</strong>{" "}
          partido{resultados.length !== 1 ? "s" : ""} finalizado{resultados.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lista de resultados */}
      <div className="space-y-3">
        {resultados.map((match, idx) => {
          const homeWon = (match.homeScore ?? 0) > (match.awayScore ?? 0);
          const awayWon = (match.awayScore ?? 0) > (match.homeScore ?? 0);
          const draw = !homeWon && !awayWon;

          const dateLabel = new Date(match.date + "T00:00:00").toLocaleDateString("es-PE", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });

          return (
            <div
              key={match.id}
              className="bg-white rounded-xl border border-border hover:shadow-md transition-all group"
            >
              {/* Barra superior: número + fecha + cancha */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{dateLabel} · {match.time}</span>
                </div>
                {match.court && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-medium">
                    {match.court}
                  </span>
                )}
              </div>

              {/* Resultado */}
              <div className="px-5 py-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  {/* Equipo local */}
                  <div className={`text-center ${homeWon ? "" : "opacity-50"}`}>
                    <p className={`font-black text-base ${homeWon ? "text-foreground" : "text-muted-foreground"}`}>
                      {match.home}
                    </p>
                    {homeWon && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Ganador
                      </span>
                    )}
                  </div>

                  {/* Marcador central */}
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-black tabular-nums ${
                      homeWon ? "text-primary" : draw ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {match.homeScore ?? 0}
                    </span>
                    <span className="text-lg text-muted-foreground font-bold">–</span>
                    <span className={`text-3xl font-black tabular-nums ${
                      awayWon ? "text-primary" : draw ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {match.awayScore ?? 0}
                    </span>
                  </div>

                  {/* Equipo visitante */}
                  <div className={`text-center ${awayWon ? "" : "opacity-50"}`}>
                    <p className={`font-black text-base ${awayWon ? "text-foreground" : "text-muted-foreground"}`}>
                      {match.away}
                    </p>
                    {awayWon && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Ganador
                      </span>
                    )}
                  </div>
                </div>

                {/* Empate */}
                {draw && (
                  <p className="text-center text-xs font-bold text-yellow-600 mt-2">Empate</p>
                )}
              </div>

              {/* Eventos si los hay */}
              {match.events && match.events.length > 0 && (
                <div className="px-5 py-3 border-t border-border/60">
                  <p className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Eventos del partido
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.events.slice(0, 6).map((ev, i) => (
                      <span
                        key={i}
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          ev.type === "goal"
                            ? "bg-green-100 text-green-700"
                            : ev.type === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ev.type === "goal" ? "⚽" : ev.type === "yellow" ? "🟨" : "🟥"}
                        {" "}{ev.minute}'
                        {ev.player && <span className="ml-1 opacity-75">{ev.player}</span>}
                      </span>
                    ))}
                    {match.events.length > 6 && (
                      <span className="text-xs text-muted-foreground self-center">
                        +{match.events.length - 6} más
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}