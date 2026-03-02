/**
 * Mock Tournament Repository
 * Implementación con datos mock para desarrollo
 */
import { ITournamentRepository } from './interfaces/ITournamentRepository';
import { Tournament, TournamentFilter, CreateTournamentDTO, UpdateTournamentDTO, TournamentSchema } from '@/schemas/tournament.schema';
import { mockTournaments } from '@/lib/mockTournaments';

/**
 * Mapper para convertir datos mock al schema validado
 */
function mapMockToSchema(mockTournament: typeof mockTournaments[0]): Tournament {
  // Asegurar que las fechas tengan el formato ISO correcto
  const ensureDatetimeISO = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString();
    // Si ya tiene Z o timezone, devolverlo tal cual
    if (dateStr.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Si no, agregamos Z para indicar UTC
    return dateStr + 'Z';
  };

  const tournament = {
    ...mockTournament,
    fechaInscripcionInicio: ensureDatetimeISO(mockTournament.fechaInscripcionInicio),
    fechaInscripcionFin: ensureDatetimeISO(mockTournament.fechaInscripcionFin),
    fechaCompetenciaInicio: ensureDatetimeISO(mockTournament.fechaCompetenciaInicio),
    fechaCompetenciaFin: ensureDatetimeISO(mockTournament.fechaCompetenciaFin),
    fechaCreacion: ensureDatetimeISO(mockTournament.fechaCreacion),
    ultimaModificacion: ensureDatetimeISO(mockTournament.ultimaModificacion),
    // Campos opcionales: si son 0, convertirlos a undefined
    equiposPorGrupo: mockTournament.equiposPorGrupo > 0 ? mockTournament.equiposPorGrupo : undefined,
    clasificanPorGrupo: mockTournament.clasificanPorGrupo > 0 ? mockTournament.clasificanPorGrupo : undefined,
  };

  // Validar con Zod
  return TournamentSchema.parse(tournament);
}

export class MockTournamentRepository implements ITournamentRepository {
  private tournaments: Tournament[] = [];

  constructor() {
    // Validar y cargar datos mock con el mapper
    this.tournaments = mockTournaments.map(t => mapMockToSchema(t));
  }

  async getAll(): Promise<Tournament[]> {
    // Simular latencia de red
    await this.delay(300);
    return [...this.tournaments];
  }

  async getById(id: string): Promise<Tournament | null> {
    await this.delay(200);
    return this.tournaments.find(t => t.id === id) || null;
  }

  async getBySlug(slug: string): Promise<Tournament | null> {
    await this.delay(200);
    return this.tournaments.find(t => t.slug === slug) || null;
  }

  async getByFilter(filter: TournamentFilter): Promise<Tournament[]> {
    await this.delay(300);
    
    return this.tournaments.filter(tournament => {
      if (filter.estado && tournament.estado !== filter.estado) {
        return false;
      }
      if (filter.tipo && tournament.tipo !== filter.tipo) {
        return false;
      }
      if (filter.categoria && tournament.categoria !== filter.categoria) {
        return false;
      }
      if (filter.disciplina && !tournament.disciplinas?.some(d => 
        d.toLowerCase().includes(filter.disciplina!.toLowerCase()))) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          tournament.nombre.toLowerCase().includes(searchLower) ||
          (tournament.descripcion?.toLowerCase() || '').includes(searchLower)
        );
      }
      return true;
    });
  }

  async create(data: CreateTournamentDTO): Promise<Tournament> {
    await this.delay(500);
    
    const newTournament: Tournament = {
      ...data,
      id: `torneo-${Date.now()}`,
      slug: this.generateSlug(data.nombre),
      fechaCreacion: new Date().toISOString(),
      ultimaModificacion: new Date().toISOString(),
    };

    const validated = TournamentSchema.parse(newTournament);
    this.tournaments.push(validated);
    return validated;
  }

  async update(id: string, data: UpdateTournamentDTO): Promise<Tournament> {
    await this.delay(400);
    
    const index = this.tournaments.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tournament with id ${id} not found`);
    }

    const updated = {
      ...this.tournaments[index],
      ...data,
      ultimaModificacion: new Date().toISOString(),
    };

    const validated = TournamentSchema.parse(updated);
    this.tournaments[index] = validated;
    return validated;
  }

  async delete(id: string): Promise<void> {
    await this.delay(300);
    
    const index = this.tournaments.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tournament with id ${id} not found`);
    }

    this.tournaments.splice(index, 1);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
