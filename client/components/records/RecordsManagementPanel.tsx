import { useState } from "react";
import { Download, Upload, MessageSquare, Eye, MoreHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentRecord, DocumentStatus } from "@shared/api";
import { cn } from "@/lib/utils";

interface RecordsManagementPanelProps {
  records?: StudentRecord[];
  tournamentId?: string;
  userRole?: string;
  onEdit?: (record: StudentRecord) => void;
  onDownload?: (recordId: string) => void;
}

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  icon: React.ReactNode;
}> = {
  completo_aprobado: {
    label: "Completo y Aprobado",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "🟢",
  },
  completo_pendiente: {
    label: "Completo - Pendiente Revisión",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "🟡",
  },
  incompleto: {
    label: "Incompleto",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "🟠",
  },
  rechazado: {
    label: "Rechazado - Requiere Corrección",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: "🔴",
  },
};

// Datos simulados de récords para desarrollo
const MOCK_RECORDS: StudentRecord[] = [
  {
    id: "rec-001",
    jugadorId: "jug-001",
    codigoEstudiantial: "0020190123",
    nombreCompleto: "Juan Alberto Pérez Rodríguez",
    facultad: "FIA",
    escuelaProfesional: "Ingeniería de Sistemas",
    metodoCarga: "individual",
    documentos: [
      {
        id: "doc-001",
        tipo: "ficha_inscripcion",
        nombre: "Ficha Inscripción - Juan Pérez.pdf",
        tamaño: 245000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
      {
        id: "doc-002",
        tipo: "certificado_medico",
        nombre: "Certificado Médico - Juan Pérez.pdf",
        tamaño: 312000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
      {
        id: "doc-003",
        tipo: "foto_3x4",
        nombre: "Foto 3x4 - Juan Pérez.jpg",
        tamaño: 89000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
      {
        id: "doc-004",
        tipo: "dni",
        nombre: "DNI - Juan Pérez.pdf",
        tamaño: 156000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
      {
        id: "doc-005",
        tipo: "constancia_matricula",
        nombre: "Constancia Matrícula - Juan Pérez.pdf",
        tamaño: 201000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
    ],
    estadoDocumentacion: "completo_aprobado",
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: "rec-002",
    jugadorId: "jug-002",
    codigoEstudiantial: "0020190124",
    nombreCompleto: "María Fernanda López González",
    facultad: "FIA",
    escuelaProfesional: "Ingeniería Agrónoma",
    metodoCarga: "individual",
    documentos: [
      {
        id: "doc-006",
        tipo: "ficha_inscripcion",
        nombre: "Ficha Inscripción - María López.pdf",
        tamaño: 245000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "aprobado",
      },
      {
        id: "doc-007",
        tipo: "certificado_medico",
        nombre: "Certificado Médico - María López.pdf",
        tamaño: 312000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "pendiente",
      },
    ],
    estadoDocumentacion: "completo_pendiente",
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: "rec-003",
    jugadorId: "jug-003",
    codigoEstudiantial: "0020190125",
    nombreCompleto: "Carlos Eduardo Ramírez Flores",
    facultad: "FIA",
    escuelaProfesional: "Ingeniería de Sistemas",
    metodoCarga: "drive",
    enlaceDrive: "https://drive.google.com/drive/folders/example",
    documentos: [
      {
        id: "doc-008",
        tipo: "ficha_inscripcion",
        nombre: "Ficha Inscripción - Carlos Ramírez.pdf",
        tamaño: 245000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "rechazado",
        comentarios: "DNI expirado en el documento",
      },
    ],
    estadoDocumentacion: "rechazado",
    ultimaActualizacion: new Date().toISOString(),
  },
];

export function RecordsManagementPanel({
  records = MOCK_RECORDS,
  tournamentId,
  userRole,
  onEdit,
  onDownload,
}: RecordsManagementPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filteredRecords = records.filter(record => {
    const matchSearch = 
      record.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.codigoEstudiantial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "todos" || record.estadoDocumentacion === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: records.length,
    aprobados: records.filter(r => r.estadoDocumentacion === "completo_aprobado").length,
    pendientes: records.filter(r => r.estadoDocumentacion === "completo_pendiente").length,
    incompletos: records.filter(r => r.estadoDocumentacion === "incompleto").length,
    rechazados: records.filter(r => r.estadoDocumentacion === "rechazado").length,
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          color="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatCard
          label="Aprobados"
          value={stats.aprobados}
          color="bg-green-50 text-green-700 border-green-200"
          icon="✓"
        />
        <StatCard
          label="Pendientes"
          value={stats.pendientes}
          color="bg-yellow-50 text-yellow-700 border-yellow-200"
          icon="⏳"
        />
        <StatCard
          label="Incompletos"
          value={stats.incompletos}
          color="bg-orange-50 text-orange-700 border-orange-200"
          icon="!"
        />
        <StatCard
          label="Rechazados"
          value={stats.rechazados}
          color="bg-red-50 text-red-700 border-red-200"
          icon="✕"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-56">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="completo_aprobado">Aprobados</SelectItem>
            <SelectItem value="completo_pendiente">Pendientes de revisión</SelectItem>
            <SelectItem value="incompleto">Incompletos</SelectItem>
            <SelectItem value="rechazado">Rechazados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">No hay récords que coincidan con los filtros</p>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const status = STATUS_CONFIG[record.estadoDocumentacion];
            const completeness = Math.round((record.documentos.filter(d => d.estado === "aprobado").length / record.documentos.length) * 100);

            return (
              <div
                key={record.id}
                className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {record.nombreCompleto[0]}{record.nombreCompleto.split(" ")[1]?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{record.nombreCompleto}</h3>
                      <p className="text-sm text-muted-foreground">
                        Código: {record.codigoEstudiantial}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("border", status.color)}
                    >
                      <span className="mr-2">{status.icon}</span>
                      {status.label}
                    </Badge>
                  </div>
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Facultad</p>
                    <p className="text-sm font-semibold">{record.facultad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Método de Carga</p>
                    <Badge variant="secondary" className="text-xs">
                      {record.metodoCarga === "individual" ? "Individual" : "Google Drive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Última Actualización</p>
                    <p className="text-sm font-semibold">
                      {new Date(record.ultimaActualizacion).toLocaleDateString("es-PE")}
                    </p>
                  </div>
                </div>

                {/* Progreso de Documentos */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Documentos ({record.documentos.length})</p>
                    <span className="text-xs font-bold text-primary">
                      {Math.round((record.documentos.filter(d => d.estado === "aprobado").length / record.documentos.length) * 100)}% completado
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${completeness}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Documentos */}
                {record.documentos.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {record.documentos.slice(0, 3).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-muted/20 rounded text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={cn(
                            "text-lg",
                            doc.estado === "aprobado" && "text-green-600",
                            doc.estado === "pendiente" && "text-yellow-600",
                            doc.estado === "rechazado" && "text-red-600"
                          )}>
                            {doc.estado === "aprobado" && "✓"}
                            {doc.estado === "pendiente" && "⏳"}
                            {doc.estado === "rechazado" && "✕"}
                          </span>
                          <span className="truncate">{doc.nombre}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] ml-2">
                          {(doc.tamaño / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    ))}
                    {record.documentos.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-2">
                        +{record.documentos.length - 3} más documento(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(record)}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Actualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(record.id)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comentarios
                  </Button>

                  <div className="flex-1" />

                  {record.estadoDocumentacion === "rechazado" && (
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  )}
                  {record.estadoDocumentacion === "completo_aprobado" && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      color
    )}>
      <p className="text-xs font-semibold opacity-75 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
