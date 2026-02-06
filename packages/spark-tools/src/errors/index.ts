/**
 * Error handling module
 * 
 * This module provides custom error classes and utilities for handling
 * API errors throughout the frontend application.
 * 
 * @example
 * ```typescript
 * import { processError, NotFoundError } from '@/lib/errors';
 * 
 * try {
 *   const result = await callEndpoint(...);
 *   if (result.status !== 200) {
 *     throw processError(result);
 *   }
 * } catch (error) {
 *   const apiError = processError(error);
 *   
 *   if (apiError instanceof NotFoundError) {
 *     // Show "not found" UI
 *   } else {
 *     // Show generic error
 *   }
 * }
 * ```
 */

// Export all error classes
export {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  RateLimitError,
  ServerError,
  NetworkError,
  TimeoutError,
} from './ApiError';

// Export all error handling utilities
export {
  isApiError,
  getErrorMessage,
  handleApiResponse,
  handleApiError,
  processError,
  logError,
  shouldShowGlobalError,
  getErrorTitle,
  shouldRetry,
  getRetryDelay,
} from './errorHandler';
