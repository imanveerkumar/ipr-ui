import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Store } from '../../../core/models/index';

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

    <!-- Stats Bar -->
    @if (loading()) {
      <section class="bg-white border-b-2 border-black">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
            <!-- Total Products Skeleton -->
            <div class="flex items-center gap-2 shrink-0">
              <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
              <div class="w-24 h-5 bg-black/10 rounded animate-pulse"></div>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Published Skeleton -->
            <div class="flex items-center gap-2 shrink-0">
              <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
              <div class="w-20 h-5 bg-black/10 rounded animate-pulse"></div>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Drafts Skeleton -->
            <div class="flex items-center gap-2 shrink-0">
              <div class="w-8 h-8 bg-black/10 rounded animate-pulse"></div>
              <div class="w-16 h-5 bg-black/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    } @else if (products().length > 0) {
      <section class="bg-white border-b-2 border-black">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div class="flex items-center gap-4 sm:gap-8 overflow-x-auto">
            <!-- Total Products -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#111111]">{{ products().length }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Total Products</span>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Published -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#68E079]">{{ getPublishedCount() }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Published</span>
            </div>
            
            <div class="w-0.5 h-6 bg-black/20 shrink-0"></div>
            
            <!-- Drafts -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xl sm:text-2xl font-black text-[#FFC60B]">{{ getDraftCount() }}</span>
              <span class="text-sm font-medium text-[#111111]/70">Drafts</span>
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
        } @else if (products().length === 0) {
          <!-- Empty State -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-8 sm:p-12 flex flex-col items-center text-center">
            <div class="w-24 h-24 bg-[#F9F4EB] border-2 border-black flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-[#111111]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-[#111111] mb-2">No products yet</h3>
            <p class="text-[#111111]/70 font-medium mb-6 max-w-md">Create your first digital product and start selling to customers worldwide.</p>
            <a routerLink="/dashboard/products/new" 
               class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] font-bold border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Your First Product
            </a>
          </div>
        } @else {
          <!-- Products Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            @for (product of products(); track product.id) {
              <a [routerLink]="['/dashboard/products', product.id]" 
                 class="block bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all group">
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
                  @if (product.status === 'PUBLISHED') {
                    <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#68E079] text-[#111111] border-2 border-black">
                      Live
                    </span>
                  } @else {
                    <span class="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wide bg-[#FFC60B] text-[#111111] border-2 border-black">
                      Draft
                    </span>
                  }
                </div>
                
                <!-- Content -->
                <div class="p-4 sm:p-5">
                  <h3 class="text-base sm:text-lg font-bold text-[#111111] mb-1 truncate">{{ product.title }}</h3>
                  <p class="text-sm text-[#111111]/60 font-medium mb-4">{{ product.store?.name || 'No store' }}</p>
                  
                  <div class="flex items-center justify-between">
                    <span class="text-lg sm:text-xl font-black text-[#111111]">₹{{ product.price / 100 }}</span>
                    <span class="inline-flex items-center gap-1 text-sm font-bold text-[#111111]/70 group-hover:text-[#2B57D6] transition-colors">
                      Edit
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
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
  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    const products = await this.productService.getMyProducts();
    this.products.set(products);
    this.loading.set(false);
  }

  getPublishedCount(): number {
    return this.products().filter(p => p.status === 'PUBLISHED').length;
  }

  getDraftCount(): number {
    return this.products().filter(p => p.status !== 'PUBLISHED').length;
  }
}
