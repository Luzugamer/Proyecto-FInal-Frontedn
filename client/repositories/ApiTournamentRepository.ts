/**
 * API Tournament Repository
 * Implementación real que se conecta al backend
 */
import { ITournamentRepository } from './interfaces/ITournamentRepository';
import { Tournament, TournamentFilter, CreateTournamentDTO, UpdateTournamentDTO, TournamentSchema } from '@/schemas/tournament.schema';
import { apiClient } from '@/api/client';

export class ApiTournamentRepository implements ITournamentRepository {
  private readonly basePath = '/tournaments';

  async getAll(): Promise<Tournament[]> {
    const data = await apiClient.get<any[]>(this.basePath);
    return data.map(item => TournamentSchema.parse(item));
  }

  async getById(id: string): Promise<Tournament | null> {
    try {
      const data = await apiClient.get<any>(`${this.basePath}/${id}`);
      return TournamentSchema.parse(data);
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async getBySlug(slug: string): Promise<Tournament | null> {
    try {
      const data = await apiClient.get<any>(`${this.basePath}/slug/${slug}`);
      return TournamentSchema.parse(data);
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async getByFilter(filter: TournamentFilter): Promise<Tournament[]> {
    const params: Record<string, string> = {};
    
    if (filter.estado) params.estado = filter.estado;
    if (filter.tipo) params.tipo = filter.tipo;
    if (filter.categoria) params.categoria = filter.categoria;
    if (filter.disciplina) params.disciplina = filter.disciplina;
    if (filter.search) params.search = filter.search;

    const data = await apiClient.get<any[]>(this.basePath, params);
    return data.map(item => TournamentSchema.parse(item));
  }

  async create(data: CreateTournamentDTO): Promise<Tournament> {
    const response = await apiClient.post<any>(this.basePath, data);
    return TournamentSchema.parse(response);
  }

  async update(id: string, data: UpdateTournamentDTO): Promise<Tournament> {
    const response = await apiClient.patch<any>(`${this.basePath}/${id}`, data);
    return TournamentSchema.parse(response);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}
