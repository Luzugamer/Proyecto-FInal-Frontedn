import { Calendar, MapPin, Users, Trophy, AlertCircle } from "lucide-react";
import {
  Tournament,
  getTournamentStateLabel,
  getTournamentStateColor,
  getTournamentTypeEmoji,
} from "@/lib/mockTournaments";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TournamentHeaderProps {
  tournament: Tournament;
  userRole?: string;
  onInscribirse?: () => void;
}

export function TournamentHeader({
  tournament,
  userRole,
  onInscribirse,
}: TournamentHeaderProps) {
  const inscripcionesAbiertas = tournament.estado === "inscripciones";
  const fechaInicio = new Date(
    tournament.fechaCompetenciaInicio,
  ).toLocaleDateString("es-PE");
  const fechaFin = new Date(tournament.fechaCompetenciaFin).toLocaleDateString(
    "es-PE",
  );

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start gap-6">
            {/* Icon and Badge */}
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                {getTournamentTypeEmoji(tournament.tipo)}
              </div>
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold",
                  getTournamentStateColor(tournament.estado),
                )}
              >
                <span
                  className={`w-3 h-3 rounded-full ${
                    tournament.estado === "en_curso"
                      ? "bg-green-500 animate-pulse"
                      : tournament.estado === "inscripciones"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-500"
                  }`}
                ></span>
                {getTournamentStateLabel(tournament.estado)}
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3 text-foreground leading-tight">
                {tournament.nombre}
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                {tournament.descripcion}
              </p>
            </div>

            {/* Meta información */}
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base pt-4 border-t border-border w-full">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">
                  {fechaInicio} - {fechaFin}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-foreground">
                  {tournament.disciplinas.length} Disciplinas
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">
                  {tournament.totalEquipos} Equipos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de inscripciones si está abierto */}
      {inscripcionesAbiertas && userRole === "DELEGADO_DEPORTES" && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-300 px-4 py-4">
          <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900">
                  Inscripciones abiertas
                </p>
                <p className="text-sm text-blue-700">
                  Hasta el{" "}
                  {new Date(tournament.fechaInscripcionFin).toLocaleDateString(
                    "es-PE",
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={onInscribirse}
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              Inscribir Mi Equipo
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
