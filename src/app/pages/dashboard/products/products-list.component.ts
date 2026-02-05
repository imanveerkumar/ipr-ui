import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Product, Store } from '../../../core/models/index';

type TabType = 'active' | 'archived' | 'bin';

@Component({
  selector: 'app-products-list',
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
          <span class="text-sm font-bold text-black">Products</span>
        </nav>
        
        <!-- Header Content -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-1">My Products</h1>
            <p class="text-[#111111]/70 font-medium">Manage and organize your digital products</p>
          </div>
          
            <a routerLink="/dashboard/products/new" 
               class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Product
            </a>
        </div>
      </div>
    </section>

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
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#68E079] text-[#111111]">{{ activeProducts().length }}</span>
            }
          </button>
          
          <button 
            (click)="switchTab('archived')"
            [class]="currentTab() === 'archived' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FFC60B] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Archived
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FFC60B] text-[#111111]">{{ archivedProducts().length }}</span>
            }
          </button>
          
          <button 
            (click)="switchTab('bin')"
            [class]="currentTab() === 'bin' 
              ? 'px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base border-b-4 border-[#FA4B28] text-[#111111] whitespace-nowrap' 
              : 'px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base text-[#111111]/60 hover:text-[#111111] whitespace-nowrap transition-colors'">
            Bin
            @if (!loading()) {
              <span class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FA4B28] text-white">{{ deletedProducts().length }}</span>
            }
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Bar (only for active tab) -->
    @if (currentTab() === 'active') {
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
      } @else if (activeProducts().length > 0) {
        <section class="bg-white border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
              <div class="flex items-center gap-2 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-[#111111]">{{ activeProducts().length }}</span>
                <span class="text-sm font-medium text-[#111111]/70">Total</span>
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
          <div class="bg-[#FFC60B] text-[#111111] shadow-[4px_4px_0px_0px_#000] px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto relative">
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
              <span class="text-sm font-bold">{{ selectedIds().length }} selected</span>
            </div>
            
            <div class="flex items-center gap-2">
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
          <!-- Loading Skeleton -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                <div class="h-44 sm:h-48 bg-black/10 animate-pulse"></div>
                <div class="p-4 sm:p-5">
                  <div class="h-5 w-3/4 bg-black/10 animate-pulse mb-2"></div>
                  <div class="h-4 w-1/2 bg-black/10 animate-pulse mb-4"></div>
                  <div class="flex justify-between items-center">
                    <div class="h-6 w-20 bg-black/10 animate-pulse"></div>
                    <div class="h-4 w-12 bg-black/10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            }
          </div>
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
                No products yet
              } @else if (currentTab() === 'archived') {
                No archived products
              } @else {
                Bin is empty
              }
            </h3>
            <p class="text-[#111111]/70 font-medium mb-6 max-w-md">
              @if (currentTab() === 'active') {
                Create your first digital product and start selling to customers worldwide.
              } @else if (currentTab() === 'archived') {
                Products you archive will appear here. They won't be visible to customers.
              } @else {
                Deleted products will appear here. You can restore them at any time.
              }
            </p>
            @if (currentTab() === 'active') {
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
  private confirmService = inject(ConfirmService);
  private toaster = inject(ToasterService);

  activeProducts = signal<Product[]>([]);
  archivedProducts = signal<Product[]>([]);
  deletedProducts = signal<Product[]>([]);
  loading = signal(true);
  currentTab = signal<TabType>('active');
  selectedIds = signal<string[]>([]);

  currentProducts = computed(() => {
    switch (this.currentTab()) {
      case 'archived': return this.archivedProducts();
      case 'bin': return this.deletedProducts();
      default: return this.activeProducts();
    }
  });

  async ngOnInit() {
    await this.loadAllProducts();
  }

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

  switchTab(tab: TabType) {
    this.currentTab.set(tab);
    this.clearSelection();
  }

  getPublishedCount(): number {
    return this.activeProducts().filter(p => p.status === 'PUBLISHED').length;
  }

  getDraftCount(): number {
    return this.activeProducts().filter(p => p.status !== 'PUBLISHED').length;
  }

  // Selection methods
  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSelection(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const current = this.selectedIds();
    if (current.includes(id)) {
      this.selectedIds.set(current.filter(i => i !== id));
    } else {
      this.selectedIds.set([...current, id]);
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
    });

    if (confirmed) {
      try {
        await this.productService.archiveProduct(product.id);
        this.toaster.success({ title: 'Product Archived', message: 'The product has been archived.' });
        await this.loadAllProducts();
      } catch (error) {
        this.toaster.error('Failed to archive product');
      }
    }
  }

  async unarchiveProduct(product: Product) {
    try {
      await this.productService.unarchiveProduct(product.id);
      this.toaster.success({ title: 'Product Restored', message: 'The product is now active.' });
      await this.loadAllProducts();
    } catch (error) {
      this.toaster.error('Failed to unarchive product');
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
    });

    if (confirmed) {
      try {
        await this.productService.deleteProduct(product.id);
        this.toaster.success({ title: 'Product Deleted', message: 'The product has been moved to Bin.' });
        await this.loadAllProducts();
      } catch (error) {
        this.toaster.error('Failed to delete product');
      }
    }
  }

  async restoreProduct(product: Product) {
    try {
      await this.productService.restoreProduct(product.id);
      this.toaster.success({ title: 'Product Restored', message: 'The product is now active.' });
      await this.loadAllProducts();
    } catch (error) {
      this.toaster.error('Failed to restore product');
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

    if (confirmed) {
      try {
        await this.productService.bulkArchiveProducts(this.selectedIds());
        this.toaster.success({ title: 'Products Archived', message: `${count} product${count > 1 ? 's' : ''} archived.` });
        this.clearSelection();
        await this.loadAllProducts();
      } catch (error) {
        this.toaster.error('Failed to archive products');
      }
    }
  }

  async bulkUnarchive() {
    try {
      const count = this.selectedIds().length;
      // Unarchive one by one since there's no bulk unarchive
      for (const id of this.selectedIds()) {
        await this.productService.unarchiveProduct(id);
      }
      this.toaster.success({ title: 'Products Restored', message: `${count} product${count > 1 ? 's' : ''} restored.` });
      this.clearSelection();
      await this.loadAllProducts();
    } catch (error) {
      this.toaster.error('Failed to unarchive products');
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

    if (confirmed) {
      try {
        await this.productService.bulkDeleteProducts(this.selectedIds());
        this.toaster.success({ title: 'Products Deleted', message: `${count} product${count > 1 ? 's' : ''} moved to Bin.` });
        this.clearSelection();
        await this.loadAllProducts();
      } catch (error) {
        this.toaster.error('Failed to delete products');
      }
    }
  }

  async bulkRestore() {
    try {
      const count = this.selectedIds().length;
      await this.productService.bulkRestoreProducts(this.selectedIds());
      this.toaster.success({ title: 'Products Restored', message: `${count} product${count > 1 ? 's' : ''} restored.` });
      this.clearSelection();
      await this.loadAllProducts();
    } catch (error) {
      this.toaster.error('Failed to restore products');
    }
  }
}
