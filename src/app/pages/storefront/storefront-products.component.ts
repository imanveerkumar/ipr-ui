import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreContextService } from '../../core/services/store-context.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-storefront-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">All Products</h1>
        <p class="text-gray-600">
          Browse all {{ storeContext.products().length }} products from {{ storeContext.storeName() }}
        </p>
      </div>

      <!-- Filters & Search -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="flex-1">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="filterProducts()"
            placeholder="Search products..."
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
        </div>
        <div class="flex gap-2">
          <select 
            [(ngModel)]="sortBy"
            (change)="filterProducts()"
            class="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      @if (filteredProducts().length === 0) {
        <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-gray-500">No products found matching your search.</p>
          @if (searchQuery) {
            <button (click)="clearSearch()" class="mt-4 text-primary-600 hover:text-primary-700 font-medium">
              Clear search
            </button>
          }
        </div>
      } @else {
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of filteredProducts(); track product.id) {
            <a [routerLink]="['/product', product.id]" 
               class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
              @if (product.coverImageUrl) {
                <div class="aspect-video overflow-hidden">
                  <img 
                    [src]="product.coverImageUrl" 
                    [alt]="product.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  >
                </div>
              } @else {
                <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
              }
              
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                  {{ product.title }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-primary-600">
                    ₹{{ product.price / 100 }}
                  </span>
                  @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                    <span class="text-sm text-gray-400 line-through">
                      ₹{{ product.compareAtPrice / 100 }}
                    </span>
                  }
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class StorefrontProductsComponent implements OnInit {
  storeContext = inject(StoreContextService);
  
  searchQuery = '';
  sortBy = 'newest';
  filteredProducts = signal<Product[]>([]);

  ngOnInit() {
    this.filterProducts();
  }

  filterProducts() {
    let products = [...this.storeContext.products()];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query))
      );
    }

    // Sort products
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
}
