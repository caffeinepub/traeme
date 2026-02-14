import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getCallerUserProfile } from '../../services/userService';
import type { UserProfile, UserRole } from '../../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return getCallerUserProfile(actor);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useUserRole(): UserRole | null {
  const { data: userProfile } = useGetCallerUserProfile();
  return userProfile?.role || null;
}

export function useIsAdmin(): boolean {
  const role = useUserRole();
  return role === 'admin';
}

export function useIsDriver(): boolean {
  const role = useUserRole();
  return role === 'driver';
}

export function useIsParent(): boolean {
  const role = useUserRole();
  return role === 'parent';
}

export function useIsStudent(): boolean {
  const role = useUserRole();
  return role === 'student';
}
