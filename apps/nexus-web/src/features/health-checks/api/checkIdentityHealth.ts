/**
 * API function for checking Identity API health
 * 
 * This function calls the Identity API health endpoint to verify
 * that the API is running and responding correctly.
 */

import { callEndpoint } from '@packages/typed-rest';
import { contract as identityApiContract } from '@packages/identity-api-contracts';
import { configs } from '@/configs/servers.config';
import { HealthCheckResponse, HealthCheckException } from '../types';

/**
 * Checks the health status of the Identity API
 * 
 * @returns Promise<HealthCheckResponse> - The health status information
 * @throws {HealthCheckException} - When the health check fails
 * 
 * @example
 * ```typescript
 * try {
 *   const health = await checkIdentityHealth();
 *   console.log('Identity API is healthy:', health.status);
 * } catch (error) {
 *   if (error instanceof HealthCheckException) {
 *     console.error('Health check failed:', error.type);
 *   }
 * }
 * ```
 */
export async function checkIdentityHealth(): Promise<HealthCheckResponse> {
  try {
    // Call the Identity API health endpoint
    const result = await callEndpoint(
      configs.identityApiBaseUrl,
      identityApiContract.api.health.GET,
      {},
    );

    // Check if the response is successful (status 200)
    if (result.status === 200) {
      return result.body as HealthCheckResponse;
    }

    // Handle non-200 responses
    throw new HealthCheckException(
      'SERVER_ERROR',
      `Identity API returned status ${result.status}: ${result.body.message || 'Unknown error'}`
    );
  } catch (error) {
    // If it's already a HealthCheckException, re-throw it
    if (error instanceof HealthCheckException) {
      throw error;
    }

    // Handle network errors (fetch failures, CORS issues, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new HealthCheckException(
        'NETWORK_ERROR',
        `Failed to connect to Identity API at ${configs.identityApiBaseUrl}. Please check if the API is running.`
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new HealthCheckException(
        'TIMEOUT_ERROR',
        'Identity API health check timed out. The server may be slow or unresponsive.'
      );
    }

    // Handle unknown errors
    throw new HealthCheckException(
      'UNKNOWN_ERROR',
      `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
