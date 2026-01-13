import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreContextService } from '../../core/services/store-context.service';

@Component({
  selector: 'app-storefront-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section with Banner -->
      @if (storeContext.store()?.bannerUrl) {
        <div 
          class="h-64 md:h-80 bg-cover bg-center relative"
          [style.background-image]="'url(' + storeContext.store()?.bannerUrl + ')'"
        >
          <div class="absolute inset-0 bg-black/30"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white">
              <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">
                {{ storeContext.storeName() }}
              </h1>
              @if (storeContext.store()?.tagline) {
                <p class="text-xl text-white/90">{{ storeContext.store()?.tagline }}</p>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="h-64 md:h-80 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <div class="text-center text-white">
            <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">
              {{ storeContext.storeName() }}
            </h1>
            @if (storeContext.store()?.tagline) {
              <p class="text-xl text-white/90">{{ storeContext.store()?.tagline }}</p>
            }
          </div>
        </div>
      }

      <!-- Description -->
      @if (storeContext.store()?.description) {
        <div class="max-w-4xl mx-auto px-4 py-12">
          <div class="prose prose-lg max-w-none text-center" [innerHTML]="storeContext.store()?.description"></div>
        </div>
      }

      <!-- Featured Products -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-display font-bold text-gray-900">Products</h2>
          @if (storeContext.products().length > 6) {
            <a routerLink="/products" class="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </a>
          }
        </div>

        @if (storeContext.products().length === 0) {
          <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p class="text-gray-500">No products available yet.</p>
          </div>
        } @else {
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (product of storeContext.products().slice(0, 6); track product.id) {
              <a [routerLink]="['/product', product.id]" 
                 class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                @if (product.coverImageUrl) {
                  <div class="aspect-video overflow-hidden">
                    <img 
                      [src]="product.coverImageUrl" 
                      [alt]="product.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    >
                  </div>
                } @else {
                  <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                }
                
                <div class="p-5">
                  <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                    {{ product.title }}
                  </h3>
                  @if (product.description) {
                    <p class="text-sm text-gray-500 line-clamp-2 mb-3">
                      {{ product.description }}
                    </p>
                  }
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-primary-600">
                      ₹{{ product.price / 100 }}
                    </span>
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <span class="text-sm text-gray-400 line-through">
                        ₹{{ product.compareAtPrice / 100 }}
                      </span>
                    }
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class StorefrontHomeComponent {
  storeContext = inject(StoreContextService);
}
