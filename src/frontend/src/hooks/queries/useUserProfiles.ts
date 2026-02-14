import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { queryKeys } from './queryKeys';
import { getAllUserProfiles } from '../../services/userService';
import type { UserProfile } from '../../backend';

export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: queryKeys.allUserProfiles,
    queryFn: async () => {
      if (!actor) return [];
      return getAllUserProfiles(actor);
    },
    enabled: !!actor && !actorFetching,
  });
}
