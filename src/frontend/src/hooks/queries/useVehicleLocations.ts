import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getAllVehicleLocations, getVehicleLocation, updateVehicleLocation } from '../../services/vehicleService';
import type { VehicleLocation } from '../../backend';

export function useGetAllVehicleLocations(pollingInterval = 10000) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VehicleLocation[]>({
    queryKey: queryKeys.vehicles,
    queryFn: async () => {
      if (!actor) return [];
      return getAllVehicleLocations(actor);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: pollingInterval,
  });
}

export function useGetVehicleLocation(vehicleId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VehicleLocation | null>({
    queryKey: queryKeys.vehicle(vehicleId),
    queryFn: async () => {
      if (!actor) return null;
      return getVehicleLocation(actor, vehicleId);
    },
    enabled: !!actor && !actorFetching && !!vehicleId,
  });
}

export function useUpdateVehicleLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: VehicleLocation) => {
      if (!actor) throw new Error('Actor not available');
      return updateVehicleLocation(actor, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles });
    },
  });
}
