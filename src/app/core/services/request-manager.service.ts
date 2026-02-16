import { Injectable, signal } from '@angular/core';

/**
 * Request Manager Service
 * 
 * Provides production-grade request management including:
 * - Request deduplication (prevents duplicate in-flight requests)
 * - Request throttling (limits request frequency)
 * - Automatic retry with exponential backoff
 * - Request cancellation via AbortController
 * - Loading state management
 */

export interface RequestConfig {
  /** Unique key to identify the request for deduplication */
  key: string;
  /** Time to live for cached responses in ms (default: 0 = no caching) */
  cacheTtl?: number;
  /** Whether to deduplicate concurrent requests with same key (default: true) */
  deduplicate?: boolean;
  /** Minimum time between requests with same key in ms (default: 0) */
  throttleMs?: number;
  /** Maximum number of retries on failure (default: 0) */
  maxRetries?: number;
  /** Base delay for exponential backoff in ms (default: 1000) */
  retryDelay?: number;
}

interface CachedResponse<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  abortController: AbortController;
  timestamp: number;
}

interface ThrottleEntry {
  lastExecuted: number;
  pendingExecution?: {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    executor: (signal: AbortSignal) => Promise<any>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {
  /** Cache for responses */
  private cache = new Map<string, CachedResponse<any>>();
  
  /** Map of pending/in-flight requests */
  private pendingRequests = new Map<string, PendingRequest<any>>();
  
  /** Throttle tracking */
  private throttleMap = new Map<string, ThrottleEntry>();
  
  /** Active request count signal for UI feedback */
  private _activeRequests = signal(0);
  readonly activeRequests = this._activeRequests.asReadonly();
  
  /** Map of blocked request keys (for rate limiting) */
  private blockedKeys = new Set<string>();

  constructor() {
    // Cleanup expired cache entries periodically
    setInterval(() => this.cleanupExpiredCache(), 60000);
  }

  /**
   * Execute a request with deduplication, throttling, and caching
   */
  async execute<T>(
    executor: (signal: AbortSignal) => Promise<T>,
    config: RequestConfig
  ): Promise<T> {
    const {
      key,
      cacheTtl = 0,
      deduplicate = true,
      throttleMs = 0,
      maxRetries = 0,
      retryDelay = 1000
    } = config;

    // Check if request is blocked (rate limited)
    if (this.blockedKeys.has(key)) {
      throw new Error(`Request "${key}" is temporarily blocked due to rate limiting`);
    }

    // Check cache first
    if (cacheTtl > 0) {
      const cached = this.getCached<T>(key);
      if (cached !== null) {
        return cached;
      }
    }

    // Check for pending duplicate request
    if (deduplicate && this.pendingRequests.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return this.pendingRequests.get(key)!.promise;
    }

    // Apply throttling
    if (throttleMs > 0) {
      const canExecute = await this.checkThrottle(key, throttleMs);
      if (!canExecute) {
        return this.waitForThrottle<T>(key, executor);
      }
    }

    // Execute the request
    return this.executeWithRetry(executor, key, cacheTtl, maxRetries, retryDelay);
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    executor: (signal: AbortSignal) => Promise<T>,
    key: string,
    cacheTtl: number,
    maxRetries: number,
    retryDelay: number,
    attempt: number = 0
  ): Promise<T> {
    const abortController = new AbortController();
    
    const promise = (async () => {
      this._activeRequests.update(count => count + 1);
      
      try {
        const result = await executor(abortController.signal);
        
        // Cache the result if TTL is set
        if (cacheTtl > 0) {
          this.setCache(key, result, cacheTtl);
        }
        
        // Update throttle timestamp
        this.updateThrottleTimestamp(key);
        
        return result;
      } catch (error: any) {
        // Don't retry if aborted
        if (error.name === 'AbortError') {
          throw error;
        }
        
        // Check if we should retry
        if (attempt < maxRetries && this.shouldRetry(error)) {
          const delay = retryDelay * Math.pow(2, attempt);
          console.log(`🔁 Retrying request "${key}" in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          
          await this.delay(delay);
          return this.executeWithRetry(executor, key, cacheTtl, maxRetries, retryDelay, attempt + 1);
        }
        
        throw error;
      } finally {
        this._activeRequests.update(count => Math.max(0, count - 1));
        this.pendingRequests.delete(key);
      }
    })();

    // Store pending request
    this.pendingRequests.set(key, {
      promise,
      abortController,
      timestamp: Date.now()
    });

    return promise;
  }

  /**
   * Check if a request can execute based on throttle settings
   */
  private checkThrottle(key: string, throttleMs: number): boolean {
    const entry = this.throttleMap.get(key);
    if (!entry) {
      this.throttleMap.set(key, { lastExecuted: 0 });
      return true;
    }

    const elapsed = Date.now() - entry.lastExecuted;
    return elapsed >= throttleMs;
  }

  /**
   * Wait for throttle period to pass, coalescing multiple waiting requests
   */
  private waitForThrottle<T>(
    key: string,
    executor: (signal: AbortSignal) => Promise<T>
  ): Promise<T> {
    const entry = this.throttleMap.get(key)!;
    
    // If there's already a pending execution, return its promise
    if (entry.pendingExecution) {
      return new Promise((resolve, reject) => {
        const originalResolve = entry.pendingExecution!.resolve;
        const originalReject = entry.pendingExecution!.reject;
        
        entry.pendingExecution!.resolve = (value) => {
          originalResolve(value);
          resolve(value);
        };
        entry.pendingExecution!.reject = (reason) => {
          originalReject(reason);
          reject(reason);
        };
        // Update executor to latest
        entry.pendingExecution!.executor = executor;
      });
    }

    // Create new pending execution
    return new Promise((resolve, reject) => {
      const elapsed = Date.now() - entry.lastExecuted;
      const waitTime = Math.max(0, this.getThrottleMs(key) - elapsed);
      
      entry.pendingExecution = {
        resolve,
        reject,
        executor
      };

      setTimeout(async () => {
        try {
          const pending = entry.pendingExecution!;
          entry.pendingExecution = undefined;
          
          const abortController = new AbortController();
          const result = await pending.executor(abortController.signal);
          this.updateThrottleTimestamp(key);
          pending.resolve(result);
        } catch (error) {
          entry.pendingExecution?.reject(error);
        }
      }, waitTime);
    });
  }

  private getThrottleMs(key: string): number {
    // Default throttle - can be enhanced to store per-key throttle values
    return 300;
  }

  /**
   * Update the last executed timestamp for throttling
   */
  private updateThrottleTimestamp(key: string): void {
    const entry = this.throttleMap.get(key);
    if (entry) {
      entry.lastExecuted = Date.now();
    } else {
      this.throttleMap.set(key, { lastExecuted: Date.now() });
    }
  }

  /**
   * Check if an error is retryable
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx status codes
    if (!error.status) return true; // Network error
    return error.status >= 500 && error.status < 600;
  }

  /**
   * Get cached response if valid
   */
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    console.log(`📦 Using cached response for: ${key}`);
    return cached.data;
  }

  /**
   * Cache a response
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  /**
   * Clear cache for a specific key or all keys matching a pattern
   */
  clearCache(keyOrPattern?: string | RegExp): void {
    if (!keyOrPattern) {
      this.cache.clear();
      return;
    }

    if (typeof keyOrPattern === 'string') {
      this.cache.delete(keyOrPattern);
    } else {
      for (const key of this.cache.keys()) {
        if (keyOrPattern.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Cancel a pending request
   */
  cancelRequest(key: string): boolean {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      pending.abortController.abort();
      this.pendingRequests.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Cancel all pending requests matching a pattern
   */
  cancelRequests(pattern: RegExp): number {
    let cancelled = 0;
    for (const key of this.pendingRequests.keys()) {
      if (pattern.test(key)) {
        this.cancelRequest(key);
        cancelled++;
      }
    }
    return cancelled;
  }

  /**
   * Block a request key temporarily (for rate limiting)
   */
  blockKey(key: string, durationMs: number): void {
    this.blockedKeys.add(key);
    setTimeout(() => this.blockedKeys.delete(key), durationMs);
  }

  /**
   * Check if a request is pending
   */
  isPending(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  /**
   * Get count of active requests
   */
  getActiveRequestCount(): number {
    return this._activeRequests();
  }

  /**
   * Cleanup expired cache entries
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a request key from method and endpoint
   */
  static generateKey(method: string, endpoint: string, body?: any): string {
    const bodyHash = body ? this.hashObject(body) : '';
    return `${method}:${endpoint}${bodyHash ? ':' + bodyHash : ''}`;
  }

  /**
   * Simple hash function for objects
   */
  private static hashObject(obj: any): string {
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}
