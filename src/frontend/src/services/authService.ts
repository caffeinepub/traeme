import { QueryClient } from '@tanstack/react-query';

export async function logout(clearFn: () => void, queryClient: QueryClient): Promise<void> {
  await clearFn();
  queryClient.clear();
}
