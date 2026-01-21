import { Component, OnInit, OnDestroy, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';

const FOOTER_EXPANDED_KEY = 'storescraft_footer_expanded';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gradient-to-b from-gray-50 to-white">
      <!-- Collapsed Footer Bar -->
      @if (!isExpanded()) {
        <div class="footer-collapsed">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-amber-50/80 rounded-xl sm:rounded-2xl shadow-sm border border-amber-100/50 overflow-hidden">
              <button 
                (click)="toggleFooter()"
                class="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-amber-100/30 transition-colors duration-200 group"
                aria-expanded="false"
                aria-controls="footer-content"
              >
                <div class="flex items-center gap-2 sm:gap-3">
                  <span class="text-lg sm:text-xl font-display font-bold text-primary-600">Stores</span>
                  <span class="text-lg sm:text-xl font-display font-bold text-gray-900">Craft</span>
                  <span class="hidden sm:inline-block text-xs text-gray-400 ml-2">|</span>
                  <span class="hidden sm:inline-block text-xs text-gray-500">&copy; {{ currentYear }}</span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                  <span class="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span class="hidden xs:inline">View </span>More
                  </span>
                  <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-900/5 group-hover:bg-gray-900/10 flex items-center justify-center transition-all duration-200 group-hover:scale-105">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div class="h-4 sm:h-6"></div>
        </div>
      }

      <!-- Expanded Footer Content -->
      @if (isExpanded()) {
        <div 
          id="footer-content"
          class="footer-expanded animate-footer-expand py-8 sm:py-10 lg:py-12"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-amber-50/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-10 shadow-sm border border-amber-100/50">
              
              <!-- Collapse Button (only show on non-homepage) -->
              @if (!isHomePage()) {
                <div class="flex justify-end mb-4 sm:mb-6">
                  <button 
                    (click)="toggleFooter()"
                    class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-full transition-all duration-200 group"
                    aria-expanded="true"
                    aria-controls="footer-content"
                  >
                    <span>Collapse</span>
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-200 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                  </button>
                </div>
              }

              <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
                <!-- Brand -->
                <div class="col-span-2 sm:col-span-2 lg:col-span-2">
                  <a routerLink="/" class="flex items-center gap-2 mb-3 sm:mb-4">
                    <span class="text-xl sm:text-2xl font-display font-bold text-primary-600">Stores</span>
                    <span class="text-xl sm:text-2xl font-display font-bold text-gray-900">Craft</span>
                  </a>
                  <p class="text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed">
                    The marketplace for digital creators. Sell templates, courses, designs, and more to a global audience.
                  </p>
                  <!-- Social Links -->
                  <div class="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900/5 hover:bg-gray-900/10 active:bg-gray-900/15 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all touch-manipulation">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900/5 hover:bg-gray-900/10 active:bg-gray-900/15 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all touch-manipulation">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900/5 hover:bg-gray-900/10 active:bg-gray-900/15 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all touch-manipulation">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-900/5 hover:bg-gray-900/10 active:bg-gray-900/15 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all touch-manipulation">
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Product Links -->
                <div>
                  <h3 class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 sm:mb-4">Product</h3>
                  <ul class="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <li><a routerLink="/" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Explore</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Categories</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Pricing</a></li>
                    <li><a routerLink="/become-creator" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Become a Creator</a></li>
                  </ul>
                </div>

                <!-- Resources Links -->
                <div>
                  <h3 class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 sm:mb-4">Resources</h3>
                  <ul class="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Help Docs</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Getting Started</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Blog</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Affiliates</a></li>
                  </ul>
                </div>

                <!-- Company Links -->
                <div>
                  <h3 class="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 sm:mb-4">Company</h3>
                  <ul class="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">About</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Contact</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Terms</a></li>
                    <li><a href="#" class="block py-1.5 sm:py-1 text-gray-700 hover:text-gray-900 active:text-gray-900 transition-colors touch-manipulation">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>

              <!-- Bottom Bar -->
              <div class="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-amber-200/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <p class="text-xs sm:text-sm text-gray-500">&copy; {{ currentYear }} StoresCraft. All rights reserved.</p>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">Made with</span>
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-xs text-gray-400">for creators</span>
                </div>
              </div>
            </div>
          </div>
          <div class="h-4 sm:h-6 lg:h-8"></div>
        </div>
      }
    </footer>
  `,
  styles: [`
    /* Animation for footer expansion */
    @keyframes footerExpand {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-footer-expand {
      animation: footerExpand 0.3s ease-out;
    }

    /* Extra small breakpoint for very small phones */
    @media (min-width: 375px) {
      .xs\\:inline {
        display: inline;
      }
    }

    /* Ensure touch targets are large enough on mobile */
    @media (max-width: 640px) {
      .touch-manipulation {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
    }

    /* Smooth transition for footer toggle */
    .footer-collapsed,
    .footer-expanded {
      will-change: opacity, transform;
    }
  `],
})
export class FooterComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private routerSubscription?: Subscription;

  currentYear = new Date().getFullYear();
  
  // Signal for expanded state
  isExpanded = signal(true);
  
  // Routes where footer should always be expanded
  private expandedRoutes = ['/', '/explore', '/become-creator'];

  ngOnInit() {
    this.initializeFooterState();
    
    // Subscribe to router events to update footer state on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateFooterState();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Initialize footer state based on current route and user preference
   */
  private initializeFooterState() {
    if (this.isHomePage()) {
      // Always expanded on homepage/landing pages
      this.isExpanded.set(true);
    } else {
      // Check user preference from localStorage
      const savedPreference = this.getStoredPreference();
      this.isExpanded.set(savedPreference ?? false); // Default to collapsed
    }
  }

  /**
   * Update footer state when route changes
   */
  private updateFooterState() {
    if (this.isHomePage()) {
      this.isExpanded.set(true);
    } else {
      // Respect user's saved preference on other pages
      const savedPreference = this.getStoredPreference();
      if (savedPreference !== null) {
        this.isExpanded.set(savedPreference);
      } else {
        this.isExpanded.set(false);
      }
    }
  }

  /**
   * Check if current route is homepage or landing page
   */
  isHomePage(): boolean {
    const currentUrl = this.router.url.split('?')[0]; // Remove query params
    return this.expandedRoutes.includes(currentUrl);
  }

  /**
   * Toggle footer expanded/collapsed state
   */
  toggleFooter() {
    const newState = !this.isExpanded();
    this.isExpanded.set(newState);
    
    // Save preference only for non-homepage routes
    if (!this.isHomePage()) {
      this.savePreference(newState);
    }
  }

  /**
   * Get stored user preference from localStorage
   */
  private getStoredPreference(): boolean | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(FOOTER_EXPANDED_KEY);
      if (stored === null) return null;
      return stored === 'true';
    } catch {
      return null;
    }
  }

  /**
   * Save user preference to localStorage
   */
  private savePreference(expanded: boolean) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      localStorage.setItem(FOOTER_EXPANDED_KEY, String(expanded));
    } catch {
      // localStorage not available, fail silently
    }
  }
}
