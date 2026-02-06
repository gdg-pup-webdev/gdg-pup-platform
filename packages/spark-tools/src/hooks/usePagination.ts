/**
 * usePagination Hook
 * 
 * Hook for managing pagination state.
 * 
 * @example
 * ```typescript
 * const {
 *   page,
 *   pageSize,
 *   setPage,
 *   setPageSize,
 *   nextPage,
 *   prevPage,
 *   goToPage,
 *   reset,
 * } = usePagination({ initialPage: 1, initialPageSize: 10 });
 * ```
 */

'use client';

import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  /** Initial page number (1-indexed) */
  initialPage?: number;
  
  /** Initial page size */
  initialPageSize?: number;
  
  /** Total number of items (optional, for calculating last page) */
  totalItems?: number;
}

export interface UsePaginationReturn {
  /** Current page number (1-indexed) */
  page: number;
  
  /** Current page size */
  pageSize: number;
  
  /** Total number of pages (if totalItems provided) */
  totalPages?: number;
  
  /** Set the current page */
  setPage: (page: number) => void;
  
  /** Set the page size */
  setPageSize: (pageSize: number) => void;
  
  /** Go to next page */
  nextPage: () => void;
  
  /** Go to previous page */
  prevPage: () => void;
  
  /** Go to a specific page */
  goToPage: (page: number) => void;
  
  /** Reset pagination to initial values */
  reset: () => void;
  
  /** Whether there is a next page */
  hasNextPage: boolean;
  
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  
  /** Calculate offset for API calls (0-indexed) */
  offset: number;
}

/**
 * Hook for managing pagination state
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : undefined;
  
  const nextPage = useCallback(() => {
    setPage((prev) => {
      if (totalPages && prev >= totalPages) return prev;
      return prev + 1;
    });
  }, [totalPages]);
  
  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);
  
  const goToPage = useCallback((newPage: number) => {
    if (newPage < 1) {
      setPage(1);
    } else if (totalPages && newPage > totalPages) {
      setPage(totalPages);
    } else {
      setPage(newPage);
    }
  }, [totalPages]);
  
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);
  
  const hasNextPage = totalPages ? page < totalPages : true;
  const hasPrevPage = page > 1;
  const offset = (page - 1) * pageSize;
  
  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    goToPage,
    reset,
    hasNextPage,
    hasPrevPage,
    offset,
  };
}
