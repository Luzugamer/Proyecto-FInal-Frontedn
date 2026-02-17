import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Play, Clock, Trophy, Users, Zap, Search, X } from "lucide-react";
import { mockMatches, Match } from "@/lib/mockMatches";

const sports = Array.from(new Set(mockMatches.map((m) => m.sport)));
const tournaments = Array.from(new Set(mockMatches.map((m) => m.tournament)));

export default function Matches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || "en-vivo";
  const [activeTab, setActiveTab] = useState<
    "en-vivo" | "hoy" | "proximos" | "resultados"
  >(tabFromParams as "en-vivo" | "hoy" | "proximos" | "resultados");

  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTeam, setSearchTeam] = useState<string>("");

  const handleTabChange = (
    tab: "en-vivo" | "hoy" | "proximos" | "resultados",
  ) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const filteredMatches = useMemo(() => {
    let matches = mockMatches.filter((match) => {
      const statusMatch =
        (activeTab === "en-vivo" && match.status === "live") ||
        (activeTab === "hoy" && match.status === "today") ||
        (activeTab === "proximos" && match.status === "upcoming") ||
        (activeTab === "resultados" && match.status === "finished");

      const sportMatch = !selectedSport || match.sport === selectedSport;
      const tournamentMatch =
        !selectedTournament || match.tournament === selectedTournament;
      const dateMatch = !selectedDate || match.date === selectedDate;
      const teamMatch =
        !searchTeam ||
        match.home.toLowerCase().includes(searchTeam.toLowerCase()) ||
        match.away.toLowerCase().includes(searchTeam.toLowerCase());

      return (
        statusMatch && sportMatch && tournamentMatch && dateMatch && teamMatch
      );
    });

    return matches.sort(
      (a, b) =>
        new Date(b.date + " " + b.time).getTime() -
        new Date(a.date + " " + a.time).getTime(),
    );
  }, [activeTab, selectedSport, selectedTournament, selectedDate, searchTeam]);

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
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">PARTIDOS</h1>
          <p className="text-lg text-muted-foreground">
            Explora todos los partidos de Interfacultades y Cachimbos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-border">
          {["en-vivo", "hoy", "proximos", "resultados"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                handleTabChange(
                  tab as "en-vivo" | "hoy" | "proximos" | "resultados",
                )
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
              {tab === "resultados" && "Resultados"}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Deporte */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Deporte
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Todos</option>
                {sports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>

            {/* Torneo */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Torneo
              </label>
              <select
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Todos</option>
                {tournaments.map((tournament) => (
                  <option key={tournament} value={tournament}>
                    {tournament}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              />
            </div>

            {/* Buscar Equipo */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">
                Equipo
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar equipo..."
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
                />
                {searchTeam && (
                  <button
                    onClick={() => setSearchTeam("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <Link
                key={match.id}
                to={`/partidos/${match.id}`}
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
                  <span className="text-xs text-muted-foreground">
                    {match.tournament}
                  </span>
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
    </div>
  );
}
