import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { StoreContextService } from '../../core/services/store-context.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { CartService } from '../../core/services/cart.service';
import { ToasterService } from '../../core/services/toaster.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      @if (loading()) {
        <!-- Loading Skeleton - Mobile optimized -->
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto">
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div class="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div class="aspect-square bg-gray-200 rounded-2xl"></div>
              <div class="space-y-4">
                <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                <div class="h-10 bg-gray-200 rounded w-1/3"></div>
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
                <div class="h-14 bg-gray-200 rounded-xl w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-6xl mx-auto">
          <!-- Breadcrumb - Compact on mobile -->
          <nav class="mb-4 sm:mb-6">
            <ol class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              <li>
                <button (click)="navigateTo('/')" class="text-gray-500 hover:text-gray-900 active:text-gray-700 transition-colors py-1">Home</button>
              </li>
              <li class="text-gray-400">/</li>
              <li>
                <button (click)="navigateTo('/products')" class="text-gray-500 hover:text-gray-900 active:text-gray-700 transition-colors py-1">Products</button>
              </li>
              <li class="text-gray-400">/</li>
              <li class="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[200px]">{{ product()?.title }}</li>
            </ol>
          </nav>

          <div class="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <!-- Product Image -->
            <div class="relative">
              @if (product()?.coverImageUrl) {
                <img 
                  [src]="product()?.coverImageUrl" 
                  [alt]="product()?.title"
                  class="w-full rounded-xl sm:rounded-2xl shadow-sm aspect-square object-cover"
                >
              } @else {
                <div class="aspect-square bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <svg class="w-20 h-20 sm:w-24 sm:h-24 text-gray-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              }
              
              <!-- Discount Badge -->
              @if (product()?.compareAtPrice && product()!.compareAtPrice! > product()!.price) {
                <div class="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span class="px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
                    {{ getDiscount() }}% OFF
                  </span>
                </div>
              }
            </div>

            <!-- Product Details -->
            <div class="flex flex-col">
              <!-- Title -->
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {{ product()?.title }}
              </h1>

              <!-- Price Block -->
              <div class="bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
                <div class="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    ₹{{ (product()?.price || 0) / 100 }}
                  </span>
                  @if (product()?.compareAtPrice && product()!.compareAtPrice! > product()!.price) {
                    <span class="text-base sm:text-lg text-gray-400 line-through">
                      ₹{{ product()!.compareAtPrice! / 100 }}
                    </span>
                    <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold rounded-lg">
                      Save ₹{{ (product()!.compareAtPrice! - product()!.price) / 100 }}
                    </span>
                  }
                </div>
              </div>

              <!-- Action Buttons - Sticky on mobile -->
              <div class="space-y-3 mt-auto">
                @if ((product()?.price || 0) === 0) {
                  <!-- Free product: choose free or pay what you want -->
                  <div class="bg-[#f0fdf4] border border-emerald-200 rounded-xl p-4 space-y-3">
                    <p class="text-sm font-semibold text-gray-700">This product is free! Choose how to get it:</p>

                    <button
                      (click)="downloadForFree()"
                      [disabled]="purchasing()"
                      class="w-full py-4 text-base font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors min-h-[56px]"
                    >
                      @if (purchasing() && selectedFreeOption() === 'free') {
                        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      } @else {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download for Free
                      }
                    </button>

                    <div class="flex items-center gap-2 text-xs text-gray-400">
                      <div class="flex-1 h-px bg-gray-200"></div>
                      <span>or support the creator</span>
                      <div class="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div class="flex gap-2">
                      <div class="relative flex-1">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                        <input
                          type="number"
                          [(ngModel)]="customAmount"
                          min="1"
                          placeholder="Enter amount"
                          class="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-gray-400/30"
                        />
                      </div>
                      <button
                        (click)="payCustomAmount()"
                        [disabled]="purchasing() || !customAmount || customAmount < 1"
                        class="px-4 py-2.5 bg-gray-900 text-white border border-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                      >
                        @if (purchasing() && selectedFreeOption() === 'custom') {
                          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        } @else {
                          Pay ₹{{ customAmount || 0 }}
                        }
                      </button>
                    </div>

                    @if (!authService.isSignedIn() && showGuestEmailInput()) {
                      <div class="space-y-2 pt-1">
                        <p class="text-xs text-gray-500">Enter your email to receive the download link:</p>
                        <input
                          type="email"
                          [(ngModel)]="guestEmail"
                          placeholder="your@email.com"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-gray-400/30"
                        />
                        <button
                          (click)="confirmGuestFreeDownload()"
                          [disabled]="purchasing() || !guestEmail"
                          class="w-full py-3 text-sm font-semibold bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors min-h-[48px]"
                        >
                          @if (purchasing()) {
                            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                            Processing...
                          } @else {
                            Get Free Download
                          }
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <!-- Paid product: standard buy + cart flow -->
                  <button 
                    (click)="handleBuy()"
                    [disabled]="purchasing()"
                    class="w-full py-4 sm:py-5 text-base sm:text-lg font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors min-h-[56px]"
                  >
                    @if (purchasing()) {
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      Buy Now · ₹{{ (product()?.price || 0) / 100 }}
                    }
                  </button>

                  <button 
                    (click)="toggleCart()"
                    class="w-full py-4 text-base font-semibold border-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]"
                    [class.border-gray-200]="!isInCart()"
                    [class.bg-white]="!isInCart()"
                    [class.hover:border-gray-300]="!isInCart()"
                    [class.active:bg-gray-50]="!isInCart()"
                    [class.border-red-500]="isInCart()"
                    [class.bg-red-50]="isInCart()"
                    [class.text-red-700]="isInCart()"
                  >
                    @if (isInCart()) {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                      Remove from Cart
                    } @else {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      Add to Cart
                    }
                  </button>
                }

              </div>

              <!-- Trust Badges - Compact grid -->
              <div class="grid grid-cols-2 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2.5 sm:gap-3 text-sm">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-gray-900 text-xs sm:text-sm">Digital Download</div>
                    <div class="text-gray-500 text-xs truncate">Instant access</div>
                  </div>
                </div>
                <div class="flex items-center gap-2.5 sm:gap-3 text-sm">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-medium text-gray-900 text-xs sm:text-sm">Secure Payment</div>
                    <div class="text-gray-500 text-xs truncate">Razorpay</div>
                  </div>
                </div>
              </div>

              <!-- Copy & Share -->
              <div class="flex gap-2 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
                <button
                  (click)="copyUrl()"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[44px]"
                >
                  @if (copied()) {
                    <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Copied!
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                    Copy Link
                  }
                </button>
                <button
                  (click)="shareUrl()"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-800 hover:text-white active:bg-gray-900 transition-colors min-h-[44px]"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  Share
                </button>
              </div>
            </div>
          </div>

          <!-- Description (full width) -->
          @if (product()?.description) {
            <div class="mt-8 sm:mt-10">
              <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Description
                </h2>
                <div class="prose prose-base prose-gray max-w-none text-gray-600 break-words overflow-hidden [&_*]:max-w-full [&_img]:max-w-full [&_table]:w-full [&_table]:table-fixed [&_pre]:overflow-x-auto" [innerHTML]="product()?.description"></div>
              </div>
            </div>
          }

          <!-- Related Products - Horizontal scroll on mobile -->
          @if (relatedProducts().length > 0) {
            <section class="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-gray-100">
              <h2 class="font-bold text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6">More Products</h2>
              
              <!-- Horizontal scroll on mobile, grid on desktop -->
              <div class="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
                @for (relatedProduct of relatedProducts(); track relatedProduct.id) {
                  <div 
                    (click)="navigateTo('/product/' + relatedProduct.id)" 
                    class="flex-shrink-0 w-[45vw] sm:w-[35vw] md:w-auto snap-center bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg active:shadow-md transition-all cursor-pointer group"
                  >
                    @if (relatedProduct.coverImageUrl) {
                      <div class="aspect-square overflow-hidden">
                        <img 
                          [src]="relatedProduct.coverImageUrl" 
                          [alt]="relatedProduct.title"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        >
                      </div>
                    } @else {
                      <div class="aspect-square bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                    }
                    <div class="p-3 sm:p-4">
                      <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5">
                        {{ relatedProduct.title }}
                      </h3>
                      <span class="text-base font-bold text-gray-900">
                        ₹{{ relatedProduct.price / 100 }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- Back Button -->
          <div class="mt-6 sm:mt-8">
            <button 
              (click)="navigateTo('/products')" 
              class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors font-medium min-h-[48px]"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      } @else {
        <!-- Product Not Found - Mobile friendly -->
        <div class="px-3 sm:px-4 md:px-6 py-10 sm:py-16 max-w-lg mx-auto">
          <div class="bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-5 sm:mb-6">
              <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p class="text-gray-600 text-sm sm:text-base mb-6">This product doesn't exist or has been removed.</p>
            <button 
              (click)="navigateTo('/products')" 
              class="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]"
            >
              Browse Products
            </button>
          </div>
        </div>
      }
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
export class StorefrontProductComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  storeContext = inject(StoreContextService);
  checkoutService = inject(CheckoutService);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  cartService = inject(CartService);
  private toaster = inject(ToasterService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  purchasing = signal(false);
  copied = signal(false);

  // Free / pay-what-you-want state
  customAmount = 0;
  guestEmail = '';
  showGuestEmailInput = signal(false);
  selectedFreeOption = signal<'free' | 'custom' | null>(null);

  private routeSub?: Subscription;

  async ngOnInit() {
    await this.parseAndLoadProduct(this.router.url);
    
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.parseAndLoadProduct(event.urlAfterRedirects || event.url);
    });
  }
  
  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
  
  private async parseAndLoadProduct(url: string) {
    const path = url.split('?')[0];
    const match = path.match(/\/product\/([^/]+)/);
    if (match && match[1]) {
      this.loading.set(true);
      await this.loadProduct(match[1]);
      this.loading.set(false);
    }
  }
  
  navigateTo(path: string): void {
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  async loadProduct(id: string) {
    const product = await this.storeContext.getProduct(id);
    this.product.set(product);
    
    if (product) {
      const related = this.storeContext.products()
        .filter(p => p.id !== product.id)
        .slice(0, 4);
      this.relatedProducts.set(related);
    }
  }

  getDiscount(): number {
    const product = this.product();
    if (!product?.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  isInCart(): boolean {
    const product = this.product();
    return product ? this.cartService.isInCart(product.id) : false;
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addItem(product);
    }
  }

  removeFromCart() {
    const product = this.product();
    if (product) {
      this.cartService.removeItem(product.id);
    }
  }

  toggleCart() {
    if (this.isInCart()) {
      this.removeFromCart();
    } else {
      this.addToCart();
    }
  }

  handleBuy() {
    const product = this.product();
    if (!product) return;

    // Add product to cart and open cart sidebar for checkout
    // This allows both guest and authenticated checkout flows
    this.cartService.addItem(product);
    this.cartService.open();
  }

  /** Handle "Download for Free" on a ₹0 product */
  async downloadForFree() {
    const product = this.product();
    if (!product) return;

    // Guest: reveal email input first
    if (!this.authService.isSignedIn()) {
      this.showGuestEmailInput.set(true);
      this.selectedFreeOption.set('free');
      return;
    }

    this.selectedFreeOption.set('free');
    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({ title: 'Error', message: 'Failed to create order. Please try again.' });
        return;
      }

      const result = await this.checkoutService.completeFreeOrder(order.id);
      if (result?.success) {
        this.toaster.success({ title: 'Download Ready!', message: 'The product has been added to your library.' });
        this.router.navigate(['/library']);
      } else {
        this.toaster.error({ title: 'Error', message: 'Failed to process free download. Please try again.' });
      }
    } catch (error) {
      console.error('Free download failed:', error);
      this.toaster.handleError(error, 'Failed to process free download. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  /** Handle guest free download after email entry */
  async confirmGuestFreeDownload() {
    const product = this.product();
    if (!product || !this.guestEmail) return;

    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createGuestOrder([product.id], this.guestEmail);
      if (!order) {
        this.toaster.error({ title: 'Error', message: 'Failed to create order. Please try again.' });
        return;
      }

      const result = await this.checkoutService.completeGuestFreeOrder(order.id, this.guestEmail);
      if (result?.success) {
        this.toaster.success({ title: 'Download Ready!', message: 'A download link has been sent to your email.' });
        if (result.downloadToken) {
          this.router.navigate(['/guest/downloads', result.downloadToken]);
        }
      } else {
        this.toaster.error({ title: 'Error', message: 'Failed to process free download. Please try again.' });
      }
    } catch (error) {
      console.error('Guest free download failed:', error);
      this.toaster.handleError(error, 'Failed to process free download. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  /** Handle custom amount payment on a ₹0 product */
  async payCustomAmount() {
    const product = this.product();
    if (!product || !this.customAmount || this.customAmount < 1) return;

    // Guests: add to cart and open sidebar
    if (!this.authService.isSignedIn()) {
      this.cartService.addItem(product);
      this.cartService.open();
      return;
    }

    this.selectedFreeOption.set('custom');
    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({ title: 'Order Failed', message: 'Failed to create order. Please try again.' });
        return;
      }

      const paymentData = await this.checkoutService.initiatePayment(order.id, this.customAmount);
      if (!paymentData) {
        this.toaster.error({ title: 'Payment Failed', message: 'Failed to initiate payment. Please try again.' });
        return;
      }

      const userEmail = this.authService.user()?.email || '';
      const result = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);

      if (result.success) {
        this.toaster.success({ title: 'Thank you for your support!', message: 'Check your library to access your files.' });
      } else if (result.cancelled) {
        this.toaster.error({ title: 'Payment Cancelled', message: 'You closed the payment window. Please try again when ready.' });
      } else {
        this.toaster.error({ title: 'Payment Failed', message: result.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Custom amount payment failed:', error);
      this.toaster.handleError(error, 'Payment failed. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  async copyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.copied.set(true);
      this.toaster.success({ title: 'Link Copied', message: 'URL copied to clipboard' });
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.toaster.error({ title: 'Copy Failed', message: 'Could not copy URL' });
    }
  }

  async shareUrl() {
    const product = this.product();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || 'Product',
          text: `Check out ${product?.title || 'this product'}`,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await this.copyUrl();
    }
  }
}
