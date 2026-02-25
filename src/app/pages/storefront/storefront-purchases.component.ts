import { Component, OnInit, signal, inject, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GuestAccessService, GuestPurchase } from '../../core/services/guest-access.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreContextService } from '../../core/services/store-context.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';
import { PurchasesAuthModalComponent } from '../../shared/components/purchases-auth-modal.component';
import { License } from '../../core/models';

@Component({
  selector: 'app-storefront-purchases',
  standalone: true,
  imports: [CommonModule, PurchasesAuthModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-8">
      <!-- Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4 py-5 sm:py-6 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">My Purchases</h1>
              <p class="text-sm text-gray-500 mt-0.5">
                @if (isAuthenticated()) {
                  @if (guestAccess.isAuthenticated()) {
                    {{ guestAccess.identifier() }}
                  } @else if (authService.isSignedIn()) {
                    {{ authService.user()?.email }}
                  }
                } @else {
                  Access your purchased products
                }
              </p>
            </div>
            <div class="flex items-center gap-2">
              @if (isAuthenticated()) {
                @if (guestAccess.isAuthenticated()) {
                  <button 
                    (click)="logout()"
                    class="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                }
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        @if (!isAuthenticated()) {
          <!-- Not Authenticated State -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Access Your Purchases</h2>
            <p class="text-gray-600 mb-6 max-w-sm mx-auto text-sm sm:text-base">
              Enter the email or phone number you used during checkout to access your purchased products from {{ storeContext.storeName() }}.
            </p>
            <button 
              (click)="openAccessModal()"
              class="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]"
            >
              Verify to Access
            </button>
          </div>
        } @else if (loading()) {
          <!-- Loading State -->
          <div class="space-y-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 animate-pulse">
                <div class="flex gap-4">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div class="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (purchases().length === 0) {
          <!-- Empty State -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">No Purchases Found</h2>
            <p class="text-gray-600 mb-6 text-sm sm:text-base">
              We couldn't find any purchases from this store associated with your account.
            </p>
            <button 
              (click)="goToProducts()"
              class="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors min-h-[48px]"
            >
              Browse Products
            </button>
          </div>
        } @else {
          <!-- View All Purchases Link -->
          <div class="mb-6 p-4 bg-gradient-to-br from-[#b8e6c9]/30 to-[#d8f8e0]/30 rounded-2xl border border-[#b8e6c9]/50">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">Want to see all your purchases?</p>
                  <p class="text-xs text-gray-600">Access products from all stores in one place</p>
                </div>
              </div>
              <button 
                (click)="viewAllPurchases()"
                class="w-full sm:w-auto px-4 py-2.5 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors text-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>View All Purchases</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Store-specific purchases header -->
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-sm font-medium text-gray-500">
              Purchases from {{ storeContext.storeName() }}
            </h2>
            <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {{ purchases().length }} item{{ purchases().length > 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Purchases List -->
          <div class="space-y-4">
            @for (purchase of purchases(); track purchase.id) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Product Info -->
                <div class="p-4 sm:p-6">
                  <div class="flex gap-3 sm:gap-4">
                    <!-- Thumbnail -->
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      @if (purchase.product.thumbnailUrl) {
                        <img 
                          [src]="purchase.product.thumbnailUrl" 
                          [alt]="purchase.product.title"
                          class="w-full h-full object-cover"
                        >
                      } @else {
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0]">
                          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      }
                    </div>

                    <!-- Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <div class="min-w-0">
                          <h3 class="font-bold text-gray-900 text-sm sm:text-base truncate">{{ purchase.product.title }}</h3>
                        </div>
                        <div class="sm:text-right flex-shrink-0 mt-0.5 sm:mt-0">
                          <p class="text-xs text-gray-500">
                            {{ formatDate(purchase.order.paidAt) }}
                          </p>
                        </div>
                      </div>

                      <!-- License Info -->
                      <div class="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-green-50 text-green-700 rounded-lg">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Active
                        </span>
                        <span class="text-gray-500 text-xs">
                          {{ purchase.downloadCount }}/{{ purchase.maxDownloads }} downloads
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Files Section -->
                @if (purchase.product.files.length > 0) {
                  <div class="border-t border-gray-100 bg-gray-50/50 p-3 sm:p-4">
                    <p class="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      {{ purchase.product.files.length }} file{{ purchase.product.files.length > 1 ? 's' : '' }} included
                    </p>
                    <div class="space-y-2">
                      @for (file of purchase.product.files; track file.id) {
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl p-3 border border-gray-100 gap-2 sm:gap-3">
                          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div class="min-w-0">
                              <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ file.filename }}</p>
                              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                            </div>
                          </div>
                          <button 
                            (click)="downloadFile(purchase, file.id)"
                            [disabled]="downloadingFile() === file.id || purchase.downloadCount >= purchase.maxDownloads"
                            class="w-full sm:w-auto px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                          >
                            @if (downloadingFile() === file.id) {
                              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                              </svg>
                            }
                            <span>Download</span>
                          </button>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Purchases Auth Modal -->
    <app-purchases-auth-modal 
      #accessModal
      (authenticated)="onAuthenticated($event)"
    />
  `
})
export class StorefrontPurchasesComponent implements OnInit {
  @ViewChild('accessModal') accessModal!: PurchasesAuthModalComponent;

  guestAccess = inject(GuestAccessService);
  authService = inject(AuthService);
  storeContext = inject(StoreContextService);
  private subdomainService = inject(SubdomainService);
  private checkoutService = inject(CheckoutService);
  private downloadService = inject(DownloadService);
  private router = inject(Router);

  loading = signal(false);
  purchases = signal<GuestPurchase[]>([]);
  clerkLicenses = signal<License[]>([]);
  downloadingFile = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor() {
    // Watch for auth state changes
    // Reload purchases when authentication state and store context become available.
    effect(() => {
      if (this.isAuthenticated() && this.storeContext.hasStore()) {
        // loadPurchases handles both guest and signed-in (clerk) users
        this.loadPurchases();
      }
    });
  }

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.loadPurchases();
    }
  }

  isAuthenticated(): boolean {
    return this.guestAccess.isAuthenticated() || this.authService.isSignedIn();
  }

  openAccessModal() {
    this.accessModal.open();
  }

  async onAuthenticated(event: { type: 'guest' | 'clerk' }) {
    if (event.type === 'guest') {
      await this.loadPurchases();
    } else {
      // Clerk user - wait for auth to complete and then load
      await this.loadClerkPurchases();
    }
  }

  async loadPurchases() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const storeId = this.storeContext.store()?.id;
      
      if (this.guestAccess.isAuthenticated()) {
        // Load guest purchases filtered by store
        const purchases = await this.guestAccess.fetchPurchases(storeId);
        this.purchases.set(purchases);
      } else if (this.authService.isSignedIn()) {
        await this.loadClerkPurchases();
      }
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load purchases');
    } finally {
      this.loading.set(false);
    }
  }

  async loadClerkPurchases() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const storeId = this.storeContext.store()?.id;
      // For Clerk users, we need to get their licenses filtered by store
      const allLicenses = await this.checkoutService.getMyLicenses();
      
      // Filter by current store if we have a store context
      const filteredLicenses = storeId 
        ? allLicenses.filter((l: License) => l.product?.storeId === storeId)
        : allLicenses;

      // Convert to GuestPurchase format for consistent display
      const purchases: GuestPurchase[] = filteredLicenses.map((license: License) => ({
        id: license.id,
        licenseKey: license.licenseKey,
        downloadCount: license.downloadCount,
        maxDownloads: license.maxDownloads,
        createdAt: license.createdAt || new Date().toISOString(),
        product: {
          id: license.product?.id || license.productId,
          title: license.product?.title || 'Product',
          description: license.product?.description || '',
          thumbnailUrl: license.product?.coverImageUrl || null,
          store: {
            id: license.product?.store?.id || '',
            name: license.product?.store?.name || '',
            slug: license.product?.store?.slug || '',
            logoUrl: license.product?.store?.logoUrl || null,
          },
          files: (license.product?.files || []).map((pf: any) => ({
            id: pf.file?.id || pf.fileId,
            filename: pf.file?.filename || 'file',
            size: pf.file?.size || 0,
            mimeType: pf.file?.mimeType || '',
          })),
        },
        order: {
          id: '',
          downloadToken: '',
          paidAt: license.createdAt || new Date().toISOString(),
          totalAmount: 0,
          currency: 'INR',
        },
      }));

      this.purchases.set(purchases);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load purchases');
    } finally {
      this.loading.set(false);
    }
  }

  async downloadFile(purchase: GuestPurchase, fileId: string) {
    if (purchase.downloadCount >= purchase.maxDownloads) {
      this.error.set('Download limit reached for this product');
      return;
    }

    this.downloadingFile.set(fileId);
    this.error.set(null);

    try {
      if (this.guestAccess.isAuthenticated()) {
        // Guest download
        await this.guestAccess.downloadFile(
          purchase.order.downloadToken,
          purchase.product.id,
          fileId
        );
      } else if (this.authService.isSignedIn()) {
        // Clerk user download
        await this.downloadService.downloadFile(purchase.product.id, fileId);
      }
      // Refresh to update download count
      await this.loadPurchases();
    } catch (err: any) {
      this.error.set(err.message || 'Download failed');
    } finally {
      this.downloadingFile.set(null);
    }
  }

  logout() {
    this.guestAccess.logout();
    this.purchases.set([]);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  viewAllPurchases() {
    if (this.authService.isSignedIn()) {
      // Clerk users go to the main library
      window.location.href = this.subdomainService.getMainSiteUrl() + '/library';
    } else if (this.guestAccess.isAuthenticated()) {
      // Guest users go to guest all-purchases page
      window.location.href = this.subdomainService.getMainSiteUrl() + '/guest/purchases';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
