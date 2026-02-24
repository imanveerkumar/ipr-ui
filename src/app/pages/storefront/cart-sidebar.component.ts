import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, STORE_COLORS } from '../../core/services/cart.service';
import { CheckoutService, CartValidationResult } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { ToasterService } from '../../core/services/toaster.service';
import { CartValidationModalComponent } from './cart-validation-modal.component';

type ViewState = 'cart' | 'checkout';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CartValidationModalComponent],
  template: `
    <!-- Overlay -->
    @if (cartService.isOpen()) {
      <div 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        (click)="handleOverlayClick()"
      ></div>
    }

    <!-- Cart Panel - Full screen on mobile, sidebar on desktop -->
    <div 
      class="fixed z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
             bottom-0 left-0 right-0 h-[92vh] rounded-t-[2rem]
             md:top-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:w-full md:max-w-md md:rounded-none"
      [class.translate-y-full]="!cartService.isOpen()"
      [class.md:translate-y-0]="true"
      [class.md:translate-x-full]="!cartService.isOpen()"
      [class.translate-y-0]="cartService.isOpen()"
      [class.md:translate-x-0]="cartService.isOpen()"
    >
      <!-- Mobile Drag Handle -->
      <div class="md:hidden flex justify-center pt-3 pb-2 touch-none" (touchstart)="onDragStart($event)" (touchmove)="onDragMove($event)" (touchend)="onDragEnd()">
        <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      <!-- Header with step indicator -->
      <div class="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div class="flex items-center gap-3">
          @if (currentView() === 'checkout') {
            <button 
              (click)="goBackToCart()"
              class="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          }
          <div>
            <h2 class="text-base font-bold text-gray-900">
              {{ currentView() === 'cart' ? 'Your Cart' : 'Checkout' }}
            </h2>
            <div class="flex items-center gap-2 mt-0.5">
              <!-- Step indicators -->
              <div class="flex items-center gap-1.5 text-[10px]">
                <span class="flex items-center gap-1" [class.text-gray-900]="currentView() === 'cart'" [class.text-gray-400]="currentView() !== 'cart'">
                  <span class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                        [class.bg-gray-900]="currentView() === 'cart'" [class.text-white]="currentView() === 'cart'"
                        [class.bg-gray-200]="currentView() !== 'cart'">1</span>
                  <span class="hidden sm:inline">Cart</span>
                </span>
                <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="flex items-center gap-1" [class.text-gray-900]="currentView() === 'checkout'" [class.text-gray-400]="currentView() !== 'checkout'">
                  <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        [class.bg-gray-900]="currentView() === 'checkout'" [class.text-white]="currentView() === 'checkout'"
                        [class.bg-gray-200]="currentView() !== 'checkout'">2</span>
                  <span class="hidden sm:inline">Payment</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          (click)="cartService.close(); resetView()"
          class="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Main Content Area with view transitions -->
      <div class="flex-1 overflow-hidden relative">
        <!-- CART VIEW -->
        <div 
          class="absolute inset-0 transition-all duration-300 ease-out overflow-y-auto overscroll-contain"
          [class.translate-x-0]="currentView() === 'cart'"
          [class.-translate-x-full]="currentView() === 'checkout'"
          [class.opacity-100]="currentView() === 'cart'"
          [class.opacity-0]="currentView() === 'checkout'"
        >
          <div class="p-4 sm:p-5 pb-48">
            @if (!cartService.hasItems()) {
              <!-- Empty State - Premium design -->
              <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div class="relative mb-6">
                  <div class="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p class="text-gray-500 text-xs mb-6 max-w-[180px]">Discover amazing digital products and add them to your cart</p>
                <button 
                  (click)="cartService.close()" 
                  [routerLink]="authService.isSignedIn() ? '/explore' : '/products'"
                  class="w-full px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-all min-h-[44px] shadow-lg shadow-gray-900/20"
                >
                  Browse Products
                </button>
              </div>
            } @else {
              <!-- Multi-store notice -->
              @if (cartService.hasMultipleStores()) {
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 mb-3">
                  <div class="flex items-start gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-xs font-medium text-blue-900">Products from {{ cartService.storeCount() }} different stores</p>
                      <p class="text-[10px] text-blue-700 mt-0.5">Items are color-coded by store for easy identification</p>
                    </div>
                  </div>
                </div>
              }

              <!-- Cart Items grouped by Store -->
              <div class="space-y-4">
                @for (group of cartService.storeGroups(); track group.storeId; let groupIndex = $index) {
                  <div class="relative">
                    <!-- Store Header (only shown when multiple stores) -->
                    @if (cartService.hasMultipleStores()) {
                      <div class="flex items-center gap-2 mb-2">
                        <div 
                          class="w-2 h-2 rounded-full"
                          [class]="getStoreAccentColor(group.colorIndex)"
                        ></div>
                        <span class="text-xs font-semibold text-gray-700">{{ group.storeName }}</span>
                        <span 
                          class="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          [class]="getStoreBadgeColor(group.colorIndex)"
                        >
                          {{ group.items.length }} item{{ group.items.length !== 1 ? 's' : '' }}
                        </span>
                      </div>
                    }

                    <!-- Items in this store group -->
                    <div class="space-y-2.5">
                      @for (item of group.items; track item.product.id; let i = $index) {
                        <div 
                          class="rounded-xl p-2.5 relative shadow-sm hover:shadow-md transition-shadow"
                          [class]="cartService.hasMultipleStores() 
                            ? getStoreItemClasses(group.colorIndex) 
                            : 'bg-white border border-gray-100'"
                          [style.animation-delay]="(groupIndex * 50 + i * 30) + 'ms'"
                          style="animation: slideUp 0.3s ease-out forwards;"
                        >
                          <!-- Store color indicator stripe (mobile-friendly) -->
                          @if (cartService.hasMultipleStores()) {
                            <div 
                              class="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                              [class]="getStoreAccentColor(group.colorIndex)"
                            ></div>
                          }

                          <div class="flex gap-2.5" [class.pl-2]="cartService.hasMultipleStores()">
                            <!-- Product Image -->
                            <div class="relative flex-shrink-0">
                              @if (item.product.coverImageUrl) {
                                <img 
                                  [src]="item.product.coverImageUrl" 
                                  [alt]="item.product.title"
                                  class="w-16 h-16 object-cover rounded-lg"
                                  loading="lazy"
                                >
                              } @else {
                                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center">
                                  <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                  </svg>
                                </div>
                              }
                            </div>

                            <!-- Product Details -->
                            <div class="flex-1 min-w-0">
                              <div class="flex items-start justify-between gap-2">
                                <a 
                                  [routerLink]="['/product', item.product.id]"
                                  (click)="cartService.close()"
                                  class="font-semibold text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 text-xs leading-snug"
                                >
                                  {{ item.product.title }}
                                </a>
                                <button 
                                  (click)="cartService.removeItem(item.product.id)"
                                  class="p-1 rounded-full hover:bg-red-50 active:bg-red-100 transition-colors flex-shrink-0"
                                >
                                  <svg class="w-3.5 h-3.5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                  </svg>
                                </button>
                              </div>

                              <!-- Store name badge (when single store, show store info inline) -->
                              @if (!cartService.hasMultipleStores() && item.product.store) {
                                <p class="text-[10px] text-gray-500 mt-0.5">
                                  From: {{ item.product.store.name }}
                                </p>
                              }
                              
                              <div class="mt-2 flex items-center justify-between">
                                <!-- Quantity Controls -->
                                <div class="inline-flex items-center bg-gray-100 rounded-full">
                                  <button 
                                    (click)="cartService.decrementQuantity(item.product.id)"
                                    class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors"
                                    [disabled]="item.quantity <= 1"
                                    [class.opacity-40]="item.quantity <= 1"
                                  >
                                    <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"/>
                                    </svg>
                                  </button>
                                  <span class="px-2.5 text-xs font-bold text-gray-900 min-w-[1.75rem] text-center">
                                    {{ item.quantity }}
                                  </span>
                                  <button 
                                    (click)="cartService.incrementQuantity(item.product.id)"
                                    class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors"
                                  >
                                    <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                                    </svg>
                                  </button>
                                </div>
                                
                                <!-- Price -->
                                <div class="text-right">
                                  <div class="text-sm font-bold text-gray-900">₹{{ (item.product.price * item.quantity) / 100 }}</div>
                                  @if (item.quantity > 1) {
                                    <div class="text-[10px] text-gray-500">₹{{ item.product.price / 100 }} each</div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Store subtotal (only shown when multiple stores) -->
                    @if (cartService.hasMultipleStores()) {
                      <div class="flex justify-end mt-2 mb-1">
                        <span class="text-[10px] text-gray-500">
                          Subtotal: <span class="font-semibold text-gray-700">₹{{ group.totalPrice / 100 }}</span>
                        </span>
                      </div>
                    }
                  </div>
                }
              </div>

              <!-- Add more products hint -->
              <button
                (click)="cartService.close()"
                [routerLink]="authService.isSignedIn() ? '/explore' : '/products'"
                class="mt-3 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add more products
              </button>
            }
          </div>
        </div>

        <!-- CHECKOUT VIEW -->
        <div 
          class="absolute inset-0 transition-all duration-300 ease-out overflow-y-auto overscroll-contain"
          [class.translate-x-0]="currentView() === 'checkout'"
          [class.translate-x-full]="currentView() === 'cart'"
          [class.opacity-100]="currentView() === 'checkout'"
          [class.opacity-0]="currentView() === 'cart'"
        >
          <div class="p-4 sm:p-5 pb-48">
            <!-- Guest Checkout Banner - Show only when not signed in -->
            @if (!authService.isSignedIn()) {
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 mb-3">
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xs font-bold text-blue-900 mb-0.5">Quick Guest Checkout</h4>
                    <p class="text-[10px] text-blue-700 leading-relaxed">No account needed! Just enter your email below and complete payment to get instant access to your downloads.</p>
                  </div>
                </div>
              </div>
            }

            <!-- Order Summary Card -->
            <div class="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-3 mb-3">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Order Summary</h3>
              
              <!-- Items compact list -->
              <div class="space-y-1.5 mb-3">
                @for (item of cartService.items(); track item.product.id) {
                  <div class="flex items-center gap-2.5">
                    @if (item.product.coverImageUrl) {
                      <img [src]="item.product.coverImageUrl" class="w-9 h-9 rounded-lg object-cover" />
                    } @else {
                      <div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                    }
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-gray-900 truncate">{{ item.product.title }}</p>
                      <p class="text-[10px] text-gray-500">Qty: {{ item.quantity }}</p>
                    </div>
                    <span class="text-xs font-semibold text-gray-900">₹{{ (item.product.price * item.quantity) / 100 }}</span>
                  </div>
                }
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-200 my-2.5"></div>

              <!-- Price breakdown -->
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="text-gray-900">₹{{ cartService.totalPrice() / 100 }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Platform fee</span>
                  <span class="text-green-600 font-medium">Free</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600">Taxes</span>
                  <span class="text-gray-900">Included</span>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-200 my-2.5"></div>

              <!-- Total -->
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-900">Total</span>
                <div class="text-right">
                  <span class="text-xl font-bold text-gray-900">₹{{ cartService.totalPrice() / 100 }}</span>
                  <p class="text-[10px] text-gray-500">INR</p>
                </div>
              </div>
            </div>

            <!-- What you'll get -->
            <div class="bg-blue-50 rounded-xl p-3 mb-3">
              <h3 class="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                What you'll get
              </h3>
              <ul class="space-y-1.5">
                <li class="flex items-start gap-1.5 text-xs text-blue-800">
                  <svg class="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Instant access to download all files
                </li>
                <li class="flex items-start gap-1.5 text-xs text-blue-800">
                  <svg class="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Lifetime access to your purchases
                </li>
                <li class="flex items-start gap-1.5 text-xs text-blue-800">
                  <svg class="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Future updates included
                </li>
              </ul>
            </div>

            <!-- Guest Form -->
            @if (!authService.isSignedIn()) {
              <div class="bg-white rounded-xl border border-gray-100 p-3 mb-3">
                <div class="flex items-center justify-between mb-2.5">
                  <h3 class="text-xs font-semibold text-gray-900">Your Details</h3>
                  <span class="text-[9px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Guest Checkout</span>
                </div>
                <div class="space-y-2.5">
                  <div>
                    <label class="block text-[10px] font-medium text-gray-600 mb-1">Email Address *</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <input 
                        type="email" 
                        [(ngModel)]="guestEmail"
                        placeholder="your@email.com"
                        class="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 focus:bg-white text-xs transition-all"
                        [class.border-red-300]="guestEmailError()"
                        [class.bg-red-50]="guestEmailError()"
                        (input)="validateGuestEmail()"
                        (blur)="validateGuestEmail()"
                      >
                    </div>
                    @if (guestEmailError()) {
                      <p class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ guestEmailError() }}
                      </p>
                    }
                  </div>
                  <div>
                    <label class="block text-[10px] font-medium text-gray-600 mb-1">Phone Number *</label>
                    <div class="flex gap-1.5">
                      <select
                        [(ngModel)]="selectedCountryCode"
                        class="w-[85px] py-2 px-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 focus:bg-white text-xs transition-all appearance-none cursor-pointer"
                        [class.border-red-300]="guestPhoneError()"
                        [class.bg-red-50]="guestPhoneError()"
                        style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-repeat: no-repeat; background-position: right 4px center; background-size: 14px;"
                      >
                        @for (country of countryCodes; track country.code) {
                          <option [value]="country.dial">{{ country.flag }} {{ country.dial }}</option>
                        }
                      </select>
                      <div class="relative flex-1">
                        <input 
                          type="tel" 
                          [(ngModel)]="guestPhoneNumber"
                          placeholder="98765 43210"
                          class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 focus:bg-white text-xs transition-all"
                          [class.border-red-300]="guestPhoneError()"
                          [class.bg-red-50]="guestPhoneError()"
                          (input)="validateGuestPhone()"
                          (blur)="validateGuestPhone()"
                        >
                      </div>
                    </div>
                    @if (guestPhoneError()) {
                      <p class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {{ guestPhoneError() }}
                      </p>
                    }
                  </div>
                </div>
                <div class="mt-2 bg-green-50 border border-green-100 rounded-lg p-2">
                  <p class="text-[10px] text-green-800 flex items-start gap-1.5 font-medium">
                    <svg class="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Your download links will be sent to this email immediately after payment. No account registration required!</span>
                  </p>
                </div>
              </div>

              <!-- Sign in option -->
              <div class="text-center py-2 mb-3 border-t border-gray-100">
                <p class="text-[10px] text-gray-500 mb-1">Already have an account?</p>
                <button 
                  (click)="openSignIn()"
                  class="text-xs text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                >
                  Sign in instead
                </button>
              </div>
            }

            <!-- Logged in user info -->
            @if (authService.isSignedIn()) {
              <div class="bg-green-50 rounded-xl p-3 mb-3 flex items-center gap-2.5">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-green-900">Signed in as</p>
                  <p class="text-xs text-green-700">{{ authService.user()?.email }}</p>
                </div>
              </div>
            }

            <!-- Payment security badge -->
            <div class="flex items-center justify-center gap-3 py-3 text-xs text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Secure payment
              </div>
              <span class="text-gray-300">•</span>
              <div class="flex items-center gap-1.5">
                <img src="https://razorpay.com/assets/razorpay-logo-icon.svg" class="h-4" alt="Razorpay" />
                <span>Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      @if (cartService.hasItems()) {
        <div 
          class="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom"
          style="box-shadow: 0 -4px 20px rgba(0,0,0,0.08);"
        >
          @if (currentView() === 'cart') {
            <!-- Cart View Footer -->
            <div class="flex items-center justify-between mb-2.5">
              <div>
                <p class="text-[10px] text-gray-500">{{ cartService.itemCount() }} item{{ cartService.itemCount() !== 1 ? 's' : '' }}</p>
                <p class="text-lg font-bold text-gray-900">₹{{ cartService.totalPrice() / 100 }}</p>
              </div>
              <div class="text-right">
                @if (totalSavings() > 0) {
                  <span class="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    You save ₹{{ totalSavings() / 100 }}
                  </span>
                }
              </div>
            </div>
            <button 
              (click)="proceedToCheckout()"
              [disabled]="isValidating"
              class="w-full py-3 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px] shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
            >
              @if (isValidating) {
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validating...</span>
              } @else {
                Continue to Checkout
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              }
            </button>
          } @else {
            <!-- Checkout View Footer -->
            <button 
              (click)="authService.isSignedIn() ? handleCheckout() : handleGuestCheckout()"
              [disabled]="isCheckingOut || isValidating || cartService.totalPrice() === 0 || (!authService.isSignedIn() && (!guestEmail || !guestPhoneNumber))"
              class="w-full py-3 text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 active:from-gray-950 active:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px] shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
            >
              @if (isCheckingOut || isValidating) {
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isValidating ? 'Validating...' : 'Processing...' }}</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span>Pay ₹{{ cartService.totalPrice() / 100 }}</span>
              }
            </button>
            <p class="mt-1.5 text-center text-[10px] text-gray-500">
              By purchasing, you agree to our Terms of Service
            </p>
          }
        </div>
      }
    </div>

    <!-- Cart Validation Modal -->
    <app-cart-validation-modal
      [isOpen]="showValidationModal()"
      [validation]="cartValidation()"
      (close)="closeValidationModal()"
      (removeItem)="removeInvalidItem($event)"
      (removeAllUnavailable)="removeAllInvalidItems()"
    />
  `,
  styles: [`
    .safe-area-bottom {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  isCheckingOut = false;
  isValidating = false;
  
  // View state - cart or checkout
  currentView = signal<ViewState>('cart');

  // Cart validation state
  showValidationModal = signal(false);
  cartValidation = signal<CartValidationResult | null>(null);
  
  // Guest checkout state
  showGuestForm = signal(false);
  guestEmail = '';
  guestPhoneNumber = '';
  selectedCountryCode = '+91';
  guestEmailError = signal<string>('');
  guestPhoneError = signal<string>('');

  // Country codes list
  countryCodes = [
    { code: 'IN', dial: '+91', flag: '🇮🇳' },
    { code: 'US', dial: '+1', flag: '🇺🇸' },
    { code: 'GB', dial: '+44', flag: '🇬🇧' },
    { code: 'CA', dial: '+1', flag: '🇨🇦' },
    { code: 'AU', dial: '+61', flag: '🇦🇺' },
    { code: 'DE', dial: '+49', flag: '🇩🇪' },
    { code: 'FR', dial: '+33', flag: '🇫🇷' },
    { code: 'AE', dial: '+971', flag: '🇦🇪' },
    { code: 'SG', dial: '+65', flag: '🇸🇬' },
    { code: 'JP', dial: '+81', flag: '🇯🇵' },
    { code: 'CN', dial: '+86', flag: '🇨🇳' },
    { code: 'BR', dial: '+55', flag: '🇧🇷' },
    { code: 'MX', dial: '+52', flag: '🇲🇽' },
    { code: 'RU', dial: '+7', flag: '🇷🇺' },
    { code: 'ZA', dial: '+27', flag: '🇿🇦' },
    { code: 'NZ', dial: '+64', flag: '🇳🇿' },
    { code: 'IT', dial: '+39', flag: '🇮🇹' },
    { code: 'ES', dial: '+34', flag: '🇪🇸' },
    { code: 'NL', dial: '+31', flag: '🇳🇱' },
    { code: 'SE', dial: '+46', flag: '🇸🇪' },
    { code: 'CH', dial: '+41', flag: '🇨🇭' },
    { code: 'PK', dial: '+92', flag: '🇵🇰' },
    { code: 'BD', dial: '+880', flag: '🇧🇩' },
    { code: 'LK', dial: '+94', flag: '🇱🇰' },
    { code: 'NP', dial: '+977', flag: '🇳🇵' },
    { code: 'MY', dial: '+60', flag: '🇲🇾' },
    { code: 'ID', dial: '+62', flag: '🇮🇩' },
    { code: 'TH', dial: '+66', flag: '🇹🇭' },
    { code: 'PH', dial: '+63', flag: '🇵🇭' },
    { code: 'VN', dial: '+84', flag: '🇻🇳' },
    { code: 'KR', dial: '+82', flag: '🇰🇷' },
    { code: 'HK', dial: '+852', flag: '🇭🇰' },
    { code: 'TW', dial: '+886', flag: '🇹🇼' },
  ];

  // Computed: full phone number
  get guestPhone(): string {
    return this.guestPhoneNumber ? `${this.selectedCountryCode}${this.guestPhoneNumber.replace(/\s/g, '')}` : '';
  }

  // Drag state for mobile
  private dragStartY = 0;
  private isDragging = false;

  // Computed: total savings
  totalSavings = computed(() => {
    return this.cartService.items().reduce((total, item) => {
      if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
        return total + ((item.product.compareAtPrice - item.product.price) * item.quantity);
      }
      return total;
    }, 0);
  });

  // Store color helper methods
  getStoreAccentColor(colorIndex: number): string {
    return STORE_COLORS[colorIndex % STORE_COLORS.length].accent;
  }

  getStoreBadgeColor(colorIndex: number): string {
    return STORE_COLORS[colorIndex % STORE_COLORS.length].badge;
  }

  getStoreItemClasses(colorIndex: number): string {
    const colors = STORE_COLORS[colorIndex % STORE_COLORS.length];
    return `${colors.bg} border ${colors.border}`;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    // Validate phone number (without country code) - should be 6-15 digits
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[0-9]{6,15}$/;
    return phoneRegex.test(cleanPhone);
  }

  // Real-time validation methods for guest checkout
  validateGuestEmail() {
    if (!this.guestEmail) {
      this.guestEmailError.set('Email address is required');
    } else if (!this.validateEmail(this.guestEmail)) {
      this.guestEmailError.set('Please enter a valid email address');
    } else {
      this.guestEmailError.set('');
    }
  }

  validateGuestPhone() {
    if (!this.guestPhoneNumber) {
      this.guestPhoneError.set('Phone number is required');
    } else if (!this.validatePhone(this.guestPhoneNumber)) {
      this.guestPhoneError.set('Please enter a valid phone number (6-15 digits)');
    } else {
      this.guestPhoneError.set('');
    }
  }

  // Cart validation methods
  async validateCartBeforeCheckout(): Promise<boolean> {
    if (!this.cartService.hasItems()) return false;

    this.isValidating = true;
    try {
      const productIds = this.cartService.productIds();
      const validation = await this.checkoutService.validateCart(productIds);
      
      if (!validation) {
        // API error - allow proceeding (validation will happen server-side)
        return true;
      }

      this.cartValidation.set(validation);

      if (!validation.isValid) {
        this.showValidationModal.set(true);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Cart validation failed:', error);
      // On error, allow proceeding (server will validate again)
      return true;
    } finally {
      this.isValidating = false;
    }
  }

  closeValidationModal() {
    this.showValidationModal.set(false);
  }

  removeInvalidItem(productId: string) {
    this.cartService.removeItem(productId);
    
    // Update validation result
    const validation = this.cartValidation();
    if (validation) {
      const updatedUnavailable = validation.unavailableItems.filter(
        item => item.productId !== productId
      );
      
      if (updatedUnavailable.length === 0) {
        this.closeValidationModal();
      } else {
        this.cartValidation.set({
          ...validation,
          unavailableItems: updatedUnavailable,
          summary: {
            ...validation.summary,
            invalidItems: updatedUnavailable.length,
            totalItems: validation.summary.totalItems - 1,
          }
        });
      }
    }
  }

  removeAllInvalidItems() {
    const validation = this.cartValidation();
    if (validation) {
      validation.unavailableItems.forEach(item => {
        this.cartService.removeItem(item.productId);
      });
    }
    this.closeValidationModal();
  }

  handleOverlayClick() {
    if (this.currentView() === 'checkout') {
      this.goBackToCart();
    } else {
      this.cartService.close();
    }
  }

  async proceedToCheckout() {
    // Validate cart before proceeding to checkout
    const isValid = await this.validateCartBeforeCheckout();
    if (isValid) {
      this.currentView.set('checkout');
    }
  }

  goBackToCart() {
    this.currentView.set('cart');
    this.guestEmailError.set('');
    this.guestPhoneError.set('');
  }

  resetView() {
    this.currentView.set('cart');
    this.guestEmailError.set('');
    this.guestPhoneError.set('');
    this.showGuestForm.set(false);
  }

  // Touch drag handlers for mobile bottom sheet
  onDragStart(event: TouchEvent) {
    this.dragStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onDragMove(event: TouchEvent) {
    if (!this.isDragging) return;
    const currentY = event.touches[0].clientY;
    const diff = currentY - this.dragStartY;
    
    // If dragging down more than 100px, close the cart
    if (diff > 100) {
      this.cartService.close();
      this.resetView();
      this.isDragging = false;
    }
  }

  onDragEnd() {
    this.isDragging = false;
  }

  async openSignIn() {
    // Open Clerk sign-in modal - user stays on the same page
    await this.authService.signIn();
  }

  async handleGuestCheckout() {
    if (!this.cartService.hasItems()) return;

    // Reset errors
    this.guestEmailError.set('');
    this.guestPhoneError.set('');

    // Validate email
    if (!this.guestEmail) {
      this.guestEmailError.set('Email address is required');
      return;
    }

    if (!this.validateEmail(this.guestEmail)) {
      this.guestEmailError.set('Please enter a valid email address');
      return;
    }

    // Validate phone (now required)
    if (!this.guestPhoneNumber) {
      this.guestPhoneError.set('Phone number is required');
      return;
    }

    if (!this.validatePhone(this.guestPhoneNumber)) {
      this.guestPhoneError.set('Please enter a valid phone number');
      return;
    }

    // Validate cart before payment
    const isValid = await this.validateCartBeforeCheckout();
    if (!isValid) return;

    this.isCheckingOut = true;

    try {
      const productIds = this.cartService.productIds();
      
      // Create guest order
      const order = await this.checkoutService.createGuestOrder(
        productIds,
        this.guestEmail,
        this.guestPhone || undefined
      );
      
      if (!order) throw new Error('Failed to create order');
      
      // Initiate guest payment
      const paymentData = await this.checkoutService.initiateGuestPayment(order.id, this.guestEmail);
      if (!paymentData) throw new Error('Failed to initiate payment');
      
      // Open Razorpay checkout
      const result = await this.checkoutService.openRazorpayCheckout(
        paymentData,
        this.guestEmail,
        this.guestPhone || undefined
      );
      
      if (result.success) {
        this.cartService.clear();
        this.cartService.close();
        this.resetView();
        this.guestEmail = '';
        this.guestPhoneNumber = '';
        
        // Show success message
        this.toaster.success({
          title: 'Purchase Successful!',
          message: 'Check your email for the download link.',
        });
      } else if (result.cancelled) {
        this.toaster.error({
          title: 'Payment Cancelled',
          message: 'You closed the payment window. Please try again when ready.',
        });
      } else {
        this.toaster.error({
          title: 'Payment Failed',
          message: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Guest checkout failed:', error);
      // Check if the error is a validation error from API
      if (error?.message?.includes('Cannot create order')) {
        // Re-validate cart to show the modal
        await this.validateCartBeforeCheckout();
      } else {
        this.guestEmailError.set('Checkout failed. Please try again.');
      }
    } finally {
      this.isCheckingOut = false;
    }
  }

  async handleCheckout() {
    if (!this.cartService.hasItems()) return;

    // Validate cart before payment
    const isValid = await this.validateCartBeforeCheckout();
    if (!isValid) return;

    this.isCheckingOut = true;
    try {
      const productIds = this.cartService.productIds();
      const order = await this.checkoutService.createOrder(productIds);
      
      if (!order) throw new Error('Failed to create order');
      
      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) throw new Error('Failed to initiate payment');
      
      const userEmail = this.authService.user()?.email || '';
      const result = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);
      
      if (result.success) {
        this.cartService.clear();
        this.cartService.close();
        this.resetView();
        
        // Show success message
        this.toaster.success({
          title: 'Purchase Successful!',
          message: 'Redirecting to your library...',
        });
        
        // Use Router on main site for smooth navigation, window.location on storefront
        if (this.subdomainService.isStorefront()) {
          window.location.href = this.subdomainService.getMainSiteUrl('/library');
        } else {
          this.router.navigate(['/library']);
        }
      } else if (result.cancelled) {
        this.toaster.error({
          title: 'Payment Cancelled',
          message: 'You closed the payment window. Please try again when ready.',
        });
      } else {
        this.toaster.error({
          title: 'Payment Failed',
          message: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      // Check if the error is a validation error from API
      if (error?.message?.includes('Cannot create order')) {
        // Re-validate cart to show the modal
        await this.validateCartBeforeCheckout();
      }
    } finally {
      this.isCheckingOut = false;
    }
  }
}
