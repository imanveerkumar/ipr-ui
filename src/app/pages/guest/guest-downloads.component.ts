import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';

interface GuestOrder {
  id: string;
  guestEmail: string;
  downloadToken: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    id: string;
    titleSnapshot: string;
    product: {
      id: string;
      title: string;
      coverImageUrl?: string;
      files: Array<{
        id: string;
        fileId: string;
        file: {
          id: string;
          filename: string;
          size: number;
        };
      }>;
    };
  }>;
  licenses: Array<{
    id: string;
    licenseKey: string;
    productId: string;
    downloadCount: number;
    maxDownloads: number;
  }>;
}

@Component({
  selector: 'app-guest-downloads',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
          </div>
          <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">Your Downloads</h1>
          <p class="text-gray-600">Access your purchased files below</p>
        </div>

        @if (loading()) {
          <!-- Loading State -->
          <div class="card p-8">
            <div class="animate-pulse space-y-4">
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="h-24 bg-gray-200 rounded"></div>
              <div class="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        } @else if (error()) {
          <!-- Error State -->
          <div class="card p-12 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ error() }}</h2>
            <p class="text-gray-600 mb-6">
              This download link may be invalid or expired. Please check your email for the correct link.
            </p>
            <a routerLink="/" class="btn-primary">Go to Homepage</a>
          </div>
        } @else if (order()) {
          <!-- Order Details -->
          <div class="card p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm text-gray-500">Order ID</p>
                <p class="font-mono text-gray-900">{{ order()!.id }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Total Paid</p>
                <p class="text-xl font-bold text-gray-900">₹{{ order()!.totalAmount / 100 }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Payment Verified</span>
            </div>
          </div>

          <!-- Products -->
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Files</h2>
          <div class="space-y-4">
            @for (item of order()!.items; track item.id) {
              <div class="card p-6">
                <div class="flex items-start gap-4">
                  <!-- Product Image -->
                  @if (item.product.coverImageUrl) {
                    <img 
                      [src]="item.product.coverImageUrl" 
                      [alt]="item.product.title"
                      class="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    >
                  } @else {
                    <div class="w-20 h-20 bg-gradient-to-br from-[#b8e6c9] to-[#d8f8e0] rounded-xl flex-shrink-0 flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  }

                  <!-- Product Details -->
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ item.product.title }}</h3>
                    
                    <!-- License Info -->
                    @if (getLicenseForProduct(item.product.id); as license) {
                      <p class="text-xs text-gray-500 mb-3">
                        Downloads: {{ license.downloadCount }} / {{ license.maxDownloads }}
                      </p>
                    }

                    <!-- Download Buttons -->
                    @if (item.product.files && item.product.files.length > 0) {
                      <div class="flex flex-wrap gap-2">
                        @for (pf of item.product.files; track pf.id) {
                          <button 
                            (click)="downloadFile(item.product.id, pf.fileId, pf.file.filename)"
                            [disabled]="downloading() === pf.fileId"
                            class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            @if (downloading() === pf.fileId) {
                              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Downloading...</span>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                              </svg>
                              <span>{{ pf.file.filename }}</span>
                              <span class="text-xs text-gray-400">({{ formatFileSize(pf.file.size) }})</span>
                            }
                          </button>
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-gray-500">No files available</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="mt-8 p-6 bg-white rounded-2xl border border-gray-100 text-center">
            <p class="text-gray-600 mb-4">
              Want to manage all your purchases in one place?
            </p>
            <a routerLink="/signup" class="btn-primary">Create an Account</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-colors;
    }
    .card {
      @apply bg-white rounded-2xl border border-gray-100 shadow-sm;
    }
  `]
})
export class GuestDownloadsComponent implements OnInit {
  order = signal<GuestOrder | null>(null);
  loading = signal(true);
  error = signal<string>('');
  downloading = signal<string | null>(null);

  private downloadToken: string = '';

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private downloadService: DownloadService,
  ) {}

  async ngOnInit() {
    this.downloadToken = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.downloadToken) {
      this.error.set('Invalid download link');
      this.loading.set(false);
      return;
    }

    try {
      const order = await this.checkoutService.getGuestOrder(this.downloadToken);
      if (order) {
        this.order.set(order as unknown as GuestOrder);
      } else {
        this.error.set('Order not found');
      }
    } catch (err: any) {
      console.error('Failed to load order:', err);
      this.error.set(err.message || 'Failed to load your purchase');
    } finally {
      this.loading.set(false);
    }
  }

  getLicenseForProduct(productId: string) {
    const order = this.order();
    if (!order) return null;
    return order.licenses.find(l => l.productId === productId);
  }

  async downloadFile(productId: string, fileId: string, filename: string) {
    this.downloading.set(fileId);
    try {
      await this.downloadService.downloadGuestFile(this.downloadToken, productId, fileId);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      this.downloading.set(null);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
