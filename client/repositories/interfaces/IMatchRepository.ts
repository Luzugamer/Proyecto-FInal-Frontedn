/**
 * Match Repository Interface
 */
import { Match } from '@/schemas/match.schema';

export interface IMatchRepository {
  getAll(): Promise<Match[]>;
  getById(id: number): Promise<Match | null>;
  getByTournament(tournamentId: string): Promise<Match[]>;
  getLive(): Promise<Match[]>;
  create(data: Omit<Match, 'id'>): Promise<Match>;
  update(id: number, data: Partial<Match>): Promise<Match>;
  delete(id: number): Promise<void>;
}
