import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMessageService } from '../../../core/services/ui-message.service';
import { UiBannerComponent } from './ui-banner.component';


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
  imports: [CommonModule, RouterLink, UiBannerComponent],
  template: `
    <!-- Top banners (handled by AppComponent - above navbar) -->

    <!-- Toasts (bottom-right floating) -->
    @if (uiMessages.toasts().length > 0) {
      <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        @for (msg of uiMessages.toasts(); track msg.id) {
          <div
            class="bg-theme-surface border border-black/10 rounded-2xl p-4 shadow-xl animate-slide-up backdrop-blur-sm"
            [ngClass]="{
              'border-l-4 border-l-theme-accent': msg.type === 'SALE',
              'border-l-4 border-l-theme-border': msg.type === 'ANNOUNCEMENT',
              'border-l-4 border-l-theme-success': msg.type === 'TIP',
              'border-l-4 border-l-amber-500': msg.type === 'NOTE'
            }"
            role="alert"
          >
            <div class="flex items-start gap-3">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-theme-fg">{{ msg.title }}</p>
                <p *ngIf="msg.body" class="text-xs text-[#111]/60 mt-1 leading-relaxed">{{ msg.body }}</p>
                <a
                  *ngIf="msg.ctaUrl && msg.ctaText"
                  [routerLink]="msg.ctaUrl"
                  class="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-theme-fg hover:text-[#111]/70 transition-colors"
                >
                  {{ msg.ctaText }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>
              <button
                *ngIf="msg.dismissible"
                (click)="onDismiss(msg.id)"
                class="p-1 rounded-full hover:bg-theme-secondary transition-colors flex-shrink-0 text-theme-muted hover:text-theme-muted"
                aria-label="Close notification"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
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
