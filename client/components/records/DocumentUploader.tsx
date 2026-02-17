import { useState, useRef } from "react";
import { Upload, FileIcon, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DocumentType } from "@shared/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface DocumentUploaderProps {
  documentType: DocumentType;
  onDocumentsUploaded: (files: File[], type: DocumentType) => void;
  maxFileSize?: number; // en MB, default 5
  maxTotalSize?: number; // en MB, default 20
  acceptedFormats?: string[];
}

const DEFAULT_ACCEPTED = ["pdf", "jpg", "jpeg", "png"];
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

export function DocumentUploader({
  documentType,
  onDocumentsUploaded,
  maxFileSize = 5,
  maxTotalSize = 20,
  acceptedFormats = DEFAULT_ACCEPTED,
}: DocumentUploaderProps) {
  const [filesWithProgress, setFilesWithProgress] = useState<FileWithProgress[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Validar tamaño individual
    if (file.size > maxFileSize * 1024 * 1024) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${maxFileSize}MB`;
    }

    // Validar formato
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      return `El formato ".${fileExtension}" no es permitido. Formatos válidos: ${acceptedFormats.join(", ")}`;
    }

    return null;
  };

  const validateTotalSize = (files: File[]): string | null => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize * 1024 * 1024) {
      return `El tamaño total de archivos excede ${maxTotalSize}MB`;
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const allFiles = [...filesWithProgress.map(f => f.file), ...newFiles];

    // Validar tamaño total
    const totalSizeError = validateTotalSize(allFiles);
    if (totalSizeError) {
      toast.error(totalSizeError);
      return;
    }

    // Validar cada archivo
    let hasErrors = false;
    const validFiles: File[] = [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        hasErrors = true;
      } else {
        validFiles.push(file);
      }
    }

    // Agregar archivos válidos con estado pending
    const newFilesWithProgress: FileWithProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: "pending",
    }));

    setFilesWithProgress([...filesWithProgress, ...newFilesWithProgress]);

    // Simular progreso de carga
    newFilesWithProgress.forEach((fw, index) => {
      setTimeout(() => {
        simulateUpload(filesWithProgress.length + index);
      }, index * 100);
    });
  };

  const simulateUpload = (index: number) => {
    setFilesWithProgress(prev => {
      const updated = [...prev];
      updated[index].status = "uploading";
      return updated;
    });

    // Simular carga progresiva
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setFilesWithProgress(prev => {
          const updated = [...prev];
          updated[index].progress = 100;
          updated[index].status = "success";
          return updated;
        });
      } else {
        setFilesWithProgress(prev => {
          const updated = [...prev];
          updated[index].progress = progress;
          return updated;
        });
      }
    }, 300);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setFilesWithProgress(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const successFiles = filesWithProgress
      .filter(fw => fw.status === "success")
      .map(fw => fw.file);

    if (successFiles.length === 0) {
      toast.error("No hay archivos para subir");
      return;
    }

    onDocumentsUploaded(successFiles, documentType);
    setFilesWithProgress([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const successCount = filesWithProgress.filter(fw => fw.status === "success").length;
  const allComplete = filesWithProgress.length > 0 && filesWithProgress.every(fw => fw.status === "success");

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5 scale-105"
            : "border-border bg-muted/30 hover:border-primary/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={acceptedFormats.map(f => `.${f}`).join(",")}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-1">Arrastra archivos aquí</h3>
        <p className="text-sm text-muted-foreground mb-4">
          o haz clic para seleccionar desde tu computadora
        </p>

        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Seleccionar archivos
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <label className="cursor-pointer">
              Información de formato
              <span className="text-xs text-muted-foreground ml-2">
                {acceptedFormats.join(", ")} • Máx {maxFileSize}MB/archivo
              </span>
            </label>
          </Button>
        </div>
      </div>

      {/* Files List */}
      {filesWithProgress.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold">{filesWithProgress.length} archivo(s) seleccionado(s)</h4>
            <span className="text-sm text-primary font-semibold">
              {successCount}/{filesWithProgress.length} listo(s)
            </span>
          </div>

          {filesWithProgress.map((fw, index) => (
            <div
              key={index}
              className="p-3 bg-white border border-border rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fw.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(fw.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {fw.status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
                {fw.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                {fw.status !== "success" && fw.status !== "error" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {fw.status !== "success" && fw.status !== "error" && (
                <Progress value={fw.progress} className="h-2" />
              )}
              {fw.error && (
                <p className="text-xs text-red-600">{fw.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {filesWithProgress.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilesWithProgress([])}
            className="flex-1"
          >
            Limpiar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!allComplete}
            className="flex-1"
          >
            {allComplete ? "✓ Subir Documentos" : "Esperando carga..."}
          </Button>
        </div>
      )}
    </div>
  );
}
