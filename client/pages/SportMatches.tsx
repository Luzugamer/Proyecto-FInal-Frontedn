import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronLeft, Play, Clock, Trophy, Users, Zap, Search, X } from "lucide-react";

interface Match {
  id: number;
  date: string;
  time: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  sport: string;
  tournament: string;
  court: string;
  status: "live" | "today" | "upcoming" | "finished";
  events?: { type: "goal" | "yellow" | "red"; team: string; player: string; minute: string }[];
}

const mockMatches: Match[] = [
  {
    id: 1,
    date: "2026-02-07",
    time: "10:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 1,
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    status: "live",
    events: [
      { type: "goal", team: "Agronomía", player: "Carlos López", minute: "15'" },
      { type: "goal", team: "Zootecnia", player: "Mario García", minute: "32'" },
    ],
  },
  {
    id: 2,
    date: "2026-02-07",
    time: "14:00",
    home: "Enfermería",
    away: "Forestales",
    homeScore: 2,
    awayScore: 1,
    sport: "Vóley",
    tournament: "Interfacultades",
    court: "Coliseo Cerrado",
    status: "live",
    events: [
      { type: "goal", team: "Enfermería", player: "Ana Silva", minute: "1er Set" },
    ],
  },
  {
    id: 3,
    date: "2026-02-07",
    time: "11:00",
    home: "Ingeniería",
    away: "Economía",
    homeScore: 0,
    awayScore: 0,
    sport: "Básquet",
    tournament: "Interfacultades",
    court: "Cancha 1",
    status: "today",
  },
  {
    id: 4,
    date: "2026-02-07",
    time: "16:00",
    home: "Medicina",
    away: "Derecho",
    sport: "Futsal",
    tournament: "Cachimbos",
    court: "Cancha 2",
    status: "today",
  },
  {
    id: 5,
    date: "2026-02-10",
    time: "10:00",
    home: "Agronomía",
    away: "Ingeniería",
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    status: "upcoming",
  },
  {
    id: 6,
    date: "2026-02-12",
    time: "15:00",
    home: "Zootecnia",
    away: "Economía",
    sport: "Vóley",
    tournament: "Interfacultades",
    court: "Coliseo Cerrado",
    status: "upcoming",
  },
  {
    id: 7,
    date: "2026-02-05",
    time: "14:00",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 2,
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    status: "finished",
    events: [
      { type: "goal", team: "Agronomía", player: "Carlos López", minute: "15'" },
      { type: "goal", team: "Zootecnia", player: "Mario García", minute: "25'" },
      { type: "goal", team: "Agronomía", player: "Juan Martínez", minute: "42'" },
      { type: "yellow", team: "Zootecnia", player: "Roberto Flores", minute: "55'" },
    ],
  },
  {
    id: 8,
    date: "2026-02-03",
    time: "11:00",
    home: "Enfermería",
    away: "Forestales",
    homeScore: 2,
    awayScore: 1,
    sport: "Vóley",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    status: "finished",
  },
];

const sportInfo: Record<
  string,
  {
    name: string;
    emoji: string;
    description: string;
    color: string;
  }
> = {
  futbol: {
    name: "Fútbol",
    emoji: "⚽",
    description: "Sigue todos los partidos de fútbol de Interfacultades y Cachimbos",
    color: "from-green-500 to-green-600",
  },
  voley: {
    name: "Vóley",
    emoji: "🏐",
    description: "Todos los encuentros de voleibol en un solo lugar",
    color: "from-yellow-500 to-yellow-600",
  },
  basquet: {
    name: "Básquet",
    emoji: "🏀",
    description: "Vive la emoción del baloncesto universitario",
    color: "from-orange-500 to-orange-600",
  },
  futsal: {
    name: "Futsal",
    emoji: "⚽",
    description: "La velocidad y emoción del futsal en vivo",
    color: "from-blue-500 to-blue-600",
  },
};

const tournaments = ["Interfacultades", "Cachimbos"];

export default function SportMatches() {
  const { deporte } = useParams<{ deporte: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || "en-vivo";
  const [activeTab, setActiveTab] = useState<"en-vivo" | "hoy" | "proximos" | "resultados">(
    tabFromParams as "en-vivo" | "hoy" | "proximos" | "resultados"
  );

  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTeam, setSearchTeam] = useState<string>("");

  const sport = sportInfo[deporte || "futbol"];
  if (!sport) {
    return (
      <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
        <div className="container mx-auto px-4 text-center py-20">
          <h1 className="text-3xl font-bold text-foreground mb-4">Deporte no encontrado</h1>
          <Link to="/partidos" className="text-primary hover:text-primary-700 font-bold">
            Volver a partidos
          </Link>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: "en-vivo" | "hoy" | "proximos" | "resultados") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const filteredMatches = useMemo(() => {
    let matches = mockMatches.filter((match) => {
      const sportMatch = match.sport === sport.name;
      const statusMatch =
        (activeTab === "en-vivo" && match.status === "live") ||
        (activeTab === "hoy" && match.status === "today") ||
        (activeTab === "proximos" && match.status === "upcoming") ||
        (activeTab === "resultados" && match.status === "finished");

      const tournamentMatch =
        !selectedTournament || match.tournament === selectedTournament;
      const dateMatch = !selectedDate || match.date === selectedDate;
      const teamMatch =
        !searchTeam ||
        match.home.toLowerCase().includes(searchTeam.toLowerCase()) ||
        match.away.toLowerCase().includes(searchTeam.toLowerCase());

      return sportMatch && statusMatch && tournamentMatch && dateMatch && teamMatch;
    });

    return matches.sort(
      (a, b) =>
        new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime()
    );
  }, [activeTab, selectedTournament, selectedDate, searchTeam]);

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
        {/* Back Button */}
        <Link
          to="/partidos"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-bold mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver a partidos
        </Link>

        {/* Sport Header */}
        <div className={`bg-gradient-to-r ${sport.color} rounded-xl p-12 mb-12 text-white`}>
          <div className="flex items-center gap-6 mb-6">
            <span className="text-5xl">{sport.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold">{sport.name}</h1>
              <p className="text-lg text-white/80">{sport.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-border">
          {["en-vivo", "hoy", "proximos", "resultados"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                handleTabChange(tab as "en-vivo" | "hoy" | "proximos" | "resultados")
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Torneo */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Torneo</label>
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
              <label className="block text-sm font-bold text-foreground mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              />
            </div>

            {/* Buscar Equipo */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">Equipo</label>
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
                  <span className="text-xs text-muted-foreground">{match.tournament}</span>
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
                        <p className="text-3xl font-bold text-primary">{match.homeScore}</p>
                      )}
                    </div>

                    {/* vs */}
                    <div className="flex flex-col items-center gap-1">
                      {match.homeScore !== undefined && (
                        <p className="text-lg font-bold text-muted-foreground">-</p>
                      )}
                      {match.status === "today" && (
                        <p className="text-xs font-bold text-primary">{match.time}</p>
                      )}
                      {match.status === "upcoming" && (
                        <p className="text-xs font-bold text-secondary">{match.time}</p>
                      )}
                    </div>

                    {/* Away */}
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground mb-2 line-clamp-2">
                        {match.away}
                      </p>
                      {match.awayScore !== undefined && (
                        <p className="text-3xl font-bold text-primary">{match.awayScore}</p>
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
                          <div key={idx} className="text-xs text-muted-foreground">
                            <span className="font-bold text-foreground">{event.player}</span> (
                            {event.minute})
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
                    <p className="flex items-center gap-1">
                      📍 {match.court}
                    </p>
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
                No hay partidos de {sport.name} con esos filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
