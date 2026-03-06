import { Tournament } from "@/lib/mockTournaments";
import { getMatchesByTournament } from "@/lib/mockMatches";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  Trophy, 
  Calendar, 
  Users, 
  Info, 
  BarChart3, 
  Medal, 
  Target,
  ClipboardList 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TournamentSidebarProps {
  tournament: Tournament;
  userRole?: string;
}

export function TournamentSidebar({
  tournament,
  userRole,
}: TournamentSidebarProps) {
  const matches = getMatchesByTournament(tournament.slug);
  const topTeam = { nombre: "Agronomía", puntos: 45 };
  const topScorer = { nombre: "Juan Pérez", goles: 5, equipo: "Agronomía" };

  return (
    <aside className="space-y-6">
      {/* Widget de información general */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-bold capitalize">{tournament.tipo}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Categoría</p>
            <p className="font-bold capitalize">{tournament.categoria}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sistema</p>
            <p className="font-bold capitalize">
              {tournament.sistemaCompetencia.replace("_", " ")}
            </p>
          </div>
          {tournament.comiteAsignado && (
            <div>
              <p className="text-muted-foreground">Comité</p>
              <p className="font-bold">{tournament.comiteAsignado}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Widget de estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Partidos totales</span>
            <span className="font-bold">{tournament.totalPartidos}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jugados</span>
            <span className="font-bold">{tournament.partidosJugados}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pendientes</span>
            <span className="font-bold">
              {tournament.totalPartidos - tournament.partidosJugados}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Goles</span>
            <span className="font-bold">{tournament.totalGoles}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Asistencia</span>
            <span className="font-bold">
              {(tournament.asistencia / 1000).toFixed(1)}k
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Widget de próximos partidos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximos Partidos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {matches
            .filter((m) => m.status === "upcoming")
            .slice(0, 3)
            .map((match) => (
              <div
                key={match.id}
                className="p-3 bg-muted/50 rounded-lg border border-border/50"
              >
                <p className="font-bold text-sm">
                  {match.home} vs {match.away}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(match.date + "T00:00:00").toLocaleDateString(
                    "es-PE",
                  )}{" "}
                  {match.time}
                </p>
                <p className="text-xs text-primary font-bold mt-1">
                  {match.sport}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Widget de líderes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Líderes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-bold">
              TOP FACULTAD
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold">{topTeam.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {topTeam.puntos} puntos
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2 font-bold">
              GOLEADOR
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm">{topScorer.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {topScorer.goles} goles • {topScorer.equipo}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets específicos por rol */}
      {userRole === "DELEGADO_DEPORTES" && (
        <>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                + Inscribir Equipo
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                Gestionar Jugadores
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                size="sm"
              >
                Subir Documentos
              </Button>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-yellow-600" />
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Certificado médico (2 jugadores)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Ficha inscripción (pendiente firma)</span>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3">
                Completar →
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {(userRole === "COMITE_ORGANIZADOR" || userRole === "ADMINISTRADOR") && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Requieren Atención
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-bold text-red-700">
                5 inscripciones pendientes
              </p>
              <p className="text-xs text-muted-foreground">
                Requieren aprobación
              </p>
            </div>
            <div>
              <p className="font-bold text-red-700">3 documentos incompletos</p>
              <p className="text-xs text-muted-foreground">
                Solicit a a los delegados
              </p>
            </div>
            <div>
              <p className="font-bold text-red-700">2 reclamos nuevos</p>
              <p className="text-xs text-muted-foreground">
                En revisión por justicia
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
