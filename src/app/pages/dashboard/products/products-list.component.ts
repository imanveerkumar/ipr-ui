import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Product, Store } from '../../../core/models/index';
import { PaginationMeta, PaginatedResponse } from '../../../core/services/pagination.types';

type TabType = 'active' | 'archived' | 'bin';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-[#F9F4EB] border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div class="grid sm:grid-cols-3 grid-cols-1 items-center gap-4">
          <div class="flex items-center gap-2">
            <a routerLink="/dashboard" class="text-sm font-medium text-black/70 hover:text-black transition-colors">
              Dashboard
            </a>
            <svg class="w-4 h-4 text-black/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span class="text-sm font-bold text-black">Products</span>
          </div>

          <div class="flex justify-center">
            <h1 class="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-0">My Products</h1>
          </div>

          <div class="flex justify-end">
            <!-- Empty div for spacing -->
          </div>
        </div>

        <!-- Search Bar, Filter, and Add Product -->
        <div class="mt-6 flex items-center gap-3 flex-wrap">
          <div class="relative flex-1 min-w-0 max-w-full">
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
              placeholder="Search products..."
              class="w-full pl-10 md:pl-12 pr-3 py-2 md:py-3 bg-white border-2 border-black rounded-none text-[#111111] placeholder-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] focus:border-black shadow-[4px_4px_0px_0px_#000] text-sm md:text-base font-medium transition-all"
            />
          </div>

          <button
            (click)="toggleFilters()"
            class="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
            aria-label="Toggle filters"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <span class="hidden sm:inline">Filter</span>
          </button>

          <a routerLink="/dashboard/products/new" 
             class="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span class="hidden sm:inline">Add Product</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Filter Modal -->
    @if (showFilters()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="closeFiltersOnBackdrop($event)">
        <div class="bg-white border-2 border-black shadow-[8px_8px_0px_0px_#000] max-w-md w-full max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-black text-[#111111]">Filters</h3>
              <button
                (click)="toggleFilters()"
                class="w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-[#F9F4EB] transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="space-y-6">
              <!-- Status Filter -->
              <div>
                <label class="block text-sm font-bold text-[#111111] mb-3">Status</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="ALL"
                      [(ngModel)]="filterStatus"
                      class="w-4 h-4 text-[#FFC60B] border-2 border-black focus:ring-[#FFC60B]"
                    />
                    <span class="text-sm font-medium text-[#111111]">All Products</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="PUBLISHED"
                      [(ngModel)]="filterStatus"
                      class="w-4 h-4 text-[#FFC60B] border-2 border-black focus:ring-[#FFC60B]"
                    />
                    <span class="text-sm font-medium text-[#111111]">Live</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="DRAFT"
                      [(ngModel)]="filterStatus"
                      class="w-4 h-4 text-[#FFC60B] border-2 border-black focus:ring-[#FFC60B]"
                    />
                    <span class="text-sm font-medium text-[#111111]">Draft</span>
                  </label>
                </div>
              </div>

              <!-- Store Filter -->
              <div class="relative">
                <label class="block text-sm font-bold text-[#111111] mb-3">Store</label>
                <!-- Dropdown Trigger -->
                <div
                  (click)="toggleStoreDropdown()"
                  class="w-full px-3 py-2 bg-white border-2 border-black text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFC60B] shadow-[2px_2px_0px_0px_#000] text-sm font-medium cursor-pointer min-h-[40px] flex items-center justify-between"
                  [class.focus\:ring-2]="showStoreDropdown()"
                  [class.focus\:ring-\[#FFC60B\]]="showStoreDropdown()"
                >
                  <div class="flex flex-wrap gap-1">
                    @if (filterStoreIds().length === 0) {
                      <span class="text-[#111111]/50">Select stores...</span>
                    } @else {
                      @for (store of getSelectedStores(); track store.id) {
                        <span class="inline-flex items-center gap-1 px-2 py-1 bg-[#FFC60B] text-[#111111] text-xs font-bold border border-black">
                          {{ store.name }}
                          <button
                            (click)="removeStore(store.id); $event.stopPropagation()"
                            class="hover:bg-[#111111]/20 p-0.5"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </span>
                      }
                    }
                  </div>
                  <svg
                    class="w-4 h-4 text-[#111111] transition-transform"
                    [class.rotate-180]="showStoreDropdown()"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>

                <!-- Dropdown Options -->
                @if (showStoreDropdown()) {
                  <div class="absolute z-10 w-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] max-h-48 overflow-y-auto">
                    @if (storesLoading()) {
                      <!-- Skeleton Loading -->
                      @for (i of [1,2,3]; track i) {
                        <div class="px-3 py-2 flex items-center gap-3 border-b border-black/10 last:border-b-0">
                          <div class="w-4 h-4 bg-[#F9F4EB] border-2 border-black rounded animate-shimmer" aria-hidden="true"></div>
                          <div class="flex-1 h-4 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                        </div>
                      }
                    } @else if (stores().length === 0) {
                      <div class="px-3 py-2 text-sm text-[#111111]/60 font-medium">
                        No stores found
                      </div>
                    } @else {
                      @for (store of stores(); track store.id) {
                        <div
                          (click)="toggleStoreSelection(store.id)"
                          class="px-3 py-2 hover:bg-[#F9F4EB] cursor-pointer flex items-center gap-3 border-b border-black/10 last:border-b-0"
                        >
                          <div class="w-4 h-4 border-2 border-black flex items-center justify-center"
                               [class.bg-\[#FFC60B\]]="isStoreSelected(store.id)">
                            @if (isStoreSelected(store.id)) {
                              <svg class="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            }
                          </div>
                          <span class="text-sm font-medium text-[#111111]">{{ store.name }}</span>
                        </div>
                      }
                    }
                  </div>
                }
              </div>

              <!-- Future filters can be added here -->
              <div class="border-t border-black/20 pt-4">
                <p class="text-xs text-[#111111]/60 font-medium">More filters coming soon...</p>
              </div>
            </div>

            <div class="flex gap-3 mt-8">
              <button
                (click)="resetFilters()"
                class="flex-1 px-4 py-2 bg-white border-2 border-black text-[#111111] font-bold hover:bg-[#F9F4EB] transition-colors"
              >
                Reset
              </button>
              <button
                (click)="applyFilters()"
                class="flex-1 px-4 py-2 bg-[#FFC60B] border-2 border-black text-[#111111] font-bold hover:bg-[#ffdb4d] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Tabs Section -->
    <section class="bg-white border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center gap-0 overflow-x-auto -mb-[2px]">
          <button 
            (click)="switchTab('active')"
            [class]="currentTab() === 'active' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#68E079] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Active
            @if (!statsLoading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#68E079] text-[#111111]">{{ tabCounts().active }}</span>
            } @else {
              <span class="ml-1.5 inline-block w-6 h-4 rounded-full bg-[#F9F4EB] animate-shimmer" aria-hidden="true"></span>
            }
          </button>
          
          <button 
            (click)="switchTab('archived')"
            [class]="currentTab() === 'archived' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FFC60B] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Archived
            @if (!statsLoading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FFC60B] text-[#111111]">{{ tabCounts().archived }}</span>
            } @else {
              <span class="ml-1.5 inline-block w-6 h-4 rounded-full bg-[#F9F4EB] animate-shimmer" aria-hidden="true"></span>
            }
          </button>
          
          <button 
            (click)="switchTab('bin')"
            [class]="currentTab() === 'bin' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FA4B28] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Bin
            @if (!statsLoading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FA4B28] text-white">{{ tabCounts().bin }}</span>
            } @else {
              <span class="ml-1.5 inline-block w-6 h-4 rounded-full bg-[#F9F4EB] animate-shimmer" aria-hidden="true"></span>
            }
          </button>
        </div>
      </div>
    </section>

    @if (currentTab() === 'active') {
      @if (statsLoading()) {
        <section class="bg-white border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                <div class="w-24 h-5 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                <div class="w-20 h-5 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                <div class="w-16 h-5 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
              </div>
            </div>
          </div>
        </section>
      } @else {
        <section class="bg-white border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#111111]">{{ stats().total }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Total Products</span>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#68E079]">{{ stats().published }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Published</span>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#FFC60B]">{{ stats().drafts }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Drafts</span>
              </div>
            </div>
          </div>
        </section>
      }
    }

    <!-- Bulk Actions Bar -->
    @if (selectedIds().length > 0) {
      <section class="fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
          <div class="bg-[#FFC60B] text-[#111111] shadow-[4px_4px_0px_0px_#000] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto relative">
            <div class="flex items-center gap-3">
              <!-- Desktop clear button -->
              <button (click)="clearSelection()" class="hidden sm:inline-flex w-8 h-8 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-white text-[#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <!-- Mobile absolute clear button (top-right) -->
              <button (click)="clearSelection()" class="sm:hidden absolute top-3 right-3 w-8 h-8 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_#000] bg-white text-[#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <span class="text-[#111111] font-bold">{{ selectedIds().length }} selected</span>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              @if (currentTab() === 'active') {
                <button (click)="bulkArchive()" class="px-3 py-1.5 text-sm font-bold bg-[#FFC60B] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#e5b00a] transition-all">
                  Archive
                </button>
                <button (click)="bulkDelete()" class="px-3 py-1.5 text-sm font-bold bg-[#fa4b28] text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#e63d1e] transition-all">
                  Delete
                </button>
              }
              @if (currentTab() === 'archived') {
                <button (click)="bulkUnarchive()" class="px-3 py-1.5 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#52c963] transition-all">
                  Unarchive
                </button>
                <button (click)="bulkDelete()" class="px-3 py-1.5 text-sm font-bold bg-[#fa4b28] text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#e63d1e] transition-all">
                  Delete
                </button>
              }
              @if (currentTab() === 'bin') {
                <button (click)="bulkRestore()" class="px-3 py-1.5 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#52c963] transition-all">
                  Restore
                </button>
              }
            </div>
          </div>
        </div>
      </section>
    }

    <!-- Content Section -->
    <section class="bg-[#F9F4EB] min-h-[60vh]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        @if (loading()) {
          <!-- Controls Skeleton (Select all + Sort) -->
          <div class="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
              <div class="h-4 w-28 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
            </div>

            <div class="flex items-center gap-2">
              <div class="h-10 w-36 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
              <div class="h-10 w-10 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Loading Skeleton (Gallery / List based on view) -->
          @if (viewMode() === 'gallery') {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="relative bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                  <!-- Reserve checkbox space to avoid layout shift when items load -->
                  <div class="absolute top-3 left-3 z-10">
                    <div class="w-5 h-5 bg-[#F9F4EB] border-2 border-black animate-shimmer" aria-hidden="true"></div>
                  </div>

                  <div class="h-44 sm:h-48 bg-[#F9F4EB] animate-shimmer" aria-hidden="true"></div>
                  <div class="p-4 sm:p-5">
                    <div class="h-5 w-3/4 bg-[#F9F4EB] animate-shimmer rounded mb-2" aria-hidden="true"></div>
                    <div class="h-4 w-1/2 bg-[#F9F4EB] animate-shimmer rounded mb-4" aria-hidden="true"></div>
                    <div class="flex justify-between items-center">
                      <div class="h-6 w-20 bg-[#F9F4EB] animate-shimmer rounded" aria-hidden="true"></div>
                      <div class="h-4 w-12 bg-[#F9F4EB] animate-shimmer rounded" aria-hidden="true"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="bg-white border-2 border-black">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="flex items-center gap-4 px-3 py-3 border-b border-black last:border-b-0">
                  <div class="flex-shrink-0 ml-1">
                    <div class="w-5 h-5 bg-[#F9F4EB] border-2 border-black animate-shimmer" aria-hidden="true"></div>
                  </div>

                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9F4EB] flex items-center justify-center overflow-hidden rounded-sm flex-shrink-0 animate-shimmer" aria-hidden="true"></div>

                  <div class="flex-1 min-w-0 py-1">
                    <div class="h-5 w-1/3 bg-[#F9F4EB] rounded mb-2 animate-shimmer" aria-hidden="true"></div>
                    <div class="h-4 w-1/4 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                  </div>

                  <div class="flex items-center gap-4 ml-4">
                    <div class="h-5 w-12 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                    <div class="h-4 w-12 bg-[#F9F4EB] rounded animate-shimmer" aria-hidden="true"></div>
                  </div>
                </div>
              }
            </div>
          }
        } @else if (currentProducts().length === 0) {
          <!-- Empty State -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-8 sm:p-12 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-[#F9F4EB] border-2 border-black flex items-center justify-center mb-6">
              @if (currentTab() === 'active') {
                <svg class="w-12 h-12 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              } @else if (currentTab() === 'archived') {
                <svg class="w-12 h-12 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
                </svg>
              } @else {
                <svg class="w-12 h-12 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              }
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-[#111111] mb-2">
              @if (currentTab() === 'active') {
                {{ searchQuery() ? 'No products found' : 'No products yet' }}
              } @else if (currentTab() === 'archived') {
                {{ searchQuery() ? 'No archived products found' : 'No archived products' }}
              } @else {
                {{ searchQuery() ? 'No deleted products found' : 'Bin is empty' }}
              }
            </h3>
            <div class="text-[#111111]/70 font-medium mb-6 max-w-md">
              {{ emptyStateMessage() }}
            </div>
            @if (currentTab() === 'active' && !searchQuery()) {
              <a routerLink="/dashboard/products/new" 
                 class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Your First Product
              </a>
            }
          </div>
        } @else {
          <!-- Products Grid -->
          <div class="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <label class="group relative inline-flex items-center cursor-pointer">
                <input type="checkbox"
                       [checked]="isAllSelected()"
                       (change)="toggleSelectAll($event)"
                       class="sr-only">
                <div class="w-8 h-8 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                  @if (isAllSelected()) {
                    <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  }
                </div>
                <span class="ml-2 hidden sm:inline text-sm font-bold text-[#111111]">Select all</span>

                <!-- Tooltip note -->
                <div class="absolute top-full left-0 mt-2 w-[18rem] bg-white border-2 border-black p-2 text-sm text-[#111111] shadow-[4px_4px_0px_0px_#000] z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                  Select all products on this page. Use bulk actions to manage multiple items at once.
                </div>
              </label>
            </div>

            <!-- Sort Dropdown -->
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-[#111111]">Sort:</span>
              <select
                [(ngModel)]="sortField"
                (change)="onSortChange()"
                class="px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFC60B] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                <option value="createdAt">Newest</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
              <button
                (click)="toggleSortOrder()"
                class="p-2 bg-white border-2 border-black rounded-lg hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-[2px_2px_0px_0px_#000]"
                [title]="sortOrder() === 'asc' ? 'Ascending' : 'Descending'"
              >
                @if (sortOrder() === 'asc') {
                  <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                } @else {
                  <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                }
              </button>

              <!-- View Mode Selector -->
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-[#111111]">View:</span>
                <select
                  [ngModel]="viewMode()"
                  (ngModelChange)="setViewMode($event)"
                  class="px-3 py-2 bg-white border-2 border-black rounded-lg font-bold text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFC60B] shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  <option value="gallery">Gallery</option>
                  <option value="list">List</option>
                </select>
              </div>
            </div>
          </div>
@if (viewMode() === 'gallery') {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              @for (product of currentProducts(); track product.id) {
                <div class="relative bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                  
                  <!-- Selection Checkbox -->
                  <div class="absolute top-3 left-3 z-10">
                    <label class="relative cursor-pointer">
                      <input type="checkbox"
                        [checked]="isSelected(product.id)"
                        (change)="toggleSelection(product.id, $event)"
                        class="peer sr-only">
                      <div class="w-5 h-5 bg-white border-2 border-black peer-checked:bg-[#FFC60B] flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_#000]">
                        @if (isSelected(product.id)) {
                          <svg class="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        }
                      </div>
                    </label>
                  </div>

                  <a [routerLink]="currentTab() === 'active' ? ['/dashboard/products', product.id] : null" 
                     [class.pointer-events-none]="currentTab() !== 'active'"
                     class="block">
                    <!-- Product Image -->
                    <div class="relative h-44 sm:h-48 border-b-2 border-black overflow-hidden bg-[#F9F4EB]">
                      @if (product.coverImageUrl) {
                        <img [src]="product.coverImageUrl" [alt]="product.title" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="w-12 h-12 text-black/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      }
                      
                      <!-- Status Badge -->
                      @if (currentTab() === 'active') {
                        @if (product.status === 'PUBLISHED') {
                          <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#68E079] text-[#111111] border-2 border-black">
                            Live
                          </span>
                        } @else {
                          <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FFC60B] text-[#111111] border-2 border-black">
                            Draft
                          </span>
                        }
                      } @else if (currentTab() === 'archived') {
                        <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FFC60B] text-[#111111] border-2 border-black">
                          Archived
                        </span>
                      } @else {
                        <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FA4B28] text-white border-2 border-black">
                          Deleted
                        </span>
                      }
                    </div>
                    
                    <!-- Content -->
                    <div class="p-4 sm:p-5">
                      <h3 class="text-base sm:text-lg font-bold text-[#111111] mb-1 truncate">{{ product.title }}</h3>
                      <p class="text-sm text-[#111111]/60 font-medium mb-4">{{ product.store?.name || 'No store' }}</p>
                      
                      <div class="flex items-center justify-between">
                        <span class="text-lg sm:text-xl font-black text-[#111111]">₹{{ product.price / 100 }}</span>
                        
                        @if (currentTab() === 'active') {
                          <span class="inline-flex items-center gap-1 text-sm font-bold text-[#111111]/70 group-hover:text-[#2B57D6] transition-colors">
                            Edit
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                          </span>
                        }
                      </div>
                    </div>
                  </a>
                  
                  <!-- Action Buttons for Archived/Deleted -->
                  @if (currentTab() !== 'active') {
                    <div class="px-4 sm:px-5 pb-4 sm:pb-5 flex gap-2">
                      @if (currentTab() === 'archived') {
                        <button 
                          (click)="unarchiveProduct(product)"
                          class="flex-1 py-2 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black hover:bg-[#5bc96a] transition-colors">
                          Unarchive
                        </button>
                        <button 
                          (click)="deleteProduct(product)"
                          class="flex-1 py-2 text-sm font-bold bg-white text-[#FA4B28] border-2 border-black hover:bg-[#FFF5F5] transition-colors">
                          Delete
                        </button>
                      } @else {
                        <button 
                          (click)="restoreProduct(product)"
                          class="flex-1 py-2 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black hover:bg-[#5bc96a] transition-colors">
                          Restore
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              </div>
            } @if (viewMode() === 'list') {
              <div class="bg-white border-2 border-black">
                @for (product of currentProducts(); track product.id) {
                  <div class="flex items-center gap-4 px-3 py-3 border-b border-black last:border-b-0">

                    <!-- Selection Checkbox -->
                    <div class="flex-shrink-0 ml-1">
                      <label class="relative">
                        <input type="checkbox"
                          [checked]="isSelected(product.id)"
                          (change)="toggleSelection(product.id, $event)"
                          class="peer sr-only">
                        <div class="w-5 h-5 bg-white border-2 border-black peer-checked:bg-[#FFC60B] flex items-center justify-center transition-colors">
                          @if (isSelected(product.id)) {
                            <svg class="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          }
                        </div>
                      </label>
                    </div>

                    <!-- Compact Thumbnail -->
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9F4EB] flex items-center justify-center overflow-hidden rounded-sm flex-shrink-0">
                      @if (product.coverImageUrl) {
                        <img [src]="product.coverImageUrl" [alt]="product.title" class="w-full h-full object-cover">
                      } @else {
                        <svg class="w-8 h-8 text-black/20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      }
                    </div>

                    <!-- Details -->
                    <div class="flex-1 min-w-0 py-1">
                      <h3 class="text-base sm:text-lg font-bold text-[#111111] truncate">{{ product.title }}</h3>
                      <p class="text-sm text-[#111111]/60 font-medium">{{ product.store?.name || 'No store' }}</p>
                    </div>

                    <!-- Price & Actions -->
                    <div class="flex items-center gap-4 ml-4">
                      <div class="text-base sm:text-lg font-black text-[#111111]">₹{{ product.price / 100 }}</div>
                      @if (currentTab() === 'active') {
                        <a [routerLink]="['/dashboard/products', product.id]" class="text-sm font-bold text-[#111111]/70">Edit</a>
                      }
                    </div>
                  </div>
                }
              </div>
            }

          <!-- Pagination -->
          @if (meta().totalPages > 1) {
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-sm text-[#111111]/60 font-medium">
                Showing {{ ((meta().page - 1) * meta().limit) + 1 }} - {{ getEndIndex() }} of {{ meta().total }} products
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
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  private storeService = inject(StoreService);
  private confirmService = inject(ConfirmService);
  private toaster = inject(ToasterService);

  activeProducts = signal<Product[]>([]);
  archivedProducts = signal<Product[]>([]);
  deletedProducts = signal<Product[]>([]);
  loading = signal(true);
  currentTab = signal<TabType>('active');
  selectedIds = signal<string[]>([]);
  statsLoading = signal(true);

  // Pagination and search signals
  searchQuery = signal('');
  sortField = signal<string>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  viewMode = signal<'gallery' | 'list'>('gallery');
  currentPage = signal(1);
  pageSize = signal(12);
  meta = signal<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  stats = signal({ total: 0, published: 0, drafts: 0 });
  tabCounts = signal({ active: 0, archived: 0, bin: 0 });
  private searchTimeout: any;

  // Filter signals
  showFilters = signal(false);
  showStoreDropdown = signal(false);
  filterStatus = signal<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  filterStoreIds = signal<string[]>([]);
  stores = signal<any[]>([]);
  storesLoading = signal(false);

  currentProducts = computed(() => {
    switch (this.currentTab()) {
      case 'archived': return this.archivedProducts();
      case 'bin': return this.deletedProducts();
      default: return this.activeProducts();
    }
  });

  async ngOnInit() {
    // Restore preferred view from localStorage if available
    const saved = (() => {
      try { return localStorage.getItem('dashboardProductsView'); } catch (e) { return null; }
    })();
    if (saved === 'list' || saved === 'gallery') {
      this.viewMode.set(saved as any);
    }

    // Load products (loadProducts will refresh stats once) — avoid duplicate stats call
    await this.loadProducts();
  }

  async loadStats() {
    // If suppression flag is set (e.g., from a sort change), skip a network call and reset flag
    if (this.suppressStats) { this.suppressStats = false; return; }

    this.statsLoading.set(true);
    try {
      const params: any = {
        search: this.searchQuery() || undefined,
        status: this.filterStatus() !== 'ALL' ? this.filterStatus() : undefined,
        storeIds: this.filterStoreIds().length > 0 ? this.filterStoreIds() : undefined,
      };

      const result = await this.productService.getMyStats(params);

      // Update tab counts and stats based on server response (which respects filters)
      this.tabCounts.set({
        active: result.tabs.active,
        archived: result.tabs.archived,
        bin: result.tabs.bin,
      });

      this.stats.set({
        total: result.total,
        published: result.published,
        drafts: result.drafts,
      });
    } catch (error) {
      // Fallback to 0
      this.tabCounts.set({ active: 0, archived: 0, bin: 0 });
      this.stats.set({ total: 0, published: 0, drafts: 0 });
    } finally {
      this.statsLoading.set(false);
    }
  }

  async loadProducts(skipStats: boolean = false) {
    this.loading.set(true);
    try {
      const params = {
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchQuery(),
        sortField: this.sortField(),
        sortOrder: this.sortOrder(),
        status: this.filterStatus() !== 'ALL' ? this.filterStatus() : undefined,
        storeIds: this.filterStoreIds().length > 0 ? this.filterStoreIds() : undefined
      };

      let response: PaginatedResponse<Product>;

      switch (this.currentTab()) {
        case 'archived':
          response = await this.productService.getMyArchivedProductsPaginated(params);
          this.archivedProducts.set(response.data);
          break;
        case 'bin':
          response = await this.productService.getMyDeletedProductsPaginated(params);
          this.deletedProducts.set(response.data);
          break;
        default:
          response = await this.productService.getMyProductsPaginated(params);
          this.activeProducts.set(response.data);
          break;
      }

      this.meta.set(response.meta);

      // Refresh stats after loading products so counts respect current filters
      if (!skipStats) await this.loadStats();
    } catch (error) {
      this.toaster.error('Failed to load products');
    } finally {
      this.loading.set(false);
    }
  }

  // Keep the old method for backward compatibility with bulk operations
  async loadAllProducts() {
    this.loading.set(true);
    try {
      const [active, archived, deleted] = await Promise.all([
        this.productService.getMyProducts(),
        this.productService.getMyArchivedProducts(),
        this.productService.getMyDeletedProducts(),
      ]);
      this.activeProducts.set(active);
      this.archivedProducts.set(archived);
      this.deletedProducts.set(deleted);
    } catch (error) {
      this.toaster.error('Failed to load products');
    } finally {
      this.loading.set(false);
    }
  }

  // Suppress stats network call for certain actions (e.g., sorting)
  private suppressStats = false;

  switchTab(tab: TabType) {
    this.currentTab.set(tab);
    this.clearSelection();
    this.currentPage.set(1);
    // Tab switch shouldn't refresh stats — pass skipStats to avoid the extra network call
    this.loadProducts(true);
  }

  onSearchInput() {
    // Debounce search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.loadProducts();
    }, 300);
  }

  performSearch() {
    this.currentPage.set(1);
    this.loadProducts();
  }

  toggleFilters() {
    const isOpening = !this.showFilters();
    this.showFilters.set(isOpening);
    this.showStoreDropdown.set(false); // Close store dropdown when main modal opens/closes
    
    if (isOpening) {
      this.loadStores();
    }
  }

  closeFiltersOnBackdrop(event: Event) {
    if (event.target === event.currentTarget) {
      this.showFilters.set(false);
      this.showStoreDropdown.set(false);
    }
  }

  applyFilters() {
    this.currentPage.set(1);
    this.loadProducts();
    this.showFilters.set(false);
    this.showStoreDropdown.set(false);
  }

  resetFilters() {
    this.filterStatus.set('ALL');
    this.filterStoreIds.set([]);
    this.currentPage.set(1);
    this.loadProducts();
    this.showFilters.set(false);
    this.showStoreDropdown.set(false);
  }

  async loadStores() {
    this.storesLoading.set(true);
    try {
      const stores = await this.storeService.getMyStores();
      this.stores.set(stores);
    } catch (error) {
      this.toaster.error('Failed to load stores');
    } finally {
      this.storesLoading.set(false);
    }
  }

  toggleStoreDropdown() {
    this.showStoreDropdown.set(!this.showStoreDropdown());
  }

  toggleStoreSelection(storeId: string) {
    const current = this.filterStoreIds();
    if (current.includes(storeId)) {
      this.filterStoreIds.set(current.filter(id => id !== storeId));
    } else {
      this.filterStoreIds.set([...current, storeId]);
    }
  }

  isStoreSelected(storeId: string): boolean {
    return this.filterStoreIds().includes(storeId);
  }

  removeStore(storeId: string) {
    this.filterStoreIds.set(this.filterStoreIds().filter(id => id !== storeId));
  }

  getSelectedStores() {
    const selectedIds = this.filterStoreIds();
    return this.stores().filter(store => selectedIds.includes(store.id));
  }

  onSortChange() {
    this.currentPage.set(1);
    // Prevent stats network call for this action
    this.suppressStats = true;
    this.loadProducts(true);
  }

  toggleSortOrder() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    this.currentPage.set(1);
    // Prevent stats network call for this action
    this.suppressStats = true;
    this.loadProducts(true);
  }

  setViewMode(mode: 'gallery' | 'list') {
    this.viewMode.set(mode);
    try { localStorage.setItem('dashboardProductsView', mode); } catch (e) { /* ignore */ }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.meta().totalPages) {
      this.currentPage.set(page);
      this.loadProducts();
      // Scroll to top of products
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getVisiblePages(): (number | string)[] {
    const current = this.meta().page;
    const total = this.meta().totalPages;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 4) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 3) {
        pages.push('...');
      }

      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  }

  emptyStateMessage = computed(() => {
    if (this.currentTab() === 'active') {
      return this.searchQuery() ? 'Try adjusting your search terms or filters' : 'Create your first digital product and start selling to customers worldwide.';
    } else if (this.currentTab() === 'archived') {
      return this.searchQuery() ? 'Try adjusting your search terms' : 'Products you archive will appear here. They won\'t be visible to customers.';
    } else {
      return this.searchQuery() ? 'Try adjusting your search terms' : 'Deleted products will appear here. You can restore them at any time.';
    }
  });

  getEndIndex(): number {
    return Math.min(this.meta().page * this.meta().limit, this.meta().total);
  }

  // Selection methods
  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  isAllSelected(): boolean {
    const items = this.currentProducts();
    return items.length > 0 && items.every(p => this.selectedIds().includes(p.id));
  }

  toggleSelection(id: string, event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    const current = this.selectedIds();
    if (current.includes(id)) {
      this.selectedIds.set(current.filter(i => i !== id));
    } else {
      this.selectedIds.set([...current, id]);
    }
  }

  toggleSelectAll(event: Event) {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.isAllSelected()) {
      this.clearSelection();
    } else {
      const ids = this.currentProducts().map(p => p.id);
      this.selectedIds.set(ids);
    }
  }

  clearSelection() {
    this.selectedIds.set([]);
  }

  // Single product actions
  async archiveProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Archive Product',
      message: `Are you sure you want to archive "${product.title}"? It will be hidden from customers.`,
      confirmText: 'Archive',
      cancelText: 'Cancel',
      accent: 'yellow',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.archiveProduct(product.id);
      this.toaster.success({ title: 'Product Archived', message: 'The product has been archived.' });
      await this.loadAllProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to archive product');
      this.confirmService.setPending(false);
    }
  }

  async unarchiveProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Unarchive Product',
      message: `Are you sure you want to unarchive "${product.title}"? It will be visible to customers again.`,
      confirmText: 'Unarchive',
      cancelText: 'Cancel',
      accent: 'yellow',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.unarchiveProduct(product.id);
      this.toaster.success({ title: 'Product Restored', message: 'The product is now active.' });
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to unarchive product');
      this.confirmService.setPending(false);
    }
  }

  async deleteProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.title}"? You can restore it from the Bin later.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      accent: 'danger',
      confirmColor: 'danger',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.deleteProduct(product.id);
      this.toaster.success({ title: 'Product Deleted', message: 'The product has been moved to Bin.' });
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to delete product');
      this.confirmService.setPending(false);
    }
  }

  async restoreProduct(product: Product) {
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Product',
      message: `Are you sure you want to restore "${product.title}"? You can move it back to Active.`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow',
      waitForCompletion: true,
    });

    if (!confirmed) return;

    try {
      await this.productService.restoreProduct(product.id);
      this.toaster.success({ title: 'Product Restored', message: 'The product is now active.' });
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to restore product');
      this.confirmService.setPending(false);
    }
  }

  // Bulk actions
  async bulkArchive() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Archive Products',
      message: `Are you sure you want to archive ${count} product${count > 1 ? 's' : ''}?`,
      confirmText: 'Archive',
      cancelText: 'Cancel',
      accent: 'yellow',
    });

    if (!confirmed) return;

    try {
      await this.productService.bulkArchiveProducts(this.selectedIds());
      this.toaster.success({ title: 'Products Archived', message: `${count} product${count > 1 ? 's' : ''} archived.` });
      this.clearSelection();
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to archive products');
      this.confirmService.setPending(false);
    }
  }

  async bulkUnarchive() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Products',
      message: `Are you sure you want to restore ${count} product${count > 1 ? 's' : ''}?`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow',
    });

    if (!confirmed) return;

    try {
      // Unarchive one by one since there's no bulk unarchive
      for (const id of this.selectedIds()) {
        await this.productService.unarchiveProduct(id);
      }
      this.toaster.success({ title: 'Products Restored', message: `${count} product${count > 1 ? 's' : ''} restored.` });
      this.clearSelection();
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to unarchive products');
      this.confirmService.setPending(false);
    }
  }

  async bulkDelete() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Products',
      message: `Are you sure you want to delete ${count} product${count > 1 ? 's' : ''}? You can restore them from the Bin.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      accent: 'danger',
      confirmColor: 'danger',
    });

    if (!confirmed) return;

    try {
      await this.productService.bulkDeleteProducts(this.selectedIds());
      this.toaster.success({ title: 'Products Deleted', message: `${count} product${count > 1 ? 's' : ''} moved to Bin.` });
      this.clearSelection();
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to delete products');
      this.confirmService.setPending(false);
    }
  }

  async bulkRestore() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Products',
      message: `Are you sure you want to restore ${count} product${count > 1 ? 's' : ''}?`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow',
    });

    if (!confirmed) return;

    try {
      await this.productService.bulkRestoreProducts(this.selectedIds());
      this.toaster.success({ title: 'Products Restored', message: `${count} product${count > 1 ? 's' : ''} restored.` });
      this.clearSelection();
      await this.loadStats();
      await this.loadProducts();
      this.confirmService.finish(true);
    } catch (error) {
      this.toaster.error('Failed to restore products');
      this.confirmService.setPending(false);
    }
  }
}
