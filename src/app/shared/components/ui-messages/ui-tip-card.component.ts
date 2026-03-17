import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiMessage } from '../../../core/models';
import { LucideAngularModule, LucideIconData, Crown, Lightbulb, Tag, Megaphone, Pin, Info, ArrowRight, X } from 'lucide-angular';

/**
 * Renders a homepage card-style UI message — tips, promos, announcements.
 *
 * BANNER (dark):  mirrors the "Why sellers choose us" #111111 dark card on the homepage.
 * TIP / others:   mirrors the step + sellable-item cards — bg-theme-secondary + rounded-2xl.
 * CTAs:           always rounded-full to match homepage button style.
 *
 * Usage:
 *   <app-ui-tip-card [message]="msg" (dismissed)="onDismiss($event)" />
 */
@Component({
  selector: 'app-ui-tip-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div
      class="relative border-2"
      [ngClass]="cardClasses"
      role="status"
    >
      <div class="p-5 sm:p-6">

        <!-- Dismiss -->
        <button
          *ngIf="message.dismissible"
          (click)="dismissed.emit(message.id)"
          [ngClass]="dismissClasses"
          class="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full"
          aria-label="Dismiss"
        >
          <lucide-icon [img]="X" [size]="14" [strokeWidth]="2.5"></lucide-icon>
        </button>

        <!-- Icon box — matches the step-number box style on homepage -->
        <div
          class="w-11 h-11 flex items-center justify-center mb-4 border-2"
          [ngClass]="iconBoxClasses"
        >
          <lucide-icon [img]="icon" [size]="20" [strokeWidth]="2" [color]="iconColor"></lucide-icon>
        </div>

        <!-- Type label — small muted uppercase, like the homepage section labels -->
        <p class="text-[11px] font-semibold tracking-widest uppercase mb-2" [ngClass]="labelClasses">
          {{ badgeLabel }}
        </p>

        <!-- Title — font-dm-sans, mirrors homepage headings -->
        <h3
          class="font-dm-sans font-bold text-base sm:text-lg leading-snug mb-2"
          [ngClass]="titleClasses"
          [class.pr-8]="message.dismissible"
        >
          {{ message.title }}
        </h3>

        <!-- Body -->
        <p
          *ngIf="message.body"
          class="text-sm leading-relaxed"
          [ngClass]="bodyClasses"
          [class.mb-4]="message.ctaUrl && message.ctaText"
        >
          {{ message.body }}
        </p>

        <!-- CTA — matches homepage neo-brutalist button style -->
        <a
          *ngIf="message.ctaUrl && message.ctaText"
          [routerLink]="message.ctaUrl"
          [ngClass]="ctaClasses"
          class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-theme-border text-sm font-bold"
        >
          {{ message.ctaText }}
          <lucide-icon [img]="ArrowRight" [size]="16" [strokeWidth]="2.5"></lucide-icon>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .font-dm-sans { font-family: 'DM Sans', sans-serif; }
  `]
})
export class UiTipCardComponent {
  @Input({ required: true }) message!: UiMessage;
  @Output() dismissed = new EventEmitter<string>();

  readonly ArrowRight = ArrowRight;
  readonly X = X;

  /** Dark card for BANNER (mirrors homepage #111111 section); cream for everything else */
  get cardClasses(): string {
    return this.message.type === 'BANNER'
      ? 'bg-theme-fg border-theme-border shadow-[4px_4px_0px_0px_#FFC60B]'
      : 'bg-theme-secondary border-theme-border shadow-[4px_4px_0px_0px_rgb(104_224_121)]';
  }

  get iconBoxClasses(): string {
    return this.message.type === 'BANNER'
      ? 'bg-theme-bg/10 border-theme-bg/20'
      : 'bg-theme-surface border-theme-border';
  }

  get labelClasses(): string {
    return this.message.type === 'BANNER'
      ? 'text-theme-accent'
      : 'text-theme-muted';
  }

  get titleClasses(): string {
    return this.message.type === 'BANNER'
      ? 'text-theme-bg'
      : 'text-theme-fg';
  }

  get bodyClasses(): string {
    return this.message.type === 'BANNER'
      ? 'text-theme-bg/70'
      : 'text-theme-muted';
  }

  get dismissClasses(): string {
    return this.message.type === 'BANNER'
      ? 'text-theme-bg/60 hover:bg-theme-bg/10 hover:text-theme-bg'
      : 'text-theme-muted hover:bg-theme-fg/10 hover:text-theme-fg';
  }

  /**
   * CTA colours:
   *   BANNER (dark card) → #FFC60B yellow, mirrors homepage yellow accent
   *   TIP / others       → #111111 black, mirrors homepage primary CTA
   */
  get ctaClasses(): string {
    return this.message.type === 'BANNER'
      ? 'bg-theme-bg text-theme-fg shadow-[3px_3px_0px_0px_#000]'
      : 'bg-theme-fg text-theme-bg shadow-[3px_3px_0px_0px_rgb(104_224_121)]';
  }

  get icon(): LucideIconData {
    switch (this.message.type) {
      case 'BANNER':       return Crown;
      case 'TIP':          return Lightbulb;
      case 'SALE':         return Tag;
      case 'ANNOUNCEMENT': return Megaphone;
      case 'NOTE':         return Pin;
      default:             return Info;
    }
  }

  get iconColor(): string {
    return this.message.type === 'BANNER' ? 'var(--background)' : 'var(--foreground)';
  }

  get badgeLabel(): string {
    switch (this.message.type) {
      case 'BANNER':       return 'Featured';
      case 'TIP':          return 'Creator Tip';
      case 'SALE':         return 'Sale';
      case 'ANNOUNCEMENT': return 'Announcement';
      case 'NOTE':         return 'Note';
      default:             return 'Info';
    }
  }
}
