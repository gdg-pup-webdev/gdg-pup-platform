/**
 * @packages/spark-tools
 * 
 * Modern frontend utilities for GDG PUP Platform.
 * Built on TanStack Query for optimal data fetching and caching.
 * 
 * @example
 * ```typescript
 * // Import errors
 * import { ApiError, processError } from '@packages/spark-tools/errors';
 * 
 * // Import services
 * import { BaseApiService } from '@packages/spark-tools/services';
 * 
 * // Import TanStack Query integration
 * import { QueryProvider, useQuery, useMutation, queryKeys } from '@packages/spark-tools/query';
 * ```
 */

// Re-export all modules
export * from './errors';
export * from './services';
export * from './query';
