/**
 * Custom hooks for API health checks
 * 
 * These hooks use TanStack Query to manage health check requests:
 * - Manual triggering (only checks when user clicks button)
 * - Automatic caching
 * - Loading and error state management
 * 
 * @see https://tanstack.com/query/latest for TanStack Query docs
 */

import { useQuery } from '@tanstack/react-query';
import { checkNexusHealth } from '../api/checkNexusHealth';
import { checkIdentityHealth } from '../api/checkIdentityHealth';
import { HealthCheckResponse, HealthCheckException } from '../types';

/**
 * Hook return type with all the data and states you need
 */
interface UseHealthCheckReturn {
  // The health check data (null if not checked yet or error)
  data: HealthCheckResponse | null;
  
  // Loading state (true while checking)
  isLoading: boolean;
  
  // Error message (null if no error)
  error: string | null;
  
  // Error type for more specific error handling
  errorType: HealthCheckException['type'] | null;
  
  // Function to manually trigger the health check
  refetch: () => void;
  
  // Whether the check has been run at least once
  isFetched: boolean;
}

/**
 * Custom hook to check Nexus API health
 * 
 * By default, this hook does NOT automatically run the health check.
 * You must call `refetch()` to trigger the check (e.g., on button click).
 * 
 * @returns UseHealthCheckReturn - Health data, loading state, and error info
 * 
 * @example
 * ```typescript
 * function NexusHealthCheck() {
 *   const { data, isLoading, error, refetch } = useNexusHealthCheck();
 * 
 *   return (
 *     <div>
 *       <button onClick={refetch}>Check Health</button>
 *       {isLoading && <Spinner />}
 *       {error && <ErrorMessage message={error} />}
 *       {data && <p>Status: {data.status}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useNexusHealthCheck(): UseHealthCheckReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetched,
  } = useQuery({
    // Unique key for this query
    queryKey: ['health-check', 'nexus'],
    
    // The function that performs the health check
    queryFn: checkNexusHealth,
    
    // Don't run automatically - wait for manual trigger
    enabled: false,
    
    // Don't retry on failure (health checks should be quick)
    retry: false,
    
    // Don't cache for long - health status can change quickly
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });

  // Extract error information if the check failed
  let errorMessage: string | null = null;
  let errorType: HealthCheckException['type'] | null = null;

  if (error) {
    if (error instanceof HealthCheckException) {
      errorMessage = error.message;
      errorType = error.type;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorType = 'UNKNOWN_ERROR';
    } else {
      errorMessage = 'An unknown error occurred';
      errorType = 'UNKNOWN_ERROR';
    }
  }

  return {
    data: data || null,
    isLoading,
    error: errorMessage,
    errorType,
    refetch,
    isFetched,
  };
}

/**
 * Custom hook to check Identity API health
 * 
 * By default, this hook does NOT automatically run the health check.
 * You must call `refetch()` to trigger the check (e.g., on button click).
 * 
 * @returns UseHealthCheckReturn - Health data, loading state, and error info
 * 
 * @example
 * ```typescript
 * function IdentityHealthCheck() {
 *   const { data, isLoading, error, refetch } = useIdentityHealthCheck();
 * 
 *   return (
 *     <div>
 *       <button onClick={refetch}>Check Health</button>
 *       {isLoading && <Spinner />}
 *       {error && <ErrorMessage message={error} />}
 *       {data && <p>Status: {data.status}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIdentityHealthCheck(): UseHealthCheckReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetched,
  } = useQuery({
    // Unique key for this query
    queryKey: ['health-check', 'identity'],
    
    // The function that performs the health check
    queryFn: checkIdentityHealth,
    
    // Don't run automatically - wait for manual trigger
    enabled: false,
    
    // Don't retry on failure
    retry: false,
    
    // Don't cache for long
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });

  // Extract error information if the check failed
  let errorMessage: string | null = null;
  let errorType: HealthCheckException['type'] | null = null;

  if (error) {
    if (error instanceof HealthCheckException) {
      errorMessage = error.message;
      errorType = error.type;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorType = 'UNKNOWN_ERROR';
    } else {
      errorMessage = 'An unknown error occurred';
      errorType = 'UNKNOWN_ERROR';
    }
  }

  return {
    data: data || null,
    isLoading,
    error: errorMessage,
    errorType,
    refetch,
    isFetched,
  };
}
