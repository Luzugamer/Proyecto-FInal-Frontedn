/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export type Role = "SUPER_ADMIN" | "ADMINISTRADOR" | "COMITE_ORGANIZADOR" | "DELEGADO_DEPORTES" | "ESTUDIANTE" | "PUBLICO";

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  facultad?: string;
  codigoEstudiantil?: string;
}

export interface Player {
  id: string;
  codigoEstudiantil: string;
  nombres: string;
  apellidos: string;
  facultad: string;
  escuelaProfesional: string;
  foto?: string;
  esTitular: boolean;
  validadoDIIA: boolean;
  estadoValidacion: "aprobado" | "pendiente" | "rechazado";
}

export interface Team {
  id: string;
  nombre: string;
  facultad: string;
  disciplina: string;
  categoria: "Varones" | "Damas" | "Mixto";
  delegadoId: string;
  jugadores: Player[];
  estadoInscripcion: "pendiente" | "aprobado" | "rechazado";
  fechaInscripcion: string;
}

export interface TournamentSummary {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  disciplinas: string[];
  equiposPorFacultad: Record<string, number>;
  estado: "inscripciones_abiertas" | "inscripciones_cerradas" | "en_curso" | "finalizado";
  reglamentoUrl: string;
}

export interface Standing {
  posicion: number;
  facultad: string;
  logo: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
  racha: string[]; // e.g. ["W", "W", "L", "D", "W"]
}

// RECORDS MANAGEMENT TYPES

export type DocumentType =
  | "ficha_inscripcion"
  | "certificado_medico"
  | "foto_3x4"
  | "dni"
  | "constancia_matricula"
  | "declaracion_jurada"
  | "seguro_accidentes"
  | "otros";

export type DocumentStatus = "pendiente" | "aprobado" | "rechazado";
export type RecordsUploadMethod = "individual" | "drive";

export interface Document {
  id: string;
  tipo: DocumentType;
  nombre: string;
  tamaño: number; // en bytes
  url: string;
  fechaCarga: string;
  estado: DocumentStatus;
  comentarios?: string;
  historialVersiones?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  url: string;
  fechaCarga: string;
  reemplazadoPor?: string;
}

export interface StudentRecord {
  id: string;
  jugadorId: string;
  codigoEstudiantial: string;
  nombreCompleto: string;
  facultad: string;
  escuelaProfesional: string;
  fotoDIIA?: string;
  metodoCarga: RecordsUploadMethod;
  documentos: Document[];
  estadoDocumentacion: "completo_aprobado" | "completo_pendiente" | "incompleto" | "rechazado";
  ultimaActualizacion: string;
  enlaceDrive?: string; // si es método Drive
  validacionDrive?: {
    valido: boolean;
    errores: string[];
    sincronizadoEn: string;
  };
}

export interface TeamRecords {
  id: string;
  equipoId: string;
  torneoId: string;
  facultad: string;
  disciplina: string;
  categoria: string;
  jugadores: StudentRecord[];
  porcentajeCompletitud: number;
  estado: "incompleto" | "bajo_revision" | "aprobado" | "rechazado";
  fechaCreacion: string;
  ultimaModificacion: string;
}

export interface RecordsValidationReport {
  equipoId: string;
  totalJugadores: number;
  jugadoresComCarpeta: number;
  jugadoresConDocumentacionCompleta: number;
  jugadoresConDocumentacionIncompleta: {
    codigo: string;
    nombre: string;
    documentosFaltantes: DocumentType[];
  }[];
  jugadoresSinCarpeta: {
    codigo: string;
    nombre: string;
  }[];
  documentosRechazados: {
    jugador: string;
    documento: string;
    motivo: string;
  }[];
}

export interface RecordsNotification {
  id: string;
  delegadoId: string;
  tipo: "aprobacion" | "rechazo" | "incompleto" | "proximo_cierre";
  titulo: string;
  mensaje: string;
  documentoId?: string;
  jugadorId?: string;
  leido: boolean;
  fechaCreacion: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
