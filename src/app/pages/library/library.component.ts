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
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-8">My Library</h1>

        @if (loading()) {
          <div class="grid gap-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="card p-6 animate-pulse">
                <div class="flex gap-4">
                  <div class="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div class="flex-1">
                    <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (licenses().length === 0) {
          <div class="card p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h2>
            <p class="text-gray-600 mb-6">Products you purchase will appear here.</p>
            <a routerLink="/" class="btn-primary">Explore Products</a>
          </div>
        } @else {
          <div class="grid gap-4">
            @for (license of licenses(); track license.id) {
              <div class="card p-6">
                <div class="flex items-start gap-4">
                  @if (license.product.coverImageUrl) {
                    <img [src]="license.product.coverImageUrl" alt="" class="w-24 h-24 object-cover rounded-lg">
                  } @else {
                    <div class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  }
                  
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900">{{ license.product.title }}</h3>
                    @if (license.product.store) {
                      <p class="text-sm text-gray-500">by {{ license.product.store.name }}</p>
                    }
                    <p class="text-xs text-gray-400 mt-1">
                      License: {{ license.licenseKey }}
                    </p>
                    <p class="text-xs text-gray-400">
                      Downloads: {{ license.downloadCount }} / {{ license.maxDownloads }}
                    </p>
                  </div>

                  <div class="flex flex-col gap-2">
                    @if (license.product.files && license.product.files.length > 0) {
                      @for (pf of license.product.files; track pf.id) {
                        <button 
                          (click)="download(license.productId, pf.fileId)"
                          [disabled]="downloading() === pf.fileId"
                          class="btn-primary text-sm"
                        >
                          @if (downloading() === pf.fileId) {
                            Downloading...
                          } @else {
                            Download {{ pf.file.filename }}
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
