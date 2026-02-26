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
  FilterSection,
  ExploreFiltersResponse,
  FilterOption,
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
      <div class="sticky top-14 sm:top-16 z-40 bg-[#F9F4EB]/95 backdrop-blur-sm border-b-2 border-black/10" [class.lg:hidden]="!hasActiveFilters()">
        <div class="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div class="flex items-center gap-2 sm:gap-3 h-12 sm:h-14">
            <!-- Mobile filter toggle -->
            <button
              (click)="toggleMobileFilters()"
              class="lg:hidden flex items-center justify-center gap-1.5 h-9 px-3.5 bg-[#F9F4EB] border-2 border-black/20 rounded-lg text-[#111111]/60 hover:border-black hover:bg-[#FFC60B]/10 active:scale-95 transition-all duration-200 flex-shrink-0 font-dm-sans min-w-[44px]"
              [class.border-black]="showMobileFilters()"
              [class.bg-[#111111]]="showMobileFilters()"
              [class.text-white]="showMobileFilters()"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="text-xs font-semibold">Filters</span>
              <span *ngIf="hasActiveFilters()" class="w-1.5 h-1.5 rounded-full bg-[#FA4B28] flex-shrink-0"></span>
            </button>

            <!-- Active filters summary -->
            <div class="flex-1 flex items-center gap-1.5 min-w-0 overflow-hidden">
              <ng-container *ngIf="hasActiveFilters()">
                <ng-container *ngFor="let chip of getActiveFilterChips().slice(0, 3)">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFC60B]/20 border border-[#111111]/15 rounded-lg text-[11px] font-bold text-[#111111] flex-shrink-0 hover:bg-[#FFC60B]/30 transition-colors font-dm-sans">
                    {{ chip.label }}
                    <button (click)="chip.remove()" class="ml-0.5 text-[#111111]/40 hover:text-[#FA4B28] transition-colors leading-none">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </span>
                </ng-container>
                <span *ngIf="getActiveFilterChips().length > 3" class="inline-flex items-center px-2 py-1 bg-[#FFC60B]/10 border border-[#111111]/10 rounded-lg text-[11px] font-bold text-[#111111]/60 flex-shrink-0">
                  +{{ getActiveFilterChips().length - 3 }}
                </span>
                <button (click)="clearAllFilters()" class="ml-auto flex-shrink-0 text-[11px] font-bold text-[#FA4B28] hover:text-[#d63a1a] transition-colors whitespace-nowrap font-dm-sans">Clear all</button>
              </ng-container>
            </div>

          </div>
        </div>
      </div>

      <!-- ==================== MAIN CONTENT ==================== -->
      <div class="max-w-[1440px] mx-auto flex">

        <!-- ==================== LEFT SIDEBAR (Desktop) ==================== -->
        <aside
          class="sidebar-container hidden lg:block flex-shrink-0 sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#F9F4EB] border-r-2 border-black/10"
          [class.sidebar-collapsed]="sidebarCollapsed()"
          [class.sidebar-expanded]="!sidebarCollapsed()"
        >
          <!-- Collapse / Expand toggle -->
          <div class="flex items-center px-4 h-14 border-b-2 border-black/10">
            <button
              (click)="toggleSidebar()"
              class="sidebar-toggle group relative w-8 h-8 flex items-center justify-center rounded-lg text-[#111111]/50 hover:text-[#111111] hover:bg-[#111111]/5 transition-all duration-200"
              [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <svg
                class="w-[18px] h-[18px] transition-transform duration-300"
                [class.rotate-180]="sidebarCollapsed()"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7" />
              </svg>
            </button>
            <span *ngIf="!sidebarCollapsed()" class="ml-3 text-[13px] font-bold text-[#111111] tracking-tight sidebar-label font-dm-sans">Filters</span>
            <button *ngIf="!sidebarCollapsed() && hasActiveFilters()" (click)="clearAllFilters()" class="ml-auto text-[11px] font-semibold text-[#FA4B28] hover:text-[#d63a1a] transition-colors sidebar-label">Reset all</button>
          </div>

          <!-- EXPANDED STATE -->
          <div *ngIf="!sidebarCollapsed()" class="sidebar-content">
            <div class="px-4 py-4 space-y-1">

              <!-- Content Type Section -->
              <div class="sidebar-section">
                <button (click)="toggleSection('type')" class="sidebar-section-header">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    <span>Browse</span>
                  </div>
                  <svg class="sidebar-chevron" [class.rotate-180]="expandedSections().has('type')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div *ngIf="expandedSections().has('type')" class="sidebar-section-body">
                  <button
                    *ngFor="let filter of contentFilters"
                    (click)="setContentFilter(filter.value)"
                    class="sidebar-option"
                    [class.sidebar-option-active]="activeFilter() === filter.value"
                  >
                    <ng-container [ngSwitch]="filter.value">
                      <svg *ngSwitchCase="'all'" class="sidebar-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/></svg>
                      <svg *ngSwitchCase="'products'" class="sidebar-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      <svg *ngSwitchCase="'stores'" class="sidebar-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h18v4H3V3zm0 4l2 13h14l2-13M8 10v4m4-4v4m4-4v4"/></svg>
                      <svg *ngSwitchCase="'creators'" class="sidebar-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </ng-container>
                    <span class="flex-1 text-left">{{ filter.label }}</span>
                    <span class="sidebar-option-count">{{ getFilterCount(filter.value) }}</span>
                  </button>
                </div>
              </div>

              <!-- Sort Section -->
              <div class="sidebar-section">
                <button (click)="toggleSection('sort')" class="sidebar-section-header">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4"/>
                    </svg>
                    <span>Sort By</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span *ngIf="currentSort().value !== 'createdAt' || currentSort().order !== 'desc'" class="text-[10px] font-bold text-[#111111] bg-[#FFC60B]/20 px-1.5 py-0.5 rounded">{{ currentSort().label }}</span>
                    <svg class="sidebar-chevron" [class.rotate-180]="expandedSections().has('sort')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                <div *ngIf="expandedSections().has('sort')" class="sidebar-section-body">
                  <button
                    *ngFor="let option of sortOptions"
                    (click)="selectSort(option)"
                    class="sidebar-sort-option"
                    [class.sidebar-sort-active]="currentSort().value === option.value && currentSort().order === option.order"
                  >
                    <span class="sidebar-radio">
                      <span *ngIf="currentSort().value === option.value && currentSort().order === option.order" class="sidebar-radio-dot"></span>
                    </span>
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Pricing Filter Section (dynamic from API) -->
              <div *ngIf="showPricingFilter && pricingOptions.length > 0" class="sidebar-section">
                <button (click)="toggleSection('pricing')" class="sidebar-section-header">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span>Pricing</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span *ngIf="activePricing() !== 'all'" class="text-[10px] font-bold text-[#111111] bg-[#FFC60B]/20 px-1.5 py-0.5 rounded">{{ activePricing() | titlecase }}</span>
                    <svg class="sidebar-chevron" [class.rotate-180]="expandedSections().has('pricing')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                <div *ngIf="expandedSections().has('pricing')" class="sidebar-section-body">
                  <button
                    *ngFor="let option of pricingOptions"
                    (click)="setPricing(option.value)"
                    class="sidebar-sort-option"
                    [class.sidebar-sort-active]="activePricing() === option.value"
                  >
                    <span class="sidebar-radio">
                      <span *ngIf="activePricing() === option.value" class="sidebar-radio-dot"></span>
                    </span>
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Price Range Section -->
              <div *ngIf="showPriceRange" class="sidebar-section">
                <button (click)="toggleSection('price')" class="sidebar-section-header">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Price</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span *ngIf="appliedMinPrice !== null || appliedMaxPrice !== null" class="text-[10px] font-bold text-[#111111] bg-[#68E079]/15 px-1.5 py-0.5 rounded">
                      {{ appliedMinPrice !== null ? '\u20B9' + appliedMinPrice : '' }}{{ appliedMinPrice !== null && appliedMaxPrice !== null ? ' – ' : '' }}{{ appliedMaxPrice !== null ? '\u20B9' + appliedMaxPrice : '' }}
                    </span>
                    <svg class="sidebar-chevron" [class.rotate-180]="expandedSections().has('price')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                <div *ngIf="expandedSections().has('price')" class="sidebar-section-body">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/40 text-xs pointer-events-none">\u20B9</span>
                      <input
                        type="number"
                        [(ngModel)]="minPrice"
                        placeholder="Min"
                        class="sidebar-price-input pl-7"
                      />
                    </div>
                    <span class="text-[#111111]/20 text-sm font-medium select-none">–</span>
                    <div class="flex-1 relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/40 text-xs pointer-events-none">\u20B9</span>
                      <input
                        type="number"
                        [(ngModel)]="maxPrice"
                        placeholder="Max"
                        class="sidebar-price-input pl-7"
                      />
                    </div>
                  </div>
                  <button
                    (click)="applyPriceFilter()"
                    class="sidebar-apply-btn mt-2"
                  >
                    Apply
                  </button>
                </div>
              </div>

            </div>

            <!-- Stats Panel -->
            <div *ngIf="stats()" class="mx-4 mb-4 p-3.5 bg-white border-2 border-black/10 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]">
              <div class="text-[10px] font-bold text-[#111111]/40 uppercase tracking-[0.08em] mb-3 font-dm-sans">Marketplace</div>
              <div class="grid grid-cols-3 gap-2">
                <div class="text-center">
                  <div class="text-base font-bold text-[#111111]">{{ stats()!.totalProducts }}</div>
                  <div class="text-[10px] text-[#111111]/40 font-medium mt-0.5">Products</div>
                </div>
                <div class="text-center border-x border-black/10">
                  <div class="text-base font-bold text-[#111111]">{{ stats()!.totalStores }}</div>
                  <div class="text-[10px] text-[#111111]/40 font-medium mt-0.5">Stores</div>
                </div>
                <div class="text-center">
                  <div class="text-base font-bold text-[#111111]">{{ stats()!.totalCreators }}</div>
                  <div class="text-[10px] text-[#111111]/40 font-medium mt-0.5">Creators</div>
                </div>
              </div>
            </div>
          </div>

          <!-- COLLAPSED STATE -->
          <div *ngIf="sidebarCollapsed()" class="flex flex-col items-center pt-2 pb-4 gap-1 sidebar-collapsed-content">
            <button
              *ngFor="let filter of contentFilters"
              (click)="setContentFilter(filter.value)"
              class="sidebar-collapsed-btn group relative"
              [class.sidebar-collapsed-btn-active]="activeFilter() === filter.value"
            >
              <ng-container [ngSwitch]="filter.value">
                <svg *ngSwitchCase="'all'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/></svg>
                <svg *ngSwitchCase="'products'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <svg *ngSwitchCase="'stores'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h18v4H3V3zm0 4l2 13h14l2-13M8 10v4m4-4v4m4-4v4"/></svg>
                <svg *ngSwitchCase="'creators'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </ng-container>
              <!-- Tooltip -->
              <span class="sidebar-tooltip">{{ filter.label }}</span>
            </button>

            <div class="w-6 h-px bg-black/10 my-2"></div>

            <!-- Sort icon -->
            <button (click)="toggleSidebar()" class="sidebar-collapsed-btn group relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4V4"/></svg>
              <span *ngIf="currentSort().value !== 'createdAt' || currentSort().order !== 'desc'" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#FFC60B] border border-black rounded-full"></span>
              <span class="sidebar-tooltip">Sort</span>
            </button>

            <!-- Price icon -->
            <button *ngIf="showPriceRange" (click)="toggleSidebar()" class="sidebar-collapsed-btn group relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span *ngIf="appliedMinPrice !== null || appliedMaxPrice !== null" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#68E079] rounded-full"></span>
              <span class="sidebar-tooltip">Price</span>
            </button>
          </div>
        </aside>

        <!-- ==================== MOBILE FILTER DRAWER ==================== -->
        <div
          *ngIf="showMobileFilters()"
          class="fixed inset-0 z-50 lg:hidden"
        >
          <div (click)="showMobileFilters.set(false)" class="absolute inset-0 bg-black/40 backdrop-blur-[2px] mobile-overlay-enter"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-[#F9F4EB] rounded-t-2xl max-h-[85vh] flex flex-col mobile-drawer-enter shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <!-- Handle bar -->
            <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div class="w-10 h-1 bg-black/15 rounded-full"></div>
            </div>
            <div class="flex-shrink-0 bg-[#F9F4EB] border-b-2 border-black/10 px-5 py-3.5 flex items-center justify-between">
              <span class="text-[15px] font-bold text-[#111111] font-dm-sans">Filters</span>
              <div class="flex items-center gap-3">
                <button *ngIf="hasActiveFilters()" (click)="clearAllFilters()" class="text-xs text-[#FA4B28] font-bold font-dm-sans">Reset</button>
                <button (click)="showMobileFilters.set(false)" class="w-9 h-9 flex items-center justify-center rounded-lg bg-[#111111]/5 hover:bg-[#111111]/10 active:bg-[#111111]/15 transition-colors border border-black/10">
                  <svg class="w-4 h-4 text-[#111111]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-5">
              <!-- Content Type -->
              <div>
                <span class="text-xs font-bold text-[#111111]/50 uppercase tracking-wider mb-2.5 block font-dm-sans">Browse</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let filter of contentFilters"
                    (click)="setContentFilter(filter.value)"
                    class="px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 border-2 font-dm-sans min-h-[44px] active:scale-95"
                    [class.bg-[#111111]]="activeFilter() === filter.value"
                    [class.text-white]="activeFilter() === filter.value"
                    [class.border-black]="activeFilter() === filter.value"
                    [class.shadow-[2px_2px_0px_0px_#000]]="activeFilter() === filter.value"
                    [class.bg-white]="activeFilter() !== filter.value"
                    [class.text-[#111111]/60]="activeFilter() !== filter.value"
                    [class.border-black/15]="activeFilter() !== filter.value"
                    [class.hover:border-black/30]="activeFilter() !== filter.value"
                    [class.hover:bg-white]="activeFilter() !== filter.value"
                  >
                    {{ filter.label }}
                  </button>
                </div>
              </div>
              <!-- Sort -->
              <div>
                <span class="text-xs font-bold text-[#111111]/50 uppercase tracking-wider mb-2.5 block font-dm-sans">Sort By</span>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    *ngFor="let option of sortOptions"
                    (click)="selectSort(option)"
                    class="px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 border-2 min-h-[44px] active:scale-95"
                    [class.bg-[#111111]]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.text-white]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.border-black]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.shadow-[2px_2px_0px_0px_#000]]="currentSort().value === option.value && currentSort().order === option.order"
                    [class.bg-white]="!(currentSort().value === option.value && currentSort().order === option.order)"
                    [class.text-[#111111]/60]="!(currentSort().value === option.value && currentSort().order === option.order)"
                    [class.border-black/15]="!(currentSort().value === option.value && currentSort().order === option.order)"
                    [class.hover:bg-white]="!(currentSort().value === option.value && currentSort().order === option.order)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <!-- Pricing (mobile) -->
              <div *ngIf="showPricingFilter && pricingOptions.length > 0">
                <span class="text-xs font-bold text-[#111111]/50 uppercase tracking-wider mb-2.5 block font-dm-sans">Pricing</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let option of pricingOptions"
                    (click)="setPricing(option.value)"
                    class="px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 border-2 font-dm-sans min-h-[44px] active:scale-95"
                    [class.bg-[#111111]]="activePricing() === option.value"
                    [class.text-white]="activePricing() === option.value"
                    [class.border-black]="activePricing() === option.value"
                    [class.shadow-[2px_2px_0px_0px_#000]]="activePricing() === option.value"
                    [class.bg-white]="activePricing() !== option.value"
                    [class.text-[#111111]/60]="activePricing() !== option.value"
                    [class.border-black/15]="activePricing() !== option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
              <!-- Price -->
              <div *ngIf="showPriceRange">>
                <span class="text-xs font-bold text-[#111111]/50 uppercase tracking-wider mb-2.5 block font-dm-sans">Price Range</span>
                <div class="flex items-center gap-2">
                  <div class="flex-1 relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/40 text-sm">\u20B9</span>
                    <input type="number" [(ngModel)]="minPrice" placeholder="Min" class="w-full pl-7 pr-3 py-3 bg-white border-2 border-black/15 rounded-lg text-sm text-[#111111] placeholder-[#111111]/35 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all min-h-[48px]" />
                  </div>
                  <span class="text-[#111111]/20 text-sm select-none">–</span>
                  <div class="flex-1 relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/40 text-sm">\u20B9</span>
                    <input type="number" [(ngModel)]="maxPrice" placeholder="Max" class="w-full pl-7 pr-3 py-3 bg-white border-2 border-black/15 rounded-lg text-sm text-[#111111] placeholder-[#111111]/35 focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#111111] transition-all min-h-[48px]" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Sticky footer -->
            <div class="flex-shrink-0 border-t border-black/10 px-5 pt-3 pb-4 bg-[#F9F4EB]">
              <button
                (click)="applyMobileFilters()"
                class="w-full py-3.5 bg-[#FFC60B] border-2 border-black rounded-lg text-[15px] font-bold text-[#111111] hover:bg-[#ffdb4d] active:scale-[0.98] transition-all duration-200 shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-dm-sans min-h-[52px]"
              >
                Show Results
              </button>
              <div class="h-safe"></div>
            </div>
          </div>
        </div>

        <!-- ==================== MASONRY GRID ==================== -->
        <main class="flex-1 min-w-0">
          <!-- Mobile content type pills -->
          <div class="lg:hidden overflow-x-auto scrollbar-hide border-b border-black/10 bg-[#F9F4EB]">
            <div class="flex gap-2 px-3 py-2.5">
              <button
                *ngFor="let filter of contentFilters"
                (click)="setContentFilter(filter.value)"
                class="px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-200 border-2 font-dm-sans min-h-[36px] active:scale-95"
                [class.bg-[#111111]]="activeFilter() === filter.value"
                [class.text-white]="activeFilter() === filter.value"
                [class.border-black]="activeFilter() === filter.value"
                [class.bg-white]="activeFilter() !== filter.value"
                [class.text-[#111111]/50]="activeFilter() !== filter.value"
                [class.border-black/15]="activeFilter() !== filter.value"
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
                <div class="masonry-item mb-3 sm:mb-4" [class.feed-item-enter]="shouldAnimate(i)" [style.animation-delay.ms]="shouldAnimate(i) ? getAnimationDelay(i) : null">

                  <!-- PRODUCT CARD -->
                  <div
                    *ngIf="item.type === 'product'"
                    class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
                    (click)="navigateToProduct(asProduct(item.data).id)"
                  >
                    <div class="relative overflow-hidden bg-[#F9F4EB]" [style.aspect-ratio]="getProductAspectRatio(asProduct(item.data))">
                      <img
                        *ngIf="asProduct(item.data).coverImageUrl"
                        [src]="asProduct(item.data).coverImageUrl"
                        [alt]="asProduct(item.data).title"
                        loading="lazy"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div *ngIf="!asProduct(item.data).coverImageUrl" class="w-full h-full flex items-center justify-center aspect-square">
                        <svg class="w-10 h-10 text-[#111111]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <div
                        *ngIf="asProduct(item.data).compareAtPrice && asProduct(item.data).compareAtPrice! > asProduct(item.data).price"
                        class="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FA4B28] rounded-full text-[10px] font-bold text-white"
                      >
                        -{{ exploreService.getDiscountPercentage(asProduct(item.data).price, asProduct(item.data).compareAtPrice!) }}%
                      </div>
                    </div>
                    <!-- Mobile Product Info -->
                    <div class="md:hidden px-2.5 pt-2 pb-2.5">
                      <h3 class="font-semibold text-[#111111] text-[13px] leading-snug line-clamp-2 mb-1">
                        {{ asProduct(item.data).title }}
                      </h3>
                      <div class="flex items-center gap-1.5 mb-1.5">
                        <div class="w-4 h-4 rounded-full bg-[#F9F4EB] border border-black/10 overflow-hidden flex-shrink-0">
                          <img *ngIf="asProduct(item.data).creator.avatarUrl" [src]="asProduct(item.data).creator.avatarUrl" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-[11px] text-[#111111]/50 font-medium truncate">
                          {{ asProduct(item.data).creator.displayName || asProduct(item.data).creator.username }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <span class="font-bold text-[#111111] text-[13px] whitespace-nowrap">
                            {{ exploreService.formatPrice(asProduct(item.data).price, asProduct(item.data).currency) }}
                          </span>
                          <span
                            *ngIf="asProduct(item.data).compareAtPrice && asProduct(item.data).compareAtPrice! > asProduct(item.data).price"
                            class="text-[10px] text-[#111111]/35 line-through whitespace-nowrap"
                          >
                            {{ exploreService.formatPrice(asProduct(item.data).compareAtPrice!, asProduct(item.data).currency) }}
                          </span>
                        </div>
                        <button *ngIf="asProduct(item.data).price > 0"
                          (click)="isInCart(asProduct(item.data).id) ? removeFromCart(asProduct(item.data).id, $event) : addToCart(asProduct(item.data), $event)"
                          class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-all active:scale-95 flex-shrink-0"
                          [class.bg-[#68E079]/15]="isInCart(asProduct(item.data).id)"
                          [class.text-[#111111]]="isInCart(asProduct(item.data).id)"
                          [class.bg-[#111111]/5]="!isInCart(asProduct(item.data).id)"
                          [class.text-[#111111]/70]="!isInCart(asProduct(item.data).id)"
                        >
                          <svg *ngIf="!isInCart(asProduct(item.data).id)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v12m6-6H6"/>
                          </svg>
                          <svg *ngIf="isInCart(asProduct(item.data).id)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                          {{ isInCart(asProduct(item.data).id) ? 'Added' : 'Cart' }}
                        </button>
                      </div>
                    </div>
                    <!-- Hover Detail Panel (Desktop) -->
                    <div class="explore-hover-panel absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none group-hover:pointer-events-auto hidden md:block">
                      <h3 class="font-bold text-white text-xs sm:text-sm line-clamp-2 mb-1 leading-tight">
                        {{ asProduct(item.data).title }}
                      </h3>
                      <div class="flex items-center gap-1.5 mb-2">
                        <div class="w-4 h-4 rounded-full bg-white/20 border border-white/30 overflow-hidden flex-shrink-0">
                          <img *ngIf="asProduct(item.data).creator.avatarUrl" [src]="asProduct(item.data).creator.avatarUrl" class="w-full h-full object-cover" />
                        </div>
                        <span class="text-[10px] sm:text-xs text-white/70 font-medium truncate">
                          {{ asProduct(item.data).creator.displayName || asProduct(item.data).creator.username }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-white text-xs sm:text-sm">
                            {{ exploreService.formatPrice(asProduct(item.data).price, asProduct(item.data).currency) }}
                          </span>
                          <span
                            *ngIf="asProduct(item.data).compareAtPrice && asProduct(item.data).compareAtPrice! > asProduct(item.data).price"
                            class="text-[10px] text-white/50 line-through"
                          >
                            {{ exploreService.formatPrice(asProduct(item.data).compareAtPrice!, asProduct(item.data).currency) }}
                          </span>
                        </div>
                        <div *ngIf="asProduct(item.data).price > 0" class="flex gap-1.5">
                          <button
                            (click)="isInCart(asProduct(item.data).id) ? removeFromCart(asProduct(item.data).id, $event) : addToCart(asProduct(item.data), $event)"
                            class="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                            [class.bg-[#68E079]]="isInCart(asProduct(item.data).id)"
                            [class.text-[#111111]]="isInCart(asProduct(item.data).id)"
                            [class.bg-white/20]="!isInCart(asProduct(item.data).id)"
                            [class.text-white]="!isInCart(asProduct(item.data).id)"
                            [class.hover:bg-white/30]="!isInCart(asProduct(item.data).id)"
                          >
                            {{ isInCart(asProduct(item.data).id) ? '&#10003; Added' : '+ Cart' }}
                          </button>
                          <button
                            (click)="buyNow(asProduct(item.data), $event)"
                            class="px-2.5 py-1.5 bg-white text-[#111111] rounded-lg text-[10px] font-bold hover:bg-white/90 transition-all"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- STORE CARD -->
                  <div
                    *ngIf="item.type === 'store'"
                    class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    (click)="navigateToStore(asStore(item.data).slug)"
                  >
                    <div class="bg-gradient-to-br from-[#2B57D6] to-[#7C3AED] relative" [style.aspect-ratio]="getStoreBannerAspectRatio(asStore(item.data))" style="min-height: 80px; max-height: 160px;">
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
                    class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer p-4 text-center"
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

    /* ========= SIDEBAR ========= */
    .sidebar-container {
      transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
      will-change: width;
    }
    .sidebar-expanded { width: 260px; }
    .sidebar-collapsed { width: 56px; }

    .sidebar-content {
      animation: sidebarFadeIn 200ms ease-out;
    }
    @keyframes sidebarFadeIn {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .sidebar-label {
      animation: sidebarFadeIn 180ms ease-out;
    }

    .sidebar-toggle:hover {
      background: rgba(0,0,0,0.04);
    }

    /* Section header */
    .sidebar-section {
      margin-bottom: 2px;
    }
    .sidebar-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 9px 10px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #111111;
      font-family: 'DM Sans', sans-serif;
      transition: background 150ms ease, color 150ms ease;
    }
    .sidebar-section-header:hover {
      background: rgba(17,17,17,0.04);
      color: #111111;
    }
    .sidebar-chevron {
      width: 14px;
      height: 14px;
      color: rgba(17,17,17,0.35);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }
    .sidebar-section-body {
      padding: 4px 0 8px;
      animation: sectionExpand 200ms ease-out;
    }
    @keyframes sectionExpand {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Content type options */
    .sidebar-option {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(17,17,17,0.55);
      transition: all 150ms ease;
    }
    .sidebar-option:hover {
      background: rgba(17,17,17,0.04);
      color: #111111;
    }
    .sidebar-option-active {
      background: rgba(255,198,11,0.15) !important;
      color: #111111 !important;
      font-weight: 600;
    }
    .sidebar-option-active .sidebar-option-icon {
      color: #111111 !important;
    }
    .sidebar-option-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: rgba(17,17,17,0.35);
      transition: color 150ms ease;
    }
    .sidebar-option:hover .sidebar-option-icon {
      color: rgba(17,17,17,0.6);
    }
    .sidebar-option-count {
      margin-left: auto;
      font-size: 11px;
      font-weight: 600;
      color: rgba(17,17,17,0.2);
      background: transparent;
      padding: 1px 6px;
      border-radius: 6px;
      transition: all 150ms ease;
    }
    .sidebar-option:hover .sidebar-option-count {
      color: rgba(17,17,17,0.4);
      background: white;
    }
    .sidebar-option-active .sidebar-option-count {
      color: rgba(17,17,17,0.4) !important;
      background: transparent !important;
    }

    /* Sort options */
    .sidebar-sort-option {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(17,17,17,0.55);
      transition: all 150ms ease;
    }
    .sidebar-sort-option:hover {
      background: rgba(17,17,17,0.04);
      color: #111111;
    }
    .sidebar-sort-active {
      color: #111111 !important;
      font-weight: 600;
    }
    .sidebar-radio {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid rgba(17,17,17,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color 200ms ease;
    }
    .sidebar-sort-active .sidebar-radio {
      border-color: #111111;
    }
    .sidebar-radio-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #111111;
      animation: radioDotIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes radioDotIn {
      from { transform: scale(0); }
      to   { transform: scale(1); }
    }

    /* Price inputs */
    .sidebar-price-input {
      width: 100%;
      padding: 7px 10px;
      background: white;
      border: 2px solid rgba(17,17,17,0.15);
      border-radius: 8px;
      font-size: 13px;
      color: #111111;
      transition: all 200ms ease;
    }
    .sidebar-price-input::placeholder {
      color: rgba(17,17,17,0.35);
    }
    .sidebar-price-input:focus {
      outline: none;
      border-color: #111111;
      background: white;
      box-shadow: 0 0 0 3px rgba(17,17,17,0.06);
    }

    /* Apply button */
    .sidebar-apply-btn {
      width: 100%;
      padding: 7px 0;
      background: #FFC60B;
      color: #111111;
      border: 2px solid #111111;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      transition: all 200ms ease;
      box-shadow: 2px 2px 0px 0px #111111;
    }
    .sidebar-apply-btn:hover {
      background: #ffdb4d;
      box-shadow: none;
      transform: translate(2px, 2px);
    }
    .sidebar-apply-btn:active {
      transform: translate(2px, 2px) scale(0.98);
    }

    /* Collapsed items */
    .sidebar-collapsed-content {
      animation: sidebarFadeIn 200ms ease-out;
    }
    .sidebar-collapsed-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: rgba(17,17,17,0.4);
      transition: all 200ms ease;
    }
    .sidebar-collapsed-btn:hover {
      background: rgba(17,17,17,0.04);
      color: #111111;
    }
    .sidebar-collapsed-btn-active {
      background: rgba(255,198,11,0.15) !important;
      color: #111111 !important;
    }
    .sidebar-tooltip {
      position: absolute;
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%) scale(0.9);
      background: #111111;
      color: white;
      font-size: 11px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: all 150ms ease;
      z-index: 50;
    }
    .sidebar-tooltip::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 4px solid transparent;
      border-right-color: #111111;
    }
    .sidebar-collapsed-btn:hover .sidebar-tooltip {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }

    /* ========= MOBILE DRAWER ========= */
    .mobile-drawer-enter {
      animation: mobileDrawerSlide 300ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    @keyframes mobileDrawerSlide {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .mobile-overlay-enter {
      animation: overlayFadeIn 200ms ease-out;
    }
    @keyframes overlayFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ========= MASONRY GRID ========= */
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

    /* Touch improvements */
    .masonry-item > div {
      -webkit-tap-highlight-color: transparent;
    }

    /* Safe area bottom */
    @supports (padding-bottom: env(safe-area-inset-bottom)) {
      .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .feed-item-enter { animation: none !important; }
      .mobile-drawer-enter { animation: none !important; }
      .mobile-overlay-enter { animation: none !important; }
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
  /** Default aspect ratios used when product has no pre-computed dimensions */
  private fallbackAspectRatios = ['3/4', '4/5', '1/1', '3/4', '4/3', '3/4', '1/1', '4/5'];
  private fallbackIndex = 0;
  /** Cache of aspect ratios keyed by item id to prevent side-effectful recalculation on each CD cycle */
  private aspectRatioCache = new Map<string, string>();
  /** Index from which newly loaded items start (only they get the entry animation) */
  newItemsStartIndex = 0;

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
  expandedSections = signal<Set<string>>(new Set(['sort', 'type', 'price', 'pricing']));
  activePricing = signal<string>('all');

  // Dynamic filter sections from API
  filterSections = signal<FilterSection[]>([]);

  // Derived from filterSections — kept in sync via loadFilters()
  contentFilters: { label: string; value: ContentFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Products', value: 'products' },
    { label: 'Stores', value: 'stores' },
    { label: 'Creators', value: 'creators' },
  ];

  sortOptions: SortOption[] = [
    { label: 'Newest', value: 'createdAt', order: 'desc' },
    { label: 'Oldest', value: 'createdAt', order: 'asc' },
    { label: 'Name A-Z', value: 'title', order: 'asc' },
    { label: 'Name Z-A', value: 'title', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
  ];

  pricingOptions: FilterOption[] = [];
  showPriceRange = true;
  showPricingFilter = true;

  // sidebar state for desktop collapse
  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  // Lifecycle
  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const type = params['type'] as ContentFilter | undefined;
      if (type && ['all', 'products', 'stores', 'creators'].includes(type)) {
        this.activeFilter.set(type);
      }
      await Promise.all([this.loadFilters(), this.loadStats(), this.loadFeed(true)]);
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
        { rootMargin: '200px' }
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

  async loadFilters() {
    try {
      const filtersResponse = await this.exploreService.getFilters(this.activeFilter(), this.activePricing());
      this.filterSections.set(filtersResponse.sections);

      // Derive sortOptions from the 'sort' section
      const sortSection = filtersResponse.sections.find(s => s.key === 'sort');
      if (sortSection?.options) {
        this.sortOptions = sortSection.options.map(opt => {
          const [value, order] = opt.value.split(':');
          return { label: opt.label, value, order: (order || 'desc') as 'asc' | 'desc' };
        });
        // If current sort is no longer in the new options, reset to default
        const currentSortStr = `${this.currentSort().value}:${this.currentSort().order}`;
        const validValues = sortSection.options.map(o => o.value);
        if (!validValues.includes(currentSortStr)) {
          const defaultVal = sortSection.defaultValue || 'createdAt:desc';
          const [dv, dorder] = defaultVal.split(':');
          const defaultOpt = sortSection.options.find(o => o.value === defaultVal);
          this.currentSort.set({ label: defaultOpt?.label || 'Newest', value: dv, order: (dorder || 'desc') as 'asc' | 'desc' });
        }
      }

      // Derive pricing options
      const pricingSection = filtersResponse.sections.find(s => s.key === 'pricing');
      this.showPricingFilter = !!pricingSection;
      this.pricingOptions = pricingSection?.options || [];
      // If the current pricing value is no longer valid, reset
      if (pricingSection?.options) {
        const validPricing = pricingSection.options.map(o => o.value);
        if (!validPricing.includes(this.activePricing())) {
          this.activePricing.set(pricingSection.defaultValue || 'all');
        }
      } else {
        this.activePricing.set('all');
      }

      // Derive whether price range is available
      const priceRangeSection = filtersResponse.sections.find(s => s.key === 'priceRange');
      this.showPriceRange = !!priceRangeSection;

      // Derive content type filters
      const typeSection = filtersResponse.sections.find(s => s.key === 'type');
      if (typeSection?.options) {
        this.contentFilters = typeSection.options.map(opt => ({
          label: opt.label,
          value: opt.value as ContentFilter,
        }));
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
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
      if (this.activePricing() !== 'all') params.pricing = this.activePricing() as 'free' | 'premium';
      if (!reset && this.nextCursor()) params.cursor = this.nextCursor()!;

      const result = await this.exploreService.getFeed(params);

      if (reset) {
        this.aspectRatioCache.clear();
        this.fallbackIndex = 0;
        this.newItemsStartIndex = 0;
        this.feedItems.set(result.items);
      } else {
        this.newItemsStartIndex = this.feedItems().length;
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
      // Reload context-aware filters from API, then reload feed
      this.loadFilters().then(() => this.loadFeed(true));
    }
  }

  setPricing(value: string) {
    if (this.activePricing() !== value) {
      this.activePricing.set(value);
      // When pricing changes (e.g. selecting "Free"), reload filters to
      // remove/add price-related sort options and price range dynamically.
      // Also clear price-range if switching to free (all items are ₹0).
      if (value === 'free') {
        this.minPrice = null;
        this.maxPrice = null;
        this.appliedMinPrice = null;
        this.appliedMaxPrice = null;
      }
      this.loadFilters().then(() => this.loadFeed(true));
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
      this.activePricing() !== 'all' ||
      this.currentSort().value !== 'createdAt' ||
      this.currentSort().order !== 'desc';
  }

  clearAllFilters() {
    this.activeFilter.set('all');
    this.minPrice = null;
    this.maxPrice = null;
    this.appliedMinPrice = null;
    this.appliedMaxPrice = null;
    this.activePricing.set('all');
    this.currentSort.set({ label: 'Newest', value: 'createdAt', order: 'desc' });
    this.loadFilters().then(() => this.loadFeed(true));
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

  getProductAspectRatio(product: ExploreProduct): string {
    const cached = this.aspectRatioCache.get(product.id);
    if (cached) return cached;
    let ratio: string;
    if (product.coverImageWidth && product.coverImageHeight && product.coverImageWidth > 0 && product.coverImageHeight > 0) {
      ratio = `${product.coverImageWidth} / ${product.coverImageHeight}`;
    } else {
      // Compute once and cache — never mutate fallbackIndex again after this point
      ratio = this.fallbackAspectRatios[this.fallbackIndex++ % this.fallbackAspectRatios.length];
    }
    this.aspectRatioCache.set(product.id, ratio);
    return ratio;
  }

  getStoreBannerAspectRatio(store: ExploreStore): string {
    if (store.bannerWidth && store.bannerHeight && store.bannerWidth > 0 && store.bannerHeight > 0) {
      return `${store.bannerWidth} / ${store.bannerHeight}`;
    }
    return '16 / 5';
  }

  getAnimationDelay(index: number): number {
    if (index >= this.newItemsStartIndex) {
      const relativeIndex = index - this.newItemsStartIndex;
      return (relativeIndex % 8) * 40;
    }
    return 0;
  }

  shouldAnimate(index: number): boolean {
    return index >= this.newItemsStartIndex;
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
    if (this.activePricing() !== 'all') {
      const pLabel = this.activePricing().charAt(0).toUpperCase() + this.activePricing().slice(1);
      chips.push({
        label: pLabel,
        color: 'yellow',
        remove: () => this.setPricing('all'),
      });
    }
    return chips;
  }
}
