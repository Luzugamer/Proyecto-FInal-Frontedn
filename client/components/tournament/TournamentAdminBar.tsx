import { Button } from "@/components/ui/button";
import { Tournament } from "@/lib/mockTournaments";
import {
  Edit,
  Settings,
  Users,
  FileText,
  Download,
  Trash2,
  Wand2,
  Share2,
  Archive,
} from "lucide-react";

interface TournamentAdminBarProps {
  tournament: Tournament;
  userRole?: string;
  onGenererFixture?: () => void;
  onRegistrarActa?: () => void;
  onEditar?: () => void;
  onAsignarComite?: () => void;
}

export function TournamentAdminBar({
  tournament,
  userRole,
  onGenererFixture,
  onRegistrarActa,
  onEditar,
  onAsignarComite,
}: TournamentAdminBarProps) {
  // Solo mostrar para roles administrativos
  if (
    !userRole ||
    !["COMITE_ORGANIZADOR", "ADMINISTRADOR", "SUPER_ADMIN"].includes(userRole)
  ) {
    return null;
  }

  return (
    <div className="bg-white border-b border-border shadow-sm sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Comité - Acciones de ejecución */}
          {userRole === "COMITE_ORGANIZADOR" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenererFixture}
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Generar Fixture
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onRegistrarActa}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Registrar Acta
              </Button>

              <div className="hidden md:block w-px h-6 bg-border mx-2"></div>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <FileText className="w-4 h-4" />
                Ver Inscripciones
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Users className="w-4 h-4" />
                Justicia Deportiva
              </Button>
            </>
          )}

          {/* Administrador - Control total */}
          {userRole === "ADMINISTRADOR" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditar}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Torneo
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onAsignarComite}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Asignar Comité
              </Button>

              <div className="hidden md:block w-px h-6 bg-border mx-2"></div>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <FileText className="w-4 h-4" />
                Generar Reportes
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Archive className="w-4 h-4" />
                Archivar
              </Button>
            </>
          )}

          {/* Super Admin - Acciones críticas */}
          {userRole === "SUPER_ADMIN" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditar}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onAsignarComite}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Asignar Comité
              </Button>

              <div className="hidden lg:block w-px h-6 bg-border mx-2"></div>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <FileText className="w-4 h-4" />
                Reportes
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
