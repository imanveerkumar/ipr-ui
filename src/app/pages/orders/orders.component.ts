import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';

type StatusFilter = 'ALL' | 'PENDING' | 'PAID' | 'FULFILLED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
type SortOption = 'newest' | 'oldest';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-theme-secondary border-b-2 lib-separator-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-4 md:pt-4 md:pb-6 lg:pt-6 lg:pb-8">
            <div class="text-left">
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-theme-fg mb-0 md:mb-1 leading-tight">
                Order History
              </h1>

              <!-- Stats (below heading) -->
              <div class="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-3 max-w-2xl mx-auto md:mx-0">
                <!-- Total Orders -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#5B8DEF]">
                  @if (!loading()) {
                    <div class="text-lg md:text-2xl font-bold text-white leading-none">{{ overallStats().totalOrders }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-white/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-white/80 font-semibold mt-1">Total Orders</div>
                </div>
                <!-- Completed -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#68E079]">
                  @if (!loading()) {
                    <div class="text-lg md:text-2xl font-bold text-black leading-none">{{ getCompletedCount() }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-black/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-black/70 font-semibold mt-1">Completed</div>
                </div>
                <!-- Total Spent -->
                <div class="flex flex-col items-start justify-center p-3 md:p-4 rounded-xl bg-[#FFC60B]">
                  @if (!loading()) {
                    <div class="text-lg md:text-2xl font-bold text-black leading-none">{{ getTotalSpent() }}</div>
                  } @else {
                    <div class="h-6 md:h-7 w-10 md:w-14 bg-black/15 rounded animate-pulse mb-1"></div>
                  }
                  <div class="text-[10px] md:text-xs text-black/70 font-semibold mt-1">Total Spent</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- Toolbar (Filters + Search) -->
      <section class="sticky top-0 z-20 bg-theme-surface border-b-2 lib-separator-border">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center gap-3">
            <!-- Filter Toggle Button -->
            <button
              (click)="toggleFilters()"
              [class.lib-filter-btn-active]="showFilters()"
              [class.lib-filter-btn-inactive]="!showFilters()"
              [attr.aria-label]="showFilters() ? 'Hide filters' : 'Show filters'"
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm border-2 transition-all shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
              </svg>
              Filters
              @if (hasActiveFilters()) {
                <span class="w-2 h-2 rounded-full bg-current"></span>
              }
            </button>

            <!-- Search Input -->
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                [ngModel]="searchInput()"
                (ngModelChange)="onSearchInput($event)"
                placeholder="Product name or order ID..."
                class="w-full pl-9 pr-9 py-2 text-sm bg-theme-surface border-2 border-theme-border rounded-lg text-theme-fg placeholder:text-theme-muted focus:outline-none focus:border-theme-fg transition-colors"
              />
              @if (searchInput()) {
                <button
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-theme-fg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              }
            </div>
          </div>

          <!-- Desktop Filter Panel -->
          @if (showFilters()) {
            <div class="hidden lg:block mt-3 pt-3 border-t-2 lib-separator-border filter-panel-enter">
              <div class="grid grid-cols-2 gap-6">
                <!-- Status -->
                <div>
                  <p class="text-xs font-bold uppercase tracking-widest text-theme-muted mb-2">Status</p>
                  <div class="flex flex-wrap gap-2">
                    @for (option of statusOptions; track option.value) {
                      <button
                        (click)="setStatusFilter(option.value)"
                        [class.lib-filter-btn-desktop-active]="statusFilter() === option.value"
                        [class.lib-filter-btn-desktop-inactive]="statusFilter() !== option.value"
                        class="px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
                      >
                        {{ option.label }}
                      </button>
                    }
                  </div>
                </div>
                <!-- Sort -->
                <div>
                  <p class="text-xs font-bold uppercase tracking-widest text-theme-muted mb-2">Sort By</p>
                  <div class="flex flex-wrap gap-2">
                    @for (option of sortOptions; track option.value) {
                      <button
                        (click)="setSortBy(option.value)"
                        [class.lib-filter-btn-desktop-active]="sortBy() === option.value"
                        [class.lib-filter-btn-desktop-inactive]="sortBy() !== option.value"
                        class="px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all"
                      >
                        {{ option.label }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Mobile Filter Drawer -->
      @if (showFilters()) {
        <div class="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div (click)="showFilters.set(false)" class="absolute inset-0 bg-black/40 backdrop-blur-[2px] lib-overlay-enter"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-theme-secondary rounded-t-2xl max-h-[85vh] flex flex-col lib-drawer-enter shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <!-- Handle Bar -->
            <div class="flex-shrink-0 pt-3 pb-1 flex justify-center">
              <div class="w-10 h-1 rounded-full bg-theme-border"></div>
            </div>
            <!-- Header -->
            <div class="flex-shrink-0 bg-theme-secondary lib-separator-border border-b-2 px-5 py-3.5 flex items-center justify-between">
              <button
                (click)="clearFilters()"
                class="text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors"
              >
                Reset
              </button>
              <span class="text-base font-bold text-theme-fg">Filters</span>
              <button (click)="showFilters.set(false)" class="w-9 h-9 flex items-center justify-center rounded-lg bg-fg-faint hover:bg-theme-border/20 active:bg-theme-border/30 transition-colors border lib-separator-border">
                <svg class="w-4 h-4 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Scrollable content -->
            <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <!-- Status -->
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-theme-muted mb-3">Status</p>
                <div class="flex flex-wrap gap-2">
                  @for (option of statusOptions; track option.value) {
                    <button
                      (click)="setStatusFilter(option.value)"
                      [class.mobile-filter-btn-active]="statusFilter() === option.value"
                      [class.mobile-filter-btn-inactive]="statusFilter() !== option.value"
                      class="px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Sort -->
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-theme-muted mb-3">Sort By</p>
                <div class="flex flex-wrap gap-2">
                  @for (option of sortOptions; track option.value) {
                    <button
                      (click)="setSortBy(option.value)"
                      [class.mobile-filter-btn-active]="sortBy() === option.value"
                      [class.mobile-filter-btn-inactive]="sortBy() !== option.value"
                      class="px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all"
                    >
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="flex-shrink-0 border-t lib-separator-border px-5 pt-3 pb-4 bg-theme-secondary">
              <button
                (click)="showFilters.set(false)"
                class="w-full py-3 bg-theme-accent border-2 border-theme-border rounded-xl font-bold text-sm text-theme-surface shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Main Content -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">

          <!-- Results / Active Filters Row -->
          @if (!loading()) {
            <div class="flex items-center justify-between mb-4 md:mb-6">
              <p class="text-sm font-medium text-theme-muted">
                {{ meta().total }} result{{ meta().total !== 1 ? 's' : '' }}
              </p>
              @if (hasActiveFilters()) {
                <button (click)="clearFilters()" class="text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors underline underline-offset-2">
                  Clear all
                </button>
              }
            </div>
          }

          <!-- Loading Skeleton -->
          @if (loading()) {
            <div class="space-y-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="bg-theme-surface border-2 border-theme-border rounded-xl overflow-hidden">
                  <div class="p-4 md:p-5">
                    <div class="flex items-start gap-4">
                      <div class="w-16 h-16 md:w-20 md:h-20 bg-theme-secondary rounded-lg animate-pulse shrink-0"></div>
                      <div class="flex-1 min-w-0">
                        <div class="h-4 md:h-5 bg-theme-fg/10 rounded animate-pulse w-3/4 mb-2"></div>
                        <div class="h-3 md:h-4 bg-theme-fg/5 rounded animate-pulse w-1/2 mb-3"></div>
                        <div class="flex items-center gap-2">
                          <div class="h-6 w-16 bg-theme-accent/30 rounded animate-pulse"></div>
                          <div class="h-3 w-24 bg-theme-fg/5 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div class="text-right shrink-0">
                        <div class="h-5 w-20 bg-theme-fg/10 rounded animate-pulse mb-2"></div>
                        <div class="h-3 w-16 bg-theme-fg/5 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (orders().length === 0 && !isFiltering()) {
            <!-- Empty State -->
            <div class="text-center py-12 md:py-16 transition-opacity duration-200">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-theme-secondary border-2 border-theme-border rounded-2xl flex items-center justify-center transform rotate-3">
                <svg class="w-10 h-10 md:w-12 md:h-12 text-theme-fg/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <h2 class="font-dm-sans text-xl md:text-2xl font-bold text-theme-fg mb-2">
                {{ hasActiveFilters() ? 'No orders found' : 'No orders yet' }}
              </h2>
              <p class="text-sm md:text-base text-theme-muted max-w-md mx-auto mb-8 font-medium">
                {{ hasActiveFilters() ? 'Try adjusting your search or filters' : 'Start shopping and your orders will appear here.' }}
              </p>
              @if (!hasActiveFilters()) {
                <a routerLink="/explore" class="inline-flex items-center px-6 py-3 bg-theme-accent border-2 border-theme-border rounded-lg font-bold text-theme-surface hover:bg-[#ffdb4d] transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                  Start Shopping
                </a>
              }
            </div>
          } @else {
            <!-- Orders List Container with Filtering Overlay -->
            <div class="relative">
              <!-- Subtle Loading Overlay for Tab Switching -->
              @if (isFiltering()) {
                <div class="absolute inset-0 bg-white/60 z-10 flex items-start justify-center pt-16 backdrop-blur-[1px] transition-opacity duration-150">
                  <div class="flex items-center gap-3 px-4 py-2 bg-theme-surface border-2 border-theme-border rounded-full shadow-[2px_2px_0px_0px_#000]">
                    <div class="w-5 h-5 border-2 border-[#FFC60B] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-sm font-medium text-theme-fg">Updating...</span>
                  </div>
                </div>
              }
              
              <!-- Orders List -->
              <div class="space-y-4 md:space-y-6 transition-opacity duration-200" [class.opacity-50]="isFiltering()">
                @for (order of orders(); track order.id) {
                  <div class="group bg-theme-surface border-2 border-theme-border rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
                    <!-- Order Header -->
                    <div class="p-4 md:p-6 bg-theme-secondary border-b-2 border-theme-border">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div class="flex items-center gap-3">
                          <!-- Order Icon -->
                          <div class="w-10 h-10 md:w-12 md:h-12 bg-theme-surface border-2 border-theme-border rounded-lg flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 md:w-6 md:h-6 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                          </div>
                        <div>
                          <p class="text-xs md:text-sm text-theme-muted font-medium">Order ID</p>
                          <p class="font-bold text-sm md:text-base text-theme-fg font-mono">{{ formatId(order.id) }}</p>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3 sm:gap-4">
                        <div class="text-left sm:text-right">
                          <p class="text-xs md:text-sm text-theme-muted font-medium">Date</p>
                          <p class="font-bold text-sm md:text-base text-theme-fg">{{ order.createdAt | date:'mediumDate' }}</p>
                        </div>
                        <span [class]="getStatusClass(order.status)" class="px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg border-2 border-theme-border">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="p-4 md:p-6">
                    <div class="space-y-3">
                      @for (item of order.items; track item.id) {
                        <div class="flex items-center gap-3 md:gap-4 p-3 bg-theme-secondary/50 rounded-lg border border-black/10">
                          <!-- Product Image -->
                          <div class="w-12 h-12 md:w-16 md:h-16 bg-theme-secondary border-2 border-theme-border rounded-lg overflow-hidden shrink-0">
                            @if (item.product.coverImageUrl) {
                              <img [src]="item.product.coverImageUrl" [alt]="item.titleSnapshot" class="w-full h-full object-cover"/>
                            } @else {
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-theme-fg/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                              </div>
                            }
                          </div>
                          
                          <!-- Product Info -->
                          <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm md:text-base text-theme-fg truncate">{{ item.titleSnapshot }}</h4>
                            @if (item.product.store?.name) {
                              <p class="text-xs text-theme-muted font-medium truncate">by {{ item.product!.store!.name }}</p>
                            }
                          </div>
                          
                          <!-- Price -->
                          <div class="text-right shrink-0">
                            <span class="font-bold text-sm md:text-base text-theme-fg">₹{{ item.priceAtPurchase / 100 }}</span>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Order Total -->
                    <div class="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-black/20">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-theme-fg">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-theme-muted font-medium">Total:</span>
                        <span class="text-lg md:text-xl font-bold text-theme-fg">₹{{ order.totalAmount / 100 }}</span>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    @if (order.status === 'PAID' || order.status === 'FULFILLED') {
                      <div class="mt-4 pt-4 border-t border-black/10">
                        <a routerLink="/library" class="inline-flex items-center gap-2 px-4 py-2 bg-theme-success border-2 border-theme-border rounded-lg font-bold text-sm text-theme-surface hover:bg-[#5cd46d] transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                          </svg>
                          Go to Library
                        </a>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
            </div><!-- End of relative container -->

            <!-- Pagination -->
            @if (meta().totalPages > 1) {
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <!-- Page size selector -->
                <div class="flex items-center gap-2 text-sm text-theme-muted font-medium">
                  <span>Show</span>
                  <select
                    [ngModel]="meta().limit"
                    (ngModelChange)="setPageSize($event)"
                    class="px-2 py-1 bg-theme-surface border-2 border-theme-border rounded-lg text-sm text-theme-fg font-bold focus:outline-none focus:border-theme-fg"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>per page &middot; {{ meta().total }} total</span>
                </div>

                <div class="flex items-center gap-2">
                  <!-- First -->
                  <button
                    (click)="goToPage(1)"
                    [disabled]="!meta().hasPreviousPage"
                    class="hidden sm:flex items-center px-2 py-2 bg-theme-surface border-2 border-theme-border rounded-lg font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <!-- Prev -->
                  <button
                    (click)="goToPage(meta().page - 1)"
                    [disabled]="!meta().hasPreviousPage"
                    class="flex items-center gap-1 px-3 py-2 bg-theme-surface border-2 border-theme-border rounded-lg font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Prev
                  </button>

                  <div class="flex items-center gap-1">
                    @for (page of getVisiblePages(); track $index) {
                      @if (page === -1) {
                        <span class="px-2 py-1 text-sm text-theme-muted">...</span>
                      } @else {
                        <button
                          (click)="goToPage(+page)"
                          class="w-10 h-10 flex items-center justify-center border-2 border-theme-border rounded-lg font-bold text-sm transition-all"
                          [class.bg-theme-accent]="meta().page === +page"
                          [class.bg-theme-surface]="meta().page !== +page"
                          [class.text-theme-surface]="meta().page === +page"
                          [class.text-theme-fg]="meta().page !== +page"
                          [class.hover:bg-theme-secondary]="meta().page !== +page"
                        >
                          {{ page }}
                        </button>
                      }
                    }
                  </div>

                  <!-- Next -->
                  <button
                    (click)="goToPage(meta().page + 1)"
                    [disabled]="!meta().hasNextPage"
                    class="flex items-center gap-1 px-3 py-2 bg-theme-surface border-2 border-theme-border rounded-lg font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                  <!-- Last -->
                  <button
                    (click)="goToPage(meta().totalPages)"
                    [disabled]="!meta().hasNextPage"
                    class="hidden sm:flex items-center px-2 py-2 bg-theme-surface border-2 border-theme-border rounded-lg font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            }
          }
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
    .lib-separator-border {
      border-color: var(--border);
    }
    .lib-card-border {
      border-color: var(--border);
    }
    .filter-panel-enter {
      animation: filterPanelSlideDown 0.18s ease-out both;
    }
    @keyframes filterPanelSlideDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .lib-drawer-enter {
      animation: drawerSlideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1) both;
    }
    @keyframes drawerSlideUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    .lib-overlay-enter {
      animation: overlayFadeIn 0.22s ease-out both;
    }
    @keyframes overlayFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .lib-filter-btn-inactive {
      background: var(--surface);
      color: var(--foreground);
      border-color: var(--border);
    }
    .lib-filter-btn-inactive:hover {
      background: var(--secondary);
    }
    .lib-filter-btn-active {
      background: var(--foreground);
      color: var(--surface);
      border-color: var(--foreground);
    }
    .lib-filter-btn-desktop-inactive {
      background: var(--surface);
      color: var(--foreground);
      border-color: var(--border);
    }
    .lib-filter-btn-desktop-inactive:hover {
      background: var(--secondary);
    }
    .lib-filter-btn-desktop-active {
      background: var(--foreground);
      color: var(--surface);
      border-color: var(--foreground);
    }
    .mobile-filter-btn-inactive {
      background: var(--surface);
      color: var(--foreground);
      border-color: var(--border);
    }
    .mobile-filter-btn-inactive:hover {
      background: var(--secondary);
    }
    .mobile-filter-btn-active {
      background: var(--foreground);
      color: var(--surface);
      border-color: var(--foreground);
    }
  `]
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders = signal<Order[]>([]);
  loading = signal(true);
  isFiltering = signal(false);
  searchInput = signal('');
  private searchDebounceTimer: any = null;

  statusFilter = signal<StatusFilter>('ALL');
  sortBy = signal<SortOption>('newest');
  showFilters = signal(false);

  meta = signal({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  overallStats = signal({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  statusOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All',       value: 'ALL' },
    { label: 'Paid',      value: 'PAID' },
    { label: 'Fulfilled', value: 'FULFILLED' },
    { label: 'Pending',   value: 'PENDING' },
    { label: 'Failed',    value: 'FAILED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Refunded',  value: 'REFUNDED' },
  ];

  sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
  ];

  hasActiveFilters = computed(() =>
    this.searchInput() !== '' || this.statusFilter() !== 'ALL' || this.sortBy() !== 'newest'
  );

  Math = Math;

  constructor(private checkoutService: CheckoutService) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  ngOnDestroy() {
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
  }

  async loadOrders(showFullLoader = true) {
    if (showFullLoader) {
      this.loading.set(true);
    } else {
      this.isFiltering.set(true);
    }
    try {
      const result = await this.checkoutService.getMyOrdersPaginated({
        page: this.meta().page,
        limit: this.meta().limit,
        search: this.searchInput().trim() || undefined,
        status: this.statusFilter() === 'ALL' ? undefined : this.statusFilter(),
        sortOrder: this.sortBy() === 'newest' ? 'desc' : 'asc',
      });
      this.orders.set(result.data);
      this.meta.set(result.meta);
      this.overallStats.set(result.overallStats);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      this.loading.set(false);
      this.isFiltering.set(false);
    }
  }

  onSearchInput(value: string) {
    this.searchInput.set(value);
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.meta.update(m => ({ ...m, page: 1 }));
      this.loadOrders(false);
    }, 400);
  }

  clearSearch() {
    this.searchInput.set('');
    this.meta.update(m => ({ ...m, page: 1 }));
    this.loadOrders(false);
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  async setStatusFilter(status: StatusFilter) {
    if (this.statusFilter() === status) return;
    this.statusFilter.set(status);
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  async setSortBy(sort: SortOption) {
    if (this.sortBy() === sort) return;
    this.sortBy.set(sort);
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  async clearFilters() {
    this.searchInput.set('');
    this.statusFilter.set('ALL');
    this.sortBy.set('newest');
    this.showFilters.set(false);
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.meta().totalPages) return;
    this.meta.update(m => ({ ...m, page }));
    await this.loadOrders(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async setPageSize(limit: number) {
    this.meta.update(m => ({ ...m, limit: +limit, page: 1 }));
    await this.loadOrders(false);
  }

  getVisiblePages(): number[] {
    const { page, totalPages } = this.meta();
    const pages: number[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 3) {
      pages.push(1, 2, 3, 4, -1, totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, -1, page - 1, page, page + 1, -1, totalPages);
    }
    return pages;
  }

  formatId(id: string) {
    return id.slice(0, 8).toUpperCase();
  }

  getCompletedCount(): number {
    return this.overallStats().completedOrders;
  }

  getTotalSpent(): string {
    return '₹' + (this.overallStats().totalSpent / 100).toLocaleString('en-IN');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAID':
      case 'FULFILLED':
        return 'bg-theme-success text-theme-surface';
      case 'PENDING':
        return 'bg-theme-accent text-theme-surface';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-theme-danger text-white';
      case 'REFUNDED':
        return 'bg-theme-primary text-theme-surface';
      default:
        return 'bg-theme-secondary text-theme-surface';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAID':      return 'Paid';
      case 'FULFILLED': return 'Completed';
      case 'PENDING':   return 'Pending';
      case 'FAILED':    return 'Failed';
      case 'CANCELLED': return 'Cancelled';
      case 'REFUNDED':  return 'Refunded';
      default:          return status;
    }
  }
}
