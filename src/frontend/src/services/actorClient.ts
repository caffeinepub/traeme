import { useActor } from '../hooks/useActor';

export function handleActorError(error: unknown): never {
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      throw new Error('You do not have permission to perform this action.');
    }
    throw error;
  }
  throw new Error('An unexpected error occurred.');
}
