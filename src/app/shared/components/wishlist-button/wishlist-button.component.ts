import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToasterService } from '../../../core/services/toaster.service';

/**
 * Wishlist heart button for product cards.
 *
 * Usage:
 *   <app-wishlist-button [productId]="product.id" />
 *
 * Supports:
 *   - Optimistic toggle with revert on failure
 *   - Anonymous users (saves to localStorage)
 *   - Customizable size via [size] input
 */
@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[style.opacity]': "isWishlisted() ? '1' : null",
  },
  template: `
    <button
      (click)="onToggle($event)"
      [attr.aria-label]="isWishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
      class="flex items-center justify-center rounded-full border-2 border-theme-border transition-all duration-150"
      [ngClass]="{
        'w-8 h-8': size === 'sm',
        'w-10 h-10': size === 'md',
        'bg-theme-danger text-white shadow-[2px_2px_0px_0px_#000]': isWishlisted(),
        'bg-theme-secondary text-theme-fg hover:text-theme-danger hover:bg-theme-surface-hover': !isWishlisted()
      }">
      <svg
        [ngClass]="{ 'w-4 h-4': size === 'sm', 'w-5 h-5': size === 'md' }"
        viewBox="0 0 24 24"
        [attr.fill]="isWishlisted() ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    </button>
  `,
})
export class WishlistButtonComponent {
  @Input({ required: true }) productId!: string;
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() product?: Record<string, any>;

  private wishlistService = inject(WishlistService);
  private auth = inject(AuthService);
  private toaster = inject(ToasterService);

  isWishlisted = computed(() => this.wishlistService.isWishlisted(this.productId));

  async onToggle(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const wasWishlisted = this.isWishlisted();
    const result = await this.wishlistService.toggle(this.productId, this.product);

    // Only show toast if state actually changed (not blocked by pending toggle)
    if (result !== wasWishlisted) {
      if (result) {
        this.toaster.success('Added to wishlist');
      } else {
        this.toaster.success('Removed from wishlist');
      }
    }
  }
}
