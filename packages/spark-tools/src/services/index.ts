/**
 * Service Registry
 * 
 * Central export point for all API services.
 * This file will be extended as more services are added.
 * 
 * @example
 * ```typescript
 * import { BaseApiService } from '@packages/frontend-utils/services';
 * 
 * class UserService extends BaseApiService {
 *   constructor() {
 *     super('nexus');
 *   }
 * }
 * ```
 */

// Export base service and configuration
export { BaseApiService } from './base/BaseApiService';
export { API_CONFIG, getApiBaseUrl, getAuthHeaders } from './base/config';
export type { ApiRequestOptions } from './base/BaseApiService';

