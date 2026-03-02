/**
 * MockMatchRepository
 * Implementación mock del repositorio de partidos
 */
import { IMatchRepository } from './interfaces/IMatchRepository';
import { Match, MatchStatus, MatchSchema } from '@/schemas/match.schema';
import { mockMatches } from '@/lib/mockMatches';

/**
 * Mapper para convertir datos mock al schema
 */
function mapMockMatchToSchema(mockMatch: typeof mockMatches[0]): Match {
  // Mapear status
  const statusMap: Record<string, MatchStatus> = {
    'live': 'live',
    'finished': 'finished',
    'today': 'scheduled',
    'upcoming': 'scheduled',
  };

  const match = {
    id: mockMatch.id,
    tournamentId: mockMatch.tournamentSlug,
    sport: mockMatch.sport,
    home: mockMatch.home,
    away: mockMatch.away,
    homeScore: mockMatch.homeScore ?? 0,
    awayScore: mockMatch.awayScore ?? 0,
    status: statusMap[mockMatch.status] || 'scheduled',
    date: new Date(mockMatch.date + 'T' + mockMatch.time).toISOString(),
    time: mockMatch.time,
    location: mockMatch.court,
    viewers: mockMatch.status === 'live' ? Math.floor(Math.random() * 2000) + 500 : undefined,
    events: mockMatch.events?.map((event, index) => ({
      id: `${mockMatch.id}-event-${index}`,
      type: event.type === 'goal' ? 'goal' : 
            event.type === 'yellow' ? 'yellow_card' : 'red_card',
      minute: parseInt(event.minute) || 0,
      team: event.team,
      player: event.player,
      description: undefined,
    })),
  };

  // Validar con Zod
  return MatchSchema.parse(match);
}

export class MockMatchRepository implements IMatchRepository {
  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll(): Promise<Match[]> {
    await this.simulateDelay();
    return mockMatches.map(mapMockMatchToSchema);
  }

  async getById(id: number): Promise<Match | null> {
    await this.simulateDelay();
    const mockMatch = mockMatches.find(m => m.id === id);
    return mockMatch ? mapMockMatchToSchema(mockMatch) : null;
  }

  async getByTournament(tournamentId: string): Promise<Match[]> {
    await this.simulateDelay();
    return mockMatches
      .filter(m => m.tournamentSlug === tournamentId)
      .map(mapMockMatchToSchema);
  }

  async getLive(): Promise<Match[]> {
    await this.simulateDelay();
    return mockMatches
      .filter(m => m.status === 'live')
      .map(mapMockMatchToSchema);
  }

  async create(data: Omit<Match, 'id'>): Promise<Match> {
    await this.simulateDelay();
    const newMatch: Match = {
      ...data,
      id: Math.max(...mockMatches.map(m => m.id), 0) + 1,
    };
    return MatchSchema.parse(newMatch);
  }

  async update(id: number, data: Partial<Match>): Promise<Match> {
    await this.simulateDelay();
    const match = await this.getById(id);
    if (!match) {
      throw new Error(`Match with id ${id} not found`);
    }
    const updatedMatch = { ...match, ...data };
    return MatchSchema.parse(updatedMatch);
  }

  async delete(id: number): Promise<void> {
    await this.simulateDelay();
    const match = await this.getById(id);
    if (!match) {
      throw new Error(`Match with id ${id} not found`);
    }
  }
}
