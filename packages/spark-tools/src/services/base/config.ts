/**
 * API Configuration
 * 
 * Centralized configuration for API communication.
 * Manages base URLs, timeouts, and default headers.
 */

export const API_CONFIG = {
  /**
   * Base URL for the Nexus API
   * Reads from environment variable or defaults to localhost
   */
  nexusApiBaseUrl: process.env.NEXT_PUBLIC_NEXUS_API_URL || 'http://localhost:8000',

  /**
   * Base URL for the Identity API
   * Reads from environment variable or defaults to localhost
   */
  identityApiBaseUrl: process.env.NEXT_PUBLIC_IDENTITY_API_URL || 'http://localhost:8100',

  /**
   * Default request timeout in milliseconds
   */
  timeout: 30000,

  /**
   * Default headers to include in all requests
   */
  defaultHeaders: {
    'Content-Type': 'application/json',
  },

  /**
   * Whether to include credentials (cookies) in requests
   */
  credentials: 'include' as RequestCredentials,

  /**
   * Retry configuration
   */
  retry: {
    maxAttempts: 3,
    baseDelay: 1000, // milliseconds
  },
} as const;

/**
 * Get the appropriate base URL for a given API
 */
export function getApiBaseUrl(api: 'nexus' | 'identity'): string {
  return api === 'nexus' 
    ? API_CONFIG.nexusApiBaseUrl 
    : API_CONFIG.identityApiBaseUrl;
}

/**
 * Get headers for an authenticated request
 * @param token - Optional authentication token
 */
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { ...API_CONFIG.defaultHeaders };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}
