import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  MapPin,
  Trophy,
  Users,
  Zap,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { getMatchById } from "@/lib/mockMatches";

export default function MatchDetailInTournament() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const matchId = parseInt(id || "1");
  const match = getMatchById(matchId);

  const [activeTab, setActiveTab] = useState<
    "resumen" | "estadisticas" | "alineaciones" | "transmision"
  >("alineaciones");

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-muted-foreground">Partido no encontrado</p>
      </div>
    );
  }

  // Determine which tabs to show based on match status
  const getTabs = () => {
    if (match.status === "finished") {
      return ["resumen", "estadisticas", "alineaciones", "transmision"];
    }
    if (match.status === "live") {
      return ["resumen", "estadisticas", "alineaciones", "transmision"];
    }
    return ["alineaciones", "transmision"];
  };

  const tabs = getTabs();

  // Sample stats for display
  const getStats = () => {
    return match.stats || {
      home: {
        possession: 50,
        shots: 10,
        shotsOnTarget: 5,
        fouls: 7,
        corners: 4,
      },
      away: {
        possession: 50,
        shots: 10,
        shotsOnTarget: 5,
        fouls: 7,
        corners: 4,
      },
    };
  };

  const stats = getStats();

  return (
    <div className="w-full bg-gradient-to-b from-primary-50 to-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link
            to="/torneos"
            className="text-primary hover:text-primary-700 font-bold"
          >
            Torneos
          </Link>
          <span>&gt;</span>
          <Link
            to={`/torneo/${slug}`}
            className="text-primary hover:text-primary-700 font-bold"
          >
            {match.tournament}
          </Link>
          <span>&gt;</span>
          <Link
            to={`/torneo/${slug}?tab=partidos`}
            className="text-primary hover:text-primary-700 font-bold"
          >
            Partidos
          </Link>
          <span>&gt;</span>
          <span className="text-foreground font-bold">
            {match.home} vs {match.away}
          </span>
        </div>

        {/* Back Button */}
        <Link
          to={`/torneo/${slug}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-bold mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver al torneo
        </Link>

        {/* Match Header */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              {match.status === "live" && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full">
                  <span className="inline-block w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  <span className="font-bold text-white">EN VIVO</span>
                </span>
              )}
              {match.status === "today" && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span className="font-bold text-white">HOY</span>
                </span>
              )}
              {match.status === "upcoming" && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                  <span className="font-bold text-white">PRÓXIMO</span>
                </span>
              )}
              {match.status === "finished" && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted-foreground rounded-full">
                  <span className="font-bold text-white">FINALIZADO</span>
                </span>
              )}
              <div className="space-y-1 text-right">
                <p className="text-sm">{match.tournament}</p>
                <p className="text-sm">{match.sport}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 items-center mb-6">
              {/* Home */}
              <div className="text-center">
                <div className="text-5xl mb-3">⚽</div>
                <h2 className="text-3xl font-bold">{match.home}</h2>
              </div>

              {/* Score */}
              <div className="text-center">
                {match.homeScore !== undefined && match.awayScore !== undefined ? (
                  <>
                    <p className="text-6xl font-bold mb-2">{match.homeScore}</p>
                    <p className="text-xl">-</p>
                    <p className="text-6xl font-bold mt-2">{match.awayScore}</p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-white/80">vs</p>
                )}
              </div>

              {/* Away */}
              <div className="text-center">
                <div className="text-5xl mb-3">🏀</div>
                <h2 className="text-3xl font-bold">{match.away}</h2>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {match.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {match.court}
              </span>
              <span className="flex items-center gap-2">
                <Trophy className="w-4 h-4" /> {match.date}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as "resumen" | "estadisticas" | "alineaciones" | "transmision",
                )
              }
              className={`px-6 py-3 font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "resumen" && "Resultados"}
              {tab === "estadisticas" && "Estadísticas"}
              {tab === "alineaciones" && "Alineaciones"}
              {tab === "transmision" && "Transmisión"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mb-12">
          {/* Resumen Tab - Para partidos EN VIVO y finalizados */}
          {(match.status === "finished" || match.status === "live") && activeTab === "resumen" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timeline */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-border p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-accent" />
                    Timeline del Partido
                  </h3>

                  {match.events && match.events.length > 0 ? (
                    <div className="space-y-4">
                      {match.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 pb-4 border-b border-primary/10 last:border-0"
                        >
                          <div className="text-2xl flex-shrink-0 w-8">
                            {event.type === "goal" && "⚽"}
                            {event.type === "yellow" && "🟨"}
                            {event.type === "red" && "🟥"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-foreground">
                                {event.team}
                              </p>
                              <span className="text-sm font-bold text-primary">
                                {event.minute}
                              </span>
                            </div>
                            <p className="font-semibold text-foreground">
                              {event.player}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No hay eventos registrados
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="space-y-6">
                {/* Home Stats */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h4 className="font-bold text-foreground mb-4">
                    {match.home}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posesión</span>
                      <span className="font-bold text-foreground">
                        {stats.home.possession}%
                      </span>
                    </div>
                    <div className="w-full bg-primary-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${stats.home.possession}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Tiros</p>
                        <p className="font-bold text-foreground">
                          {stats.home.shots}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          A Portería
                        </p>
                        <p className="font-bold text-foreground">
                          {stats.home.shotsOnTarget}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Away Stats */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h4 className="font-bold text-foreground mb-4">
                    {match.away}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Posesión</span>
                      <span className="font-bold text-foreground">
                        {stats.away.possession}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary-100 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${stats.away.possession}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Tiros</p>
                        <p className="font-bold text-foreground">
                          {stats.away.shots}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          A Portería
                        </p>
                        <p className="font-bold text-foreground">
                          {stats.away.shotsOnTarget}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas Tab - Para partidos EN VIVO y finalizados */}
          {(match.status === "finished" || match.status === "live") && activeTab === "estadisticas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Home Team Stats */}
              <div className="bg-white rounded-xl border border-border p-8">
                <h4 className="text-xl font-bold text-foreground mb-6">
                  {match.home}
                </h4>
                <div className="space-y-6">
                  {[
                    {
                      label: "Posesión",
                      home: stats.home.possession,
                      away: stats.away.possession,
                    },
                    {
                      label: "Tiros",
                      home: stats.home.shots,
                      away: stats.away.shots,
                    },
                    {
                      label: "Tiros a Portería",
                      home: stats.home.shotsOnTarget,
                      away: stats.away.shotsOnTarget,
                    },
                    {
                      label: "Faltas",
                      home: stats.home.fouls,
                      away: stats.away.fouls,
                    },
                    {
                      label: "Saques de Esquina",
                      home: stats.home.corners,
                      away: stats.away.corners,
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="font-bold text-foreground">
                          {stat.home}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {stat.label}
                        </span>
                        <span className="font-bold text-foreground">
                          {stat.away}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="bg-primary rounded-full h-2 flex-1"
                          style={{
                            width: `${(stat.home / (stat.home + stat.away)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="bg-secondary rounded-full h-2 flex-1"
                          style={{
                            width: `${(stat.away / (stat.home + stat.away)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team Stats */}
              <div className="bg-white rounded-xl border border-border p-8">
                <h4 className="text-xl font-bold text-foreground mb-6">
                  {match.away}
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                      ⚽ Información Adicional
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <p className="font-bold text-foreground">
                          Resultado Final
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {match.homeScore} - {match.awayScore}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alineaciones Tab - Para todos los estados */}
          {activeTab === "alineaciones" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Home Team Lineup */}
              <div className="bg-white rounded-xl border border-border p-8">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {match.home}
                </h4>
                <div className="space-y-3">
                  {["Portero", "Defensores", "Mediocampistas", "Delanteros"].map((position) => (
                    <div key={position} className="border-b border-border pb-4 last:border-0">
                      <p className="text-sm font-bold text-muted-foreground mb-2 uppercase">
                        {position}
                      </p>
                      <div className="space-y-2">
                        {[...Array(position === "Portero" ? 1 : 3)].map((_, idx) => (
                          <div key={idx} className="p-3 bg-primary-50 rounded-lg">
                            <p className="font-bold text-foreground"># Jugador {idx + 1}</p>
                            <p className="text-xs text-muted-foreground">Camiseta #{11 + idx}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team Lineup */}
              <div className="bg-white rounded-xl border border-border p-8">
                <h4 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {match.away}
                </h4>
                <div className="space-y-3">
                  {["Portero", "Defensores", "Mediocampistas", "Delanteros"].map((position) => (
                    <div key={position} className="border-b border-border pb-4 last:border-0">
                      <p className="text-sm font-bold text-muted-foreground mb-2 uppercase">
                        {position}
                      </p>
                      <div className="space-y-2">
                        {[...Array(position === "Portero" ? 1 : 3)].map((_, idx) => (
                          <div key={idx} className="p-3 bg-secondary-50 rounded-lg">
                            <p className="font-bold text-foreground"># Jugador {idx + 1}</p>
                            <p className="text-xs text-muted-foreground">Camiseta #{11 + idx}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transmisión Tab */}
          {activeTab === "transmision" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Live Video */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
                    <div className="text-center">
                      {match.status === "live" && (
                        <>
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[12px] border-l-primary border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                          <p className="text-foreground font-bold mb-2">Transmisión en Vivo</p>
                          <p className="text-sm text-muted-foreground">Conectando...</p>
                        </>
                      )}
                      {(match.status === "today" || match.status === "upcoming" || match.status === "finished") && (
                        <>
                          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-secondary" />
                          </div>
                          <p className="text-foreground font-bold mb-2">Proximamente</p>
                          <p className="text-sm text-muted-foreground">La transmisión estará disponible pronto</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    {match.status === "live" && (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="font-bold text-red-600">EN VIVO - {match.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Siguiendo el partido en tiempo real desde {match.court}
                        </p>
                      </>
                    )}
                    {match.status !== "live" && (
                      <>
                        <p className="font-bold text-foreground mb-2">Información de Transmisión</p>
                        <p className="text-sm text-muted-foreground">
                          La transmisión de este partido será transmitida próximamente a través de la plataforma SIGED.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Broadcast Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Información de Transmisión
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1">Plataforma</p>
                      <p className="font-bold text-foreground">Sistema SIGED</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1">Calidad</p>
                      <p className="font-bold text-foreground">1080p HD</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1">Comentarista</p>
                      <p className="font-bold text-foreground">Personal UNAS</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground mb-1">Espectadores</p>
                      <p className="font-bold text-foreground">1,234 en vivo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-border p-6">
                  <h4 className="font-bold text-foreground mb-4">Chat en Vivo</h4>
                  <div className="h-32 bg-primary-50 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground text-center">
                      Sección de comentarios disponible próximamente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
