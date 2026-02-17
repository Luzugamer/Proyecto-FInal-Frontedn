import { useState } from "react";
import { ChevronDown, Trophy, AlertCircle, TrendingUp } from "lucide-react";

interface Goal {
  player: string;
  minute: string;
}

interface Card {
  player: string;
  minute: string;
  type: "yellow" | "red";
}

interface Result {
  id: number;
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  tournament: string;
  court: string;
  homeGoals: Goal[];
  awayGoals: Goal[];
  homeCards: Card[];
  awayCards: Card[];
}

const mockResults: Result[] = [
  {
    id: 1,
    date: "2026-02-08",
    home: "Agronomía",
    away: "Zootecnia",
    homeScore: 3,
    awayScore: 2,
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    homeGoals: [
      { player: "Carlos López", minute: "15'" },
      { player: "Juan Martínez", minute: "42'" },
      { player: "Carlos López", minute: "78'" },
    ],
    awayGoals: [
      { player: "Mario García", minute: "25'" },
      { player: "Pedro Sánchez", minute: "65'" },
    ],
    homeCards: [{ player: "Luis Rodríguez", minute: "55'", type: "yellow" }],
    awayCards: [
      { player: "Roberto Flores", minute: "40'", type: "yellow" },
      { player: "Mario García", minute: "87'", type: "red" },
    ],
  },
  {
    id: 2,
    date: "2026-02-06",
    home: "Enfermería",
    away: "Forestales",
    homeScore: 2,
    awayScore: 1,
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Estadio UNAS",
    homeGoals: [
      { player: "Ana Silva", minute: "20'" },
      { player: "María López", minute: "88'" },
    ],
    awayGoals: [{ player: "Paula Sánchez", minute: "45'" }],
    homeCards: [],
    awayCards: [{ player: "Laura García", minute: "75'", type: "yellow" }],
  },
  {
    id: 3,
    date: "2026-02-05",
    home: "Ingeniería",
    away: "Economía",
    homeScore: 1,
    awayScore: 1,
    sport: "Fútbol",
    tournament: "Interfacultades",
    court: "Cancha 1",
    homeGoals: [{ player: "Rafael Torres", minute: "32'" }],
    awayGoals: [{ player: "Fernando López", minute: "67'" }],
    homeCards: [
      { player: "Carlos Mendez", minute: "45'", type: "yellow" },
      { player: "Diego Ruiz", minute: "91'", type: "yellow" },
    ],
    awayCards: [],
  },
  {
    id: 4,
    date: "2026-02-03",
    home: "Medicina",
    away: "Derecho",
    homeScore: 4,
    awayScore: 0,
    sport: "Fútbol",
    tournament: "Cachimbos",
    court: "Cancha 2",
    homeGoals: [
      { player: "Jorge Pérez", minute: "12'" },
      { player: "Santiago Díaz", minute: "28'" },
      { player: "Jorge Pérez", minute: "56'" },
      { player: "Eduardo Gómez", minute: "79'" },
    ],
    awayGoals: [],
    homeCards: [],
    awayCards: [{ player: "Óscar Vega", minute: "68'", type: "yellow" }],
  },
];

const sports = ["Fútbol", "Vóley", "Básquet", "Futsal"];
const tournaments = ["Interfacultades", "Cachimbos"];
const teams = [
  "Agronomía",
  "Zootecnia",
  "Enfermería",
  "Forestales",
  "Ingeniería",
  "Economía",
  "Medicina",
  "Derecho",
];

export default function Results() {
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const filteredResults = mockResults.filter((result) => {
    const sportMatch = !selectedSport || result.sport === selectedSport;
    const tournamentMatch = !selectedTournament || result.tournament === selectedTournament;
    const teamMatch =
      !selectedTeam || result.home === selectedTeam || result.away === selectedTeam;
    const dateMatch = !selectedDate || result.date === selectedDate;

    return sportMatch && tournamentMatch && teamMatch && dateMatch;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "recent" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const getWinner = (result: Result) => {
    if (result.homeScore > result.awayScore) return "home";
    if (result.awayScore > result.homeScore) return "away";
    return "draw";
  };

  return (
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">RESULTADOS</h1>
          <p className="text-lg text-muted-foreground">
            Revisa los resultados de todos los partidos finalizados
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Deporte Filter */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Deporte</label>
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

            {/* Torneo Filter */}
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

            {/* Equipo Filter */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Equipo</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="">Todos</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Filter */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Ordenar</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="recent">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {sortedResults.length > 0 ? (
            sortedResults.map((result) => {
              const winner = getWinner(result);
              return (
                <div
                  key={result.id}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Main Result Card */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      {/* Left Team */}
                      <div className="flex-1 text-center md:text-right">
                        <p className="text-lg font-bold text-foreground mb-2">{result.home}</p>
                        <p
                          className={`text-5xl font-bold ${
                            winner === "home" ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {result.homeScore}
                        </p>
                      </div>

                      {/* vs */}
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-muted-foreground font-bold">vs</p>
                        <div className="flex gap-2">
                          <span className="text-xs font-bold bg-primary-100 text-primary px-3 py-1 rounded-full">
                            {result.sport}
                          </span>
                          <span className="text-xs font-bold bg-secondary-100 text-secondary px-3 py-1 rounded-full">
                            {result.tournament}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          {winner === "home" && "Victoria Local"}
                          {winner === "away" && "Victoria Visitante"}
                          {winner === "draw" && "Empate"}
                        </div>
                      </div>

                      {/* Right Team */}
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-lg font-bold text-foreground mb-2">{result.away}</p>
                        <p
                          className={`text-5xl font-bold ${
                            winner === "away" ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {result.awayScore}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() =>
                          setExpandedResult(expandedResult === result.id ? null : result.id)
                        }
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        Detalles
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedResult === result.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Date and Location */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>📅 {new Date(result.date).toLocaleDateString("es-ES")}</span>
                      <span>📍 {result.court}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedResult === result.id && (
                    <div className="bg-primary-50 border-t border-border p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Home Team Details */}
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-lg">{result.home}</h4>

                          {/* Goals */}
                          {result.homeGoals.length > 0 && (
                            <div className="mb-6">
                              <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                ⚽ Goles ({result.homeGoals.length})
                              </p>
                              <div className="space-y-2">
                                {result.homeGoals.map((goal, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-border"
                                  >
                                    <span className="font-semibold text-foreground">
                                      {goal.player}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{goal.minute}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cards */}
                          {result.homeCards.length > 0 && (
                            <div>
                              <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Tarjetas (
                                {result.homeCards.length})
                              </p>
                              <div className="space-y-2">
                                {result.homeCards.map((card, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-border"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-4 h-6 rounded ${
                                          card.type === "yellow"
                                            ? "bg-yellow-400"
                                            : "bg-red-500"
                                        }`}
                                      ></div>
                                      <span className="font-semibold text-foreground">
                                        {card.player}
                                      </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {card.minute}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Away Team Details */}
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-lg">{result.away}</h4>

                          {/* Goals */}
                          {result.awayGoals.length > 0 && (
                            <div className="mb-6">
                              <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                ⚽ Goles ({result.awayGoals.length})
                              </p>
                              <div className="space-y-2">
                                {result.awayGoals.map((goal, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-border"
                                  >
                                    <span className="font-semibold text-foreground">
                                      {goal.player}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{goal.minute}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cards */}
                          {result.awayCards.length > 0 && (
                            <div>
                              <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Tarjetas (
                                {result.awayCards.length})
                              </p>
                              <div className="space-y-2">
                                {result.awayCards.map((card, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-border"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-4 h-6 rounded ${
                                          card.type === "yellow"
                                            ? "bg-yellow-400"
                                            : "bg-red-500"
                                        }`}
                                      ></div>
                                      <span className="font-semibold text-foreground">
                                        {card.player}
                                      </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {card.minute}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statistics Link */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <button className="flex items-center gap-2 text-primary hover:text-primary-700 font-bold transition-colors">
                          <TrendingUp className="w-5 h-5" />
                          Ver estadísticas completas
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No hay resultados con los filtros seleccionados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
