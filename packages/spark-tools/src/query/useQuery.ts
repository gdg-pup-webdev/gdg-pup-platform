/**
 * Enhanced useQuery Hook with TanStack Query
 * 
 * Primary data fetching hook with automatic caching and background refetching.
 * 
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useQuery({
 *   queryKey: ['users', userId],
 *   queryFn: () => userService.getUser(userId),
 *   enabled: !!userId,
 * });
 * ```
 */

'use client';

import { 
  useQuery as useTanStackQuery, 
  type UseQueryOptions as TanStackQueryOptions, 
  type UseQueryResult 
} from '@tanstack/react-query';
import { processError, type ApiError } from '../errors';

/**
 * Options for useQuery hook
 */
export interface UseQueryOptions<TData = unknown>
  extends Omit<
    TanStackQueryOptions<TData, ApiError, TData, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'initialData'
  > {
  /** Query key for caching */
  queryKey: readonly unknown[];
  
  /** Function that fetches the data */
  queryFn: () => Promise<TData>;
  
  /** Whether to fetch immediately (default: true) */
  enabled?: boolean;
  
  /** Stale time in ms (default: 5 minutes) */
  staleTime?: number;
  
  /** Cache time in ms (default: 10 minutes) */
  gcTime?: number;
}

/**
 * Return type for useQuery hook
 */
export interface UseQueryReturn<TData = unknown> {
  /** The fetched data */
  data: TData | undefined;
  
  /** Whether the request is in progress */
  loading: boolean;
  
  /** Error that occurred during the request */
  error: ApiError | null;
  
  /** Function to manually refetch the data */
  refetch: () => Promise<any>;
  
  /** Whether this is the initial load */
  isInitialLoad: boolean;
  
  /** Whether the data is stale and being refetched */
  isRefetching: boolean;
  
  /** Whether data is available */
  isSuccess: boolean;
  
  /** Full TanStack Query result for advanced usage */
  queryResult: UseQueryResult<TData, ApiError>;
}

/**
 * Enhanced data fetching hook using TanStack Query
 * 
 * Provides automatic caching, background refetching, and better state management
 * while maintaining our custom error handling.
 */
export function useQuery<TData = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime,
  gcTime,
  ...options
}: UseQueryOptions<TData>): UseQueryReturn<TData> {
  const queryResult = useTanStackQuery<TData, ApiError, TData, readonly unknown[]>({
    queryKey,
    queryFn: async () => {
      try {
        const data = await queryFn();
        return data;
      } catch (error) {
        const apiError = processError(error);
        throw apiError;
      }
    },
    enabled,
    staleTime,
    gcTime,
    ...options,
  });

  return {
    data: queryResult.data as TData | undefined,
    loading: queryResult.isPending,
    error: queryResult.error,
    refetch: queryResult.refetch,
    isInitialLoad: queryResult.isLoading,
    isRefetching: queryResult.isRefetching,
    isSuccess: queryResult.isSuccess,
    queryResult: queryResult as UseQueryResult<TData, ApiError>,
  };
}
