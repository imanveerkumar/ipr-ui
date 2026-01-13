import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { StoreContextService } from '../../core/services/store-context.service';
import { SubdomainService } from '../../core/services/subdomain.service';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    @if (storeContext.loading()) {
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    } @else if (storeContext.error()) {
      <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p class="text-gray-600 mb-6">{{ storeContext.error() }}</p>
          <a [href]="subdomainService.getMainSiteUrl()" class="btn-primary">
            Visit Main Site
          </a>
        </div>
      </div>
    } @else if (storeContext.hasStore()) {
      <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Storefront Navbar -->
        <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <!-- Store Logo & Name -->
              <a routerLink="/" class="flex items-center gap-3">
                @if (storeContext.store()?.logoUrl) {
                  <img 
                    [src]="storeContext.store()?.logoUrl" 
                    [alt]="storeContext.storeName()"
                    class="w-10 h-10 rounded-lg object-cover"
                  >
                } @else {
                  <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <span class="text-lg font-bold text-primary-600">
                      {{ storeContext.storeName().charAt(0) }}
                    </span>
                  </div>
                }
                <span class="font-display font-semibold text-gray-900">
                  {{ storeContext.storeName() }}
                </span>
              </a>

              <!-- Navigation -->
              <nav class="hidden md:flex items-center gap-6">
                <a routerLink="/" class="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </a>
                <a routerLink="/products" class="text-gray-600 hover:text-gray-900 transition-colors">
                  Products
                </a>
              </nav>

              <!-- Actions -->
              <div class="flex items-center gap-4">
                <a [href]="subdomainService.getMainSiteUrl()" 
                   class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Main Site →
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1">
          <router-outlet />
        </main>

        <!-- Storefront Footer -->
        <footer class="bg-white border-t border-gray-100 py-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                @if (storeContext.store()?.logoUrl) {
                  <img 
                    [src]="storeContext.store()?.logoUrl" 
                    [alt]="storeContext.storeName()"
                    class="w-8 h-8 rounded-lg object-cover"
                  >
                }
                <span class="font-semibold text-gray-900">{{ storeContext.storeName() }}</span>
              </div>
              
              <div class="text-sm text-gray-500">
                Powered by <a [href]="subdomainService.getMainSiteUrl()" class="text-primary-600 hover:underline">YourPlatform</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    }
  `,
})
export class StorefrontLayoutComponent implements OnInit {
  storeContext = inject(StoreContextService);
  subdomainService = inject(SubdomainService);

  async ngOnInit() {
    await this.storeContext.initialize();
  }
}
