import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import {
  getAllPickupDropoffRecords,
  getPickupDropoffRecord,
  getPickupDropoffRecordsForStudent,
  createPickupDropoffRecord,
  updatePickupDropoffRecord,
} from '../../services/pickupDropoffService';
import type { PickupDropoffRecord } from '../../backend';
import { Principal } from '@dfinity/principal';

export function useGetAllPickupDropoffRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PickupDropoffRecord[]>({
    queryKey: queryKeys.pickupDropoff,
    queryFn: async () => {
      if (!actor) return [];
      return getAllPickupDropoffRecords(actor);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPickupDropoffRecord(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PickupDropoffRecord | null>({
    queryKey: queryKeys.pickupDropoffRecord(id),
    queryFn: async () => {
      if (!actor) return null;
      return getPickupDropoffRecord(actor, id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetPickupDropoffRecordsForStudent(studentId: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PickupDropoffRecord[]>({
    queryKey: queryKeys.pickupDropoffForStudent(studentId),
    queryFn: async () => {
      if (!actor) return [];
      return getPickupDropoffRecordsForStudent(actor, studentId);
    },
    enabled: !!actor && !actorFetching && !!studentId,
  });
}

export function useCreatePickupDropoffRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PickupDropoffRecord) => {
      if (!actor) throw new Error('Actor not available');
      return createPickupDropoffRecord(actor, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickupDropoff });
    },
  });
}

export function useUpdatePickupDropoffRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: PickupDropoffRecord) => {
      if (!actor) throw new Error('Actor not available');
      return updatePickupDropoffRecord(actor, record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickupDropoff });
    },
  });
}
