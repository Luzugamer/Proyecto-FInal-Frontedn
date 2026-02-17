import { useMemo, useState } from "react";
import { Trophy, BarChart3, Table as TableIcon, Download, Share2, RefreshCw, Search } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface PosicionesTabProps {
  tournamentSlug: string;
}

interface StandingsTeam {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  gc: number;
  gd: number;
  points: number;
  racha: string[];
}

export function PosicionesTab({ tournamentSlug }: PosicionesTabProps) {
  const allMatches = getMatchesByTournament(tournamentSlug);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");
  const [searchTerm, setSearchTerm] = useState("");

  const sports = useMemo(() => {
    const sportSet = new Set(allMatches.map((m) => m.sport));
    return Array.from(sportSet).sort();
  }, [allMatches]);

  useMemo(() => {
    if (sports.length > 0 && !selectedSport) {
      setSelectedSport(sports[0]);
    }
  }, [sports, selectedSport]);

  const standingsBySport = useMemo(() => {
    const standings: Record<string, StandingsTeam[]> = {};

    sports.forEach((sport) => {
      standings[sport] = [];
    });

    allMatches
      .filter((m) => m.status === "finished")
      .forEach((match) => {
        const sport = match.sport;
        const teamsInSport = standings[sport] || [];
        
        const getOrCreateTeam = (name: string) => {
          let team = teamsInSport.find((t) => t.name === name);
          if (!team) {
            team = {
              name,
              played: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              gf: 0,
              gc: 0,
              gd: 0,
              points: 0,
              racha: [],
            };
            teamsInSport.push(team);
          }
          return team;
        };

        const homeTeam = getOrCreateTeam(match.home);
        const awayTeam = getOrCreateTeam(match.away);

        homeTeam.played++;
        awayTeam.played++;
        homeTeam.gf += match.homeScore || 0;
        homeTeam.gc += match.awayScore || 0;
        awayTeam.gf += match.awayScore || 0;
        awayTeam.gc += match.homeScore || 0;

        if (match.homeScore > match.awayScore) {
          homeTeam.wins++;
          homeTeam.points += 3;
          homeTeam.racha.push("W");
          awayTeam.losses++;
          awayTeam.racha.push("L");
        } else if (match.homeScore < match.awayScore) {
          awayTeam.wins++;
          awayTeam.points += 3;
          awayTeam.racha.push("W");
          homeTeam.losses++;
          homeTeam.racha.push("L");
        } else {
          homeTeam.draws++;
          homeTeam.points += 1;
          homeTeam.racha.push("D");
          awayTeam.draws++;
          awayTeam.points += 1;
          awayTeam.racha.push("D");
        }

        homeTeam.gd = homeTeam.gf - homeTeam.gc;
        awayTeam.gd = awayTeam.gf - awayTeam.gc;
      });

    Object.keys(standings).forEach((sport) => {
      standings[sport] = standings[sport].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });
    });

    return standings;
  }, [allMatches, sports]);

  const currentStandings = useMemo(() => {
    let data = (selectedSport && standingsBySport[selectedSport]) || [];
    if (searchTerm) {
      data = data.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data;
  }, [selectedSport, standingsBySport, searchTerm]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    return currentStandings.map(t => ({
      name: t.name,
      puntos: t.points,
      gf: t.gf,
      gc: t.gc,
      victorias: t.wins,
      empates: t.draws,
      derrotas: t.losses,
    }));
  }, [currentStandings]);

  const COLORS = ["#00873E", "#D4AF37", "#005a2a", "#87a38d", "#e0e0e0"];

  if (sports.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-xl font-medium text-muted-foreground">No hay resultados registrados aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={viewMode === "table" ? "white" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "shadow-sm bg-white" : ""}
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Tabla
            </Button>
            <Button
              variant={viewMode === "charts" ? "white" : "ghost"}
              size="sm"
              onClick={() => setViewMode("charts")}
              className={viewMode === "charts" ? "shadow-sm bg-white" : ""}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Gráficos
            </Button>
          </div>
          <div className="h-8 w-px bg-border mx-2 hidden sm:block" />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar facultad..."
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sport Selector Tabs */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2">
          {sports.map((sport) => (
            <Button
              key={sport}
              variant={selectedSport === sport ? "default" : "secondary"}
              onClick={() => setSelectedSport(sport)}
              className="whitespace-nowrap h-10 px-6 font-bold"
            >
              {sport}
            </Button>
          ))}
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/5 border-b border-border">
                <tr>
                  <th className="px-4 py-4 text-center font-bold text-foreground w-12">#</th>
                  <th className="px-4 py-4 text-left font-bold text-foreground">Facultad</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">PJ</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">G</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">E</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">P</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">GF</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">GC</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">DG</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">Pts</th>
                  <th className="px-4 py-4 text-center font-bold text-foreground">Racha</th>
                </tr>
              </thead>
              <tbody>
                {currentStandings.map((team, idx) => (
                  <tr
                    key={team.name}
                    className={`border-b border-border hover:bg-primary/5 transition-colors ${
                      idx < 2 ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-center font-bold">
                      <div className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs ${
                        idx === 0 ? "bg-yellow-500 text-white" : 
                        idx === 1 ? "bg-slate-400 text-white" : 
                        idx === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
                        {team.name === "Agronomía" ? "🌾" : 
                         team.name === "Ingeniería" ? "⚙️" : 
                         team.name === "Zootecnia" ? "🐄" : "🏫"}
                      </div>
                      {team.name}
                    </td>
                    <td className="px-4 py-4 text-center">{team.played}</td>
                    <td className="px-4 py-4 text-center text-green-600 font-semibold">{team.wins}</td>
                    <td className="px-4 py-4 text-center text-yellow-600 font-semibold">{team.draws}</td>
                    <td className="px-4 py-4 text-center text-red-600 font-semibold">{team.losses}</td>
                    <td className="px-4 py-4 text-center">{team.gf}</td>
                    <td className="px-4 py-4 text-center">{team.gc}</td>
                    <td className={`px-4 py-4 text-center font-bold ${team.gd > 0 ? "text-green-600" : team.gd < 0 ? "text-red-600" : ""}`}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    <td className="px-4 py-4 text-center font-black text-primary text-base">{team.points}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {team.racha.slice(-5).map((r, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold text-white ${
                              r === "W" ? "bg-green-500" : r === "L" ? "bg-red-500" : "bg-yellow-500"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-muted/30 p-4 border-t text-xs text-muted-foreground flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-yellow-500 rounded-sm" /> Clasificación Directa
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-400 rounded-sm" /> Zona de Repechaje
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Ranking de Puntos */}
          <CardChart title="Ranking General (Puntos)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 135, 62, 0.1)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="puntos" fill="#00873E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardChart>

          {/* Gráfico Circular - Victorias/Empates/Derrotas */}
          <CardChart title="Distribución de Resultados">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Victorias', value: chartData.reduce((acc, curr) => acc + curr.victorias, 0) },
                    { name: 'Empates', value: chartData.reduce((acc, curr) => acc + curr.empates, 0) },
                    { name: 'Derrotas', value: chartData.reduce((acc, curr) => acc + curr.derrotas, 0) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardChart>

          {/* Gráfico Comparativo - GF vs GC */}
          <CardChart title="Goles a Favor vs En Contra">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gf" name="A Favor" fill="#00873E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gc" name="En Contra" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardChart>

          {/* Gráfico de Radar - Estadísticas */}
          <CardChart title="Rendimiento por Facultad">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.slice(0, 5)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis />
                <Radar
                  name="Puntos"
                  dataKey="puntos"
                  stroke="#00873E"
                  fill="#00873E"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardChart>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-8 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Actualizado en tiempo real (WebSockets activos)
        </div>
        <div>
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function CardChart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-foreground mb-6 flex items-center justify-between">
        {title}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="w-3 h-3" />
        </Button>
      </h3>
      {children}
    </div>
  );
}
