/**
 * Tests for BaseApiService
 * 
 * Note: These are basic structural tests. Expand with more comprehensive
 * tests including mocked API calls
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BaseApiService } from '../base/BaseApiService';
import { API_CONFIG } from '../base/config';

// Create a concrete test implementation
class TestService extends BaseApiService {
  constructor(api: 'nexus' | 'identity' = 'nexus') {
    super(api);
  }

  // Expose protected methods for testing
  public testCall(endpoint: any, options: any) {
    return this.call(endpoint, options);
  }

  public testGet(endpoint: any, options: any) {
    return this.get(endpoint, options);
  }

  public testPost(endpoint: any, body: any, options: any) {
    return this.post(endpoint, body, options);
  }

  public getBaseUrl() {
    return this.baseUrl;
  }
}

describe('BaseApiService', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService('nexus');
  });

  it('should initialize with correct base URL for nexus', () => {
    const nexusService = new TestService('nexus');
    expect(nexusService.getBaseUrl()).toBe(API_CONFIG.nexusApiBaseUrl);
  });

  it('should initialize with correct base URL for identity', () => {
    const identityService = new TestService('identity');
    expect(identityService.getBaseUrl()).toBe(API_CONFIG.identityApiBaseUrl);
  });

  it('should be an instance of BaseApiService', () => {
    expect(service).toBeInstanceOf(BaseApiService);
  });

  // More comprehensive tests would require mocking callEndpoint
  // This is left as an exercise based on your testing setup
});

describe('API_CONFIG', () => {
  it('should have correct timeout', () => {
    expect(API_CONFIG.timeout).toBe(30000);
  });

  it('should have correct retry configuration', () => {
    expect(API_CONFIG.retry.maxAttempts).toBe(3);
    expect(API_CONFIG.retry.baseDelay).toBe(1000);
  });

  it('should have default headers', () => {
    expect(API_CONFIG.defaultHeaders).toHaveProperty('Content-Type', 'application/json');
  });
});
