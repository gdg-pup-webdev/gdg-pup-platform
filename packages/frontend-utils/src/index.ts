/**
 * @packages/frontend-utils
 * 
 * Shared frontend infrastructure for GDG PUP Platform.
 * 
 * This package provides reusable utilities for error handling,
 * base service classes, and custom React hooks.
 * 
 * @example
 * ```typescript
 * // Import errors
 * import { ApiError, processError } from '@packages/frontend-utils/errors';
 * 
 * // Import services
 * import { BaseApiService } from '@packages/frontend-utils/services';
 * 
 * // Import hooks
 * import { useApiQuery, useApiMutation } from '@packages/frontend-utils/hooks';
 * ```
 */

// Re-export all modules
export * from './errors';
export * from './services';
export * from './hooks';
