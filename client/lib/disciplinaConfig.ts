/**
 * disciplinaConfig.ts
 *
 * Configuración por disciplina para cada torneo.
 * Los slugs y nombres de disciplina deben coincidir exactamente
 * con los valores definidos en mockTournaments.ts.
 *
 * En producción, esta data vendrá del backend junto al objeto Tournament.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

/**
 * Sistema de competencia de una disciplina individual.
 * Reemplaza el campo global `sistemaCompetencia` del Tournament
 * cuando se necesita configuración por disciplina.
 *
 * - grupos              → Solo tabla de posiciones, sin bracket.
 * - eliminacion_directa → Bracket directo desde el inicio.
 * - grupos_y_eliminacion→ Tabla primero, luego bracket con clasificados.
 */
export type SistemaCompetencia =
  | "grupos"
  | "eliminacion_directa"
  | "grupos_y_eliminacion";

/**
 * Fase actual de la disciplina.
 * Controla qué secciones del UI están activas.
 */
export type FaseActual =
  | "inscripciones"  // No han empezado partidos
  | "grupos"         // Jugando fase de grupos
  | "eliminacion"    // Jugando eliminación directa
  | "finalizado";    // Disciplina terminada

export interface DisciplinaConfig {
  sistemaCompetencia: SistemaCompetencia;
  faseActual: FaseActual;
  /** Cantidad de grupos. 0 si no aplica. */
  numGrupos: number;
  /** Cuántos equipos de cada grupo avanzan al bracket. 0 si no aplica. */
  equiposClasifican: number;
  /**
   * Total de equipos en el bracket de eliminación directa.
   * Debe ser potencia de 2: 2, 4, 8 o 16.
   * 0 si el sistema es solo grupos.
   */
  equiposEnBracket: number;
}

// ─── Tipos de mapa ────────────────────────────────────────────────────────────

type TournamentDisciplinaMap = Record<string, Record<string, DisciplinaConfig>>;

// ─── Config mock ──────────────────────────────────────────────────────────────
//
// Slugs exactos tomados de mockTournaments.ts:
//   "interfacultades-2026"
//   "cachimbos-2026"
//   "torneo-especial-futsal-2026"
//
// Disciplinas exactas tomadas de mockTournaments.ts para cada torneo.
//

export const DISCIPLINA_CONFIG_MOCK: TournamentDisciplinaMap = {

  // ── Interfacultades 2026 ───────────────────────────────────────────────────
  // disciplinas: ["Fútbol Masculino", "Fútbol Femenino", "Básquet Masculino", "Básquet Femenino"]
  // sistemaCompetencia global: "grupos"  →  aquí lo refinamos por disciplina

  "interfacultades-2026": {
    "Fútbol Masculino": {
      sistemaCompetencia: "grupos_y_eliminacion",
      faseActual: "grupos",
      numGrupos: 4,
      equiposClasifican: 2,
      equiposEnBracket: 8,
    },
    "Fútbol Femenino": {
      sistemaCompetencia: "grupos_y_eliminacion",
      faseActual: "inscripciones",
      numGrupos: 2,
      equiposClasifican: 2,
      equiposEnBracket: 4,
    },
    "Básquet Masculino": {
      sistemaCompetencia: "eliminacion_directa",
      faseActual: "eliminacion",
      numGrupos: 0,
      equiposClasifican: 0,
      equiposEnBracket: 8,
    },
    "Básquet Femenino": {
      sistemaCompetencia: "grupos",
      faseActual: "grupos",
      numGrupos: 3,
      equiposClasifican: 0,
      equiposEnBracket: 0,
    },
  },

  // ── Cachimbos 2026 ─────────────────────────────────────────────────────────
  // disciplinas: ["Futsal Masculino", "Futsal Femenino", "Voley Masculino", "Voley Femenino"]
  // sistemaCompetencia global: "grupos"

  "cachimbos-2026": {
    "Futsal Masculino": {
      sistemaCompetencia: "grupos_y_eliminacion",
      faseActual: "inscripciones",
      numGrupos: 3,
      equiposClasifican: 2,
      equiposEnBracket: 8,
    },
    "Futsal Femenino": {
      sistemaCompetencia: "grupos_y_eliminacion",
      faseActual: "inscripciones",
      numGrupos: 2,
      equiposClasifican: 2,
      equiposEnBracket: 4,
    },
    "Voley Masculino": {
      sistemaCompetencia: "grupos",
      faseActual: "inscripciones",
      numGrupos: 3,
      equiposClasifican: 0,
      equiposEnBracket: 0,
    },
    "Voley Femenino": {
      sistemaCompetencia: "eliminacion_directa",
      faseActual: "inscripciones",
      numGrupos: 0,
      equiposClasifican: 0,
      equiposEnBracket: 8,
    },
  },

  // ── Torneo Especial Futsal 2026 ────────────────────────────────────────────
  // disciplinas: ["Futsal Masculino", "Futsal Femenino"]
  // sistemaCompetencia global: "eliminacion"

  "torneo-especial-futsal-2026": {
    "Futsal Masculino": {
      sistemaCompetencia: "eliminacion_directa",
      faseActual: "finalizado",
      numGrupos: 0,
      equiposClasifican: 0,
      equiposEnBracket: 16,
    },
    "Futsal Femenino": {
      sistemaCompetencia: "eliminacion_directa",
      faseActual: "finalizado",
      numGrupos: 0,
      equiposClasifican: 0,
      equiposEnBracket: 8,
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Devuelve la config de una disciplina.
 * Si el slug o la disciplina no existen en el mock, retorna un default seguro.
 */
export function getDisciplinaConfig(
  tournamentSlug: string,
  disciplina: string
): DisciplinaConfig {
  return (
    DISCIPLINA_CONFIG_MOCK[tournamentSlug]?.[disciplina] ?? {
      sistemaCompetencia: "grupos_y_eliminacion",
      faseActual: "grupos",
      numGrupos: 2,
      equiposClasifican: 2,
      equiposEnBracket: 4,
    }
  );
}

export type SubTab = "posiciones" | "fixture" | "resultados" | "bracket";

/** Sub-tabs disponibles según el sistema de competencia */
export function getSubTabsFromConfig(config: DisciplinaConfig): SubTab[] {
  switch (config.sistemaCompetencia) {
    case "grupos":
      return ["posiciones", "fixture", "resultados"];
    case "eliminacion_directa":
      return ["fixture", "resultados", "bracket"];
    case "grupos_y_eliminacion":
      return ["posiciones", "fixture", "resultados", "bracket"];
  }
}

/** Etiqueta del sistema de competencia */
export function getSistemaLabel(config: DisciplinaConfig): string {
  const map: Record<SistemaCompetencia, string> = {
    grupos:               "Fase de grupos",
    eliminacion_directa:  "Eliminación directa",
    grupos_y_eliminacion: "Grupos + Eliminación directa",
  };
  return map[config.sistemaCompetencia];
}

/** Metadata visual de la fase actual */
export function getFaseInfo(config: DisciplinaConfig): {
  label: string;
  color: string;
  textColor: string;
  dot: string;
  pulse: boolean;
} {
  switch (config.faseActual) {
    case "inscripciones":
      return { label: "Inscripciones", color: "bg-blue-100",   textColor: "text-blue-700",   dot: "bg-blue-500",   pulse: false };
    case "grupos":
      return { label: "En grupos",     color: "bg-green-100",  textColor: "text-green-700",  dot: "bg-green-500",  pulse: true  };
    case "eliminacion":
      return { label: "Eliminación",   color: "bg-orange-100", textColor: "text-orange-700", dot: "bg-orange-500", pulse: true  };
    case "finalizado":
      return { label: "Finalizado",    color: "bg-gray-100",   textColor: "text-gray-600",   dot: "bg-gray-400",   pulse: false };
  }
}