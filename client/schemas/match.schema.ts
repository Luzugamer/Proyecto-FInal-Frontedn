/**
 * Match Schemas - Validación de datos de partidos
 */
import { z } from 'zod';

export const MatchStatusSchema = z.enum([
  'scheduled',
  'live',
  'finished',
  'postponed',
  'cancelled',
]);

export const MatchEventTypeSchema = z.enum([
  'goal',
  'yellow_card',
  'red_card',
  'substitution',
  'injury',
  'penalty',
]);

export const MatchEventSchema = z.object({
  id: z.string(),
  type: MatchEventTypeSchema,
  minute: z.number().int().min(0),
  team: z.string(),
  player: z.string(),
  description: z.string().optional(),
});

export const MatchSchema = z.object({
  id: z.number().int().positive(),
  tournamentId: z.string(),
  sport: z.string(),
  home: z.string(),
  away: z.string(),
  homeScore: z.number().int().nonnegative(),
  awayScore: z.number().int().nonnegative(),
  status: MatchStatusSchema,
  date: z.string().datetime(),
  time: z.string().optional(),
  location: z.string(),
  viewers: z.number().int().nonnegative().optional(),
  referee: z.string().optional(),
  events: z.array(MatchEventSchema).optional(),
});

export type Match = z.infer<typeof MatchSchema>;
export type MatchStatus = z.infer<typeof MatchStatusSchema>;
export type MatchEvent = z.infer<typeof MatchEventSchema>;
export type MatchEventType = z.infer<typeof MatchEventTypeSchema>;
