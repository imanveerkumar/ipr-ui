import { Injectable, signal } from '@angular/core';

/**
 * Global Loader Service
 * 
 * Provides a centralized way to show/hide the global loading spinner.
 * Use this for:
 * - Route navigation (automatic via GlobalLoaderComponent)
 * - API calls that need a full-screen loader
 * - Long-running operations
 */
@Injectable({
  providedIn: 'root'
})
export class GlobalLoaderService {
  private _isLoading = signal(false);
  private _statusText = signal('Processing');
  private _loaderKey = signal<string | null>(null);
  
  /** Read-only signal for loading state */
  readonly isLoading = this._isLoading.asReadonly();
  
  /** Read-only signal for status text */
  readonly statusText = this._statusText.asReadonly();
  
  /** Track active loading keys to prevent conflicts */
  private activeKeys = new Set<string>();
  
  /** Minimum display time to prevent flicker (ms) */
  private minDisplayTime = 300;
  
  /** Track when loader was shown */
  private showStartTime = 0;

  constructor() {}

  /**
   * Show the global loader
   * @param statusText Optional text to display (default: 'Processing')
   * @param key Optional key to prevent duplicate shows
   * @returns true if loader was shown, false if already shown with same key
   */
  show(statusText: string = 'Processing', key?: string): boolean {
    // If key is provided, check if already active
    if (key) {
      if (this.activeKeys.has(key)) {
        return false;
      }
      this.activeKeys.add(key);
      this._loaderKey.set(key);
    }
    
    this.showStartTime = Date.now();
    this._statusText.set(statusText);
    this._isLoading.set(true);
    
    return true;
  }

  /**
   * Hide the global loader
   * @param key Optional key that was used to show the loader
   * @param forceImmediate If true, hide immediately without minimum display time
   */
  async hide(key?: string, forceImmediate = false): Promise<void> {
    // If key is provided, remove it from active keys
    if (key) {
      this.activeKeys.delete(key);
      
      // Only hide if no other keys are active
      if (this.activeKeys.size > 0) {
        return;
      }
    }
    
    // Ensure minimum display time to prevent flicker
    if (!forceImmediate) {
      const elapsed = Date.now() - this.showStartTime;
      const remaining = this.minDisplayTime - elapsed;
      
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
      }
    }
    
    this._isLoading.set(false);
    this._loaderKey.set(null);
  }

  /**
   * Force hide the loader immediately, clearing all active keys
   */
  forceHide(): void {
    this.activeKeys.clear();
    this._isLoading.set(false);
    this._loaderKey.set(null);
  }

  /**
   * Execute an async operation with the loader shown
   * @param operation The async operation to execute
   * @param statusText Text to display during operation
   * @param key Optional key to prevent duplicate operations
   * @returns The result of the operation
   */
  async withLoader<T>(
    operation: () => Promise<T>,
    statusText: string = 'Processing',
    key?: string
  ): Promise<T> {
    const operationKey = key || `op-${Date.now()}`;
    
    this.show(statusText, operationKey);
    
    try {
      const result = await operation();
      return result;
    } finally {
      await this.hide(operationKey);
    }
  }

  /**
   * Check if a specific key is currently loading
   */
  isKeyLoading(key: string): boolean {
    return this.activeKeys.has(key);
  }

  /**
   * Get count of active loading operations
   */
  get activeCount(): number {
    return this.activeKeys.size;
  }
}
