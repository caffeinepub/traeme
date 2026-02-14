import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getAllTrips, getTrip, getTripsForVehicle, createTrip, updateTripStatus, startTripExplicit, endTripExplicit } from '../../services/tripService';
import type { Trip, TripStatus } from '../../backend';

export function useGetAllTrips() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trip[]>({
    queryKey: queryKeys.trips,
    queryFn: async () => {
      if (!actor) return [];
      return getAllTrips(actor);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTrip(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trip | null>({
    queryKey: queryKeys.trip(id),
    queryFn: async () => {
      if (!actor) return null;
      return getTrip(actor, id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetTripsForVehicle(vehicleId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trip[]>({
    queryKey: queryKeys.tripsForVehicle(vehicleId),
    queryFn: async () => {
      if (!actor) return [];
      return getTripsForVehicle(actor, vehicleId);
    },
    enabled: !!actor && !actorFetching && !!vehicleId,
  });
}

export function useGetActiveTrip(vehicleId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Trip | null>({
    queryKey: queryKeys.activeTrip(vehicleId),
    queryFn: async () => {
      if (!actor || !vehicleId) return null;
      const trips = await getTripsForVehicle(actor, vehicleId);
      const activeTrip = trips.find((trip) => trip.status !== 'completed');
      return activeTrip || null;
    },
    enabled: !!actor && !actorFetching && !!vehicleId,
  });
}

export function useCreateTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trip: Trip) => {
      if (!actor) throw new Error('Actor not available');
      return createTrip(actor, trip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
    },
  });
}

export function useUpdateTripStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, status }: { tripId: string; status: TripStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return updateTripStatus(actor, tripId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
    },
  });
}

export function useStartTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, routeId }: { vehicleId: string; routeId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return startTripExplicit(actor, vehicleId, routeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'activeTrip' });
    },
  });
}

export function useEndTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, routeId }: { vehicleId: string; routeId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return endTripExplicit(actor, vehicleId, routeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips });
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'activeTrip' });
    },
  });
}
