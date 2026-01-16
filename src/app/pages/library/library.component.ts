import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { License } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <!-- Hero Section -->
      <section class="py-8 sm:py-12 lg:py-16 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-8 sm:mb-12">
            <div class="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
              Your Digital Collection
            </div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              My Library
            </h1>
            <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Access all your purchased products and downloads in one place.
            </p>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="pb-20 px-4">
        <div class="max-w-5xl mx-auto">
          @if (loading()) {
            <div class="grid gap-4">
              @for (i of [1, 2, 3]; track i) {
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                  <div class="flex gap-6">
                    <div class="w-28 h-28 bg-gray-100 rounded-xl"></div>
                    <div class="flex-1">
                      <div class="h-6 bg-gray-100 rounded-lg w-1/3 mb-3"></div>
                      <div class="h-4 bg-gray-100 rounded-lg w-1/4 mb-2"></div>
                      <div class="h-4 bg-gray-100 rounded-lg w-1/5"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (licenses().length === 0) {
            <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 lg:p-16 text-center">
              <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                <svg class="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2 sm:mb-3">No purchases yet</h2>
              <p class="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Products you purchase will appear here. Start exploring amazing digital products from creators around the world.
              </p>
              <a routerLink="/" class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 text-sm sm:text-base">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Explore Products
              </a>
            </div>
          } @else {
            <div class="grid gap-3 sm:gap-4">
              @for (license of licenses(); track license.id) {
                <div class="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-4 sm:p-6">
                  <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    @if (license.product.coverImageUrl) {
                      <img [src]="license.product.coverImageUrl" alt="" class="w-full sm:w-24 lg:w-28 h-48 sm:h-24 lg:h-28 object-cover rounded-lg sm:rounded-xl shadow-sm shrink-0">
                    } @else {
                      <div class="w-full sm:w-24 lg:w-28 h-48 sm:h-24 lg:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                    }
                    
                    <div class="flex-1 min-w-0 w-full">
                      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">{{ license.product.title }}</h3>
                      @if (license.product.store) {
                        <p class="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">by {{ license.product.store.name }}</p>
                      }
                      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs">
                        <div class="flex items-center gap-1.5 text-gray-400">
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                          </svg>
                          <span class="font-mono text-xs break-all">{{ license.licenseKey }}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <div class="w-2 h-2 rounded-full shrink-0" [class]="license.downloadCount < license.maxDownloads ? 'bg-green-400' : 'bg-amber-400'"></div>
                          <span class="text-gray-500">{{ license.downloadCount }} / {{ license.maxDownloads }} downloads</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
                      @if (license.product.files && license.product.files.length > 0) {
                        @for (pf of license.product.files; track pf.id) {
                          <button 
                            (click)="download(license.productId, pf.fileId)"
                            [disabled]="downloading() === pf.fileId"
                            class="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all w-full sm:w-auto min-h-[44px]"
                          >
                            @if (downloading() === pf.fileId) {
                              <svg class="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Downloading...</span>
                            } @else {
                              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                              </svg>
                              <span class="truncate">{{ pf.file.filename }}</span>
                            }
                          </button>
                        }
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
})
export class LibraryComponent implements OnInit {
  licenses = signal<License[]>([]);
  loading = signal(true);
  downloading = signal<string | null>(null);

  constructor(
    private checkoutService: CheckoutService,
    private downloadService: DownloadService,
  ) {}

  async ngOnInit() {
    const licenses = await this.checkoutService.getMyLicenses();
    this.licenses.set(licenses);
    this.loading.set(false);
  }

  async download(productId: string, fileId: string) {
    this.downloading.set(fileId);
    try {
      await this.downloadService.downloadFile(productId, fileId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      this.downloading.set(null);
    }
  }
}
