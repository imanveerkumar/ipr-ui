import { Injectable } from '@angular/core';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  /** Accent variant for the modal background/header. Supported: 'default' | 'danger' | 'yellow' or custom string */
  accent?: 'default' | 'danger' | 'yellow' | string;
  /** Optional: full class override for confirm button (use when you need very custom styling) */
  confirmClass?: string;
  /** Optional: override the confirm button color independent of the modal accent. Supported: 'default' | 'danger' | 'yellow' or custom string */
  confirmColor?: 'default' | 'danger' | 'yellow' | string;
}

interface InternalRequest {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private onRequest?: (req: InternalRequest) => void;

  // Internal: used by the component to subscribe
  _setHandler(handler: (req: InternalRequest) => void) {
    this.onRequest = handler;
  }

  // Show confirm dialog and return a Promise<boolean>
  confirm(options: ConfirmOptions = {}): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this.onRequest) {
        // If no handler, immediately fallback to browser confirm
        const fallback = window.confirm(options.message || 'Are you sure?');
        resolve(fallback);
        return;
      }

      this.onRequest({ options, resolve });
    });
  }
}
