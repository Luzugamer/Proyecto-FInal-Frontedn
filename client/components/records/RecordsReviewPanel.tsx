import { useState } from "react";
import {
  CheckCircle2,
  X,
  MessageSquare,
  Download,
  Eye,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudentRecord, Document } from "@shared/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecordsReviewPanelProps {
  records?: StudentRecord[];
  tournamentId?: string;
  userRole?: string;
  onApprove?: (recordId: string, documentId: string) => void;
  onReject?: (recordId: string, documentId: string, motivo: string) => void;
}

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
        estado: "pendiente",
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
        estado: "pendiente",
      },
    ],
    estadoDocumentacion: "completo_pendiente",
    ultimaActualizacion: new Date().toISOString(),
  },
  {
    id: "rec-002",
    jugadorId: "jug-002",
    codigoEstudiantial: "0020190124",
    nombreCompleto: "María Fernanda López González",
    facultad: "FIA",
    escuelaProfesional: "Ingeniería Agrónoma",
    metodoCarga: "drive",
    enlaceDrive: "https://drive.google.com/drive/folders/example",
    documentos: [
      {
        id: "doc-006",
        tipo: "ficha_inscripcion",
        nombre: "Ficha Inscripción - María López.pdf",
        tamaño: 245000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "pendiente",
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
      {
        id: "doc-008",
        tipo: "foto_3x4",
        nombre: "Foto 3x4 - María López.jpg",
        tamaño: 89000,
        url: "#",
        fechaCarga: new Date().toISOString(),
        estado: "pendiente",
      },
    ],
    estadoDocumentacion: "incompleto",
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
    enlaceDrive: "https://drive.google.com/drive/folders/example2",
    documentos: [
      {
        id: "doc-009",
        tipo: "ficha_inscripcion",
        nombre: "Ficha Inscripción - Carlos Ramírez.pdf",
        tamaño: 245000,
        url: "#",
        fechaCarga: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "rechazado",
        comentarios: "DNI vencido - Requiere actualización",
      },
    ],
    estadoDocumentacion: "rechazado",
    ultimaActualizacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface RejectionDialogState {
  open: boolean;
  recordId?: string;
  documentId?: string;
  documentName?: string;
}

export function RecordsReviewPanel({
  records = MOCK_RECORDS,
  tournamentId,
  userRole,
  onApprove,
  onReject,
}: RecordsReviewPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFacultad, setFilterFacultad] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [rejectionDialog, setRejectionDialog] = useState<RejectionDialogState>({ open: false });
  const [rejectionMotivo, setRejectionMotivo] = useState("");

  const facultades = ["todos", ...new Set(records.map(r => r.facultad))];

  const filteredRecords = records.filter(record => {
    const matchSearch =
      record.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.codigoEstudiantial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFacultad = filterFacultad === "todos" || record.facultad === filterFacultad;
    const matchEstado = filterEstado === "todos" || record.estadoDocumentacion === filterEstado;
    return matchSearch && matchFacultad && matchEstado;
  });

  const handleSelectRecord = (recordId: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleApproveAll = () => {
    selectedRecords.forEach(recordId => {
      const record = records.find(r => r.id === recordId);
      if (record) {
        record.documentos.forEach(doc => {
          onApprove(recordId, doc.id);
        });
      }
    });
    toast.success(`${selectedRecords.size} registro(s) aprobado(s)`);
    setSelectedRecords(new Set());
  };

  const handleOpenRejectionDialog = (recordId: string, documentId: string, documentName: string) => {
    setRejectionDialog({
      open: true,
      recordId,
      documentId,
      documentName,
    });
    setRejectionMotivo("");
  };

  const handleConfirmRejection = () => {
    if (!rejectionDialog.recordId || !rejectionDialog.documentId || !rejectionMotivo.trim()) {
      toast.error("Por favor ingresa el motivo del rechazo");
      return;
    }

    onReject(rejectionDialog.recordId, rejectionDialog.documentId, rejectionMotivo);
    setRejectionDialog({ open: false });
    toast.success("Documento rechazado. Se notificará al delegado.");
  };

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
        <StatCard label="Total" value={stats.total} color="bg-blue-50 text-blue-700" />
        <StatCard label="Aprobados" value={stats.aprobados} color="bg-green-50 text-green-700" icon="✓" />
        <StatCard label="Pendientes" value={stats.pendientes} color="bg-yellow-50 text-yellow-700" icon="⏳" />
        <StatCard label="Incompletos" value={stats.incompletos} color="bg-orange-50 text-orange-700" icon="!" />
        <StatCard label="Rechazados" value={stats.rechazados} color="bg-red-50 text-red-700" icon="✕" />
      </div>

      {/* Acciones Masivas */}
      {selectedRecords.size > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <p className="font-semibold text-sm">
            {selectedRecords.size} registro(s) seleccionado(s)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRecords(new Set())}
            >
              Limpiar selección
            </Button>
            <Button
              size="sm"
              onClick={handleApproveAll}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Aprobar Seleccionados
            </Button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterFacultad} onValueChange={setFilterFacultad}>
          <SelectTrigger>
            <SelectValue placeholder="Facultad" />
          </SelectTrigger>
          <SelectContent>
            {facultades.map(f => (
              <SelectItem key={f} value={f}>
                {f === "todos" ? "Todas las facultades" : f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="completo_aprobado">Aprobados</SelectItem>
            <SelectItem value="completo_pendiente">Pendientes</SelectItem>
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
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Checkbox
                    checked={selectedRecords.has(record.id)}
                    onCheckedChange={() => handleSelectRecord(record.id)}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{record.nombreCompleto}</h3>
                        <p className="text-sm text-muted-foreground">
                          {record.codigoEstudiantial} • {record.facultad}
                        </p>
                      </div>
                      <Badge
                        variant={record.estadoDocumentacion === "completo_aprobado" ? "default" : "outline"}
                        className={cn(
                          record.estadoDocumentacion === "completo_aprobado" && "bg-green-600",
                          record.estadoDocumentacion === "completo_pendiente" && "bg-yellow-600 text-white",
                          record.estadoDocumentacion === "incompleto" && "bg-orange-600 text-white",
                          record.estadoDocumentacion === "rechazado" && "bg-red-600 text-white"
                        )}
                      >
                        {record.estadoDocumentacion === "completo_aprobado" && "✓ Aprobado"}
                        {record.estadoDocumentacion === "completo_pendiente" && "⏳ Pendiente"}
                        {record.estadoDocumentacion === "incompleto" && "! Incompleto"}
                        {record.estadoDocumentacion === "rechazado" && "✕ Rechazado"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-2 pl-12">
                  {record.documentos.map((doc) => (
                    <DocumentReviewItem
                      key={doc.id}
                      document={doc}
                      recordId={record.id}
                      onApprove={() => onApprove(record.id, doc.id)}
                      onReject={() => handleOpenRejectionDialog(record.id, doc.id, doc.nombre)}
                    />
                  ))}
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground pl-12">
                  <span>Actualizado: {new Date(record.ultimaActualizacion).toLocaleDateString("es-PE")}</span>
                  {record.metodoCarga === "drive" && (
                    <a
                      href={record.enlaceDrive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Acceder a Drive
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog.open} onOpenChange={(open) => setRejectionDialog({ ...rejectionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Rechazar Documento
            </DialogTitle>
            <DialogDescription>
              Documento: <span className="font-bold text-foreground">{rejectionDialog.documentName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="font-bold mb-2 block">Motivo del Rechazo</Label>
              <Textarea
                placeholder="Especifica por qué se rechaza este documento (e.g., imagen borrosa, formato incorrecto, información faltante)"
                value={rejectionMotivo}
                onChange={(e) => setRejectionMotivo(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                El delegado deportivo recibirá una notificación por email con este motivo y podrá corregir y re-subir el documento.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialog({ open: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRejection}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DocumentReviewItemProps {
  document: Document;
  recordId: string;
  onApprove: () => void;
  onReject: () => void;
}

function DocumentReviewItem({
  document,
  recordId,
  onApprove,
  onReject,
}: DocumentReviewItemProps) {
  const statusConfig = {
    pendiente: { icon: "⏳", color: "text-yellow-600", bg: "bg-yellow-50" },
    aprobado: { icon: "✓", color: "text-green-600", bg: "bg-green-50" },
    rechazado: { icon: "✕", color: "text-red-600", bg: "bg-red-50" },
  };

  const status = statusConfig[document.estado];

  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border", status.bg)}>
      <div className="flex items-center gap-3 flex-1">
        <span className={cn("text-lg", status.color)}>{status.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{document.nombre}</p>
          <p className="text-xs text-muted-foreground">
            {(document.tamaño / 1024 / 1024).toFixed(2)} MB • {new Date(document.fechaCarga).toLocaleDateString("es-PE")}
          </p>
        </div>
      </div>

      {document.estado === "pendiente" && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-green-600 hover:text-green-700"
            onClick={onApprove}
            title="Aprobar"
          >
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700"
            onClick={onReject}
            title="Rechazar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {document.estado === "rechazado" && document.comentarios && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          title={document.comentarios}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      )}
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
    <div className={cn("p-4 rounded-lg border", color)}>
      <p className="text-xs font-semibold opacity-75 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
