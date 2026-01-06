import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { Store } from '../../core/models/index';

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
                    <span class="text-sm text-gray-400">{{ store.products?.length || 0 }} products</span>
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
  loading = signal(true);
  totalProducts = signal(0);
  totalSales = signal(0);
  totalRevenue = signal(0);

  constructor(private storeService: StoreService) {}

  async ngOnInit() {
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);
    
    // Calculate totals
    let products = 0;
    stores.forEach(s => {
      products += s.products?.length || 0;
    });
    this.totalProducts.set(products);
    
    // TODO: Fetch actual sales data from API
    this.loading.set(false);
  }
}
