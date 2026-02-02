import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import { RequestManagerService, RequestConfig } from './request-manager.service';
import { RateLimiterService, RateLimitConfig } from './rate-limiter.service';

/**
 * Request options for API calls with rate limiting and deduplication
 */
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  /** Request configuration for deduplication and caching */
  requestConfig?: Partial<RequestConfig>;
  /** Rate limit configuration */
  rateLimitConfig?: RateLimitConfig;
  /** Skip rate limiting for this request */
  skipRateLimit?: boolean;
  /** Skip request deduplication for this request */
  skipDeduplication?: boolean;
  /** Custom request key (auto-generated if not provided) */
  requestKey?: string;
}

/** Default rate limit configs for different request types */
const DEFAULT_RATE_LIMITS = {
  GET: { maxRequests: 30, windowMs: 10000, algorithm: 'sliding-window' as const },
  POST: { maxRequests: 15, windowMs: 10000, algorithm: 'sliding-window' as const },
  PUT: { maxRequests: 15, windowMs: 10000, algorithm: 'sliding-window' as const },
  PATCH: { maxRequests: 15, windowMs: 10000, algorithm: 'sliding-window' as const },
  DELETE: { maxRequests: 10, windowMs: 10000, algorithm: 'sliding-window' as const },
  SEARCH: { maxRequests: 10, windowMs: 1000, algorithm: 'sliding-window' as const },
  UPLOAD: { maxRequests: 5, windowMs: 60000, algorithm: 'fixed-window' as const },
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private requestManager = inject(RequestManagerService);
  private rateLimiter = inject(RateLimiterService);

  constructor() {}

  private async getAuthHeaders(customHeaders?: Record<string, string>): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(customHeaders || {}),
    };

    // Get token from Clerk (we'll inject this later to avoid circular dependency)
    const token = await this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 API Service - Token added to headers');
    } else {
      console.warn('⚠️ API Service - No token available');
    }

    return headers;
  }

  private tokenGetter: (() => Promise<string | null>) | null = null;

  setTokenGetter(getter: () => Promise<string | null>) {
    this.tokenGetter = getter;
  }

  private async getToken(): Promise<string | null> {
    if (this.tokenGetter) {
      try {
        // Add timeout to token retrieval to prevent indefinite hanging
        const tokenPromise = this.tokenGetter();
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => {
            console.warn('⚠️ API Service - Token retrieval timed out');
            resolve(null);
          }, 5000)
        );
        
        return await Promise.race([tokenPromise, timeoutPromise]);
      } catch (e) {
        console.error('Error getting token:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Check rate limit and throw if exceeded
   */
  private checkRateLimit(method: keyof typeof DEFAULT_RATE_LIMITS, endpoint: string, config?: RateLimitConfig, skip?: boolean): void {
    if (skip) return;

    const rateLimitConfig = config || DEFAULT_RATE_LIMITS[method] || DEFAULT_RATE_LIMITS.GET;
    const key = `rate:${method}:${this.getEndpointCategory(endpoint)}`;
    
    const status = this.rateLimiter.checkAndConsume(key, rateLimitConfig);
    
    if (!status.allowed) {
      console.warn(`⚠️ Rate limit exceeded for ${method} ${endpoint}. Retry after ${status.retryAfter}ms`);
      throw new RateLimitError(
        `Rate limit exceeded. Please try again in ${Math.ceil((status.retryAfter || 1000) / 1000)} seconds.`,
        status.retryAfter || 1000
      );
    }
  }

  /**
   * Get endpoint category for rate limiting
   */
  private getEndpointCategory(endpoint: string): string {
    // Group similar endpoints for rate limiting
    const parts = endpoint.split('/').filter(Boolean);
    if (parts.length >= 1) {
      // Return first path segment (e.g., 'products', 'stores', 'orders')
      return parts[0];
    }
    return 'general';
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Check rate limit
    this.checkRateLimit('GET', endpoint, options?.rateLimitConfig, options?.skipRateLimit);
    
    const requestKey = options?.requestKey || RequestManagerService.generateKey('GET', endpoint);
    const headers = await this.getAuthHeaders(options?.headers);
    
    // Use request manager for deduplication and caching
    return this.requestManager.execute<ApiResponse<T>>(
      async (signal) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        // Link external signal to our controller
        signal.addEventListener('abort', () => controller.abort());
        
        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers,
            signal: controller.signal,
          });
          return response.json();
        } finally {
          clearTimeout(timeoutId);
        }
      },
      {
        key: requestKey,
        deduplicate: options?.skipDeduplication !== true,
        cacheTtl: options?.requestConfig?.cacheTtl || 0,
        throttleMs: options?.requestConfig?.throttleMs || 0,
        ...options?.requestConfig
      }
    );
  }

  async post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Check rate limit
    this.checkRateLimit('POST', endpoint, options?.rateLimitConfig, options?.skipRateLimit);
    
    const requestKey = options?.requestKey || RequestManagerService.generateKey('POST', endpoint, body);
    const headers = await this.getAuthHeaders(options?.headers);
    
    // Use request manager for deduplication
    return this.requestManager.execute<ApiResponse<T>>(
      async (signal) => {
        const controller = new AbortController();
        signal.addEventListener('abort', () => controller.abort());
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        return response.json();
      },
      {
        key: requestKey,
        deduplicate: options?.skipDeduplication !== true,
        ...options?.requestConfig
      }
    );
  }

  async put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Check rate limit
    this.checkRateLimit('PUT', endpoint, options?.rateLimitConfig, options?.skipRateLimit);
    
    const requestKey = options?.requestKey || RequestManagerService.generateKey('PUT', endpoint, body);
    const headers = await this.getAuthHeaders(options?.headers);
    
    return this.requestManager.execute<ApiResponse<T>>(
      async (signal) => {
        const controller = new AbortController();
        signal.addEventListener('abort', () => controller.abort());
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        return response.json();
      },
      {
        key: requestKey,
        deduplicate: options?.skipDeduplication !== true,
        ...options?.requestConfig
      }
    );
  }

  async patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Check rate limit
    this.checkRateLimit('PATCH', endpoint, options?.rateLimitConfig, options?.skipRateLimit);
    
    const requestKey = options?.requestKey || RequestManagerService.generateKey('PATCH', endpoint, body);
    const headers = await this.getAuthHeaders(options?.headers);
    
    return this.requestManager.execute<ApiResponse<T>>(
      async (signal) => {
        const controller = new AbortController();
        signal.addEventListener('abort', () => controller.abort());
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        return response.json();
      },
      {
        key: requestKey,
        deduplicate: options?.skipDeduplication !== true,
        ...options?.requestConfig
      }
    );
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    // Check rate limit
    this.checkRateLimit('DELETE', endpoint, options?.rateLimitConfig, options?.skipRateLimit);
    
    const requestKey = options?.requestKey || RequestManagerService.generateKey('DELETE', endpoint);
    const headers = await this.getAuthHeaders(options?.headers);
    
    return this.requestManager.execute<ApiResponse<T>>(
      async (signal) => {
        const controller = new AbortController();
        signal.addEventListener('abort', () => controller.abort());
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers,
          signal: controller.signal,
        });
        return response.json();
      },
      {
        key: requestKey,
        deduplicate: options?.skipDeduplication !== true,
        ...options?.requestConfig
      }
    );
  }

  // Helper for file upload URLs
  async getUploadUrl(filename: string, contentType: string, size: number) {
    return this.post<{ fileId: string; uploadUrl: string; storageKey: string }>(
      '/files/upload-url',
      { filename, contentType, size },
      { rateLimitConfig: DEFAULT_RATE_LIMITS.UPLOAD }
    );
  }

  // Helper for direct upload to S3
  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    // Rate limit uploads
    this.checkRateLimit('UPLOAD', 's3-upload', DEFAULT_RATE_LIMITS.UPLOAD);
    
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Upload to S3 failed:', error);
      return false;
    }
  }

  // Helper for multipart form upload
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    // Rate limit uploads
    this.checkRateLimit('UPLOAD', endpoint, DEFAULT_RATE_LIMITS.UPLOAD);
    
    const token = await this.getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return response.json();
  }

  /**
   * Search-optimized GET request with aggressive rate limiting
   * Use this for autocomplete and search suggestions
   */
  async search<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.get<T>(endpoint, {
      ...options,
      rateLimitConfig: options?.rateLimitConfig || DEFAULT_RATE_LIMITS.SEARCH,
      requestConfig: {
        deduplicate: true,
        throttleMs: 100, // Throttle search requests
        cacheTtl: 5000, // Cache search results for 5 seconds
        ...options?.requestConfig
      }
    });
  }

  /**
   * Cancel a pending request by key
   */
  cancelRequest(key: string): boolean {
    return this.requestManager.cancelRequest(key);
  }

  /**
   * Cancel all pending requests matching a pattern
   */
  cancelRequests(pattern: RegExp): number {
    return this.requestManager.cancelRequests(pattern);
  }

  /**
   * Clear cached responses
   */
  clearCache(keyOrPattern?: string | RegExp): void {
    this.requestManager.clearCache(keyOrPattern);
  }

  /**
   * Check if a request is pending
   */
  isPending(key: string): boolean {
    return this.requestManager.isPending(key);
  }

  /**
   * Get the current rate limit status
   */
  get isRateLimited() {
    return this.rateLimiter.isRateLimited;
  }

  /**
   * Get count of active requests
   */
  get activeRequests() {
    return this.requestManager.activeRequests;
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}
