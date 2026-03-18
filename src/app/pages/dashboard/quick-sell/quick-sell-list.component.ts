import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-quick-sell-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Header -->
      <div class="bg-theme-secondary border-b-2 border-theme-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <a routerLink="/dashboard" class="inline-flex items-center gap-2 text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </a>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 200 200">
                  <ellipse cx="100" cy="90" rx="60" ry="60"/>
                  <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                  <circle cx="80" cy="85" r="5" opacity="0.4"/>
                  <circle cx="120" cy="85" r="5" opacity="0.4"/>
                  <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
                </svg>
              </div>
              <div>
                <h1 class="font-display tracking-tighter text-2xl md:text-3xl font-bold text-theme-fg">Quick Sell Products</h1>
                <p class="text-sm text-theme-muted mt-1">Products created via Quick Sell — shareable links only, not listed on Explore.</p>
              </div>
            </div>
            <a routerLink="/dashboard/quick-sell/new" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-theme-accent text-[var(--on-accent)] border-2 border-theme-border font-bold text-sm shadow-[3px_3px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all shrink-0">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 200 200">
                <ellipse cx="100" cy="90" rx="60" ry="60"/>
                <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                <circle cx="80" cy="85" r="5" opacity="0.4"/>
                <circle cx="120" cy="85" r="5" opacity="0.4"/>
                <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
              </svg>
              Quick Sell
            </a>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search -->
        <div class="mb-6">
          <div class="flex items-center border-2 border-theme-border bg-theme-surface max-w-md">
            <svg class="w-4 h-4 ml-3 text-theme-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Search quick products..."
              class="flex-1 px-3 py-2.5 bg-transparent text-sm text-theme-fg outline-none"
            />
          </div>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="bg-theme-secondary border-2 border-theme-border p-5 animate-pulse">
                <div class="h-5 w-40 bg-theme-fg/10 mb-3"></div>
                <div class="h-4 w-20 bg-theme-fg/10 mb-4"></div>
                <div class="h-8 w-full bg-theme-fg/10"></div>
              </div>
            }
          </div>
        } @else if (products().length === 0) {
          <div class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-theme-secondary border-2 border-theme-border flex items-center justify-center rotate-3">
              <svg class="w-10 h-10 text-theme-fg/20" fill="currentColor" viewBox="0 0 200 200">
                <ellipse cx="100" cy="90" rx="60" ry="60"/>
                <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                <circle cx="80" cy="85" r="5" opacity="0.4"/>
                <circle cx="120" cy="85" r="5" opacity="0.4"/>
                <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-theme-fg mb-2">No quick products yet</h2>
            <p class="text-sm text-theme-muted mb-6">Use Quick Sell to instantly list a product with just a file and a price.</p>
            <a routerLink="/dashboard/quick-sell/new" class="inline-flex items-center gap-2 px-6 py-3 bg-theme-accent text-[var(--on-accent)] border-2 border-theme-border font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 200 200">
                <ellipse cx="100" cy="90" rx="60" ry="60"/>
                <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                <circle cx="80" cy="85" r="5" opacity="0.4"/>
                <circle cx="120" cy="85" r="5" opacity="0.4"/>
                <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
              </svg>
              Create your first Quick Sell product
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (product of products(); track product.id) {
              <div class="bg-theme-surface border-2 border-theme-border hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200">
                <div class="p-5">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-bold text-theme-fg truncate">{{ product.title }}</h3>
                      <p class="text-xs text-theme-muted mt-0.5">{{ formatDate(product.createdAt) }}</p>
                    </div>
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase shrink-0 ml-2"
                      [class.bg-theme-success]="product.status === 'PUBLISHED'"
                      [class.text-[var(--on-success)]]="product.status === 'PUBLISHED'"
                      [class.border]="true"
                      [class.border-theme-border]="true"
                      [class.bg-theme-secondary]="product.status !== 'PUBLISHED'"
                      [class.text-theme-muted]="product.status !== 'PUBLISHED'"
                    >
                      {{ product.status === 'PUBLISHED' ? 'Live' : product.status }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between mb-4">
                    <span class="text-lg font-bold text-theme-fg">
                      @if (product.price === 0) {
                        Free
                      } @else {
                        ₹{{ (product.price / 100).toFixed(product.price % 100 === 0 ? 0 : 2) }}
                      }
                    </span>
                    @if (product.files && product.files.length > 0) {
                      <span class="text-xs text-theme-muted">{{ product.files.length }} file{{ product.files.length > 1 ? 's' : '' }}</span>
                    }
                  </div>

                  <!-- Product URL -->
                  <div class="flex items-center gap-1.5">
                    <div class="flex-1 bg-theme-secondary border border-theme-border px-2.5 py-1.5 overflow-hidden">
                      <p class="text-xs text-theme-muted font-mono truncate">{{ product.productUrl }}</p>
                    </div>
                    <button type="button" (click)="copyUrl(product.productUrl)" class="shrink-0 px-3 py-1.5 bg-theme-primary text-[var(--on-primary)] border border-theme-border text-xs font-bold hover:opacity-90 transition-opacity">
                      {{ copiedId() === product.id ? '✓' : 'Copy' }}
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-2 mt-8">
              <button type="button" (click)="goToPage(currentPage() - 1)" [disabled]="currentPage() <= 1"
                class="px-4 py-2 border-2 border-theme-border bg-theme-surface text-sm font-bold text-theme-fg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-secondary transition-colors">
                Previous
              </button>
              <span class="px-4 py-2 text-sm font-bold text-theme-muted">
                {{ currentPage() }} / {{ totalPages() }}
              </span>
              <button type="button" (click)="goToPage(currentPage() + 1)" [disabled]="currentPage() >= totalPages()"
                class="px-4 py-2 border-2 border-theme-border bg-theme-surface text-sm font-bold text-theme-fg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-secondary transition-colors">
                Next
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class QuickSellListComponent implements OnInit {
  private productService = inject(ProductService);
  private toaster = inject(ToasterService);

  products = signal<(Product & { productUrl: string })[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(0);
  searchQuery = '';
  copiedId = signal<string | null>(null);

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    this.loading.set(true);
    try {
      const result = await this.productService.getMyQuickProducts({
        page: this.currentPage(),
        limit: 12,
        search: this.searchQuery || undefined,
      });
      this.products.set(result.data || []);
      this.totalPages.set(result.meta?.totalPages || 0);
    } catch (err) {
      console.error('Failed to load quick products', err);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.loadProducts();
    }, 300);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  async copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      const product = this.products().find((p: any) => p.productUrl === url);
      if (product) {
        this.copiedId.set(product.id);
        setTimeout(() => this.copiedId.set(null), 2000);
      }
    } catch {
      this.toaster.error('Failed to copy');
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
}
