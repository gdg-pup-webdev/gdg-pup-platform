/**
 * Tests for error handling utilities
 * 
 */

import { describe, it, expect } from 'vitest';
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ServerError,
  NetworkError,
  processError,
  getErrorMessage,
  isApiError,
  shouldRetry,
  getRetryDelay,
} from '../index';

describe('ApiError Classes', () => {
  it('should create ApiError with correct properties', () => {
    const error = new ApiError('Test error', 500, 'Test Title', 'Test Detail');
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.title).toBe('Test Title');
    expect(error.detail).toBe('Test Detail');
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('should create ValidationError with field errors', () => {
    const fieldErrors = [
      { field: 'email', message: 'Invalid email' },
      { field: 'password', message: 'Too short' },
    ];
    
    const error = new ValidationError('Validation failed', fieldErrors);
    
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(fieldErrors);
    expect(error.getUserMessage()).toContain('Invalid email');
  });

  it('should create NotFoundError with resource info', () => {
    const error = new NotFoundError('User not found', 'User', '123');
    
    expect(error.statusCode).toBe(404);
    expect(error.resourceType).toBe('User');
    expect(error.resourceId).toBe('123');
    expect(error.getUserMessage()).toContain('User not found');
  });

  it('should create UnauthorizedError with default message', () => {
    const error = new UnauthorizedError();
    
    expect(error.statusCode).toBe(401);
    expect(error.getUserMessage()).toContain('log in');
  });
});

describe('processError', () => {
  it('should return ApiError unchanged', () => {
    const originalError = new NotFoundError('Not found');
    const processed = processError(originalError);
    
    expect(processed).toBe(originalError);
  });

  it('should convert API response to appropriate error', () => {
    const response = {
      status: 404,
      body: {
        message: 'User not found',
        resourceType: 'User',
      },
    };
    
    const error = processError(response);
    
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('User not found');
  });

  it('should handle network errors', () => {
    const networkError = new Error('Failed to fetch');
    const error = processError(networkError);
    
    expect(error).toBeInstanceOf(NetworkError);
    expect(error.statusCode).toBe(0);
  });

  it('should handle generic errors', () => {
    const genericError = new Error('Something went wrong');
    const error = processError(genericError);
    
    expect(error).toBeInstanceOf(ServerError);
    expect(error.statusCode).toBe(500);
  });

  it('should handle string errors', () => {
    const error = processError('String error');
    
    expect(error).toBeInstanceOf(ServerError);
    expect(error.statusCode).toBe(500);
  });
});

describe('getErrorMessage', () => {
  it('should get user-friendly message from ApiError', () => {
    const error = new UnauthorizedError();
    const message = getErrorMessage(error);
    
    expect(message).toBe('Please log in to continue.');
  });

  it('should get message from Error', () => {
    const error = new Error('Test error');
    const message = getErrorMessage(error);
    
    expect(message).toBe('Test error');
  });

  it('should handle string errors', () => {
    const message = getErrorMessage('String error');
    expect(message).toBe('String error');
  });

  it('should handle unknown error types', () => {
    const message = getErrorMessage({ weird: 'object' });
    expect(message).toBe('An unexpected error occurred');
  });
});

describe('isApiError', () => {
  it('should return true for ApiError instances', () => {
    expect(isApiError(new ApiError('test'))).toBe(true);
    expect(isApiError(new NotFoundError())).toBe(true);
    expect(isApiError(new ValidationError())).toBe(true);
  });

  it('should return false for non-ApiError values', () => {
    expect(isApiError(new Error('test'))).toBe(false);
    expect(isApiError('string')).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
  });
});

describe('shouldRetry', () => {
  it('should retry network errors', () => {
    const error = new NetworkError();
    expect(shouldRetry(error, 1)).toBe(true);
    expect(shouldRetry(error, 2)).toBe(true);
    expect(shouldRetry(error, 3)).toBe(false); // Max retries
  });

  it('should retry server errors', () => {
    const error = new ServerError();
    expect(shouldRetry(error, 1)).toBe(true);
  });

  it('should not retry client errors', () => {
    const notFoundError = new NotFoundError();
    const validationError = new ValidationError();
    const unauthorizedError = new UnauthorizedError();
    
    expect(shouldRetry(notFoundError, 1)).toBe(false);
    expect(shouldRetry(validationError, 1)).toBe(false);
    expect(shouldRetry(unauthorizedError, 1)).toBe(false);
  });
});

describe('getRetryDelay', () => {
  it('should calculate exponential backoff', () => {
    expect(getRetryDelay(1)).toBe(1000);   // 1 second
    expect(getRetryDelay(2)).toBe(2000);   // 2 seconds
    expect(getRetryDelay(3)).toBe(4000);   // 4 seconds
    expect(getRetryDelay(4)).toBe(8000);   // 8 seconds
  });
});

describe('ApiError toJSON', () => {
  it('should serialize to JSON correctly', () => {
    const error = new NotFoundError('User not found', 'User', '123');
    const json = error.toJSON();
    
    expect(json).toHaveProperty('name', 'NotFoundError');
    expect(json).toHaveProperty('message', 'User not found');
    expect(json).toHaveProperty('statusCode', 404);
    expect(json).toHaveProperty('resourceType', 'User');
    expect(json).toHaveProperty('resourceId', '123');
    expect(json).toHaveProperty('timestamp');
  });
});
