/**
 * Enhanced useMutation Hook with TanStack Query
 * 
 * Primary mutation hook for server state modifications.
 * 
 * @example
 * ```typescript
 * const { mutate, loading } = useMutation({
 *   mutationFn: (data) => userService.updateUser(userId, data),
 *   onSuccess: () => {
 *     toast.success('Updated!');
 *     queryClient.invalidateQueries(['users', userId]);
 *   },
 * });
 * ```
 */

'use client';

import {
  useMutation as useTanStackMutation,
  type UseMutationOptions as TanStackMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { processError, type ApiError } from '../errors';

/**
 * Options for useMutation hook
 */
export interface UseMutationOptions<TData = unknown, TVariables = unknown>
  extends Omit<
    TanStackMutationOptions<TData, ApiError, TVariables>,
    'mutationFn' | 'onSuccess' | 'onError' | 'onMutate' | 'onSettled'
  > {
  /** Function that performs the mutation */
  mutationFn: (variables: TVariables) => Promise<TData>;
  
  /** Callback when mutation succeeds */
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => void | Promise<void>;
  
  /** Callback when mutation fails */
  onError?: (error: ApiError, variables: TVariables, context: unknown) => void | Promise<void>;
  
  /** Callback before mutation starts */
  onMutate?: (variables: TVariables) => unknown | Promise<unknown>;
  
  /** Callback that runs after mutation completes (success or error) */
  onSettled?: (
    data: TData | undefined,
    error: ApiError | null,
    variables: TVariables,
    context: unknown
  ) => void | Promise<void>;
}

/**
 * Return type for useMutation hook
 */
export interface UseMutationReturn<TData = unknown, TVariables = unknown> {
  /** Function to trigger the mutation */
  mutate: (variables: TVariables) => void;
  
  /** Async function that triggers mutation and returns the result */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  
  /** Whether the mutation is in progress */
  loading: boolean;
  
  /** Error that occurred during the mutation */
  error: ApiError | null;
  
  /** Data returned from the mutation */
  data: TData | undefined;
  
  /** Whether the mutation has not been called */
  isIdle: boolean;
  
  /** Whether the mutation was successful */
  isSuccess: boolean;
  
  /** Whether the mutation failed */
  isError: boolean;
  
  /** Reset the mutation state */
  reset: () => void;
  
  /** Full TanStack Query mutation result for advanced usage */
  mutationResult: UseMutationResult<TData, ApiError, TVariables>;
}

/**
 * Enhanced mutation hook using TanStack Query
 * 
 * Provides better state management and integrates with query cache invalidation.
 */
export function useMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  onMutate,
  onSettled,
  ...options
}: UseMutationOptions<TData, TVariables>): UseMutationReturn<
  TData,
  TVariables
> {
  const mutationResult = useTanStackMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        const data = await mutationFn(variables);
        return data;
      } catch (error) {
        const apiError = processError(error);
        throw apiError;
      }
    },
    onSuccess: onSuccess ? (data, variables, context) => onSuccess(data, variables, context) : undefined,
    onError: onError ? (error, variables, context) => onError(error, variables, context) : undefined,
    onMutate: onMutate ? (variables) => onMutate(variables) : undefined,
    onSettled: onSettled ? (data, error, variables, context) => onSettled(data, error, variables, context) : undefined,
    ...options,
  });

  return {
    mutate: mutationResult.mutate,
    mutateAsync: mutationResult.mutateAsync,
    loading: mutationResult.isPending,
    error: mutationResult.error,
    data: mutationResult.data,
    isIdle: mutationResult.isIdle,
    isSuccess: mutationResult.isSuccess,
    isError: mutationResult.isError,
    reset: mutationResult.reset,
    mutationResult,
  };
}
