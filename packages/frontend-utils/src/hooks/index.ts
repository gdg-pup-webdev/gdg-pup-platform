/**
 * Custom Hooks
 * 
 * Central export point for all custom React hooks.
 * 
 * @example
 * ```typescript
 * import { useApiQuery, useApiMutation, usePagination, useDebounce } from '@/hooks';
 * ```
 */

export { useApiQuery } from './useApiQuery';
export type { UseApiQueryOptions, UseApiQueryResult } from './useApiQuery';

export { useApiMutation } from './useApiMutation';
export type { UseApiMutationOptions, UseApiMutationResult } from './useApiMutation';

export { usePagination } from './usePagination';
export type { UsePaginationOptions, UsePaginationResult } from './usePagination';

export { useDebounce, useDebounceCallback } from './useDebounce';
