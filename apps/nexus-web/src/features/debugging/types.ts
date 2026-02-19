/**
 * Type definitions for the debugging feature
 * 
 * This module contains all TypeScript interfaces and types used
 * in the debugging tools for authentication and API testing.
 */

/**
 * Structure of the authentication context for debugging
 */
export interface DebugAuthState {
  /** User's authentication token for backend API */
  token: string | null;
  
  /** Google OAuth access token */
  googleAccessToken: string | null;
  
  /** Current authentication status */
  status: "authenticated" | "unauthenticated" | "checking";
  
  /** Authenticated user information */
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      name?: string;
      picture?: string;
      avatar_url?: string;
    };
  } | null;
}

/**
 * Result from an API test request
 */
export interface ApiTestResult {
  /** HTTP status code */
  statusCode: number;
  
  /** Whether the request succeeded */
  success: boolean;
  
  /** Response data (if successful) */
  data?: any;
  
  /** Error message (if failed) */
  error?: string;
  
  /** Time taken for the request (in ms) */
  duration: number;
}

/**
 * Configuration for API test requests
 */
export interface ApiTestConfig {
  /** API endpoint URL */
  url: string;
  
  /** HTTP method */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  
  /** Request headers */
  headers?: Record<string, string>;
  
  /** Request body (for POST/PUT/PATCH) */
  body?: any;
}
