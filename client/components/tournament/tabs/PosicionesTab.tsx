import { useMemo } from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { type DisciplinaConfig } from "@/lib/disciplinaConfig";

interface PosicionesTabProps {
  tournamentSlug: string;
  disciplina: string;
  /** Config de la disciplina. Viene de disciplinaConfig.ts vía DisciplinasTab */
  config: DisciplinaConfig;
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

function getFacultadEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("agro") || n.includes("agronomía")) return "🌾";
  if (n.includes("zoo") || n.includes("zootecnia"))  return "🐄";
  if (n.includes("ing") || n.includes("informática") || n.includes("sistemas")) return "⚙️";
  if (n.includes("med") || n.includes("medicina"))  return "🩺";
  if (n.includes("enf") || n.includes("enfermería")) return "💊";
  if (n.includes("der") || n.includes("derecho"))   return "⚖️";
  if (n.includes("econ") || n.includes("economía")) return "💰";
  if (n.includes("for") || n.includes("forestal"))  return "🌲";
  if (n.includes("edu") || n.includes("educación")) return "📚";
  if (n.includes("soc") || n.includes("social"))    return "🤝";
  return "🏫";
}

// ─── Banner de clasificación ──────────────────────────────────────────────────

function ClasificacionBanner({ config }: { config: DisciplinaConfig }) {
  // Solo mostrar si la disciplina tiene una fase siguiente
  if (config.sistemaCompetencia === "grupos") return null;
  if (config.equiposClasifican <= 0) return null;

  const yaEnEliminacion = config.faseActual === "eliminacion" || config.faseActual === "finalizado";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-4 ${
      yaEnEliminacion
        ? "bg-gray-50 border border-gray-200 text-gray-500"
        : "bg-green-50 border border-green-200"
    }`}>
      <div className="flex items-center gap-2">
        <span className="text-base">{yaEnEliminacion ? "✅" : "🎯"}</span>
        <span className={yaEnEliminacion ? "text-gray-600" : "text-green-800"}>
          {yaEnEliminacion ? (
            <>Los <strong>Top {config.equiposClasifican}</strong> de cada grupo ya clasificaron al bracket.</>
          ) : (
            <>
              <strong>Top {config.equiposClasifican}</strong> de cada grupo
              {config.numGrupos > 1 && ` (${config.numGrupos} grupos)`} avanzan a{" "}
              <strong>eliminación directa</strong>.
            </>
          )}
        </span>
      </div>
      {!yaEnEliminacion && (
        <span className="ml-auto flex items-center gap-1 text-xs text-green-700 font-semibold whitespace-nowrap">
          Bracket de {config.equiposEnBracket}
          <ArrowRight className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function PosicionesTab({ tournamentSlug, disciplina, config }: PosicionesTabProps) {
  const allMatches = getMatchesByTournament(tournamentSlug);

  const standings = useMemo<StandingsTeam[]>(() => {
    const teams: StandingsTeam[] = [];

    const getOrCreate = (name: string): StandingsTeam => {
      let t = teams.find((x) => x.name === name);
      if (!t) {
        t = { name, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, gc: 0, gd: 0, points: 0, racha: [] };
        teams.push(t);
      }
      return t;
    };

    allMatches
      .filter((m) => m.status === "finished" && m.sport === disciplina)
      .forEach((m) => {
        const home = getOrCreate(m.home);
        const away = getOrCreate(m.away);

        home.played++; away.played++;
        home.gf += m.homeScore ?? 0; home.gc += m.awayScore ?? 0;
        away.gf += m.awayScore ?? 0; away.gc += m.homeScore ?? 0;

        if ((m.homeScore ?? 0) > (m.awayScore ?? 0)) {
          home.wins++; home.points += 3; home.racha.push("W");
          away.losses++; away.racha.push("L");
        } else if ((m.homeScore ?? 0) < (m.awayScore ?? 0)) {
          away.wins++; away.points += 3; away.racha.push("W");
          home.losses++; home.racha.push("L");
        } else {
          home.draws++; home.points += 1; home.racha.push("D");
          away.draws++; away.points += 1; away.racha.push("D");
        }

        home.gd = home.gf - home.gc;
        away.gd = away.gf - away.gc;
      });

    return teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
  }, [allMatches, disciplina]);

  // Cuántos equipos por grupo clasifican (para resaltar las filas correctas)
  // Si numGrupos > 0 asumimos que todos los equipos en standings son de UN grupo (demo).
  // En producción, la tabla estaría segmentada por grupo.
  const numClasifican = config.equiposClasifican ?? 0;

  if (standings.length === 0) {
    return (
      <>
        <ClasificacionBanner config={config} />
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Trophy className="w-14 h-14 text-muted-foreground opacity-20" />
          <div>
            <p className="text-lg font-bold text-muted-foreground">Sin resultados aún</p>
            <p className="text-sm text-muted-foreground mt-1">
              Los partidos finalizados de <strong>{disciplina}</strong> aparecerán aquí.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

      <ClasificacionBanner config={config} />

      {/* Tabla principal */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 border-b border-border">
              <tr>
                <th className="px-4 py-4 text-center font-bold text-foreground w-12">#</th>
                <th className="px-4 py-4 text-left font-bold text-foreground">Facultad</th>
                <th className="px-4 py-4 text-center font-bold text-foreground" title="Partidos Jugados">PJ</th>
                <th className="px-4 py-4 text-center font-bold text-green-700" title="Ganados">G</th>
                <th className="px-4 py-4 text-center font-bold text-yellow-600" title="Empates">E</th>
                <th className="px-4 py-4 text-center font-bold text-red-600" title="Perdidos">P</th>
                <th className="px-4 py-4 text-center font-bold text-foreground" title="Goles a favor">GF</th>
                <th className="px-4 py-4 text-center font-bold text-foreground" title="Goles en contra">GC</th>
                <th className="px-4 py-4 text-center font-bold text-foreground" title="Diferencia de goles">DG</th>
                <th className="px-4 py-4 text-center font-bold text-primary" title="Puntos">Pts</th>
                <th className="px-4 py-4 text-center font-bold text-foreground hidden md:table-cell">Racha</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, idx) => {
                // Zona visual según posición y reglas de clasificación
                const clasifica  = numClasifican > 0 && idx < numClasifican;
                const repechaje  = numClasifican > 0 && idx === numClasifican;
                const eliminado  = numClasifican > 0 && idx > numClasifican;

                return (
                  <tr
                    key={team.name}
                    className={`border-b border-border hover:bg-primary/5 transition-colors ${
                      clasifica ? "bg-green-50/50" : repechaje ? "bg-yellow-50/30" : ""
                    }`}
                  >
                    {/* Posición */}
                    <td className="px-4 py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${
                        idx === 0 ? "bg-yellow-400 text-yellow-900" :
                        idx === 1 ? "bg-slate-400 text-white" :
                        idx === 2 ? "bg-amber-600 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </div>
                    </td>

                    {/* Facultad + badges */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 font-bold">
                        <span className="text-xl leading-none">{getFacultadEmoji(team.name)}</span>
                        <span>{team.name}</span>
                        {clasifica && config.faseActual === "grupos" && (
                          <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 whitespace-nowrap">
                            Clasifica
                          </span>
                        )}
                        {clasifica && config.faseActual === "eliminacion" && (
                          <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                            En bracket
                          </span>
                        )}
                        {repechaje && (
                          <span className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200 whitespace-nowrap">
                            Repechaje
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center text-foreground">{team.played}</td>
                    <td className="px-4 py-4 text-center text-green-600 font-semibold">{team.wins}</td>
                    <td className="px-4 py-4 text-center text-yellow-600 font-semibold">{team.draws}</td>
                    <td className="px-4 py-4 text-center text-red-600 font-semibold">{team.losses}</td>
                    <td className="px-4 py-4 text-center">{team.gf}</td>
                    <td className="px-4 py-4 text-center">{team.gc}</td>
                    <td className={`px-4 py-4 text-center font-bold ${
                      team.gd > 0 ? "text-green-600" : team.gd < 0 ? "text-red-600" : "text-muted-foreground"
                    }`}>
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    <td className="px-4 py-4 text-center font-black text-primary text-base">{team.points}</td>

                    {/* Racha últimos 5 */}
                    <td className="px-4 py-4 text-center hidden md:table-cell">
                      <div className="flex justify-center gap-1">
                        {team.racha.slice(-5).map((r, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold text-white ${
                              r === "W" ? "bg-green-500" : r === "L" ? "bg-red-500" : "bg-yellow-400"
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leyenda dinámica según el sistema */}
        <div className="bg-muted/30 px-4 py-3 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
          {numClasifican > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-400" />
              {config.faseActual === "eliminacion" ? "Ya clasificó" : `Clasifica (Top ${numClasifican})`}
            </div>
          )}
          {numClasifican > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-yellow-400" />
              Zona de repechaje
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto font-medium">
            G = Ganados · E = Empates · P = Perdidos · GF/GC = Goles · DG = Diferencia
          </div>
        </div>
      </div>
    </div>
  );
}