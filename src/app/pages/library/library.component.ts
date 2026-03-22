import { Component, OnInit, OnDestroy, signal, computed, inject, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { License } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';
import { ToasterService } from '../../core/services/toaster.service';
import { PurchaseDetailsModalComponent } from '../../shared/components/purchase-details-modal/purchase-details-modal.component';
import { PaginationMeta } from '../../core/services/pagination.types';
import { DataGridComponent, GridColumn, GridDataRequest, GridPagination } from '../../shared/components/data-grid/data-grid.component';
import { ThemeService } from '../../core/services/theme.service';

interface LibraryGridRow {
  id: string;
  productTitle: string;
  storeName: string;
  licenseKey: string;
  downloadCount: number;
  maxDownloads: number;
  downloadsText: string;
  status: string;
  createdAt: Date | string;
}

type ViewMode = 'gallery' | 'list';
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'downloads';
type StatusFilter = '' | 'ACTIVE' | 'EXHAUSTED';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PurchaseDetailsModalComponent, DataGridComponent],
  template: `
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-theme-secondary border-b-2 lib-separator-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-4 md:pt-4 md:pb-6 lg:pt-6 lg:pb-8">
            <div class="text-left">
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-theme-fg mb-0 md:mb-1 leading-tight">
                My Library
              </h1>

              <!-- Stats -->
              <div class="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto md:mx-0">
                <!-- Products -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#68E079]">
                  @if (statsReady()) {
                    <div class="text-lg md:text-2xl font-bold text-black leading-none">{{ overallStats().totalProducts }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-black/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-black/70 font-semibold mt-1">Products</div>
                </div>
                <!-- Active -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#FFC60B]">
                  @if (statsReady()) {
                    <div class="text-lg md:text-2xl font-bold text-black leading-none">{{ overallStats().activeCount }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-black/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-black/70 font-semibold mt-1">Active</div>
                </div>
                <!-- Downloads -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#ef4444]">
                  @if (statsReady()) {
                    <div class="text-lg md:text-2xl font-bold text-white leading-none">{{ overallStats().totalDownloads }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-white/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-white/80 font-semibold mt-1">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Toolbar: Filter button + Search + View Toggle -->
      <section class="sticky top-0 z-20 bg-theme-surface border-b-2 lib-separator-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <!-- Row 1: Filter Button + Search + View Toggle -->
          <div class="flex items-center gap-2">
            <!-- Filter Button -->
            <button
              (click)="toggleFilters()"
              class="flex items-center gap-1.5 h-9 px-3 rounded-lg border-2 transition-all duration-200 flex-shrink-0 font-dm-sans active:scale-95"
              [class.lib-filter-btn-active]="showFilters()"
              [class.lib-filter-btn-inactive]="!showFilters()"
              [attr.aria-label]="showFilters() ? 'Hide filters' : 'Show filters'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="text-xs font-semibold hidden sm:inline">Filters</span>
              @if (hasActiveFilters()) {
                <span class="w-1.5 h-1.5 rounded-full bg-theme-danger flex-shrink-0"></span>
              }
            </button>

            <!-- Search input -->
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                [ngModel]="searchInput()"
                (ngModelChange)="onSearchInput($event)"
                (keydown.enter)="loadLicenses()"
                placeholder="Search products, stores, or license keys..."
                class="w-full pl-10 pr-10 h-9 bg-theme-surface lib-card-border border-2 rounded-lg text-theme-fg placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-[#FFC60B] text-sm font-medium transition-all"
              />
              @if (searchInput()) {
                <button
                  (click)="clearSearch()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-theme-muted hover:text-theme-fg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              }
            </div>

            <!-- View Toggle -->
            <div class="flex items-center border-2 lib-card-border rounded-lg overflow-hidden flex-shrink-0">
              <button
                (click)="setViewMode('gallery')"
                [class]="viewMode() === 'gallery' ? 'bg-theme-accent text-black' : 'bg-theme-surface text-theme-muted hover:text-theme-fg'"
                class="h-9 w-9 flex items-center justify-center transition-colors"
                title="Gallery view"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                (click)="setViewMode('list')"
                [class]="viewMode() === 'list' ? 'bg-theme-accent text-black' : 'bg-theme-surface text-theme-muted hover:text-theme-fg'"
                class="h-9 w-9 flex items-center justify-center transition-colors border-l-2 lib-card-border"
                title="List view"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Desktop Filter Panel (lg+ only) -->
          @if (showFilters()) {
            <div class="hidden lg:block mt-3 pt-3 border-t-2 lib-separator-border filter-panel-enter">
              <div class="grid grid-cols-3 gap-6">
                <!-- Sort By -->
                <div>
                  <span class="text-xs font-bold text-theme-muted uppercase tracking-[0.08em] mb-2.5 block font-dm-sans">Sort By</span>
                  <div class="flex flex-wrap gap-2">
                    @for (option of sortOptions; track option.value) {
                      <button
                        (click)="setSortBy(option.value)"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border-2 font-dm-sans min-h-[36px] active:scale-95"
                        [class.lib-filter-btn-desktop-active]="sortBy() === option.value"
                        [class.lib-filter-btn-desktop-inactive]="sortBy() !== option.value"
                      >
                        {{ option.label }}
                      </button>
                    }
                  </div>
                </div>
                <!-- Status -->
                <div>
                  <span class="text-xs font-bold text-theme-muted uppercase tracking-[0.08em] mb-2.5 block font-dm-sans">Status</span>
                  <div class="flex flex-wrap gap-2">
                    @for (option of statusOptions; track option.value) {
                      <button
                        (click)="setStatusFilter(option.value)"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border-2 font-dm-sans min-h-[36px] active:scale-95"
                        [class.lib-filter-btn-desktop-active]="statusFilter() === option.value"
                        [class.lib-filter-btn-desktop-inactive]="statusFilter() !== option.value"
                      >
                        {{ option.label }}
                      </button>
                    }
                  </div>
                </div>
                <!-- Date Range -->
                <div>
                  <span class="text-xs font-bold text-theme-muted uppercase tracking-[0.08em] mb-2.5 block font-dm-sans">Date Range</span>
                  <div class="flex items-center gap-2">
                    <input
                      type="date"
                      [ngModel]="dateFrom()"
                      (ngModelChange)="setDateFrom($event)"
                      class="flex-1 px-3 py-1.5 lib-date-input rounded-lg text-xs font-medium min-h-[36px] text-theme-fg bg-theme-surface border-2 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] cursor-pointer"
                    />
                    <span class="text-theme-muted text-xs font-medium select-none">–</span>
                    <input
                      type="date"
                      [ngModel]="dateTo()"
                      (ngModelChange)="setDateTo($event)"
                      class="flex-1 px-3 py-1.5 lib-date-input rounded-lg text-xs font-medium min-h-[36px] text-theme-fg bg-theme-surface border-2 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Mobile Filter Drawer (< lg only) -->
      @if (showFilters()) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <div (click)="showFilters.set(false)" class="absolute inset-0 bg-black/40 backdrop-blur-[2px] lib-overlay-enter"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-theme-secondary rounded-t-2xl max-h-[85vh] flex flex-col lib-drawer-enter shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <!-- Handle bar -->
            <div class="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div class="w-10 h-1 bg-black/15 rounded-full"></div>
            </div>
            <!-- Header -->
            <div class="flex-shrink-0 bg-theme-secondary lib-separator-border border-b-2 px-5 py-3.5 flex items-center justify-between">
              <span class="text-[15px] font-bold text-theme-fg font-dm-sans">Filters</span>
              <div class="flex items-center gap-3">
                @if (hasActiveFilters()) {
                  <button (click)="clearFilters()" class="text-xs text-theme-danger font-bold font-dm-sans">Reset</button>
                }
                <button (click)="showFilters.set(false)" class="w-9 h-9 flex items-center justify-center rounded-lg bg-fg-faint hover:bg-theme-border/20 active:bg-theme-border/30 transition-colors border lib-separator-border">
                  <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Content -->
            <div class="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-5">
              <!-- Sort By -->
              <div>
                <span class="text-xs font-bold text-theme-muted uppercase tracking-wider mb-2.5 block font-dm-sans">Sort By</span>
                <div class="grid grid-cols-2 gap-2">
                  @for (option of sortOptions; track option.value) {
                    <button
                      (click)="setSortBy(option.value)"
                      class="px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 border-2 min-h-[44px] active:scale-95"
                      [class.mobile-filter-btn-active]="sortBy() === option.value"
                      [class.mobile-filter-btn-inactive]="sortBy() !== option.value"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Status -->
              <div>
                <span class="text-xs font-bold text-theme-muted uppercase tracking-wider mb-2.5 block font-dm-sans">Status</span>
                <div class="flex flex-wrap gap-2">
                  @for (option of statusOptions; track option.value) {
                    <button
                      (click)="setStatusFilter(option.value)"
                      class="px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 border-2 font-dm-sans min-h-[44px] active:scale-95"
                      [class.mobile-filter-btn-active]="statusFilter() === option.value"
                      [class.mobile-filter-btn-inactive]="statusFilter() !== option.value"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Date Range -->
              <div>
                <span class="text-xs font-bold text-theme-muted uppercase tracking-wider mb-2.5 block font-dm-sans">Date Range</span>
                <div class="flex items-center gap-2">
                  <input
                    type="date"
                    [ngModel]="dateFrom()"
                    (ngModelChange)="setDateFrom($event)"
                    class="flex-1 px-3 py-3 lib-date-input rounded-lg text-sm text-theme-fg bg-theme-surface border-2 focus:outline-none min-h-[48px] cursor-pointer"
                  />
                  <span class="text-theme-muted text-sm select-none">–</span>
                  <input
                    type="date"
                    [ngModel]="dateTo()"
                    (ngModelChange)="setDateTo($event)"
                    class="flex-1 px-3 py-3 lib-date-input rounded-lg text-sm text-theme-fg bg-theme-surface border-2 focus:outline-none min-h-[48px] cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="flex-shrink-0 border-t lib-separator-border px-5 pt-3 pb-4 bg-theme-secondary">
              <button
                (click)="showFilters.set(false)"
                class="w-full py-3.5 bg-theme-accent border-2 border-theme-border rounded-lg text-[15px] font-bold text-black hover:bg-[#ffdb4d] active:scale-[0.98] transition-all duration-200 shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] font-dm-sans min-h-[52px]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Main Content -->
      <section class="py-4 md:py-6 lg:py-8 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <!-- Results count + Clear filters -->
          @if (!loading()) {
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs text-theme-muted font-medium">
                {{ paginationMeta().total }} result{{ paginationMeta().total !== 1 ? 's' : '' }}
              </span>
              @if (hasActiveFilters()) {
                <button
                  (click)="clearFilters()"
                  class="text-xs font-bold text-theme-danger hover:text-[#d63a1a] transition-colors font-dm-sans"
                >
                  Clear all filters
                </button>
              }
            </div>
          }
          @if (loading()) {
            <!-- Loading Skeleton -->
            @if (viewMode() === 'gallery') {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                @for (i of skeletonItems; track i) {
                  <div class="bg-theme-surface border-2 lib-card-border rounded-xl overflow-hidden">
                    <div class="p-3 md:p-4 flex gap-4">
                      <div class="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-theme-secondary border-2 lib-card-border rounded-lg animate-pulse"></div>
                      <div class="flex-1 min-w-0">
                        <div class="h-4 md:h-5 bg-theme-fg/10 rounded animate-pulse w-3/4 mb-2"></div>
                        <div class="h-3 bg-theme-fg/5 rounded animate-pulse w-1/2 mb-3"></div>
                        <div class="h-6 w-32 bg-theme-secondary rounded border lib-card-border animate-pulse"></div>
                      </div>
                    </div>
                    <div class="px-3 md:px-4 pb-3 md:pb-4 border-t lib-separator-border pt-3 md:pt-4">
                      <div class="flex items-center justify-between mb-3">
                        <div class="h-3 w-20 bg-theme-fg/10 rounded animate-pulse"></div>
                        <div class="h-3 w-16 bg-theme-success/30 rounded animate-pulse"></div>
                      </div>
                      <div class="h-10 bg-theme-secondary border lib-card-border rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="space-y-2">
                @for (i of skeletonItems; track i) {
                  <div class="bg-theme-surface border-2 lib-card-border rounded-lg p-3 md:p-4 flex items-center gap-4 animate-pulse">
                    <div class="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-theme-secondary border-2 lib-card-border rounded-lg"></div>
                    <div class="flex-1 min-w-0">
                      <div class="h-4 bg-theme-fg/10 rounded w-1/3 mb-2"></div>
                      <div class="h-3 bg-theme-fg/5 rounded w-1/4"></div>
                    </div>
                    <div class="hidden sm:block w-32 h-4 bg-theme-fg/10 rounded"></div>
                    <div class="hidden md:block w-20 h-4 bg-theme-success/30 rounded"></div>
                    <div class="w-8 h-8 bg-theme-secondary rounded-lg"></div>
                  </div>
                }
              </div>
            }
          } @else if (licenses().length === 0) {
            <!-- Empty State -->
            <div class="text-center py-12 md:py-16">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-theme-secondary border-2 lib-card-border rounded-2xl flex items-center justify-center transform rotate-3">
                <svg class="w-10 h-10 md:w-12 md:h-12 text-theme-fg/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <h2 class="font-dm-sans text-xl md:text-2xl font-bold text-theme-fg mb-2">
                {{ hasActiveFilters() ? 'No matches found' : 'Your library is empty' }}
              </h2>
              <p class="text-sm md:text-base text-theme-muted max-w-md mx-auto mb-8 font-medium">
                {{ hasActiveFilters() ? 'Try adjusting your filters or search terms.' : 'Start your collection by exploring amazing products from our creators.' }}
              </p>
              @if (hasActiveFilters()) {
                <button (click)="clearFilters()" class="inline-flex items-center px-6 py-3 bg-theme-secondary border-2 border-theme-border rounded-lg font-bold text-theme-fg hover:bg-theme-surface transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                  Clear All Filters
                </button>
              } @else {
                <a routerLink="/explore" class="inline-flex items-center px-6 py-3 bg-theme-accent border-2 border-theme-border rounded-lg font-bold text-black hover:bg-[#ffdb4d] transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                  Explore Products
                </a>
              }
            </div>
          } @else {
            <!-- Gallery View -->
            @if (viewMode() === 'gallery') {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                @for (license of licenses(); track license.id) {
                  <div
                    (click)="openPurchaseDetails(license)"
                    class="group bg-theme-surface border-2 lib-card-border rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div class="p-3 md:p-4 flex gap-4">
                      <div class="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-theme-secondary border-2 lib-card-border rounded-lg overflow-hidden">
                        @if (license.product.coverImageUrl) {
                          <img [src]="license.product.coverImageUrl" [alt]="license.product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
                        } @else {
                          <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-theme-fg/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-theme-fg text-sm md:text-base leading-tight mb-1 line-clamp-2">{{ license.product.title }}</h3>
                        @if (license.product.store) {
                          <div class="flex items-center gap-1.5 mb-2">
                            <span class="text-xs text-theme-muted font-medium truncate">by {{ license.product.store.name }}</span>
                          </div>
                        }
                        <div class="inline-flex items-center px-2 py-1 bg-theme-secondary rounded border lib-card-border max-w-full">
                          <svg class="w-3 h-3 text-theme-muted mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                          </svg>
                          <code class="text-[10px] md:text-xs font-mono text-theme-fg truncate select-all">{{ license.licenseKey }}</code>
                        </div>
                      </div>
                    </div>
                    <div class="px-3 md:px-4 pb-3 md:pb-4 border-t lib-separator-border pt-3 md:pt-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold text-theme-fg uppercase tracking-wider">Downloads</span>
                        <span class="text-xs font-medium" [class.text-theme-danger]="license.downloadCount >= license.maxDownloads" [class.text-theme-success]="license.downloadCount < license.maxDownloads">
                          {{ license.downloadCount }} / {{ license.maxDownloads }} used
                        </span>
                      </div>
                      @if (license.product.files && license.product.files.length > 0) {
                        <div class="space-y-2">
                          @for (pf of license.product.files; track pf.id) {
                            <button
                              (click)="download(license.productId, pf.fileId); $event.stopPropagation()"
                              [disabled]="downloading() === pf.fileId || license.downloadCount >= license.maxDownloads"
                              class="w-full flex items-center justify-between px-3 py-2 bg-theme-surface border lib-card-border rounded-lg hover:bg-theme-secondary active:bg-[#F0EBE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                            >
                              <div class="flex items-center min-w-0 mr-3">
                                <svg class="w-4 h-4 text-theme-muted mr-2 shrink-0 group-hover/btn:text-theme-fg transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span class="text-xs font-medium text-theme-fg truncate text-left">{{ pf.file.filename }}</span>
                              </div>
                              @if (downloading() === pf.fileId) {
                                <svg class="w-4 h-4 animate-spin text-theme-fg" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              } @else {
                                <svg class="w-4 h-4 text-theme-fg shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                              }
                            </button>
                          }
                        </div>
                      } @else {
                        <div class="text-xs text-theme-muted italic text-center py-2">No files available</div>
                      }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- List / Data Grid View -->
              <app-data-grid
                [rowData]="$any(gridLicenses)"
                [columns]="gridColumns"
                [loading]="loading"
                [pagination]="$any(gridPagination)"
                [showSearch]="false"
                [showPagination]="true"
                [rowClickable]="true"
                [defaultPageSize]="pageSize()"
                [pageSizeOptions]="[12, 24, 48]"
                (dataRequest)="onGridDataRequest($event)"
                (rowClicked)="onGridRowClicked($event)"
              ></app-data-grid>
            }

            <!-- Pagination -->
            @if (paginationMeta().totalPages > 1 && viewMode() === 'gallery') {
              <nav class="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <!-- Page size selector -->
                <div class="flex items-center gap-2 text-xs text-theme-muted font-medium">
                  <span>Show</span>
                  <select
                    [ngModel]="pageSize()"
                    (ngModelChange)="setPageSize($event)"
                    class="px-2 py-1 bg-theme-surface border-2 lib-card-border rounded-lg text-theme-fg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFC60B] cursor-pointer"
                  >
                    <option [ngValue]="12">12</option>
                    <option [ngValue]="24">24</option>
                    <option [ngValue]="48">48</option>
                  </select>
                  <span>per page</span>
                </div>

                <!-- Pagination controls -->
                <div class="flex items-center gap-1">
                  <!-- First -->
                  <button
                    (click)="goToPage(1)"
                    [disabled]="currentPage() === 1"
                    class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 lib-card-border rounded-lg text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    title="First page"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
                  </button>

                  <!-- Previous -->
                  <button
                    (click)="goToPage(currentPage() - 1)"
                    [disabled]="!paginationMeta().hasPreviousPage"
                    class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 lib-card-border rounded-lg text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    title="Previous page"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>

                  <!-- Page Numbers -->
                  @for (pg of visiblePages(); track pg) {
                    @if (pg === -1) {
                      <span class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-theme-muted text-xs">...</span>
                    } @else {
                      <button
                        (click)="goToPage(pg)"
                        [class]="pg === currentPage() ? 'bg-theme-accent text-black border-theme-border shadow-[2px_2px_0px_0px_#000]' : 'bg-theme-surface text-theme-fg lib-card-border hover:bg-theme-secondary'"
                        class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 rounded-lg text-xs font-bold transition-all"
                      >
                        {{ pg }}
                      </button>
                    }
                  }

                  <!-- Next -->
                  <button
                    (click)="goToPage(currentPage() + 1)"
                    [disabled]="!paginationMeta().hasNextPage"
                    class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 lib-card-border rounded-lg text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    title="Next page"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>

                  <!-- Last -->
                  <button
                    (click)="goToPage(paginationMeta().totalPages)"
                    [disabled]="currentPage() === paginationMeta().totalPages"
                    class="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 lib-card-border rounded-lg text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    title="Last page"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                  </button>
                </div>

                <!-- Page info -->
                <div class="text-xs text-theme-muted font-medium">
                  Page {{ currentPage() }} of {{ paginationMeta().totalPages }}
                </div>
              </nav>
            }
          }
        </div>
      </section>
    </div>

    <app-purchase-details-modal
      #purchaseDetailsModal
      (download)="onModalDownload($event)"
    ></app-purchase-details-modal>
  `,
  styles: [`
    :host { display: block; }
    .font-dm-sans { font-family: 'DM Sans', sans-serif; }

    /* Filter panel slide-down animation */
    .filter-panel-enter {
      animation: filterPanelReveal 200ms ease-out;
    }
    @keyframes filterPanelReveal {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Mobile drawer */
    .lib-drawer-enter {
      animation: libDrawerSlide 300ms cubic-bezier(0.32, 0.72, 0, 1);
    }
    @keyframes libDrawerSlide {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .lib-overlay-enter {
      animation: libOverlayFadeIn 200ms ease-out;
    }
    @keyframes libOverlayFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* Filter toggle button in toolbar */
    .lib-filter-btn-inactive {
      border-color: color-mix(in srgb, var(--border) 55%, transparent);
      background: var(--surface);
      color: var(--foreground);
      transition: all 200ms ease;
    }
    .lib-filter-btn-inactive:hover {
      background: var(--secondary);
      border-color: color-mix(in srgb, var(--border) 80%, transparent);
    }
    /* Active = filters panel is open: use accent for visibility in all themes */
    .lib-filter-btn-active {
      border-color: var(--border);
      background: var(--accent);
      color: #111111;
    }

    /* Desktop filter panel buttons */
    .lib-filter-btn-desktop-inactive {
      border-color: color-mix(in srgb, var(--border) 55%, transparent);
      background: color-mix(in srgb, var(--foreground) 8%, var(--surface));
      color: var(--foreground);
      transition: all 200ms ease;
    }
    .lib-filter-btn-desktop-inactive:hover {
      border-color: color-mix(in srgb, var(--border) 80%, transparent);
      background: color-mix(in srgb, var(--foreground) 12%, var(--surface));
    }
    /* Active desktop filter pill — accent yellow, always dark text */
    .lib-filter-btn-desktop-active {
      border-color: var(--border);
      background: var(--accent);
      color: #111111;
      box-shadow: 2px 2px 0px 0px #000;
    }

    /* Mobile filter buttons (same pattern as explore page) */
    .mobile-filter-btn-inactive {
      border-color: color-mix(in srgb, var(--border) 55%, transparent);
      background: color-mix(in srgb, var(--foreground) 8%, var(--surface));
      color: var(--foreground);
      transition: all 200ms ease;
    }
    .mobile-filter-btn-inactive:hover {
      border-color: color-mix(in srgb, var(--border) 80%, transparent);
      background: color-mix(in srgb, var(--foreground) 12%, var(--surface));
    }
    /* Active mobile filter pill — accent yellow, always dark text */
    .mobile-filter-btn-active {
      border-color: var(--border);
      background: var(--accent);
      color: #111111;
      box-shadow: 2px 2px 0px 0px #000;
    }

    /* Theme-aware date inputs */
    .lib-date-input {
      border-color: color-mix(in srgb, var(--border) 55%, transparent);
      transition: all 200ms ease;
    }
    .lib-date-input:hover {
      border-color: var(--border);
    }
    .lib-date-input:focus {
      border-color: var(--border);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--border) 20%, transparent);
    }

    /* Separator border using color-mix for theme compatibility */
    .lib-separator-border {
      border-color: color-mix(in srgb, var(--border) 20%, transparent);
    }

    /* Card / UI element borders — uses color-mix so they remain visible in
       light/dark (dark neutral border) but are toned-down in mustard-dark
       where --border is bright yellow (#FFC60B). At 45% the yellow becomes
       a muted accent rather than a harsh frame. */
    .lib-card-border {
      border-color: color-mix(in srgb, var(--border) 45%, transparent);
    }
  `]
})
export class LibraryComponent implements OnInit, OnDestroy {
  @ViewChild('purchaseDetailsModal') purchaseDetailsModal!: PurchaseDetailsModalComponent;

  // Data
  licenses = signal<License[]>([]);
  loading = signal(true);
  downloading = signal<string | null>(null);

  // Overall stats from API
  overallStats = signal<{ totalProducts: number; activeCount: number; totalDownloads: number }>({
    totalProducts: 0, activeCount: 0, totalDownloads: 0,
  });

  // Pagination
  currentPage = signal(1);
  pageSize = signal(12);
  paginationMeta = signal<PaginationMeta>({
    total: 0, page: 1, limit: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });

  // Filter panel / mobile drawer visibility
  showFilters = signal(false);

  // Theme-aware helper to determine active button text color
  private themeService = inject(ThemeService);
  isDarkTheme = computed(() => {
    const theme = this.themeService.currentTheme;
    return theme === 'dark' || theme === 'mustard-dark';
  });

  // Sort and status option arrays for template iteration
  sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'A → Z', value: 'alphabetical' },
    { label: 'Most Downloads', value: 'downloads' },
  ];
  statusOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Exhausted', value: 'EXHAUSTED' },
  ];

  // Filters
  searchInput = signal('');
  sortBy = signal<SortOption>('newest');
  statusFilter = signal<StatusFilter>('');
  dateFrom = signal('');
  dateTo = signal('');

  // View
  viewMode = signal<ViewMode>('gallery');

  // Debounce
  private searchDebounceTimer: any = null;
  // Latches to true on first successful stats load — hero stats never return to skeleton
  statsReady = signal(false);
  // Set to true after first successful stats load — hero stats never update on filtered calls
  private statsLoaded = false;

  // Skeleton placeholder array
  skeletonItems = [1, 2, 3, 4, 5, 6];

  // Grid (list) view — flat-mapped data and pagination in data-grid format
  gridLicenses = computed<LibraryGridRow[]>(() =>
    this.licenses().map(l => ({
      id: l.id,
      productTitle: l.product.title,
      storeName: l.product.store?.name ?? '—',
      licenseKey: l.licenseKey,
      downloadCount: l.downloadCount,
      maxDownloads: l.maxDownloads,
      downloadsText: `${l.downloadCount} / ${l.maxDownloads}`,
      status: l.downloadCount >= l.maxDownloads ? 'EXHAUSTED' : 'ACTIVE',
      createdAt: l.createdAt,
    }))
  );

  gridPagination = computed<GridPagination | null>(() => {
    const meta = this.paginationMeta();
    if (!meta.totalPages) return null;
    return { page: meta.page, limit: meta.limit, total: meta.total, totalPages: meta.totalPages };
  });

  gridColumns: GridColumn<LibraryGridRow>[] = [
    {
      field: 'productTitle',
      headerName: 'Product',
      sortable: false,
      mobilePrimary: true,
      flex: 2,
      minWidth: 150,
    },
    {
      field: 'storeName',
      headerName: 'Store',
      sortable: false,
      mobileSecondary: true,
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'licenseKey',
      headerName: 'License Key',
      sortable: false,
      mobileHidden: true,
      flex: 1.5,
      minWidth: 130,
      cellRenderer: (params: any) =>
        `<code style="font-family:monospace;font-size:12px;background:var(--secondary);padding:2px 8px;border-radius:4px;border:1px solid color-mix(in srgb, var(--border) 45%, transparent)">${params.value ?? ''}</code>`,
    },
    {
      field: 'downloadsText',
      headerName: 'Downloads',
      sortable: false,
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'badge',
      sortable: false,
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Purchased',
      type: 'date',
      sortable: false,
      mobileHidden: true,
      flex: 0.9,
      minWidth: 110,
    },
  ];

  // Computed: visible page numbers with ellipsis
  visiblePages = computed(() => {
    const meta = this.paginationMeta();
    const current = meta.page;
    const total = meta.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [];
    pages.push(1);
    if (current > 3) pages.push(-1); // ellipsis
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1); // ellipsis
    pages.push(total);
    return pages;
  });

  hasActiveFilters = computed(() => {
    const dateActive = !!(this.dateFrom() && this.dateTo());
    return !!(this.searchInput() || this.statusFilter() || dateActive || this.sortBy() !== 'newest');
  });

  constructor(
    private checkoutService: CheckoutService,
    private downloadService: DownloadService,
  ) {}

  private toaster = inject(ToasterService);

  ngOnInit() {
    // Restore view mode from localStorage
    try {
      const saved = localStorage.getItem('libraryViewMode');
      if (saved === 'gallery' || saved === 'list') this.viewMode.set(saved);
    } catch {}

    this.loadLicenses();
  }

  ngOnDestroy() {
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
  }

  async loadLicenses() {
    this.loading.set(true);
    try {
      const result = await this.checkoutService.getMyLicensesPaginated({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchInput().trim() || undefined,
        status: (this.statusFilter() || undefined) as 'ACTIVE' | 'EXHAUSTED' | undefined,
        sortBy: this.sortBy(),
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() ? new Date(this.dateTo() + 'T23:59:59').toISOString() : undefined,
      });

      this.licenses.set(result.data);
      this.paginationMeta.set(result.meta);
      // Keep hero stats frozen at all-time totals; only set them once on initial load
      if (result.overallStats && !this.statsLoaded) {
        this.overallStats.set(result.overallStats);
        this.statsLoaded = true;
        this.statsReady.set(true);
      }
    } catch (error) {
      console.error('Failed to load library:', error);
      this.toaster.handleError(error, 'Failed to load your library.');
    } finally {
      this.loading.set(false);
    }
  }

  // --- Search ---
  onSearchInput(value: string) {
    this.searchInput.set(value);
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.loadLicenses();
    }, 400);
  }

  clearSearch() {
    this.searchInput.set('');
    this.currentPage.set(1);
    this.loadLicenses();
  }

  // --- Filters ---
  setSortBy(val: SortOption) {
    this.sortBy.set(val);
    this.currentPage.set(1);
    this.loadLicenses();
  }

  setStatusFilter(val: StatusFilter) {
    this.statusFilter.set(val);
    this.currentPage.set(1);
    this.loadLicenses();
  }

  setDateFrom(val: string) {
    this.dateFrom.set(val);
    const to = this.dateTo();
    // Reload only when the range is complete (both filled) or fully cleared (both empty)
    if ((val && to) || (!val && !to)) {
      this.currentPage.set(1);
      this.loadLicenses();
    }
  }

  setDateTo(val: string) {
    this.dateTo.set(val);
    const from = this.dateFrom();
    // Reload only when the range is complete (both filled) or fully cleared (both empty)
    if ((from && val) || (!from && !val)) {
      this.currentPage.set(1);
      this.loadLicenses();
    }
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  clearFilters() {
    this.searchInput.set('');
    this.sortBy.set('newest');
    this.statusFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.currentPage.set(1);
    this.loadLicenses();
  }

  // --- View Mode ---
  setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
    try { localStorage.setItem('libraryViewMode', mode); } catch {}
  }

  // --- Pagination ---
  goToPage(page: number) {
    const meta = this.paginationMeta();
    if (page < 1 || page > meta.totalPages || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadLicenses();
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadLicenses();
  }

  // --- Downloads ---
  async download(productId: string, fileId: string) {
    this.downloading.set(fileId);
    try {
      await this.downloadService.downloadFile(productId, fileId);
      // Update download count locally
      this.licenses.update(items =>
        items.map(l =>
          l.productId === productId ? { ...l, downloadCount: l.downloadCount + 1 } : l
        )
      );
      // Update overall stats
      this.overallStats.update(s => ({ ...s, totalDownloads: s.totalDownloads + 1 }));
    } catch (error) {
      console.error('Download failed:', error);
      this.toaster.handleError(error, 'Download failed. Please try again.');
    } finally {
      this.downloading.set(null);
    }
  }

  // --- Grid (List Mode) ---
  onGridDataRequest(req: GridDataRequest) {
    const pageChanged = req.page !== this.currentPage();
    const limitChanged = req.limit !== this.pageSize();
    if (!pageChanged && !limitChanged) return;
    this.currentPage.set(req.page);
    this.pageSize.set(req.limit);
    this.loadLicenses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onGridRowClicked(row: LibraryGridRow) {
    const license = this.licenses().find(l => l.id === row.id);
    if (license) this.openPurchaseDetails(license);
  }

  openPurchaseDetails(license: License) {
    this.purchaseDetailsModal.open(license);
  }

  async onModalDownload(event: { purchase: any, fileId: string }) {
    this.purchaseDetailsModal.setDownloading(event.fileId);
    try {
      await this.downloadService.downloadFile(event.purchase.productId, event.fileId);

      this.licenses.update(items =>
        items.map(l =>
          l.id === event.purchase.id ? { ...l, downloadCount: l.downloadCount + 1 } : l
        )
      );
      this.overallStats.update(s => ({ ...s, totalDownloads: s.totalDownloads + 1 }));

      const updatedLicense = this.licenses().find(l => l.id === event.purchase.id);
      if (updatedLicense) {
        this.purchaseDetailsModal.purchase.set(updatedLicense);
      }
    } catch (error) {
      console.error('Download failed:', error);
      this.toaster.handleError(error, 'Download failed. Please try again.');
    } finally {
      this.purchaseDetailsModal.setDownloading(null);
    }
  }
}
