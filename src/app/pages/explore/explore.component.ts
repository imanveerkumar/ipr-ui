import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import {
  ExploreService,
  ExploreProduct,
  ExploreStore,
  ExploreCreator,
  ExploreStats,
  FeedItem,
  FeedQueryParams,
} from '../../core/services/explore.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

type ContentFilter = 'all' | 'products' | 'stores' | 'creators';
type SortOption = { label: string; value: string; order: 'asc' | 'desc' };

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">

      <!-- TOP BAR (Filters summary) -->
      <div class="sticky top-14 sm:top-16 z-40 bg-white border-b-2 border-black" [class.lg:hidden]="!hasActiveFilters()">
        <div class="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div class="flex items-center gap-2 sm:gap-3 h-14 sm:h-16">
            <!-- Mobile filter toggle -->
            <button
              (click)="toggleMobileFilters()"
              class="lg:hidden flex items-center justify-center w-10 h-10 bg-[#F9F4EB] border-2 border-black rounded-lg hover:bg-[#FFC60B] transition-colors flex-shrink-0"
              [class.bg-[#FFC60B]]="showMobileFilters()"
            >
              <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
            </button>

            <!-- Active filters summary -->
            <div class="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
              <ng-container *ngIf="hasActiveFilters()">
                <ng-container *ngFor="let chip of getActiveFilterChips().slice(0, 2)">
                  <span class="inline-flex items-center gap-1 px-2 py-1 border rounded-lg text-xs font-medium text-[#111111] flex-shrink-0"
                    [class.bg-[#FFC60B]/20]="chip.color === 'yellow'"
                    [class.border-[#FFC60B]]="chip.color === 'yellow'"
                    [class.bg-[#68E079]/20]="chip.color === 'green'"
                    [class.border-[#68E079]]="chip.color === 'green'"
                    [class.bg-[#2B57D6]/10]="chip.color === 'blue'"
                    [class.border-[#2B57D6]/30]="chip.color === 'blue'"
                  >
                    {{ chip.label }}
                    <button (click)="chip.remove()" class="hover:text-[#FA4B28] leading-none">&times;</button>
                  </span>
                </ng-container>
                <span *ngIf="getActiveFilterChips().length > 2" class="inline-flex items-center px-2 py-1 bg-[#111111]/10 border border-[#111111]/20 rounded-lg text-xs font-medium text-[#111111] flex-shrink-0">
                  +{{ getActiveFilterChips().length - 2 }} more
                </span>
                <button (click)="clearAllFilters()" class="ml-auto flex-shrink-0 px-3 py-1 bg-[#FA4B28]/20 text-[#FA4B28] rounded-lg text-xs font-bold hover:bg-[#FA4B28]/10 whitespace-nowrap">Clear filters</button>
              </ng-container>
            </div>

          </div>
        </div>
      </div>

      <!-- ==================== MAIN CONTENT ==================== -->
      <div class="max-w-[1440px] mx-auto flex">

        <!-- ==================== LEFT SIDEBAR (Desktop) ==================== -->
        <aside
          class="hidden lg:block flex-shrink-0 border-r-2 border-black/10 sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide transition-all duration-200"
          [class.w-16]="sidebarCollapsed()"
          [class.overflow-hidden]="sidebarCollapsed()"
          [class.w-64]="!sidebarCollapsed()"
        >
          <div class="relative">
            <!-- content shown only when sidebar expanded -->
            <div *ngIf="!sidebarCollapsed()">
            <!-- collapse/expand button row -->
            <div class="flex justify-end px-3 pt-3 pb-1">
              <button
                (click)="toggleSidebar()"
                class="w-8 h-8 flex items-center justify-center bg-[#F9F4EB] border-2 border-black rounded-full hover:bg-[#FFC60B] transition-colors"
              >
                <svg
                  class="w-4 h-4 text-[#111111] transition-transform"
                  [class.rotate-180]="!sidebarCollapsed()"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="p-4 xl:p-5 pt-2">
  
            <!-- Sort -->
            <div class="mb-5">
              <button (click)="toggleSection('sort')" class="w-full flex items-center justify-between py-2">
                <span class="text-sm font-bold text-[#111111]">Sort By</span>
                <svg class="w-4 h-4 text-[#111111]/50 transition-transform" [class.rotate-180]="expandedSections().has('sort')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="expandedSections().has('sort')" class="space-y-1 mt-1">
                <button
                  *ngFor="let option of sortOptions"
                  (click)="selectSort(option)"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                  [class.bg-[#111111]]="currentSort().value === option.value && currentSort().order === option.order"
                  [class.text-white]="currentSort().value === option.value && currentSort().order === option.order"
                  [class.font-bold]="currentSort().value === option.value && currentSort().order === option.order"
                  [class.text-[#111111]]="!(currentSort().value === option.value && currentSort().order === option.order)"
                  [class.font-medium]="!(currentSort().value === option.value && currentSort().order === option.order)"
                  [class.hover:bg-[#F9F4EB]]="!(currentSort().value === option.value && currentSort().order === option.order)"
                >
                  <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    [class.border-white]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.border-black/30]="!(currentSort().value === option.value && currentSort().order === option.order)"
                  >
                    <span
                      *ngIf="currentSort().value === option.value && currentSort().order === option.order"
                      class="w-2 h-2 rounded-full bg-[#FFC60B]"
                    ></span>
                  </span>
                  {{ option.label }}
                </button>
              </div>
            </div>

<!-- Content Type -->
            <div class="mb-5">
              <button (click)="toggleSection('type')" class="w-full flex items-center justify-between py-2">
                <span class="text-sm font-bold text-[#111111]">Content Type</span>
                <svg class="w-4 h-4 text-[#111111]/50 transition-transform" [class.rotate-180]="expandedSections().has('type')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="expandedSections().has('type')" class="space-y-1 mt-1">
                <button
                  *ngFor="let filter of contentFilters"
                  (click)="setContentFilter(filter.value)"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                  [class.bg-[#111111]]="activeFilter() === filter.value"
                  [class.text-white]="activeFilter() === filter.value"
                  [class.font-bold]="activeFilter() === filter.value"
                  [class.text-[#111111]]="activeFilter() !== filter.value"
                  [class.font-medium]="activeFilter() !== filter.value"
                  [class.hover:bg-[#F9F4EB]]="activeFilter() !== filter.value"
                >
                  <span class="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                    [class.bg-[#FFC60B]]="activeFilter() === filter.value"
                    [class.border-white]="activeFilter() === filter.value"
                    [class.border-black/30]="activeFilter() !== filter.value"
                  >
                    <svg *ngIf="activeFilter() === filter.value" class="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  {{ filter.label }}
                  <span class="ml-auto text-xs opacity-60">{{ getFilterCount(filter.value) }}</span>
                </button>
              </div>
            </div>



            <!-- Price Range -->
            <div *ngIf="activeFilter() === 'all' || activeFilter() === 'products'" class="mb-5">
              <button (click)="toggleSection('price')" class="w-full flex items-center justify-between py-2">
                <span class="text-sm font-bold text-[#111111]">Price Range</span>
                <svg class="w-4 h-4 text-[#111111]/50 transition-transform" [class.rotate-180]="expandedSections().has('price')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="expandedSections().has('price')" class="mt-2 space-y-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <label class="text-[10px] font-medium text-[#111111]/50 uppercase tracking-wider">Min</label>
                    <input
                      type="number"
                      [(ngModel)]="minPrice"
                      placeholder="0"
                      class="w-full mt-1 px-3 py-2 bg-[#F9F4EB] border-2 border-black/20 rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <span class="text-[#111111]/30 mt-5">&ndash;</span>
                  <div class="flex-1">
                    <label class="text-[10px] font-medium text-[#111111]/50 uppercase tracking-wider">Max</label>
                    <input
                      type="number"
                      [(ngModel)]="maxPrice"
                      placeholder="Any"
                      class="w-full mt-1 px-3 py-2 bg-[#F9F4EB] border-2 border-black/20 rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>
                <button
                  (click)="applyPriceFilter()"
                  class="w-full py-2 bg-[#111111] text-white border-2 border-black rounded-lg text-sm font-bold hover:bg-[#333] transition-colors"
                >
                  Apply Price
                </button>
              </div>
            </div>

            <!-- Stats -->
            <div *ngIf="stats()" class="pt-4 border-t border-black/10">
              <div class="text-xs font-bold text-[#111111]/40 uppercase tracking-wider mb-3">Explore Stats</div>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#111111]/60 font-medium">Products</span>
                  <span class="text-sm font-bold text-[#111111]">{{ stats()!.totalProducts }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#111111]/60 font-medium">Stores</span>
                  <span class="text-sm font-bold text-[#111111]">{{ stats()!.totalStores }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#111111]/60 font-medium">Creators</span>
                  <span class="text-sm font-bold text-[#111111]">{{ stats()!.totalCreators }}</span>
                </div>
              </div>
            </div>
            <!-- end expanded-only containers -->
            </div>
            </div>
            <!-- collapsed state: toggle button on top then icons -->
            <div *ngIf="sidebarCollapsed()" class="flex flex-col items-center gap-4 py-4">
              <button
                (click)="toggleSidebar()"
                class="w-8 h-8 flex items-center justify-center bg-[#F9F4EB] border-2 border-black rounded-full hover:bg-[#FFC60B] transition-colors mb-2"
              >
                <svg
                  class="w-4 h-4 text-[#111111] transition-transform"
                  [class.rotate-180]="!sidebarCollapsed()"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                *ngFor="let filter of contentFilters"
                (click)="setContentFilter(filter.value)"
                [title]="filter.label"
                class="w-10 h-10 flex items-center justify-center text-[#111111] hover:bg-[#F9F4EB] rounded-lg transition-colors"
                [class.bg-[#FFC60B]]="activeFilter() === filter.value"
              >
                <ng-container [ngSwitch]="filter.value">
                  <svg *ngSwitchCase="'all'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg *ngSwitchCase="'products'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                    <!-- shopping bag icon -->
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14l-1 10H6L5 8zm5-3h4a2 2 0 10-4 0z" />
                  </svg>
                  <svg *ngSwitchCase="'stores'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 20h18M5 20V10h14v10M3 10l2-4h14l2 4" />
                  </svg>
                  <svg *ngSwitchCase="'creators'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 20v-2c0-2.21 3.58-4 6-4s6 1.79 6 4v2" />
                  </svg>
                </ng-container>
              </button>
            </div>
          </div>
        </aside>

        <!-- ==================== MOBILE FILTER DRAWER ==================== -->
        <div
          *ngIf="showMobileFilters()"
          class="fixed inset-0 z-50 lg:hidden"
        >
          <div (click)="showMobileFilters.set(false)" class="absolute inset-0 bg-black/50"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div class="sticky top-0 bg-white border-b border-black/10 p-4 flex items-center justify-between z-10">
              <span class="text-base font-bold text-[#111111]">Filters</span>
              <div class="flex items-center gap-3">
                <button *ngIf="hasActiveFilters()" (click)="clearAllFilters()" class="text-sm text-[#FA4B28] font-bold">Clear all</button>
                <button (click)="showMobileFilters.set(false)" class="w-8 h-8 flex items-center justify-center bg-[#F9F4EB] border-2 border-black rounded-lg">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="p-4 space-y-5">
              <div>
                <span class="text-sm font-bold text-[#111111] mb-2 block">Content Type</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let filter of contentFilters"
                    (click)="setContentFilter(filter.value)"
                    class="px-4 py-2 rounded-lg text-sm font-bold transition-all border-2"
                    [class.bg-[#111111]]="activeFilter() === filter.value"
                    [class.text-white]="activeFilter() === filter.value"
                    [class.border-black]="activeFilter() === filter.value"
                    [class.bg-white]="activeFilter() !== filter.value"
                    [class.text-[#111111]]="activeFilter() !== filter.value"
                    [class.border-black/20]="activeFilter() !== filter.value"
                  >
                    {{ filter.label }}
                  </button>
                </div>
              </div>
              <div>
                <span class="text-sm font-bold text-[#111111] mb-2 block">Sort By</span>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    *ngFor="let option of sortOptions"
                    (click)="selectSort(option)"
                    class="px-3 py-2 rounded-lg text-sm font-medium transition-all border-2"
                    [class.bg-[#111111]]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.text-white]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.border-black]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.bg-white]="!(currentSort().value === option.value && currentSort().order === option.order)"
                    [class.text-[#111111]]="!(currentSort().value === option.value && currentSort().order === option.order)"
                    [class.border-black/20]="!(currentSort().value === option.value && currentSort().order === option.order)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <div *ngIf="activeFilter() === 'all' || activeFilter() === 'products'">
                <span class="text-sm font-bold text-[#111111] mb-2 block">Price Range</span>
                <div class="flex items-center gap-2">
                  <input type="number" [(ngModel)]="minPrice" placeholder="Min" class="flex-1 px-3 py-2.5 bg-[#F9F4EB] border-2 border-black/20 rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-black" />
                  <span class="text-[#111111]/30">&ndash;</span>
                  <input type="number" [(ngModel)]="maxPrice" placeholder="Max" class="flex-1 px-3 py-2.5 bg-[#F9F4EB] border-2 border-black/20 rounded-lg text-sm font-medium text-[#111111] placeholder-[#111111]/30 focus:outline-none focus:border-black" />
                </div>
              </div>
              <button
                (click)="applyMobileFilters()"
                class="w-full py-3 bg-[#FFC60B] border-2 border-black rounded-xl text-base font-bold text-[#111111] shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <!-- ==================== MASONRY GRID ==================== -->
        <main class="flex-1 min-w-0">
          <!-- Mobile content type pills -->
          <div class="sm:hidden overflow-x-auto scrollbar-hide border-b border-black/10">
            <div class="flex gap-1.5 p-3">
              <button
                *ngFor="let filter of contentFilters"
                (click)="setContentFilter(filter.value)"
                class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border-2"
                [class.bg-[#111111]]="activeFilter() === filter.value"
                [class.text-white]="activeFilter() === filter.value"
                [class.border-black]="activeFilter() === filter.value"
                [class.bg-white]="activeFilter() !== filter.value"
                [class.text-[#111111]]="activeFilter() !== filter.value"
                [class.border-black/20]="activeFilter() !== filter.value"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div class="p-3 sm:p-4 md:p-6">
            <!-- Skeleton Loader -->
            <div *ngIf="isLoading() && feedItems().length === 0" class="masonry-grid">
              <div *ngFor="let i of skeletonArray" class="masonry-item mb-3 sm:mb-4">
                <div class="bg-white border-2 border-black/10 rounded-xl overflow-hidden">
                  <div class="bg-[#F9F4EB] animate-pulse" [style.height.px]="getSkeletonHeight(i)"></div>
                  <div class="p-3">
                    <div class="h-4 bg-[#111111]/10 rounded animate-pulse mb-2 w-3/4"></div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-5 h-5 rounded-full bg-[#111111]/10 animate-pulse"></div>
                      <div class="h-3 bg-[#111111]/5 rounded animate-pulse w-20"></div>
                    </div>
                    <div class="h-4 bg-[#111111]/10 rounded animate-pulse w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!isLoading() && feedItems().length === 0" class="py-20 text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center">
                <svg class="w-12 h-12 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#111111] mb-2 font-dm-sans">Nothing found</h3>
              <p class="text-[#111111]/60 font-medium mb-6">Try adjusting your search or filters</p>
              <button
                (click)="clearAllFilters()"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFC60B] border-2 border-black rounded-xl text-sm font-bold text-[#111111] shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                Clear all filters
              </button>
            </div>

            <!-- Feed Grid -->
            <div *ngIf="feedItems().length > 0" class="masonry-grid">
              <ng-container *ngFor="let item of feedItems(); let i = index; trackBy: trackFeedItem">
                <div class="masonry-item mb-3 sm:mb-4 feed-item-enter" [style.animation-delay.ms]="getAnimationDelay(i)">

                  <!-- PRODUCT CARD -->
                  <div
                    *ngIf="item.type === 'product'"
                    class="group bg-white border-2 border-black rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    (click)="navigateToProduct(asProduct(item.data).id)"
                  >
                    <div class="relative overflow-hidden bg-[#F9F4EB]" [style.aspect-ratio]="getProductAspectRatio(i)">
                      <img
                        *ngIf="asProduct(item.data).coverImageUrl"
                        [src]="asProduct(item.data).coverImageUrl"
                        [alt]="asProduct(item.data).title"
                        loading="lazy"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div *ngIf="!asProduct(item.data).coverImageUrl" class="w-full h-full flex items-center justify-center aspect-square">
                        <svg class="w-10 h-10 text-[#111111]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <div
                        *ngIf="asProduct(item.data).compareAtPrice && asProduct(item.data).compareAtPrice! > asProduct(item.data).price"
                        class="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FA4B28] border border-black rounded text-[10px] font-bold text-white"
                      >
                        -{{ exploreService.getDiscountPercentage(asProduct(item.data).price, asProduct(item.data).compareAtPrice!) }}%
                      </div>
                      <!-- Desktop hover overlay -->
                      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 hidden md:flex items-end justify-center opacity-0 group-hover:opacity-100 p-3">
                        <div class="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                          <button
                            (click)="isInCart(asProduct(item.data).id) ? removeFromCart(asProduct(item.data).id, $event) : addToCart(asProduct(item.data), $event)"
                            class="px-3 py-2 border-2 border-black rounded-lg text-xs font-bold text-[#111111] shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            [class.bg-[#68E079]]="isInCart(asProduct(item.data).id)"
                            [class.bg-[#FFC60B]]="!isInCart(asProduct(item.data).id)"
                          >
                            {{ isInCart(asProduct(item.data).id) ? '&#10003; In Cart' : '+ Add to Cart' }}
                          </button>
                          <button
                            (click)="buyNow(asProduct(item.data), $event)"
                            class="px-3 py-2 bg-[#111111] text-white border-2 border-black rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#FFC60B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                      <!-- Mobile cart button -->
                      <button
                        (click)="isInCart(asProduct(item.data).id) ? removeFromCart(asProduct(item.data).id, $event) : addToCart(asProduct(item.data), $event)"
                        class="md:hidden absolute bottom-2 right-2 p-2 rounded-lg border-2 border-black transition-all duration-200 shadow-[2px_2px_0px_0px_#000]"
                        [class.bg-[#68E079]]="isInCart(asProduct(item.data).id)"
                        [class.bg-[#FFC60B]]="!isInCart(asProduct(item.data).id)"
                      >
                        <svg *ngIf="!isInCart(asProduct(item.data).id)" class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <svg *ngIf="isInCart(asProduct(item.data).id)" class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                      </button>
                    </div>
                    <div class="p-2.5 sm:p-3">
                      <h3 class="font-bold text-[#111111] text-xs sm:text-sm line-clamp-2 mb-1 group-hover:text-[#2B57D6] transition-colors leading-tight">
                        {{ asProduct(item.data).title }}
                      </h3>
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <div class="w-4 h-4 rounded-full bg-[#2B57D6] border border-black overflow-hidden flex-shrink-0">
                          <img *ngIf="asProduct(item.data).creator.avatarUrl" [src]="asProduct(item.data).creator.avatarUrl" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-[10px] sm:text-xs text-[#111111]/50 font-medium truncate">
                          {{ asProduct(item.data).creator.displayName || asProduct(item.data).creator.username }}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-[#111111] text-xs sm:text-sm">
                          {{ exploreService.formatPrice(asProduct(item.data).price, asProduct(item.data).currency) }}
                        </span>
                        <span
                          *ngIf="asProduct(item.data).compareAtPrice && asProduct(item.data).compareAtPrice! > asProduct(item.data).price"
                          class="text-[10px] text-[#111111]/40 line-through"
                        >
                          {{ exploreService.formatPrice(asProduct(item.data).compareAtPrice!, asProduct(item.data).currency) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- STORE CARD -->
                  <div
                    *ngIf="item.type === 'store'"
                    class="group bg-white border-2 border-[#2B57D6] rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#2B57D6] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    (click)="navigateToStore(asStore(item.data).slug)"
                  >
                    <div class="h-20 sm:h-24 bg-gradient-to-br from-[#2B57D6] to-[#7C3AED] relative">
                      <img *ngIf="asStore(item.data).bannerUrl" [src]="asStore(item.data).bannerUrl" [alt]="asStore(item.data).name" loading="lazy" class="w-full h-full object-cover" />
                      <span class="absolute top-2 right-2 px-2 py-0.5 bg-[#2B57D6] border border-white/30 rounded text-[9px] font-bold text-white uppercase tracking-wider">Store</span>
                      <div class="absolute -bottom-5 left-3 w-12 h-12 bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                        <img *ngIf="asStore(item.data).logoUrl" [src]="asStore(item.data).logoUrl" [alt]="asStore(item.data).name" class="w-full h-full object-cover" />
                        <div *ngIf="!asStore(item.data).logoUrl" class="w-full h-full bg-[#F9F4EB] flex items-center justify-center">
                          <span class="text-base font-bold text-[#111111]">{{ asStore(item.data).name.charAt(0) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 pt-8">
                      <h3 class="font-bold text-[#111111] text-sm sm:text-base mb-0.5 group-hover:text-[#2B57D6] transition-colors">
                        {{ asStore(item.data).name }}
                      </h3>
                      <p *ngIf="asStore(item.data).tagline" class="text-xs text-[#111111]/50 font-medium line-clamp-2 mb-3">
                        {{ asStore(item.data).tagline }}
                      </p>
                      <div class="flex items-center gap-3 text-xs text-[#111111]/50 font-medium">
                        <span class="flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                          {{ asStore(item.data).productCount }} products
                        </span>
                        <span class="flex items-center gap-1">
                          <div class="w-4 h-4 rounded-full bg-[#68E079] border border-black overflow-hidden flex-shrink-0">
                            <img *ngIf="asStore(item.data).creator.avatarUrl" [src]="asStore(item.data).creator.avatarUrl" class="w-full h-full object-cover" />
                          </div>
                          {{ asStore(item.data).creator.displayName || asStore(item.data).creator.username }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- CREATOR CARD -->
                  <div
                    *ngIf="item.type === 'creator'"
                    class="group bg-white border-2 border-[#FFC60B] rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#FFC60B] hover:-translate-y-1 transition-all duration-200 cursor-pointer p-4 text-center"
                    (click)="navigateToCreator(asCreator(item.data).id)"
                  >
                    <span class="inline-block px-2 py-0.5 bg-[#FFC60B]/20 border border-[#FFC60B] rounded text-[9px] font-bold text-[#111111] uppercase tracking-wider mb-3">Creator</span>
                    <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#FFC60B] to-[#FA4B28] border-2 border-black overflow-hidden shadow-[3px_3px_0px_0px_#000]">
                      <img *ngIf="asCreator(item.data).avatarUrl" [src]="asCreator(item.data).avatarUrl" [alt]="asCreator(item.data).displayName || asCreator(item.data).username" loading="lazy" class="w-full h-full object-cover" />
                      <div *ngIf="!asCreator(item.data).avatarUrl" class="w-full h-full flex items-center justify-center">
                        <span class="text-xl sm:text-2xl font-bold text-white">{{ (asCreator(item.data).displayName || asCreator(item.data).username).charAt(0).toUpperCase() }}</span>
                      </div>
                    </div>
                    <h3 class="font-bold text-[#111111] text-sm sm:text-base mb-0.5 group-hover:text-[#2B57D6] transition-colors">
                      {{ asCreator(item.data).displayName || asCreator(item.data).username }}
                    </h3>
                    <p class="text-xs text-[#111111]/50 font-medium mb-2">&#64;{{ asCreator(item.data).username }}</p>
                    <p *ngIf="asCreator(item.data).bio" class="text-xs text-[#111111]/60 line-clamp-2 mb-3">{{ asCreator(item.data).bio }}</p>
                    <div class="flex justify-center gap-4">
                      <div class="text-center">
                        <div class="text-base font-bold text-[#111111]">{{ asCreator(item.data).storeCount }}</div>
                        <div class="text-[10px] text-[#111111]/40 font-medium">Stores</div>
                      </div>
                      <div class="w-px bg-black/10"></div>
                      <div class="text-center">
                        <div class="text-base font-bold text-[#111111]">{{ asCreator(item.data).productCount }}</div>
                        <div class="text-[10px] text-[#111111]/40 font-medium">Products</div>
                      </div>
                    </div>
                  </div>

                </div>
              </ng-container>
            </div>

            <!-- Infinite scroll sentinel -->
            <div #scrollSentinel class="h-4"></div>

            <!-- Loading more -->
            <div *ngIf="isLoadingMore()" class="flex justify-center py-8">
              <div class="flex items-center gap-3">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-[#111111] rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 bg-[#111111] rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 bg-[#111111] rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
                <span class="text-sm font-medium text-[#111111]/50">Loading more</span>
              </div>
            </div>

            <!-- End of results -->
            <div *ngIf="!isLoading() && !hasMore() && feedItems().length > 0" class="text-center py-8">
              <span class="text-sm text-[#111111]/40 font-medium">You've seen it all</span>
            </div>
          </div>

          <!-- CTA Section -->
          <section *ngIf="!isLoading() && feedItems().length > 0" class="px-3 sm:px-4 md:px-6 pb-8">
            <div class="bg-[#68E079] border-2 border-black rounded-2xl p-6 md:p-10 text-center relative overflow-hidden shadow-[6px_6px_0px_0px_#000]">
              <h2 class="font-dm-sans text-xl md:text-2xl lg:text-3xl font-bold text-[#111111] mb-2 relative z-10">
                Want to sell your products?
              </h2>
              <p class="text-sm md:text-base text-[#111111]/70 mb-5 font-medium relative z-10">
                Join creators and start selling today
              </p>
              <a
                routerLink="/become-creator"
                (click)="handleCreatorCtaClick($event)"
                class="relative z-10 inline-flex items-center px-5 py-2.5 md:px-7 md:py-3 bg-[#111111] text-white border-2 border-black rounded-lg font-bold text-sm md:text-base hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_#fff]"
              >
                Start selling for free
              </a>
              <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-white/20 rounded-full border-2 border-black"></div>
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-white/15 rounded-full border-2 border-black"></div>
            </div>
          </section>
        </main>
      </div>
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

    /* Masonry Grid */
    .masonry-grid {
      columns: 2;
      column-gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .masonry-grid {
        columns: 2;
        column-gap: 1rem;
      }
    }

    @media (min-width: 768px) {
      .masonry-grid {
        columns: 3;
      }
    }

    @media (min-width: 1024px) {
      .masonry-grid {
        columns: 3;
      }
    }

    @media (min-width: 1280px) {
      .masonry-grid {
        columns: 4;
      }
    }

    @media (min-width: 1536px) {
      .masonry-grid {
        columns: 5;
      }
    }

    .masonry-item {
      break-inside: avoid;
    }

    /* Fade in animation */
    .feed-item-enter {
      animation: feedItemFadeIn 0.3s ease-out both;
    }

    @keyframes feedItemFadeIn {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slide-up {
      animation: slideUpDrawer 0.25s ease-out;
    }

    @keyframes slideUpDrawer {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `]
})
export class ExploreComponent implements OnInit, OnDestroy, AfterViewInit {
  exploreService = inject(ExploreService);
  private subdomainService = inject(SubdomainService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  cartService = inject(CartService);
  authService = inject(AuthService);

  @ViewChild('scrollSentinel') scrollSentinelRef!: ElementRef<HTMLDivElement>;

  // State
  minPrice: number | null = null;
  maxPrice: number | null = null;
  appliedMinPrice: number | null = null;
  appliedMaxPrice: number | null = null;
  private intersectionObserver?: IntersectionObserver;
  private isLoadingFeed = false;

  skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private skeletonHeights = this.skeletonArray.map(() => 120 + Math.floor(Math.random() * 120));
  private productAspectRatios = ['3/4', '4/5', '1/1', '3/4', '4/3', '3/4', '1/1', '4/5'];

  // Signals
  activeFilter = signal<ContentFilter>('all');
  isLoading = signal(true);
  isLoadingMore = signal(false);
  showMobileFilters = signal(false);
  hasMore = signal(true);

  feedItems = signal<FeedItem[]>([]);
  nextCursor = signal<string | null>(null);
  totalResults = signal(0);
  stats = signal<ExploreStats | null>(null);

  currentSort = signal<SortOption>({ label: 'Newest', value: 'createdAt', order: 'desc' });
  expandedSections = signal<Set<string>>(new Set(['sort', 'type', 'price']));

  contentFilters: { label: string; value: ContentFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Products', value: 'products' },
    { label: 'Stores', value: 'stores' },
    { label: 'Creators', value: 'creators' },
  ];

  // sidebar state for desktop collapse
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  sortOptions: SortOption[] = [
    { label: 'Newest', value: 'createdAt', order: 'desc' },
    { label: 'Oldest', value: 'createdAt', order: 'asc' },
    { label: 'Name A-Z', value: 'title', order: 'asc' },
    { label: 'Name Z-A', value: 'title', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
  ];

  // Lifecycle
  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const type = params['type'] as ContentFilter | undefined;
      if (type && ['all', 'products', 'stores', 'creators'].includes(type)) {
        this.activeFilter.set(type);
      }
      await Promise.all([this.loadStats(), this.loadFeed(true)]);
    });
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
  }

  // Intersection Observer for infinite scroll
  private setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && this.hasMore() && !this.isLoadingFeed && !this.isLoading()) {
            this.ngZone.run(() => this.loadMore());
          }
        },
        { rootMargin: '400px' }
      );
      setTimeout(() => {
        if (this.scrollSentinelRef?.nativeElement) {
          this.intersectionObserver!.observe(this.scrollSentinelRef.nativeElement);
        }
      }, 100);
    });
  }

  // Data loading
  async loadStats() {
    try {
      const stats = await this.exploreService.getStats();
      this.stats.set(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async loadFeed(reset = false) {
    if (this.isLoadingFeed) return;
    this.isLoadingFeed = true;

    if (reset) {
      this.isLoading.set(true);
      this.feedItems.set([]);
      this.nextCursor.set(null);
      this.hasMore.set(true);
    }

    try {
      const params: FeedQueryParams = {
        limit: 24,
        type: this.activeFilter(),
        sortBy: this.currentSort().value,
        sortOrder: this.currentSort().order,
      };

      if (this.appliedMinPrice !== null) params.minPrice = this.appliedMinPrice * 100;
      if (this.appliedMaxPrice !== null) params.maxPrice = this.appliedMaxPrice * 100;
      if (!reset && this.nextCursor()) params.cursor = this.nextCursor()!;

      const result = await this.exploreService.getFeed(params);

      if (reset) {
        this.feedItems.set(result.items);
      } else {
        this.feedItems.update(items => [...items, ...result.items]);
      }

      this.nextCursor.set(result.nextCursor);
      this.hasMore.set(result.hasMore);
      this.totalResults.set(result.total);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      this.isLoading.set(false);
      this.isLoadingFeed = false;
    }
  }

  async loadMore() {
    if (!this.hasMore() || this.isLoadingFeed) return;
    this.isLoadingMore.set(true);
    await this.loadFeed(false);
    this.isLoadingMore.set(false);
  }


  // Filters
  setContentFilter(filter: ContentFilter) {
    if (this.activeFilter() !== filter) {
      this.activeFilter.set(filter);
      this.loadFeed(true);
    }
  }

  selectSort(option: SortOption) {
    this.currentSort.set(option);
    this.loadFeed(true);
  }

  resetSort() {
    this.currentSort.set({ label: 'Newest', value: 'createdAt', order: 'desc' });
    this.loadFeed(true);
  }

  applyPriceFilter() {
    this.appliedMinPrice = this.minPrice;
    this.appliedMaxPrice = this.maxPrice;
    this.loadFeed(true);
  }

  applyFiltersAndReload() {
    this.loadFeed(true);
  }

  applyMobileFilters() {
    this.appliedMinPrice = this.minPrice;
    this.appliedMaxPrice = this.maxPrice;
    this.showMobileFilters.set(false);
    this.loadFeed(true);
  }

  hasActiveFilters(): boolean {
    return this.activeFilter() !== 'all' ||
      this.appliedMinPrice !== null ||
      this.appliedMaxPrice !== null ||
      this.currentSort().value !== 'createdAt' ||
      this.currentSort().order !== 'desc';
  }

  clearAllFilters() {
    this.activeFilter.set('all');
    this.minPrice = null;
    this.maxPrice = null;
    this.appliedMinPrice = null;
    this.appliedMaxPrice = null;
    this.currentSort.set({ label: 'Newest', value: 'createdAt', order: 'desc' });
    this.loadFeed(true);
  }

  toggleSection(section: string) {
    this.expandedSections.update(set => {
      const newSet = new Set(set);
      if (newSet.has(section)) newSet.delete(section);
      else newSet.add(section);
      return newSet;
    });
  }

  toggleMobileFilters() {
    this.showMobileFilters.update(v => !v);
  }

  getFilterCount(filter: ContentFilter): string {
    const s = this.stats();
    if (!s) return '';
    switch (filter) {
      case 'all': return String(s.totalProducts + s.totalStores + s.totalCreators);
      case 'products': return String(s.totalProducts);
      case 'stores': return String(s.totalStores);
      case 'creators': return String(s.totalCreators);
    }
  }

  // Type helpers
  asProduct(data: any): ExploreProduct { return data as ExploreProduct; }
  asStore(data: any): ExploreStore { return data as ExploreStore; }
  asCreator(data: any): ExploreCreator { return data as ExploreCreator; }

  trackFeedItem(index: number, item: FeedItem): string {
    return item.type + '-' + (item.data as any).id;
  }

  // UI helpers
  getSkeletonHeight(i: number): number {
    return this.skeletonHeights[i - 1] || 160;
  }

  getProductAspectRatio(index: number): string {
    return this.productAspectRatios[index % this.productAspectRatios.length];
  }

  getAnimationDelay(index: number): number {
    if (index < 24) return (index % 8) * 40;
    return 0;
  }

  // Navigation
  navigateToProduct(id: string) {
    this.router.navigate(['/product', id]);
  }

  navigateToStore(slug: string) {
    this.router.navigate(['/store', slug]);
  }

  navigateToCreator(id: string) {
    this.router.navigate(['/creator', id]);
  }

  // Cart
  addToCart(product: ExploreProduct, event: Event) {
    event.stopPropagation();
    const cartProduct = {
      id: product.id, title: product.title, slug: product.slug,
      price: product.price, compareAtPrice: product.compareAtPrice,
      currency: product.currency, coverImageUrl: product.coverImageUrl,
      storeId: product.store.id,
      store: { id: product.store.id, name: product.store.name, slug: product.store.slug },
    } as any;
    this.cartService.addItem(cartProduct);
  }

  async buyNow(product: ExploreProduct, event: Event) {
    event.stopPropagation();
    const cartProduct = {
      id: product.id, title: product.title, slug: product.slug,
      price: product.price, compareAtPrice: product.compareAtPrice,
      currency: product.currency, coverImageUrl: product.coverImageUrl,
      storeId: product.store.id,
      store: { id: product.store.id, name: product.store.name, slug: product.store.slug },
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

  async handleCreatorCtaClick(event: Event) {
    if (this.authService.isSignedIn()) return;
    event.preventDefault();
    await this.authService.openCreatorSignup();
  }

  getActiveFilterChips(): Array<{ label: string; color: 'yellow' | 'green' | 'blue'; remove: () => void }> {
    const chips: Array<{ label: string; color: 'yellow' | 'green' | 'blue'; remove: () => void }> = [];
    if (this.activeFilter() !== 'all') {
      const f = this.activeFilter();
      chips.push({
        label: f.charAt(0).toUpperCase() + f.slice(1),
        color: 'yellow',
        remove: () => this.setContentFilter('all'),
      });
    }
    if (this.appliedMinPrice !== null) {
      chips.push({
        label: `Min: \u20B9${this.appliedMinPrice}`,
        color: 'green',
        remove: () => { this.appliedMinPrice = null; this.minPrice = null; this.applyFiltersAndReload(); },
      });
    }
    if (this.appliedMaxPrice !== null) {
      chips.push({
        label: `Max: \u20B9${this.appliedMaxPrice}`,
        color: 'green',
        remove: () => { this.appliedMaxPrice = null; this.maxPrice = null; this.applyFiltersAndReload(); },
      });
    }
    if (this.currentSort().value !== 'createdAt' || this.currentSort().order !== 'desc') {
      chips.push({
        label: this.currentSort().label,
        color: 'blue',
        remove: () => this.resetSort(),
      });
    }
    return chips;
  }
}
