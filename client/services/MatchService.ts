/**
 * MatchService
 * Servicio para gestión de partidos con lógica de negocio
 */
import { IMatchRepository } from '@/repositories/interfaces/IMatchRepository';
import { Match, MatchStatus } from '@/schemas/match.schema';

export class MatchService {
  constructor(private matchRepository: IMatchRepository) {}

  /**
   * Obtener todos los partidos
   */
  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository.getAll();
  }

  /**
   * Obtener partido por ID
   */
  async getMatchById(id: number): Promise<Match> {
    const match = await this.matchRepository.getById(id);
    if (!match) {
      throw new Error(`Partido con ID ${id} no encontrado`);
    }
    return match;
  }

  /**
   * Obtener partidos por torneo
   */
  async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
    return this.matchRepository.getByTournament(tournamentId);
  }

  /**
   * Obtener partidos en vivo
   */
  async getLiveMatches(): Promise<Match[]> {
    return this.matchRepository.getLive();
  }

  /**
   * Obtener partidos por deporte
   */
  async getMatchesBySport(sport: string): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    return allMatches.filter(match => 
      match.sport.toLowerCase() === sport.toLowerCase()
    );
  }

  /**
   * Obtener partidos por estado
   */
  async getMatchesByStatus(status: MatchStatus): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    return allMatches.filter(match => match.status === status);
  }

  /**
   * Obtener partidos programados (scheduled)
   */
  async getScheduledMatches(): Promise<Match[]> {
    return this.getMatchesByStatus('scheduled');
  }

  /**
   * Obtener partidos finalizados
   */
  async getFinishedMatches(): Promise<Match[]> {
    return this.getMatchesByStatus('finished');
  }

  /**
   * Obtener partidos de hoy
   */
  async getTodayMatches(): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return allMatches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate >= today && matchDate < tomorrow;
    });
  }

  /**
   * Obtener partidos por equipo
   */
  async getMatchesByTeam(teamName: string): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    return allMatches.filter(match => 
      match.home === teamName || match.away === teamName
    );
  }

  /**
   * Obtener próximos N partidos
   */
  async getUpcomingMatches(limit: number = 5): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    const now = new Date();

    return allMatches
      .filter(match => new Date(match.date) >= now && match.status === 'scheduled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }

  /**
   * Obtener últimos resultados
   */
  async getRecentResults(limit: number = 5): Promise<Match[]> {
    const allMatches = await this.matchRepository.getAll();
    
    return allMatches
      .filter(match => match.status === 'finished')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Verificar si un partido está en vivo
   */
  isMatchLive(match: Match): boolean {
    return match.status === 'live';
  }

  /**
   * Verificar si un partido ha finalizado
   */
  isMatchFinished(match: Match): boolean {
    return match.status === 'finished';
  }

  /**
   * Obtener ganador del partido (si ya finalizó)
   */
  getMatchWinner(match: Match): 'home' | 'away' | 'draw' | null {
    if (!this.isMatchFinished(match)) {
      return null;
    }

    if (match.homeScore > match.awayScore) {
      return 'home';
    } else if (match.awayScore > match.homeScore) {
      return 'away';
    } else {
      return 'draw';
    }
  }

  /**
   * Crear un partido
   */
  async createMatch(matchData: Omit<Match, 'id'>): Promise<Match> {
    // Validaciones de negocio
    if (!matchData.home || !matchData.away) {
      throw new Error('Equipos local y visitante son requeridos');
    }

    if (matchData.home === matchData.away) {
      throw new Error('Un equipo no puede jugar contra sí mismo');
    }

    if (new Date(matchData.date) < new Date()) {
      throw new Error('No se puede crear un partido con fecha pasada');
    }

    return this.matchRepository.create(matchData);
  }

  /**
   * Actualizar un partido
   */
  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match> {
    const existingMatch = await this.getMatchById(id);

    // Si el partido ya finalizó, no permitir cambios
    if (existingMatch.status === 'finished' && matchData.status !== 'finished') {
      throw new Error('No se puede cambiar el estado de un partido finalizado');
    }

    return this.matchRepository.update(id, matchData);
  }

  /**
   * Actualizar marcador de un partido
   */
  async updateScore(
    id: number, 
    homeScore: number, 
    awayScore: number
  ): Promise<Match> {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error('Los marcadores no pueden ser negativos');
    }

    return this.matchRepository.update(id, { homeScore, awayScore });
  }

  /**
   * Cambiar estado de un partido
   */
  async updateMatchStatus(id: number, status: MatchStatus): Promise<Match> {
    return this.matchRepository.update(id, { status });
  }

  /**
   * Eliminar un partido
   */
  async deleteMatch(id: number): Promise<void> {
    const match = await this.getMatchById(id);

    // No permitir eliminar partidos en vivo o finalizados
    if (match.status === 'live') {
      throw new Error('No se puede eliminar un partido en vivo');
    }

    if (match.status === 'finished') {
      throw new Error('No se puede eliminar un partido finalizado');
    }

    return this.matchRepository.delete(id);
  }
}
