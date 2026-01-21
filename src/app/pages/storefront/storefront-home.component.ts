import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreContextService, CartService, CheckoutService, AuthService, SubdomainService } from '../../core/services';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Mobile-First Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-gradient-to-br from-[#b8e6c9] via-[#c8f0d0] to-[#d8f8e0] rounded-2xl sm:rounded-3xl mx-3 sm:mx-4 md:mx-6 lg:mx-8 mt-3 sm:mt-4">
          <div class="px-4 sm:px-6 py-8 sm:py-10 md:py-14 lg:py-16">
            <div class="text-center max-w-3xl mx-auto">
              <!-- Badge - Smaller on mobile -->
              <div class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/60 backdrop-blur-sm mb-3 sm:mb-4">
                <span class="text-xs sm:text-sm font-medium text-gray-800">Welcome to our store ✨</span>
              </div>
              
              <!-- Store Name - Responsive sizing -->
              <h1 class="font-dm-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-tight leading-tight">
                {{ storeContext.storeName() }}
              </h1>
              
              @if (storeContext.store()?.tagline) {
                <p class="text-sm sm:text-base md:text-lg text-gray-700/80 max-w-xl mx-auto px-2">{{ storeContext.store()?.tagline }}</p>
              }
              
              @if (storeContext.products().length > 0) {
                <div class="mt-4 sm:mt-5">
                  <span class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-gray-800">
                    🛍️ {{ storeContext.products().length }} Premium Products
                  </span>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section - Mobile Optimized -->
      <section class="py-6 sm:py-10 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <!-- Section Header - Compact on mobile -->
          <div class="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 class="font-dm-sans text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
              Our Products
            </h2>
            <p class="text-gray-500 text-sm sm:text-base mt-2 px-4">Premium digital products for you</p>
          </div>

          @if (storeContext.products().length === 0) {
            <!-- Empty State - Mobile friendly -->
            <div class="bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <h3 class="font-dm-sans text-lg sm:text-xl font-bold text-gray-900 mb-2">No products yet</h3>
              <p class="text-gray-600 text-sm sm:text-base">Check back soon for amazing digital products!</p>
            </div>
          } @else {
            <!-- Products Grid - 2 columns on mobile, scales up -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              @for (product of storeContext.products().slice(0, 8); track product.id) {
                <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg active:shadow-md transition-all duration-200 group">
                  <!-- Product Image - Touch friendly -->
                  <div (click)="navigateTo('/product/' + product.id)" class="relative overflow-hidden cursor-pointer active:opacity-90">
                    @if (product.coverImageUrl) {
                      <div class="aspect-square overflow-hidden">
                        <img 
                          [src]="product.coverImageUrl" 
                          [alt]="product.title"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        >
                      </div>
                    } @else {
                      <div class="aspect-square bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                    }
                    
                    <!-- Discount Badge -->
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <div class="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-rose-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-sm">
                          -{{ getDiscount(product) }}%
                        </span>
                      </div>
                    }
                  </div>
                  
                  <!-- Product Info - Compact on mobile -->
                  <div class="p-3 sm:p-4">
                    <button (click)="navigateTo('/product/' + product.id)" class="text-left w-full">
                      <h3 class="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight mb-1 sm:mb-2">
                        {{ product.title }}
                      </h3>
                    </button>
                    
                    <!-- Price - Prominent -->
                    <div class="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <span class="text-base sm:text-lg font-bold text-gray-900">
                        ₹{{ product.price / 100 }}
                      </span>
                      @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                        <span class="text-xs sm:text-sm text-gray-400 line-through">
                          ₹{{ product.compareAtPrice / 100 }}
                        </span>
                      }
                    </div>
                    
                    <!-- Action Buttons - Touch optimized (min 44px height) -->
                    <div class="flex gap-2">
                      <button 
                        (click)="handleBuyNow(product)"
                        class="flex-1 py-2.5 sm:py-3 px-2 sm:px-4 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[44px]"
                      >
                        Buy Now
                      </button>
                      <button 
                        (click)="cartService.isInCart(product.id) ? removeFromCart(product) : addToCart(product)"
                        class="p-2.5 sm:p-3 bg-gray-100 rounded-lg sm:rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        [class.bg-emerald-100]="cartService.isInCart(product.id)"
                        [class.text-emerald-700]="cartService.isInCart(product.id)"
                        [title]="cartService.isInCart(product.id) ? 'Remove from cart' : 'Add to cart'"
                      >
                        @if (cartService.isInCart(product.id)) {
                          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                          </svg>
                        } @else {
                          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- View All Button - Full width on mobile -->
            @if (storeContext.products().length > 8) {
              <div class="mt-6 sm:mt-8 md:mt-10">
                <button 
                  (click)="navigateTo('/products')" 
                  class="w-full sm:w-auto sm:mx-auto sm:flex sm:justify-center items-center gap-2 px-6 sm:px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-800 active:bg-gray-950 transition-colors shadow-lg"
                >
                  <span>View All {{ storeContext.products().length }} Products</span>
                  <svg class="w-4 h-4 sm:w-5 sm:h-5 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
              </div>
            }
          }
        </div>
      </section>

      <!-- About Store - Mobile Optimized Card -->
      @if (storeContext.store()?.description) {
        <section class="py-6 sm:py-10 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
          <div class="max-w-3xl mx-auto">
            <div class="bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10">
              <div class="text-center mb-4 sm:mb-6">
                <h2 class="font-dm-sans text-lg sm:text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight">
                  About Us
                </h2>
              </div>
              <div class="prose prose-sm sm:prose-base prose-gray max-w-none text-gray-700 text-center" [innerHTML]="storeContext.store()?.description"></div>
            </div>
          </div>
        </section>
      }

      <!-- Features - Horizontal scroll on mobile, grid on desktop -->
      <section class="py-6 sm:py-10 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-5 sm:mb-8">
            <h2 class="font-dm-sans text-lg sm:text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight">
              Why Shop With Us
            </h2>
          </div>
          
          <!-- Horizontal scroll container on mobile -->
          <div class="flex md:grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            <div class="flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-center bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-2xl p-5 sm:p-6 md:p-8 text-center">
              <div class="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-white/80 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Instant Access</h3>
              <p class="text-gray-700/80 text-xs sm:text-sm">Download immediately after purchase</p>
            </div>
            
            <div class="flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-center bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] rounded-2xl p-5 sm:p-6 md:p-8 text-center">
              <div class="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-white/80 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Secure Payment</h3>
              <p class="text-gray-700/80 text-xs sm:text-sm">Encrypted & safe transactions</p>
            </div>
            
            <div class="flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-auto snap-center bg-gradient-to-br from-[#e0e0ff] to-[#f5f2ff] rounded-2xl p-5 sm:p-6 md:p-8 text-center">
              <div class="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-white/80 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Quality Guaranteed</h3>
              <p class="text-gray-700/80 text-xs sm:text-sm">Premium products with care</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class StorefrontHomeComponent {
  storeContext = inject(StoreContextService);
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  getDiscount(product: Product): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }

  removeFromCart(product: Product) {
    this.cartService.removeItem(product.id);
  }

  handleBuyNow(product: Product) {
    // Add product to cart and open cart sidebar for checkout
    // This allows both guest and authenticated checkout flows
    this.cartService.addItem(product);
    this.cartService.open();
  }
}
