import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Radio } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchScoreboard }  from "@/components/match/MatchScoreboard";
import { MatchLineup }      from "@/components/match/MatchLineup";
import { MatchTimeline }    from "@/components/match/MatchTimeline";
import { MatchStatistics }  from "@/components/match/MatchStatistics";
import { MatchHighlights }  from "@/components/match/MatchHighlights";
import { MatchLiveStream }  from "@/components/match/MatchLiveStream";
import { getMatchById }     from "@/lib/mockMatches";

interface Match {
  id: string;
  fecha: string;
  hora: string;
  estado: "por_jugar" | "en_vivo" | "finalizado";
  jornada: string;
  disciplina: string;
  categoria: string;
  cancha: string;
  equipoA: { id: string; nombre: string; facultad: string; logo: string; goles: number };
  equipoB: { id: string; nombre: string; facultad: string; logo: string; goles: number };
  arbitro: string;
  asistencia: number;
  clima: string;
  alineacionA: any[];
  alineacionB: any[];
  cronologia: any[];
  estadisticas: any;
}

export function MatchDetail() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const mockApiMatch = getMatchById(parseInt(id || "1"));

  const mappedMatch: Match = {
    id: String(mockApiMatch?.id || "m-001"),
    fecha: mockApiMatch?.date || "2026-02-15",
    hora:  mockApiMatch?.time || "15:30",
    estado: (
      mockApiMatch?.status === "finished" ? "finalizado" :
      mockApiMatch?.status === "live"     ? "en_vivo"    : "por_jugar"
    ) as "por_jugar" | "en_vivo" | "finalizado",
    jornada:    "Jornada 3 - Fase de Grupos",
    disciplina: mockApiMatch?.sport  || "Fútbol",
    categoria:  "Varones",
    cancha:     mockApiMatch?.court  || "Cancha Central UNAS",
    equipoA: {
      id: "eq-a",
      nombre:   mockApiMatch?.home || "Equipo A",
      facultad: mockApiMatch?.home || "Equipo A",
      logo: "⚽",
      goles: mockApiMatch?.homeScore || 0,
    },
    equipoB: {
      id: "eq-b",
      nombre:   mockApiMatch?.away || "Equipo B",
      facultad: mockApiMatch?.away || "Equipo B",
      logo: "🏀",
      goles: mockApiMatch?.awayScore || 0,
    },
    arbitro:    "Dr. Juan Carlos Rodríguez",
    asistencia: 450,
    clima:      "Soleado, 25°C",
    alineacionA: [
      { numero: 1,  nombre: "Pedro González",   posicion: "Portero",       titular: true },
      { numero: 4,  nombre: "Carlos López",      posicion: "Defensa",       titular: true },
      { numero: 5,  nombre: "Miguel Ramírez",    posicion: "Defensa",       titular: true },
      { numero: 8,  nombre: "Juan Pérez",        posicion: "Mediocampista", titular: true,  goles: 1 },
      { numero: 10, nombre: "Diego Flores",      posicion: "Delantero",     titular: true,  goles: 2 },
      { numero: 3,  nombre: "Luis Martínez",     posicion: "Defensa",       titular: false },
    ],
    alineacionB: [
      { numero: 1,  nombre: "Andrés Villarreal", posicion: "Portero",       titular: true },
      { numero: 7,  nombre: "Roberto Silva",     posicion: "Delantero",     titular: true,  goles: 1 },
      { numero: 9,  nombre: "Fernando Núñez",    posicion: "Delantero",     titular: true },
      { numero: 12, nombre: "Óscar Mendoza",     posicion: "Mediocampista", titular: false },
    ],
    cronologia: mockApiMatch?.events?.map((event) => ({
      minuto:      parseInt(event.minute),
      tipo:        event.type === "goal" ? "gol" : event.type === "yellow" ? "tarjeta_amarilla" : "tarjeta_roja",
      descripcion: `${event.type === "goal" ? "¡GOL! " : ""}${event.player} (${event.team})`,
    })) || [],
    estadisticas: {
      equipoA: mockApiMatch?.stats?.home || {
        posesion: 65, rematesTotales: 12, rematesAGol: 8,
        corners: 6,   faltas: 4,          tarjetas: 1,
        pases: 385,   precisonPases: 82,
      },
      equipoB: mockApiMatch?.stats?.away || {
        posesion: 35, rematesTotales: 8,  rematesAGol: 5,
        corners: 4,   faltas: 7,          tarjetas: 2,
        pases: 210,   precisonPases: 78,
      },
    },
  };

  const [match] = useState<Match>(mappedMatch);
  const isLive   = match.estado === "en_vivo";
  const isWinner = match.estado === "finalizado" && match.equipoA.goles > match.equipoB.goles ? "A" : "B";

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/torneos" className="text-muted-foreground hover:text-foreground">Torneos</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to={slug ? `/torneo/${slug}` : "/torneos"} className="text-muted-foreground hover:text-foreground">
              {mockApiMatch?.tournament || "Torneo"}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to={slug ? `/torneo/${slug}?tab=partidos` : "/torneos"} className="text-muted-foreground hover:text-foreground">
              Partidos
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-bold text-foreground truncate max-w-[200px]">
              {match.equipoA.nombre} vs {match.equipoB.nombre}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Volver */}
        <button
          onClick={() => slug && navigate(`/torneo/${slug}`)}
          className="font-bold text-foreground hover:text-primary transition-colors"
        >
          ← Volver al Torneo
        </button>

        {/* ── Card info del partido ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{match.jornada}</p>
                <h1 className="text-2xl font-bold">{match.disciplina} — {match.categoria}</h1>
              </div>

              {/* Badge de estado */}
              {isLive && (
                <Badge className="bg-red-600 text-white flex items-center gap-1.5 px-3 py-1.5 text-sm">
                  <Radio className="w-4 h-4 animate-pulse" />
                  EN VIVO
                </Badge>
              )}
              {match.estado === "finalizado" && (
                <Badge className="bg-muted-foreground text-white px-3 py-1.5 text-sm">
                  Finalizado
                </Badge>
              )}
              {match.estado === "por_jugar" && (
                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                  Próximamente
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <MatchScoreboard match={match} isWinner={isWinner} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                <p className="font-semibold text-sm">
                  {new Date(match.fecha).toLocaleDateString("es-PE")} — {match.hora}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cancha</p>
                <p className="font-semibold text-sm">{match.cancha}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Árbitro</p>
                <p className="font-semibold text-sm">{match.arbitro}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Asistencia</p>
                <p className="font-semibold text-sm">{match.asistencia} espectadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs de detalles ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={isLive ? "transmision" : "alineaciones"} className="w-full">

              <TabsList className="grid w-full grid-cols-4 h-auto mb-1">

                {/* Tab transmisión — siempre primero */}
                <TabsTrigger
                  value="transmision"
                  className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                >
                  <Radio className={`w-3.5 h-3.5 flex-shrink-0 ${isLive ? "text-red-500 animate-pulse" : ""}`} />
                  <span className="hidden sm:inline">
                    {isLive ? "En Vivo" : "Transmisión"}
                  </span>
                  <span className="sm:hidden text-base">📺</span>
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse hidden sm:block flex-shrink-0" />
                  )}
                </TabsTrigger>

                <TabsTrigger value="alineaciones" className="py-2.5">
                  <span className="hidden sm:inline">Alineaciones</span>
                  <span className="sm:hidden text-base">👥</span>
                </TabsTrigger>

                <TabsTrigger value="cronologia" className="py-2.5">
                  <span className="hidden sm:inline">Cronología</span>
                  <span className="sm:hidden text-base">⏱️</span>
                </TabsTrigger>

                <TabsTrigger value="estadisticas" className="py-2.5">
                  <span className="hidden sm:inline">Estadísticas</span>
                  <span className="sm:hidden text-base">📊</span>
                </TabsTrigger>
              </TabsList>

              {/* Contenidos */}
              <TabsContent value="transmision" className="mt-6">
                <MatchLiveStream match={match} />
              </TabsContent>

              <TabsContent value="alineaciones" className="mt-6">
                <MatchLineup match={match} />
              </TabsContent>

              <TabsContent value="cronologia" className="mt-6">
                <MatchTimeline match={match} />
              </TabsContent>

              <TabsContent value="estadisticas" className="mt-6">
                <MatchStatistics match={match} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Puntos destacados */}
        <MatchHighlights match={match} />
      </div>
    </div>
  );
}

export default MatchDetail;