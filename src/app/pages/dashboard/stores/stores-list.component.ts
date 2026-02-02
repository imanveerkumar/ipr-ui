import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="bg-[#F9F4EB] border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 mb-4 flex-wrap">
          <a routerLink="/dashboard" class="text-sm font-medium text-black/70 hover:text-black transition-colors">
            Dashboard
          </a>
          <svg class="w-4 h-4 text-black/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span class="text-sm font-bold text-black">Stores</span>
        </nav>
        
        <!-- Header Content -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-1">My Stores</h1>
            <p class="text-[#111111]/70 font-medium">Create and manage your online storefronts</p>
          </div>
          
          <a routerLink="/dashboard/stores/new" 
             class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Create Store
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    @if (!loading() && stores().length > 0) {
      <section class="bg-white border-b-2 border-black">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
            <!-- Total Stores -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#111111]">{{ stores().length }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Total Stores</span>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Published -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#68E079]">{{ publishedCount() }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Published</span>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Draft -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#FFC60B]">{{ draftCount() }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Draft</span>
            </div>
          </div>
        </div>
      </section>
    }

    <!-- Content Section -->
    <section class="bg-[#F9F4EB] min-h-[60vh]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        @if (loading()) {
          <!-- Loading Skeleton -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <div class="h-28 sm:h-32 bg-black/10 animate-pulse"></div>
                <div class="p-4 sm:p-5">
                  <div class="h-5 w-2/3 bg-black/10 animate-pulse mb-3"></div>
                  <div class="h-4 w-3/4 bg-black/10 animate-pulse mb-4"></div>
                  <div class="flex justify-between items-center pt-4 border-t-2 border-black/10">
                    <div class="h-4 w-24 bg-black/10 animate-pulse"></div>
                    <div class="h-4 w-16 bg-black/10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (stores().length === 0) {
          <!-- Empty State -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-8 sm:p-12 flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-[#F9F4EB] border-2 border-black flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-[#111111] mb-2">No stores yet</h3>
            <p class="text-[#111111]/70 font-medium mb-6 max-w-sm">Create your first store to start selling digital products</p>
            <a routerLink="/dashboard/stores/new" 
               class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Your First Store
            </a>
          </div>
        } @else {
          <!-- Stores Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            @for (store of stores(); track store.id) {
              <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                <!-- Banner -->
                @if (store.bannerUrl) {
                  <img [src]="store.bannerUrl" alt="" class="w-full h-28 sm:h-32 object-cover border-b-2 border-black">
                } @else {
                  <div class="w-full h-28 sm:h-32 bg-[#F9F4EB] border-b-2 border-black flex items-center justify-center">
                    <svg class="w-8 h-8 text-black/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                }
                
                <!-- Content -->
                <div class="p-4 sm:p-5">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="text-base sm:text-lg font-bold text-[#111111] leading-tight">{{ store.name }}</h3>
                    
                    <!-- Status Badge -->
                    @if (store.status === 'PUBLISHED') {
                      <span class="shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#68E079] text-[#111111] border-2 border-black">
                        Live
                      </span>
                    } @else if (store.status === 'DRAFT') {
                      <span class="shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FFC60B] text-[#111111] border-2 border-black">
                        Draft
                      </span>
                    } @else {
                      <span class="shrink-0 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FA4B28] text-white border-2 border-black">
                        {{ store.status }}
                      </span>
                    }
                  </div>
                  
                  <!-- Store URL -->
                  <div class="mb-4">
                    @if (store.status === 'PUBLISHED') {
                      <a [href]="storeService.getStoreUrl(store)" target="_blank" 
                         class="inline-flex items-center gap-1.5 text-sm font-medium text-[#2B57D6] hover:underline">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        {{ store.slug }}.yoursite.com
                      </a>
                    } @else {
                      <span class="text-sm text-black/50">{{ store.slug }}.yoursite.com</span>
                    }
                  </div>
                  
                  <!-- Footer -->
                  <div class="flex items-center justify-between pt-4 border-t-2 border-black/10">
                    <span class="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111]/70">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                      {{ store._count?.products || 0 }} products
                    </span>
                    
                    <a [routerLink]="['/dashboard/stores', store.id]" 
                       class="inline-flex items-center gap-1 text-sm font-bold text-[#111111] group-hover:text-[#2B57D6] transition-colors">
                      Manage
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StoresListComponent implements OnInit {
  stores = signal<Store[]>([]);
  loading = signal(true);
  storeService = inject(StoreService);

  publishedCount = computed(() => this.stores().filter(s => s.status === 'PUBLISHED').length);
  draftCount = computed(() => this.stores().filter(s => s.status === 'DRAFT').length);

  async ngOnInit() {
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);
    this.loading.set(false);
  }
}
