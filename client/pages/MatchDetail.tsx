import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Download, BarChart3, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchScoreboard } from "@/components/match/MatchScoreboard";
import { MatchStandingsView } from "@/components/match/MatchStandingsView";
import { MatchAnalyticsView } from "@/components/match/MatchAnalyticsView";
import { MatchLineup } from "@/components/match/MatchLineup";
import { MatchTimeline } from "@/components/match/MatchTimeline";
import { MatchStatistics } from "@/components/match/MatchStatistics";
import { MatchHighlights } from "@/components/match/MatchHighlights";
import { toast } from "sonner";

interface Match {
  id: string;
  fecha: string;
  hora: string;
  estado: "por_jugar" | "en_vivo" | "finalizado";
  jornada: string;
  disciplina: string;
  categoria: string;
  cancha: string;
  
  equipoA: {
    id: string;
    nombre: string;
    facultad: string;
    logo: string;
    goles: number;
  };
  
  equipoB: {
    id: string;
    nombre: string;
    facultad: string;
    logo: string;
    goles: number;
  };
  
  arbitro: string;
  asistencia: number;
  clima: string;
  
  alineacionA: any[];
  alineacionB: any[];
  cronologia: any[];
  estadisticas: any;
}

// Datos simulados del partido
const MOCK_MATCH: Match = {
  id: "m-001",
  fecha: "2026-02-15",
  hora: "15:30",
  estado: "finalizado",
  jornada: "Jornada 3 - Fase de Grupos",
  disciplina: "Fútbol",
  categoria: "Varones",
  cancha: "Cancha Central UNAS",
  
  equipoA: {
    id: "eq-fia",
    nombre: "FIA",
    facultad: "Facultad de Ingeniería Agronómica",
    logo: "🟢",
    goles: 3,
  },
  
  equipoB: {
    id: "eq-fiis",
    nombre: "FIIS",
    facultad: "Facultad de Ingeniería en Informática y Sistemas",
    logo: "🔵",
    goles: 1,
  },
  
  arbitro: "Dr. Juan Carlos Rodríguez",
  asistencia: 450,
  clima: "Soleado, 25°C",
  
  alineacionA: [
    { numero: 1, nombre: "Pedro González", posicion: "Portero", titular: true },
    { numero: 4, nombre: "Carlos López", posicion: "Defensa", titular: true },
    { numero: 5, nombre: "Miguel Ramírez", posicion: "Defensa", titular: true },
    { numero: 8, nombre: "Juan Pérez", posicion: "Mediocampista", titular: true, goles: 1 },
    { numero: 10, nombre: "Diego Flores", posicion: "Delantero", titular: true, goles: 2 },
    { numero: 3, nombre: "Luis Martínez", posicion: "Defensa", titular: false },
  ],
  
  alineacionB: [
    { numero: 1, nombre: "Andrés Villarreal", posicion: "Portero", titular: true },
    { numero: 7, nombre: "Roberto Silva", posicion: "Delantero", titular: true, goles: 1 },
    { numero: 9, nombre: "Fernando Núñez", posicion: "Delantero", titular: true },
    { numero: 12, nombre: "Óscar Mendoza", posicion: "Mediocampista", titular: false },
  ],
  
  cronologia: [
    { minuto: 90, tipo: "fin", descripcion: "Fin del partido" },
    { minuto: 85, tipo: "cambio", descripcion: "Sale Diego Flores, Entra Luis Martínez (FIA)" },
    { minuto: 78, tipo: "gol", descripcion: "¡GOL! Diego Flores (FIA) - Asistencia Juan Pérez" },
    { minuto: 65, tipo: "tarjeta_amarilla", descripcion: "Tarjeta amarilla a Fernando Núñez (FIIS)" },
    { minuto: 45, tipo: "descanso", descripcion: "Descanso" },
    { minuto: 38, tipo: "gol", descripcion: "¡GOL! Juan Pérez (FIA) - Jugada individual" },
    { minuto: 12, tipo: "gol", descripcion: "¡GOL! Roberto Silva (FIIS) - Remate de cabeza" },
    { minuto: 5, tipo: "saque", descripcion: "Inicio del partido" },
  ],
  
  estadisticas: {
    equipoA: {
      posesion: 65,
      rematesTotales: 12,
      rematesAGol: 8,
      corners: 6,
      faltas: 4,
      tarjetas: 1,
      pases: 385,
      precisonPases: 82,
    },
    equipoB: {
      posesion: 35,
      rematesTotales: 8,
      rematesAGol: 5,
      corners: 4,
      faltas: 7,
      tarjetas: 2,
      pases: 210,
      precisonPases: 78,
    },
  },
};

export function MatchDetail() {
  const { tournamentSlug, disciplina, matchId } = useParams();
  const navigate = useNavigate();
  const [match] = useState<Match>(MOCK_MATCH);
  const [mainView, setMainView] = useState<"standings" | "analytics">("standings");

  const handleShare = () => {
    toast.success("Enlace copiado al portapapeles");
  };

  const handleDownload = () => {
    toast.success("Descargando informe PDF...");
  };

  const isWinner = match.estado === "finalizado" && match.equipoA.goles > match.equipoB.goles ? "A" : "B";

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(`/torneo/${tournamentSlug}`)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Torneo
            </button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                <Download className="w-4 h-4" />
                Informe PDF
              </Button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="text-sm text-muted-foreground">
            Torneos &gt; Interfacultades 2026 &gt; Resultados &gt; {match.disciplina} &gt; Partido
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Información del Partido */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{match.jornada}</p>
                <h1 className="text-2xl font-bold">{match.disciplina} - {match.categoria}</h1>
              </div>
              <Badge
                variant={
                  match.estado === "finalizado"
                    ? "default"
                    : match.estado === "en_vivo"
                    ? "secondary"
                    : "outline"
                }
              >
                {match.estado === "finalizado"
                  ? "Finalizado"
                  : match.estado === "en_vivo"
                  ? "EN VIVO"
                  : "Por Jugar"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Marcador Principal */}
            <MatchScoreboard
              match={match}
              isWinner={isWinner}
            />

            {/* Información complementaria */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Fecha y Hora</p>
                <p className="font-semibold text-sm">
                  {new Date(match.fecha).toLocaleDateString("es-PE")} - {match.hora}
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

        {/* Toggle de Vista Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis del Partido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Botones de toggle */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setMainView("standings")}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  mainView === "standings"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Tabla de Posiciones
                </span>
              </button>
              <button
                onClick={() => setMainView("analytics")}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  mainView === "analytics"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Análisis Gráfico
                </span>
              </button>
            </div>

            {/* Contenido dinámico */}
            {mainView === "standings" ? (
              <MatchStandingsView match={match} />
            ) : (
              <MatchAnalyticsView match={match} />
            )}
          </CardContent>
        </Card>

        {/* Detalles del Partido - Tabs Secundarios */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="alineaciones" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="alineaciones">Alineaciones</TabsTrigger>
                <TabsTrigger value="cronologia">Cronología</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              </TabsList>

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

        {/* Tarjetas de Información Destacada */}
        <MatchHighlights match={match} />
      </div>
    </div>
  );
}

export default MatchDetail;
