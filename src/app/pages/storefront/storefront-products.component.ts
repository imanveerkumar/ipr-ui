import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreContextService } from '../../core/services/store-context.service';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Mobile-First Page Header -->
      <section class="relative overflow-hidden">
        <div class="bg-gradient-to-br from-[#b8e6c9] via-[#c8f0d0] to-[#d8f8e0] rounded-2xl sm:rounded-3xl mx-3 sm:mx-4 md:mx-6 lg:mx-8 mt-3 sm:mt-4">
          <div class="px-4 sm:px-6 py-6 sm:py-8 md:py-12">
            <div class="text-center">
              <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm mb-2 sm:mb-3">
                <span class="text-xs sm:text-sm font-medium text-gray-800">Browse Collection</span>
              </div>
              <h1 class="font-dm-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-tight">
                All Products
              </h1>
              <p class="text-sm sm:text-base text-gray-700/80 mt-2">
                {{ storeContext.products().length }} products available
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        <!-- Search & Filter Bar - Mobile optimized -->
        <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1 relative">
              <svg class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="filterProducts()"
                placeholder="Search products..."
                class="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm sm:text-base min-h-[48px]"
              >
            </div>
            
            <!-- Sort Dropdown -->
            <div class="flex items-center gap-2 sm:gap-3">
              <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap hidden sm:inline">Sort:</span>
              <select 
                [(ngModel)]="sortBy"
                (change)="filterProducts()"
                class="flex-1 sm:flex-none px-3 sm:px-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm min-h-[48px] min-w-[140px] sm:min-w-[160px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
          
          <!-- Active Search - Clear button -->
          @if (searchQuery) {
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                <span class="font-semibold">{{ filteredProducts().length }}</span> results for "{{ searchQuery }}"
              </p>
              <button 
                (click)="clearSearch()" 
                class="text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1 min-h-[36px] px-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Clear
              </button>
            </div>
          }
        </div>

        <!-- Products Grid -->
        @if (filteredProducts().length === 0) {
          <div class="bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600 text-sm sm:text-base mb-6">Try a different search term</p>
            @if (searchQuery) {
              <button 
                (click)="clearSearch()" 
                class="px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]"
              >
                Show All Products
              </button>
            }
          </div>
        } @else {
          <!-- Products Grid - 2 columns on mobile -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            @for (product of filteredProducts(); track product.id) {
              <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg active:shadow-md transition-all duration-200 group flex flex-col">
                <!-- Product Image -->
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
                      <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-rose-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
                        -{{ getDiscount(product) }}%
                      </span>
                    </div>
                  }

                  <!-- Quick Add - Visible on hover/tap -->
                  <button 
                    (click)="addToCart(product); $event.stopPropagation()"
                    class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2.5 sm:p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 active:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 min-h-[40px] min-w-[40px]"
                    [class.opacity-100]="cartService.isInCart(product.id)"
                    [class.bg-emerald-100]="cartService.isInCart(product.id)"
                  >
                    @if (cartService.isInCart(product.id)) {
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    } @else {
                      <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    }
                  </button>
                </div>
                
                <!-- Product Info -->
                <div class="p-3 sm:p-4 flex-1 flex flex-col">
                  <button (click)="navigateTo('/product/' + product.id)" class="text-left flex-1">
                    <h3 class="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight mb-2">
                      {{ product.title }}
                    </h3>
                  </button>
                  
                  <!-- Price -->
                  <div class="flex items-baseline gap-1.5 sm:gap-2 mb-3">
                    <span class="text-base sm:text-lg font-bold text-gray-900">
                      ₹{{ product.price / 100 }}
                    </span>
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <span class="text-xs sm:text-sm text-gray-400 line-through">
                        ₹{{ product.compareAtPrice / 100 }}
                      </span>
                    }
                  </div>
                  
                  <!-- Buy Button - Full width -->
                  <button 
                    (click)="handleBuyNow(product)"
                    class="w-full py-2.5 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[44px]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Back to Home -->
        <div class="mt-6 sm:mt-8 md:mt-10">
          <button 
            (click)="navigateTo('/')" 
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors font-medium min-h-[48px]"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
            Back to Store
          </button>
        </div>
      </div>
    </div>
  `,
})
export class StorefrontProductsComponent implements OnInit {
  storeContext = inject(StoreContextService);
  cartService = inject(CartService);
  private checkoutService = inject(CheckoutService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  
  searchQuery = '';
  sortBy = 'newest';
  filteredProducts = signal<Product[]>([]);

  ngOnInit() {
    this.filterProducts();
  }

  navigateTo(path: string): void {
    this.router.navigate([path], { queryParamsHandling: 'merge' });
  }

  filterProducts() {
    let products = [...this.storeContext.products()];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    switch (this.sortBy) {
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    this.filteredProducts.set(products);
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterProducts();
  }

  getDiscount(product: Product): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }

  handleBuyNow(product: Product) {
    // Add product to cart and open cart sidebar for checkout
    // This allows both guest and authenticated checkout flows
    this.cartService.addItem(product);
    this.cartService.open();
  }
}
