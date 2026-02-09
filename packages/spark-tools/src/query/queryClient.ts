/**
 * TanStack Query Client Configuration
 * 
 * Centralized configuration for React Query with sensible defaults
 * for the GDG PUP Platform.
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { processError, logError } from '../errors';

/**
 * Default query options for all queries
 */
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    
    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    
    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      const apiError = processError(error);
      if (apiError.statusCode >= 400 && apiError.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
    
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Don't refetch on window focus in development
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Don't refetch on mount if data is fresh
    refetchOnMount: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    
    // Log mutation errors
    onError: (error) => {
      const apiError = processError(error);
      logError(apiError, 'Mutation Error');
    },
  },
};

/**
 * Create a new QueryClient instance with default configuration
 */
export function createQueryClient(options?: Partial<DefaultOptions>): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultQueryOptions.queries,
        ...options?.queries,
      },
      mutations: {
        ...defaultQueryOptions.mutations,
        ...options?.mutations,
      },
    },
  });
}

/**
 * Default query client instance
 * Can be used directly or create a new one with custom options
 */
export const queryClient = createQueryClient();
