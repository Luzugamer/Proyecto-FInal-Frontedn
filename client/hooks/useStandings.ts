/**
 * Standings Hook
 * Hook para calcular tablas de posiciones con caché
 */
import { useMemo } from 'react';
import { useMatchesByTournament } from '@/hooks/useMatches';
import { StandingsCalculatorFactory, StandingsTeam, Match as CalculatorMatch } from '@/utils/standingsCalculator';
import type { Match } from '@/schemas/match.schema';

/**
 * Mapear Match del schema al Match del calculator
 */
function mapToCalculatorMatch(match: Match): CalculatorMatch {
  return {
    home: match.home,
    away: match.away,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status === 'finished' ? 'finished' : 'ongoing',
  };
}

export function useStandings(tournamentId: string, sport?: string) {
  // Obtener partidos usando el hook correcto
  const { data: matches, isLoading, error, refetch } = useMatchesByTournament(tournamentId);

  // Calcular standings por deporte
  const standingsBySport = useMemo(() => {
    if (!matches) return {};

    const standings: Record<string, StandingsTeam[]> = {};
    const sports = Array.from(new Set(matches.map(m => m.sport)));

    sports.forEach(sportName => {
      const sportMatches = matches
        .filter(m => m.sport === sportName && m.status === 'finished')
        .map(mapToCalculatorMatch);
      
      const calculator = StandingsCalculatorFactory.getCalculator(sportName);
      standings[sportName] = calculator.calculate(sportMatches);
    });

    return standings;
  }, [matches]);

  // Si se especifica un deporte, retornar solo ese
  const standings = sport ? standingsBySport[sport] : standingsBySport;

  return {
    standings,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
