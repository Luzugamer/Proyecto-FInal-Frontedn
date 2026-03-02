/**
 * Service Provider
 * Configuración de inyección de dependencias
 * Permite cambiar fácilmente entre Mock y API real
 */
import { TournamentService } from './TournamentService';
import { MatchService } from './MatchService';
import { MockTournamentRepository } from '@/repositories/MockTournamentRepository';
import { ApiTournamentRepository } from '@/repositories/ApiTournamentRepository';
import { MockMatchRepository } from '@/repositories/MockMatchRepository';
import { ApiMatchRepository } from '@/repositories/ApiMatchRepository';

// Configuración: cambiar a 'api' cuando el backend esté listo
const USE_MOCK_DATA = true;

class ServiceProvider {
  private static instance: ServiceProvider;
  
  private _tournamentService?: TournamentService;
  private _matchService?: MatchService;

  private constructor() {}

  static getInstance(): ServiceProvider {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }

  get tournamentService(): TournamentService {
    if (!this._tournamentService) {
      const repository = USE_MOCK_DATA
        ? new MockTournamentRepository()
        : new ApiTournamentRepository();
      
      this._tournamentService = new TournamentService(repository);
    }
    return this._tournamentService;
  }

  get matchService(): MatchService {
    if (!this._matchService) {
      const repository = USE_MOCK_DATA
        ? new MockMatchRepository()
        : new ApiMatchRepository();
      
      this._matchService = new MatchService(repository);
    }
    return this._matchService;
  }

  // Método para cambiar entre mock y API
  setUseMockData(useMock: boolean) {
    // Recrear servicios con el nuevo repositorio
    const tournamentRepository = useMock
      ? new MockTournamentRepository()
      : new ApiTournamentRepository();
    
    const matchRepository = useMock
      ? new MockMatchRepository()
      : new ApiMatchRepository();
    
    this._tournamentService = new TournamentService(tournamentRepository);
    this._matchService = new MatchService(matchRepository);
  }
}

export const serviceProvider = ServiceProvider.getInstance();

// Exports convenientes
export const getTournamentService = () => serviceProvider.tournamentService;
export const getMatchService = () => serviceProvider.matchService;
