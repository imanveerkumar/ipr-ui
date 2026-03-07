import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMessage } from '../../../core/models';

/**
 * Renders a card-style UI message — ideal for tips, promotional cards, inline suggestions.
 *
 * Usage:
 *   <app-ui-tip-card [message]="msg" (dismissed)="onDismiss($event)" />
 */
@Component({
  selector: 'app-ui-tip-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="relative bg-white border-2 border-black rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]"
      role="status"
    >
      <!-- Dismiss -->
      <button
        *ngIf="message.dismissible"
        (click)="dismissed.emit(message.id)"
        class="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Dismiss tip"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Badge -->
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-3" [ngClass]="badgeClasses">
        <span [innerHTML]="icon"></span>
        {{ badgeLabel }}
      </div>

      <!-- Title -->
      <h3 class="font-bold text-[#111] text-base sm:text-lg mb-1 pr-6">
        {{ message.title }}
      </h3>

      <!-- Body -->
      <p *ngIf="message.body" class="text-sm text-[#111]/70 mb-3 leading-relaxed">
        {{ message.body }}
      </p>

      <!-- CTA -->
      <a
        *ngIf="message.ctaUrl && message.ctaText"
        [routerLink]="message.ctaUrl"
        class="inline-flex items-center px-4 py-2 bg-[#FFC60B] text-[#111] border-2 border-black rounded-lg text-sm font-bold hover:bg-[#ffdb4d] transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
      >
        {{ message.ctaText }}
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  `,
})
export class UiTipCardComponent {
  @Input({ required: true }) message!: UiMessage;
  @Output() dismissed = new EventEmitter<string>();

  get badgeClasses(): string {
    switch (this.message.type) {
      case 'TIP':
        return 'bg-blue-100 text-blue-800';
      case 'SALE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-800';
      case 'NOTE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  get badgeLabel(): string {
    switch (this.message.type) {
      case 'TIP':
        return 'Tip';
      case 'SALE':
        return 'Sale';
      case 'ANNOUNCEMENT':
        return 'New';
      case 'NOTE':
        return 'Note';
      default:
        return 'Info';
    }
  }

  get icon(): string {
    switch (this.message.type) {
      case 'TIP':
        return '💡';
      case 'SALE':
        return '🏷️';
      case 'ANNOUNCEMENT':
        return '📢';
      case 'NOTE':
        return '📌';
      default:
        return 'ℹ️';
    }
  }
}
