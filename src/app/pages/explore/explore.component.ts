import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { 
  ExploreService, 
  ExploreProduct, 
  ExploreStore, 
  ExploreCreator,
  ExploreStats,
  ExploreQueryParams 
} from '../../core/services/explore.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

type TabType = 'products' | 'stores' | 'creators';
type SortOption = { label: string; value: string; order: 'asc' | 'desc' };

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div class="text-left">
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-0 md:mb-1 leading-tight">
                Explore
              </h1>

              <!-- Stats (below heading) -->
              <div class="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:flex md:justify-start md:gap-8 max-w-2xl mx-auto md:mx-0">
                <!-- Products stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#68E079] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (stats()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ stats()!.totalProducts }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Products</div>
                  </div>
                </div>

                <!-- Stores stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FA4B28] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (stats()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ stats()!.totalStores }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Stores</div>
                  </div>
                </div>

                <!-- Creators stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#2B57D6] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (stats()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ stats()!.totalCreators }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Creators</div>
                  </div>
                </div>
              </div>

              <!-- Search Bar -->
              <div class="mt-4 max-w-xl mx-auto md:mx-0 mb-8 md:mb-12">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 md:w-5 md:h-5 text-[#111111]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (input)="onSearchInput()"
                    (keyup.enter)="performSearch()"
                    placeholder="Search products, stores, creators..."
                    class="w-full pl-10 md:pl-12 pr-24 py-3 md:py-3.5 bg-white border-2 border-black rounded-none text-[#111111] placeholder-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] focus:border-black shadow-[4px_4px_0px_0px_#000] text-sm md:text-base font-medium transition-all"
                  />
                  <button
                    (click)="performSearch()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-2 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-none font-bold text-xs sm:text-sm hover:bg-[#ffdb4d] transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px]"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <!-- Tabs & Filters -->
          <div class="flex flex-col gap-4 mb-6 md:mb-8 sticky top-0 z-20 bg-white pt-2 pb-2 md:relative md:top-auto md:z-auto md:bg-transparent md:pt-0 md:pb-0">
            <!-- Tabs -->
            <div class="flex overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              <div class="flex gap-2 md:gap-3 p-1 bg-[#F9F4EB] border-2 border-black rounded-xl">
                <button
                  *ngFor="let tab of tabs"
                  (click)="switchTab(tab.value)"
                  class="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-200"
                  [class.bg-[#111111]]="activeTab() === tab.value"
                  [class.text-white]="activeTab() === tab.value"
                  [class.shadow-[2px_2px_0px_0px_#FFC60B]]="activeTab() === tab.value"
                  [class.text-[#111111]]="activeTab() !== tab.value"
                  [class.hover:bg-white]="activeTab() !== tab.value"
                >
                  <span [innerHTML]="tab.icon"></span>
                  {{ tab.label }}
                  <span 
                    class="px-2 py-0.5 text-xs rounded-full"
                    [class.bg-[#FFC60B]]="activeTab() === tab.value"
                    [class.text-[#111111]]="activeTab() === tab.value"
                    [class.bg-[#111111]/10]="activeTab() !== tab.value"
                  >
                    {{ getTabCount(tab.value) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Filters Row -->
            <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3">
              <!-- Sort Dropdown -->
              <div class="relative col-span-1 sm:col-span-auto">
                <button
                  (click)="toggleSortDropdown()"
                  class="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border-2 border-black rounded-lg font-medium text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                  </svg>
                  <span class="truncate">{{ getCurrentSortLabel() }}</span>
                  <svg class="w-4 h-4 transition-transform flex-shrink-0" [class.rotate-180]="showSortDropdown()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                <!-- Sort Options -->
                <div
                  *ngIf="showSortDropdown()"
                  class="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] z-20 overflow-hidden"
                >
                  <button
                    *ngFor="let option of sortOptions"
                    (click)="selectSort(option)"
                    class="w-full px-4 py-3 text-left text-sm font-medium text-[#111111] hover:bg-[#F9F4EB] transition-colors border-b border-black/10 last:border-b-0"
                    [class.bg-[#FFC60B]]="currentSort().value === option.value && currentSort().order === option.order"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Price Filter (Products only) -->
              <ng-container *ngIf="activeTab() === 'products'">
                <div class="col-span-1 sm:col-span-auto">
                  <button
                    (click)="togglePriceFilter()"
                    class="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-white border-2 border-black rounded-lg font-medium text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors"
                    [class.bg-[#68E079]]="hasPriceFilter()"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Price
                    <svg class="w-4 h-4" *ngIf="hasPriceFilter()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                </div>
                
                <!-- Price Range Inputs -->
                <div *ngIf="showPriceFilter()" class="col-span-2 sm:col-span-auto w-full sm:w-auto flex items-center gap-2">
                  <input
                    type="number"
                    [(ngModel)]="minPrice"
                    placeholder="Min"
                    class="flex-1 sm:flex-none w-full sm:w-24 px-3 py-2 bg-white border-2 border-black rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/40 focus:outline-none focus:ring-2 focus:ring-[#FFC60B]"
                  />
                  <span class="text-[#111111]/50">-</span>
                  <input
                    type="number"
                    [(ngModel)]="maxPrice"
                    placeholder="Max"
                    class="flex-1 sm:flex-none w-full sm:w-24 px-3 py-2 bg-white border-2 border-black rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/40 focus:outline-none focus:ring-2 focus:ring-[#FFC60B]"
                  />
                  <button
                    (click)="applyPriceFilter()"
                    class="px-3 py-2 bg-[#FFC60B] border-2 border-black rounded-lg text-sm font-bold text-[#111111] hover:bg-[#ffdb4d] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </ng-container>

              <!-- Clear Filters -->
              <button
                *ngIf="hasActiveFilters()"
                (click)="clearFilters()"
                class="col-span-2 sm:col-span-auto w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-[#FA4B28] border-2 border-black rounded-lg font-medium text-sm text-white hover:bg-[#e8421f] transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Clear
              </button>

              <!-- Results Count -->
              <div class="col-span-2 sm:col-span-auto sm:ml-auto text-center sm:text-right text-sm text-[#111111]/60 font-medium">
                {{ getTotalResults() }} results
              </div>
            </div>
          </div>

          <!-- Loading Skeleton -->
          <ng-container *ngIf="isLoading()">
            <!-- Products Skeleton -->
            <div *ngIf="activeTab() === 'products'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white border-2 border-black rounded-xl md:rounded-2xl overflow-hidden">
                <div class="aspect-square bg-[#F9F4EB] animate-pulse"></div>
                <div class="p-2 md:p-4">
                  <div class="h-3 md:h-4 bg-[#111111]/10 rounded animate-pulse mb-2 w-3/4"></div>
                  <div class="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                    <div class="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#111111]/10 animate-pulse"></div>
                    <div class="h-2 md:h-3 bg-[#111111]/5 rounded animate-pulse w-16"></div>
                  </div>
                  <div class="h-3 md:h-4 bg-[#111111]/10 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            </div>

            <!-- Stores Skeleton -->
            <div *ngIf="activeTab() === 'stores'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white border-2 border-black rounded-2xl overflow-hidden">
                <!-- Banner + Logo Skeleton -->
                <div class="h-24 md:h-32 bg-[#F9F4EB] relative animate-pulse">
                  <div class="absolute -bottom-6 left-4 w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-black rounded-xl overflow-hidden flex items-center justify-center">
                    <div class="w-full h-full bg-[#111111]/10"></div>
                  </div>
                </div>
                <!-- Info Skeleton -->
                <div class="p-4 pt-10">
                  <div class="h-4 md:h-5 bg-[#111111]/10 rounded animate-pulse mb-2 w-1/2"></div>
                  <div class="h-3 md:h-4 bg-[#111111]/5 rounded animate-pulse w-full mb-1"></div>
                  <div class="h-3 md:h-4 bg-[#111111]/5 rounded animate-pulse w-2/3 mb-4"></div>
                  <!-- Stats Skeleton -->
                  <div class="flex items-center gap-4">
                    <div class="h-3 md:h-4 bg-[#111111]/10 rounded animate-pulse w-20"></div>
                    <div class="h-3 md:h-4 bg-[#111111]/10 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Creators Skeleton -->
            <div *ngIf="activeTab() === 'creators'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="bg-white border-2 border-black rounded-2xl p-4 md:p-5 text-center">
                <!-- Avatar Skeleton -->
                <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-[#111111]/10 animate-pulse border-2 border-transparent"></div>
                <!-- Name Skeleton -->
                <div class="h-4 md:h-5 bg-[#111111]/10 rounded animate-pulse mb-2 w-2/3 mx-auto"></div>
                <!-- Handle Skeleton -->
                <div class="h-3 md:h-4 bg-[#111111]/5 rounded animate-pulse w-1/3 mx-auto mb-4"></div>
                <!-- Bio Skeleton -->
                <div class="h-3 bg-[#111111]/5 rounded animate-pulse w-full mb-1"></div>
                <div class="h-3 bg-[#111111]/5 rounded animate-pulse w-4/5 mx-auto mb-4"></div>
                <!-- Stats Skeleton -->
                <div class="flex justify-center gap-4">
                  <div class="text-center">
                    <div class="h-4 w-6 bg-[#111111]/10 rounded animate-pulse mx-auto mb-1"></div>
                    <div class="h-2 w-8 bg-[#111111]/5 rounded animate-pulse mx-auto"></div>
                  </div>
                  <div class="w-px bg-black/10"></div>
                  <div class="text-center">
                    <div class="h-4 w-6 bg-[#111111]/10 rounded animate-pulse mx-auto mb-1"></div>
                    <div class="h-2 w-8 bg-[#111111]/5 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Products Grid -->
          <div *ngIf="!isLoading() && activeTab() === 'products'">
            <div *ngIf="products().length === 0" class="py-16 text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#111111] mb-2">No products found</h3>
              <p class="text-[#111111]/60 font-medium">Try adjusting your search or filters</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              <div
                *ngFor="let product of products()"
                class="group bg-white border-2 border-black rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                (click)="viewProduct(product)"
              >
                <!-- Product Image -->
                <div class="aspect-square bg-[#F9F4EB] relative overflow-hidden">
                  <img
                    *ngIf="product.coverImageUrl"
                    [src]="product.coverImageUrl"
                    [alt]="product.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div *ngIf="!product.coverImageUrl" class="w-full h-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  
                  <!-- Discount Badge -->
                  <div
                    *ngIf="product.compareAtPrice && product.compareAtPrice > product.price"
                    class="absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-[#FA4B28] border border-black rounded md:rounded-lg text-[10px] md:text-xs font-bold text-white shadow-[1px_1px_0px_0px_#000] md:shadow-none"
                  >
                    -{{ exploreService.getDiscountPercentage(product.price, product.compareAtPrice) }}%
                  </div>

                  <!-- Action Buttons -->
                  <div class="absolute bottom-2 right-2 md:bottom-3 md:right-3 flex gap-1 md:gap-2 z-10">
                    <!-- Add to Cart Button -->
                    <button
                      (click)="isInCart(product.id) ? removeFromCart(product.id, $event) : addToCart(product, $event)"
                      class="p-2 md:p-2.5 rounded-lg border-2 border-black transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      [class.bg-[#68E079]]="isInCart(product.id)"
                      [class.bg-[#FFC60B]]="!isInCart(product.id)"
                    >
                      <svg *ngIf="!isInCart(product.id)" class="w-4 h-4 md:w-5 md:h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <svg *ngIf="isInCart(product.id)" class="w-4 h-4 md:w-5 md:h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>

                    <!-- Buy Now Button -->
                    <button
                      (click)="buyNow(product, $event)"
                      class="px-2 md:px-3 py-2 md:py-2.5 bg-[#7C3AED] text-white border-2 border-black rounded-lg font-bold text-[10px] md:text-xs transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-2 md:p-4">
                  <h3 class="font-bold text-[#111111] text-xs md:text-base line-clamp-2 mb-1 group-hover:text-[#2B57D6] transition-colors leading-tight">
                    {{ product.title }}
                  </h3>
                  
                  <!-- Creator -->
                  <div class="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                    <div class="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#2B57D6] border border-black overflow-hidden flex-shrink-0">
                      <img *ngIf="product.creator.avatarUrl" [src]="product.creator.avatarUrl" class="w-full h-full object-cover" />
                    </div>
                    <span class="text-[10px] md:text-xs text-[#111111]/60 font-medium truncate">
                      {{ product.creator.displayName || product.creator.username }}
                    </span>
                  </div>
                  
                  <!-- Price -->
                  <div class="flex items-center gap-1.5 md:gap-2">
                    <span class="font-bold text-[#111111] text-xs md:text-base">
                      {{ exploreService.formatPrice(product.price, product.currency) }}
                    </span>
                    <span
                      *ngIf="product.compareAtPrice && product.compareAtPrice > product.price"
                      class="text-[10px] md:text-xs text-[#111111]/40 line-through"
                    >
                      {{ exploreService.formatPrice(product.compareAtPrice, product.currency) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stores Grid -->
          <div *ngIf="!isLoading() && activeTab() === 'stores'">
            <div *ngIf="stores().length === 0" class="py-16 text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#111111] mb-2">No stores found</h3>
              <p class="text-[#111111]/60 font-medium">Try adjusting your search or filters</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div
                *ngFor="let store of stores()"
                class="group bg-white border-2 border-black rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                (click)="viewStore(store)"
              >
                <!-- Store Banner -->
                <div class="h-24 md:h-32 bg-gradient-to-br from-[#2B57D6] to-[#FA4B28] relative">
                  <img
                    *ngIf="store.bannerUrl"
                    [src]="store.bannerUrl"
                    [alt]="store.name"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- Store Logo -->
                  <div class="absolute -bottom-6 left-4 w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                    <img
                      *ngIf="store.logoUrl"
                      [src]="store.logoUrl"
                      [alt]="store.name"
                      class="w-full h-full object-cover"
                    />
                    <div *ngIf="!store.logoUrl" class="w-full h-full bg-[#F9F4EB] flex items-center justify-center">
                      <span class="text-lg md:text-xl font-bold text-[#111111]">{{ store.name.charAt(0) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Store Info -->
                <div class="p-4 pt-10">
                  <h3 class="font-bold text-[#111111] text-base md:text-lg mb-1 group-hover:text-[#2B57D6] transition-colors">
                    {{ store.name }}
                  </h3>
                  <p *ngIf="store.tagline" class="text-sm text-[#111111]/60 font-medium line-clamp-2 mb-3">
                    {{ store.tagline }}
                  </p>
                  
                  <!-- Stats -->
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-[#111111]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      <span class="text-sm font-medium text-[#111111]/60">{{ store.productCount }} products</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-5 h-5 rounded-full bg-[#68E079] border border-black overflow-hidden flex-shrink-0">
                        <img *ngIf="store.creator.avatarUrl" [src]="store.creator.avatarUrl" class="w-full h-full object-cover" />
                      </div>
                      <span class="text-sm font-medium text-[#111111]/60 truncate">
                        {{ store.creator.displayName || store.creator.username }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Creators Grid -->
          <div *ngIf="!isLoading() && activeTab() === 'creators'">
            <div *ngIf="creators().length === 0" class="py-16 text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#111111] mb-2">No creators found</h3>
              <p class="text-[#111111]/60 font-medium">Try adjusting your search or filters</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <div
                *ngFor="let creator of creators()"
                class="group bg-white border-2 border-black rounded-2xl p-4 md:p-5 hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
                (click)="viewCreator(creator)"
              >
                <!-- Avatar -->
                <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFC60B] to-[#FA4B28] border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_#000]">
                  <img
                    *ngIf="creator.avatarUrl"
                    [src]="creator.avatarUrl"
                    [alt]="creator.displayName || creator.username"
                    class="w-full h-full object-cover"
                  />
                  <div *ngIf="!creator.avatarUrl" class="w-full h-full flex items-center justify-center">
                    <span class="text-2xl md:text-3xl font-bold text-white">{{ (creator.displayName || creator.username).charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                
                <!-- Name -->
                <h3 class="font-bold text-[#111111] text-base md:text-lg mb-1 group-hover:text-[#2B57D6] transition-colors">
                  {{ creator.displayName || creator.username }}
                </h3>
                <p class="text-sm text-[#111111]/60 font-medium mb-3">&#64;{{ creator.username }}</p>
                
                <!-- Bio -->
                <p *ngIf="creator.bio" class="text-sm text-[#111111]/70 line-clamp-2 mb-4">
                  {{ creator.bio }}
                </p>
                
                <!-- Stats -->
                <div class="flex justify-center gap-4">
                  <div class="text-center">
                    <div class="text-lg font-bold text-[#111111]">{{ creator.storeCount }}</div>
                    <div class="text-xs text-[#111111]/50 font-medium">Stores</div>
                  </div>
                  <div class="w-px bg-black/10"></div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-[#111111]">{{ creator.productCount }}</div>
                    <div class="text-xs text-[#111111]/50 font-medium">Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div 
            *ngIf="!isLoading() && getTotalPages() > 1" 
            class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-12"
          >
            <div class="flex items-center gap-2">
              <button
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-lg font-bold text-[#111111] hover:bg-[#F9F4EB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <div class="flex items-center gap-1">
                <ng-container *ngFor="let page of getVisiblePages()">
                  <button
                    *ngIf="page !== '...'"
                    (click)="goToPage(+page)"
                    class="w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200"
                    [class.bg-[#111111]]="currentPage() === +page"
                    [class.text-white]="currentPage() === +page"
                    [class.shadow-[2px_2px_0px_0px_#FFC60B]]="currentPage() === +page"
                    [class.bg-white]="currentPage() !== +page"
                    [class.border-2]="currentPage() !== +page"
                    [class.border-black]="currentPage() !== +page"
                    [class.text-[#111111]]="currentPage() !== +page"
                    [class.hover:bg-[#F9F4EB]]="currentPage() !== +page"
                  >
                    {{ page }}
                  </button>
                  <span *ngIf="page === '...'" class="w-10 h-10 flex items-center justify-center text-[#111111]/50">
                    ...
                  </span>
                </ng-container>
              </div>
              
              <button
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() >= getTotalPages()"
                class="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-lg font-bold text-[#111111] hover:bg-[#F9F4EB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div class="text-sm text-[#111111]/60 font-medium">
              Page {{ currentPage() }} of {{ getTotalPages() }}
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-12 md:py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="bg-[#68E079] border-2 border-black rounded-[2rem] p-6 md:p-10 lg:p-12 text-center relative overflow-hidden shadow-[6px_6px_0px_0px_#000]">
            <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-3 relative z-10">
              Want to sell your products?
            </h2>
            <p class="text-base md:text-lg text-[#111111]/80 mb-6 font-medium relative z-10">
              Join thousands of creators and start selling today
            </p>
            <a 
              routerLink="/become-creator" 
              (click)="handleCreatorCtaClick($event)"
              class="relative z-10 inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-[#111111] text-white border-2 border-black rounded-lg font-bold text-base md:text-lg hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_#fff]"
            >
              Start selling for free
            </a>
            
            <!-- Decorative elements -->
            <div class="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-white/30 rounded-full border-2 border-black"></div>
            <div class="absolute -top-4 -right-4 w-20 md:w-32 h-20 md:h-32 bg-white/20 rounded-full border-2 border-black"></div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ExploreComponent implements OnInit {
  exploreService = inject(ExploreService);
  private subdomainService = inject(SubdomainService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);

  async handleCreatorCtaClick(event: Event) {
    if (this.authService.isSignedIn()) return;
    event.preventDefault();
    await this.authService.openCreatorSignup();
  }

  // State
  searchQuery = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  private searchTimeout: any;

  // Signals
  activeTab = signal<TabType>('products');
  isLoading = signal(true);
  showSortDropdown = signal(false);
  showPriceFilter = signal(false);
  currentPage = signal(1);
  
  stats = signal<ExploreStats | null>(null);
  products = signal<ExploreProduct[]>([]);
  stores = signal<ExploreStore[]>([]);
  creators = signal<ExploreCreator[]>([]);
  
  productsTotal = signal(0);
  storesTotal = signal(0);
  creatorsTotal = signal(0);
  
  currentSort = signal<SortOption>({ label: 'Newest', value: 'createdAt', order: 'desc' });

  // Tab configuration
  tabs = [
    { 
      value: 'products' as TabType, 
      label: 'Products',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>'
    },
    { 
      value: 'stores' as TabType, 
      label: 'Stores',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
    },
    { 
      value: 'creators' as TabType, 
      label: 'Creators',
      icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    },
  ];

  // Sort options
  sortOptions: SortOption[] = [
    { label: 'Newest', value: 'createdAt', order: 'desc' },
    { label: 'Oldest', value: 'createdAt', order: 'asc' },
    { label: 'Name A-Z', value: 'title', order: 'asc' },
    { label: 'Name Z-A', value: 'title', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
  ];

  async ngOnInit() {
    // Read query params for initial search
    this.route.queryParams.subscribe(async params => {
      const q = params['q'];
      const tab = params['tab'] as TabType | undefined;
      
      if (q) {
        this.searchQuery = q;
      }
      
      if (tab && ['products', 'stores', 'creators'].includes(tab)) {
        this.activeTab.set(tab);
      }
      
      await this.loadStats();
      await this.loadData();
    });
  }

  async loadStats() {
    try {
      const stats = await this.exploreService.getStats();
      this.stats.set(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async loadData() {
    this.isLoading.set(true);
    
    try {
      const params: ExploreQueryParams = {
        q: this.searchQuery || undefined,
        page: this.currentPage(),
        limit: 12,
        sortBy: this.currentSort().value,
        sortOrder: this.currentSort().order,
      };

      if (this.activeTab() === 'products') {
        if (this.minPrice !== null) params.minPrice = this.minPrice * 100; // Convert to paise
        if (this.maxPrice !== null) params.maxPrice = this.maxPrice * 100;
        
        const result = await this.exploreService.getProducts(params);
        this.products.set(result.items);
        this.productsTotal.set(result.total);
      } else if (this.activeTab() === 'stores') {
        const result = await this.exploreService.getStores(params);
        this.stores.set(result.items);
        this.storesTotal.set(result.total);
      } else {
        const result = await this.exploreService.getCreators(params);
        this.creators.set(result.items);
        this.creatorsTotal.set(result.total);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearchInput() {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 500);
  }

  performSearch() {
    this.currentPage.set(1);
    this.loadData();
  }

  switchTab(tab: TabType) {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      this.currentPage.set(1);
      this.showPriceFilter.set(false);
      this.loadData();
    }
  }

  toggleSortDropdown() {
    this.showSortDropdown.update(v => !v);
  }

  selectSort(option: SortOption) {
    this.currentSort.set(option);
    this.showSortDropdown.set(false);
    this.currentPage.set(1);
    this.loadData();
  }

  getCurrentSortLabel(): string {
    return this.currentSort().label;
  }

  togglePriceFilter() {
    this.showPriceFilter.update(v => !v);
  }

  hasPriceFilter(): boolean {
    return this.minPrice !== null || this.maxPrice !== null;
  }

  applyPriceFilter() {
    this.currentPage.set(1);
    this.loadData();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.minPrice !== null || this.maxPrice !== null);
  }

  clearFilters() {
    this.searchQuery = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.currentSort.set({ label: 'Newest', value: 'createdAt', order: 'desc' });
    this.currentPage.set(1);
    this.showPriceFilter.set(false);
    this.loadData();
  }

  getTabCount(tab: TabType): number {
    const s = this.stats();
    if (!s) return 0;
    
    switch (tab) {
      case 'products': return s.totalProducts;
      case 'stores': return s.totalStores;
      case 'creators': return s.totalCreators;
    }
  }

  getTotalResults(): number {
    switch (this.activeTab()) {
      case 'products': return this.productsTotal();
      case 'stores': return this.storesTotal();
      case 'creators': return this.creatorsTotal();
    }
  }

  getTotalPages(): number {
    const total = this.getTotalResults();
    return Math.ceil(total / 12);
  }

  getVisiblePages(): (number | string)[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (current > 3) pages.push('...');
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (current < total - 2) pages.push('...');
      
      pages.push(total);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage.set(page);
    this.loadData();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewProduct(product: ExploreProduct) {
    this.router.navigate(['/product', product.id]);
  }

  viewStore(store: ExploreStore) {
    this.router.navigate(['/store', store.slug]);
  }

  viewCreator(creator: ExploreCreator) {
    this.router.navigate(['/creator', creator.id]);
  }

  addToCart(product: ExploreProduct, event: Event) {
    event.stopPropagation();
    
    // Convert ExploreProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      coverImageUrl: product.coverImageUrl,
      storeId: product.store.id,
      store: {
        id: product.store.id,
        name: product.store.name,
        slug: product.store.slug,
      },
    } as any;
    
    this.cartService.addItem(cartProduct);
    // Removed: this.cartService.open();
  }

  async buyNow(product: ExploreProduct, event: Event) {
    event.stopPropagation();
    
    // Convert ExploreProduct to Product format for cart
    const cartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      currency: product.currency,
      coverImageUrl: product.coverImageUrl,
      storeId: product.store.id,
      store: {
        id: product.store.id,
        name: product.store.name,
        slug: product.store.slug,
      },
    } as any;
    
    this.cartService.addItem(cartProduct);
    this.cartService.open();
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  removeFromCart(productId: string, event: Event) {
    event.stopPropagation();
    this.cartService.removeItem(productId);
  }
}
