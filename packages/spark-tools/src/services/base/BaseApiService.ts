/**
 * Base API Service
 * 
 * Abstract base class for all API services.
 * Provides common functionality for API communication including:
 * - Type-safe API calls using contracts
 * - Automatic error handling and transformation
 * - Request/response interceptors
 * - Retry logic for transient failures
 * 
 * All domain-specific services should extend this class.
 */

import { callEndpoint } from '@packages/typed-rest';
import { 
  processError, 
  logError, 
  shouldRetry, 
  getRetryDelay,
  ApiError,
} from '../../errors';
import { API_CONFIG } from './config';

/**
 * Type helper to extract the contract type
 */
type Contract = any; // This will be typed by the actual contract

/**
 * Type helper to extract response data type from a contract
 */
type ExtractResponseData<T> = T extends { response: { 200: { data: infer D } } } 
  ? D 
  : any;

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  /** Parameters for the request (path params, query params, body) */
  params?: any;
  query?: any;
  body?: any;
  
  /** Authentication token */
  token?: string;
  
  /** Custom headers */
  headers?: Record<string, string>;
  
  /** Whether to retry on failure */
  retry?: boolean;
  
  /** Custom timeout for this request */
  timeout?: number;
  
  /** Whether to log errors (default: true) */
  logErrors?: boolean;
}

/**
 * Abstract base service class
 * 
 * @example
 * ```typescript
 * export class UserService extends BaseApiService {
 *   constructor() {
 *     super('nexus');
 *   }
 * 
 *   async getUserProfile(userId: string): Promise<UserProfile> {
 *     return this.get(
 *       contract.api.user_system.users.userId.profile.GET,
 *       { params: { userId } }
 *     );
 *   }
 * }
 * ```
 */
export abstract class BaseApiService {
  protected readonly baseUrl: string;

  /**
   * @param api - Which API this service communicates with ('nexus' or 'identity')
   */
  constructor(api: 'nexus' | 'identity' = 'nexus') {
    this.baseUrl = api === 'nexus' 
      ? API_CONFIG.nexusApiBaseUrl 
      : API_CONFIG.identityApiBaseUrl;
  }

  /**
   * Make a type-safe API call
   * 
   * @param endpoint - The contract endpoint to call
   * @param options - Request options
   * @returns The response data
   * @throws ApiError if the request fails
   */
  protected async call<T extends Contract>(
    endpoint: T,
    options: ApiRequestOptions = {}
  ): Promise<any> {
    const {
      params,
      query,
      body,
      token,
      headers,
      retry = true,
      timeout = API_CONFIG.timeout,
      logErrors = true,
    } = options;

    let lastError: ApiError | null = null;
    const maxAttempts = retry ? API_CONFIG.retry.maxAttempts : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Make the API call
        const result = await this.makeRequest(endpoint, {
          params,
          query,
          body,
          token,
          headers,
          timeout,
        });

        // Success! Return the data
        if (result.status === 200 || result.status === 201) {
          return result.body.data || result.body;
        }

        // Non-success status, process as error
        throw processError(result);
      } catch (error) {
        const apiError = processError(error);
        lastError = apiError;

        // Log the error if enabled
        if (logErrors) {
          logError(apiError, `${this.constructor.name}.call (attempt ${attempt}/${maxAttempts})`);
        }

        // Check if we should retry
        if (attempt < maxAttempts && shouldRetry(apiError, attempt)) {
          const delay = getRetryDelay(attempt);
          await this.sleep(delay);
          continue;
        }

        // No more retries, throw the error
        throw apiError;
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || processError('Unknown error');
  }

  /**
   * Make the actual HTTP request using callEndpoint
   * Can be overridden by subclasses for custom behavior
   */
  protected async makeRequest<T extends Contract>(
    endpoint: T,
    options: {
      params?: any;
      query?: any;
      body?: any;
      token?: string;
      headers?: Record<string, string>;
      timeout?: number;
    }
  ): Promise<any> {
    const { params, query, body, token, headers, timeout } = options;

    // Build the request options
    const requestOptions: any = {};

    if (params) requestOptions.params = params;
    if (query) requestOptions.query = query;
    if (body) requestOptions.body = body;
    if (headers) requestOptions.headers = headers;

    // Add authorization header if token provided
    if (token) {
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Call the endpoint
    return await callEndpoint(this.baseUrl, endpoint as any, requestOptions);
  }

  /**
   * Convenience method for GET requests
   */
  protected async get<T extends Contract>(
    endpoint: T,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ): Promise<any> {
    return this.call(endpoint, options);
  }

  /**
   * Convenience method for POST requests
   */
  protected async post<T extends Contract>(
    endpoint: T,
    body: any,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ): Promise<any> {
    return this.call(endpoint, { ...options, body });
  }

  /**
   * Convenience method for PUT requests
   */
  protected async put<T extends Contract>(
    endpoint: T,
    body: any,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ): Promise<any> {
    return this.call(endpoint, { ...options, body });
  }

  /**
   * Convenience method for PATCH requests
   */
  protected async patch<T extends Contract>(
    endpoint: T,
    body: any,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ): Promise<any> {
    return this.call(endpoint, { ...options, body });
  }

  /**
   * Convenience method for DELETE requests
   */
  protected async delete<T extends Contract>(
    endpoint: T,
    options: Omit<ApiRequestOptions, 'body'> = {}
  ): Promise<any> {
    return this.call(endpoint, options);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Hook called before each request
   * Subclasses can override this for custom logic (e.g., adding tokens)
   */
  protected async beforeRequest?(options: ApiRequestOptions): Promise<ApiRequestOptions>;

  /**
   * Hook called after each successful response
   * Subclasses can override this for custom logic (e.g., caching)
   */
  protected async afterResponse?<T>(data: T): Promise<T>;

  /**
   * Hook called when an error occurs
   * Subclasses can override this for custom error handling
   */
  protected async onError?(error: ApiError): Promise<void>;
}
