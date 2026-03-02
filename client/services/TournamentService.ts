/**
 * Tournament Service
 * Lógica de negocio para gestión de torneos
 * Aplica principio SRP (Single Responsibility) y DIP (Dependency Inversion)
 */
import { ITournamentRepository } from '@/repositories/interfaces/ITournamentRepository';
import { Tournament, TournamentFilter, TournamentState, CreateTournamentDTO, UpdateTournamentDTO } from '@/schemas/tournament.schema';

export class TournamentService {
  constructor(private repository: ITournamentRepository) {}

  /**
   * Obtiene todos los torneos
   */
  async getAllTournaments(): Promise<Tournament[]> {
    return await this.repository.getAll();
  }

  /**
   * Obtiene torneo por ID
   */
  async getTournamentById(id: string): Promise<Tournament> {
    const tournament = await this.repository.getById(id);
    if (!tournament) {
      throw new Error(`Tournament with id ${id} not found`);
    }
    return tournament;
  }

  /**
   * Obtiene torneo por slug
   */
  async getTournamentBySlug(slug: string): Promise<Tournament> {
    const tournament = await this.repository.getBySlug(slug);
    if (!tournament) {
      throw new Error(`Tournament with slug ${slug} not found`);
    }
    return tournament;
  }

  /**
   * Obtiene torneos activos (en curso)
   */
  async getActiveTournaments(): Promise<Tournament[]> {
    return await this.repository.getByFilter({ estado: 'en_curso' });
  }

  /**
   * Obtiene torneos en período de inscripción
   */
  async getUpcomingTournaments(): Promise<Tournament[]> {
    return await this.repository.getByFilter({ estado: 'inscripciones' });
  }

  /**
   * Obtiene torneos finalizados
   */
  async getFinishedTournaments(): Promise<Tournament[]> {
    return await this.repository.getByFilter({ estado: 'finalizado' });
  }

  /**
   * Obtiene torneos por estado
   */
  async getTournamentsByState(state: TournamentState): Promise<Tournament[]> {
    return await this.repository.getByFilter({ estado: state });
  }

  /**
   * Busca torneos con filtros múltiples
   */
  async searchTournaments(filter: TournamentFilter): Promise<Tournament[]> {
    return await this.repository.getByFilter(filter);
  }

  /**
   * Verifica si un torneo acepta inscripciones
   */
  isAcceptingRegistrations(tournament: Tournament): boolean {
    if (tournament.estado !== 'inscripciones') {
      return false;
    }

    const now = new Date();
    const startDate = new Date(tournament.fechaInscripcionInicio);
    const endDate = new Date(tournament.fechaInscripcionFin);

    return now >= startDate && now <= endDate;
  }

  /**
   * Obtiene días restantes para inicio de competencia
   */
  getDaysUntilStart(tournament: Tournament): number {
    const now = new Date();
    const startDate = new Date(tournament.fechaCompetenciaInicio);
    const diffTime = startDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Obtiene días restantes para cierre de inscripciones
   */
  getDaysUntilRegistrationClose(tournament: Tournament): number {
    const now = new Date();
    const endDate = new Date(tournament.fechaInscripcionFin);
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcula progreso del torneo (0-100)
   */
  calculateProgress(tournament: Tournament): number {
    if (tournament.totalPartidos === 0) return 0;
    return Math.round((tournament.partidosJugados / tournament.totalPartidos) * 100);
  }

  /**
   * Obtiene torneos públicos (publicados en portal)
   */
  async getPublicTournaments(): Promise<Tournament[]> {
    const allTournaments = await this.repository.getAll();
    return allTournaments.filter(t => t.publicarEnPortal);
  }

  /**
   * Crea un nuevo torneo
   */
  async createTournament(data: CreateTournamentDTO): Promise<Tournament> {
    // Validaciones de negocio
    this.validateTournamentDates(
      data.fechaInscripcionInicio,
      data.fechaInscripcionFin,
      data.fechaCompetenciaInicio,
      data.fechaCompetenciaFin
    );

    return await this.repository.create(data);
  }

  /**
   * Actualiza un torneo
   */
  async updateTournament(id: string, data: UpdateTournamentDTO): Promise<Tournament> {
    // Verificar que existe
    await this.getTournamentById(id);

    // Validar fechas si se actualizan
    if (data.fechaInscripcionInicio || data.fechaInscripcionFin || 
        data.fechaCompetenciaInicio || data.fechaCompetenciaFin) {
      const existing = await this.repository.getById(id);
      if (existing) {
        this.validateTournamentDates(
          data.fechaInscripcionInicio || existing.fechaInscripcionInicio,
          data.fechaInscripcionFin || existing.fechaInscripcionFin,
          data.fechaCompetenciaInicio || existing.fechaCompetenciaInicio,
          data.fechaCompetenciaFin || existing.fechaCompetenciaFin
        );
      }
    }

    return await this.repository.update(id, data);
  }

  /**
   * Elimina un torneo
   */
  async deleteTournament(id: string): Promise<void> {
    await this.getTournamentById(id); // Verificar que existe
    await this.repository.delete(id);
  }

  /**
   * Valida que las fechas del torneo sean coherentes
   */
  private validateTournamentDates(
    inscripcionInicio: string,
    inscripcionFin: string,
    competenciaInicio: string,
    competenciaFin: string
  ): void {
    const inscripStart = new Date(inscripcionInicio);
    const inscripEnd = new Date(inscripcionFin);
    const compStart = new Date(competenciaInicio);
    const compEnd = new Date(competenciaFin);

    if (inscripEnd <= inscripStart) {
      throw new Error('La fecha de fin de inscripción debe ser posterior al inicio');
    }

    if (compEnd <= compStart) {
      throw new Error('La fecha de fin de competencia debe ser posterior al inicio');
    }

    if (compStart < inscripEnd) {
      throw new Error('La competencia debe iniciar después del cierre de inscripciones');
    }
  }
}
