/**
 * Custom error classes for API-related errors
 * 
 * These error classes provide structured error handling across the frontend,
 * allowing components and services to handle specific error types appropriately.
 */

/**
 * Base API Error class
 * All API-related errors extend from this class
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly title: string;
  public readonly detail?: string;
  public readonly timestamp: Date;

  constructor(
    message: string,
    statusCode: number = 500,
    title?: string,
    detail?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.title = title || this.name;
    this.detail = detail;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a user-friendly error message
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * Returns a JSON representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      title: this.title,
      detail: this.detail,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * 400 Bad Request - Client sent invalid data
 */
export class ValidationError extends ApiError {
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string = 'Validation failed',
    errors?: Array<{ field: string; message: string }>,
    detail?: string
  ) {
    super(message, 400, 'Validation Error', detail);
    this.name = 'ValidationError';
    this.errors = errors;
  }

  getUserMessage(): string {
    if (this.errors && this.errors.length > 0) {
      return `Validation failed: ${this.errors.map(e => e.message).join(', ')}`;
    }
    return this.message;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

/**
 * 401 Unauthorized - User is not authenticated
 */
export class UnauthorizedError extends ApiError {
  constructor(
    message: string = 'You must be logged in to access this resource',
    detail?: string
  ) {
    super(message, 401, 'Unauthorized', detail);
    this.name = 'UnauthorizedError';
  }

  getUserMessage(): string {
    return 'Please log in to continue.';
  }
}

/**
 * 403 Forbidden - User doesn't have permission
 */
export class ForbiddenError extends ApiError {
  constructor(
    message: string = 'You do not have permission to access this resource',
    detail?: string
  ) {
    super(message, 403, 'Forbidden', detail);
    this.name = 'ForbiddenError';
  }

  getUserMessage(): string {
    return 'You do not have permission to perform this action.';
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
export class NotFoundError extends ApiError {
  public readonly resourceType?: string;
  public readonly resourceId?: string;

  constructor(
    message: string = 'The requested resource was not found',
    resourceType?: string,
    resourceId?: string,
    detail?: string
  ) {
    super(message, 404, 'Not Found', detail);
    this.name = 'NotFoundError';
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  getUserMessage(): string {
    if (this.resourceType) {
      return `${this.resourceType} not found.`;
    }
    return 'The requested resource was not found.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      resourceId: this.resourceId,
    };
  }
}

/**
 * 409 Conflict - Request conflicts with current state
 */
export class ConflictError extends ApiError {
  constructor(
    message: string = 'The request conflicts with the current state',
    detail?: string
  ) {
    super(message, 409, 'Conflict', detail);
    this.name = 'ConflictError';
  }

  getUserMessage(): string {
    return this.message;
  }
}

/**
 * 422 Unprocessable Entity - Semantic errors
 */
export class UnprocessableEntityError extends ApiError {
  constructor(
    message: string = 'The request was well-formed but contains semantic errors',
    detail?: string
  ) {
    super(message, 422, 'Unprocessable Entity', detail);
    this.name = 'UnprocessableEntityError';
  }

  getUserMessage(): string {
    return this.message;
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
export class RateLimitError extends ApiError {
  public readonly retryAfter?: number; // seconds

  constructor(
    message: string = 'Too many requests. Please try again later',
    retryAfter?: number,
    detail?: string
  ) {
    super(message, 429, 'Rate Limit Exceeded', detail);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }

  getUserMessage(): string {
    if (this.retryAfter) {
      return `Too many requests. Please try again in ${this.retryAfter} seconds.`;
    }
    return 'Too many requests. Please try again later.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
    };
  }
}

/**
 * 500 Internal Server Error - Something went wrong on the server
 */
export class ServerError extends ApiError {
  constructor(
    message: string = 'An unexpected error occurred. Please try again later',
    statusCode: number = 500,
    detail?: string
  ) {
    super(message, statusCode, 'Server Error', detail);
    this.name = 'ServerError';
  }

  getUserMessage(): string {
    return 'Something went wrong. Please try again later.';
  }
}

/**
 * Network Error - Failed to connect to the server
 */
export class NetworkError extends ApiError {
  constructor(
    message: string = 'Unable to connect to the server. Please check your internet connection',
    detail?: string
  ) {
    super(message, 0, 'Network Error', detail);
    this.name = 'NetworkError';
  }

  getUserMessage(): string {
    return 'Unable to connect. Please check your internet connection.';
  }
}

/**
 * Timeout Error - Request took too long
 */
export class TimeoutError extends ApiError {
  public readonly timeoutMs: number;

  constructor(
    message: string = 'The request timed out',
    timeoutMs: number = 30000,
    detail?: string
  ) {
    super(message, 0, 'Timeout Error', detail);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }

  getUserMessage(): string {
    return 'The request took too long. Please try again.';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      timeoutMs: this.timeoutMs,
    };
  }
}
