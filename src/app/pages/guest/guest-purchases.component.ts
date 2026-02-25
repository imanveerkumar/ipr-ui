import { Component, OnInit, signal, inject, ViewChild, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuestAccessService, GuestPurchase } from '../../core/services/guest-access.service';
import { AuthService } from '../../core/services/auth.service';
import { PurchasesAuthModalComponent } from '../../shared/components/purchases-auth-modal.component';
import { PurchaseDetailsModalComponent } from '../../shared/components/purchase-details-modal/purchase-details-modal.component';

@Component({
  selector: 'app-guest-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PurchasesAuthModalComponent, PurchaseDetailsModalComponent],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div class="text-left">
              
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-0 md:mb-1 leading-tight">
                Guest Purchases
              </h1>
              
              <!-- Stats (below heading) -->
              <div class="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:flex md:justify-start md:gap-8 max-w-2xl mx-auto md:mx-0">
                <!-- Products stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#68E079] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ purchases().length }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Products</div>
                  </div>
                </div>
                <!-- Active stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FFC60B] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getActiveCount() }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Active</div>
                  </div>
                </div>
                <!-- Downloads stat -->
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FA4B28] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    @if (!loading()) {
                      <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getTotalDownloads() }}</div>
                    } @else {
                      <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                    }
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Downloads</div>
                  </div>
                </div>
              </div>

              <!-- Search Bar (below stats) -->
              <div class="mt-4 max-w-xl mx-auto md:mx-0 mb-8 md:mb-12">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 md:w-5 md:h-5 text-[#111111]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    placeholder="Search purchased products..."
                    class="w-full pl-10 md:pl-12 pr-24 py-3 md:py-3.5 bg-white border-2 border-black rounded-none text-[#111111] placeholder-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] focus:border-black shadow-[4px_4px_0px_0px_#000] text-sm md:text-base font-medium transition-all"
                  />
                  <button
                    (click)="performSearch()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-2 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-none font-bold text-xs sm:text-sm hover:bg-[#ffdb4d] transition-all duration-200 shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px]"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          @if (!guestAccess.isAuthenticated()) {
            <!-- Not Authenticated -->
            <div class="bg-white rounded-2xl sm:rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_#000] p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div class="w-20 h-20 sm:w-24 sm:h-24 bg-[#F9F4EB] border-2 border-black rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 transform rotate-3">
                <svg class="w-10 h-10 sm:w-12 sm:h-12 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-display font-bold text-[#111111] mb-2 sm:mb-3">Access Your Purchases</h2>
              <p class="text-sm sm:text-base text-[#111111]/60 mb-6 sm:mb-8 max-w-md mx-auto px-4 font-medium">
                Enter the email or phone number you used during checkout to access your purchased products.
              </p>
              <button 
                (click)="openAccessModal()"
                class="inline-flex items-center gap-2 bg-[#FFC60B] text-[#111111] border-2 border-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-sm sm:text-base min-h-[48px]"
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
                <div class="w-10 h-10 rounded-full bg-[#F9F4EB] border-2 border-black flex items-center justify-center">
                  <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-[#111111]">{{ guestAccess.identifier() }}</p>
                  <p class="text-sm text-[#111111]/60 font-medium">Guest access</p>
                </div>
              </div>
              <button 
                (click)="logout()"
                class="text-sm text-[#111111] font-bold px-4 py-2 border-2 border-black rounded-lg hover:bg-[#F9F4EB] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Sign Out
              </button>
            </div>

            @if (loading()) {
              <!-- Loading Skeleton -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="bg-white border-2 border-black rounded-xl overflow-hidden">
                    <div class="p-3 md:p-4 flex gap-4">
                      <div class="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#F9F4EB] border-2 border-black rounded-lg animate-pulse"></div>
                      <div class="flex-1 min-w-0">
                        <div class="h-4 md:h-5 bg-[#111111]/10 rounded animate-pulse w-3/4 mb-2"></div>
                        <div class="h-3 bg-[#111111]/5 rounded animate-pulse w-1/2 mb-3"></div>
                        <div class="h-6 w-32 bg-[#F9F4EB] rounded border border-black/10 animate-pulse"></div>
                      </div>
                    </div>
                    <div class="px-3 md:px-4 pb-3 md:pb-4 border-t-2 border-black/5 pt-3 md:pt-4">
                      <div class="flex items-center justify-between mb-3">
                        <div class="h-3 w-20 bg-[#111111]/10 rounded animate-pulse"></div>
                        <div class="h-3 w-16 bg-[#68E079]/30 rounded animate-pulse"></div>
                      </div>
                      <div class="h-10 bg-[#F9F4EB] border border-black rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (filteredPurchases().length === 0) {
              <!-- Empty State -->
              <div class="text-center py-12 md:py-16">
                <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center transform rotate-3">
                  <svg class="w-10 h-10 md:w-12 md:h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
                <h2 class="font-dm-sans text-xl md:text-2xl font-bold text-[#111111] mb-2">
                  {{ searchQuery() ? 'No matches found' : 'No purchases yet' }}
                </h2>
                <p class="text-sm md:text-base text-[#111111]/60 max-w-md mx-auto mb-8 font-medium">
                  {{ searchQuery() ? 'Try adjusting your search terms' : 'Products you purchase will appear here. Start exploring amazing digital products from creators around the world.' }}
                </p>
                @if (!searchQuery()) {
                  <a routerLink="/explore" class="inline-flex items-center px-6 py-3 bg-[#FFC60B] border-2 border-black rounded-lg font-bold text-[#111111] hover:bg-[#ffdb4d] transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                    Explore Products
                  </a>
                }
              </div>
            } @else {
              <!-- Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                @for (purchase of filteredPurchases(); track purchase.id) {
                  <div 
                    (click)="openPurchaseDetails(purchase)"
                    class="group bg-white border-2 border-black rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <!-- Card Header (Image + Info) -->
                    <div class="p-3 md:p-4 flex gap-4">
                      <!-- Image -->
                      <div class="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#F9F4EB] border-2 border-black rounded-lg overflow-hidden">
                        @if (purchase.product.thumbnailUrl) {
                          <img 
                            [src]="purchase.product.thumbnailUrl" 
                            [alt]="purchase.product.title" 
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        } @else {
                          <div class="w-full h-full flex items-center justify-center">
                            <svg class="w-8 h-8 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        }
                      </div>

                      <!-- Info -->
                      <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-[#111111] text-sm md:text-base leading-tight mb-1 line-clamp-2">
                          {{ purchase.product.title }}
                        </h3>
                        @if (purchase.product.store) {
                          <div class="flex items-center gap-1.5 mb-2">
                            <span class="text-xs text-[#111111]/60 font-medium truncate">
                              by {{ purchase.product.store.name }}
                            </span>
                          </div>
                        }
                        
                        <!-- License Key -->
                        <div class="inline-flex items-center px-2 py-1 bg-[#F9F4EB] rounded border border-black/10 max-w-full">
                          <svg class="w-3 h-3 text-[#111111]/40 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                          </svg>
                          <code class="text-[10px] md:text-xs font-mono text-[#111111]/80 truncate select-all">
                            {{ purchase.licenseKey }}
                          </code>
                        </div>
                      </div>
                    </div>

                    <!-- Downloads Section -->
                    <div class="px-3 md:px-4 pb-3 md:pb-4 border-t-2 border-black/5 pt-3 md:pt-4">
                      <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold text-[#111111] uppercase tracking-wider">Downloads</span>
                        <span class="text-xs font-medium" [class.text-[#FA4B28]]="purchase.downloadCount >= purchase.maxDownloads" [class.text-[#68E079]]="purchase.downloadCount < purchase.maxDownloads">
                          {{ purchase.downloadCount }} / {{ purchase.maxDownloads }} used
                        </span>
                      </div>

                      @if (purchase.product.files && purchase.product.files.length > 0) {
                        <div class="space-y-2">
                          @for (pf of purchase.product.files; track pf.id) {
                            <button 
                              (click)="download(purchase, pf.id); $event.stopPropagation()"
                              [disabled]="downloading() === pf.id || purchase.downloadCount >= purchase.maxDownloads"
                              class="w-full flex items-center justify-between px-3 py-2 bg-white border border-black rounded-lg hover:bg-[#F9F4EB] active:bg-[#F0EBE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                            >
                              <div class="flex items-center min-w-0 mr-3">
                                <svg class="w-4 h-4 text-[#111111]/40 mr-2 shrink-0 group-hover/btn:text-[#111111] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                <span class="text-xs font-medium text-[#111111] truncate text-left">
                                  {{ pf.filename }}
                                </span>
                              </div>

                              @if (downloading() === pf.id) {
                                <svg class="w-4 h-4 animate-spin text-[#111111]" fill="none" viewBox="0 0 24 24">
                                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              } @else {
                                <svg class="w-4 h-4 text-[#111111] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                              }
                            </button>
                          }
                        </div>
                      } @else {
                         <div class="text-xs text-[#111111]/50 italic text-center py-2">
                           No files available
                         </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Create Account Prompt -->
              <div class="mt-8 p-6 bg-[#F9F4EB] border-2 border-black rounded-2xl text-center max-w-2xl mx-auto">
                <h3 class="font-bold text-[#111111] mb-2">Want easier access?</h3>
                <p class="text-sm text-[#111111]/60 mb-4 font-medium">Create an account to manage all your purchases and access them from any device.</p>
                <button (click)="signUp()" class="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm min-h-[48px] shadow-[4px_4px_0px_0px_#FFC60B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                  Create Account
                </button>
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

    <!-- Purchase Details Modal -->
    <app-purchase-details-modal
      #detailsModal
      (download)="onModalDownload($event)"
    />
  `,
  styles: [`
    :host {
      display: block;
    }
    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class GuestPurchasesComponent implements OnInit {
  @ViewChild('accessModal') accessModal!: PurchasesAuthModalComponent;
  @ViewChild('detailsModal') detailsModal!: PurchaseDetailsModalComponent;

  guestAccess = inject(GuestAccessService);
  authService = inject(AuthService);
  
  loading = signal(false);
  purchases = signal<GuestPurchase[]>([]);
  downloading = signal<string | null>(null);
  searchQuery = signal('');

  filteredPurchases = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.purchases();
    
    return this.purchases().filter(purchase => 
      purchase.product.title.toLowerCase().includes(query) ||
      purchase.product.store?.name.toLowerCase().includes(query)
    );
  });

  constructor() {
    effect(() => {
      if (this.guestAccess.isAuthenticated()) {
        this.loadPurchases();
      }
    });
  }

  ngOnInit() {
  }

  openAccessModal() {
    this.accessModal.open();
  }

  openPurchaseDetails(purchase: GuestPurchase) {
    this.detailsModal.open(purchase);
  }

  async signUp() {
    await this.authService.openCreatorSignup();
  }

  async onAuthenticated(event: { type: 'guest' | 'clerk' }) {
    if (event.type === 'clerk') {
      // Redirect to library for Clerk users
      window.location.href = '/library';
      return;
    }
    // The effect will automatically trigger loadPurchases when isAuthenticated becomes true
  }

  async loadPurchases() {
    this.loading.set(true);
    try {
      // Fetch all purchases (no store filter)
      const allPurchases = await this.guestAccess.fetchPurchases();
      this.purchases.set(allPurchases);
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
      
      // Update modal if it's open
      if (this.detailsModal.isOpen()) {
        const updatedPurchase = this.purchases().find(p => p.id === purchase.id);
        if (updatedPurchase) {
          this.detailsModal.purchase.set(updatedPurchase);
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      this.downloading.set(null);
    }
  }

  onModalDownload(event: {purchase: any, fileId: string}) {
    this.detailsModal.setDownloading(event.fileId);
    this.download(event.purchase, event.fileId).finally(() => {
      this.detailsModal.setDownloading(null);
    });
  }

  logout() {
    this.guestAccess.logout();
    this.purchases.set([]);
  }

  getTotalDownloads(): number {
    return this.purchases().reduce((total, purchase) => total + purchase.downloadCount, 0);
  }

  getActiveCount(): number {
    return this.purchases().filter(purchase => purchase.downloadCount < purchase.maxDownloads).length;
  }

  performSearch() {
    // Trim whitespace to make searches consistent and trigger computed filtering
    this.searchQuery.set(this.searchQuery().trim());
  }
}
