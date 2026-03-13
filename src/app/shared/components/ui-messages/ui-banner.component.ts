import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMessage } from '../../../core/models';
import { LucideAngularModule, LucideIconData, Tag, Megaphone, TriangleAlert, Info, ChevronRight, X, Sparkles } from 'lucide-angular';

/**
 * Renders a slim full-width banner for top-banner and footer-banner placements.
 * Sale banners render above the navbar with a bold yellow accent.
 * Other banners use dark/cream theming matching the homepage palette.
 *
 * Usage:
 *   <app-ui-banner [message]="msg" (dismissed)="onDismiss($event)" />
 */
@Component({
  selector: 'app-ui-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div
      class="relative w-full banner-enter"
      [ngClass]="wrapperClasses"
      role="status"
      aria-live="polite"
    >
      <!-- Sale shimmer overlay -->
      <div *ngIf="message.type === 'SALE'" class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="sale-shimmer"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 relative">
        <div class="flex items-center justify-between gap-4">

          <!-- Balancing spacer (desktop) -->
          <div class="w-7 flex-shrink-0 hidden sm:block"></div>

          <!-- Centre content -->
          <div class="flex-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <!-- Sale sparkle (left) -->
            <lucide-icon *ngIf="message.type === 'SALE'" [img]="Sparkles" [size]="14" [strokeWidth]="2.5" color="#111111" class="flex-shrink-0 opacity-50 hidden sm:block"></lucide-icon>

            <lucide-icon [img]="icon" [size]="16" [strokeWidth]="2" [color]="iconColor" class="flex-shrink-0"></lucide-icon>

            <span class="font-semibold text-sm tracking-wide" [class.uppercase]="message.type === 'SALE'">{{ message.title }}</span>

            <ng-container *ngIf="message.body">
              <span class="text-xs hidden sm:inline" [ngClass]="separatorClasses">·</span>
              <span class="text-sm hidden sm:inline" [ngClass]="bodyOpacityClasses">{{ message.body }}</span>
            </ng-container>

            <!-- Sale sparkle (right) -->
            <lucide-icon *ngIf="message.type === 'SALE'" [img]="Sparkles" [size]="14" [strokeWidth]="2.5" color="#111111" class="flex-shrink-0 opacity-50 hidden sm:block"></lucide-icon>

            <!-- CTA — rounded-full to match homepage buttons -->
            <a
              *ngIf="message.ctaUrl && message.ctaText"
              [routerLink]="message.ctaUrl"
              [ngClass]="ctaClasses"
              class="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              {{ message.ctaText }}
              <lucide-icon [img]="ChevronRight" [size]="14" [strokeWidth]="2.5"></lucide-icon>
            </a>
          </div>

          <!-- Dismiss -->
          <button
            *ngIf="message.dismissible"
            (click)="dismissed.emit(message.id)"
            [ngClass]="dismissClasses"
            class="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Dismiss"
          >
            <lucide-icon [img]="X" [size]="14" [strokeWidth]="2.5"></lucide-icon>
          </button>

          <div *ngIf="!message.dismissible" class="w-7 flex-shrink-0 hidden sm:block"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes banner-slide-down {
      from { opacity: 0; transform: translateY(-100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .banner-enter {
      animation: banner-slide-down 0.35s ease-out;
    }

    /* Shimmer effect for sale banners */
    @keyframes shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .sale-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 100%
      );
      animation: shimmer 3s ease-in-out infinite;
    }
  `],
})
export class UiBannerComponent {
  @Input({ required: true }) message!: UiMessage;
  @Output() dismissed = new EventEmitter<string>();

  readonly ChevronRight = ChevronRight;
  readonly X = X;
  readonly Sparkles = Sparkles;

  /** Background + text — using only the homepage's colour palette */
  get wrapperClasses(): string {
    switch (this.message.type) {
      case 'SALE':         return 'bg-theme-accent text-theme-fg border-b border-[#e6b300]';
      case 'ANNOUNCEMENT': return 'bg-theme-fg text-white';
      case 'NOTE':         return 'bg-theme-fg text-white/80';
      default:             return 'bg-theme-secondary text-theme-fg';
    }
  }

  /** CTA pill colours */
  get ctaClasses(): string {
    switch (this.message.type) {
      case 'SALE':         return 'bg-theme-fg text-white shadow-sm';
      case 'ANNOUNCEMENT':
      case 'NOTE':         return 'bg-white/10 border border-white/15 text-white';
      default:             return 'bg-theme-fg text-white';
    }
  }

  /** Dismiss button colours */
  get dismissClasses(): string {
    switch (this.message.type) {
      case 'SALE': return 'text-[#111111]/40 hover:bg-black/10 hover:text-theme-fg';
      default:     return 'text-white/30 hover:bg-white/10 hover:text-white';
    }
  }

  get separatorClasses(): string {
    return this.message.type === 'SALE' ? 'opacity-40' : 'opacity-30';
  }

  get bodyOpacityClasses(): string {
    return this.message.type === 'SALE' ? 'opacity-70 font-medium' : 'opacity-65';
  }

  get icon(): LucideIconData {
    switch (this.message.type) {
      case 'SALE':         return Tag;
      case 'ANNOUNCEMENT': return Megaphone;
      case 'NOTE':         return TriangleAlert;
      default:             return Info;
    }
  }

  get iconColor(): string {
    switch (this.message.type) {
      case 'SALE':         return '#111111';
      case 'ANNOUNCEMENT':
      case 'NOTE':         return 'rgba(255,255,255,0.75)';
      default:             return '#111111';
    }
  }
}
