import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartValidationResult, CartValidationItem } from '../../core/services/checkout.service';
import { STORE_COLORS } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-validation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300"
        (click)="onClose()"
      ></div>

      <!-- Modal Container - Centered on desktop, bottom sheet on mobile -->
      <div class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div 
          class="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slideUp sm:animate-fadeIn"
          (click)="$event.stopPropagation()"
        >
          <!-- Drag Handle (Mobile only) -->
          <div class="sm:hidden flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-5 py-4 border-b border-gray-100 flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-gray-900">Unable to Proceed</h2>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ validation?.summary?.invalidItems || 0 }} item{{ (validation?.summary?.invalidItems || 0) !== 1 ? 's' : '' }} 
                in your cart {{ (validation?.summary?.invalidItems || 0) !== 1 ? 'are' : 'is' }} no longer available
              </p>
            </div>
            <button 
              (click)="onClose()"
              class="p-2 -mt-1 -mr-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <!-- Info Banner -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
              <div class="flex items-start gap-2.5">
                <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-amber-800">
                  Please remove the unavailable items from your cart to continue with your purchase.
                </p>
              </div>
            </div>

            <!-- Unavailable Items List -->
            <div class="space-y-3">
              @for (item of validation?.unavailableItems || []; track item.productId) {
                <div class="bg-white border border-red-100 rounded-xl p-3.5 shadow-sm">
                  <div class="flex gap-3">
                    <!-- Product Image -->
                    <div class="flex-shrink-0">
                      @if (item.productCoverImageUrl) {
                        <img 
                          [src]="item.productCoverImageUrl" 
                          [alt]="item.productTitle"
                          class="w-14 h-14 object-cover rounded-lg"
                        >
                      } @else {
                        <div class="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                      }
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-semibold text-gray-900 line-clamp-1">{{ item.productTitle }}</h4>
                      <p class="text-xs text-gray-500 mt-0.5">
                        From: {{ item.storeName }}
                      </p>
                      
                      <!-- Error Messages -->
                      <div class="mt-2 space-y-1">
                        @for (error of item.errors; track error) {
                          <div class="flex items-start gap-1.5">
                            <svg class="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            <span class="text-xs text-red-600">{{ error }}</span>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <button 
                      (click)="onRemoveItem(item.productId)"
                      class="flex-shrink-0 p-2 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors"
                      title="Remove from cart"
                    >
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Valid Items Summary (if any) -->
            @if (validation && validation.summary.validItems > 0) {
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>
                    {{ validation.summary.validItems }} other item{{ validation.summary.validItems !== 1 ? 's' : '' }} 
                    in your cart {{ validation.summary.validItems !== 1 ? 'are' : 'is' }} still available
                  </span>
                </div>
              </div>
            }
          </div>

          <!-- Footer Actions -->
          <div class="px-5 py-4 border-t border-gray-100 bg-gray-50 safe-area-bottom">
            <div class="flex flex-col sm:flex-row gap-2.5">
              <button 
                (click)="onRemoveAllUnavailable()"
                class="flex-1 py-3 px-4 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-red-600/20"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Remove All Unavailable
              </button>
              <button 
                (click)="onClose()"
                class="sm:w-auto py-3 px-6 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .safe-area-bottom {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-slideUp {
      animation: slideUp 0.3s ease-out forwards;
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class CartValidationModalComponent {
  @Input() isOpen = false;
  @Input() validation: CartValidationResult | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() removeAllUnavailable = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onRemoveItem(productId: string) {
    this.removeItem.emit(productId);
  }

  onRemoveAllUnavailable() {
    this.removeAllUnavailable.emit();
  }
}
