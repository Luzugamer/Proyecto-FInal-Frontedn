import { useMemo } from "react";
import { Trophy, Zap } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";

interface ResultadosTabProps {
  tournamentSlug: string;
}

export function ResultadosTab({ tournamentSlug }: ResultadosTabProps) {
  const allMatches = getMatchesByTournament(tournamentSlug);

  // Filtrar solo partidos finalizados y agrupar por deporte
  const resultadosByDeporte = useMemo(() => {
    const finishedMatches = allMatches.filter((m) => m.status === "finished");

    const grouped: Record<string, typeof finishedMatches> = {};

    finishedMatches.forEach((match) => {
      if (!grouped[match.sport]) {
        grouped[match.sport] = [];
      }
      grouped[match.sport].push(match);
    });

    // Ordenar cada deporte por fecha descendente y tomar los 3 primeros
    Object.keys(grouped).forEach((sport) => {
      grouped[sport] = grouped[sport]
        .sort(
          (a, b) =>
            new Date(b.date + " " + b.time).getTime() -
            new Date(a.date + " " + a.time).getTime(),
        )
        .slice(0, 3);
    });

    return grouped;
  }, [allMatches]);

  if (Object.keys(resultadosByDeporte).length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">
          No hay resultados disponibles aún
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(resultadosByDeporte).map(([sport, matches]) => (
        <div key={sport}>
          {/* Sport Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-1">{sport}</h3>
            <p className="text-sm text-muted-foreground">
              Últimos {matches.length} resultados
            </p>
          </div>

          {/* Resultados */}
          <div className="space-y-3">
            {matches.map((match, idx) => (
              <div
                key={match.id}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all"
              >
                {/* Ranking number y fecha */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(match.date + "T00:00:00").toLocaleDateString(
                        "es-ES",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}{" "}
                      - {match.time}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                    {match.court}
                  </span>
                </div>

                {/* Resultado */}
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  {/* Equipo Local */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-2">
                      {match.home}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {match.homeScore}
                    </p>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-muted-foreground">-</p>
                  </div>

                  {/* Equipo Visitante */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-2">
                      {match.away}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {match.awayScore}
                    </p>
                  </div>
                </div>

                {/* Goleadores */}
                {match.events && match.events.length > 0 && (
                  <div className="pt-4 border-t border-primary/10">
                    <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Eventos ({match.events.length}
                      )
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {match.events.slice(0, 5).map((event, idx) => (
                        <span
                          key={idx}
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            event.type === "goal"
                              ? "bg-green-100 text-green-700"
                              : event.type === "yellow"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {event.type === "goal" && "⚽"}
                          {event.type === "yellow" && "🟨"}
                          {event.type === "red" && "🟥"}
                          {" " + event.minute}
                        </span>
                      ))}
                      {match.events.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{match.events.length - 5} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
