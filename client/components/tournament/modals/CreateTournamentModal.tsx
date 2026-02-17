import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateTournamentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TournamentFormData {
  // Step 1
  nombre: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  imagen?: File;
  imagenPreview?: string;

  // Step 2
  fechaInscripcionInicio: string;
  fechaInscripcionFin: string;
  fechaCompetenciaInicio: string;
  fechaCompetenciaFin: string;
  disciplinas: string[];

  // Step 3
  maxEquipos: number;
  sistemaCompetencia: string;
  equiposPorGrupo: number;
  clasificanPorGrupo: number;
  formatoEliminatorias: "unico" | "ida_vuelta";
  comiteAsignado: string;
  permitirGratuito: boolean;
  permitirPremium: boolean;
  generarFixtureAuto: boolean;
  notificacionesAuto: boolean;
  publicarAuto: boolean;
  escenarios: string[];
}

const DEPORTES = {
  colectivos: [
    "Fútbol Masculino",
    "Fútbol Femenino",
    "Vóley Masculino",
    "Vóley Femenino",
    "Básquet Masculino",
    "Básquet Femenino",
    "Futsal Masculino",
    "Futsal Femenino",
    "Handball Masculino",
    "Handball Femenino",
  ],
  individuales: [
    "Tenis",
    "Tenis de Mesa",
    "Bádminton",
    "Ajedrez",
    "Natación",
    "Atletismo",
    "Ciclismo",
    "Karate",
  ],
};

const COMITES = [
  "Comité A - Deportes Colectivos (Prof. García - Coord.)",
  "Comité B - Deportes Individuales (Prof. López - Coord.)",
  "Comité C - Deportes de Combate (Prof. Torres - Coord.)",
];

const ESCENARIOS = [
  "Estadio UNAS (Fútbol)",
  "Coliseo Cerrado (Vóley, Básquet)",
  "Cancha Sintética (Fútbol, Futsal)",
  "Piscina Olímpica (Natación)",
  "Pista de Atletismo",
];

export default function CreateTournamentModal({
  open,
  onOpenChange,
}: CreateTournamentModalProps) {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TournamentFormData>({
    nombre: "",
    tipo: "Olimpiada",
    categoria: "Interfacultades",
    descripcion: "",
    fechaInscripcionInicio: "",
    fechaInscripcionFin: "",
    fechaCompetenciaInicio: "",
    fechaCompetenciaFin: "",
    disciplinas: [],
    maxEquipos: 20,
    sistemaCompetencia: "grupos_eliminacion",
    equiposPorGrupo: 4,
    clasificanPorGrupo: 2,
    formatoEliminatorias: "unico",
    comiteAsignado: "Comité A - Deportes Colectivos (Prof. García - Coord.)",
    permitirGratuito: true,
    permitirPremium: true,
    generarFixtureAuto: true,
    notificacionesAuto: true,
    publicarAuto: true,
    escenarios: [],
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.length < 5) {
      newErrors.nombre = "Mínimo 5 caracteres";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "Máximo 100 caracteres";
    }

    if (!formData.tipo) {
      newErrors.tipo = "El tipo de competencia es requerido";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
    }

    if (formData.descripcion.length > 500) {
      newErrors.descripcion = "Máximo 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.fechaInscripcionInicio) {
      newErrors.fechaInscripcionInicio = "La fecha de inicio es requerida";
    } else if (new Date(formData.fechaInscripcionInicio) <= today) {
      newErrors.fechaInscripcionInicio = "La fecha debe ser futura";
    }

    if (!formData.fechaInscripcionFin) {
      newErrors.fechaInscripcionFin = "La fecha de cierre es requerida";
    } else if (
      new Date(formData.fechaInscripcionFin) <=
      new Date(formData.fechaInscripcionInicio)
    ) {
      newErrors.fechaInscripcionFin = "Debe ser posterior a la fecha de inicio";
    }

    if (!formData.fechaCompetenciaInicio) {
      newErrors.fechaCompetenciaInicio = "La fecha de inicio es requerida";
    } else if (
      new Date(formData.fechaCompetenciaInicio) <=
      new Date(formData.fechaInscripcionFin)
    ) {
      newErrors.fechaCompetenciaInicio =
        "Debe ser posterior al cierre de inscripciones";
    }

    if (!formData.fechaCompetenciaFin) {
      newErrors.fechaCompetenciaFin = "La fecha de finalización es requerida";
    } else if (
      new Date(formData.fechaCompetenciaFin) <=
      new Date(formData.fechaCompetenciaInicio)
    ) {
      newErrors.fechaCompetenciaFin = "Debe ser posterior a la fecha de inicio";
    }

    if (formData.disciplinas.length === 0) {
      newErrors.disciplinas = "Debes seleccionar al menos una disciplina";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (formData.maxEquipos < 4 || formData.maxEquipos > 100) {
      newErrors.maxEquipos = "Debe estar entre 4 y 100";
    }

    if (!formData.sistemaCompetencia) {
      newErrors.sistemaCompetencia = "El sistema es requerido";
    }

    if (!formData.comiteAsignado) {
      newErrors.comiteAsignado = "El comité es requerido";
    }

    if (
      formData.sistemaCompetencia === "grupos_eliminacion" ||
      formData.sistemaCompetencia === "todos_contra_todos"
    ) {
      if (formData.equiposPorGrupo < 2 || formData.equiposPorGrupo > 8) {
        newErrors.equiposPorGrupo = "Debe estar entre 2 y 8";
      }
      if (
        formData.clasificanPorGrupo < 1 ||
        formData.clasificanPorGrupo >= formData.equiposPorGrupo
      ) {
        newErrors.clasificanPorGrupo = "Valor inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    } else if (step === 3 && validateStep3()) {
      setShowConfirmation(true);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleCreate = () => {
    // Aquí iría la lógica para crear el torneo en la API
    console.log("Crear torneo:", formData);
    setShowConfirmation(false);
    setShowSuccess(true);

    // Cerrar el modal después de 3 segundos
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      // Reset form
      setStep(1);
      setFormData({
        nombre: "",
        tipo: "Olimpiada",
        categoria: "Interfacultades",
        descripcion: "",
        fechaInscripcionInicio: "",
        fechaInscripcionFin: "",
        fechaCompetenciaInicio: "",
        fechaCompetenciaFin: "",
        disciplinas: [],
        maxEquipos: 20,
        sistemaCompetencia: "grupos_eliminacion",
        equiposPorGrupo: 4,
        clasificanPorGrupo: 2,
        formatoEliminatorias: "unico",
        comiteAsignado:
          "Comité A - Deportes Colectivos (Prof. García - Coord.)",
        permitirGratuito: true,
        permitirPremium: true,
        generarFixtureAuto: true,
        notificacionesAuto: true,
        publicarAuto: true,
        escenarios: [],
      });
    }, 3000);
  };

  const closeModal = () => {
    if (!showSuccess) {
      onOpenChange(false);
      setStep(1);
      setErrors({});
      setShowConfirmation(false);
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const inscripcionDuration = calculateDuration(
    formData.fechaInscripcionInicio,
    formData.fechaInscripcionFin,
  );

  const competenciaDuration = calculateDuration(
    formData.fechaCompetenciaInicio,
    formData.fechaCompetenciaFin,
  );

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-green-400 rounded-full p-6">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              ¡TORNEO CREADO EXITOSAMENTE!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              ¡{formData.nombre} ha sido creado!
            </p>

            <div className="bg-primary-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-muted-foreground mb-4">
                Código del Torneo:{" "}
                <span className="font-bold">IFAC-2027-001</span>
              </p>

              <div className="mb-6">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Acciones completadas:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Torneo registrado en el sistema
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Comité notificado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Publicado en portal público
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Inscripciones abiertas
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  📋 PRÓXIMOS PASOS:
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>El Comité A puede comenzar a gestionar inscripciones</li>
                  <li>
                    Los delegados pueden inscribir equipos desde el 15 Mar
                  </li>
                  <li>El fixture se generará automáticamente el 30 Mar</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onOpenChange(false)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-700 transition-colors"
              >
                Ver Torneo Creado
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setStep(1);
                  setFormData({
                    nombre: "",
                    tipo: "Olimpiada",
                    categoria: "Interfacultades",
                    descripcion: "",
                    fechaInscripcionInicio: "",
                    fechaInscripcionFin: "",
                    fechaCompetenciaInicio: "",
                    fechaCompetenciaFin: "",
                    disciplinas: [],
                    maxEquipos: 20,
                    sistemaCompetencia: "grupos_eliminacion",
                    equiposPorGrupo: 4,
                    clasificanPorGrupo: 2,
                    formatoEliminatorias: "unico",
                    comiteAsignado:
                      "Comité A - Deportes Colectivos (Prof. García - Coord.)",
                    permitirGratuito: true,
                    permitirPremium: true,
                    generarFixtureAuto: true,
                    notificacionesAuto: true,
                    publicarAuto: true,
                    escenarios: [],
                  });
                }}
                className="px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary-700 transition-colors"
              >
                Crear Otro Torneo
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              CONFIRMAR CREACIÓN DE TORNEO
            </DialogTitle>
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Por favor, revisa la información antes de crear el torneo:
            </p>

            <div className="bg-primary-50 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="font-bold text-foreground mb-3">
                  📋 Información Básica:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Nombre:{" "}
                    <span className="text-foreground font-medium">
                      {formData.nombre}
                    </span>
                  </li>
                  <li>
                    • Tipo:{" "}
                    <span className="text-foreground font-medium">
                      {formData.tipo}
                    </span>
                  </li>
                  <li>
                    • Categoría:{" "}
                    <span className="text-foreground font-medium">
                      {formData.categoria}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">📅 Fechas:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Inscripciones: {formData.fechaInscripcionInicio} -{" "}
                    {formData.fechaInscripcionFin} ({inscripcionDuration} días)
                  </li>
                  <li>
                    • Competencia: {formData.fechaCompetenciaInicio} -{" "}
                    {formData.fechaCompetenciaFin} ({competenciaDuration} días)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">
                  🎯 Disciplinas: ({formData.disciplinas.length} seleccionadas)
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.disciplinas.join(", ")}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">
                  ⚙️ Configuración:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Sistema:{" "}
                    <span className="text-foreground font-medium">
                      {formData.sistemaCompetencia === "grupos_eliminacion"
                        ? "Grupos + Eliminación Directa"
                        : formData.sistemaCompetencia === "todos_contra_todos"
                          ? "Todos contra Todos"
                          : formData.sistemaCompetencia === "eliminacion"
                            ? "Eliminación Directa"
                            : "Sistema Suizo"}
                    </span>
                  </li>
                  <li>
                    • Máx. equipos/disciplina:{" "}
                    <span className="text-foreground font-medium">
                      {formData.maxEquipos}
                    </span>
                  </li>
                  <li>
                    • Comité asignado:{" "}
                    <span className="text-foreground font-medium">
                      {formData.comiteAsignado.split(" - ")[0]}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">
                  🤖 Automatización:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Fixture automático:{" "}
                    {formData.generarFixtureAuto
                      ? "✅ Activado"
                      : "❌ Desactivado"}
                  </li>
                  <li>
                    • Notificaciones:{" "}
                    {formData.notificacionesAuto
                      ? "✅ Activadas"
                      : "❌ Desactivadas"}
                  </li>
                  <li>
                    • Portal público:{" "}
                    {formData.publicarAuto ? "✅ Activado" : "❌ Desactivado"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-bold">⚠️ Al crear el torneo:</span>
                <br />• Se enviará notificación al comité asignado
                <br />• Se publicará en el portal para consulta pública
                <br />• Los delegados podrán comenzar a inscribir equipos
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors"
              >
                ← Volver a editar
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                CREAR TORNEO
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">+</span>
            CREAR NUEVO TORNEO
          </DialogTitle>
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground text-right">
            Paso {step} de 3
          </p>
        </div>

        {/* Step 1: Información Básica */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">
              PASO 1: INFORMACIÓN BÁSICA
            </h3>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Nombre del Torneo: *
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Interfacultades 2027"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.nombre
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } bg-white`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Máximo 100 caracteres ({formData.nombre.length}/100)
              </p>
              {errors.nombre && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Tipo de Competencia: *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.tipo
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } bg-white`}
              >
                <option>Olimpiada</option>
                <option>Copa</option>
                <option>Campeonato</option>
                <option>Amistoso</option>
              </select>
              {errors.tipo && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tipo}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-3">
                Categoría: *
              </label>
              <div className="flex gap-3">
                {["Interfacultades", "Cachimbos", "Especial"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, categoria: cat })}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      formData.categoria === cat
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {formData.categoria === cat ? "⚫" : "⚪"} {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Descripción:
              </label>
              <textarea
                maxLength={500}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="La olimpiada más importante del año donde todas las facultades..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.descripcion
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } bg-white`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Máximo 500 caracteres ({formData.descripcion.length}/500)
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Imagen del Torneo: (opcional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/jpg,image/png"
                  className="hidden"
                  id="tournament-image"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        alert("El archivo no debe exceder 5MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({
                          ...formData,
                          imagen: file,
                          imagenPreview: event.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="tournament-image" className="cursor-pointer">
                  <p className="text-lg mb-2">
                    📷 Arrastra una imagen o haz clic para subir
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formato: JPG, PNG | Tamaño máx: 5MB | Dimensiones
                    recomendadas: 1200x600px
                  </p>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fechas y Disciplinas */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">
              PASO 2: FECHAS Y DISCIPLINAS
            </h3>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                📅 PERIODO DE INSCRIPCIONES: *
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Fecha de inicio:
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInscripcionInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaInscripcionInicio: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.fechaInscripcionInicio
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    } bg-white`}
                  />
                  {errors.fechaInscripcionInicio && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.fechaInscripcionInicio}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Fecha de cierre:
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInscripcionFin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaInscripcionFin: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.fechaInscripcionFin
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    } bg-white`}
                  />
                  {errors.fechaInscripcionFin && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.fechaInscripcionFin}
                    </p>
                  )}
                </div>
              </div>
              {inscripcionDuration > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⏰ Duración: {inscripcionDuration} días
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                📅 PERIODO DE COMPETENCIA: *
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Fecha de inicio:
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCompetenciaInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaCompetenciaInicio: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.fechaCompetenciaInicio
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    } bg-white`}
                  />
                  {errors.fechaCompetenciaInicio && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.fechaCompetenciaInicio}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Fecha de finalización:
                  </label>
                  <input
                    type="date"
                    value={formData.fechaCompetenciaFin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaCompetenciaFin: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                      errors.fechaCompetenciaFin
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary"
                    } bg-white`}
                  />
                  {errors.fechaCompetenciaFin && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.fechaCompetenciaFin}
                    </p>
                  )}
                </div>
              </div>
              {competenciaDuration > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⏰ Duración: {competenciaDuration} días
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                🎯 DISCIPLINAS DEPORTIVAS: *
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Selecciona las disciplinas que participarán:
              </p>

              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <p className="font-bold text-sm text-foreground mb-3">
                    DEPORTES COLECTIVOS
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {DEPORTES.colectivos.map((sport) => (
                      <label
                        key={sport}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.disciplinas.includes(sport)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                disciplinas: [...formData.disciplinas, sport],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                disciplinas: formData.disciplinas.filter(
                                  (d) => d !== sport,
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <p className="font-bold text-sm text-foreground mb-3">
                    DEPORTES INDIVIDUALES
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {DEPORTES.individuales.map((sport) => (
                      <label
                        key={sport}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.disciplinas.includes(sport)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                disciplinas: [...formData.disciplinas, sport],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                disciplinas: formData.disciplinas.filter(
                                  (d) => d !== sport,
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    const allSports = [
                      ...DEPORTES.colectivos,
                      ...DEPORTES.individuales,
                    ];
                    setFormData({
                      ...formData,
                      disciplinas: allSports,
                    });
                  }}
                  className="text-sm font-bold text-primary hover:text-primary-700"
                >
                  ☑️ Seleccionar todas
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      disciplinas: [],
                    });
                  }}
                  className="text-sm font-bold text-muted-foreground hover:text-foreground"
                >
                  ☐ Deseleccionar todas
                </button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                📊 Total seleccionadas: {formData.disciplinas.length}{" "}
                disciplinas
              </p>

              {errors.disciplinas && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.disciplinas}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Configuración Avanzada */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">
              PASO 3: CONFIGURACIÓN Y PERMISOS
            </h3>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                ⚙️ PARÁMETROS DEL TORNEO:
              </h4>
              <label className="block text-sm font-bold text-foreground mb-2">
                Máximo de equipos por disciplina:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="4"
                  max="100"
                  value={formData.maxEquipos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxEquipos: parseInt(e.target.value) || 20,
                    })
                  }
                  className={`w-32 px-4 py-2 border rounded-lg focus:outline-none ${
                    errors.maxEquipos
                      ? "border-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  } bg-white`}
                />
                <p className="text-xs text-muted-foreground">
                  (Recomendado: 16-24 equipos)
                </p>
              </div>
              {errors.maxEquipos && (
                <p className="text-xs text-destructive mt-1">
                  {errors.maxEquipos}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Sistema de competencia: *
              </label>
              <select
                value={formData.sistemaCompetencia}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sistemaCompetencia: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.sistemaCompetencia
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } bg-white`}
              >
                <option value="todos_contra_todos">
                  Todos contra Todos (Round Robin)
                </option>
                <option value="grupos_eliminacion">
                  Fase de Grupos + Eliminación Directa
                </option>
                <option value="eliminacion">Eliminación Directa</option>
                <option value="suizo">Sistema Suizo</option>
              </select>

              {(formData.sistemaCompetencia === "grupos_eliminacion" ||
                formData.sistemaCompetencia === "todos_contra_todos") && (
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted rounded-lg">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Equipos por grupo:
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={formData.equiposPorGrupo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          equiposPorGrupo: parseInt(e.target.value) || 4,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.equiposPorGrupo
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      } bg-white`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      Clasifican por grupo:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={formData.equiposPorGrupo - 1}
                      value={formData.clasificanPorGrupo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clasificanPorGrupo: parseInt(e.target.value) || 2,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                        errors.clasificanPorGrupo
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary"
                      } bg-white`}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-foreground">
                  Formato de Eliminatorias:
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eliminatorias"
                    checked={formData.formatoEliminatorias === "unico"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        formatoEliminatorias: "unico",
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Partido único</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eliminatorias"
                    checked={formData.formatoEliminatorias === "ida_vuelta"}
                    onChange={() =>
                      setFormData({
                        ...formData,
                        formatoEliminatorias: "ida_vuelta",
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-foreground">Ida y vuelta</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                👥 ASIGNAR COMITÉ DEPORTIVO: *
              </label>
              <select
                value={formData.comiteAsignado}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comiteAsignado: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.comiteAsignado
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } bg-white`}
              >
                {COMITES.map((comite) => (
                  <option key={comite} value={comite}>
                    {comite}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                ℹ️ El comité será responsable de aprobar inscripciones, generar
                fixtures y registrar resultados.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                💳 OPCIONES DE INSCRIPCIÓN:
              </h4>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={formData.permitirGratuito}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permitirGratuito: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Permitir inscripciones con Plan Gratuito
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.permitirPremium}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      permitirPremium: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Permitir inscripciones con Plan Premium
                </span>
              </label>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                🤖 AUTOMATIZACIÓN:
              </h4>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={formData.generarFixtureAuto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generarFixtureAuto: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Generar fixture automáticamente al cerrar inscripciones
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={formData.notificacionesAuto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificacionesAuto: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Enviar notificaciones automáticas a delegados
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.publicarAuto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicarAuto: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">
                  Publicar automáticamente en portal público
                </span>
              </label>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-3">
                🏟️ ESCENARIOS DEPORTIVOS:
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Asignar escenarios predeterminados: (opcional)
              </p>
              <div className="space-y-2">
                {ESCENARIOS.map((escenario) => (
                  <label
                    key={escenario}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.escenarios.includes(escenario)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            escenarios: [...formData.escenarios, escenario],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            escenarios: formData.escenarios.filter(
                              (e) => e !== escenario,
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">{escenario}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ℹ️ Esto facilitará la programación automática del fixture
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-8 border-t pt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </button>
          )}
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors"
          >
            Cancelar
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              CREAR TORNEO →
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
