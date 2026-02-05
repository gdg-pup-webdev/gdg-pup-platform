/**
 * Tests for custom hooks
 * 
 * Note: These are basic structural tests. Expand with React Testing Library
 * for more comprehensive testing of React hooks behavior.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePagination, useDebounce } from '../index';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());
    
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.hasPreviousPage).toBe(false);
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 2, pageSize: 20 })
    );
    
    expect(result.current.page).toBe(2);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.hasPreviousPage).toBe(true);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.page).toBe(2);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 2 }));
    
    act(() => {
      result.current.previousPage();
    });
    
    expect(result.current.page).toBe(1);
  });

  it('should not go below page 1', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.previousPage();
    });
    
    expect(result.current.page).toBe(1);
  });

  it('should calculate total pages from total items', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, pageSize: 10 })
    );
    
    expect(result.current.totalPages).toBe(5);
  });

  it('should calculate offset correctly', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 3, pageSize: 10 })
    );
    
    expect(result.current.getOffset()).toBe(20);
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() =>
      usePagination({ initialPage: 1, pageSize: 10 })
    );
    
    act(() => {
      result.current.nextPage();
      result.current.nextPage();
      result.current.setPageSize(20);
    });
    
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });
});

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );
    
    expect(result.current).toBe('initial');
    
    // Change value
    rerender({ value: 'changed', delay: 100 });
    
    // Should still be old value immediately
    expect(result.current).toBe('initial');
    
    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('changed');
      },
      { timeout: 200 }
    );
  });
});

// Note: useApiQuery and useApiMutation tests would require mocking
// the API services and are left as an exercise based on your testing setup.
