import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToasterService } from '../../../core/services/toaster.service';

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

    <!-- Tabs Section -->
    <section class="bg-white border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex items-center gap-0 overflow-x-auto">
          <button (click)="setActiveTab('active')"
            [class]="activeTab() === 'active' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#68E079] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Active
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#68E079] text-[#111111]">{{ activeStores().length }}</span>
            }
          </button>
          <button (click)="setActiveTab('archived')"
            [class]="activeTab() === 'archived' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FFC60B] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Archived
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FFC60B] text-[#111111]">{{ archivedStores().length }}</span>
            }
          </button>
          <button (click)="setActiveTab('deleted')"
            [class]="activeTab() === 'deleted' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FA4B28] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Bin
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FA4B28] text-white">{{ deletedStores().length }}</span>
            }
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Bar (only for active tab) -->
    @if (activeTab() === 'active') {
      @if (loading()) {
        <section class="bg-white border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
                <div class="w-24 h-5 bg-black/10 rounded animate-pulse"></div>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
                <div class="w-20 h-5 bg-black/10 rounded animate-pulse"></div>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
                <div class="w-16 h-5 bg-black/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      } @else if (activeStores().length > 0) {
        <section class="bg-white border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#111111]">{{ activeStores().length }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Total Stores</span>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#68E079]">{{ getPublishedCount() }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Published</span>
              </div>
              <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#FFC60B]">{{ getDraftCount() }}</span>
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
              @if (activeTab() === 'active') {
                <button (click)="bulkArchive()" 
                  class="px-3 py-1.5 bg-[#FFC60B] text-[#111111] font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e5b00a] transition-all">
                  Archive
                </button>
                <button (click)="bulkDelete()" 
                  class="px-3 py-1.5 bg-[#fa4b28] text-white font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e53e1e] transition-all">
                  Delete
                </button>
              }
              @if (activeTab() === 'archived') {
                <button (click)="bulkUnarchive()" 
                  class="px-3 py-1.5 bg-[#68E079] text-[#111111] font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#52c963] transition-all">
                  Unarchive
                </button>
                <button (click)="bulkDelete()" 
                  class="px-3 py-1.5 bg-[#fa4b28] text-white font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e53e1e] transition-all">
                  Delete
                </button>
              }
              @if (activeTab() === 'deleted') {
                <button (click)="bulkRestore()" 
                  class="px-3 py-1.5 bg-[#68E079] text-[#111111] font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] hover:bg-[#52c963] transition-all">
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
        } @else if (currentStores().length === 0) {
          <!-- Empty State -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-8 sm:p-12 flex flex-col items-center text-center">
            @if (activeTab() === 'active') {
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
            } @else if (activeTab() === 'archived') {
              <div class="w-20 h-20 bg-[#FFC60B]/20 border-2 border-black flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#111111] mb-2">No archived stores</h3>
              <p class="text-[#111111]/70 font-medium max-w-sm">Archived stores will appear here</p>
            } @else {
              <div class="w-20 h-20 bg-[#FA4B28]/20 border-2 border-black flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#111111] mb-2">Bin is empty</h3>
              <p class="text-[#111111]/70 font-medium max-w-sm">Deleted stores will appear here for 30 days before permanent deletion</p>
            }
          </div>
        } @else {
          <!-- Stores Grid -->
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
                <span class="ml-2 inline text-sm font-bold text-[#111111]">Select all</span>

                <!-- Tooltip note -->
                <div class="absolute top-full left-0 mt-2 w-[18rem] bg-white border-2 border-black p-2 text-sm text-[#111111] shadow-[4px_4px_0px_0px_#000] z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                  Select all stores on this page. Use bulk actions to manage multiple items at once.
                </div>
              </label>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            @for (store of currentStores(); track store.id) {
              <div class="relative bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
                <!-- Selection Checkbox -->
                <div class="absolute top-3 left-3 z-10">
                  <label class="relative cursor-pointer">
                    <input type="checkbox" 
                      [checked]="selectedIds().includes(store.id)"
                      (change)="toggleSelection(store.id)"
                      class="peer sr-only">
                    <div class="w-5 h-5 bg-white border-2 border-black peer-checked:bg-[#FFC60B] flex items-center justify-center transition-colors shadow-[2px_2px_0px_0px_#000]">
                      @if (selectedIds().includes(store.id)) {
                        <svg class="w-3 h-3 text-[#111111]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      }
                    </div>
                  </label>
                </div>

                <!-- State Badge -->
                @if (activeTab() === 'archived') {
                  <div class="absolute top-3 right-3 z-10">
                    <span class="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FFC60B] text-[#111111] border-2 border-black">
                      Archived
                    </span>
                  </div>
                } @else if (activeTab() === 'deleted') {
                  <div class="absolute top-3 right-3 z-10">
                    <span class="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FA4B28] text-white border-2 border-black">
                      Deleted
                    </span>
                  </div>
                }

                <!-- Banner -->
                <div class="relative">
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
                </div>
                
                <!-- Content -->
                <div class="p-4 sm:p-5">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="text-base sm:text-lg font-bold text-[#111111] leading-tight">{{ store.name }}</h3>
                    
                    @if (activeTab() === 'active') {
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
                    }
                  </div>
                  
                  <!-- Store URL -->
                  <div class="mb-4">
                    @if (store.status === 'PUBLISHED' && activeTab() === 'active') {
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
                    
                    <!-- Actions based on tab -->
                    @if (activeTab() === 'active') {
                      <a [routerLink]="['/dashboard/stores', store.id]" 
                         class="inline-flex items-center gap-1 text-sm font-bold text-[#111111] group-hover:text-[#2B57D6] transition-colors">
                        Manage
                      </a>
                    } @else if (activeTab() === 'archived') {
                      <!-- Top-right actions intentionally empty; use quick actions below -->
                    }

                  </div>

                  <!-- Quick Actions Row -->
                  @if (activeTab() === 'active') {
                    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-black/10">
                      <button (click)="archiveStore(store)" 
                        class="flex-1 py-1.5 text-sm font-bold bg-[#FFC60B] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e5b00a] transition-all flex items-center justify-center">
                        Archive
                      </button>
                      <button (click)="deleteStore(store)" 
                        class="flex-1 py-1.5 text-sm font-bold bg-[#FA4B28] text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e53e1e] transition-all flex items-center justify-center">
                        Delete
                      </button>
                    </div>
                  } @else if (activeTab() === 'archived') {
                    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-black/10">
                      <button (click)="unarchiveStore(store)" 
                        class="flex-1 py-1.5 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#52c963] transition-all flex items-center justify-center">
                        Unarchive
                      </button>
                      <button (click)="deleteStore(store)" 
                        class="flex-1 py-1.5 text-sm font-bold bg-[#fa4b28] text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#e53e1e] transition-all flex items-center justify-center">
                        Delete
                      </button>
                    </div>
                  } @else if (activeTab() === 'deleted') {
                    <div class="flex items-center gap-2 mt-3 pt-3 border-t border-black/10">
                      <button (click)="restoreStore(store)" 
                        class="flex-1 py-1.5 text-sm font-bold bg-[#68E079] text-[#111111] border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#52c963] transition-all flex items-center justify-center">
                        Restore
                      </button>
                    </div>
                  }
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
  activeStores = signal<Store[]>([]);
  archivedStores = signal<Store[]>([]);
  deletedStores = signal<Store[]>([]);
  loading = signal(true);
  activeTab = signal<'active' | 'archived' | 'deleted'>('active');
  selectedIds = signal<string[]>([]);
  
  storeService = inject(StoreService);
  private confirmService = inject(ConfirmService);
  private toaster = inject(ToasterService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentStores = computed(() => {
    switch (this.activeTab()) {
      case 'archived': return this.archivedStores();
      case 'deleted': return this.deletedStores();
      default: return this.activeStores();
    }
  });

  async ngOnInit() {
    // Check for tab query param
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'archived' || tabParam === 'deleted') {
      this.activeTab.set(tabParam);
    }

    await this.loadStores();
  }

  async loadStores() {
    this.loading.set(true);
    try {
      const [active, archived, deleted] = await Promise.all([
        this.storeService.getMyStores(),
        this.storeService.getMyArchivedStores(),
        this.storeService.getMyDeletedStores()
      ]);
      this.activeStores.set(active);
      this.archivedStores.set(archived);
      this.deletedStores.set(deleted);
    } catch (error) {
      this.toaster.error('Failed to load stores');
    } finally {
      this.loading.set(false);
    }
  }

  setActiveTab(tab: 'active' | 'archived' | 'deleted') {
    this.activeTab.set(tab);
    this.clearSelection();
    this.router.navigate([], { queryParams: { tab }, queryParamsHandling: 'merge' });
  }

  getPublishedCount(): number {
    return this.activeStores().filter(s => s.status === 'PUBLISHED').length;
  }

  getDraftCount(): number {
    return this.activeStores().filter(s => s.status !== 'PUBLISHED').length;
  }

  isAllSelected(): boolean {
    const items = this.currentStores();
    return items.length > 0 && items.every(s => this.selectedIds().includes(s.id));
  }

  toggleSelection(id: string) {
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
      const ids = this.currentStores().map(s => s.id);
      this.selectedIds.set(ids);
    }
  }

  clearSelection() {
    this.selectedIds.set([]);
  }

  async archiveStore(store: Store) {
    const confirmed = await this.confirmService.confirm({
      title: 'Archive Store',
      message: `Are you sure you want to archive "${store.name}"? All products in this store will also be hidden from customers.`,
      confirmText: 'Archive',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      await this.storeService.archiveStore(store.id);
      this.toaster.success({ title: 'Store Archived', message: 'The store has been archived.' });
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to archive store');
    }
  }

  async unarchiveStore(store: Store) {
    const confirmed = await this.confirmService.confirm({
      title: 'Unarchive Store',
      message: `Are you sure you want to unarchive "${store.name}"? It will be visible to customers again.`,
      confirmText: 'Unarchive',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      await this.storeService.unarchiveStore(store.id);
      this.toaster.success({ title: 'Store Unarchived', message: 'The store has been restored to active.' });
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to unarchive store');
    }
  }

  async deleteStore(store: Store) {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Store',
      message: `Are you sure you want to delete "${store.name}"? It will be moved to the Bin and can be restored within 30 days.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      accent: 'danger'
    });

    if (!confirmed) return;

    try {
      await this.storeService.deleteStore(store.id);
      this.toaster.success({ title: 'Store Deleted', message: 'The store has been moved to the Bin.' });
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to delete store');
    }
  }

  async restoreStore(store: Store) {
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Store',
      message: `Are you sure you want to restore "${store.name}"? You can move it back to Active.`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      await this.storeService.restoreStore(store.id);
      this.toaster.success({ title: 'Store Restored', message: 'The store has been restored from the Bin.' });
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to restore store');
    }
  }

  async bulkArchive() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Archive Stores',
      message: `Are you sure you want to archive ${count} store${count > 1 ? 's' : ''}?`,
      confirmText: 'Archive',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      await this.storeService.bulkArchiveStores(this.selectedIds());
      this.toaster.success({ title: 'Stores Archived', message: `${count} store${count > 1 ? 's' : ''} archived.` });
      this.clearSelection();
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to archive stores');
    }
  }

  async bulkUnarchive() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Stores',
      message: `Are you sure you want to restore ${count} store${count > 1 ? 's' : ''}?`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      // Unarchive one by one since bulk unarchive might not exist
      await Promise.all(this.selectedIds().map(id => this.storeService.unarchiveStore(id)));
      this.toaster.success({ title: 'Stores Unarchived', message: `${count} store${count > 1 ? 's' : ''} unarchived.` });
      this.clearSelection();
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to unarchive stores');
    }
  }

  async bulkDelete() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Stores',
      message: `Are you sure you want to delete ${count} store${count > 1 ? 's' : ''}? They will be moved to the Bin.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      accent: 'danger'
    });

    if (!confirmed) return;

    try {
      await this.storeService.bulkDeleteStores(this.selectedIds());
      this.toaster.success({ title: 'Stores Deleted', message: `${count} store${count > 1 ? 's' : ''} moved to Bin.` });
      this.clearSelection();
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to delete stores');
    }
  }

  async bulkRestore() {
    const count = this.selectedIds().length;
    const confirmed = await this.confirmService.confirm({
      title: 'Restore Stores',
      message: `Are you sure you want to restore ${count} store${count > 1 ? 's' : ''}?`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      accent: 'yellow'
    });

    if (!confirmed) return;

    try {
      await this.storeService.bulkRestoreStores(this.selectedIds());
      this.toaster.success({ title: 'Stores Restored', message: `${count} store${count > 1 ? 's' : ''} restored from Bin.` });
      this.clearSelection();
      await this.loadStores();
    } catch (error) {
      this.toaster.handleError(error, 'Failed to restore stores');
    }
  }
}
