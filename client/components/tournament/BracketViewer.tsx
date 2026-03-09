import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Info } from "lucide-react";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { type DisciplinaConfig } from "@/lib/disciplinaConfig";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface BracketMatch {
  top: string | null;
  bottom: string | null;
  winner: string | null;
}

interface BracketRounds {
  [roundIdx: number]: BracketMatch[];
}

interface BracketViewerProps {
  disciplina?: string;
  config?: DisciplinaConfig;
  tournamentSlug?: string;
}

// ─── Constantes de layout ─────────────────────────────────────────────────────

const SLOT_H      = 36;
const DIVIDER_H   = 4;
const MATCH_H     = SLOT_H * 2 + DIVIDER_H;  // 76px
const MATCH_GAP   = 16;
const CONNECTOR_W = 32;
const COL_W       = 150;

// ─── Helpers de bracket dinámico ─────────────────────────────────────────────

/** Genera nombres de rondas según cuántas rondas hay */
function getRoundNames(numRounds: number): string[] {
  const all = ["Final", "Semifinales", "Cuartos de Final", "Octavos de Final", "16avos de Final"];
  // Tomamos los últimos numRounds desde el más corto (Final) hacia atrás
  return all.slice(0, numRounds).reverse();
}

/** Número de rondas necesarias para N equipos (potencia de 2) */
function calcRounds(teams: number): number {
  if (teams <= 1) return 1;
  return Math.ceil(Math.log2(Math.max(teams, 2)));
}

function getMatchSpacing(r: number): number {
  return (MATCH_H + MATCH_GAP) * Math.pow(2, r);
}

function getTotalHeight(numRounds: number): number {
  const teamsInRound0 = Math.pow(2, numRounds - 1);
  return getMatchSpacing(0) * teamsInRound0;
}

function getMatchTop(r: number, mIdx: number): number {
  const spacing = getMatchSpacing(r);
  return spacing / 2 + mIdx * spacing - MATCH_H / 2;
}

/**
 * Construye el estado inicial del bracket con los equipos dados.
 * Rellena los huecos con null si el número no es potencia de 2.
 */
function buildInitialBracket(teams: string[], numRounds: number): BracketRounds {
  const rounds: BracketRounds = {};
  const matchesR0 = Math.pow(2, numRounds - 1);

  // Rellenar el array de equipos hasta completar una potencia de 2
  const paddedTeams = [...teams];
  while (paddedTeams.length < matchesR0 * 2) paddedTeams.push("");

  rounds[0] = [];
  for (let i = 0; i < matchesR0; i++) {
    rounds[0].push({
      top:    paddedTeams[i * 2]     || null,
      bottom: paddedTeams[i * 2 + 1] || null,
      winner: null,
    });
  }

  for (let r = 1; r < numRounds; r++) {
    const count = Math.pow(2, numRounds - 1 - r);
    rounds[r] = Array.from({ length: count }, () => ({
      top: null, bottom: null, winner: null,
    }));
  }

  return rounds;
}

// ─── Demo teams (fallback cuando no hay equipos reales clasificados) ──────────

const DEMO_TEAMS_16 = [
  "Agronomía", "Ingeniería", "Zootecnia", "Economía",
  "Enfermería", "Forestales", "Ciencias Sociales", "Educación",
  "Medicina", "Derecho", "Administración", "Contabilidad",
  "Sistemas", "Electrónica", "Civil", "Mecánica",
];

// ─── Función para obtener equipos clasificados desde la tabla de posiciones ───

function getClassifiedTeams(
  tournamentSlug: string,
  disciplina: string,
  config: DisciplinaConfig
): string[] {
  if (config.sistemaCompetencia === "eliminacion_directa") {
    // No hay grupos: devolver demo hasta equiposEnBracket
    return DEMO_TEAMS_16.slice(0, config.equiposEnBracket);
  }

  if (!tournamentSlug || !disciplina) return DEMO_TEAMS_16.slice(0, config.equiposEnBracket || 8);

  // Construir tabla de posiciones desde los matches finalizados
  const allMatches = getMatchesByTournament(tournamentSlug);
  const teamMap = new Map<string, { points: number; gd: number; gf: number }>();

  const getOrCreate = (name: string) => {
    if (!teamMap.has(name)) teamMap.set(name, { points: 0, gd: 0, gf: 0 });
    return teamMap.get(name)!;
  };

  allMatches
    .filter((m) => m.status === "finished" && m.sport === disciplina)
    .forEach((m) => {
      const home = getOrCreate(m.home);
      const away = getOrCreate(m.away);
      const hs = m.homeScore ?? 0;
      const as_ = m.awayScore ?? 0;
      home.gf += hs; away.gf += as_;
      home.gd += hs - as_; away.gd += as_ - hs;
      if (hs > as_) { home.points += 3; }
      else if (hs < as_) { away.points += 3; }
      else { home.points += 1; away.points += 1; }
    });

  const sorted = Array.from(teamMap.entries())
    .sort(([, a], [, b]) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    })
    .map(([name]) => name);

  const target = config.equiposEnBracket || 8;

  // Si hay suficientes equipos con partidos, tomar los top N
  if (sorted.length >= 2) {
    const classified = sorted.slice(0, target);
    // Rellenar con demos si faltan
    let demo = DEMO_TEAMS_16.filter((t) => !classified.includes(t));
    while (classified.length < target) classified.push(demo.shift() ?? "???");
    return classified;
  }

  // Fallback: demo completo
  return DEMO_TEAMS_16.slice(0, target);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function BracketViewer({ disciplina, config, tournamentSlug }: BracketViewerProps) {
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMINISTRADOR" || user?.rol === "SUPER_ADMIN";

  // Config con defaults seguros
  const safeConfig: DisciplinaConfig = config ?? {
    sistemaCompetencia: "grupos_y_eliminacion",
    faseActual: "grupos",
    numGrupos: 2,
    equiposClasifican: 2,
    equiposEnBracket: 8,
  };

  // Equipos que entran al bracket
  const bracketTeams = useMemo(
    () => getClassifiedTeams(tournamentSlug ?? "", disciplina ?? "", safeConfig),
    [tournamentSlug, disciplina, safeConfig.equiposEnBracket, safeConfig.sistemaCompetencia]
  );

  const numRounds  = calcRounds(bracketTeams.length);
  const roundNames = getRoundNames(numRounds);
  const totalH     = getTotalHeight(numRounds);

  const [rounds, setRounds] = useState<BracketRounds>({});

  // Reconstruir bracket al cambiar disciplina o equipos
  useEffect(() => {
    setRounds(buildInitialBracket(bracketTeams, numRounds));
  }, [disciplina, bracketTeams.join(","), numRounds]);

  // ── Interacción: elegir ganador ─────────────────────────────────────────

  const pickWinner = (roundIdx: number, matchIdx: number, side: "top" | "bottom") => {
    if (!isAdmin) return;
    const next: BracketRounds = JSON.parse(JSON.stringify(rounds));
    const match = next[roundIdx][matchIdx];
    const team = match[side];
    if (!team) return;

    const prevWinner = match.winner;
    match.winner = match.winner === team ? null : team;

    // Limpiar downstream si cambia el ganador
    if (prevWinner && prevWinner !== team) {
      clearDownstream(next, roundIdx + 1, Math.floor(matchIdx / 2), prevWinner);
    }
    if (match.winner === null) {
      clearDownstream(next, roundIdx + 1, Math.floor(matchIdx / 2), team);
    } else if (roundIdx < numRounds - 1) {
      const nIdx  = Math.floor(matchIdx / 2);
      const nSide = matchIdx % 2 === 0 ? "top" : "bottom";
      next[roundIdx + 1][nIdx][nSide] = team;
    }

    setRounds(next);
  };

  const clearDownstream = (obj: BracketRounds, r: number, mIdx: number, old: string | null) => {
    if (!old || r >= numRounds || !obj[r] || mIdx >= obj[r].length) return;
    const m = obj[r][mIdx];
    if (m.top === old) m.top = null;
    if (m.bottom === old) m.bottom = null;
    if (m.winner === old) {
      m.winner = null;
      clearDownstream(obj, r + 1, Math.floor(mIdx / 2), old);
    }
  };

  const finalRound = rounds[numRounds - 1];
  const champion   = finalRound?.[0]?.winner ?? null;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Contexto */}
      {disciplina && safeConfig.sistemaCompetencia === "grupos_y_eliminacion" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            {safeConfig.faseActual === "grupos"
              ? `Los ${safeConfig.equiposEnBracket} clasificados de la fase de grupos ocuparán el bracket automáticamente.`
              : `Bracket con los ${bracketTeams.length} clasificados de la fase de grupos.`}
          </span>
        </div>
      )}

      {/* ── Bracket ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-white rounded-xl border border-border p-4 md:p-6 overflow-x-auto">
        <div style={{ display: "flex", alignItems: "flex-start", minWidth: "max-content" }}>
          {Array.from({ length: numRounds }, (_, r) => (
            <div key={r} style={{ display: "flex", alignItems: "flex-start" }}>
              {/* Columna de la ronda */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Etiqueta de ronda */}
                <div style={{
                  fontSize: "0.68rem", letterSpacing: "0.1em", color: "#6b7280",
                  textTransform: "uppercase", fontWeight: 700, textAlign: "center",
                  marginBottom: "0.5rem", width: COL_W,
                }}>
                  {roundNames[r]}
                </div>

                {/* Partidos posicionados absolutamente */}
                <div style={{ position: "relative", height: totalH, width: COL_W }}>
                  {rounds[r]?.map((match, mIdx) => (
                    <div
                      key={mIdx}
                      style={{ position: "absolute", top: getMatchTop(r, mIdx), left: 0, width: COL_W }}
                    >
                      {(["top", "bottom"] as const).map((side, si) => {
                        const team    = match[side];
                        const isWon   = !!team && match.winner === team;
                        const isLost  = !!match.winner && match.winner !== team && !!team;
                        const isEmpty = !team;

                        const bg     = isWon ? "#dcfce7" : "#f9fafb";
                        const border = isWon ? "#22c55e" : isLost ? "#e5e7eb" : "#d1d5db";
                        const bar    = isWon ? "#22c55e" : "#d1d5db";

                        return (
                          <div key={side}>
                            <div
                              onClick={() => !isEmpty && pickWinner(r, mIdx, side)}
                              title={team ?? ""}
                              style={{
                                display: "flex", alignItems: "center",
                                background: bg,
                                border: `2px solid ${border}`,
                                borderRadius: si === 0 ? "6px 6px 0 0" : "0 0 6px 6px",
                                padding: "0 0.6rem",
                                height: SLOT_H,
                                cursor: isEmpty ? "default" : isAdmin ? "pointer" : "default",
                                opacity: isLost ? 0.35 : isEmpty ? 0.25 : 1,
                                transition: "all 0.15s",
                                position: "relative", overflow: "hidden",
                              }}
                              onMouseEnter={(e) => {
                                if (!isEmpty && isAdmin) {
                                  (e.currentTarget as HTMLElement).style.borderColor = "#3b82f6";
                                  (e.currentTarget as HTMLElement).style.background  = "#eff6ff";
                                }
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = border;
                                (e.currentTarget as HTMLElement).style.background  = bg;
                              }}
                            >
                              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: bar }} />
                              <span style={{
                                fontSize: "0.74rem", marginLeft: 8,
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                color: isWon ? "#15803d" : isEmpty ? "#9ca3af" : "#1f2937",
                                fontWeight: isWon ? 700 : 400,
                              }}>
                                {team || "—"}
                              </span>
                            </div>
                            {si === 0 && <div style={{ height: DIVIDER_H, background: "#e5e7eb" }} />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conector SVG entre rondas */}
              {r < numRounds - 1 && (
                <div style={{ paddingTop: "2rem" }}>
                  <svg width={CONNECTOR_W} height={totalH} style={{ display: "block", overflow: "visible" }}>
                    {rounds[r]?.map((_, mIdx) => {
                      if (mIdx % 2 !== 0) return null;
                      const topC  = getMatchTop(r, mIdx) + MATCH_H / 2;
                      const botC  = getMatchTop(r, mIdx + 1) + MATCH_H / 2;
                      const nextC = getMatchTop(r + 1, Math.floor(mIdx / 2)) + MATCH_H / 2;
                      return (
                        <g key={mIdx}>
                          <line x1={0} y1={topC} x2={CONNECTOR_W / 2} y2={topC}  stroke="#9ca3af" strokeWidth="1.5" />
                          <line x1={0} y1={botC} x2={CONNECTOR_W / 2} y2={botC}  stroke="#9ca3af" strokeWidth="1.5" />
                          <line x1={CONNECTOR_W / 2} y1={topC} x2={CONNECTOR_W / 2} y2={botC} stroke="#9ca3af" strokeWidth="1.5" />
                          <line x1={CONNECTOR_W / 2} y1={nextC} x2={CONNECTOR_W} y2={nextC} stroke="#9ca3af" strokeWidth="1.5" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Campeón */}
        <div style={{
          marginTop: "1.5rem", textAlign: "center",
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          border: "2px solid #f59e0b", borderRadius: 10,
          padding: "1rem 2rem", display: "inline-block",
          boxShadow: "0 4px 12px rgba(245,158,11,0.15)",
        }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.25em", color: "#d97706", fontWeight: 700 }}>
            🏆 CAMPEÓN
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#78350f", minWidth: 120 }}>
            {champion ?? "???"}
          </div>
          {disciplina && (
            <div style={{ fontSize: "0.7rem", color: "#92400e", marginTop: 4 }}>{disciplina}</div>
          )}
        </div>
      </div>

      {/* Aviso para no admins */}
      {!isAdmin && (
        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 flex-shrink-0" />
          Solo los administradores pueden actualizar el bracket haciendo clic en los equipos.
        </div>
      )}
    </div>
  );
}