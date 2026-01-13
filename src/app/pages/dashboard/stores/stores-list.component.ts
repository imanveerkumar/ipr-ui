import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 class="text-2xl font-display font-bold text-gray-900">My Stores</h1>
          <a routerLink="/dashboard/stores/new" class="btn-primary">Create Store</a>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        @if (loading()) {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (i of [1, 2, 3]; track i) {
              <div class="card p-6 animate-pulse">
                <div class="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else if (stores().length === 0) {
          <div class="card p-12 text-center">
            <p class="text-gray-600 mb-4">You haven't created any stores yet.</p>
            <a routerLink="/dashboard/stores/new" class="btn-primary">Create Your First Store</a>
          </div>
        } @else {
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (store of stores(); track store.id) {
              <div class="card overflow-hidden">
                @if (store.bannerUrl) {
                  <img [src]="store.bannerUrl" alt="" class="w-full h-32 object-cover">
                } @else {
                  <div class="w-full h-32 bg-gradient-to-r from-primary-500 to-accent-500"></div>
                }
                <div class="p-6">
                  <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 text-lg">{{ store.name }}</h3>
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      [class]="store.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-700' 
                        : store.status === 'DRAFT' 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'"
                    >
                      {{ store.status }}
                    </span>
                  </div>
                  
                  <!-- Store URL -->
                  <div class="mb-4">
                    @if (store.status === 'PUBLISHED') {
                      <a 
                        [href]="storeService.getStoreUrl(store)" 
                        target="_blank"
                        class="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        {{ store.slug }}.yoursite.com
                      </a>
                    } @else {
                      <span class="text-sm text-gray-400">{{ store.slug }}.yoursite.com (not published)</span>
                    }
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-400">{{ store._count?.products || 0 }} products</span>
                    <a [routerLink]="['/dashboard/stores', store.id]" class="btn-outline text-sm">Manage</a>
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
export class StoresListComponent implements OnInit {
  stores = signal<Store[]>([]);
  loading = signal(true);
  storeService = inject(StoreService);

  async ngOnInit() {
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);
    this.loading.set(false);
  }
}
