import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GuestAccessService, GuestPurchase } from '../../core/services/guest-access.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreContextService } from '../../core/services/store-context.service';
import { GuestAccessModalComponent } from '../../shared/components/guest-access-modal.component';

@Component({
  selector: 'app-storefront-purchases',
  standalone: true,
  imports: [CommonModule, GuestAccessModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">My Purchases</h1>
              <p class="text-sm text-gray-500 mt-1">
                @if (guestAccess.isAuthenticated()) {
                  {{ guestAccess.identifier() }}
                } @else if (authService.isSignedIn()) {
                  {{ authService.user()?.email }}
                } @else {
                  Access your purchased products
                }
              </p>
            </div>
            @if (guestAccess.isAuthenticated()) {
              <button 
                (click)="logout()"
                class="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Sign Out
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        @if (!isAuthenticated()) {
          <!-- Not Authenticated State -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Access Your Purchases</h2>
            <p class="text-gray-600 mb-6 max-w-sm mx-auto">
              Enter the email or phone number you used during checkout to access your purchased products.
            </p>
            <button 
              (click)="openAccessModal()"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Verify to Access
            </button>
          </div>
        } @else if (loading()) {
          <!-- Loading State -->
          <div class="space-y-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div class="flex gap-4">
                  <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
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
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">No Purchases Found</h2>
            <p class="text-gray-600 mb-6">
              We couldn't find any purchases associated with this {{ guestAccess.identifierType() }}.
            </p>
            <button 
              (click)="goBack()"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </button>
          </div>
        } @else {
          <!-- Purchases List -->
          <div class="space-y-4">
            @for (purchase of purchases(); track purchase.id) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <!-- Product Info -->
                <div class="p-6">
                  <div class="flex gap-4">
                    <!-- Thumbnail -->
                    <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      @if (purchase.product.thumbnailUrl) {
                        <img 
                          [src]="purchase.product.thumbnailUrl" 
                          [alt]="purchase.product.title"
                          class="w-full h-full object-cover"
                        >
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      }
                    </div>

                    <!-- Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <div>
                          <h3 class="font-bold text-gray-900 text-base sm:text-lg truncate">{{ purchase.product.title }}</h3>
                          <p class="text-sm text-gray-500 mt-0.5">
                            by {{ purchase.product.store.name }}
                          </p>
                        </div>
                        <div class="sm:text-right flex-shrink-0 mt-1 sm:mt-0">
                          <p class="text-xs sm:text-sm text-gray-500">
                            Purchased {{ formatDate(purchase.order.paidAt) }}
                          </p>
                        </div>
                      </div>

                      <!-- License Info -->
                      <div class="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Active License
                        </span>
                        <span class="text-gray-500">
                          {{ purchase.downloadCount }}/{{ purchase.maxDownloads }} downloads used
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Files Section -->
                @if (purchase.product.files.length > 0) {
                  <div class="border-t border-gray-100 bg-gray-50/50 p-4">
                    <p class="text-sm font-medium text-gray-700 mb-3">
                      {{ purchase.product.files.length }} file{{ purchase.product.files.length > 1 ? 's' : '' }} included
                    </p>
                    <div class="space-y-2">
                      @for (file of purchase.product.files; track file.id) {
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl p-3 border border-gray-100 gap-3">
                          <div class="flex items-center gap-3 min-w-0">
                            <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                            </div>
                            <div class="min-w-0">
                              <p class="text-sm font-medium text-gray-900 truncate">{{ file.filename }}</p>
                              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                            </div>
                          </div>
                          <button 
                            (click)="downloadFile(purchase, file.id)"
                            [disabled]="downloadingFile() === file.id || purchase.downloadCount >= purchase.maxDownloads"
                            class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0"
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
                            Download
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

    <!-- Guest Access Modal -->
    <app-guest-access-modal 
      #accessModal
      mode="purchases"
      (authenticated)="onAuthenticated()"
    />
  `
})
export class StorefrontPurchasesComponent implements OnInit {
  @ViewChild('accessModal') accessModal!: GuestAccessModalComponent;

  guestAccess = inject(GuestAccessService);
  authService = inject(AuthService);
  private storeContext = inject(StoreContextService);
  private router = inject(Router);

  loading = signal(false);
  purchases = signal<GuestPurchase[]>([]);
  downloadingFile = signal<string | null>(null);
  error = signal<string | null>(null);

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

  async onAuthenticated() {
    await this.loadPurchases();
  }

  async loadPurchases() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const purchases = await this.guestAccess.fetchPurchases();
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
      await this.guestAccess.downloadFile(
        purchase.order.downloadToken,
        purchase.product.id,
        fileId
      );
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

  goBack() {
    this.router.navigate(['/products']);
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
