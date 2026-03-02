/**
 * Tournament Hooks - React Query integration
 * Hooks para acceder a torneos con caché, loading states y error handling
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTournamentService } from '@/services/ServiceProvider';
import { TournamentFilter, TournamentState, CreateTournamentDTO, UpdateTournamentDTO } from '@/schemas/tournament.schema';

const QUERY_KEYS = {
  all: ['tournaments'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filter?: TournamentFilter) => [...QUERY_KEYS.lists(), filter] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  bySlug: (slug: string) => [...QUERY_KEYS.all, 'slug', slug] as const,
  byState: (state: TournamentState) => [...QUERY_KEYS.all, 'state', state] as const,
};

/**
 * Hook para obtener todos los torneos
 */
export function useTournaments(filter?: TournamentFilter) {
  const tournamentService = getTournamentService();

  return useQuery({
    queryKey: QUERY_KEYS.list(filter),
    queryFn: () => 
      filter 
        ? tournamentService.searchTournaments(filter)
        : tournamentService.getAllTournaments(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
}

/**
 * Hook para obtener un torneo por slug
 */
export function useTournamentBySlug(slug: string) {
  const tournamentService = getTournamentService();

  return useQuery({
    queryKey: QUERY_KEYS.bySlug(slug),
    queryFn: () => tournamentService.getTournamentBySlug(slug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!slug, // Solo ejecutar si hay slug
  });
}

/**
 * Hook para obtener torneos por estado
 */
export function useTournamentsByState(state: TournamentState) {
  const tournamentService = getTournamentService();

  return useQuery({
    queryKey: QUERY_KEYS.byState(state),
    queryFn: () => tournamentService.getTournamentsByState(state),
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
}

/**
 * Hook para obtener torneos activos
 */
export function useActiveTournaments() {
  const tournamentService = getTournamentService();

  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'active'],
    queryFn: () => tournamentService.getActiveTournaments(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener torneos públicos
 */
export function usePublicTournaments() {
  const tournamentService = getTournamentService();

  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'public'],
    queryFn: () => tournamentService.getPublicTournaments(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para crear un torneo
 */
export function useCreateTournament() {
  const queryClient = useQueryClient();
  const tournamentService = getTournamentService();

  return useMutation({
    mutationFn: (data: CreateTournamentDTO) => 
      tournamentService.createTournament(data),
    onSuccess: () => {
      // Invalidar todas las queries de torneos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

/**
 * Hook para actualizar un torneo
 */
export function useUpdateTournament() {
  const queryClient = useQueryClient();
  const tournamentService = getTournamentService();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTournamentDTO }) =>
      tournamentService.updateTournament(id, data),
    onSuccess: (_, variables) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook para eliminar un torneo
 */
export function useDeleteTournament() {
  const queryClient = useQueryClient();
  const tournamentService = getTournamentService();

  return useMutation({
    mutationFn: (id: string) => tournamentService.deleteTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}
