import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMessage } from '../../../core/models';

/**
 * Renders a full-width top or footer banner for sales, announcements, etc.
 * Supports optional CTA link and dismiss button.
 *
 * Usage:
 *   <app-ui-banner [message]="msg" (dismissed)="onDismiss($event)" />
 */
@Component({
  selector: 'app-ui-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="relative w-full border-2 border-black px-4 py-3 sm:px-6"
      [ngClass]="bannerClasses"
      role="status"
      aria-live="polite"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Icon -->
          <span class="flex-shrink-0 text-lg" [innerHTML]="icon"></span>

          <!-- Content -->
          <div class="min-w-0">
            <span class="font-bold text-sm sm:text-base">{{ message.title }}</span>
            <span *ngIf="message.body" class="hidden sm:inline text-sm opacity-80 ml-2">{{ message.body }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- CTA -->
          <a
            *ngIf="message.ctaUrl && message.ctaText"
            [routerLink]="message.ctaUrl"
            class="inline-flex items-center px-4 py-1.5 bg-white/20 border-2 border-black rounded-lg text-sm font-bold hover:bg-white/30 transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            {{ message.ctaText }}
          </a>

          <!-- Dismiss -->
          <button
            *ngIf="message.dismissible"
            (click)="dismissed.emit(message.id)"
            class="p-1 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UiBannerComponent {
  @Input({ required: true }) message!: UiMessage;
  @Output() dismissed = new EventEmitter<string>();

  get bannerClasses(): string {
    switch (this.message.type) {
      case 'SALE':
        return 'bg-[#FFC60B] text-[#111]';
      case 'ANNOUNCEMENT':
        return 'bg-[#2B57D6] text-white';
      case 'BANNER':
        return 'bg-[#F9F4EB] text-[#111]';
      case 'NOTE':
        return 'bg-[#111] text-white';
      default:
        return 'bg-[#F9F4EB] text-[#111]';
    }
  }

  get icon(): string {
    switch (this.message.type) {
      case 'SALE':
        return '🏷️';
      case 'ANNOUNCEMENT':
        return '📢';
      case 'NOTE':
        return '📌';
      default:
        return '💡';
    }
  }
}
