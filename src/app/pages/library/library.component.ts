import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { License } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
            <div class="text-center">
              <!-- Badge -->
              <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#2B57D6] border-2 border-black mb-4 transform -rotate-1">
                <span class="text-xs font-bold text-white uppercase tracking-wider">Collection</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-2xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-2 md:mb-3 leading-tight">
                My Library
              </h1>
              
              <!-- Subtext -->
              <p class="text-sm md:text-lg text-[#111111]/70 max-w-xl mx-auto mb-6 md:mb-8 font-medium">
                Access your purchased digital assets, always available
              </p>

              <!-- Search Bar -->
              <div class="max-w-xl mx-auto mb-8 md:mb-12">
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
                    class="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 bg-white border-2 border-black rounded-xl text-[#111111] placeholder-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FFC60B] focus:border-black shadow-[4px_4px_0px_0px_#000] text-sm md:text-base font-medium transition-all"
                  />
                </div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-8 max-w-2xl mx-auto" *ngIf="!loading()">
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#68E079] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ licenses().length }}</div>
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Products</div>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FFC60B] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getActiveCount() }}</div>
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Active</div>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 rounded-lg md:bg-transparent">
                  <div class="w-6 h-6 md:w-8 md:h-8 bg-[#FA4B28] border border-black rounded-lg flex items-center justify-center">
                    <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </div>
                  <div class="text-center md:text-left">
                    <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ getTotalDownloads() }}</div>
                    <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          @if (loading()) {
            <div class="py-16 flex flex-col items-center justify-center">
              <div class="w-12 h-12 border-4 border-[#FFC60B] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p class="text-[#111111]/60 font-medium">Loading your library...</p>
            </div>
          } @else if (filteredLicenses().length === 0) {
            <!-- Empty State -->
            <div class="text-center py-12 md:py-16">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-[#F9F4EB] border-2 border-black rounded-2xl flex items-center justify-center transform rotate-3">
                <svg class="w-10 h-10 md:w-12 md:h-12 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <h2 class="font-dm-sans text-xl md:text-2xl font-bold text-[#111111] mb-2">
                {{ searchQuery() ? 'No matches found' : 'Your library is empty' }}
              </h2>
              <p class="text-sm md:text-base text-[#111111]/60 max-w-md mx-auto mb-8 font-medium">
                {{ searchQuery() ? 'Try adjusting your search terms' : 'Start your collection by exploring amazing products from our creators.' }}
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
              @for (license of filteredLicenses(); track license.id) {
                <div class="group bg-white border-2 border-black rounded-xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
                  <!-- Card Header (Image + Info) -->
                  <div class="p-3 md:p-4 flex gap-4">
                    <!-- Image -->
                    <div class="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#F9F4EB] border-2 border-black rounded-lg overflow-hidden">
                      @if (license.product.coverImageUrl) {
                        <img 
                          [src]="license.product.coverImageUrl" 
                          [alt]="license.product.title" 
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
                        {{ license.product.title }}
                      </h3>
                      @if (license.product.store) {
                        <div class="flex items-center gap-1.5 mb-2">
                          <span class="text-xs text-[#111111]/60 font-medium truncate">
                            by {{ license.product.store.name }}
                          </span>
                        </div>
                      }
                      
                      <!-- License Key -->
                      <div class="inline-flex items-center px-2 py-1 bg-[#F9F4EB] rounded border border-black/10 max-w-full">
                        <svg class="w-3 h-3 text-[#111111]/40 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                        </svg>
                        <code class="text-[10px] md:text-xs font-mono text-[#111111]/80 truncate select-all">
                          {{ license.licenseKey }}
                        </code>
                      </div>
                    </div>
                  </div>

                  <!-- Downloads Section -->
                  <div class="px-3 md:px-4 pb-3 md:pb-4 border-t-2 border-black/5 pt-3 md:pt-4">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs font-bold text-[#111111] uppercase tracking-wider">Downloads</span>
                      <span class="text-xs font-medium" [class.text-[#FA4B28]]="license.downloadCount >= license.maxDownloads" [class.text-[#68E079]]="license.downloadCount < license.maxDownloads">
                        {{ license.downloadCount }} / {{ license.maxDownloads }} used
                      </span>
                    </div>

                    @if (license.product.files && license.product.files.length > 0) {
                      <div class="space-y-2">
                        @for (pf of license.product.files; track pf.id) {
                          <button 
                            (click)="download(license.productId, pf.fileId)"
                            [disabled]="downloading() === pf.fileId || license.downloadCount >= license.maxDownloads"
                            class="w-full flex items-center justify-between px-3 py-2 bg-white border border-black rounded-lg hover:bg-[#F9F4EB] active:bg-[#F0EBE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          >
                            <div class="flex items-center min-w-0 mr-3">
                              <svg class="w-4 h-4 text-[#111111]/40 mr-2 shrink-0 group-hover/btn:text-[#111111] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              <span class="text-xs font-medium text-[#111111] truncate text-left">
                                {{ pf.file.filename }}
                              </span>
                            </div>

                            @if (downloading() === pf.fileId) {
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
          }
        </div>
      </section>
    </div>
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
export class LibraryComponent implements OnInit {
  licenses = signal<License[]>([]);
  loading = signal(true);
  downloading = signal<string | null>(null);
  searchQuery = signal('');

  filteredLicenses = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.licenses();
    
    return this.licenses().filter(license => 
      license.product.title.toLowerCase().includes(query) ||
      license.product.store?.name.toLowerCase().includes(query)
    );
  });

  constructor(
    private checkoutService: CheckoutService,
    private downloadService: DownloadService,
  ) {}

  private toaster = inject(ToasterService);

  async ngOnInit() {
    try {
      const licenses = await this.checkoutService.getMyLicenses();
      this.licenses.set(licenses);
    } catch (error) {
      console.error('Failed to load library:', error);
      this.toaster.handleError(error, 'Failed to load your library.');
    } finally {
      this.loading.set(false);
    }
  }

  async download(productId: string, fileId: string) {
    this.downloading.set(fileId);
    try {
      await this.downloadService.downloadFile(productId, fileId);
    } catch (error) {
      console.error('Download failed:', error);
      this.toaster.handleError(error, 'Download failed. Please try again.');
    } finally {
      this.downloading.set(null);
    }
  }

  getTotalDownloads(): number {
    return this.licenses().reduce((total, license) => total + license.downloadCount, 0);
  }

  getTotalFiles(): number {
    return this.licenses().reduce((total, license) => {
      return total + (license.product.files?.length || 0);
    }, 0);
  }

  getActiveCount(): number {
    return this.licenses().filter(license => license.downloadCount < license.maxDownloads).length;
  }
}
