/**
 * Error handling utilities for processing API responses and errors
 * 
 * These utilities convert API responses and thrown errors into typed ApiError instances,
 * allowing for consistent error handling throughout the application.
 */

import {
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

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.getUserMessage();
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Handle API response errors from typed-rest callEndpoint
 * Converts API responses into appropriate ApiError instances
 */
export function handleApiResponse(result: any): never {
  const status = result.status;
  const body = result.body;

  switch (status) {
    case 400:
      throw new ValidationError(
        body.message || 'Bad request',
        body.errors,
        body.detail
      );

    case 401:
      throw new UnauthorizedError(
        body.message || 'Unauthorized',
        body.detail
      );

    case 403:
      throw new ForbiddenError(
        body.message || 'Forbidden',
        body.detail
      );

    case 404:
      throw new NotFoundError(
        body.message || 'Not found',
        body.resourceType,
        body.resourceId,
        body.detail
      );

    case 409:
      throw new ConflictError(
        body.message || 'Conflict',
        body.detail
      );

    case 422:
      throw new UnprocessableEntityError(
        body.message || 'Unprocessable entity',
        body.detail
      );

    case 429:
      throw new RateLimitError(
        body.message || 'Too many requests',
        body.retryAfter,
        body.detail
      );

    case 500:
    case 502:
    case 503:
    case 504:
      throw new ServerError(
        body.message || 'Internal server error',
        status,
        body.detail
      );

    default:
      throw new ApiError(
        body.message || 'An error occurred',
        status,
        body.title,
        body.detail
      );
  }
}

/**
 * Handle generic errors (network errors, timeouts, etc.)
 * Converts various error types into ApiError instances
 */
export function handleApiError(error: unknown): never {
  // If it's already an ApiError, rethrow it
  if (isApiError(error)) {
    throw error;
  }

  // Handle native Error types
  if (error instanceof Error) {
    // Network errors (fetch failed, no internet, etc.)
    if (error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')) {
      throw new NetworkError(
        'Unable to connect to the server',
        error.message
      );
    }

    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      throw new TimeoutError(
        'The request timed out',
        30000,
        error.message
      );
    }

    // Generic server error for unknown Error types
    throw new ServerError(
      error.message,
      500,
      error.stack
    );
  }

  // Handle string errors
  if (typeof error === 'string') {
    throw new ServerError(error);
  }

  // Handle unknown error types
  throw new ServerError(
    'An unexpected error occurred',
    500,
    JSON.stringify(error)
  );
}

/**
 * Process any error or API response into a typed ApiError
 * This is the main entry point for error handling
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await callEndpoint(...);
 *   if (result.status !== 200) {
 *     processError(result);
 *   }
 * } catch (error) {
 *   const apiError = processError(error);
 *   console.error(apiError.getUserMessage());
 * }
 * ```
 */
export function processError(errorOrResponse: unknown): ApiError {
  try {
    // If it's already an ApiError, return it
    if (isApiError(errorOrResponse)) {
      return errorOrResponse;
    }

    // If it looks like an API response object with status
    if (
      typeof errorOrResponse === 'object' &&
      errorOrResponse !== null &&
      'status' in errorOrResponse &&
      'body' in errorOrResponse
    ) {
      handleApiResponse(errorOrResponse);
    }

    // Otherwise, treat it as a generic error
    handleApiError(errorOrResponse);
  } catch (error) {
    // handleApiResponse and handleApiError throw ApiError instances
    if (isApiError(error)) {
      return error;
    }
    // Fallback for truly unexpected cases
    return new ServerError('An unexpected error occurred');
  }
}

/**
 * Log error for debugging purposes
 * In production, this could send to a logging service
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  
  if (isApiError(error)) {
    console.error(`${prefix} API Error:`, error.toJSON());
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message, error.stack);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}

/**
 * Determine if an error should trigger a global error boundary
 * Some errors (like validation errors) should be handled locally
 */
export function shouldShowGlobalError(error: ApiError): boolean {
  // Validation errors should be shown in forms, not globally
  if (error instanceof ValidationError) {
    return false;
  }

  // Not found errors can be handled by showing empty states
  if (error instanceof NotFoundError) {
    return false;
  }

  // These should trigger global error handling
  return (
    error instanceof ServerError ||
    error instanceof NetworkError ||
    error instanceof TimeoutError
  );
}

/**
 * Get a user-friendly title for the error
 * Useful for toast notifications or error modals
 */
export function getErrorTitle(error: ApiError): string {
  return error.title;
}

/**
 * Check if we should retry the request
 * Some errors are transient and worth retrying
 */
export function shouldRetry(error: ApiError, attemptNumber: number = 1): boolean {
  const maxRetries = 3;

  if (attemptNumber >= maxRetries) {
    return false;
  }

  // Retry on network errors
  if (error instanceof NetworkError) {
    return true;
  }

  // Retry on timeout errors
  if (error instanceof TimeoutError) {
    return true;
  }

  // Retry on 5xx errors (except rate limiting)
  if (error instanceof ServerError && !(error instanceof RateLimitError)) {
    return true;
  }

  return false;
}

/**
 * Get retry delay in milliseconds with exponential backoff
 */
export function getRetryDelay(attemptNumber: number): number {
  const baseDelay = 1000; // 1 second
  return baseDelay * Math.pow(2, attemptNumber - 1);
}
