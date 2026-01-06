import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Store } from '../../../core/models/index';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 class="text-2xl font-display font-bold text-gray-900">My Products</h1>
          <a routerLink="/dashboard/products/new" class="btn-primary">Add Product</a>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        @if (loading()) {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="card p-6 animate-pulse">
                <div class="h-40 bg-gray-200 rounded mb-4"></div>
                <div class="h-5 bg-gray-200 rounded w-2/3"></div>
              </div>
            }
          </div>
        } @else if (products().length === 0) {
          <div class="card p-12 text-center">
            <p class="text-gray-600 mb-4">You haven't created any products yet.</p>
            <a routerLink="/dashboard/products/new" class="btn-primary">Create Your First Product</a>
          </div>
        } @else {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (product of products(); track product.id) {
              <div class="card overflow-hidden">
                @if (product.coverImageUrl) {
                  <img [src]="product.coverImageUrl" alt="" class="w-full h-40 object-cover">
                } @else {
                  <div class="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                }
                <div class="p-6">
                  <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-gray-900">{{ product.title }}</h3>
                    <span 
                      class="text-xs px-2 py-1 rounded-full"
                      [class]="product.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    >
                      {{ product.status }}
                    </span>
                  </div>
                  <p class="text-lg font-bold text-primary-600 mb-4">₹{{ product.price / 100 }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">{{ product.store?.name }}</span>
                    <a [routerLink]="['/dashboard/products', product.id]" class="btn-outline text-sm">Edit</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    // Fetch all products from all stores
    const products = await this.productService.getMyProducts();
    this.products.set(products);
    this.loading.set(false);
  }
}
