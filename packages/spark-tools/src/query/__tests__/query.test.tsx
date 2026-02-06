/**
 * TanStack Query Hooks Tests
 * 
 * Tests for useQuery and useMutation wrappers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '../useQuery';
import { useMutation } from '../useMutation';
import { ApiError } from '../../errors';

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useQuery', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: '1', name: 'Test User' };
    const queryFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useQuery({
        queryKey: ['users', '1'],
        queryFn,
      }),
      { wrapper }
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(true);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('should handle errors correctly', async () => {
    const mockError = new ApiError('Not found', 404);
    const queryFn = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useQuery({
        queryKey: ['users', '1'],
        queryFn,
      }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.statusCode).toBe(404);
  });

  it('should support enabled option', async () => {
    const queryFn = vi.fn().mockResolvedValue({ data: 'test' });

    const { result, rerender } = renderHook(
      ({ enabled }) => useQuery({
        queryKey: ['test'],
        queryFn,
        enabled,
      }),
      { wrapper, initialProps: { enabled: false } }
    );

    expect(queryFn).not.toHaveBeenCalled();

    rerender({ enabled: true });

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(1);
    });
  });

  it('should provide refetch function', async () => {
    const queryFn = vi.fn().mockResolvedValue({ data: 'test' });

    const { result } = renderHook(
      () => useQuery({
        queryKey: ['test'],
        queryFn,
      }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(queryFn).toHaveBeenCalledTimes(1);

    result.current.refetch();

    await waitFor(() => {
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });
});

describe('useMutation', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('should execute mutation successfully', async () => {
    const mockData = { id: '1', name: 'Updated' };
    const mutationFn = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useMutation({ mutationFn }),
      { wrapper }
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();

    result.current.mutate({ name: 'Updated' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isSuccess).toBe(true);
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Updated' });
  });

  it('should handle mutation errors', async () => {
    const mockError = new ApiError('Update failed', 400);
    const mutationFn = vi.fn().mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useMutation({ mutationFn }),
      { wrapper }
    );

    result.current.mutate({ data: 'test' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.isError).toBe(true);
  });

  it('should call onSuccess callback', async () => {
    const mockData = { success: true };
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useMutation({
        mutationFn: () => Promise.resolve(mockData),
        onSuccess,
      }),
      { wrapper }
    );

    result.current.mutate({ data: 'test' });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onSuccess.mock.calls[0][0]).toEqual(mockData);
      expect(onSuccess.mock.calls[0][1]).toEqual({ data: 'test' });
    });
  });

  it('should call onError callback', async () => {
    const mockError = new ApiError('Error', 500);
    const onError = vi.fn();

    const { result } = renderHook(
      () => useMutation({
        mutationFn: () => Promise.reject(mockError),
        onError,
      }),
      { wrapper }
    );

    result.current.mutate({ data: 'test' });

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should call onMutate before mutation', async () => {
    const onMutate = vi.fn();

    const { result } = renderHook(
      () => useMutation({
        mutationFn: () => Promise.resolve({ success: true }),
        onMutate,
      }),
      { wrapper }
    );

    result.current.mutate({ data: 'test' });

    await waitFor(() => {
      expect(onMutate).toHaveBeenCalled();
      expect(onMutate.mock.calls[0][0]).toEqual({ data: 'test' });
    });
  });

  it('should reset mutation state', async () => {
    const mockData = { success: true };

    const { result } = renderHook(
      () => useMutation({
        mutationFn: () => Promise.resolve(mockData),
      }),
      { wrapper }
    );

    result.current.mutate({ data: 'test' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.reset();

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
    expect(result.current.error).toBeNull();
  });

  it('should support mutateAsync', async () => {
    const mockData = { success: true };

    const { result } = renderHook(
      () => useMutation({
        mutationFn: () => Promise.resolve(mockData),
      }),
      { wrapper }
    );

    const promise = result.current.mutateAsync({ data: 'test' });

    await expect(promise).resolves.toEqual(mockData);
  });
});
