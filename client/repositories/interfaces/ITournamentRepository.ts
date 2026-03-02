/**
 * Tournament Repository Interface
 * Define el contrato para acceso a datos de torneos
 */
import { Tournament, TournamentFilter, CreateTournamentDTO, UpdateTournamentDTO } from '@/schemas/tournament.schema';

export interface ITournamentRepository {
  getAll(): Promise<Tournament[]>;
  getById(id: string): Promise<Tournament | null>;
  getBySlug(slug: string): Promise<Tournament | null>;
  getByFilter(filter: TournamentFilter): Promise<Tournament[]>;
  create(data: CreateTournamentDTO): Promise<Tournament>;
  update(id: string, data: UpdateTournamentDTO): Promise<Tournament>;
  delete(id: string): Promise<void>;
}
