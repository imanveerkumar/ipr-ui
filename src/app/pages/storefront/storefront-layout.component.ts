import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StoreContextService } from '../../core/services/store-context.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { GuestAccessService } from '../../core/services/guest-access.service';
import { CartSidebarComponent } from './cart-sidebar.component';
import { StorefrontHomeComponent } from './storefront-home.component';
import { StorefrontProductsComponent } from './storefront-products.component';
import { StorefrontProductComponent } from './storefront-product.component';
import { StorefrontPurchasesComponent } from './storefront-purchases.component';
import { GuestAccessModalComponent } from '../../shared/components/guest-access-modal.component';

type StorefrontPage = 'home' | 'products' | 'product' | 'purchases';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [
    CommonModule, 
    CartSidebarComponent,
    StorefrontHomeComponent,
    StorefrontProductsComponent,
    StorefrontProductComponent,
    StorefrontPurchasesComponent,
    GuestAccessModalComponent
  ],
  template: `
    @if (storeContext.loading()) {
      <!-- Loading State - Mobile optimized -->
      <div class="min-h-screen flex items-center justify-center bg-white px-4">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p class="text-gray-500 animate-pulse text-sm sm:text-base">Loading store...</p>
        </div>
      </div>
    } @else if (storeContext.error()) {
      <!-- Error State - Mobile friendly -->
      <div class="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
        <div class="text-center max-w-sm w-full">
          <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p class="text-gray-600 mb-6 text-sm sm:text-base">{{ storeContext.error() }}</p>
          <a [href]="subdomainService.getMainSiteUrl()" class="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]">
            Visit Main Site
          </a>
        </div>
      </div>
    } @else if (storeContext.hasStore()) {
      <div class="min-h-screen flex flex-col bg-white font-sans antialiased">
        <!-- Mobile-Optimized Header -->
        <header class="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 safe-area-top">
          <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div class="flex items-center justify-between h-14 sm:h-16">
              <!-- Store Logo & Name - Touch friendly -->
              <button 
                (click)="navigateTo('home')" 
                class="flex items-center gap-2.5 sm:gap-3 group min-h-[44px] -ml-1 pl-1"
              >
                @if (storeContext.store()?.logoUrl) {
                  <img 
                    [src]="storeContext.store()?.logoUrl" 
                    [alt]="storeContext.storeName()"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm"
                  >
                } @else {
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center shadow-sm">
                    <span class="text-base sm:text-lg font-bold text-gray-800">
                      {{ storeContext.storeName().charAt(0).toUpperCase() }}
                    </span>
                  </div>
                }
                <span class="font-bold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px]">
                  {{ storeContext.storeName() }}
                </span>
              </button>

              <!-- Right Side Actions -->
              <div class="flex items-center gap-1 sm:gap-2">
                <!-- My Purchases Button -->
                <button 
                  (click)="navigateTo('purchases')"
                  class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <span>My Purchases</span>
                </button>

                <!-- Sign In / User Button -->
                @if (authService.isSignedIn()) {
                  <button 
                    (click)="authService.openUserProfile()"
                    class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>{{ authService.user()?.displayName || 'Account' }}</span>
                  </button>
                } @else if (guestAccess.isAuthenticated()) {
                  <button 
                    (click)="navigateTo('purchases')"
                    class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span>Guest</span>
                  </button>
                } @else {
                  <button 
                    (click)="openSignInModal()"
                    class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    <span>Sign In</span>
                  </button>
                }

                <!-- Mobile Menu Button -->
                <button 
                  (click)="toggleMobileMenu()"
                  class="sm:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  aria-label="Menu"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>

                <!-- Cart Button - Large touch target -->
                <button 
                  (click)="cartService.open()"
                  class="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors -mr-1"
                  aria-label="Open cart"
                >
                  <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  @if (cartService.itemCount() > 0) {
                    <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 min-w-[20px] h-5 px-1.5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                      {{ cartService.itemCount() > 99 ? '99+' : cartService.itemCount() }}
                    </span>
                  }
                </button>
              </div>
            </div>

            <!-- Mobile Menu Dropdown -->
            @if (mobileMenuOpen()) {
              <div class="sm:hidden border-t border-gray-100 py-2">
                <button 
                  (click)="navigateTo('purchases'); toggleMobileMenu()"
                  class="w-full flex items-center gap-3 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  My Purchases
                </button>
                @if (authService.isSignedIn()) {
                  <button 
                    (click)="authService.openUserProfile(); toggleMobileMenu()"
                    class="w-full flex items-center gap-3 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    {{ authService.user()?.displayName || 'My Account' }}
                  </button>
                  <button 
                    (click)="authService.signOut(); toggleMobileMenu()"
                    class="w-full flex items-center gap-3 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                  </button>
                } @else {
                  <button 
                    (click)="openSignInModal(); toggleMobileMenu()"
                    class="w-full flex items-center gap-3 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Sign In
                  </button>
                }
              </div>
            }
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1">
          @switch (currentPage()) {
            @case ('home') {
              <app-storefront-home />
            }
            @case ('products') {
              <app-storefront-products />
            }
            @case ('product') {
              <app-storefront-product />
            }
            @case ('purchases') {
              <app-storefront-purchases />
            }
          }
        </main>

        <!-- Mobile-Friendly Footer -->
        <footer class="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100 safe-area-bottom">
          <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            <div class="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:justify-between">
              <!-- Store Branding -->
              <div class="flex items-center gap-2.5 sm:gap-3">
                @if (storeContext.store()?.logoUrl) {
                  <img 
                    [src]="storeContext.store()?.logoUrl" 
                    [alt]="storeContext.storeName()"
                    class="w-8 h-8 rounded-xl object-cover"
                  >
                } @else {
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
                    <span class="text-sm font-bold text-gray-800">
                      {{ storeContext.storeName().charAt(0).toUpperCase() }}
                    </span>
                  </div>
                }
                <span class="font-bold text-gray-900 text-sm sm:text-base">{{ storeContext.storeName() }}</span>
              </div>
              
              <!-- Footer Links - Touch friendly -->
              <div class="flex items-center gap-4 sm:gap-6">
                <button 
                  (click)="navigateTo('products')"
                  class="text-sm text-gray-500 hover:text-gray-900 active:text-gray-700 transition-colors font-medium py-2"
                >
                  All Products
                </button>
                <a 
                  [href]="subdomainService.getMainSiteUrl()" 
                  class="text-sm text-gray-500 hover:text-gray-900 active:text-gray-700 transition-colors font-medium py-2"
                >
                  Powered by IPR
                </a>
              </div>
            </div>
            
            <!-- Copyright - Mobile -->
            <div class="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 text-center">
              <p class="text-xs sm:text-sm text-gray-400">
                © {{ currentYear }} {{ storeContext.storeName() }}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <!-- Cart Sidebar / Bottom Sheet -->
        <app-cart-sidebar />

        <!-- Guest Access Modal -->
        <app-guest-access-modal 
          #guestAccessModal
          [mode]="guestModalMode()"
          (authenticated)="onGuestAuthenticated()"
        />
      </div>
    }
  `,
  styles: [`
    @keyframes scale-in {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
    
    /* Safe area support for iOS notch devices */
    .safe-area-top {
      padding-top: env(safe-area-inset-top);
    }
    .safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom);
    }
  `]
})
export class StorefrontLayoutComponent implements OnInit {
  @ViewChild('guestAccessModal') guestAccessModal!: GuestAccessModalComponent;

  storeContext = inject(StoreContextService);
  subdomainService = inject(SubdomainService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  guestAccess = inject(GuestAccessService);
  private router = inject(Router);

  currentPage = signal<StorefrontPage>('home');
  productId = signal<string | null>(null);
  mobileMenuOpen = signal(false);
  guestModalMode = signal<'purchases' | 'signin'>('purchases');
  currentYear = new Date().getFullYear();

  async ngOnInit() {
    // Initialize store context
    await this.storeContext.initialize();
    
    // Parse initial route
    this.parseRoute(this.router.url);
    
    // Listen for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.parseRoute(event.urlAfterRedirects || event.url);
    });
  }

  private parseRoute(url: string) {
    // Remove query params for parsing
    const path = url.split('?')[0];
    
    if (path.startsWith('/purchases')) {
      this.currentPage.set('purchases');
    } else if (path.startsWith('/products')) {
      this.currentPage.set('products');
    } else if (path.startsWith('/product/')) {
      this.currentPage.set('product');
      const match = path.match(/\/product\/([^\/]+)/);
      if (match) {
        this.productId.set(match[1]);
      }
    } else {
      this.currentPage.set('home');
    }
  }

  navigateTo(page: StorefrontPage | string) {
    this.mobileMenuOpen.set(false);
    switch (page) {
      case 'home':
        this.router.navigate(['/'], { queryParamsHandling: 'merge' });
        break;
      case 'products':
        this.router.navigate(['/products'], { queryParamsHandling: 'merge' });
        break;
      case 'purchases':
        this.router.navigate(['/purchases'], { queryParamsHandling: 'merge' });
        break;
      default:
        this.router.navigate(['/'], { queryParamsHandling: 'merge' });
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  openSignInModal() {
    // Try Clerk sign-in first for users with accounts
    // If not signed in via Clerk, offer guest access modal
    this.guestModalMode.set('signin');
    this.guestAccessModal.open();
  }

  openPurchasesModal() {
    this.guestModalMode.set('purchases');
    this.guestAccessModal.open();
  }

  onGuestAuthenticated() {
    // Navigate to purchases page after successful guest auth
    this.navigateTo('purchases');
  }
}
