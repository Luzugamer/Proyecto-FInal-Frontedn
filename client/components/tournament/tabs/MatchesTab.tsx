import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Play, Trophy, Search, X, Zap, RotateCcw, Filter } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { cn } from "@/lib/utils";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusTab = "live" | "today" | "upcoming" | "finished";

interface MatchesTabProps {
  tournamentSlug: string;
  /**
   * Cuando se pasa (dentro de DisciplinasTab):
   *   - filtra automáticamente por esa disciplina
   *   - oculta el selector de deporte
   * Cuando no se pasa (tab "Partidos" nivel 1):
   *   - muestra todos los deportes
   *   - el selector de deporte es visible
   */
  disciplina?: string;
  userRole?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_TABS: { id: StatusTab; label: string; emoji: string }[] = [
  { id: "live",     label: "En Vivo",  emoji: "🔴" },
  { id: "today",    label: "Hoy",      emoji: "📅" },
  { id: "upcoming", label: "Próximos", emoji: "⏳" },
  { id: "finished", label: "Pasados",  emoji: "✅" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "live":
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          EN VIVO
        </span>
      );
    case "today":
      return (
        <span className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
          <Clock className="w-3 h-3" />
          HOY
        </span>
      );
    case "upcoming":
      return (
        <span className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          PRÓXIMO
        </span>
      );
    case "finished":
      return (
        <span className="inline-flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold">
          FINALIZADO
        </span>
      );
  }
}

// Conteo de partidos por estado para los badges de las pestañas
function useStatusCounts(matches: ReturnType<typeof getMatchesByTournament>) {
  return useMemo(() => {
    const counts: Record<StatusTab, number> = { live: 0, today: 0, upcoming: 0, finished: 0 };
    matches.forEach((m) => {
      if (m.status in counts) counts[m.status as StatusTab]++;
    });
    return counts;
  }, [matches]);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function MatchesTab({ tournamentSlug, disciplina, userRole }: MatchesTabProps) {
  const insideDisciplina = !!disciplina;

  const [activeStatus, setActiveStatus] = useState<StatusTab>("live");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [searchTeam, setSearchTeam]     = useState<string>("");
  const [showFilters, setShowFilters]   = useState(false);

  const allMatches = getMatchesByTournament(tournamentSlug);

  // Si estamos dentro de DisciplinasTab, pre-filtramos por disciplina
  const baseMatches = useMemo(
    () => insideDisciplina
      ? allMatches.filter((m) => m.sport === disciplina)
      : allMatches,
    [allMatches, disciplina, insideDisciplina]
  );

  // Deportes disponibles (solo para el nivel 1)
  const sports = useMemo(
    () => Array.from(new Set(allMatches.map((m) => m.sport))).sort(),
    [allMatches]
  );

  const statusCounts = useStatusCounts(baseMatches);

  // Filtros aplicados
  const filteredMatches = useMemo(() => {
    return baseMatches
      .filter((m) => {
        const byStatus = m.status === activeStatus;
        const bySport  = insideDisciplina || !selectedSport || m.sport === selectedSport;
        const byTeam   = !searchTeam ||
          m.home.toLowerCase().includes(searchTeam.toLowerCase()) ||
          m.away.toLowerCase().includes(searchTeam.toLowerCase());
        return byStatus && bySport && byTeam;
      })
      .sort((a, b) =>
        activeStatus === "finished"
          ? new Date(b.date + "T" + b.time).getTime() - new Date(a.date + "T" + a.time).getTime()
          : new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime()
      );
  }, [baseMatches, activeStatus, selectedSport, searchTeam, insideDisciplina]);

  const hasActiveFilters = (!insideDisciplina && !!selectedSport) || !!searchTeam;

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* ── Status tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {STATUS_TABS.map(({ id, label, emoji }) => {
          const count   = statusCounts[id];
          const isActive = id === activeStatus;
          return (
            <button
              key={id}
              onClick={() => setActiveStatus(id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold border-b-2 transition-all -mb-px",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              {count > 0 && (
                <span className={cn(
                  "text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  isActive
                    ? id === "live" ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Buscador + filtro deporte (solo nivel 1) ─────────────────────── */}
      <div className="flex gap-3 flex-wrap">
        {/* Búsqueda por equipo */}
        <div className="relative group flex-1 min-w-[220px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border-2 border-border rounded-xl text-sm focus:outline-none focus:border-primary bg-white transition-all"
          />
          {searchTeam && (
            <button
              onClick={() => setSearchTeam("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filtro de deporte — solo cuando NO hay disciplina fija */}
        {!insideDisciplina && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all",
              showFilters || selectedSport
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-white border-border text-foreground hover:border-primary/40"
            )}
          >
            <Filter className="w-4 h-4" />
            Deporte
            {selectedSport && <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full">1</span>}
          </button>
        )}

        {/* Limpiar */}
        {hasActiveFilters && (
          <button
            onClick={() => { setSelectedSport(""); setSearchTeam(""); }}
            className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {/* ── Panel de filtro de deporte ───────────────────────────────────── */}
      {showFilters && !insideDisciplina && (
        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Filtrar por deporte</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSport("")}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
                !selectedSport
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-white border-border text-foreground hover:border-primary/40"
              )}
            >
              Todos
            </button>
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport === selectedSport ? "" : sport)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
                  selectedSport === sport
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-white border-border text-foreground hover:border-primary/40"
                )}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Grid de partidos ─────────────────────────────────────────────── */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <Link
              key={match.id}
              to={`/torneo/${tournamentSlug}/partidos/${match.id}`}
              className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/60">
                <div className="flex items-center gap-2">
                  {getStatusBadge(match.status)}
                  {/* Mostrar deporte solo cuando NO estamos dentro de una disciplina fija */}
                  {!insideDisciplina && (
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {match.sport}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(match.date + "T00:00:00").toLocaleDateString("es-PE", {
                    day: "numeric", month: "short",
                  })}
                  {" · "}{match.time}
                </div>
              </div>

              {/* Marcador */}
              <div className="px-5 py-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  {/* Local */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                      {match.home}
                    </p>
                  </div>

                  {/* Resultado o vs */}
                  <div className="flex flex-col items-center gap-1 px-3">
                    {match.homeScore !== undefined && match.awayScore !== undefined ? (
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "text-3xl font-black tabular-nums",
                          match.homeScore > match.awayScore ? "text-primary" : "text-muted-foreground"
                        )}>
                          {match.homeScore}
                        </span>
                        <span className="text-muted-foreground font-bold mx-1">–</span>
                        <span className={cn(
                          "text-3xl font-black tabular-nums",
                          match.awayScore > match.homeScore ? "text-primary" : "text-muted-foreground"
                        )}>
                          {match.awayScore}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-muted-foreground">VS</span>
                        {(match.status === "today" || match.status === "live") && (
                          <span className="text-xs font-bold text-primary">{match.time}</span>
                        )}
                      </div>
                    )}
                    {match.status === "live" && (
                      <span className="text-[10px] font-bold text-red-500 animate-pulse">● EN VIVO</span>
                    )}
                  </div>

                  {/* Visitante */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground leading-tight line-clamp-2">
                      {match.away}
                    </p>
                  </div>
                </div>

                {/* Sede */}
                <p className="text-center text-xs text-muted-foreground mt-3">
                  📍 {match.court}
                </p>
              </div>

              {/* Eventos (máx 2 goles/eventos) */}
              {match.events && match.events.length > 0 && (
                <div className="px-5 py-3 border-t border-border/60 bg-muted/20">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Eventos
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {match.events.slice(0, 4).map((ev, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                          ev.type === "goal"   ? "bg-green-100 text-green-700" :
                          ev.type === "yellow" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}
                      >
                        {ev.type === "goal" ? "⚽" : ev.type === "yellow" ? "🟨" : "🟥"}
                        {" "}{ev.player.split(" ")[0]} {ev.minute}
                      </span>
                    ))}
                    {match.events.length > 4 && (
                      <span className="text-[11px] text-muted-foreground self-center">
                        +{match.events.length - 4} más
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Estadísticas rápidas (posesión) si existen */}
              {match.stats && match.homeScore !== undefined && (
                <div className="px-5 py-3 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-foreground tabular-nums w-8 text-right">
                      {match.stats.home.possession}%
                    </span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${match.stats.home.possession}%` }}
                      />
                    </div>
                    <span className="font-bold text-foreground tabular-nums w-8">
                      {match.stats.away.possession}%
                    </span>
                    <span className="text-muted-foreground ml-1">posesión</span>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="px-5 py-3 bg-muted/10 group-hover:bg-primary/5 transition-colors text-center">
                <span className="text-xs font-bold text-primary flex items-center justify-center gap-1">
                  <Play className="w-3 h-3" /> Ver detalles
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Trophy className="w-14 h-14 text-muted-foreground opacity-20" />
          <div>
            <p className="text-lg font-bold text-muted-foreground">
              {activeStatus === "live"     && "No hay partidos en vivo"}
              {activeStatus === "today"    && "No hay partidos hoy"}
              {activeStatus === "upcoming" && "No hay próximos partidos"}
              {activeStatus === "finished" && "No hay partidos finalizados"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters
                ? "Prueba cambiando los filtros"
                : insideDisciplina
                  ? `Cuando haya partidos de ${disciplina} aparecerán aquí`
                  : "Los partidos aparecerán aquí cuando estén disponibles"}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => { setSelectedSport(""); setSearchTeam(""); }}
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}