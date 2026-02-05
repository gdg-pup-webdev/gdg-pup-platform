/**
 * useApiQuery Hook
 * 
 * A custom hook for fetching data from API services.
 * Handles loading states, error states, and automatic refetching.
 * 
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useApiQuery(
 *   () => userService.getUserProfile(userId),
 *   [userId]
 * );
 * 
 * if (loading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <UserProfile user={data} />;
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError, processError, logError } from '../errors';

/**
 * Options for useApiQuery hook
 */
export interface UseApiQueryOptions {
  /** Whether to fetch immediately on mount (default: true) */
  enabled?: boolean;
  
  /** Whether to refetch when dependencies change (default: true) */
  refetchOnDepsChange?: boolean;
  
  /** Callback when data is successfully fetched */
  onSuccess?: (data: any) => void;
  
  /** Callback when an error occurs */
  onError?: (error: ApiError) => void;
  
  /** Whether to log errors (default: true) */
  logErrors?: boolean;
}

/**
 * Return type for useApiQuery hook
 */
export interface UseApiQueryResult<T> {
  /** The fetched data */
  data: T | null;
  
  /** Whether the request is in progress */
  loading: boolean;
  
  /** Error that occurred during the request */
  error: ApiError | null;
  
  /** Function to manually refetch the data */
  refetch: () => Promise<void>;
  
  /** Whether this is the initial load */
  isInitialLoad: boolean;
}

/**
 * Custom hook for fetching data with loading and error states
 * 
 * @param fetcher - Async function that returns the data
 * @param deps - Dependencies that trigger a refetch when changed
 * @param options - Additional options for the query
 * @returns Object with data, loading, error, and refetch
 */
export function useApiQuery<T = any>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
  const {
    enabled = true,
    refetchOnDepsChange = true,
    onSuccess,
    onError,
    logErrors = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<ApiError | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Track the current fetch to prevent race conditions
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const currentFetchId = ++fetchIdRef.current;
    
    try {
      setLoading(true);
      setError(null);

      const result = await fetcher();

      // Only update state if this is still the latest fetch and component is mounted
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setData(result);
        setIsInitialLoad(false);
        
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (err) {
      const apiError = processError(err);
      
      // Only update state if this is still the latest fetch and component is mounted
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setError(apiError);
        setIsInitialLoad(false);
        
        if (logErrors) {
          logError(apiError, 'useApiQuery');
        }
        
        if (onError) {
          onError(apiError);
        }
      }
    } finally {
      // Only update loading if this is still the latest fetch and component is mounted
      if (currentFetchId === fetchIdRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetcher, enabled, onSuccess, onError, logErrors]);

  // Refetch function that can be called manually
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (enabled && refetchOnDepsChange) {
      fetchData();
    }
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, deps);

  // Reset mounted ref on mount
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isInitialLoad,
  };
}
