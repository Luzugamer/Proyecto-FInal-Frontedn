import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, List, Clock, MapPin } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { cn } from "@/lib/utils";

interface CalendarioTabProps {
  tournamentSlug: string;
  /** Disciplina activa, seleccionada desde DisciplinasTab */
  disciplina: string;
}

type ViewMode = "calendar" | "list";

function getStatusStyle(status: string) {
  switch (status) {
    case "finished":
      return { pill: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", label: "Finalizado" };
    case "live":
      return { pill: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500 animate-pulse", label: "En vivo" };
    default:
      return { pill: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400", label: "Programado" };
  }
}

export function CalendarioTab({ tournamentSlug, disciplina }: CalendarioTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const allMatches = getMatchesByTournament(tournamentSlug);

  // Filtrar por disciplina
  const matches = useMemo(
    () => allMatches.filter((m) => m.sport === disciplina),
    [allMatches, disciplina]
  );

  // Partidos del mes actual filtrados
  const monthMatches = useMemo(() => {
    return matches.filter((m) => {
      const d = new Date(m.date);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [matches, currentDate]);

  // Helpers de calendario
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getMatchesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return monthMatches.filter((m) => m.date === dateStr);
  };

  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const handlePrev = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNext = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  // Ordenar partidos para la vista lista
  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime()),
    [matches]
  );

  // Agrupar lista por fecha
  const matchesByDate = useMemo(() => {
    const groups: Record<string, typeof sortedMatches> = {};
    sortedMatches.forEach((m) => {
      if (!groups[m.date]) groups[m.date] = [];
      groups[m.date].push(m);
    });
    return groups;
  }, [sortedMatches]);

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Calendar className="w-14 h-14 text-muted-foreground opacity-20" />
        <div>
          <p className="text-lg font-bold text-muted-foreground">Sin partidos programados</p>
          <p className="text-sm text-muted-foreground mt-1">
            Los partidos de <strong>{disciplina}</strong> aparecerán aquí cuando se genere el fixture.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* ── Controles: navegación de mes + toggle de vista ─────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-foreground capitalize min-w-[180px] text-center">
            {monthName}
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle vista */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
              viewMode === "list" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
            Lista
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all",
              viewMode === "calendar" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-4 h-4" />
            Calendario
          </button>
        </div>
      </div>

      {/* ── Vista Calendario ────────────────────────────────────────────── */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Cabeceras días */}
          <div className="grid grid-cols-7 border-b border-border">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dayMatches = day ? getMatchesForDay(day) : [];
              const hasMatches = dayMatches.length > 0;
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[80px] p-2 border-r border-b border-border/50 last:border-r-0",
                    day === null && "bg-muted/30",
                    hasMatches && "bg-primary/5"
                  )}
                >
                  {day && (
                    <>
                      <p className={cn(
                        "text-xs font-bold mb-1",
                        hasMatches ? "text-primary" : "text-foreground"
                      )}>
                        {day}
                      </p>
                      <div className="space-y-1">
                        {dayMatches.map((m) => {
                          const { dot } = getStatusStyle(m.status);
                          return (
                            <div
                              key={m.id}
                              className="text-[10px] bg-primary text-primary-foreground px-1.5 py-1 rounded-md leading-tight"
                              title={`${m.home} vs ${m.away} — ${m.time}`}
                            >
                              <div className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                <span className="font-bold truncate">{m.time}</span>
                              </div>
                              <span className="truncate block">{m.home.split(" ")[0]} vs {m.away.split(" ")[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Vista Lista ─────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {Object.keys(matchesByDate).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay partidos en este mes.
            </div>
          ) : (
            Object.entries(matchesByDate).map(([date, dayMatches]) => {
              const dateObj = new Date(date + "T00:00:00");
              const dayLabel = dateObj.toLocaleDateString("es-PE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              });
              return (
                <div key={date}>
                  {/* Encabezado de fecha */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground font-black text-sm">
                      {dateObj.getDate()}
                    </div>
                    <div>
                      <p className="font-bold text-foreground capitalize">{dayLabel}</p>
                      <p className="text-xs text-muted-foreground">{dayMatches.length} partido{dayMatches.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Partidos del día */}
                  <div className="space-y-2 ml-[52px]">
                    {dayMatches.map((m) => {
                      const { pill, dot, label } = getStatusStyle(m.status);
                      const isFinished = m.status === "finished";
                      return (
                        <div
                          key={m.id}
                          className="bg-white border border-border rounded-xl px-5 py-4 hover:shadow-md transition-all hover:border-primary/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            {/* Estado + hora */}
                            <div className="flex items-center gap-2 sm:min-w-[120px]">
                              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                {label}
                              </span>
                            </div>

                            {/* Enfrentamiento */}
                            <div className="flex-1 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="font-bold text-foreground truncate flex-1 text-right">
                                  {m.home}
                                </span>

                                {isFinished ? (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <span className={`text-xl font-black ${(m.homeScore ?? 0) > (m.awayScore ?? 0) ? "text-primary" : "text-muted-foreground"}`}>
                                      {m.homeScore}
                                    </span>
                                    <span className="text-muted-foreground font-bold">-</span>
                                    <span className={`text-xl font-black ${(m.awayScore ?? 0) > (m.homeScore ?? 0) ? "text-primary" : "text-muted-foreground"}`}>
                                      {m.awayScore}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 flex-shrink-0 px-3 py-1 bg-muted rounded-lg">
                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-sm font-bold text-foreground">{m.time}</span>
                                  </div>
                                )}

                                <span className="font-bold text-foreground truncate flex-1">
                                  {m.away}
                                </span>
                              </div>
                            </div>

                            {/* Sede */}
                            {m.court && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                <MapPin className="w-3 h-3" />
                                <span>{m.court}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}