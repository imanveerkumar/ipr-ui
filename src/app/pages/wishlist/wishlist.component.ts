import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService, WishlistItem, WishlistLocalProduct, WishlistProduct } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { MasonryGridComponent } from '../../shared/components/masonry-grid/masonry-grid.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MasonryGridComponent],
  template: `
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-theme-secondary border-b-2 border-theme-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div class="text-left">
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-theme-fg mb-0 md:mb-1 leading-tight">
                Wishlist
              </h1>

              <!-- Stats -->
              <div class="mt-4 md:mt-6 flex items-center gap-2">
                <div class="w-6 h-6 md:w-8 md:h-8 bg-theme-danger border border-theme-border rounded-lg flex items-center justify-center">
                  <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </div>
                <div>
                  @if (!loading()) {
                    <span class="text-sm md:text-xl font-bold text-theme-fg">{{ totalItems() }}</span>
                    <span class="text-xs md:text-sm text-theme-fg/60 ml-1">{{ totalItems() === 1 ? 'item' : 'items' }} saved</span>
                  } @else {
                    <div class="h-4 md:h-6 w-20 bg-theme-fg/10 rounded animate-pulse"></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Loading State -->
        @if (loading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="animate-pulse">
                <div class="aspect-[4/3] bg-theme-secondary rounded-xl mb-3"></div>
                <div class="h-4 bg-theme-secondary rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-theme-secondary rounded w-1/2"></div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @else if (items().length === 0 && localItems().length === 0) {
          <div class="flex flex-col items-center justify-center py-16 md:py-24">
            <div class="w-24 h-24 md:w-32 md:h-32 bg-theme-secondary rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-theme-border/20">
              <svg class="w-12 h-12 md:w-16 md:h-16 text-theme-fg/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-theme-fg mb-2">Your wishlist is empty</h2>
            <p class="text-sm md:text-base text-theme-fg/60 mb-6 max-w-md text-center">
              Save products you love by clicking the heart icon. They'll appear here for easy access.
            </p>
            <a routerLink="/explore"
               class="inline-flex items-center px-6 py-3 bg-theme-accent text-theme-fg border-2 border-theme-border rounded-lg font-bold text-sm hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Explore Products
            </a>
          </div>
        }

        <!-- Products Grid (Authenticated) -->
        @else if (isAuthenticated()) {
          <app-masonry-grid
            [items]="items()"
            [colsMobile]="2"
            [colsTablet]="3"
            [colsDesktop]="3"
            [colsLargeDesktop]="4"
            [gap]="16"
            [getItemRatio]="getAuthItemRatio">
            <ng-template let-item let-i="index">
              <div class="group relative bg-theme-surface rounded-xl border-2 border-theme-border overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
                <!-- Remove Button -->
                <button
                  (click)="removeItem($event, item.productId)"
                  class="absolute top-2 right-2 z-10 w-8 h-8 bg-theme-danger border-2 border-theme-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-150"
                  title="Remove from wishlist"
                  [attr.aria-label]="'Remove ' + item.product.title + ' from wishlist'">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>

                <!-- Product Link -->
                <a [routerLink]="['/product', item.productId]" class="block">
                  <div class="relative overflow-hidden bg-theme-secondary"
                       [style.aspect-ratio]="getProductAspectRatio(item.product)">
                    @if (item.product.coverImageUrl) {
                      <img
                        [src]="item.product.coverImageUrl"
                        [alt]="item.product.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"/>
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-theme-fg/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="p-3 md:p-4">
                    <h3 class="font-bold text-sm md:text-base text-theme-fg truncate mb-1 group-hover:text-theme-primary transition-colors">
                      {{ item.product.title }}
                    </h3>
                    <p class="text-xs text-theme-fg/50 truncate mb-2">
                      {{ item.product.store.name }}
                    </p>
                    <div class="flex items-center gap-2">
                      @if (item.product.price === 0) {
                        <span class="inline-flex items-center px-2 py-0.5 bg-theme-success border border-theme-border rounded-md text-xs font-bold text-theme-fg">
                          Free
                        </span>
                      } @else {
                        <span class="font-bold text-sm text-theme-fg">
                          {{ formatPrice(item.product.price, item.product.currency) }}
                        </span>
                        @if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
                          <span class="text-xs text-theme-fg/40 line-through">
                            {{ formatPrice(item.product.compareAtPrice, item.product.currency) }}
                          </span>
                        }
                      }
                    </div>
                  </div>
                </a>
              </div>
            </ng-template>
          </app-masonry-grid>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-2 mt-8">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() <= 1"
                class="px-4 py-2 text-sm font-bold border-2 border-theme-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-theme-secondary transition-colors">
                Previous
              </button>
              <span class="text-sm text-theme-fg/60 px-3">
                Page {{ currentPage() }} of {{ totalPages() }}
              </span>
              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() >= totalPages()"
                class="px-4 py-2 text-sm font-bold border-2 border-theme-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-theme-secondary transition-colors">
                Next
              </button>
            </div>
          }
        }

        <!-- Products Grid (Anonymous - from localStorage) -->
        @else {
          <app-masonry-grid
            [items]="localItems()"
            [colsMobile]="2"
            [colsTablet]="3"
            [colsDesktop]="3"
            [colsLargeDesktop]="4"
            [gap]="16"
            [getItemRatio]="getLocalItemRatio">
            <ng-template let-item let-i="index">
              <div class="group relative bg-theme-surface rounded-xl border-2 border-theme-border overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
                <!-- Remove Button -->
                <button
                  (click)="removeItem($event, item.id)"
                  class="absolute top-2 right-2 z-10 w-8 h-8 bg-theme-danger border-2 border-theme-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-150"
                  title="Remove from wishlist"
                  [attr.aria-label]="'Remove ' + item.title + ' from wishlist'">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>

                <!-- Product Link -->
                <a [routerLink]="['/product', item.id]" class="block">
                  <div class="relative overflow-hidden bg-theme-secondary"
                       [style.aspect-ratio]="getProductAspectRatio(item)">
                    @if (item.coverImageUrl) {
                      <img
                        [src]="item.coverImageUrl"
                        [alt]="item.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"/>
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-theme-fg/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                  </div>
                  <div class="p-3 md:p-4">
                    <h3 class="font-bold text-sm md:text-base text-theme-fg truncate mb-1 group-hover:text-theme-primary transition-colors">
                      {{ item.title }}
                    </h3>
                    <p class="text-xs text-theme-fg/50 truncate mb-2">
                      {{ item.store.name }}
                    </p>
                    <div class="flex items-center gap-2">
                      @if (item.price === 0) {
                        <span class="inline-flex items-center px-2 py-0.5 bg-theme-success border border-theme-border rounded-md text-xs font-bold text-theme-fg">
                          Free
                        </span>
                      } @else {
                        <span class="font-bold text-sm text-theme-fg">
                          {{ formatPrice(item.price, item.currency) }}
                        </span>
                        @if (item.compareAtPrice && item.compareAtPrice > item.price) {
                          <span class="text-xs text-theme-fg/40 line-through">
                            {{ formatPrice(item.compareAtPrice, item.currency) }}
                          </span>
                        }
                      }
                    </div>
                  </div>
                </a>
              </div>
            </ng-template>
          </app-masonry-grid>
        }
      </div>
    </div>
  `,
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private toaster = inject(ToasterService);

  loading = signal(true);
  items = signal<WishlistItem[]>([]);
  localItems = signal<WishlistLocalProduct[]>([]);
  currentPage = signal(1);
  totalPages = signal(0);
  totalItems = signal(0);
  isAuthenticated = this.authService.isSignedIn;

  ngOnInit(): void {
    this.loadWishlist();
  }

  async loadWishlist(): Promise<void> {
    this.loading.set(true);
    try {
      if (this.isAuthenticated()) {
        const result = await this.wishlistService.getWishlist(this.currentPage(), 20);
        this.items.set(result.data);
        this.totalPages.set(result.meta.totalPages);
        this.totalItems.set(result.meta.total);
      } else {
        // Anonymous user: load from localStorage
        const local = this.wishlistService.getLocalWishlistItems();
        this.localItems.set(local);
        this.totalItems.set(local.length);
        this.totalPages.set(1);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      // Fallback to local items on error
      const local = this.wishlistService.getLocalWishlistItems();
      this.localItems.set(local);
      this.totalItems.set(local.length);
      this.totalPages.set(1);
    } finally {
      this.loading.set(false);
    }
  }

  async removeItem(event: Event, productId: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (this.isAuthenticated()) {
      // Optimistic removal from UI
      const previousItems = this.items();
      this.items.set(previousItems.filter((item) => item.productId !== productId));
      this.totalItems.update((n) => Math.max(0, n - 1));

      try {
        await this.wishlistService.remove(productId);
        this.toaster.success('Removed from wishlist');

        // If current page is now empty and not page 1, go back
        if (this.items().length === 0 && this.currentPage() > 1) {
          this.currentPage.update((p) => p - 1);
          await this.loadWishlist();
        }
      } catch {
        // Revert on failure
        this.items.set(previousItems);
        this.totalItems.update((n) => n + 1);
        this.toaster.error('Failed to remove item');
      }
    } else {
      // Anonymous user: remove locally
      const previousLocal = this.localItems();
      this.localItems.set(previousLocal.filter((item) => item.id !== productId));
      this.totalItems.update((n) => Math.max(0, n - 1));
      await this.wishlistService.remove(productId);
      this.toaster.success('Removed from wishlist');
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadWishlist();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatPrice(price: number, currency: string = 'INR'): string {
    const amount = price / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // ─── Aspect Ratio Helpers ──────────────────────────────────────────────

  private readonly fallbackRatios = ['3/4', '4/5', '1/1', '3/4', '4/3', '3/4', '1/1', '4/5'];
  private readonly aspectRatioCache = new Map<string, string>();

  getProductAspectRatio(product: { id?: string; coverImageWidth?: number | null; coverImageHeight?: number | null }): string {
    const id = product.id ?? '';
    if (this.aspectRatioCache.has(id)) {
      return this.aspectRatioCache.get(id)!;
    }

    let ratio: string;
    if (product.coverImageWidth && product.coverImageHeight) {
      ratio = `${product.coverImageWidth} / ${product.coverImageHeight}`;
    } else {
      const idx = Math.abs(this.hashString(id)) % this.fallbackRatios.length;
      ratio = this.fallbackRatios[idx];
    }

    this.aspectRatioCache.set(id, ratio);
    return ratio;
  }

  /** Ratio extractor for masonry grid (authenticated items) */
  getAuthItemRatio = (item: WishlistItem): number => {
    const p = item.product;
    if (p.coverImageWidth && p.coverImageHeight) {
      return p.coverImageWidth / p.coverImageHeight;
    }
    return 3 / 4;
  };

  /** Ratio extractor for masonry grid (anonymous/local items) */
  getLocalItemRatio = (item: WishlistLocalProduct): number => {
    if (item.coverImageWidth && item.coverImageHeight) {
      return item.coverImageWidth / item.coverImageHeight;
    }
    return 3 / 4;
  };

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash;
  }
}
