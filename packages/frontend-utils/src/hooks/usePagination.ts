/**
 * usePagination Hook
 * 
 * A custom hook for managing pagination state.
 * Handles page numbers, page size, and provides navigation functions.
 * 
 * @example
 * ```typescript
 * const pagination = usePagination({ initialPage: 1, pageSize: 10 });
 * const { data } = useApiQuery(
 *   () => eventService.getEvents({
 *     page: pagination.page,
 *     pageSize: pagination.pageSize
 *   }),
 *   [pagination.page, pagination.pageSize]
 * );
 * 
 * return (
 *   <>
 *     <EventList events={data} />
 *     <Pagination
 *       onNext={pagination.nextPage}
 *       onPrev={pagination.previousPage}
 *       onPageChange={pagination.goToPage}
 *       currentPage={pagination.page}
 *       hasNext={pagination.hasNextPage}
 *       hasPrev={pagination.hasPreviousPage}
 *     />
 *   </>
 * );
 * ```
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

/**
 * Options for usePagination hook
 */
export interface UsePaginationOptions {
  /** Initial page number (default: 1) */
  initialPage?: number;
  
  /** Number of items per page (default: 10) */
  pageSize?: number;
  
  /** Total number of items (optional, used for calculating total pages) */
  totalItems?: number;
  
  /** Total number of pages (optional, alternative to totalItems) */
  totalPages?: number;
  
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
}

/**
 * Return type for usePagination hook
 */
export interface UsePaginationResult {
  /** Current page number (1-indexed) */
  page: number;
  
  /** Number of items per page */
  pageSize: number;
  
  /** Total number of pages (if totalItems or totalPages provided) */
  totalPages: number | null;
  
  /** Whether there is a next page */
  hasNextPage: boolean;
  
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
  
  /** Go to the next page */
  nextPage: () => void;
  
  /** Go to the previous page */
  previousPage: () => void;
  
  /** Go to a specific page */
  goToPage: (page: number) => void;
  
  /** Go to the first page */
  goToFirstPage: () => void;
  
  /** Go to the last page (only if totalPages is known) */
  goToLastPage: () => void;
  
  /** Change the page size */
  setPageSize: (size: number) => void;
  
  /** Reset to initial page */
  reset: () => void;
  
  /** Get offset for API calls (0-indexed) */
  getOffset: () => number;
  
  /** Get current page range (e.g., "1-10 of 50") */
  getPageRange: () => string;
}

/**
 * Custom hook for pagination state management
 * 
 * @param options - Options for pagination
 * @returns Pagination state and navigation functions
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationResult {
  const {
    initialPage = 1,
    pageSize: initialPageSize = 10,
    totalItems,
    totalPages: providedTotalPages,
    onPageChange,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  // Calculate total pages if totalItems is provided
  const totalPages = useMemo(() => {
    if (providedTotalPages !== undefined) {
      return providedTotalPages;
    }
    if (totalItems !== undefined) {
      return Math.ceil(totalItems / pageSize);
    }
    return null;
  }, [totalItems, providedTotalPages, pageSize]);

  // Check if there's a next page
  const hasNextPage = useMemo(() => {
    if (totalPages !== null) {
      return page < totalPages;
    }
    // If we don't know total pages, assume there might be a next page
    return true;
  }, [page, totalPages]);

  // Check if there's a previous page
  const hasPreviousPage = useMemo(() => {
    return page > 1;
  }, [page]);

  // Navigate to a specific page
  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 1) {
        newPage = 1;
      }
      if (totalPages !== null && newPage > totalPages) {
        newPage = totalPages;
      }
      
      setPage(newPage);
      
      if (onPageChange) {
        onPageChange(newPage);
      }
    },
    [totalPages, onPageChange]
  );

  // Navigate to the next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(page + 1);
    }
  }, [page, hasNextPage, goToPage]);

  // Navigate to the previous page
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(page - 1);
    }
  }, [page, hasPreviousPage, goToPage]);

  // Navigate to the first page
  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  // Navigate to the last page
  const goToLastPage = useCallback(() => {
    if (totalPages !== null) {
      goToPage(totalPages);
    }
  }, [totalPages, goToPage]);

  // Change page size (resets to page 1)
  const setPageSize = useCallback(
    (newSize: number) => {
      setPageSizeState(newSize);
      goToPage(1);
    },
    [goToPage]
  );

  // Reset to initial state
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  // Get 0-indexed offset for API calls
  const getOffset = useCallback(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  // Get page range string (e.g., "1-10 of 50")
  const getPageRange = useCallback(() => {
    const start = getOffset() + 1;
    const end = totalItems !== undefined 
      ? Math.min(start + pageSize - 1, totalItems)
      : start + pageSize - 1;
    
    if (totalItems !== undefined) {
      return `${start}-${end} of ${totalItems}`;
    }
    
    return `${start}-${end}`;
  }, [getOffset, pageSize, totalItems]);

  return {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    setPageSize,
    reset,
    getOffset,
    getPageRange,
  };
}
