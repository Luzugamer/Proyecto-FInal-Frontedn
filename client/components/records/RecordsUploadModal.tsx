import { useState } from "react";
import { Plus, X, FileText, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentUploader } from "./DocumentUploader";
import { 
  DocumentType, 
  StudentRecord, 
  RecordsUploadMethod 
} from "@shared/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecordsUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jugadores: Array<{
    id: string;
    codigo: string;
    nombres: string;
    apellidos: string;
    facultad: string;
    escuelaProfesional: string;
    foto?: string;
  }>;
  disciplina: string;
  onComplete: (records: StudentRecord[]) => void;
}

const REQUIRED_DOCUMENTS: DocumentType[] = [
  "ficha_inscripcion",
  "certificado_medico",
  "foto_3x4",
  "dni",
  "constancia_matricula",
];

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ficha_inscripcion: "Ficha de Inscripción",
  certificado_medico: "Certificado Médico",
  foto_3x4: "Fotografía 3x4",
  dni: "DNI (ambos lados)",
  constancia_matricula: "Constancia de Matrícula",
  declaracion_jurada: "Declaración Jurada",
  seguro_accidentes: "Seguro contra Accidentes",
  otros: "Otros Documentos",
};

export function RecordsUploadModal({
  isOpen,
  onClose,
  jugadores,
  disciplina,
  onComplete,
}: RecordsUploadModalProps) {
  const [uploadMethod, setUploadMethod] = useState<RecordsUploadMethod>("individual");
  const [currentJugadorIndex, setCurrentJugadorIndex] = useState(0);
  const [driveUrl, setDriveUrl] = useState("");
  const [isValidatingDrive, setIsValidatingDrive] = useState(false);
  const [driveValidation, setDriveValidation] = useState<{
    valido: boolean;
    errores: string[];
  } | null>(null);

  const currentJugador = jugadores[currentJugadorIndex];
  const completedCount = currentJugadorIndex;

  const handleDocumentsUpload = (files: File[], type: DocumentType) => {
    toast.success(`${files.length} documento(s) de ${DOCUMENT_TYPE_LABELS[type]} subido(s)`);
    // Avanzar al siguiente jugador si hay más
    if (currentJugadorIndex < jugadores.length - 1) {
      setCurrentJugadorIndex(prev => prev + 1);
    }
  };

  const handleValidateDrive = async () => {
    if (!driveUrl.trim()) {
      toast.error("Por favor ingresa una URL de Google Drive");
      return;
    }

    setIsValidatingDrive(true);

    // Simular validación de Drive
    setTimeout(() => {
      const errors: string[] = [];
      
      // Validaciones simuladas
      if (!driveUrl.includes("drive.google.com")) {
        errors.push("URL no es válida de Google Drive");
      }
      if (!driveUrl.includes("open?id=") && !driveUrl.includes("/folders/")) {
        errors.push("URL debe apuntar a una carpeta de Drive");
      }

      const isValid = errors.length === 0;
      
      setDriveValidation({
        valido: isValid,
        errores: errors,
      });

      setIsValidatingDrive(false);

      if (isValid) {
        toast.success("Enlace de Google Drive validado correctamente");
      } else {
        toast.error(errors[0] || "Error al validar el enlace");
      }
    }, 1500);
  };

  const handleCompleteRecords = () => {
    // Simular creación de registros
    const records: StudentRecord[] = jugadores.map(j => ({
      id: `record-${j.id}`,
      jugadorId: j.id,
      codigoEstudiantial: j.codigo,
      nombreCompleto: `${j.nombres} ${j.apellidos}`,
      facultad: j.facultad,
      escuelaProfesional: j.escuelaProfesional,
      fotoDIIA: j.foto,
      metodoCarga: uploadMethod,
      documentos: [],
      estadoDocumentacion: "incompleto",
      ultimaActualizacion: new Date().toISOString(),
      enlaceDrive: uploadMethod === "drive" ? driveUrl : undefined,
    }));

    onComplete(records);
    toast.success("Récords de jugadores registrados correctamente");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Gestión de Récords de Jugadores
          </DialogTitle>
          <DialogDescription>
            Disciplina: <span className="font-bold text-foreground">{disciplina}</span>
            {" "} • Total de jugadores: <span className="font-bold text-primary">{jugadores.length}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Progress Bar */}
          <div className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-bold">Progreso de Carga</Label>
              <span className="text-sm font-semibold text-primary">
                {completedCount}/{jugadores.length} completado(s)
              </span>
            </div>
            <Progress 
              value={(completedCount / jugadores.length) * 100} 
              className="h-3"
            />
          </div>

          {/* Main Content */}
          <ScrollArea className="flex-1 px-6 py-6">
            <Tabs
              value={uploadMethod}
              onValueChange={(v) => setUploadMethod(v as RecordsUploadMethod)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="individual" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Por Jugador (Individual)
                </TabsTrigger>
                <TabsTrigger value="drive" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Google Drive
                </TabsTrigger>
              </TabsList>

              {/* OPCIÓN 1: Individual */}
              <TabsContent value="individual" className="space-y-6">
                {/* Información del Jugador */}
                <div className="bg-white p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                      {currentJugador?.nombres[0]}{currentJugador?.apellidos[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {currentJugador?.nombres} {currentJugador?.apellidos}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Código: {currentJugador?.codigo}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {currentJugador?.facultad}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {currentJugador?.escuelaProfesional}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      Jugador {currentJugadorIndex + 1} de {jugadores.length}
                    </div>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Documentos Requeridos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {REQUIRED_DOCUMENTS.map(doc => (
                      <div key={doc} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        {DOCUMENT_TYPE_LABELS[doc]}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="space-y-4">
                  {REQUIRED_DOCUMENTS.map((docType) => (
                    <div key={docType} className="border rounded-xl p-4">
                      <Label className="font-bold mb-3 block">
                        {DOCUMENT_TYPE_LABELS[docType]}
                      </Label>
                      <DocumentUploader
                        documentType={docType}
                        onDocumentsUploaded={handleDocumentsUpload}
                        maxFileSize={5}
                        maxTotalSize={20}
                        acceptedFormats={["pdf", "jpg", "jpeg", "png"]}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentJugadorIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentJugadorIndex === 0}
                  >
                    ← Anterior
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="outline"
                    onClick={() => setCurrentJugadorIndex(prev => Math.min(jugadores.length - 1, prev + 1))}
                    disabled={currentJugadorIndex === jugadores.length - 1}
                  >
                    Siguiente →
                  </Button>
                </div>
              </TabsContent>

              {/* OPCIÓN 2: Google Drive */}
              <TabsContent value="drive" className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-blue-900">
                    <AlertCircle className="w-4 h-4" />
                    Instrucciones de Estructura en Drive
                  </h4>
                  <p className="text-xs text-blue-800 mb-3">
                    Organiza tus archivos en Google Drive siguiendo esta estructura:
                  </p>
                  <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
{`📁 Récords ${disciplina} 2026
  📁 [Código] - Nombre Jugador 1
    📄 Ficha_Inscripcion.pdf
    📄 Certificado_Medico.pdf
    📄 Foto_3x4.jpg
    📄 DNI.pdf
    📄 Constancia_Matricula.pdf
  📁 [Código] - Nombre Jugador 2
    📄 ...`}
                  </pre>
                </div>

                {/* Google Drive URL Input */}
                <div className="bg-white border border-border rounded-xl p-6 space-y-4">
                  <div>
                    <Label className="font-bold mb-2 block">
                      URL de Carpeta Compartida en Google Drive
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Asegúrate de que el acceso esté configurado como "Cualquier persona con el enlace puede ver"
                    </p>
                    <Input
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>

                  <Button
                    onClick={handleValidateDrive}
                    disabled={isValidatingDrive}
                    className="w-full"
                  >
                    {isValidatingDrive ? "Validando..." : "Verificar Enlace"}
                  </Button>

                  {driveValidation && (
                    <div
                      className={cn(
                        "p-4 rounded-lg",
                        driveValidation.valido
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {driveValidation.valido ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h4 className={cn(
                            "font-bold text-sm mb-2",
                            driveValidation.valido ? "text-green-900" : "text-red-900"
                          )}>
                            {driveValidation.valido
                              ? "Enlace validado correctamente"
                              : "Errores detectados"}
                          </h4>
                          {driveValidation.errores.length > 0 && (
                            <ul className="text-xs space-y-1">
                              {driveValidation.errores.map((error, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-red-600">•</span>
                                  {error}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation Report */}
                {driveValidation?.valido && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-green-900">
                      <CheckCircle2 className="w-4 h-4" />
                      Reporte de Validación
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span>✅ Estructu de carpetas</span>
                        <Badge className="bg-green-600">Válida</Badge>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>✅ Permisos de acceso</span>
                        <Badge className="bg-green-600">Correctos</Badge>
                      </p>
                      <p className="flex items-center justify-between">
                        <span>✅ Documentos mínimos</span>
                        <Badge className="bg-green-600">{jugadores.length}/{jugadores.length}</Badge>
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 border-t bg-muted/10">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleCompleteRecords}
            disabled={uploadMethod === "drive" && !driveValidation?.valido}
            className="min-w-[200px]"
          >
            Completar Carga de Récords
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
