import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getAllRoutes, getActiveRoutes, getRoute, createRoute, updateRoute, deactivateRoute } from '../../services/routeService';
import type { Route } from '../../backend';

export function useGetAllRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Route[]>({
    queryKey: queryKeys.routes,
    queryFn: async () => {
      if (!actor) return [];
      return getAllRoutes(actor);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetActiveRoutes() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Route[]>({
    queryKey: queryKeys.activeRoutes,
    queryFn: async () => {
      if (!actor) return [];
      return getActiveRoutes(actor);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRoute(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Route | null>({
    queryKey: queryKeys.route(id),
    queryFn: async () => {
      if (!actor) return null;
      return getRoute(actor, id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useCreateRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route: Route) => {
      if (!actor) throw new Error('Actor not available');
      return createRoute(actor, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeRoutes });
    },
  });
}

export function useUpdateRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (route: Route) => {
      if (!actor) throw new Error('Actor not available');
      return updateRoute(actor, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeRoutes });
    },
  });
}

export function useDeactivateRoute() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string) => {
      if (!actor) throw new Error('Actor not available');
      return deactivateRoute(actor, routeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeRoutes });
    },
  });
}
