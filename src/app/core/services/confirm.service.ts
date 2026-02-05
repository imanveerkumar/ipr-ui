import { Injectable, signal } from '@angular/core';

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
  /** If true, the modal will stay open after the user confirms and enter a pending state. Caller should call finish(true) on success or setPending(false) on failure. */
  waitForCompletion?: boolean;
}

interface InternalRequest {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private onRequest?: (req: InternalRequest) => void;
  private onClose?: () => void;

  // public pending signal that the modal observes to show spinner/disable buttons
  pending = signal(false);

  // Internal: used by the component to subscribe
  _setHandler(handler: (req: InternalRequest) => void) {
    this.onRequest = handler;
  }

  // Internal: used by the modal to register a close callback that should be invoked when the caller finishes
  _setCloseHandler(handler: () => void) {
    this.onClose = handler;
  }

  // Set pending state (show spinner + disable buttons)
  setPending(value: boolean) {
    this.pending.set(value);
  }

  // Finish the confirm (caller should call this on successful API response to close the modal)
  finish(success: boolean) {
    // Clear pending first
    this.pending.set(false);
    // Trigger modal to close
    if (this.onClose) this.onClose();
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
