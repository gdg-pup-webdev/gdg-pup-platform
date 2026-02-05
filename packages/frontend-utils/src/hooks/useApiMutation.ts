/**
 * useApiMutation Hook
 * 
 * A custom hook for making mutations (POST, PUT, PATCH, DELETE).
 * Handles loading states, error states, and success callbacks.
 * 
 * @example
 * ```typescript
 * const { mutate, loading, error, data } = useApiMutation(
 *   (data) => userService.updateProfile(userId, data),
 *   {
 *     onSuccess: () => {
 *       toast.success('Profile updated!');
 *       router.push('/profile');
 *     }
 *   }
 * );
 * 
 * const handleSubmit = async (formData) => {
 *   await mutate(formData);
 * };
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { ApiError, processError, logError } from '../errors';

/**
 * Options for useApiMutation hook
 */
export interface UseApiMutationOptions<TData = any, TVariables = any> {
  /** Callback when mutation succeeds */
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  
  /** Callback when mutation fails */
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;
  
  /** Callback before mutation starts */
  onMutate?: (variables: TVariables) => void | Promise<void>;
  
  /** Callback that runs after mutation completes (success or error) */
  onSettled?: (data: TData | null, error: ApiError | null, variables: TVariables) => void | Promise<void>;
  
  /** Whether to log errors (default: true) */
  logErrors?: boolean;
}

/**
 * Return type for useApiMutation hook
 */
export interface UseApiMutationResult<TData = any, TVariables = any> {
  /** Function to trigger the mutation */
  mutate: (variables: TVariables) => Promise<TData>;
  
  /** Async function that triggers mutation and returns the result */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  
  /** Whether the mutation is in progress */
  loading: boolean;
  
  /** Error that occurred during the mutation */
  error: ApiError | null;
  
  /** Data returned from the mutation */
  data: TData | null;
  
  /** Whether the mutation has been called */
  isIdle: boolean;
  
  /** Whether the mutation was successful */
  isSuccess: boolean;
  
  /** Whether the mutation failed */
  isError: boolean;
  
  /** Reset the mutation state */
  reset: () => void;
}

/**
 * Custom hook for mutations (POST, PUT, PATCH, DELETE)
 * 
 * @param mutationFn - Async function that performs the mutation
 * @param options - Options for the mutation
 * @returns Object with mutate function, loading, error, and data
 */
export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables> = {}
): UseApiMutationResult<TData, TVariables> {
  const {
    onSuccess,
    onError,
    onMutate,
    onSettled,
    logErrors = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
    setStatus('idle');
  }, []);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        setLoading(true);
        setError(null);
        setStatus('loading');

        // Call onMutate callback
        if (onMutate) {
          await onMutate(variables);
        }

        // Perform the mutation
        const result = await mutationFn(variables);

        // Update state with success
        setData(result);
        setStatus('success');

        // Call onSuccess callback
        if (onSuccess) {
          await onSuccess(result, variables);
        }

        // Call onSettled callback
        if (onSettled) {
          await onSettled(result, null, variables);
        }

        return result;
      } catch (err) {
        const apiError = processError(err);

        // Update state with error
        setError(apiError);
        setStatus('error');

        // Log error
        if (logErrors) {
          logError(apiError, 'useApiMutation');
        }

        // Call onError callback
        if (onError) {
          await onError(apiError, variables);
        }

        // Call onSettled callback
        if (onSettled) {
          await onSettled(null, apiError, variables);
        }

        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError, onMutate, onSettled, logErrors]
  );

  // Wrapper that doesn't throw (fire and forget)
  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        return await mutateAsync(variables);
      } catch (err) {
        // Error is already handled and stored in state
        // This version just doesn't throw
        return Promise.reject(err);
      }
    },
    [mutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    loading,
    error,
    data,
    isIdle: status === 'idle',
    isSuccess: status === 'success',
    isError: status === 'error',
    reset,
  };
}
