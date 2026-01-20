import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';
import { ApiService } from '../../core/services/api.service';
import { Store, Product } from '../../core/models/index';

interface Sale {
  id: string;
  productTitle: string;
  storeName: string;
  customerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-gray-900">Creator Dashboard</h1>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Stores</p>
            <p class="text-3xl font-bold text-gray-900">{{ stores().length }}</p>
          </div>
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalProducts() }}</p>
          </div>
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Sales</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalSales() }}</p>
          </div>
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-3xl font-bold text-gray-900">₹{{ totalRevenue() }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a routerLink="/dashboard/stores/new" class="card p-6 hover:shadow-md transition-shadow group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600">Create Store</h3>
                <p class="text-sm text-gray-500">Set up a new storefront</p>
              </div>
            </div>
          </a>

          <a routerLink="/dashboard/products/new" class="card p-6 hover:shadow-md transition-shadow group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-accent-600">Add Product</h3>
                <p class="text-sm text-gray-500">Upload new digital assets</p>
              </div>
            </div>
          </a>

          <a routerLink="/dashboard/sales" class="card p-6 hover:shadow-md transition-shadow group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 group-hover:text-green-600">View Sales</h3>
                <p class="text-sm text-gray-500">Track your earnings</p>
              </div>
            </div>
          </a>
        </div>

        <!-- Recent Stores -->
        <div class="card">
          <div class="p-6 border-b flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Your Stores</h2>
            <a routerLink="/dashboard/stores" class="text-primary-600 hover:text-primary-700 text-sm">View All</a>
          </div>
          <div class="divide-y">
            @if (loading()) {
              @for (i of [1, 2]; track i) {
                <div class="p-6 animate-pulse">
                  <div class="h-5 bg-gray-200 rounded w-1/3"></div>
                </div>
              }
            } @else if (stores().length === 0) {
              <div class="p-12 text-center text-gray-500">
                <p>No stores yet. Create your first store to get started!</p>
              </div>
            } @else {
              @for (store of stores().slice(0, 5); track store.id) {
                <a [routerLink]="['/dashboard/stores', store.id]" class="block p-6 hover:bg-gray-50">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="font-medium text-gray-900">{{ store.name }}</h3>
                      <p class="text-sm text-gray-500">{{ store.slug }}</p>
                    </div>
                    <span class="text-sm text-gray-400">{{ store._count?.products || 0 }} products</span>
                  </div>
                </a>
              }
            }
          </div>
        </div>

        <!-- Recent Products -->
        <div class="card">
          <div class="p-6 border-b flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Your Products</h2>
            <a routerLink="/dashboard/products" class="text-primary-600 hover:text-primary-700 text-sm">View All</a>
          </div>
          <div class="divide-y">
            @if (loading()) {
              @for (i of [1, 2, 3]; track i) {
                <div class="p-6 animate-pulse">
                  <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              }
            } @else if (products().length === 0) {
              <div class="p-12 text-center text-gray-500">
                <p>No products yet. Create your first product to get started!</p>
              </div>
            } @else {
              @for (product of products().slice(0, 5); track product.id) {
                <a [routerLink]="['/dashboard/products', product.id]" class="block p-6 hover:bg-gray-50">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                      @if (product.coverImageUrl) {
                        <img [src]="product.coverImageUrl" alt="" class="w-12 h-12 object-cover rounded">
                      } @else {
                        <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                      }
                      <div>
                        <h3 class="font-medium text-gray-900">{{ product.title }}</h3>
                        <p class="text-sm text-gray-500">{{ product.store?.name }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-gray-900">₹{{ product.price }}</p>
                      <p class="text-sm text-gray-500">{{ product.status }}</p>
                    </div>
                  </div>
                </a>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stores = signal<Store[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);
  totalProducts = signal(0);
  totalSales = signal(0);
  totalRevenue = signal(0);

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private api: ApiService
  ) {}

  async ngOnInit() {
    try {
      const [stores, products, salesResponse] = await Promise.all([
        this.storeService.getMyStores(),
        this.productService.getMyProducts(),
        this.api.get<Sale[]>('/orders/sales')
      ]);
      
      this.stores.set(stores);
      this.products.set(products);
      
      // Calculate total products
      let totalProducts = 0;
      stores.forEach(s => {
        totalProducts += s._count?.products || 0;
      });
      this.totalProducts.set(totalProducts);
      
      // Calculate sales and revenue from API data
      const salesData: Sale[] = salesResponse.data || [];
      const paidSales = salesData.filter((s: Sale) => s.status === 'PAID' || s.status === 'FULFILLED');
      
      this.totalSales.set(paidSales.length);
      
      const revenue = paidSales.reduce((sum: number, s: Sale) => sum + s.amount, 0);
      this.totalRevenue.set(revenue / 100); // Convert from paise to rupees
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
