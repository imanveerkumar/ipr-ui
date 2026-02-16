import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  dismissible: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  createdAt: number;
}

export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastsSignal = signal<Toast[]>([]);
  
  /** Observable list of active toasts */
  readonly toasts = computed(() => this.toastsSignal());

  /** Show a success toast */
  success(options: ToastOptions | string): string {
    return this.show('success', options);
  }

  /** Show an error toast */
  error(options: ToastOptions | string): string {
    return this.show('error', options);
  }

  /** Show a warning toast */
  warning(options: ToastOptions | string): string {
    return this.show('warning', options);
  }

  /** Show an info toast */
  info(options: ToastOptions | string): string {
    return this.show('info', options);
  }

  /** Show a toast with custom type */
  show(type: ToastType, options: ToastOptions | string): string {
    const normalizedOptions = typeof options === 'string' 
      ? { title: options } 
      : options;

    const id = this.generateId();
    const toast: Toast = {
      id,
      type,
      title: normalizedOptions.title,
      message: normalizedOptions.message,
      duration: normalizedOptions.duration ?? DEFAULT_DURATION,
      dismissible: normalizedOptions.dismissible ?? true,
      action: normalizedOptions.action,
      createdAt: Date.now(),
    };

    // Add toast and limit to MAX_TOASTS
    this.toastsSignal.update(toasts => {
      const newToasts = [...toasts, toast];
      // Remove oldest toasts if exceeding max
      return newToasts.slice(-MAX_TOASTS);
    });

    // Auto-dismiss after duration (unless duration is 0)
    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  /** Dismiss a toast by ID */
  dismiss(id: string): void {
    this.toastsSignal.update(toasts => 
      toasts.filter(t => t.id !== id)
    );
  }

  /** Dismiss all toasts */
  dismissAll(): void {
    this.toastsSignal.set([]);
  }

  /** Parse error and show appropriate toast */
  handleError(error: unknown, fallbackMessage = 'An unexpected error occurred'): void {
    const errorInfo = this.parseError(error);
    
    this.error({
      title: errorInfo.title,
      message: errorInfo.message,
      duration: errorInfo.duration,
    });
  }

  /** Parse various error types into user-friendly messages */
  private parseError(error: unknown): { title: string; message?: string; duration: number } {
    // Handle API error responses
    if (this.isApiError(error)) {
      return {
        title: this.getErrorTitle(error.status),
        message: error.message || this.getDefaultMessage(error.status),
        duration: 6000,
      };
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        duration: 8000,
      };
    }

    // Handle abort errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        title: 'Request Cancelled',
        message: 'The request was cancelled.',
        duration: 3000,
      };
    }

    // Handle rate limit errors
    if (this.isRateLimitError(error)) {
      return {
        title: 'Too Many Requests',
        message: error.message || 'Please slow down and try again in a moment.',
        duration: 5000,
      };
    }

    // Handle generic Error objects
    if (error instanceof Error) {
      return {
        title: 'Error',
        message: error.message,
        duration: 5000,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        title: 'Error',
        message: error,
        duration: 5000,
      };
    }

    // Fallback
    return {
      title: 'Error',
      message: 'An unexpected error occurred. Please try again.',
      duration: 5000,
    };
  }

  private isApiError(error: unknown): error is { status: number; message?: string } {
    return typeof error === 'object' && error !== null && 'status' in error && typeof (error as any).status === 'number';
  }

  private isRateLimitError(error: unknown): error is { name: string; message: string; retryAfter?: number } {
    return error instanceof Error && error.name === 'RateLimitError';
  }

  private getErrorTitle(status: number): string {
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

  private getDefaultMessage(status: number): string {
    switch (status) {
      case 400: return 'The request could not be processed.';
      case 401: return 'Please sign in to continue.';
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

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
