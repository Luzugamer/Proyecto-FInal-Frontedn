import { Button } from "@/components/ui/button";
import {
  Wand2,
  Settings,
  Users,
  BarChart3,
  Download,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface FixtureTabProps {
  tournamentId: string;
  userRole?: string;
  onGenerarFixture?: () => void;
}

export function FixtureTab({
  tournamentId,
  userRole,
  onGenerarFixture,
}: FixtureTabProps) {
  const canGenerate = [
    "COMITE_ORGANIZADOR",
    "ADMINISTRADOR",
    "SUPER_ADMIN",
  ].includes(userRole || "");

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurar Fixture
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Sistema de Competencia
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm">
                <option>Todos vs Todos</option>
                <option>Grupos + Eliminatorias</option>
                <option>Eliminación Directa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Equipos por grupo
              </label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Partidos por fecha
              </label>
              <input
                type="number"
                defaultValue="4"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Días entre partidos
              </label>
              <input
                type="number"
                defaultValue="2"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
            </div>
          </div>

          {canGenerate && (
            <Button
              onClick={onGenerarFixture}
              className="w-full flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              🎲 Generar Fixture Automático
            </Button>
          )}
        </div>
      </div>

      {/* Fixture generado */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Fixture Actual</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm mb-3">
              Jornada 1 - 01 Marzo 2026
            </h4>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 bg-muted/50 rounded-lg border border-border/50"
                >
                  <p className="font-bold text-sm">Agronomía vs Ingeniería</p>
                  <p className="text-xs text-muted-foreground">
                    15:00 • Estadio UNAS
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Reprogramar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-4">
            <Button variant="outline" className="mx-auto">
              Ver todas las jornadas →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActasTabProps {
  tournamentId: string;
  userRole?: string;
  onRegistrarActa?: () => void;
}

export function ActasTab({
  tournamentId,
  userRole,
  onRegistrarActa,
}: ActasTabProps) {
  const canRegister = [
    "COMITE_ORGANIZADOR",
    "ADMINISTRADOR",
    "SUPER_ADMIN",
  ].includes(userRole || "");

  return (
    <div className="space-y-6">
      {/* Sin registrar */}
      <div>
        <h3 className="font-bold text-lg mb-4">🔴 Sin Registrar (5)</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold">Agronomía vs Zootecnia</p>
                  <p className="text-sm text-muted-foreground">
                    10 Feb 15:00 • Fútbol Masculino
                  </p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  AYER
                </span>
              </div>
              {canRegister && (
                <Button
                  onClick={onRegistrarActa}
                  size="sm"
                  className="w-full text-xs"
                >
                  📝 Registrar Acta
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Registradas hoy */}
      <div>
        <h3 className="font-bold text-lg mb-4">✅ Registradas Hoy (3)</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm">Enfermería 2 - 1 Economía</p>
                  <p className="text-xs text-muted-foreground">
                    Vóley Femenino • 10 Feb
                  </p>
                </div>
                <span className="text-xs">✓ Registrada</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ConfiguracionTabProps {
  tournamentId: string;
}

export function ConfiguracionTab({ tournamentId }: ConfiguracionTabProps) {
  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Información General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Nombre del Torneo
            </label>
            <input
              type="text"
              defaultValue="Interfacultades 2026"
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Estado</label>
            <select className="w-full px-3 py-2 border border-border rounded-lg">
              <option>En curso</option>
              <option>Inscripciones</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Inicio Competencia
              </label>
              <input
                type="date"
                defaultValue="2026-03-01"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Fin Competencia
              </label>
              <input
                type="date"
                defaultValue="2026-04-30"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm font-bold">
                Publicar en portal público
              </span>
            </label>
          </div>

          <Button className="w-full">Guardar Cambios</Button>
        </div>
      </div>

      {/* Comité Asignado */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Comité Asignado
        </h3>
        <div className="p-4 bg-muted/30 rounded-lg mb-4">
          <p className="font-bold text-sm">Comité A - Deportes</p>
          <p className="text-xs text-muted-foreground">5 miembros • Activo</p>
        </div>
        <Button variant="outline" className="w-full">
          Cambiar Comité
        </Button>
      </div>
    </div>
  );
}

interface ReportesTabProps {
  tournamentId: string;
}

export function ReportesTab({ tournamentId }: ReportesTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Generador de Reportes
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              Tipo de Reporte
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-lg text-sm">
              <option>Estadísticas Generales</option>
              <option>Por Disciplina</option>
              <option>Por Facultad</option>
              <option>Goleadores</option>
              <option>Análisis Comparativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Período</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="period" defaultChecked />
                <span className="text-sm">Todo el torneo</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="period" />
                <span className="text-sm">Rango personalizado</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Formato</label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </div>

          <Button className="w-full">🎲 Generar Reporte</Button>
        </div>
      </div>

      {/* Reportes Recientes */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Reportes Recientes</h3>
        <div className="space-y-2">
          {[
            "Reporte Final 2025",
            "Resumen Jornada 12",
            "Análisis Goleadores",
          ].map((report, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
            >
              <span className="text-sm font-bold">{report}</span>
              <Button variant="ghost" size="sm" className="text-xs">
                Descargar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AuditoriaTabProps {
  tournamentId: string;
}

export function AuditoriaTab({ tournamentId }: AuditoriaTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Registro de Cambios
        </h3>

        <div className="space-y-3">
          {[
            {
              fecha: "10 Feb 14:30",
              usuario: "admin@unas",
              accion: "Editó configuración",
              cambio: "Fecha final: 28 Feb → 02 Mar",
            },
            {
              fecha: "10 Feb 12:00",
              usuario: "comite1@unas",
              accion: "Aprobó inscripción",
              cambio: "Ingeniería FC - Fútbol M",
            },
            {
              fecha: "09 Feb 18:45",
              usuario: "delegado3@unas",
              accion: "Inscribió equipo",
              cambio: "Economía VB",
            },
          ].map((log, i) => (
            <div key={i} className="p-3 border border-border/50 rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <p className="font-bold text-sm">{log.accion}</p>
                <span className="text-xs text-muted-foreground">
                  {log.fecha}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Por: {log.usuario}
              </p>
              <p className="text-xs bg-muted/50 p-2 rounded">{log.cambio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SistemaTabProps {
  tournamentId: string;
  onEliminar?: () => void;
}

export function SistemaTab({ tournamentId, onEliminar }: SistemaTabProps) {
  return (
    <div className="space-y-6">
      {/* Acciones Críticas */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Acciones Críticas
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-bold text-sm mb-2">🗑️ Eliminar Torneo</p>
            <p className="text-xs text-red-700 mb-3">
              Esta acción eliminará permanentemente todos los datos.
            </p>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={onEliminar}
            >
              Eliminar Torneo
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-bold text-sm mb-2">🔄 Resetear Torneo</p>
            <p className="text-xs text-yellow-700 mb-3">
              Borra los resultados pero mantiene equipos inscritos.
            </p>
            <Button variant="outline" className="w-full">
              Resetear
            </Button>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">💾 Backup y Restauración</h3>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              Último backup: 10 Feb 2026, 02:00
            </p>
          </div>
          <Button variant="outline" className="w-full">
            Crear Backup Manual
          </Button>
          <Button variant="outline" className="w-full">
            Restaurar desde Backup
          </Button>
        </div>
      </div>
    </div>
  );
}
