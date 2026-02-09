/**
 * Query Utilities
 * 
 * Helper functions for working with TanStack Query.
 */

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

/**
 * Hook to get access to the QueryClient for manual cache operations
 * 
 * @example
 * ```typescript
 * const utils = useQueryUtils();
 * 
 * // Invalidate specific queries
 * utils.invalidateUsers();
 * utils.invalidateUserDetail(userId);
 * 
 * // Manually set cache data
 * utils.setUserData(userId, userData);
 * ```
 */
export function useQueryUtils() {
  const queryClient = useQueryClient();

  return {
    // Generic utilities
    queryClient,
    
    /**
     * Invalidate all queries matching a key
     */
    invalidate: (queryKey: unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    
    /**
     * Remove queries from cache
     */
    remove: (queryKey: unknown[]) => {
      return queryClient.removeQueries({ queryKey });
    },
    
    /**
     * Manually set query data
     */
    setQueryData: <TData>(queryKey: unknown[], data: TData) => {
      return queryClient.setQueryData<TData>(queryKey, data);
    },
    
    /**
     * Get query data from cache
     */
    getQueryData: <TData>(queryKey: unknown[]) => {
      return queryClient.getQueryData<TData>(queryKey);
    },
    
    // Users utilities
    invalidateUsers: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    
    invalidateUsersList: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },
    
    invalidateUserDetail: (userId: string) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
    },
    
    setUserData: <TData>(userId: string, data: TData) => {
      return queryClient.setQueryData<TData>(queryKeys.users.detail(userId), data);
    },
    
    // Events utilities
    invalidateEvents: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
    
    invalidateEventsList: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
    
    invalidateEventDetail: (eventId: string) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(eventId),
      });
    },
    
    setEventData: <TData>(eventId: string, data: TData) => {
      return queryClient.setQueryData<TData>(
        queryKeys.events.detail(eventId),
        data
      );
    },
    
    // Teams utilities
    invalidateTeams: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.teams.all });
    },
    
    invalidateTeamsList: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.teams.lists() });
    },
    
    invalidateTeamDetail: (teamId: string) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.teams.detail(teamId),
      });
    },
    
    // Auth utilities
    invalidateAuth: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    
    invalidateSession: () => {
      return queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
    
    /**
     * Clear all cache data (use with caution)
     */
    clearAll: () => {
      return queryClient.clear();
    },
  };
}

// Note: usePrefetch has been moved to ./usePrefetch.ts for better organization
// Import from '@packages/spark-tools/query' to use it

/**
 * Optimistic update helper
 * 
 * @example
 * ```typescript
 * const { mutate } = useApiMutation({
 *   mutationFn: (data) => userService.updateUser(userId, data),
 *   onMutate: async (newData) => {
 *     // Cancel outgoing refetches
 *     await queryClient.cancelQueries(['users', userId]);
 *     
 *     // Snapshot previous value
 *     const previous = queryClient.getQueryData(['users', userId]);
 *     
 *     // Optimistically update
 *     queryClient.setQueryData(['users', userId], newData);
 *     
 *     return { previous };
 *   },
 *   onError: (err, newData, context) => {
 *     // Rollback on error
 *     queryClient.setQueryData(['users', userId], context?.previous);
 *   },
 * });
 * ```
 */
export function createOptimisticUpdate<TData>(
  queryKey: unknown[],
  updater: (old: TData | undefined) => TData
) {
  return {
    queryKey,
    updater,
  };
}
