/**
 * TanStack Query Integration
 * 
 * This module provides TanStack Query integration with our custom
 * error handling and service layer patterns.
 * 
 * @example
 * ```typescript
 * // Setup in root layout
 * import { QueryProvider } from '@packages/spark-tools/query';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <QueryProvider>
 *       {children}
 *     </QueryProvider>
 *   );
 * }
 * 
 * // Use in components
 * import { useQuery, useMutation, queryKeys } from '@packages/spark-tools/query';
 * 
 * function UserProfile({ userId }) {
 *   const { data, loading } = useQuery({
 *     queryKey: queryKeys.users.detail(userId),
 *     queryFn: () => userService.getUser(userId),
 *   });
 *   
 *   const { mutate } = useMutation({
 *     mutationFn: (data) => userService.updateUser(userId, data),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries(queryKeys.users.detail(userId));
 *     },
 *   });
 * }
 * ```
 */

// Core setup
export { QueryProvider } from './QueryProvider';
export { createQueryClient, queryClient } from './queryClient';

// Query keys
export { queryKeys, createQueryKeys } from './queryKeys';

// Enhanced hooks
export { useQuery } from './useQuery';
export type { UseQueryOptions, UseQueryReturn } from './useQuery';

export { useMutation } from './useMutation';
export type { UseMutationOptions, UseMutationReturn } from './useMutation';

// Prefetch hooks
export { usePrefetch, usePrefetchOnHover } from './usePrefetch';
export type { PrefetchOptions } from './usePrefetch';

// Utilities
export { useQueryUtils, createOptimisticUpdate } from './queryUtils';

// Re-export useful TanStack Query utilities
export {
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from '@tanstack/react-query';

export type {
  QueryClient,
  QueryKey,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
