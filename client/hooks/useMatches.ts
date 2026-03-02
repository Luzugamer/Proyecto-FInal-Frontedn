/**
 * Match Hooks - React Query integration
 * Hooks para acceder a partidos con caché, loading states y error handling
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMatchService } from '@/services/ServiceProvider';
import { Match, MatchStatus } from '@/schemas/match.schema';

const QUERY_KEYS = {
  all: ['matches'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...QUERY_KEYS.details(), id] as const,
  live: () => [...QUERY_KEYS.all, 'live'] as const,
  today: () => [...QUERY_KEYS.all, 'today'] as const,
  tournament: (tournamentId: string) => [...QUERY_KEYS.all, 'tournament', tournamentId] as const,
  sport: (sport: string) => [...QUERY_KEYS.all, 'sport', sport] as const,
  status: (status: MatchStatus) => [...QUERY_KEYS.all, 'status', status] as const,
  upcoming: (limit: number) => [...QUERY_KEYS.all, 'upcoming', limit] as const,
  recent: (limit: number) => [...QUERY_KEYS.all, 'recent', limit] as const,
};

/**
 * Hook para obtener todos los partidos
 */
export function useMatches() {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.lists(),
    queryFn: () => matchService.getAllMatches(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

/**
 * Hook para obtener un partido por ID
 */
export function useMatch(id: number) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => matchService.getMatchById(id),
    staleTime: 3 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Hook para obtener partidos en vivo
 */
export function useLiveMatches() {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.live(),
    queryFn: () => matchService.getLiveMatches(),
    staleTime: 10 * 1000, // 10 segundos (actualizar frecuentemente)
    refetchInterval: 30 * 1000, // Re-fetch cada 30 segundos
  });
}

/**
 * Hook para obtener partidos de hoy
 */
export function useTodayMatches() {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.today(),
    queryFn: () => matchService.getTodayMatches(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener partidos por torneo
 */
export function useMatchesByTournament(tournamentId: string) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.tournament(tournamentId),
    queryFn: () => matchService.getMatchesByTournament(tournamentId),
    staleTime: 3 * 60 * 1000,
    enabled: !!tournamentId,
  });
}

/**
 * Hook para obtener partidos por deporte
 */
export function useMatchesBySport(sport: string) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.sport(sport),
    queryFn: () => matchService.getMatchesBySport(sport),
    staleTime: 5 * 60 * 1000,
    enabled: !!sport,
  });
}

/**
 * Hook para obtener partidos por estado
 */
export function useMatchesByStatus(status: MatchStatus) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.status(status),
    queryFn: () => matchService.getMatchesByStatus(status),
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Hook para obtener próximos partidos
 */
export function useUpcomingMatches(limit: number = 5) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.upcoming(limit),
    queryFn: () => matchService.getUpcomingMatches(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener resultados recientes
 */
export function useRecentResults(limit: number = 5) {
  const matchService = getMatchService();

  return useQuery({
    queryKey: QUERY_KEYS.recent(limit),
    queryFn: () => matchService.getRecentResults(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para crear un partido
 */
export function useCreateMatch() {
  const queryClient = useQueryClient();
  const matchService = getMatchService();

  return useMutation({
    mutationFn: (data: Omit<Match, 'id'>) => 
      matchService.createMatch(data),
    onSuccess: () => {
      // Invalidar todas las queries de partidos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

/**
 * Hook para actualizar un partido
 */
export function useUpdateMatch() {
  const queryClient = useQueryClient();
  const matchService = getMatchService();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Match> }) =>
      matchService.updateMatch(id, data),
    onSuccess: (_, variables) => {
      // Invalidar query específica
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.live() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.today() });
    },
  });
}

/**
 * Hook para actualizar el marcador de un partido
 */
export function useUpdateMatchScore() {
  const queryClient = useQueryClient();
  const matchService = getMatchService();

  return useMutation({
    mutationFn: ({ id, homeScore, awayScore }: { 
      id: number; 
      homeScore: number; 
      awayScore: number 
    }) => matchService.updateScore(id, homeScore, awayScore),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.live() });
    },
  });
}

/**
 * Hook para cambiar el estado de un partido
 */
export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();
  const matchService = getMatchService();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: MatchStatus }) =>
      matchService.updateMatchStatus(id, status),
    onSuccess: () => {
      // Invalidar múltiples queries ya que el estado afecta varias vistas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

/**
 * Hook para eliminar un partido
 */
export function useDeleteMatch() {
  const queryClient = useQueryClient();
  const matchService = getMatchService();

  return useMutation({
    mutationFn: (id: number) => matchService.deleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}
