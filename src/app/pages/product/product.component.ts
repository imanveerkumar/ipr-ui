import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/index';
import { ProductService } from '../../core/services/product.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToasterService } from '../../core/services/toaster.service';

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
                <div class="mt-6 prose prose-gray max-w-none" [innerHTML]="product()?.description"></div>
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
                  <div class="flex flex-col sm:flex-row gap-3">
                    <button 
                      (click)="addToCart()" 
                      class="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-black rounded-xl font-bold transition-all duration-200"
                      [class.bg-green-100]="isInCart()"
                      [class.bg-gray-100]="!isInCart()"
                      [class.hover:bg-gray-200]="!isInCart()"
                    >
                      @if (isInCart()) {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        In Cart
                      } @else {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Add to Cart
                      }
                    </button>
                    <button 
                      (click)="purchase()" 
                      [disabled]="purchasing()"
                      class="flex-1 btn-primary text-lg py-3"
                    >
                      @if (purchasing()) {
                        Processing...
                      } @else {
                        Buy Now - ₹{{ (product()?.price || 0) / 100 }}
                      }
                    </button>
                  </div>
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
  
  cartService = inject(CartService);

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

  addToCart() {
    const product = this.product();
    if (!product) return;
    
    if (this.isInCart()) {
      this.cartService.removeItem(product.id);
    } else {
      this.cartService.addItem(product);
      this.cartService.open();
    }
  }

  isInCart(): boolean {
    const product = this.product();
    return product ? this.cartService.isInCart(product.id) : false;
  }

  private toaster = inject(ToasterService);

  async purchase() {
    const product = this.product();
    if (!product) return;

    this.purchasing.set(true);

    try {
      // Create order
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({
          title: 'Order Failed',
          message: 'Failed to create order. Please try again.',
        });
        return;
      }

      // Initiate payment
      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) {
        this.toaster.error({
          title: 'Payment Failed',
          message: 'Failed to initiate payment. Please try again.',
        });
        return;
      }

      // Open Razorpay checkout
      const userEmail = this.auth.user()?.email || '';
      const success = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);

      if (success) {
        this.toaster.success({
          title: 'Purchase Successful!',
          message: 'Check your library to access your files.',
        });
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      this.toaster.handleError(error, 'Purchase failed. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }
}
