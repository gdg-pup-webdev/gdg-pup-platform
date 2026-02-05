/**
 * useDebounce Hook
 * 
 * A custom hook for debouncing values.
 * Useful for search inputs, form validations, and reducing API calls.
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * const { data } = useApiQuery(
 *   () => eventService.searchEvents(debouncedSearchTerm),
 *   [debouncedSearchTerm]
 * );
 * 
 * return (
 *   <input
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search events..."
 *   />
 * );
 * ```
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Debounce a value
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebounceCallback Hook
 * 
 * A custom hook for debouncing callback functions.
 * Useful for handling expensive operations that should not run on every change.
 * 
 * @example
 * ```typescript
 * const debouncedSearch = useDebounceCallback(
 *   (term: string) => {
 *     console.log('Searching for:', term);
 *     // Perform search
 *   },
 *   500
 * );
 * 
 * return (
 *   <input
 *     onChange={(e) => debouncedSearch(e.target.value)}
 *     placeholder="Search..."
 *   />
 * );
 * ```
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}
