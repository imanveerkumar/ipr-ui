import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService, Toast, ToastType } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notifications">
      @for (toast of toasterService.toasts(); track toast.id) {
        <div 
          class="toast" 
          [class]="'toast toast-' + toast.type"
          [class.toast-exit]="dismissingIds().has(toast.id)"
          role="alert"
          [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        >
          <!-- Icon -->
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              }
              @case ('info') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>

          <!-- Content -->
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="toast-message">{{ toast.message }}</p>
            }
            @if (toast.action) {
              <button class="toast-action" (click)="onAction(toast)">
                {{ toast.action.label }}
              </button>
            }
          </div>

          <!-- Dismiss Button -->
          @if (toast.dismissible) {
            <button 
              class="toast-dismiss" 
              (click)="dismiss(toast)"
              aria-label="Dismiss notification"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }

          <!-- Progress bar for auto-dismiss -->
          @if (toast.duration > 0) {
            <div 
              class="toast-progress"
              [style.animation-duration.ms]="toast.duration"
            ></div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      --toast-border: #111111;
      --toast-shadow: 4px 4px 0px 0px #111111;
      --toast-font: 'DM Sans', 'Inter', system-ui, sans-serif;
      
      /* Type colors matching Dashboard style */
      --success-bg: #68E079;
      --success-text: #111111;
      --success-icon: #111111;
      
      --error-bg: #FA4B28;
      --error-text: #ffffff;
      --error-icon: #ffffff;
      
      --warning-bg: #FFC60B;
      --warning-text: #111111;
      --warning-icon: #111111;
      
      --info-bg: #2B57D6;
      --info-text: #ffffff;
      --info-icon: #ffffff;
    }

    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: calc(100vw - 3rem);
      pointer-events: none;
    }

    @media (max-width: 640px) {
      .toast-container {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
        width: auto;
        max-width: none;
      }
    }

    .toast {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      border: 2px solid var(--toast-border);
      box-shadow: var(--toast-shadow);
      font-family: var(--toast-font);
      pointer-events: auto;
      animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }

    .toast-exit {
      animation: slideOut 0.2s ease-in forwards;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }

    /* Toast Type Styles */
    .toast-success {
      background: var(--success-bg);
      color: var(--success-text);
    }

    .toast-success .toast-icon {
      color: var(--success-icon);
    }

    .toast-error {
      background: var(--error-bg);
      color: var(--error-text);
    }

    .toast-error .toast-icon {
      color: var(--error-icon);
    }

    .toast-warning {
      background: var(--warning-bg);
      color: var(--warning-text);
    }

    .toast-warning .toast-icon {
      color: var(--warning-icon);
    }

    .toast-info {
      background: var(--info-bg);
      color: var(--info-text);
    }

    .toast-info .toast-icon {
      color: var(--info-icon);
    }

    /* Icon */
    .toast-icon {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      margin-top: 1px;
    }

    .toast-icon svg {
      width: 100%;
      height: 100%;
    }

    /* Content */
    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.9375rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.4;
      word-break: break-word;
    }

    .toast-message {
      font-size: 0.8125rem;
      font-weight: 500;
      margin: 0.25rem 0 0;
      opacity: 0.9;
      line-height: 1.5;
      word-break: break-word;
    }

    .toast-action {
      display: inline-flex;
      align-items: center;
      margin-top: 0.625rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.15);
      color: inherit;
      border: 2px solid currentColor;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .toast-action:hover {
      background: rgba(0, 0, 0, 0.25);
      transform: translate(-1px, -1px);
      box-shadow: 2px 2px 0 currentColor;
    }

    .toast-action:active {
      transform: translate(0, 0);
      box-shadow: none;
    }

    /* Dismiss Button */
    .toast-dismiss {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      padding: 4px;
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.15s, transform 0.15s;
      margin: -4px -4px -4px 0;
    }

    .toast-dismiss:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    .toast-dismiss:active {
      transform: scale(0.95);
    }

    .toast-dismiss svg {
      width: 100%;
      height: 100%;
    }

    /* Progress Bar */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(0, 0, 0, 0.2);
      transform-origin: left;
      animation: progress linear forwards;
    }

    @keyframes progress {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: fadeIn 0.15s ease;
      }

      .toast-exit {
        animation: fadeOut 0.15s ease forwards;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      .toast-progress {
        animation: none;
        transform: scaleX(1);
      }
    }
  `]
})
export class ToasterComponent {
  toasterService = inject(ToasterService);
  dismissingIds = signal(new Set<string>());

  dismiss(toast: Toast): void {
    // Add to dismissing set for exit animation
    this.dismissingIds.update(ids => new Set([...ids, toast.id]));
    
    // Actually dismiss after animation
    setTimeout(() => {
      this.toasterService.dismiss(toast.id);
      this.dismissingIds.update(ids => {
        const newIds = new Set(ids);
        newIds.delete(toast.id);
        return newIds;
      });
    }, 200);
  }

  onAction(toast: Toast): void {
    if (toast.action?.callback) {
      toast.action.callback();
    }
    this.dismiss(toast);
  }
}
