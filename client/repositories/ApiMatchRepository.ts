/**
 * ApiMatchRepository
 * Implementación real del repositorio de partidos usando API
 */
import { IMatchRepository } from './interfaces/IMatchRepository';
import { Match, MatchStatus, MatchSchema } from '@/schemas/match.schema';
import { apiClient } from '@/api/client';

export class ApiMatchRepository implements IMatchRepository {
  private readonly basePath = '/api/matches';

  async getAll(): Promise<Match[]> {
    const data = await apiClient.get<Match[]>(this.basePath);
    return data.map(match => MatchSchema.parse(match));
  }

  async getById(id: number): Promise<Match | null> {
    try {
      const data = await apiClient.get<Match>(`${this.basePath}/${id}`);
      return MatchSchema.parse(data);
    } catch (error) {
      // Si es 404, retornar null
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getByTournament(tournamentId: string): Promise<Match[]> {
    const data = await apiClient.get<Match[]>(`${this.basePath}/tournament/${tournamentId}`);
    return data.map(match => MatchSchema.parse(match));
  }

  async getLive(): Promise<Match[]> {
    const data = await apiClient.get<Match[]>(`${this.basePath}/live`);
    return data.map(match => MatchSchema.parse(match));
  }

  async create(matchData: Omit<Match, 'id'>): Promise<Match> {
    const data = await apiClient.post<Match>(this.basePath, matchData);
    return MatchSchema.parse(data);
  }

  async update(id: number, matchData: Partial<Match>): Promise<Match> {
    const data = await apiClient.patch<Match>(`${this.basePath}/${id}`, matchData);
    return MatchSchema.parse(data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}
