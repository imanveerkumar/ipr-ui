import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiMessageService } from '../../../core/services/ui-message.service';
import { UiBannerComponent } from './ui-banner.component';
import { UiTipCardComponent } from './ui-tip-card.component';

/**
 * Container component that renders all UI messages for the current context.
 * Place this in any page and call `uiMessageService.loadMessages(context)`.
 *
 * It renders each message according to its placement:
 *  - top-banner / footer-banner → UiBannerComponent
 *  - homepage-card / inline-tip → UiTipCardComponent
 *  - toast → floating toast
 *  - modal → (extend as needed)
 *
 * Usage:
 *   <app-ui-notification-container />
 */
@Component({
  selector: 'app-ui-notification-container',
  standalone: true,
  imports: [CommonModule, UiBannerComponent, UiTipCardComponent],
  template: `
    <!-- Top banners -->
    @for (msg of uiMessages.topBanners(); track msg.id) {
      <app-ui-banner [message]="msg" (dismissed)="onDismiss($event)" />
    }

    <!-- Toasts (bottom-right floating) -->
    @if (uiMessages.toasts().length > 0) {
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        @for (msg of uiMessages.toasts(); track msg.id) {
          <div
            class="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] animate-slide-up"
            role="alert"
          >
            <div class="flex items-start gap-3">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-[#111]">{{ msg.title }}</p>
                <p *ngIf="msg.body" class="text-xs text-[#111]/70 mt-1">{{ msg.body }}</p>
              </div>
              <button
                *ngIf="msg.dismissible"
                (click)="onDismiss(msg.id)"
                class="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close notification"
              >
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        }
      </div>
    }

    <!-- Footer banners -->
    @for (msg of uiMessages.footerBanners(); track msg.id) {
      <app-ui-banner [message]="msg" (dismissed)="onDismiss($event)" />
    }
  `,
  styles: [`
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `],
})
export class UiNotificationContainerComponent {
  readonly uiMessages = inject(UiMessageService);

  onDismiss(messageId: string): void {
    this.uiMessages.dismiss(messageId);
  }
}
