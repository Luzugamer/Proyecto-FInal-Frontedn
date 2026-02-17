import { Tournament } from "@/lib/mockTournaments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Trophy, 
  Users, 
  FileText, 
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumenTabProps {
  tournament: Tournament;
  userRole?: string;
}

export function ResumenTab({ tournament, userRole }: ResumenTabProps) {
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "inscripciones":
        return <Badge className="bg-blue-500">Inscripciones Abiertas</Badge>;
      case "en_curso":
        return <Badge className="bg-green-500">En Curso</Badge>;
      case "finalizado":
        return <Badge className="bg-gray-500">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const facultadesMock = [
    { nombre: "Agronomía", equipos: 4 },
    { nombre: "Zootecnia", equipos: 3 },
    { nombre: "Ingeniería Industrial", equipos: 4 },
    { nombre: "Ingeniería en Informática y Sistemas", equipos: 5 },
    { nombre: "Recursos Naturales Renovables", equipos: 3 },
    { nombre: "Ciencias Económicas y Administrativas", equipos: 4 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información General */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Estado del Torneo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                {getStatusBadge(tournament.estado)}
              </div>
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {new Date(tournament.fechaCompetenciaInicio).toLocaleDateString()} - {new Date(tournament.fechaCompetenciaFin).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-xl bg-card">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Disciplinas ({tournament.disciplinas.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tournament.disciplinas.map((d) => (
                    <Badge key={d} variant="secondary" className="font-normal">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-xl bg-card">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Equipos Inscritos
                </h4>
                <div className="text-2xl font-bold text-primary">
                  {tournament.totalEquipos} <span className="text-sm font-normal text-muted-foreground">equipos en total</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Cronograma de Competencias</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <div className="min-w-[80px] font-bold text-primary">01 MAR</div>
                  <div>
                    <div className="font-semibold text-foreground">Inauguración y Desfile</div>
                    <div className="text-sm text-muted-foreground">Estadio Universitario - 09:00 AM</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border-l-4 border-muted bg-muted/20 rounded-r-lg">
                  <div className="min-w-[80px] font-bold text-muted-foreground">05 MAR</div>
                  <div>
                    <div className="font-semibold text-foreground">Inicio de Fase de Grupos</div>
                    <div className="text-sm text-muted-foreground">Todas las sedes</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 border-l-4 border-muted bg-muted/20 rounded-r-lg">
                  <div className="min-w-[80px] font-bold text-muted-foreground">20 ABR</div>
                  <div>
                    <div className="font-semibold text-foreground">Gran Final</div>
                    <div className="text-sm text-muted-foreground">Coliseo Cerrado - 06:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar de Resumen */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Reglamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consulta las normas generales, sistemas de puntuación y sanciones del torneo.
              </p>
              <Button className="w-full gap-2" variant="outline">
                <FileText className="w-4 h-4" />
                Descargar Reglamento (PDF)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipos por Facultad</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {facultadesMock.map((f) => (
                  <div key={f.nombre} className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm font-medium">{f.nombre}</span>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {f.equipos}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
