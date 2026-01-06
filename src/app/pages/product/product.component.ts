import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/index';
import { ProductService } from '../../core/services/product.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        @if (loading()) {
          <div class="animate-pulse">
            <div class="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div class="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        } @else if (product()) {
          <div class="card overflow-hidden">
            @if (product()?.coverImageUrl) {
              <img [src]="product()?.coverImageUrl" alt="" class="w-full h-64 object-cover">
            } @else {
              <div class="w-full h-64 bg-gradient-to-br from-primary-100 to-accent-100"></div>
            }
            
            <div class="p-8">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h1 class="text-3xl font-display font-bold text-gray-900">{{ product()?.title }}</h1>
                  @if (product()?.store) {
                    <a [routerLink]="['/store', product()?.store?.slug]" class="text-primary-600 hover:underline mt-1 inline-block">
                      by {{ product()?.store?.name }}
                    </a>
                  }
                </div>
                <div class="text-right">
                  <p class="text-3xl font-bold text-primary-600">₹{{ (product()?.price || 0) / 100 }}</p>
                  @if (product()?.compareAtPrice) {
                    <p class="text-lg text-gray-400 line-through">₹{{ product()!.compareAtPrice! / 100 }}</p>
                  }
                </div>
              </div>

              @if (product()?.description) {
                <div class="mt-6 prose prose-gray max-w-none">
                  <p>{{ product()?.description }}</p>
                </div>
              }

              <!-- Files included -->
              @if (product()?.files && product()!.files!.length > 0) {
                <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 class="font-semibold text-gray-900 mb-3">Files included:</h3>
                  <ul class="space-y-2">
                    @for (pf of product()?.files; track pf.id) {
                      <li class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        {{ pf.file.filename }} ({{ formatFileSize(pf.file.size) }})
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Purchase button -->
              <div class="mt-8">
                @if (auth.isSignedIn()) {
                  <button 
                    (click)="purchase()" 
                    [disabled]="purchasing()"
                    class="btn-primary w-full text-lg py-3"
                  >
                    @if (purchasing()) {
                      Processing...
                    } @else {
                      Buy Now - ₹{{ (product()?.price || 0) / 100 }}
                    }
                  </button>
                } @else {
                  <button (click)="auth.signIn()" class="btn-primary w-full text-lg py-3">
                    Sign in to Purchase
                  </button>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="text-center py-16">
            <h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
            <a routerLink="/" class="btn-primary mt-6 inline-block">Go Home</a>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  purchasing = signal(false);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    public auth: AuthService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const product = await this.productService.getProductById(id);
      this.product.set(product);
    }
    this.loading.set(false);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async purchase() {
    const product = this.product();
    if (!product) return;

    this.purchasing.set(true);

    try {
      // Create order
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        alert('Failed to create order');
        return;
      }

      // Initiate payment
      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) {
        alert('Failed to initiate payment');
        return;
      }

      // Open Razorpay checkout
      const userEmail = this.auth.user()?.email || '';
      const success = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);

      if (success) {
        alert('Purchase successful! Check your library.');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }
}
