import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getAllAlerts, getAlert, getAlertsForVehicle, getAlertsForRoute, createAlert } from '../../services/alertService';
import type { Alert } from '../../backend';
import { useState, useEffect } from 'react';

export function useGetAllAlerts(pollingInterval = 30000) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: queryKeys.alerts,
    queryFn: async () => {
      if (!actor) return [];
      return getAllAlerts(actor);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: pollingInterval,
  });
}

export function useGetAlert(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert | null>({
    queryKey: queryKeys.alert(id),
    queryFn: async () => {
      if (!actor) return null;
      return getAlert(actor, id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useGetAlertsForVehicle(vehicleId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: queryKeys.alertsForVehicle(vehicleId),
    queryFn: async () => {
      if (!actor) return [];
      return getAlertsForVehicle(actor, vehicleId);
    },
    enabled: !!actor && !actorFetching && !!vehicleId,
  });
}

export function useGetAlertsForRoute(routeId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Alert[]>({
    queryKey: queryKeys.alertsForRoute(routeId),
    queryFn: async () => {
      if (!actor) return [];
      return getAlertsForRoute(actor, routeId);
    },
    enabled: !!actor && !actorFetching && !!routeId,
  });
}

export function useCreateAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alert: Alert) => {
      if (!actor) throw new Error('Actor not available');
      return createAlert(actor, alert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts });
    },
  });
}

export function useUnseenAlertsCount() {
  const { data: alerts = [] } = useGetAllAlerts();
  const [lastSeenTime, setLastSeenTime] = useState<number>(() => {
    const stored = localStorage.getItem('lastSeenAlertsTime');
    return stored ? parseInt(stored, 10) : Date.now();
  });

  const unseenCount = alerts.filter((alert) => {
    const alertTime = Number(alert.timestamp) / 1000000;
    return alertTime > lastSeenTime;
  }).length;

  const markAsSeen = () => {
    const now = Date.now();
    setLastSeenTime(now);
    localStorage.setItem('lastSeenAlertsTime', now.toString());
  };

  return { unseenCount, markAsSeen };
}
