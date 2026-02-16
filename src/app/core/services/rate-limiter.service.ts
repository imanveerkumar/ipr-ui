import { Injectable, signal } from '@angular/core';

/**
 * Rate Limiter Service
 * 
 * Implements client-side rate limiting using multiple algorithms:
 * - Token Bucket: For bursty traffic with rate limiting
 * - Sliding Window: For smooth rate limiting
 * - Fixed Window: For simple time-based limiting
 * 
 * This helps prevent API flooding from the client side and provides
 * a better user experience by failing fast rather than waiting for
 * server-side rate limit errors.
 */

export type RateLimitAlgorithm = 'token-bucket' | 'sliding-window' | 'fixed-window';

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Algorithm to use (default: sliding-window) */
  algorithm?: RateLimitAlgorithm;
  /** For token bucket: tokens to add per interval */
  refillRate?: number;
  /** For token bucket: refill interval in ms */
  refillInterval?: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
  refillInterval: number;
}

interface SlidingWindow {
  requests: number[];
  windowMs: number;
  maxRequests: number;
}

interface FixedWindow {
  count: number;
  windowStart: number;
  windowMs: number;
  maxRequests: number;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {
  private tokenBuckets = new Map<string, TokenBucket>();
  private slidingWindows = new Map<string, SlidingWindow>();
  private fixedWindows = new Map<string, FixedWindow>();
  
  /** Signal for current rate limit status across all keys */
  private _isRateLimited = signal(false);
  readonly isRateLimited = this._isRateLimited.asReadonly();

  /** Default configurations for common use cases */
  static readonly PRESETS = {
    /** For search/autocomplete requests */
    SEARCH: {
      maxRequests: 10,
      windowMs: 1000,
      algorithm: 'sliding-window' as RateLimitAlgorithm
    },
    /** For standard API calls */
    STANDARD: {
      maxRequests: 30,
      windowMs: 10000,
      algorithm: 'sliding-window' as RateLimitAlgorithm
    },
    /** For expensive operations (payments, uploads) */
    STRICT: {
      maxRequests: 5,
      windowMs: 60000,
      algorithm: 'fixed-window' as RateLimitAlgorithm
    },
    /** For bursty operations with gradual recovery */
    BURSTY: {
      maxRequests: 20,
      windowMs: 10000,
      algorithm: 'token-bucket' as RateLimitAlgorithm,
      refillRate: 2,
      refillInterval: 1000
    }
  } as const;

  constructor() {
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request is allowed and consume a token/slot
   */
  checkAndConsume(key: string, config: RateLimitConfig): RateLimitStatus {
    const algorithm = config.algorithm || 'sliding-window';
    
    switch (algorithm) {
      case 'token-bucket':
        return this.checkTokenBucket(key, config);
      case 'sliding-window':
        return this.checkSlidingWindow(key, config);
      case 'fixed-window':
        return this.checkFixedWindow(key, config);
      default:
        return this.checkSlidingWindow(key, config);
    }
  }

  /**
   * Check rate limit without consuming
   */
  check(key: string, config: RateLimitConfig): RateLimitStatus {
    const algorithm = config.algorithm || 'sliding-window';
    
    switch (algorithm) {
      case 'token-bucket':
        return this.peekTokenBucket(key, config);
      case 'sliding-window':
        return this.peekSlidingWindow(key, config);
      case 'fixed-window':
        return this.peekFixedWindow(key, config);
      default:
        return this.peekSlidingWindow(key, config);
    }
  }

  /**
   * Wait until rate limit allows the request
   */
  async waitForSlot(key: string, config: RateLimitConfig, maxWaitMs: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      const status = this.check(key, config);
      
      if (status.allowed) {
        this.checkAndConsume(key, config);
        return true;
      }
      
      const waitTime = Math.min(status.retryAfter || 100, maxWaitMs - (Date.now() - startTime));
      if (waitTime <= 0) break;
      
      await this.delay(waitTime);
    }
    
    return false;
  }

  /**
   * Token Bucket Algorithm Implementation
   */
  private checkTokenBucket(key: string, config: RateLimitConfig): RateLimitStatus {
    const now = Date.now();
    let bucket = this.tokenBuckets.get(key);
    
    if (!bucket) {
      bucket = {
        tokens: config.maxRequests,
        lastRefill: now,
        maxTokens: config.maxRequests,
        refillRate: config.refillRate || Math.ceil(config.maxRequests / (config.windowMs / 1000)),
        refillInterval: config.refillInterval || 1000
      };
      this.tokenBuckets.set(key, bucket);
    }

    // Refill tokens
    const elapsed = now - bucket.lastRefill;
    const refillCount = Math.floor(elapsed / bucket.refillInterval) * bucket.refillRate;
    if (refillCount > 0) {
      bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + refillCount);
      bucket.lastRefill = now;
    }

    const allowed = bucket.tokens >= 1;
    
    if (allowed) {
      bucket.tokens -= 1;
    }

    const retryAfter = allowed ? undefined : 
      Math.ceil((1 - bucket.tokens) / bucket.refillRate * bucket.refillInterval);

    this.updateRateLimitedStatus();

    return {
      allowed,
      remaining: Math.floor(bucket.tokens),
      resetAt: now + bucket.refillInterval,
      retryAfter
    };
  }

  private peekTokenBucket(key: string, config: RateLimitConfig): RateLimitStatus {
    const bucket = this.tokenBuckets.get(key);
    const now = Date.now();
    
    if (!bucket) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: now + (config.refillInterval || 1000)
      };
    }

    // Calculate current tokens without modifying
    const elapsed = now - bucket.lastRefill;
    const refillCount = Math.floor(elapsed / bucket.refillInterval) * bucket.refillRate;
    const currentTokens = Math.min(bucket.maxTokens, bucket.tokens + refillCount);

    return {
      allowed: currentTokens >= 1,
      remaining: Math.floor(currentTokens),
      resetAt: now + bucket.refillInterval,
      retryAfter: currentTokens >= 1 ? undefined : 
        Math.ceil((1 - currentTokens) / bucket.refillRate * bucket.refillInterval)
    };
  }

  /**
   * Sliding Window Algorithm Implementation
   */
  private checkSlidingWindow(key: string, config: RateLimitConfig): RateLimitStatus {
    const now = Date.now();
    let window = this.slidingWindows.get(key);
    
    if (!window) {
      window = {
        requests: [],
        windowMs: config.windowMs,
        maxRequests: config.maxRequests
      };
      this.slidingWindows.set(key, window);
    }

    // Remove expired requests
    const windowStart = now - config.windowMs;
    window.requests = window.requests.filter(ts => ts > windowStart);

    const allowed = window.requests.length < config.maxRequests;
    
    if (allowed) {
      window.requests.push(now);
    }

    const remaining = Math.max(0, config.maxRequests - window.requests.length);
    const oldestRequest = window.requests[0];
    const resetAt = oldestRequest ? oldestRequest + config.windowMs : now + config.windowMs;
    const retryAfter = allowed ? undefined : resetAt - now;

    this.updateRateLimitedStatus();

    return {
      allowed,
      remaining,
      resetAt,
      retryAfter
    };
  }

  private peekSlidingWindow(key: string, config: RateLimitConfig): RateLimitStatus {
    const window = this.slidingWindows.get(key);
    const now = Date.now();
    
    if (!window) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: now + config.windowMs
      };
    }

    const windowStart = now - config.windowMs;
    const validRequests = window.requests.filter(ts => ts > windowStart);
    const remaining = Math.max(0, config.maxRequests - validRequests.length);
    const oldestRequest = validRequests[0];

    return {
      allowed: validRequests.length < config.maxRequests,
      remaining,
      resetAt: oldestRequest ? oldestRequest + config.windowMs : now + config.windowMs,
      retryAfter: validRequests.length < config.maxRequests ? undefined : 
        (oldestRequest ? oldestRequest + config.windowMs - now : 0)
    };
  }

  /**
   * Fixed Window Algorithm Implementation
   */
  private checkFixedWindow(key: string, config: RateLimitConfig): RateLimitStatus {
    const now = Date.now();
    let window = this.fixedWindows.get(key);
    
    if (!window) {
      window = {
        count: 0,
        windowStart: now,
        windowMs: config.windowMs,
        maxRequests: config.maxRequests
      };
      this.fixedWindows.set(key, window);
    }

    // Reset window if expired
    if (now - window.windowStart >= config.windowMs) {
      window.count = 0;
      window.windowStart = now;
    }

    const allowed = window.count < config.maxRequests;
    
    if (allowed) {
      window.count++;
    }

    const remaining = Math.max(0, config.maxRequests - window.count);
    const resetAt = window.windowStart + config.windowMs;
    const retryAfter = allowed ? undefined : resetAt - now;

    this.updateRateLimitedStatus();

    return {
      allowed,
      remaining,
      resetAt,
      retryAfter
    };
  }

  private peekFixedWindow(key: string, config: RateLimitConfig): RateLimitStatus {
    const window = this.fixedWindows.get(key);
    const now = Date.now();
    
    if (!window) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: now + config.windowMs
      };
    }

    // Check if window would be reset
    if (now - window.windowStart >= config.windowMs) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: now + config.windowMs
      };
    }

    return {
      allowed: window.count < config.maxRequests,
      remaining: Math.max(0, config.maxRequests - window.count),
      resetAt: window.windowStart + config.windowMs,
      retryAfter: window.count < config.maxRequests ? undefined : 
        window.windowStart + config.windowMs - now
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.tokenBuckets.delete(key);
    this.slidingWindows.delete(key);
    this.fixedWindows.delete(key);
    this.updateRateLimitedStatus();
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.tokenBuckets.clear();
    this.slidingWindows.clear();
    this.fixedWindows.clear();
    this._isRateLimited.set(false);
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): { type: string; data: any } | null {
    if (this.tokenBuckets.has(key)) {
      return { type: 'token-bucket', data: this.tokenBuckets.get(key) };
    }
    if (this.slidingWindows.has(key)) {
      return { type: 'sliding-window', data: this.slidingWindows.get(key) };
    }
    if (this.fixedWindows.has(key)) {
      return { type: 'fixed-window', data: this.fixedWindows.get(key) };
    }
    return null;
  }

  /**
   * Update the global rate limited status
   */
  private updateRateLimitedStatus(): void {
    // Check if any bucket/window is at capacity
    let isLimited = false;

    for (const bucket of this.tokenBuckets.values()) {
      if (bucket.tokens < 1) {
        isLimited = true;
        break;
      }
    }

    if (!isLimited) {
      const now = Date.now();
      for (const window of this.slidingWindows.values()) {
        const validRequests = window.requests.filter(ts => ts > now - window.windowMs);
        if (validRequests.length >= window.maxRequests) {
          isLimited = true;
          break;
        }
      }
    }

    if (!isLimited) {
      for (const window of this.fixedWindows.values()) {
        if (window.count >= window.maxRequests) {
          isLimited = true;
          break;
        }
      }
    }

    this._isRateLimited.set(isLimited);
  }

  /**
   * Cleanup old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5 minutes

    // Cleanup sliding windows
    for (const [key, window] of this.slidingWindows.entries()) {
      const validRequests = window.requests.filter(ts => ts > now - window.windowMs);
      if (validRequests.length === 0) {
        this.slidingWindows.delete(key);
      }
    }

    // Cleanup fixed windows
    for (const [key, window] of this.fixedWindows.entries()) {
      if (now - window.windowStart > window.windowMs + staleThreshold) {
        this.fixedWindows.delete(key);
      }
    }

    // Cleanup token buckets that are fully refilled and stale
    for (const [key, bucket] of this.tokenBuckets.entries()) {
      if (bucket.tokens >= bucket.maxTokens && now - bucket.lastRefill > staleThreshold) {
        this.tokenBuckets.delete(key);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
