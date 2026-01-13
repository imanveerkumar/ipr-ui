import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoreContextService } from '../../core/services/store-context.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      @if (loading()) {
        <div class="max-w-7xl mx-auto px-4 py-12">
          <div class="animate-pulse">
            <div class="grid lg:grid-cols-2 gap-12">
              <div class="aspect-video bg-gray-200 rounded-2xl"></div>
              <div>
                <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center gap-2 text-sm text-gray-500">
              <li><a routerLink="/" class="hover:text-gray-700">Home</a></li>
              <li>/</li>
              <li><a routerLink="/products" class="hover:text-gray-700">Products</a></li>
              <li>/</li>
              <li class="text-gray-900">{{ product()?.title }}</li>
            </ol>
          </nav>

          <div class="grid lg:grid-cols-2 gap-12">
            <!-- Product Image -->
            <div>
              @if (product()?.coverImageUrl) {
                <img 
                  [src]="product()?.coverImageUrl" 
                  [alt]="product()?.title"
                  class="w-full rounded-2xl shadow-lg"
                >
              } @else {
                <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              }
            </div>

            <!-- Product Details -->
            <div>
              <h1 class="text-3xl font-display font-bold text-gray-900 mb-4">
                {{ product()?.title }}
              </h1>

              <div class="flex items-center gap-4 mb-6">
                <span class="text-3xl font-bold text-primary-600">
                  ₹{{ (product()?.price || 0) / 100 }}
                </span>
                @if (product()?.compareAtPrice && product()!.compareAtPrice! > product()!.price) {
                  <span class="text-xl text-gray-400 line-through">
                    ₹{{ product()!.compareAtPrice! / 100 }}
                  </span>
                  <span class="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                    {{ getDiscount() }}% OFF
                  </span>
                }
              </div>

              @if (product()?.description) {
                <div class="prose prose-gray max-w-none mb-8" [innerHTML]="product()?.description"></div>
              }

              <!-- Buy Button -->
              <div class="space-y-4">
                <button 
                  (click)="handleBuy()"
                  [disabled]="purchasing()"
                  class="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (purchasing()) {
                    <span class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  } @else {
                    Buy Now - ₹{{ (product()?.price || 0) / 100 }}
                  }
                </button>

                <p class="text-center text-sm text-gray-500">
                  Secure payment powered by Razorpay
                </p>
              </div>

              <!-- Product Info -->
              <div class="mt-8 pt-8 border-t border-gray-100">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Format</span>
                    <p class="font-medium text-gray-900">Digital Download</p>
                  </div>
                  <div>
                    <span class="text-gray-500">Delivery</span>
                    <p class="font-medium text-gray-900">Instant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p class="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `,
})
export class StorefrontProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  storeContext = inject(StoreContextService);
  checkoutService = inject(CheckoutService);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);

  product = signal<Product | null>(null);
  loading = signal(true);
  purchasing = signal(false);

  async ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      await this.loadProduct(productId);
    }
    this.loading.set(false);
  }

  async loadProduct(id: string) {
    const product = await this.storeContext.getProduct(id);
    this.product.set(product);
  }

  getDiscount(): number {
    const product = this.product();
    if (!product?.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  async handleBuy() {
    const product = this.product();
    if (!product) return;

    // Check if user is logged in
    if (!this.authService.isSignedIn()) {
      // Redirect to main site login with return URL
      const returnUrl = window.location.href;
      window.location.href = this.subdomainService.getMainSiteUrl(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    this.purchasing.set(true);
    try {
      // Create order and initiate payment
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        throw new Error('Failed to create order');
      }
      
      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) {
        throw new Error('Failed to initiate payment');
      }
      
      const userEmail = this.authService.user()?.email || '';
      const success = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);
      
      if (success) {
        // Redirect to library or success page
        window.location.href = this.subdomainService.getMainSiteUrl('/library');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      this.purchasing.set(false);
    }
  }
}
