import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreContextService, CartService, CheckoutService, AuthService, SubdomainService } from '../../core/services';
import { ToasterService } from '../../core/services/toaster.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Clean Hero Section -->
      <section class="px-4 sm:px-6 md:px-8 lg:px-10 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 md:pb-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
            {{ storeContext.storeName() }}
          </h1>

          @if (storeContext.store()?.tagline) {
            <p class="mt-3 sm:mt-4 text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">{{ storeContext.store()?.tagline }}</p>
          }

          <div class="flex items-center justify-center gap-3 mt-5 sm:mt-6">
            @if (storeContext.products().length > 0) {
              <span class="text-sm text-gray-400">{{ storeContext.products().length }} products</span>
              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
            }
            <button
              (click)="copyUrl()"
              class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              @if (copied()) {
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span class="text-emerald-500">Copied</span>
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                Copy link
              }
            </button>
            <span class="w-1 h-1 rounded-full bg-gray-300"></span>
            <button
              (click)="shareUrl()"
              class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share
            </button>
          </div>
        </div>
      </section>

      <!-- Thin divider -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="border-t border-gray-100"></div>
      </div>

      <!-- Products Section -->
      <section class="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-10">
        <div class="max-w-6xl mx-auto">
          @if (storeContext.products().length === 0) {
            <div class="py-16 sm:py-24 text-center">
              <svg class="w-12 h-12 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <p class="text-gray-400 text-sm">No products yet. Check back soon.</p>
            </div>
          } @else {
            <!-- Products Grid -->
            <div class="masonry-grid">
              @for (product of storeContext.products().slice(0, 8); track product.id) {
                <div class="masonry-item mb-4 sm:mb-5 bg-white rounded-xl overflow-hidden group relative cursor-pointer border border-gray-100 hover:border-gray-200 transition-all duration-300" (click)="navigateTo('/product/' + product.id)">
                  <!-- Product Image -->
                  <div class="relative overflow-hidden">
                    @if (product.coverImageUrl) {
                      <div class="overflow-hidden" [style.aspect-ratio]="getProductAspectRatio(product)">
                        <img 
                          [src]="product.coverImageUrl" 
                          [alt]="product.title"
                          class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        >
                      </div>
                    } @else {
                      <div class="aspect-square bg-gray-50 flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    }
                    
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <div class="absolute top-2.5 left-2.5">
                        <span class="px-2 py-0.5 bg-gray-900 text-white text-[10px] sm:text-xs font-medium rounded-md">
                          -{{ getDiscount(product) }}%
                        </span>
                      </div>
                    }
                  </div>

                  <!-- Mobile Product Info -->
                  <div class="md:hidden px-3 pt-2.5 pb-3">
                    <h3 class="font-medium text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                      {{ product.title }}
                    </h3>
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-1.5">
                        <span class="font-semibold text-gray-900 text-sm">
                          ₹{{ product.price / 100 }}
                        </span>
                        @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                          <span class="text-xs text-gray-300 line-through">
                            ₹{{ product.compareAtPrice / 100 }}
                          </span>
                        }
                      </div>
                      @if (product.price > 0) {
                        <button
                          (click)="cartService.isInCart(product.id) ? removeFromCart(product) : addToCart(product); $event.stopPropagation()"
                          class="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all active:scale-95 flex-shrink-0"
                          [class]="cartService.isInCart(product.id) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                        >
                          @if (cartService.isInCart(product.id)) {
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                            Added
                          } @else {
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v12m6-6H6"/>
                            </svg>
                            Add
                          }
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Desktop Hover Panel -->
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-12 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none group-hover:pointer-events-auto hidden md:block">
                    <h3 class="font-medium text-white text-sm line-clamp-2 leading-snug mb-2">
                      {{ product.title }}
                    </h3>
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-baseline gap-1.5">
                        <span class="text-base font-semibold text-white">
                          ₹{{ product.price / 100 }}
                        </span>
                        @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                          <span class="text-xs text-white/40 line-through">
                            ₹{{ product.compareAtPrice / 100 }}
                          </span>
                        }
                      </div>
                      @if (product.price > 0) {
                        <div class="flex items-center gap-1.5">
                          <button
                            (click)="cartService.isInCart(product.id) ? removeFromCart(product) : addToCart(product); $event.stopPropagation()"
                            class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                            [class]="cartService.isInCart(product.id) ? 'bg-white text-gray-900' : 'bg-white/20 text-white hover:bg-white/30'"
                          >
                            @if (cartService.isInCart(product.id)) {
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                              </svg>
                              Added
                            } @else {
                              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v12m6-6H6"/>
                              </svg>
                              Add
                            }
                          </button>
                          <button
                            (click)="handleBuyNow(product); $event.stopPropagation()"
                            class="px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-lg hover:bg-white/90 transition-all"
                          >
                            Buy Now
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            @if (storeContext.products().length > 8) {
              <div class="mt-8 sm:mt-10 text-center">
                <button 
                  (click)="navigateTo('/products')" 
                  class="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  View all {{ storeContext.products().length }} products
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
              </div>
            }
          }
        </div>
      </section>

      <!-- About Store -->
      @if (storeContext.store()?.description) {
        <section class="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-10">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">About</h2>
            <div class="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-500 leading-relaxed" [innerHTML]="storeContext.store()?.description"></div>
          </div>
        </section>
      }

      <!-- Why Shop With Us - Minimal inline layout -->
      <section class="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-10">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-sm font-medium text-gray-400 uppercase tracking-widest text-center mb-8 sm:mb-10">Why Shop With Us</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div class="text-center">
              <svg class="w-5 h-5 mx-auto text-gray-400 mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <h3 class="text-sm font-semibold text-gray-900 mb-1">Instant Access</h3>
              <p class="text-xs text-gray-400 leading-relaxed">Download immediately after purchase</p>
            </div>
            
            <div class="text-center">
              <svg class="w-5 h-5 mx-auto text-gray-400 mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <h3 class="text-sm font-semibold text-gray-900 mb-1">Secure Payment</h3>
              <p class="text-xs text-gray-400 leading-relaxed">Encrypted & safe transactions</p>
            </div>
            
            <div class="text-center">
              <svg class="w-5 h-5 mx-auto text-gray-400 mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="text-sm font-semibold text-gray-900 mb-1">Quality Guaranteed</h3>
              <p class="text-xs text-gray-400 leading-relaxed">Premium products crafted with care</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .masonry-grid {
      columns: 2;
      column-gap: 1rem;
    }
    @media (min-width: 768px) {
      .masonry-grid {
        columns: 3;
        column-gap: 1.25rem;
      }
    }
    @media (min-width: 1024px) {
      .masonry-grid {
        columns: 4;
        column-gap: 1.5rem;
      }
    }
    .masonry-item {
      break-inside: avoid;
      display: inline-block;
      width: 100%;
    }
    .masonry-item > div {
      -webkit-tap-highlight-color: transparent;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class StorefrontHomeComponent {
  storeContext = inject(StoreContextService);
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private toaster = inject(ToasterService);
  private router = inject(Router);

  copied = signal(false);

  navigateTo(path: string): void {
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  getDiscount(product: Product): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  getProductAspectRatio(product: Product): string {
    if (product.coverImageWidth && product.coverImageHeight && product.coverImageWidth > 0 && product.coverImageHeight > 0) {
      return `${product.coverImageWidth} / ${product.coverImageHeight}`;
    }
    return '1 / 1';
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  addToCart(product: Product) {
    if (product.price === 0) {
      return;
    }
    this.cartService.addItem(product);
  }

  removeFromCart(product: Product) {
    if (product.price === 0) {
      return;
    }
    this.cartService.removeItem(product.id);
  }

  handleBuyNow(product: Product) {
    if (product.price === 0) {
      return;
    }
    // Add product to cart and open cart sidebar for checkout
    // This allows both guest and authenticated checkout flows
    this.cartService.addItem(product);
    this.cartService.open();
  }

  async copyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.copied.set(true);
      this.toaster.success({ title: 'Link Copied', message: 'Store URL copied to clipboard' });
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.toaster.error({ title: 'Copy Failed', message: 'Could not copy URL' });
    }
  }

  async shareUrl() {
    const store = this.storeContext.store();
    if (navigator.share) {
      try {
        await navigator.share({
          title: store?.name || 'Store',
          text: `Check out ${store?.name || 'this store'}`,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await this.copyUrl();
    }
  }
}
