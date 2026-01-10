import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store, Product } from '../../core/models/index';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (loading()) {
        <div class="max-w-7xl mx-auto px-4 py-8">
          <div class="animate-pulse">
            <div class="h-48 bg-gray-200 rounded-xl mb-8"></div>
            <div class="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      } @else if (store()) {
        <!-- Store Header -->
        <div class="bg-white border-b border-gray-100">
          @if (store()?.bannerUrl) {
            <div class="h-48 bg-cover bg-center" [style.background-image]="'url(' + store()?.bannerUrl + ')'"></div>
          } @else {
            <div class="h-48 bg-gradient-to-r from-primary-500 to-accent-500"></div>
          }
          
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-8">
            <div class="flex items-end gap-6">
              @if (store()?.logoUrl) {
                <img [src]="store()?.logoUrl" alt="Store logo" class="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover">
              } @else {
                <div class="w-24 h-24 rounded-xl border-4 border-white shadow-lg bg-primary-100 flex items-center justify-center">
                  <span class="text-3xl font-bold text-primary-600">{{ store()?.name?.charAt(0) }}</span>
                </div>
              }
              
              <div class="pb-2">
                <h1 class="text-3xl font-display font-bold text-gray-900">{{ store()?.name }}</h1>
                @if (store()?.description) {
                  <div class="text-gray-600 mt-2 prose prose-sm max-w-none" [innerHTML]="store()?.description"></div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-8">Products</h2>
          
          @if (products().length === 0) {
            <div class="text-center py-16">
              <p class="text-gray-500">No products available yet.</p>
            </div>
          } @else {
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (product of products(); track product.id) {
                <a [routerLink]="['/product', product.id]" class="card-hover group">
                  @if (product.coverImageUrl) {
                    <img [src]="product.coverImageUrl" alt="" class="w-full h-48 object-cover">
                  } @else {
                    <div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  }
                  <div class="p-4">
                    <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {{ product.title }}
                    </h3>
                    <p class="text-lg font-bold text-primary-600 mt-2">
                      ₹{{ product.price / 100 }}
                    </p>
                  </div>
                </a>
              }
            </div>
          }
        </div>
      } @else {
        <div class="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 class="text-2xl font-bold text-gray-900">Store not found</h1>
          <p class="text-gray-600 mt-2">The store you're looking for doesn't exist or has been removed.</p>
          <a routerLink="/" class="btn-primary mt-6 inline-block">Go Home</a>
        </div>
      }
    </div>
  `,
})
export class StoreComponent implements OnInit {
  store = signal<Store | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      await this.loadStore(slug);
    }
    this.loading.set(false);
  }

  async loadStore(slug: string) {
    const store = await this.storeService.getStoreBySlug(slug);
    this.store.set(store);
    
    if (store) {
      const products = await this.productService.getProductsByStore(store.id);
      this.products.set(products);
    }
  }
}
