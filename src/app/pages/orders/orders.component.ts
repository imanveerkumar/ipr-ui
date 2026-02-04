import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';

type StatusFilter = 'ALL' | 'PENDING' | 'PAID' | 'FULFILLED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
type SortOrder = 'desc' | 'asc';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
            <div class="text-center">
              <!-- Badge -->
              <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#7C3AED] border-2 border-black mb-4 transform -rotate-1">
                <span class="text-xs font-bold text-white uppercase tracking-wider">Purchases</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-2xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-2 md:mb-3 leading-tight">
                Order History
              </h1>
              
              <!-- Subtext -->
              <p class="text-sm md:text-lg text-[#111111]/70 max-w-xl mx-auto mb-6 md:mb-8 font-medium">
                Track all your purchases and their status
              </p>

              <!-- Search Bar -->
              <div class="max-w-xl mx-auto mb-8 md:mb-12">
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
                    placeholder="Search orders by product name..."
                    class="w-full pl-10 md:pl-12 pr-24 py-3 md:py-3.5 bg-white border-2 border-black rounded-xl text-[#111111] placeholder-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] focus:border-black shadow-[4px_4px_0px_0px_#000] text-sm md:text-base font-medium transition-all"
                  />
                  <button
                    (click)="performSearch()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-2 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-xs sm:text-sm hover:bg-[#ffdb4d] transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px]"
                  >
                    Search
                  </button>
                </div>
              </div>

              <!-- Stats - Always visible with skeleton state -->
              <div class="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-8 max-w-2xl mx-auto">
                <!-- Total Orders stat -->
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#2B57D6] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ overallStats().totalOrders }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Total Orders</div>
                  </div>
                </div>
                <!-- Completed stat -->
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#68E079] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getCompletedCount() }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Completed</div>
                  </div>
                </div>
                <!-- Total Spent stat -->
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FFC60B] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getTotalSpent() }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-10 md:w-16 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Total Spent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          <!-- Filters Row -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8 sticky top-0 z-20 bg-white pt-2 pb-2 sm:relative sm:top-auto sm:z-auto sm:bg-transparent sm:pt-0 sm:pb-0">
            <!-- Status Filter Tabs -->
            <div class="flex overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div class="flex gap-1.5 md:gap-2 p-1 bg-[#F9F4EB] border-2 border-black rounded-xl">
                @for (status of statusFilters; track status.value) {
                  <button
                    (click)="filterByStatus(status.value)"
                    class="flex items-center gap-1.5 px-2.5 py-2 md:px-4 md:py-2.5 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-200"
                    [class.bg-[#111111]]="currentStatus() === status.value"
                    [class.text-white]="currentStatus() === status.value"
                    [class.shadow-[2px_2px_0px_0px_#FFC60B]]="currentStatus() === status.value"
                    [class.text-[#111111]]="currentStatus() !== status.value"
                    [class.hover:bg-white]="currentStatus() !== status.value"
                  >
                    {{ status.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Sort & Clear -->
            <div class="flex items-center gap-2">
              <!-- Sort Dropdown -->
              <div class="relative">
                <button
                  (click)="toggleSortDropdown()"
                  class="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black rounded-lg font-medium text-xs md:text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                  </svg>
                  {{ currentSortOrder() === 'desc' ? 'Newest First' : 'Oldest First' }}
                  <svg class="w-4 h-4 transition-transform" [class.rotate-180]="showSortDropdown()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                <!-- Sort Options -->
                @if (showSortDropdown()) {
                  <div class="absolute top-full right-0 mt-2 w-40 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] z-20 overflow-hidden">
                    <button
                      (click)="setSortOrder('desc')"
                      class="w-full px-4 py-3 text-left text-sm font-medium text-[#111111] hover:bg-[#F9F4EB] transition-colors border-b border-black/10"
                      [class.bg-[#FFC60B]]="currentSortOrder() === 'desc'"
                    >
                      Newest First
                    </button>
                    <button
                      (click)="setSortOrder('asc')"
                      class="w-full px-4 py-3 text-left text-sm font-medium text-[#111111] hover:bg-[#F9F4EB] transition-colors"
                      [class.bg-[#FFC60B]]="currentSortOrder() === 'asc'"
                    >
                      Oldest First
                    </button>
                  </div>
                }
              </div>

              <!-- Clear Filters -->
              @if (hasActiveFilters()) {
                <button
                  (click)="clearFilters()"
                  class="flex items-center gap-1.5 px-3 py-2 bg-[#FA4B28] border-2 border-black rounded-lg font-medium text-xs md:text-sm text-white hover:bg-[#e8421f] transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Clear
                </button>
              }
            </div>
          </div>

          <!-- Loading Skeleton -->
          @if (loading()) {
            <div class="space-y-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="bg-white border-2 border-black rounded-xl overflow-hidden">
                  <div class="p-4 md:p-5">
                    <div class="flex items-start gap-4">
                      <div class="w-16 h-16 md:w-20 md:h-20 bg-[#F9F4EB] rounded-lg animate-pulse shrink-0"></div>
                      <div class="flex-1 min-w-0">
                        <div class="h-4 md:h-5 bg-[#111111]/10 rounded animate-pulse w-3/4 mb-2"></div>
                        <div class="h-3 md:h-4 bg-[#111111]/5 rounded animate-pulse w-1/2 mb-3"></div>
                        <div class="flex items-center gap-2">
                          <div class="h-6 w-16 bg-[#FFC60B]/30 rounded animate-pulse"></div>
                          <div class="h-3 w-24 bg-[#111111]/5 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div class="text-right shrink-0">
                        <div class="h-5 w-20 bg-[#111111]/10 rounded animate-pulse mb-2"></div>
                        <div class="h-3 w-16 bg-[#111111]/5 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (orders().length === 0 && !isFiltering()) {
            <!-- Empty State -->
            <div class="text-center py-12 md:py-16 transition-opacity duration-200">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center transform rotate-3">
                <svg class="w-10 h-10 md:w-12 md:h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <h2 class="font-dm-sans text-xl md:text-2xl font-bold text-[#111111] mb-2">
                {{ searchQuery || currentStatus() !== 'ALL' ? 'No orders found' : 'No orders yet' }}
              </h2>
              <p class="text-sm md:text-base text-[#111111]/60 max-w-md mx-auto mb-8 font-medium">
                {{ searchQuery || currentStatus() !== 'ALL' ? 'Try adjusting your search or filters' : 'Start shopping and your orders will appear here.' }}
              </p>
              @if (!searchQuery && currentStatus() === 'ALL') {
                <a routerLink="/explore" class="inline-flex items-center px-6 py-3 bg-[#FFC60B] border-2 border-black rounded-lg font-bold text-[#111111] hover:bg-[#ffdb4d] transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
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
                  <div class="flex items-center gap-3 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000]">
                    <div class="w-5 h-5 border-2 border-[#FFC60B] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-sm font-medium text-[#111111]">Updating...</span>
                  </div>
                </div>
              }
              
              <!-- Orders List -->
              <div class="space-y-4 md:space-y-6 transition-opacity duration-200" [class.opacity-50]="isFiltering()">
                @for (order of orders(); track order.id) {
                  <div class="group bg-white border-2 border-black rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
                    <!-- Order Header -->
                    <div class="p-4 md:p-6 bg-[#F9F4EB] border-b-2 border-black">
                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div class="flex items-center gap-3">
                          <!-- Order Icon -->
                          <div class="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 md:w-6 md:h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                          </div>
                        <div>
                          <p class="text-xs md:text-sm text-[#111111]/60 font-medium">Order ID</p>
                          <p class="font-bold text-sm md:text-base text-[#111111] font-mono">{{ order.id.slice(0, 8).toUpperCase() }}</p>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3 sm:gap-4">
                        <div class="text-left sm:text-right">
                          <p class="text-xs md:text-sm text-[#111111]/60 font-medium">Date</p>
                          <p class="font-bold text-sm md:text-base text-[#111111]">{{ order.createdAt | date:'mediumDate' }}</p>
                        </div>
                        <span [class]="getStatusClass(order.status)" class="px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg border-2 border-black">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="p-4 md:p-6">
                    <div class="space-y-3">
                      @for (item of order.items; track item.id) {
                        <div class="flex items-center gap-3 md:gap-4 p-3 bg-[#F9F4EB]/50 rounded-lg border border-black/10">
                          <!-- Product Image -->
                          <div class="w-12 h-12 md:w-16 md:h-16 bg-[#F9F4EB] border-2 border-black rounded-lg overflow-hidden shrink-0">
                            @if (item.product.coverImageUrl) {
                              <img [src]="item.product.coverImageUrl" [alt]="item.titleSnapshot" class="w-full h-full object-cover"/>
                            } @else {
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                </svg>
                              </div>
                            }
                          </div>
                          
                          <!-- Product Info -->
                          <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm md:text-base text-[#111111] truncate">{{ item.titleSnapshot }}</h4>
                            @if (item.product.store?.name) {
                              <p class="text-xs text-[#111111]/60 font-medium truncate">by {{ item.product!.store!.name }}</p>
                            }
                          </div>
                          
                          <!-- Price -->
                          <div class="text-right shrink-0">
                            <span class="font-bold text-sm md:text-base text-[#111111]">₹{{ item.priceAtPurchase / 100 }}</span>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Order Total -->
                    <div class="flex items-center justify-between mt-4 pt-4 border-t-2 border-dashed border-black/20">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-[#111111]">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-[#111111]/60 font-medium">Total:</span>
                        <span class="text-lg md:text-xl font-bold text-[#111111]">₹{{ order.totalAmount / 100 }}</span>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    @if (order.status === 'PAID' || order.status === 'FULFILLED') {
                      <div class="mt-4 pt-4 border-t border-black/10">
                        <a routerLink="/library" class="inline-flex items-center gap-2 px-4 py-2 bg-[#68E079] border-2 border-black rounded-lg font-bold text-sm text-[#111111] hover:bg-[#5cd46d] transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
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
                <p class="text-sm text-[#111111]/60 font-medium">
                  Showing {{ ((meta().page - 1) * meta().limit) + 1 }} - {{ Math.min(meta().page * meta().limit, meta().total) }} of {{ meta().total }} orders
                </p>
                
                <div class="flex items-center gap-2">
                  <button
                    (click)="goToPage(meta().page - 1)"
                    [disabled]="!meta().hasPreviousPage"
                    class="flex items-center gap-1 px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Prev
                  </button>
                  
                  <div class="flex items-center gap-1">
                    @for (page of getVisiblePages(); track page) {
                      @if (page === '...') {
                        <span class="px-2 py-1 text-sm text-[#111111]/60">...</span>
                      } @else {
                        <button
                          (click)="goToPage(+page)"
                          class="w-10 h-10 flex items-center justify-center border-2 border-black rounded-lg font-bold text-sm transition-all"
                          [class.bg-[#FFC60B]]="meta().page === +page"
                          [class.bg-white]="meta().page !== +page"
                          [class.hover:bg-[#F9F4EB]]="meta().page !== +page"
                        >
                          {{ page }}
                        </button>
                      }
                    }
                  </div>
                  
                  <button
                    (click)="goToPage(meta().page + 1)"
                    [disabled]="!meta().hasNextPage"
                    class="flex items-center gap-1 px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
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
  `]
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  isFiltering = signal(false); // For tab switching - shows subtle loading without replacing content
  searchQuery = '';
  private searchTimeout: any;
  
  currentStatus = signal<StatusFilter>('ALL');
  currentSortOrder = signal<SortOrder>('desc');
  showSortDropdown = signal(false);
  
  meta = signal({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Overall stats (not affected by pagination)
  overallStats = signal({
    totalOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  // Expose Math for template
  Math = Math;

  statusFilters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Fulfilled', value: 'FULFILLED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Failed', value: 'FAILED' },
  ];

  constructor(private checkoutService: CheckoutService) {}

  async ngOnInit() {
    // Load orders and stats in parallel
    await Promise.all([
      this.loadOrders(),
      this.loadOverallStats(),
    ]);
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
        search: this.searchQuery || undefined,
        status: this.currentStatus() === 'ALL' ? undefined : this.currentStatus(),
        sortOrder: this.currentSortOrder(),
      });
      
      this.orders.set(result.data);
      this.meta.set(result.meta);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      this.loading.set(false);
      this.isFiltering.set(false);
    }
  }

  async loadOverallStats() {
    try {
      // Fetch all orders without pagination to calculate accurate stats
      const allOrdersResult = await this.checkoutService.getMyOrdersPaginated({
        page: 1,
        limit: 1000, // Get a large number to cover all orders
      });
      
      const allOrders = allOrdersResult.data;
      const completedOrders = allOrders.filter(o => o.status === 'PAID' || o.status === 'FULFILLED');
      const totalSpent = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      this.overallStats.set({
        totalOrders: allOrdersResult.meta.total,
        completedOrders: completedOrders.length,
        totalSpent: totalSpent,
      });
    } catch (error) {
      console.error('Failed to load overall stats:', error);
    }
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }

  async performSearch() {
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  async filterByStatus(status: StatusFilter) {
    if (this.currentStatus() === status) return; // Prevent unnecessary reloads
    this.currentStatus.set(status);
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  toggleSortDropdown() {
    this.showSortDropdown.update(v => !v);
  }

  async setSortOrder(order: SortOrder) {
    this.currentSortOrder.set(order);
    this.showSortDropdown.set(false);
    await this.loadOrders(false);
  }

  hasActiveFilters(): boolean {
    return this.searchQuery.length > 0 || this.currentStatus() !== 'ALL';
  }

  async clearFilters() {
    this.searchQuery = '';
    this.currentStatus.set('ALL');
    this.currentSortOrder.set('desc');
    this.meta.update(m => ({ ...m, page: 1 }));
    await this.loadOrders(false);
  }

  async goToPage(page: number) {
    if (page < 1 || page > this.meta().totalPages) return;
    this.meta.update(m => ({ ...m, page }));
    await this.loadOrders(false);
  }

  getVisiblePages(): (string | number)[] {
    const { page, totalPages } = this.meta();
    const pages: (string | number)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    
    return pages;
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
        return 'bg-[#68E079] text-[#111111]';
      case 'PENDING':
        return 'bg-[#FFC60B] text-[#111111]';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-[#FA4B28] text-white';
      case 'REFUNDED':
        return 'bg-[#2B57D6] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Paid';
      case 'FULFILLED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'FAILED':
        return 'Failed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REFUNDED':
        return 'Refunded';
      default:
        return status;
    }
  }
}
