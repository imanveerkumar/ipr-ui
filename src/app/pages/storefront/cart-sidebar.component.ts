import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SubdomainService } from '../../core/services/subdomain.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Overlay -->
    @if (cartService.isOpen()) {
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        (click)="cartService.close()"
      ></div>
    }

    <!-- Cart Panel - Bottom sheet on mobile, sidebar on desktop -->
    <div 
      class="fixed z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out
             bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl
             md:top-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:w-full md:max-w-md md:rounded-none"
      [class.translate-y-full]="!cartService.isOpen()"
      [class.md:translate-y-0]="true"
      [class.md:translate-x-full]="!cartService.isOpen()"
      [class.translate-y-0]="cartService.isOpen()"
      [class.md:translate-x-0]="cartService.isOpen()"
    >
      <!-- Mobile Drag Handle -->
      <div class="md:hidden flex justify-center pt-3 pb-1">
        <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
      </div>

      <!-- Header -->
      <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-gray-900">Your Cart</h2>
            <p class="text-xs sm:text-sm text-gray-500">{{ cartService.itemCount() }} item{{ cartService.itemCount() !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <button 
          (click)="cartService.close()"
          class="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Cart Items - Scrollable -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
        @if (!cartService.hasItems()) {
          <!-- Empty State -->
          <div class="flex flex-col items-center justify-center h-full text-center px-4">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center mb-4 sm:mb-5">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p class="text-gray-500 text-sm sm:text-base mb-6">Add some products to get started!</p>
            <button 
              (click)="cartService.close()" 
              routerLink="/products"
              class="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]"
            >
              Browse Products
            </button>
          </div>
        } @else {
          <!-- Cart Items List -->
          <div class="space-y-3 sm:space-y-4">
            @for (item of cartService.items(); track item.product.id) {
              <div class="flex gap-3 sm:gap-4 bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 relative">
                <!-- Product Image -->
                @if (item.product.coverImageUrl) {
                  <img 
                    [src]="item.product.coverImageUrl" 
                    [alt]="item.product.title"
                    class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                    loading="lazy"
                  >
                } @else {
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center">
                    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                }

                <!-- Product Details -->
                <div class="flex-1 min-w-0 pr-6">
                  <a 
                    [routerLink]="['/product', item.product.id]"
                    (click)="cartService.close()"
                    class="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 text-sm sm:text-base"
                  >
                    {{ item.product.title }}
                  </a>
                  <div class="mt-1 text-base sm:text-lg font-bold text-gray-900">
                    ₹{{ item.product.price / 100 }}
                  </div>

                  <!-- Quantity Controls - Touch optimized -->
                  <div class="flex items-center gap-1 mt-2">
                    <div class="inline-flex items-center bg-white border border-gray-200 rounded-lg">
                      <button 
                        (click)="cartService.decrementQuantity(item.product.id)"
                        class="p-2.5 hover:bg-gray-50 active:bg-gray-100 rounded-l-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                        [disabled]="item.quantity <= 1"
                        [class.opacity-40]="item.quantity <= 1"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span class="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2.5rem] text-center">
                        {{ item.quantity }}
                      </span>
                      <button 
                        (click)="cartService.incrementQuantity(item.product.id)"
                        class="p-2.5 hover:bg-gray-50 active:bg-gray-100 rounded-r-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Remove Button - Always visible on mobile -->
                <button 
                  (click)="cartService.removeItem(item.product.id)"
                  class="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm hover:bg-red-50 active:bg-red-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer with Total & Checkout - Fixed at bottom -->
      @if (cartService.hasItems()) {
        <div class="border-t border-gray-100 p-4 sm:p-6 bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] safe-area-bottom">
          <!-- Summary -->
          <div class="space-y-1.5 sm:space-y-2 mb-4">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({{ cartService.itemCount() }} items)</span>
              <span>₹{{ cartService.totalPrice() / 100 }}</span>
            </div>
            <div class="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-2 border-t border-gray-200/50">
              <span>Total</span>
              <span>₹{{ cartService.totalPrice() / 100 }}</span>
            </div>
          </div>

          <!-- Actions - Full width touch-friendly buttons -->
          <div class="space-y-2.5 sm:space-y-3">
            <button 
              (click)="handleCheckout()"
              [disabled]="isCheckingOut"
              class="w-full py-4 text-base font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[52px]"
            >
              @if (isCheckingOut) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              } @else {
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Checkout · ₹{{ cartService.totalPrice() / 100 }}
                </span>
              }
            </button>
            <button 
              (click)="cartService.close()"
              routerLink="/products"
              class="w-full py-3.5 text-sm font-semibold bg-white/80 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 active:bg-white transition-colors min-h-[48px]"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Trust Badges - Compact -->
          <div class="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-gray-200/50">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <span>Secure</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .safe-area-bottom {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
  `]
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);

  isCheckingOut = false;

  async handleCheckout() {
    if (!this.cartService.hasItems()) return;

    if (!this.authService.isSignedIn()) {
      const returnUrl = window.location.href;
      window.location.href = this.subdomainService.getMainSiteUrl(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    this.isCheckingOut = true;
    try {
      const productIds = this.cartService.productIds();
      const order = await this.checkoutService.createOrder(productIds);
      
      if (!order) throw new Error('Failed to create order');
      
      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) throw new Error('Failed to initiate payment');
      
      const userEmail = this.authService.user()?.email || '';
      const success = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);
      
      if (success) {
        this.cartService.clear();
        this.cartService.close();
        window.location.href = this.subdomainService.getMainSiteUrl('/library');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      this.isCheckingOut = false;
    }
  }
}
