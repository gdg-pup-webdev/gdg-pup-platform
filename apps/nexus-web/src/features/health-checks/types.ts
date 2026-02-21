/**
 * Type definitions for API Health Checks feature
 *
 * This feature monitors the health status of backend APIs:
 * - Nexus API (user data, events, etc.)
 * - Identity API (authentication, card management)
 */

/**
 * Health check response structure
 * Returned by both Nexus and Identity APIs
 */
export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp?: string;
  version?: string;
}

/**
 * API identifiers for health checks
 */
export type ApiType = "nexus" | "identity";

/**
 * Health check status types
 */
export type HealthStatus = "healthy" | "unhealthy" | "unknown";

/**
 * Error types specific to health check operations
 */
export type HealthCheckError =
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

/**
 * Custom error class for health check errors
 */
export class HealthCheckException extends Error {
  constructor(
    public type: HealthCheckError,
    message: string,
  ) {
    super(message);
    this.name = "HealthCheckException";
  }
}
