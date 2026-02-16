import { Injectable, signal } from '@angular/core';

/**
 * Loading State Manager Service
 * 
 * Provides centralized loading state management for:
 * - Preventing duplicate button clicks during API operations
 * - Showing loading indicators
 * - Managing operation-specific loading states
 * - Automatic timeout handling
 */

export interface LoadingState {
  isLoading: boolean;
  startedAt: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  operationType?: string;
}

export interface OperationConfig {
  /** Maximum time for the operation in ms (default: 30000) */
  timeout?: number;
  /** Callback when operation times out */
  onTimeout?: () => void;
  /** Type of operation for categorization */
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  /** Map of loading states by key */
  private states = new Map<string, LoadingState>();
  
  /** Global loading signal */
  private _isGlobalLoading = signal(false);
  readonly isGlobalLoading = this._isGlobalLoading.asReadonly();
  
  /** Count of active operations */
  private _activeOperations = signal(0);
  readonly activeOperations = this._activeOperations.asReadonly();

  /** Map of operation-specific signals */
  private operationSignals = new Map<string, ReturnType<typeof signal<boolean>>>();

  constructor() {}

  /**
   * Start a loading operation
   * Returns false if the operation is already in progress
   */
  startLoading(key: string, config: OperationConfig = {}): boolean {
    const { timeout = 30000, onTimeout, type } = config;
    
    // Check if already loading
    if (this.isLoading(key)) {
      console.log(`⏳ Operation "${key}" is already in progress`);
      return false;
    }

    // Set up timeout
    const timeoutId = timeout > 0 ? setTimeout(() => {
      console.warn(`⚠️ Operation "${key}" timed out after ${timeout}ms`);
      this.stopLoading(key);
      onTimeout?.();
    }, timeout) : undefined;

    // Create loading state
    this.states.set(key, {
      isLoading: true,
      startedAt: Date.now(),
      timeoutId,
      operationType: type
    });

    // Update signals
    this._activeOperations.update(count => count + 1);
    this._isGlobalLoading.set(true);
    
    // Update operation-specific signal
    const opSignal = this.getOrCreateSignal(key);
    opSignal.set(true);

    return true;
  }

  /**
   * Stop a loading operation
   */
  stopLoading(key: string): void {
    const state = this.states.get(key);
    
    if (state) {
      // Clear timeout
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      
      // Remove state
      this.states.delete(key);
      
      // Update signals
      this._activeOperations.update(count => Math.max(0, count - 1));
      
      if (this.states.size === 0) {
        this._isGlobalLoading.set(false);
      }
      
      // Update operation-specific signal
      const opSignal = this.operationSignals.get(key);
      if (opSignal) {
        opSignal.set(false);
      }
    }
  }

  /**
   * Check if an operation is loading
   */
  isLoading(key: string): boolean {
    return this.states.get(key)?.isLoading ?? false;
  }

  /**
   * Get a signal for a specific operation
   */
  getLoadingSignal(key: string) {
    return this.getOrCreateSignal(key).asReadonly();
  }

  /**
   * Execute a function while managing loading state
   * Prevents duplicate executions if operation is already in progress
   */
  async withLoading<T>(
    key: string,
    fn: () => Promise<T>,
    config: OperationConfig = {}
  ): Promise<T | null> {
    if (!this.startLoading(key, config)) {
      return null;
    }

    try {
      return await fn();
    } finally {
      this.stopLoading(key);
    }
  }

  /**
   * Get all current loading states
   */
  getActiveStates(): Map<string, LoadingState> {
    return new Map(this.states);
  }

  /**
   * Get loading duration for an operation
   */
  getDuration(key: string): number | null {
    const state = this.states.get(key);
    if (!state) return null;
    return Date.now() - state.startedAt;
  }

  /**
   * Stop all loading operations (useful for cleanup)
   */
  stopAll(): void {
    for (const key of this.states.keys()) {
      this.stopLoading(key);
    }
  }

  /**
   * Stop all operations of a specific type
   */
  stopByType(type: string): void {
    for (const [key, state] of this.states.entries()) {
      if (state.operationType === type) {
        this.stopLoading(key);
      }
    }
  }

  private getOrCreateSignal(key: string) {
    let opSignal = this.operationSignals.get(key);
    if (!opSignal) {
      opSignal = signal(false);
      this.operationSignals.set(key, opSignal);
    }
    return opSignal;
  }
}

/**
 * Decorator for preventing duplicate button clicks
 * Use this decorator on component methods that should not be called
 * while already executing
 */
export function PreventDuplicateClick(keyOrFn?: string | ((target: any, args: any[]) => string)) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const loadingKeys = new Map<any, Set<string>>();

    descriptor.value = async function (...args: any[]) {
      const key = typeof keyOrFn === 'function' 
        ? keyOrFn(this, args) 
        : keyOrFn || `${target.constructor.name}.${propertyKey}`;
      
      // Get or create loading set for this instance
      if (!loadingKeys.has(this)) {
        loadingKeys.set(this, new Set());
      }
      const instanceKeys = loadingKeys.get(this)!;

      // Check if already running
      if (instanceKeys.has(key)) {
        console.log(`🚫 Prevented duplicate call to ${key}`);
        return;
      }

      instanceKeys.add(key);
      
      try {
        return await originalMethod.apply(this, args);
      } finally {
        instanceKeys.delete(key);
      }
    };

    return descriptor;
  };
}

/**
 * Debounce decorator for methods
 */
export function Debounce(ms: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const timeoutKey = Symbol('debounceTimeout');

    descriptor.value = function (...args: any[]) {
      if ((this as any)[timeoutKey]) {
        clearTimeout((this as any)[timeoutKey]);
      }

      return new Promise((resolve) => {
        (this as any)[timeoutKey] = setTimeout(async () => {
          const result = await originalMethod.apply(this, args);
          resolve(result);
        }, ms);
      });
    };

    return descriptor;
  };
}

/**
 * Throttle decorator for methods
 */
export function Throttle(ms: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const lastCallKey = Symbol('lastCall');
    const pendingKey = Symbol('pending');

    descriptor.value = async function (...args: any[]) {
      const now = Date.now();
      const lastCall = (this as any)[lastCallKey] || 0;
      const elapsed = now - lastCall;

      if (elapsed >= ms) {
        (this as any)[lastCallKey] = now;
        return originalMethod.apply(this, args);
      }

      // Store pending call
      if (!(this as any)[pendingKey]) {
        (this as any)[pendingKey] = new Promise((resolve) => {
          setTimeout(async () => {
            (this as any)[lastCallKey] = Date.now();
            (this as any)[pendingKey] = null;
            const result = await originalMethod.apply(this, args);
            resolve(result);
          }, ms - elapsed);
        });
      }

      return (this as any)[pendingKey];
    };

    return descriptor;
  };
}
