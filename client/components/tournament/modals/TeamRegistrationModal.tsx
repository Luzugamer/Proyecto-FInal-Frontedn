import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CheckCircle } from "lucide-react";

const DISCIPLINES = [
  "Fútbol Masculino",
  "Fútbol Femenino",
  "Básquet Masculino",
  "Básquet Femenino",
];

const FACULTIES = [
  { id: "fac-1", nombre: "Agronomía" },
  { id: "fac-2", nombre: "Ingeniería" },
  { id: "fac-3", nombre: "Zootecnia" },
  { id: "fac-4", nombre: "Veterinaria" },
  { id: "fac-5", nombre: "Administración" },
];

interface TeamRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamRegistrationModal({
  open,
  onOpenChange,
}: TeamRegistrationModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    coachName: "",
    facultadId: user?.facultad?.id || "",
    disciplines: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDelegado = user?.rol === "DELEGADO_DEPORTES";
  const isAdmin =
    user?.rol === "SUPER_ADMIN" || user?.rol === "ADMINISTRADOR";

  // Auto-select faculty for delegados
  const displayFacultad =
    isDelegado && user?.facultad
      ? user.facultad.nombre
      : FACULTIES.find((f) => f.id === formData.facultadId)?.nombre || "";

  const handleDisciplineToggle = (discipline: string) => {
    setFormData((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(discipline)
        ? prev.disciplines.filter((d) => d !== discipline)
        : [...prev.disciplines, discipline],
    }));
    // Clear discipline error when user selects one
    if (errors.disciplines) {
      setErrors((prev) => ({ ...prev, disciplines: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = "El nombre del equipo es requerido";
    }
    if (!formData.coachName.trim()) {
      newErrors.coachName = "El nombre del entrenador es requerido";
    }
    if (!isDelegado && !formData.facultadId) {
      newErrors.facultadId = "La facultad es requerida";
    }
    if (formData.disciplines.length === 0) {
      newErrors.disciplines = "Selecciona al menos una disciplina";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulamos una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registering team:", {
        ...formData,
        facultadId: isDelegado ? user?.facultad?.id : formData.facultadId,
      });

      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          teamName: "",
          coachName: "",
          facultadId: user?.facultad?.id || "",
          disciplines: [],
        });
        setSubmitSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      setErrors({ submit: "Error al registrar el equipo. Intenta de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      setFormData({
        teamName: "",
        coachName: "",
        facultadId: user?.facultad?.id || "",
        disciplines: [],
      });
      setErrors({});
      setSubmitSuccess(false);
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Nuevo Equipo</DialogTitle>
          <DialogDescription>
            {isDelegado
              ? `Registra un nuevo equipo para ${user?.facultad?.nombre}`
              : "Registra un nuevo equipo para una facultad"}
          </DialogDescription>
        </DialogHeader>

        {submitSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Equipo registrado!</p>
              <p className="text-sm text-green-700">
                El equipo ha sido registrado exitosamente
              </p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="teamName" className="font-semibold">
              Nombre del Equipo
            </Label>
            <Input
              id="teamName"
              placeholder="Ej: Agronomía FC"
              value={formData.teamName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, teamName: e.target.value }))
              }
              disabled={isSubmitting}
              className={errors.teamName ? "border-red-500" : ""}
            />
            {errors.teamName && (
              <p className="text-sm text-red-600">{errors.teamName}</p>
            )}
          </div>

          {/* Coach Name */}
          <div className="space-y-2">
            <Label htmlFor="coachName" className="font-semibold">
              Nombre del Entrenador
            </Label>
            <Input
              id="coachName"
              placeholder="Ej: Carlos Busquets"
              value={formData.coachName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, coachName: e.target.value }))
              }
              disabled={isSubmitting}
              className={errors.coachName ? "border-red-500" : ""}
            />
            {errors.coachName && (
              <p className="text-sm text-red-600">{errors.coachName}</p>
            )}
          </div>

          {/* Faculty Selection */}
          {isDelegado ? (
            <div className="space-y-2">
              <Label className="font-semibold">Facultad</Label>
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="font-medium text-foreground">{displayFacultad}</p>
                <p className="text-sm text-muted-foreground">
                  Como delegado, solo puedes registrar equipos de tu facultad
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="facultad" className="font-semibold">
                Facultad
              </Label>
              <Select
                value={formData.facultadId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, facultadId: value }))
                }
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="facultad"
                  className={errors.facultadId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Selecciona una facultad" />
                </SelectTrigger>
                <SelectContent>
                  {FACULTIES.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.facultadId && (
                <p className="text-sm text-red-600">{errors.facultadId}</p>
              )}
            </div>
          )}

          {/* Disciplines Selection */}
          <div className="space-y-3">
            <Label className="font-semibold">
              Disciplinas ({formData.disciplines.length} seleccionadas)
            </Label>
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              {DISCIPLINES.map((discipline) => (
                <div key={discipline} className="flex items-center gap-3">
                  <Checkbox
                    id={discipline}
                    checked={formData.disciplines.includes(discipline)}
                    onCheckedChange={() => handleDisciplineToggle(discipline)}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor={discipline}
                    className="font-medium cursor-pointer flex-1 mb-0"
                  >
                    {discipline}
                  </Label>
                </div>
              ))}
            </div>
            {errors.disciplines && (
              <p className="text-sm text-red-600">{errors.disciplines}</p>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="flex-1"
            >
              {isSubmitting ? "Registrando..." : "Registrar Equipo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
