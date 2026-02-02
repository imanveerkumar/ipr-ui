import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GuestAccessService, GuestPurchase } from '../../core/services/guest-access.service';
import { PurchasesAuthModalComponent } from '../../shared/components/purchases-auth-modal.component';

@Component({
  selector: 'app-guest-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink, PurchasesAuthModalComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <!-- Hero Section -->
      <section class="py-8 sm:py-12 lg:py-16 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-8 sm:mb-12">
            <div class="inline-flex items-center gap-2 bg-gradient-to-r from-[#b8e6c9] to-[#d8f8e0] text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
              Guest Purchases
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              My Purchases
            </h1>
            <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Access all your purchased products from any store in one place.
            </p>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="pb-20 px-4">
        <div class="max-w-5xl mx-auto">
          @if (!guestAccess.isAuthenticated()) {
            <!-- Not Authenticated -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
              <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2 sm:mb-3">Access Your Purchases</h2>
              <p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Enter the email or phone number you used during checkout to access your purchased products.
              </p>
              <button 
                (click)="openAccessModal()"
                class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base min-h-[48px]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Verify to Access
              </button>
            </div>
          } @else {
            <!-- Authenticated Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ guestAccess.identifier() }}</p>
                  <p class="text-sm text-gray-500">Guest access</p>
                </div>
              </div>
              <button 
                (click)="logout()"
                class="text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>

            @if (loading()) {
              <!-- Loading -->
              <div class="grid gap-4">
                @for (i of [1, 2, 3]; track i) {
                  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
                    <div class="flex gap-4">
                      <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl"></div>
                      <div class="flex-1">
                        <div class="h-5 bg-gray-100 rounded-lg w-1/3 mb-3"></div>
                        <div class="h-4 bg-gray-100 rounded-lg w-1/4 mb-2"></div>
                        <div class="h-4 bg-gray-100 rounded-lg w-1/5"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (purchases().length === 0) {
              <!-- Empty State -->
              <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 lg:p-16 text-center">
                <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                  <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h2 class="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2 sm:mb-3">No purchases yet</h2>
                <p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                  Products you purchase will appear here. Start exploring amazing digital products from creators around the world.
                </p>
                <a routerLink="/" class="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base min-h-[48px]">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Explore Products
                </a>
              </div>
            } @else {
              <!-- Purchases by Store -->
              @for (storeGroup of groupedPurchases(); track storeGroup.store.id) {
                <div class="mb-8">
                  <!-- Store Header -->
                  <div class="flex items-center gap-3 mb-4">
                    @if (storeGroup.store.logoUrl) {
                      <img [src]="storeGroup.store.logoUrl" [alt]="storeGroup.store.name" class="w-10 h-10 rounded-xl object-cover">
                    } @else {
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] flex items-center justify-center">
                        <span class="text-sm font-bold text-gray-800">{{ storeGroup.store.name.charAt(0).toUpperCase() }}</span>
                      </div>
                    }
                    <div>
                      <h2 class="font-semibold text-gray-900">{{ storeGroup.store.name }}</h2>
                      <p class="text-xs text-gray-500">{{ storeGroup.purchases.length }} product{{ storeGroup.purchases.length > 1 ? 's' : '' }}</p>
                    </div>
                  </div>

                  <!-- Products -->
                  <div class="grid gap-3 sm:gap-4">
                    @for (purchase of storeGroup.purchases; track purchase.id) {
                      <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden">
                        <div class="p-4 sm:p-5">
                          <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            @if (purchase.product.thumbnailUrl) {
                              <img [src]="purchase.product.thumbnailUrl" alt="" class="w-full sm:w-20 h-40 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow-sm shrink-0">
                            } @else {
                              <div class="w-full sm:w-20 h-40 sm:h-20 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                <svg class="w-8 h-8 text-gray-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                              </div>
                            }
                            
                            <div class="flex-1 min-w-0 w-full">
                              <h3 class="text-sm sm:text-base font-semibold text-gray-900 mb-1">{{ purchase.product.title }}</h3>
                              <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mb-3">
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-lg">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  Active
                                </span>
                                <span class="text-gray-500">{{ purchase.downloadCount }}/{{ purchase.maxDownloads }} downloads</span>
                              </div>

                              <!-- Files -->
                              @if (purchase.product.files && purchase.product.files.length > 0) {
                                <div class="flex flex-wrap gap-2">
                                  @for (file of purchase.product.files; track file.id) {
                                    <button 
                                      (click)="download(purchase, file.id)"
                                      [disabled]="downloading() === file.id || purchase.downloadCount >= purchase.maxDownloads"
                                      class="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[40px] sm:min-h-[44px]"
                                    >
                                      @if (downloading() === file.id) {
                                        <svg class="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Downloading...</span>
                                      } @else {
                                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                        </svg>
                                        <span class="truncate max-w-[150px]">{{ file.filename }}</span>
                                      }
                                    </button>
                                  }
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Create Account Prompt -->
              <div class="mt-8 p-6 bg-gradient-to-br from-[#fff3d0] to-[#fffbeb] rounded-2xl text-center">
                <h3 class="font-semibold text-gray-900 mb-2">Want easier access?</h3>
                <p class="text-sm text-gray-600 mb-4">Create an account to manage all your purchases and access them from any device.</p>
                <a routerLink="/signup" class="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm min-h-[48px]">
                  Create Account
                </a>
              </div>
            }
          }
        </div>
      </section>
    </div>

    <!-- Auth Modal -->
    <app-purchases-auth-modal 
      #accessModal
      (authenticated)="onAuthenticated($event)"
    />
  `
})
export class GuestPurchasesComponent implements OnInit {
  @ViewChild('accessModal') accessModal!: PurchasesAuthModalComponent;

  guestAccess = inject(GuestAccessService);
  
  loading = signal(false);
  purchases = signal<GuestPurchase[]>([]);
  downloading = signal<string | null>(null);

  // Group purchases by store
  groupedPurchases = signal<Array<{
    store: { id: string; name: string; slug: string; logoUrl: string | null };
    purchases: GuestPurchase[];
  }>>([]);

  ngOnInit() {
    if (this.guestAccess.isAuthenticated()) {
      this.loadPurchases();
    }
  }

  openAccessModal() {
    this.accessModal.open();
  }

  async onAuthenticated(event: { type: 'guest' | 'clerk' }) {
    if (event.type === 'clerk') {
      // Redirect to library for Clerk users
      window.location.href = '/library';
      return;
    }
    await this.loadPurchases();
  }

  async loadPurchases() {
    this.loading.set(true);
    try {
      // Fetch all purchases (no store filter)
      const allPurchases = await this.guestAccess.fetchPurchases();
      this.purchases.set(allPurchases);
      
      // Group by store
      const storeMap = new Map<string, {
        store: { id: string; name: string; slug: string; logoUrl: string | null };
        purchases: GuestPurchase[];
      }>();

      for (const purchase of allPurchases) {
        const storeId = purchase.product.store.id;
        if (!storeMap.has(storeId)) {
          storeMap.set(storeId, {
            store: purchase.product.store,
            purchases: [],
          });
        }
        storeMap.get(storeId)!.purchases.push(purchase);
      }

      this.groupedPurchases.set(Array.from(storeMap.values()));
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async download(purchase: GuestPurchase, fileId: string) {
    if (purchase.downloadCount >= purchase.maxDownloads) {
      return;
    }

    this.downloading.set(fileId);
    try {
      await this.guestAccess.downloadFile(
        purchase.order.downloadToken,
        purchase.product.id,
        fileId
      );
      // Refresh to update download count
      await this.loadPurchases();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      this.downloading.set(null);
    }
  }

  logout() {
    this.guestAccess.logout();
    this.purchases.set([]);
    this.groupedPurchases.set([]);
  }
}
