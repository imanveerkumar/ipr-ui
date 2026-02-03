import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { ToasterService } from '../services/toaster.service';

/**
 * Global error handler that catches all unhandled errors in the application.
 * This includes:
 * - Unhandled promise rejections
 * - Exceptions thrown in component templates
 * - Errors in async operations
 * - Runtime JavaScript errors
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toasterService = inject(ToasterService);
  private ngZone = inject(NgZone);

  // Track recent errors to prevent duplicate notifications
  private recentErrors = new Map<string, number>();
  private readonly DEBOUNCE_MS = 2000;

  handleError(error: unknown): void {
    // Run inside Angular zone to ensure change detection
    this.ngZone.run(() => {
      this.processError(error);
    });
  }

  private processError(error: unknown): void {
    // Always log to console for debugging
    console.error('GlobalErrorHandler caught an error:', error);

    // Extract error details
    const errorInfo = this.extractErrorInfo(error);

    // Skip certain errors that shouldn't show toasts
    if (this.shouldSkipError(errorInfo)) {
      return;
    }

    // Deduplicate errors (prevent spam from repeated failures)
    if (this.isDuplicateError(errorInfo.key)) {
      return;
    }

    // Show error toast to user
    this.showErrorToast(errorInfo);
  }

  private extractErrorInfo(error: unknown): ErrorInfo {
    // Handle HttpErrorResponse-like objects (API errors)
    if (this.isHttpError(error)) {
      return {
        key: `http-${error.status}-${error.url || 'unknown'}`,
        title: this.getHttpErrorTitle(error.status),
        message: this.extractHttpErrorMessage(error),
        status: error.status,
        isHttpError: true,
      };
    }

    // Handle errors with status property (from ApiService)
    if (this.isApiError(error)) {
      return {
        key: `api-${error.status}-${error.message}`,
        title: this.getHttpErrorTitle(error.status),
        message: error.message,
        status: error.status,
        isHttpError: true,
      };
    }

    // Handle Rate Limit errors
    if (this.isRateLimitError(error)) {
      return {
        key: 'rate-limit',
        title: 'Too Many Requests',
        message: error.message || 'Please slow down and try again.',
        isHttpError: false,
      };
    }

    // Handle chunk loading errors (lazy loading failures)
    if (this.isChunkLoadError(error)) {
      return {
        key: 'chunk-load-error',
        title: 'Loading Error',
        message: 'Failed to load page. Please refresh to try again.',
        isHttpError: false,
      };
    }

    // Handle network errors
    if (this.isNetworkError(error)) {
      return {
        key: 'network-error',
        title: 'Network Error',
        message: 'Unable to connect. Please check your internet connection.',
        isHttpError: false,
      };
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        key: `error-${error.name}-${error.message.substring(0, 50)}`,
        title: 'Error',
        message: this.sanitizeErrorMessage(error.message),
        isHttpError: false,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        key: `string-${error.substring(0, 50)}`,
        title: 'Error',
        message: this.sanitizeErrorMessage(error),
        isHttpError: false,
      };
    }

    // Unknown error type
    return {
      key: 'unknown-error',
      title: 'Error',
      message: 'An unexpected error occurred. Please try again.',
      isHttpError: false,
    };
  }

  private shouldSkipError(errorInfo: ErrorInfo): boolean {
    // Skip 401 errors (handled by auth service)
    if (errorInfo.status === 401) {
      return true;
    }

    // Skip abort errors (user cancelled)
    if (errorInfo.message?.includes('aborted') || errorInfo.message?.includes('AbortError')) {
      return true;
    }

    // Skip errors during navigation (often benign)
    if (errorInfo.message?.includes('Navigation ID')) {
      return true;
    }

    // Skip ResizeObserver errors (browser quirk, usually harmless)
    if (errorInfo.message?.includes('ResizeObserver')) {
      return true;
    }

    return false;
  }

  private isDuplicateError(key: string): boolean {
    const now = Date.now();
    const lastOccurrence = this.recentErrors.get(key);

    if (lastOccurrence && now - lastOccurrence < this.DEBOUNCE_MS) {
      return true;
    }

    // Clean up old entries
    this.recentErrors.forEach((timestamp, errorKey) => {
      if (now - timestamp > this.DEBOUNCE_MS * 2) {
        this.recentErrors.delete(errorKey);
      }
    });

    this.recentErrors.set(key, now);
    return false;
  }

  private showErrorToast(errorInfo: ErrorInfo): void {
    this.toasterService.error({
      title: errorInfo.title,
      message: errorInfo.message,
      duration: errorInfo.isHttpError ? 6000 : 5000,
    });
  }

  // Type guards
  private isHttpError(error: unknown): error is { status: number; url?: string; error?: any; message?: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as any).status === 'number' &&
      'url' in error
    );
  }

  private isApiError(error: unknown): error is { status: number; message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      typeof (error as any).status === 'number' &&
      'message' in error &&
      typeof (error as any).message === 'string'
    );
  }

  private isRateLimitError(error: unknown): error is Error & { retryAfter?: number } {
    return error instanceof Error && error.name === 'RateLimitError';
  }

  private isChunkLoadError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('Loading chunk') ||
        error.message.includes('ChunkLoadError') ||
        error.message.includes('Failed to fetch dynamically imported module')
      );
    }
    return false;
  }

  private isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed')
      );
    }
    return false;
  }

  // Helpers
  private getHttpErrorTitle(status: number): string {
    switch (status) {
      case 400: return 'Invalid Request';
      case 401: return 'Authentication Required';
      case 403: return 'Access Denied';
      case 404: return 'Not Found';
      case 409: return 'Conflict';
      case 422: return 'Validation Error';
      case 429: return 'Too Many Requests';
      case 500: return 'Server Error';
      case 502: return 'Bad Gateway';
      case 503: return 'Service Unavailable';
      case 504: return 'Gateway Timeout';
      default: return status >= 500 ? 'Server Error' : 'Request Failed';
    }
  }

  private extractHttpErrorMessage(error: { status: number; error?: any; message?: string }): string {
    // Try to get message from nested error object (common in Angular HttpClient)
    if (error.error) {
      if (typeof error.error === 'string') {
        return this.sanitizeErrorMessage(error.error);
      }
      if (error.error.message) {
        return this.sanitizeErrorMessage(error.error.message);
      }
      if (error.error.errors && Array.isArray(error.error.errors)) {
        return error.error.errors.map((e: any) => e.message || e).join('. ');
      }
    }

    if (error.message) {
      return this.sanitizeErrorMessage(error.message);
    }

    return this.getDefaultHttpMessage(error.status);
  }

  private getDefaultHttpMessage(status: number): string {
    switch (status) {
      case 400: return 'The request could not be processed.';
      case 403: return 'You don\'t have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'This action conflicts with existing data.';
      case 422: return 'Please check your input and try again.';
      case 429: return 'Please wait a moment before trying again.';
      case 500: return 'Something went wrong on our end. Please try again.';
      case 502: return 'The server is temporarily unavailable.';
      case 503: return 'The service is currently unavailable.';
      case 504: return 'The request timed out. Please try again.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove sensitive info, stack traces, and technical jargon
    let sanitized = message
      // Remove file paths
      .replace(/\/[^\s]+\.(ts|js|html)/g, '')
      // Remove stack traces
      .replace(/at\s+\S+\s+\(\S+\)/g, '')
      // Remove line numbers
      .replace(/:\d+:\d+/g, '')
      // Remove "Error:" prefix
      .replace(/^Error:\s*/i, '')
      // Trim whitespace
      .trim();

    // Limit length
    if (sanitized.length > 200) {
      sanitized = sanitized.substring(0, 197) + '...';
    }

    // Fallback if empty after sanitization
    if (!sanitized) {
      return 'An error occurred. Please try again.';
    }

    return sanitized;
  }
}

interface ErrorInfo {
  key: string;
  title: string;
  message?: string;
  status?: number;
  isHttpError: boolean;
}
