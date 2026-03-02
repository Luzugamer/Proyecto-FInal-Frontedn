/**
 * Standings Calculator
 * Separa la lógica de cálculo de standings (OCP - Open/Closed Principle)
 */

export interface StandingsTeam {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  gc: number;
  gd: number;
  points: number;
  racha: string[];
}

export interface Match {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

/**
 * Calculadora base de standings
 */
export abstract class BaseStandingsCalculator {
  abstract getPointsForWin(): number;
  abstract getPointsForDraw(): number;
  abstract getPointsForLoss(): number;

  calculate(matches: Match[]): StandingsTeam[] {
    const teams = new Map<string, StandingsTeam>();

    // Procesar partidos finalizados
    matches
      .filter(m => m.status === 'finished')
      .forEach(match => {
        const homeTeam = this.getOrCreateTeam(teams, match.home);
        const awayTeam = this.getOrCreateTeam(teams, match.away);

        this.processMatch(homeTeam, awayTeam, match);
      });

    // Ordenar equipos
    return this.sortTeams(Array.from(teams.values()));
  }

  private getOrCreateTeam(teams: Map<string, StandingsTeam>, name: string): StandingsTeam {
    if (!teams.has(name)) {
      teams.set(name, {
        name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        gc: 0,
        gd: 0,
        points: 0,
        racha: [],
      });
    }
    return teams.get(name)!;
  }

  protected processMatch(homeTeam: StandingsTeam, awayTeam: StandingsTeam, match: Match): void {
    homeTeam.played++;
    awayTeam.played++;
    homeTeam.gf += match.homeScore;
    homeTeam.gc += match.awayScore;
    awayTeam.gf += match.awayScore;
    awayTeam.gc += match.homeScore;

    if (match.homeScore > match.awayScore) {
      homeTeam.wins++;
      homeTeam.points += this.getPointsForWin();
      homeTeam.racha.push('W');
      awayTeam.losses++;
      awayTeam.points += this.getPointsForLoss();
      awayTeam.racha.push('L');
    } else if (match.homeScore < match.awayScore) {
      awayTeam.wins++;
      awayTeam.points += this.getPointsForWin();
      awayTeam.racha.push('W');
      homeTeam.losses++;
      homeTeam.points += this.getPointsForLoss();
      homeTeam.racha.push('L');
    } else {
      homeTeam.draws++;
      homeTeam.points += this.getPointsForDraw();
      homeTeam.racha.push('D');
      awayTeam.draws++;
      awayTeam.points += this.getPointsForDraw();
      awayTeam.racha.push('D');
    }

    // Mantener solo últimos 5 resultados
    if (homeTeam.racha.length > 5) homeTeam.racha.shift();
    if (awayTeam.racha.length > 5) awayTeam.racha.shift();

    // Calcular diferencia de goles
    homeTeam.gd = homeTeam.gf - homeTeam.gc;
    awayTeam.gd = awayTeam.gf - awayTeam.gc;
  }

  protected sortTeams(teams: StandingsTeam[]): StandingsTeam[] {
    return teams.sort((a, b) => {
      // 1. Por puntos
      if (b.points !== a.points) return b.points - a.points;
      
      // 2. Por diferencia de goles
      if (b.gd !== a.gd) return b.gd - a.gd;
      
      // 3. Por goles a favor
      if (b.gf !== a.gf) return b.gf - a.gf;
      
      // 4. Por nombre (alfabético)
      return a.name.localeCompare(b.name);
    });
  }
}

/**
 * Calculadora para Fútbol estándar (3 puntos por victoria)
 */
export class FootballStandingsCalculator extends BaseStandingsCalculator {
  getPointsForWin(): number {
    return 3;
  }

  getPointsForDraw(): number {
    return 1;
  }

  getPointsForLoss(): number {
    return 0;
  }
}

/**
 * Calculadora para deportes sin empate (Básquet, Voley)
 */
export class NoDrawStandingsCalculator extends BaseStandingsCalculator {
  getPointsForWin(): number {
    return 2;
  }

  getPointsForDraw(): number {
    return 0; // No hay empates
  }

  getPointsForLoss(): number {
    return 0;
  }
}

/**
 * Factory para obtener la calculadora correcta según el deporte
 */
export class StandingsCalculatorFactory {
  static getCalculator(sport: string): BaseStandingsCalculator {
    const sportLower = sport.toLowerCase();
    
    if (sportLower.includes('fútbol') || sportLower.includes('futsal')) {
      return new FootballStandingsCalculator();
    }
    
    if (sportLower.includes('básquet') || 
        sportLower.includes('voley') || 
        sportLower.includes('voleibol')) {
      return new NoDrawStandingsCalculator();
    }
    
    // Por defecto, usar sistema de fútbol
    return new FootballStandingsCalculator();
  }
}
