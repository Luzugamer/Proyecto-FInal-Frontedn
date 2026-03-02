/**
 * News Schemas - Validación de datos de noticias
 */
import { z } from 'zod';

export const NewsCategorySchema = z.enum([
  'resultados',
  'jugadores',
  'equipos',
  'convocatorias',
  'institucional',
]);

export const NewsStateSchema = z.enum([
  'borrador',
  'publicada',
  'archivada',
]);

export const NewsSchema = z.object({
  id: z.string(),
  slug: z.string(),
  titulo: z.string().min(10).max(200),
  extracto: z.string().min(50).max(500),
  contenido: z.string().min(100),
  imagen: z.string().url(),
  categoria: NewsCategorySchema,
  estado: NewsStateSchema,
  destacada: z.boolean(),
  etiquetas: z.array(z.string()),
  autor: z.string(),
  fechaPublicacion: z.string().datetime(),
  fechaModificacion: z.string().datetime().optional(),
  vistas: z.number().int().nonnegative(),
});

export type News = z.infer<typeof NewsSchema>;
export type NewsCategory = z.infer<typeof NewsCategorySchema>;
export type NewsState = z.infer<typeof NewsStateSchema>;

export const CreateNewsSchema = NewsSchema.omit({
  id: true,
  slug: true,
  fechaPublicacion: true,
  fechaModificacion: true,
  vistas: true,
});

export type CreateNewsDTO = z.infer<typeof CreateNewsSchema>;

export const UpdateNewsSchema = CreateNewsSchema.partial();
export type UpdateNewsDTO = z.infer<typeof UpdateNewsSchema>;
