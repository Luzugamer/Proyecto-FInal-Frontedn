import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Table2,
  GitBranch,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateTournamentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Tipos de sistema de competencia ─────────────────────────────────────────

type SistemaCompetencia =
  | "todos_contra_todos"
  | "grupos_eliminacion"
  | "eliminacion"
  | "suizo";

interface DisciplinaConfig {
  disciplina: string;
  sistema: SistemaCompetencia;
  numGrupos: number;
  clasificanPorGrupo: number;
  equiposEnBracket: number;
}

// ─── Opciones visuales de sistema ────────────────────────────────────────────

const SISTEMAS_OPTIONS: {
  id: SistemaCompetencia;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  tip: string;
}[] = [
  {
    id: "todos_contra_todos",
    label: "Tabla de posiciones",
    sublabel: "Todos contra todos · Liga",
    icon: <Table2 className="w-5 h-5" />,
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-400",
    activeText: "text-blue-700",
    tip: "Todos los equipos se enfrentan entre sí. Gana quien tenga más puntos.",
  },
  {
    id: "grupos_eliminacion",
    label: "Grupos + Eliminación",
    sublabel: "Fase de grupos → bracket final",
    icon: <Layers className="w-5 h-5" />,
    activeBg: "bg-green-50",
    activeBorder: "border-green-400",
    activeText: "text-green-700",
    tip: "Los mejores de cada grupo pasan a un bracket de eliminación directa.",
  },
  {
    id: "eliminacion",
    label: "Eliminación directa",
    sublabel: "Bracket desde la primera ronda",
    icon: <GitBranch className="w-5 h-5" />,
    activeBg: "bg-red-50",
    activeBorder: "border-red-400",
    activeText: "text-red-700",
    tip: "El perdedor queda fuera. Rápido y emocionante.",
  },
  {
    id: "suizo",
    label: "Sistema Suizo",
    sublabel: "Rondas por puntaje acumulado",
    icon: <span className="text-xl">♟️</span>,
    activeBg: "bg-purple-50",
    activeBorder: "border-purple-400",
    activeText: "text-purple-700",
    tip: "Cada ronda enfrenta equipos con puntaje similar. Ideal para ajedrez.",
  },
];

const GRUPOS_OPTS = [2, 3, 4];
const CLASIFICAN_OPTS = [1, 2, 3];
const BRACKET_OPTS = [4, 8, 16, 32];

function calcBracketSize(grupos: number, clasifican: number): number {
  const total = grupos * clasifican;
  return Math.pow(2, Math.ceil(Math.log2(Math.max(total, 2))));
}

function getDisciplinaEmoji(disciplina: string): string {
  const d = disciplina.toLowerCase();
  if (d.includes("fútbol") || d.includes("futbol")) return "⚽";
  if (d.includes("vóley") || d.includes("voley")) return "🏐";
  if (d.includes("básquet") || d.includes("basquet")) return "🏀";
  if (d.includes("futsal")) return "🥅";
  if (d.includes("handball")) return "🤾";
  if (d.includes("tenis de mesa")) return "🏓";
  if (d.includes("tenis")) return "🎾";
  if (d.includes("ajedrez")) return "♟️";
  if (d.includes("natación")) return "🏊";
  if (d.includes("atletismo")) return "🏃";
  if (d.includes("ciclismo")) return "🚴";
  if (d.includes("karate") || d.includes("bádminton")) return "🥋";
  return "🏅";
}

// ─── Form data ────────────────────────────────────────────────────────────────

interface TournamentFormData {
  nombre: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  imagen?: File;
  imagenPreview?: string;
  fechaInscripcionInicio: string;
  fechaInscripcionFin: string;
  fechaCompetenciaInicio: string;
  fechaCompetenciaFin: string;
  disciplinas: string[];
  disciplinaConfigs: DisciplinaConfig[];
  maxEquipos: number;
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
    "Fútbol Masculino", "Fútbol Femenino",
    "Vóley Masculino", "Vóley Femenino",
    "Básquet Masculino", "Básquet Femenino",
    "Futsal Masculino", "Futsal Femenino",
    "Handball Masculino", "Handball Femenino",
  ],
  individuales: [
    "Tenis", "Tenis de Mesa", "Bádminton", "Ajedrez",
    "Natación", "Atletismo", "Ciclismo", "Karate",
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

const EMPTY_FORM: TournamentFormData = {
  nombre: "",
  tipo: "Olimpiada",
  categoria: "Interfacultades",
  descripcion: "",
  fechaInscripcionInicio: "",
  fechaInscripcionFin: "",
  fechaCompetenciaInicio: "",
  fechaCompetenciaFin: "",
  disciplinas: [],
  disciplinaConfigs: [],
  maxEquipos: 20,
  formatoEliminatorias: "unico",
  comiteAsignado: "Comité A - Deportes Colectivos (Prof. García - Coord.)",
  permitirGratuito: true,
  permitirPremium: true,
  generarFixtureAuto: true,
  notificacionesAuto: true,
  publicarAuto: true,
  escenarios: [],
};

function defaultDisciplinaConfig(disciplina: string): DisciplinaConfig {
  return {
    disciplina,
    sistema: "grupos_eliminacion",
    numGrupos: 2,
    clasificanPorGrupo: 2,
    equiposEnBracket: 4,
  };
}

// ─── Sub-componente: configurador por disciplina ─────────────────────────────

function DisciplinaConfigurador({
  config,
  onChange,
}: {
  config: DisciplinaConfig;
  onChange: (c: DisciplinaConfig) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sistemaActivo = SISTEMAS_OPTIONS.find((s) => s.id === config.sistema)!;

  const updateSistema = (sistema: SistemaCompetencia) => {
    onChange({
      ...config,
      sistema,
      numGrupos: sistema === "grupos_eliminacion" ? 2 : 0,
      clasificanPorGrupo: sistema === "grupos_eliminacion" ? 2 : 0,
      equiposEnBracket:
        sistema === "eliminacion" ? 8 :
        sistema === "grupos_eliminacion" ? calcBracketSize(2, 2) : 0,
    });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header togglable */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">{getDisciplinaEmoji(config.disciplina)}</span>
          <span className="font-semibold text-sm text-foreground">{config.disciplina}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            sistemaActivo.activeBg, sistemaActivo.activeText
          )}>
            {sistemaActivo.icon && (
              <span className="inline-flex items-center gap-1">
                {sistemaActivo.label}
                {config.sistema === "grupos_eliminacion" &&
                  ` · ${config.numGrupos}G · B${config.equiposEnBracket}`}
                {config.sistema === "eliminacion" &&
                  ` · B${config.equiposEnBracket}`}
              </span>
            )}
          </span>
          <ChevronRight
            className={cn("w-4 h-4 text-muted-foreground transition-transform", expanded && "rotate-90")}
          />
        </div>
      </button>

      {/* Contenido expandible */}
      {expanded && (
        <div className="border-t border-border bg-muted/10 px-4 py-4 space-y-4">

          {/* Selector visual de sistema */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Tipo de competencia
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SISTEMAS_OPTIONS.map((s) => {
                const isActive = config.sistema === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    title={s.tip}
                    onClick={() => updateSistema(s.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-left transition-all text-sm",
                      isActive
                        ? `${s.activeBg} ${s.activeBorder} ${s.activeText} font-bold`
                        : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {s.icon}
                    <div className="leading-tight">
                      <p className="font-semibold text-xs">{s.label}</p>
                      <p className="text-[10px] opacity-70">{s.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opciones adicionales: Grupos + Eliminación */}
          {config.sistema === "grupos_eliminacion" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1.5">Nº de grupos</p>
                  <div className="flex gap-1.5">
                    {GRUPOS_OPTS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          const bracket = calcBracketSize(n, config.clasificanPorGrupo);
                          onChange({ ...config, numGrupos: n, equiposEnBracket: bracket });
                        }}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all",
                          config.numGrupos === n
                            ? "bg-green-50 border-green-400 text-green-700"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1.5">Clasifican por grupo</p>
                  <div className="flex gap-1.5">
                    {CLASIFICAN_OPTS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          const bracket = calcBracketSize(config.numGrupos, n);
                          onChange({ ...config, clasificanPorGrupo: n, equiposEnBracket: bracket });
                        }}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all",
                          config.clasificanPorGrupo === n
                            ? "bg-green-50 border-green-400 text-green-700"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Resumen calculado */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800">
                <GitBranch className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  <strong>{config.numGrupos} grupos</strong> × <strong>{config.clasificanPorGrupo} clasificados</strong>
                  {" → "}bracket de <strong>{config.equiposEnBracket} equipos</strong>
                </span>
              </div>
            </div>
          )}

          {/* Opciones adicionales: Eliminación directa */}
          {config.sistema === "eliminacion" && (
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-1.5">Tamaño del bracket</p>
              <div className="flex gap-1.5 flex-wrap">
                {BRACKET_OPTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange({ ...config, equiposEnBracket: n })}
                    className={cn(
                      "px-3 h-9 rounded-lg border-2 text-sm font-bold transition-all",
                      config.equiposEnBracket === n
                        ? "bg-red-50 border-red-400 text-red-700"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Liga: info */}
          {config.sistema === "todos_contra_todos" && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">
              <Table2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Todos los equipos se enfrentan entre sí. El de mayor puntaje gana.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export default function CreateTournamentModal({
  open,
  onOpenChange,
}: CreateTournamentModalProps) {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<TournamentFormData>(EMPTY_FORM);

  // ── helpers ──────────────────────────────────────────────────────────────────

  const updateDisciplinas = (disciplinas: string[]) => {
    // Cuando cambian las disciplinas, sincronizar configs
    const existing = formData.disciplinaConfigs;
    const newConfigs = disciplinas.map(
      (d) => existing.find((c) => c.disciplina === d) ?? defaultDisciplinaConfig(d)
    );
    setFormData((f) => ({ ...f, disciplinas, disciplinaConfigs: newConfigs }));
  };

  const updateConfig = (updated: DisciplinaConfig) => {
    setFormData((f) => ({
      ...f,
      disciplinaConfigs: f.disciplinaConfigs.map((c) =>
        c.disciplina === updated.disciplina ? updated : c
      ),
    }));
  };

  const toggleDisciplina = (sport: string, checked: boolean) => {
    const next = checked
      ? [...formData.disciplinas, sport]
      : formData.disciplinas.filter((d) => d !== sport);
    updateDisciplinas(next);
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  };

  const inscripcionDuration = calculateDuration(formData.fechaInscripcionInicio, formData.fechaInscripcionFin);
  const competenciaDuration = calculateDuration(formData.fechaCompetenciaInicio, formData.fechaCompetenciaFin);

  // ── validaciones ──────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!formData.nombre.trim()) e.nombre = "El nombre es requerido";
    else if (formData.nombre.length < 5) e.nombre = "Mínimo 5 caracteres";
    else if (formData.nombre.length > 100) e.nombre = "Máximo 100 caracteres";
    if (!formData.tipo) e.tipo = "El tipo de competencia es requerido";
    if (!formData.categoria) e.categoria = "La categoría es requerida";
    if (formData.descripcion.length > 500) e.descripcion = "Máximo 500 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!formData.fechaInscripcionInicio) e.fechaInscripcionInicio = "La fecha de inicio es requerida";
    else if (new Date(formData.fechaInscripcionInicio) <= today) e.fechaInscripcionInicio = "La fecha debe ser futura";
    if (!formData.fechaInscripcionFin) e.fechaInscripcionFin = "La fecha de cierre es requerida";
    else if (new Date(formData.fechaInscripcionFin) <= new Date(formData.fechaInscripcionInicio))
      e.fechaInscripcionFin = "Debe ser posterior a la fecha de inicio";
    if (!formData.fechaCompetenciaInicio) e.fechaCompetenciaInicio = "La fecha de inicio es requerida";
    else if (new Date(formData.fechaCompetenciaInicio) <= new Date(formData.fechaInscripcionFin))
      e.fechaCompetenciaInicio = "Debe ser posterior al cierre de inscripciones";
    if (!formData.fechaCompetenciaFin) e.fechaCompetenciaFin = "La fecha de finalización es requerida";
    else if (new Date(formData.fechaCompetenciaFin) <= new Date(formData.fechaCompetenciaInicio))
      e.fechaCompetenciaFin = "Debe ser posterior a la fecha de inicio";
    if (formData.disciplinas.length === 0) e.disciplinas = "Debes seleccionar al menos una disciplina";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (formData.maxEquipos < 4 || formData.maxEquipos > 100) e.maxEquipos = "Debe estar entre 4 y 100";
    if (!formData.comiteAsignado) e.comiteAsignado = "El comité es requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) { setStep(2); setErrors({}); }
    else if (step === 2 && validateStep2()) { setStep(3); setErrors({}); }
    else if (step === 3 && validateStep3()) { setShowConfirmation(true); setErrors({}); }
  };

  const handleBack = () => { if (step > 1) { setStep(step - 1); setErrors({}); } };

  const handleCreate = () => {
    console.log("Crear torneo:", formData);
    setShowConfirmation(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      setStep(1);
      setFormData(EMPTY_FORM);
    }, 3000);
  };

  const closeModal = () => {
    if (!showSuccess) { onOpenChange(false); setStep(1); setErrors({}); setShowConfirmation(false); }
  };

  // ── Pantalla de éxito ─────────────────────────────────────────────────────────

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                <div className="relative bg-green-400 rounded-full p-6">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">¡TORNEO CREADO EXITOSAMENTE!</h2>
            <p className="text-lg text-muted-foreground mb-6">¡{formData.nombre} ha sido creado!</p>
            <div className="bg-primary-50 rounded-lg p-6 mb-6 text-left">
              <p className="text-sm text-muted-foreground mb-4">Código del Torneo: <span className="font-bold">IFAC-2027-001</span></p>
              <div className="mb-6">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />Acciones completadas:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Torneo registrado en el sistema","Comité notificado","Publicado en portal público","Inscripciones abiertas"].map(a => (
                    <li key={a} className="flex items-center gap-2"><span className="text-green-600">✓</span>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => onOpenChange(false)} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-700 transition-colors">
                Ver Torneo Creado
              </button>
              <button onClick={() => { setShowSuccess(false); setStep(1); setFormData(EMPTY_FORM); }}
                className="px-6 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-secondary-700 transition-colors">
                Crear Otro Torneo
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Pantalla de confirmación ──────────────────────────────────────────────────

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              CONFIRMAR CREACIÓN DE TORNEO
            </DialogTitle>
            <button onClick={closeModal} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Por favor, revisa la información antes de crear el torneo:</p>
            <div className="bg-primary-50 rounded-lg p-6 space-y-6">
              <div>
                <h4 className="font-bold text-foreground mb-3">📋 Información Básica:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Nombre: <span className="text-foreground font-medium">{formData.nombre}</span></li>
                  <li>• Tipo: <span className="text-foreground font-medium">{formData.tipo}</span></li>
                  <li>• Categoría: <span className="text-foreground font-medium">{formData.categoria}</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">📅 Fechas:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Inscripciones: {formData.fechaInscripcionInicio} — {formData.fechaInscripcionFin} ({inscripcionDuration} días)</li>
                  <li>• Competencia: {formData.fechaCompetenciaInicio} — {formData.fechaCompetenciaFin} ({competenciaDuration} días)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">🎯 Disciplinas y sistemas: ({formData.disciplinas.length})</h4>
                <div className="space-y-1.5">
                  {formData.disciplinaConfigs.map((c) => {
                    const s = SISTEMAS_OPTIONS.find((x) => x.id === c.sistema)!;
                    return (
                      <div key={c.disciplina} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{getDisciplinaEmoji(c.disciplina)} {c.disciplina}</span>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", s.activeBg, s.activeText)}>
                          {s.label}
                          {c.sistema === "grupos_eliminacion" && ` · ${c.numGrupos}G · B${c.equiposEnBracket}`}
                          {c.sistema === "eliminacion" && ` · B${c.equiposEnBracket}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">⚙️ Configuración:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Máx. equipos/disciplina: <span className="text-foreground font-medium">{formData.maxEquipos}</span></li>
                  <li>• Comité: <span className="text-foreground font-medium">{formData.comiteAsignado.split(" - ")[0]}</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3">🤖 Automatización:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Fixture automático: {formData.generarFixtureAuto ? "✅" : "❌"}</li>
                  <li>• Notificaciones: {formData.notificacionesAuto ? "✅" : "❌"}</li>
                  <li>• Portal público: {formData.publicarAuto ? "✅" : "❌"}</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-bold">⚠️ Al crear el torneo:</span><br />
                • Se enviará notificación al comité asignado<br />
                • Se publicará en el portal para consulta pública<br />
                • Los delegados podrán comenzar a inscribir equipos
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmation(false)} className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors">
                ← Volver a editar
              </button>
              <button onClick={handleCreate} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                CREAR TORNEO
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Wizard principal ──────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">+</span>
            CREAR NUEVO TORNEO
          </DialogTitle>
          <button onClick={closeModal} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
          <p className="text-sm text-muted-foreground text-right">Paso {step} de 3</p>
        </div>

        {/* ══ STEP 1: Información Básica ════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">PASO 1: INFORMACIÓN BÁSICA</h3>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Nombre del Torneo: *</label>
              <input
                type="text" maxLength={100}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Interfacultades 2027"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.nombre ? "border-destructive" : "border-border focus:border-primary"} bg-white`}
              />
              <p className="text-xs text-muted-foreground mt-1">Máximo 100 caracteres ({formData.nombre.length}/100)</p>
              {errors.nombre && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.nombre}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tipo de Competencia: *</label>
              <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.tipo ? "border-destructive" : "border-border focus:border-primary"} bg-white`}>
                <option>Olimpiada</option>
                <option>Copa</option>
                <option>Campeonato</option>
                <option>Amistoso</option>
              </select>
              {errors.tipo && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.tipo}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-3">Categoría: *</label>
              <div className="flex gap-3">
                {["Interfacultades", "Cachimbos", "Especial"].map((cat) => (
                  <button key={cat} onClick={() => setFormData({ ...formData, categoria: cat })}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${formData.categoria === cat ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {formData.categoria === cat ? "⚫" : "⚪"} {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Descripción:</label>
              <textarea maxLength={500} value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="La olimpiada más importante del año donde todas las facultades..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.descripcion ? "border-destructive" : "border-border focus:border-primary"} bg-white`}
              />
              <p className="text-xs text-muted-foreground mt-1">Máximo 500 caracteres ({formData.descripcion.length}/500)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Imagen del Torneo: (opcional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input type="file" accept="image/jpg,image/png" className="hidden" id="tournament-image"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      if (file.size > 5 * 1024 * 1024) { alert("El archivo no debe exceder 5MB"); return; }
                      const reader = new FileReader();
                      reader.onload = (ev) => setFormData({ ...formData, imagen: file, imagenPreview: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} />
                <label htmlFor="tournament-image" className="cursor-pointer">
                  {formData.imagenPreview
                    ? <img src={formData.imagenPreview} alt="preview" className="h-32 mx-auto rounded-lg object-cover mb-2" />
                    : <p className="text-lg mb-2">📷 Arrastra una imagen o haz clic para subir</p>}
                  <p className="text-xs text-muted-foreground">Formato: JPG, PNG | Tamaño máx: 5MB | 1200×600px recomendado</p>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 2: Fechas y Disciplinas ═════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">PASO 2: FECHAS Y DISCIPLINAS</h3>

            {/* Inscripciones */}
            <div>
              <h4 className="font-bold text-foreground mb-3">📅 PERIODO DE INSCRIPCIONES: *</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Fecha de inicio:", key: "fechaInscripcionInicio" as const },
                  { label: "Fecha de cierre:", key: "fechaInscripcionFin" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-foreground mb-2">{label}</label>
                    <input type="date" value={formData[key] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors[key] ? "border-destructive" : "border-border focus:border-primary"} bg-white`} />
                    {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>
              {inscripcionDuration > 0 && <p className="text-xs text-muted-foreground mt-2">⏰ Duración: {inscripcionDuration} días</p>}
            </div>

            {/* Competencia */}
            <div>
              <h4 className="font-bold text-foreground mb-3">📅 PERIODO DE COMPETENCIA: *</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Fecha de inicio:", key: "fechaCompetenciaInicio" as const },
                  { label: "Fecha de finalización:", key: "fechaCompetenciaFin" as const },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-foreground mb-2">{label}</label>
                    <input type="date" value={formData[key] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors[key] ? "border-destructive" : "border-border focus:border-primary"} bg-white`} />
                    {errors[key] && <p className="text-xs text-destructive mt-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>
              {competenciaDuration > 0 && <p className="text-xs text-muted-foreground mt-2">⏰ Duración: {competenciaDuration} días</p>}
            </div>

            {/* Disciplinas */}
            <div>
              <h4 className="font-bold text-foreground mb-3">🎯 DISCIPLINAS DEPORTIVAS: *</h4>
              <p className="text-xs text-muted-foreground mb-3">Selecciona las disciplinas que participarán:</p>
              <div className="space-y-4">
                {[
                  { title: "DEPORTES COLECTIVOS", list: DEPORTES.colectivos },
                  { title: "DEPORTES INDIVIDUALES", list: DEPORTES.individuales },
                ].map(({ title, list }) => (
                  <div key={title} className="border border-border rounded-lg p-4">
                    <p className="font-bold text-sm text-foreground mb-3">{title}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {list.map((sport) => (
                        <label key={sport} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4"
                            checked={formData.disciplinas.includes(sport)}
                            onChange={(e) => toggleDisciplina(sport, e.target.checked)} />
                          <span className="text-sm text-foreground">{sport}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => updateDisciplinas([...DEPORTES.colectivos, ...DEPORTES.individuales])}
                  className="text-sm font-bold text-primary hover:text-primary-700">☑️ Seleccionar todas</button>
                <button onClick={() => updateDisciplinas([])}
                  className="text-sm font-bold text-muted-foreground hover:text-foreground">☐ Deseleccionar todas</button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">📊 Total seleccionadas: {formData.disciplinas.length} disciplinas</p>
              {errors.disciplinas && (
                <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.disciplinas}</p>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 3: Configuración y Permisos ═════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground border-b pb-3">PASO 3: CONFIGURACIÓN Y PERMISOS</h3>

            {/* ── SISTEMA DE COMPETENCIA POR DISCIPLINA ── */}
            <div>
              <h4 className="font-bold text-foreground mb-1">⚙️ SISTEMA DE COMPETENCIA POR DISCIPLINA:</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Elige el tipo de eliminación para cada disciplina. Haz clic en una para expandir sus opciones.
              </p>

              {/* Leyenda de tipos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {SISTEMAS_OPTIONS.map((s) => (
                  <div key={s.id} className={cn("flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-lg border", s.activeBg, s.activeBorder, s.activeText)}>
                    {s.icon}
                    <span className="leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>

              {formData.disciplinaConfigs.length > 0 ? (
                <div className="space-y-2">
                  {formData.disciplinaConfigs.map((config) => (
                    <DisciplinaConfigurador
                      key={config.disciplina}
                      config={config}
                      onChange={updateConfig}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm">
                  ← Primero selecciona las disciplinas en el Paso 2
                </div>
              )}
            </div>

            {/* Comité */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">👥 ASIGNAR COMITÉ DEPORTIVO: *</label>
              <select value={formData.comiteAsignado}
                onChange={(e) => setFormData({ ...formData, comiteAsignado: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.comiteAsignado ? "border-destructive" : "border-border focus:border-primary"} bg-white`}>
                {COMITES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <p className="text-xs text-muted-foreground mt-2">ℹ️ El comité será responsable de aprobar inscripciones, generar fixtures y registrar resultados.</p>
            </div>

            {/* Escenarios */}
            <div>
              <h4 className="font-bold text-foreground mb-3">🏟️ ESCENARIOS DEPORTIVOS:</h4>
              <p className="text-xs text-muted-foreground mb-3">Asignar escenarios predeterminados: (opcional)</p>
              <div className="space-y-2">
                {ESCENARIOS.map((escenario) => (
                  <label key={escenario} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4"
                      checked={formData.escenarios.includes(escenario)}
                      onChange={(e) => setFormData({
                        ...formData,
                        escenarios: e.target.checked
                          ? [...formData.escenarios, escenario]
                          : formData.escenarios.filter((s) => s !== escenario),
                      })} />
                    <span className="text-sm text-foreground">{escenario}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">ℹ️ Esto facilitará la programación automática del fixture</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-8 border-t pt-6">
          {step > 1 && (
            <button onClick={handleBack} className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />Atrás
            </button>
          )}
          <button onClick={closeModal} className="px-6 py-2 bg-muted text-muted-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors">
            Cancelar
          </button>
          {step < 3 ? (
            <button onClick={handleNext} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center gap-2">
              Siguiente<ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleNext} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
              CREAR TORNEO →
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}