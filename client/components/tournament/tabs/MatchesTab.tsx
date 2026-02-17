import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Clock, Play, Trophy, Search, X, Zap, RotateCcw } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";

interface MatchesTabProps {
  tournamentId: string;
  tournamentSlug: string;
  userRole?: string;
}

export function MatchesTab({
  tournamentId,
  tournamentSlug,
  userRole,
}: MatchesTabProps) {
  const [activeTab, setActiveTab] = useState<
    "en-vivo" | "hoy" | "proximos" | "pasados"
  >("en-vivo");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [searchTeam, setSearchTeam] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const matches = getMatchesByTournament(tournamentSlug);

  // Extract unique sports
  const sports = Array.from(new Set(matches.map((m) => m.sport)));

  const filteredMatches = useMemo(() => {
    return matches
      .filter((match) => {
        const statusMatch =
          (activeTab === "en-vivo" && match.status === "live") ||
          (activeTab === "hoy" && match.status === "today") ||
          (activeTab === "proximos" && match.status === "upcoming") ||
          (activeTab === "pasados" && match.status === "finished");

        const sportMatch = !selectedSport || match.sport === selectedSport;
        const teamMatch =
          !searchTeam ||
          match.home.toLowerCase().includes(searchTeam.toLowerCase()) ||
          match.away.toLowerCase().includes(searchTeam.toLowerCase());

        return statusMatch && sportMatch && teamMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.date + " " + b.time).getTime() -
          new Date(a.date + " " + a.time).getTime(),
      );
  }, [activeTab, selectedSport, searchTeam, matches]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <span className="inline-flex items-center gap-1 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
            EN VIVO
          </span>
        );
      case "today":
        return (
          <span className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3 h-3" />
            HOY
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
            PRÓXIMO
          </span>
        );
      case "finished":
        return (
          <span className="inline-flex items-center gap-1 bg-muted-foreground text-white px-3 py-1 rounded-full text-xs font-bold">
            FINALIZADO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {["en-vivo", "hoy", "proximos", "pasados"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "en-vivo" | "hoy" | "proximos" | "pasados")
            }
            className={`whitespace-nowrap px-6 py-3 font-bold transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "en-vivo" && "En Vivo"}
            {tab === "hoy" && "Hoy"}
            {tab === "proximos" && "Próximos"}
            {tab === "pasados" && "Pasados"}
          </button>
        ))}
      </div>

      {/* Search Bar with Filter Toggle */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative group flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="🔍 Buscar equipo..."
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 md:py-4 text-base md:text-lg border-2 border-primary/20 rounded-2xl focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-white transition-all duration-300 hover:border-primary/40"
          />
          {searchTeam && (
            <button
              onClick={() => setSearchTeam("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3.5 md:py-4 border-2 rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            showFilters
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-white border-primary/20 text-foreground hover:border-primary/40"
          }`}
        >
          ⚽ Deporte
        </button>
      </div>

      {/* Collapsible Filters */}
      {showFilters && (
        <div className="bg-gradient-to-br from-white via-primary-50/30 to-white rounded-2xl border-2 border-primary/10 p-6 md:p-8 shadow-lg shadow-primary/5 backdrop-blur-sm animate-fade-in mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Deporte Filter */}
            <div className="group">
              <label className="block text-sm font-bold text-foreground mb-2.5 flex items-center gap-2">
                <span className="text-lg">⚽</span>
                Deporte
              </label>
              <div className="relative">
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-primary/20 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all duration-300 hover:border-primary/40 cursor-pointer font-medium appearance-none text-sm"
                >
                  <option value="">Todos</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setSelectedSport("");
                setSearchTeam("");
              }}
              disabled={!selectedSport && !searchTeam}
              className="px-4 py-2.5 border-2 border-dashed border-primary/30 hover:border-primary/60 rounded-xl font-bold text-primary hover:bg-primary/5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 items-center mt-4 pt-4 border-t border-primary/10">
            {(selectedSport || searchTeam) && (
              <span className="text-xs font-bold text-muted-foreground">
                Filtros activos:
              </span>
            )}
            {selectedSport && (
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-xs font-medium text-primary animate-scale-in">
                {selectedSport}
                <button
                  onClick={() => setSelectedSport("")}
                  className="ml-1 hover:text-primary/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Link
              key={match.id}
              to={`/torneo/${tournamentSlug}/partidos/${match.id}`}
              className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusBadge(match.status)}
                  <span className="text-xs font-bold text-muted-foreground bg-white px-2 py-1 rounded">
                    {match.sport}
                  </span>
                </div>
              </div>

              {/* Score Section */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 items-center mb-4">
                  {/* Home */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-2 line-clamp-2">
                      {match.home}
                    </p>
                    {match.homeScore !== undefined && (
                      <p className="text-3xl font-bold text-primary">
                        {match.homeScore}
                      </p>
                    )}
                  </div>

                  {/* vs */}
                  <div className="flex flex-col items-center gap-1">
                    {match.homeScore !== undefined && (
                      <p className="text-lg font-bold text-muted-foreground">
                        -
                      </p>
                    )}
                    {match.status === "today" && (
                      <p className="text-xs font-bold text-primary">
                        {match.time}
                      </p>
                    )}
                    {match.status === "upcoming" && (
                      <p className="text-xs font-bold text-secondary">
                        {match.time}
                      </p>
                    )}
                  </div>

                  {/* Away */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground mb-2 line-clamp-2">
                      {match.away}
                    </p>
                    {match.awayScore !== undefined && (
                      <p className="text-3xl font-bold text-primary">
                        {match.awayScore}
                      </p>
                    )}
                  </div>
                </div>

                {/* Events Summary */}
                {match.events && match.events.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-primary/20">
                    <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Eventos
                    </p>
                    <div className="space-y-1">
                      {match.events.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-muted-foreground"
                        >
                          <span className="font-bold text-foreground">
                            {event.player}
                          </span>{" "}
                          ({event.minute})
                        </div>
                      ))}
                      {match.events.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{match.events.length - 2} más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Summary */}
                {match.stats && (
                  <div className="mb-4 pt-4 border-t border-primary/20">
                    <p className="text-xs font-bold text-muted-foreground mb-3">
                      Estadísticas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Posesión</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-foreground">{match.stats.home.possession}%</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-bold text-foreground">{match.stats.away.possession}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tiros</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-foreground">{match.stats.home.shots}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-bold text-foreground">{match.stats.away.shots}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">A Portería</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-foreground">{match.stats.home.shotsOnTarget}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-bold text-foreground">{match.stats.away.shotsOnTarget}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Info */}
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-primary/20">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {match.time}
                  </p>
                  <p className="flex items-center gap-1">📍 {match.court}</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="bg-primary-50 px-6 py-3 text-center group-hover:bg-primary-100 transition-colors">
                <p className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                  <Play className="w-3 h-3" /> Ver detalles
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No hay partidos con esos filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
