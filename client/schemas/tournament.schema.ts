/**
 * Tournament Schemas - Validación de datos con Zod
 */
import { z } from 'zod';

export const TournamentStateSchema = z.enum([
  'inscripciones',
  'en_curso',
  'finalizado',
  'cancelado',
]);

export const TournamentTypeSchema = z.enum([
  'olimpiada',
  'copa',
  'campeonato',
  'amistoso',
]);

export const TournamentCategorySchema = z.enum([
  'interfacultades',
  'cachimbos',
  'especial',
]);

export const CompetitionSystemSchema = z.enum([
  'todos_vs_todos',
  'grupos',
  'eliminacion',
  'mixto',
]);

export const TournamentSchema = z.object({
  id: z.string(),
  nombre: z.string().min(3).max(200),
  slug: z.string(),
  tipo: TournamentTypeSchema,
  categoria: TournamentCategorySchema,
  estado: TournamentStateSchema,
  descripcion: z.string(),
  imagen: z.string().url().optional(),

  // Fechas
  fechaInscripcionInicio: z.string().datetime(),
  fechaInscripcionFin: z.string().datetime(),
  fechaCompetenciaInicio: z.string().datetime(),
  fechaCompetenciaFin: z.string().datetime(),

  // Configuración
  disciplinas: z.array(z.string()),
  maxEquiposPorDisciplina: z.number().int().positive(),
  sistemaCompetencia: CompetitionSystemSchema,
  equiposPorGrupo: z.number().int().positive().optional(),
  clasificanPorGrupo: z.number().int().positive().optional(),

  // Gestión
  comiteAsignado: z.string().optional(),
  creador: z.string().optional(),

  // Opciones
  permitirInscripcionGratuita: z.boolean(),
  generarFixtureAuto: z.boolean(),
  publicarEnPortal: z.boolean(),

  // Estadísticas
  totalEquipos: z.number().int().nonnegative(),
  totalPartidos: z.number().int().nonnegative(),
  partidosJugados: z.number().int().nonnegative(),
  totalGoles: z.number().int().nonnegative().optional(),
  asistencia: z.number().int().nonnegative().optional(),

  // Metadata
  fechaCreacion: z.string().datetime(),
  ultimaModificacion: z.string().datetime(),
});

export type Tournament = z.infer<typeof TournamentSchema>;
export type TournamentState = z.infer<typeof TournamentStateSchema>;
export type TournamentType = z.infer<typeof TournamentTypeSchema>;
export type TournamentCategory = z.infer<typeof TournamentCategorySchema>;
export type CompetitionSystem = z.infer<typeof CompetitionSystemSchema>;

// Schema para crear un torneo (sin campos autogenerados)
export const CreateTournamentSchema = TournamentSchema.omit({
  id: true,
  slug: true,
  fechaCreacion: true,
  ultimaModificacion: true,
});

export type CreateTournamentDTO = z.infer<typeof CreateTournamentSchema>;

// Schema para actualizar un torneo
export const UpdateTournamentSchema = CreateTournamentSchema.partial();
export type UpdateTournamentDTO = z.infer<typeof UpdateTournamentSchema>;

// Schema para filtros
export const TournamentFilterSchema = z.object({
  estado: TournamentStateSchema.optional(),
  tipo: TournamentTypeSchema.optional(),
  categoria: TournamentCategorySchema.optional(),
  disciplina: z.string().optional(),
  search: z.string().optional(),
});

export type TournamentFilter = z.infer<typeof TournamentFilterSchema>;
