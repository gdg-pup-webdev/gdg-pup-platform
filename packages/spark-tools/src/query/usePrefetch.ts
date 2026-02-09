/**
 * usePrefetch Hook
 * 
 * Hook for prefetching data before it's needed.
 * Useful for optimistic navigation and hover-to-prefetch patterns.
 * 
 * @example
 * ```typescript
 * const prefetchUser = usePrefetch();
 * 
 * // Prefetch on hover
 * <Link
 *   href={`/users/${userId}`}
 *   onMouseEnter={() => prefetchUser(
 *     queryKeys.users.detail(userId),
 *     () => userService.getUserProfile(userId)
 *   )}
 * >
 *   View Profile
 * </Link>
 * ```
 */

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export interface PrefetchOptions {
  /** Time in ms before data is considered stale (default: 5 minutes) */
  staleTime?: number;
  
  /** Whether to force refetch even if data exists (default: false) */
  force?: boolean;
}

/**
 * Hook for prefetching queries
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch a query
   * 
   * @param queryKey - The query key
   * @param queryFn - Function to fetch the data
   * @param options - Prefetch options
   */
  const prefetch = useCallback(
    async <TData>(
      queryKey: readonly unknown[],
      queryFn: () => Promise<TData>,
      options: PrefetchOptions = {}
    ) => {
      const { staleTime = 5 * 60 * 1000, force = false } = options;
      
      // Check if data already exists in cache and is fresh
      if (!force) {
        const existingData = queryClient.getQueryData(queryKey);
        const queryState = queryClient.getQueryState(queryKey);
        
        // If data exists and is fresh, don't prefetch
        if (existingData && queryState && !queryState.isInvalidated) {
          const dataAge = Date.now() - (queryState.dataUpdatedAt || 0);
          if (dataAge < staleTime) {
            return;
          }
        }
      }
      
      // Prefetch the query
      await queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      });
    },
    [queryClient]
  );

  /**
   * Prefetch multiple queries in parallel
   */
  const prefetchMultiple = useCallback(
    async (
      queries: Array<{
        queryKey: readonly unknown[];
        queryFn: () => Promise<any>;
        options?: PrefetchOptions;
      }>
    ) => {
      await Promise.all(
        queries.map(({ queryKey, queryFn, options }) =>
          prefetch(queryKey, queryFn, options)
        )
      );
    },
    [prefetch]
  );

  /**
   * Ensure data is available (prefetch if not in cache)
   */
  const ensureQueryData = useCallback(
    async <TData>(
      queryKey: readonly unknown[],
      queryFn: () => Promise<TData>
    ): Promise<TData> => {
      return await queryClient.ensureQueryData({
        queryKey,
        queryFn,
      });
    },
    [queryClient]
  );

  return {
    prefetch,
    prefetchMultiple,
    ensureQueryData,
  };
}

/**
 * usePrefetchOnHover Hook
 * 
 * Specialized hook that returns props for hover-based prefetching.
 * 
 * @example
 * ```typescript
 * const prefetchProps = usePrefetchOnHover(
 *   queryKeys.users.detail(userId),
 *   () => userService.getUserProfile(userId)
 * );
 * 
 * <Link {...prefetchProps} href={`/users/${userId}`}>
 *   View Profile
 * </Link>
 * ```
 */
export function usePrefetchOnHover<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: PrefetchOptions
) {
  const { prefetch } = usePrefetch();
  
  const handleMouseEnter = useCallback(() => {
    prefetch(queryKey, queryFn, options);
  }, [prefetch, queryKey, queryFn, options]);
  
  const handleTouchStart = useCallback(() => {
    prefetch(queryKey, queryFn, options);
  }, [prefetch, queryKey, queryFn, options]);
  
  return {
    onMouseEnter: handleMouseEnter,
    onTouchStart: handleTouchStart,
  };
}
