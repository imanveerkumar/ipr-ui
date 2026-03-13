import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';
import { DownloadService } from '../../core/services/download.service';
import { ToasterService } from '../../core/services/toaster.service';

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
    <div class="min-h-screen bg-theme-surface font-sans antialiased">

      <!-- Hero Header -->
      <section class="relative overflow-hidden">
        <div class="bg-theme-secondary border-b-2 border-theme-border">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-12 md:pb-14">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-theme-success border-2 border-theme-border flex items-center justify-center flex-shrink-0 shadow-[3px_3px_0px_0px_#000]">
                <svg class="w-6 h-6 md:w-8 md:h-8 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </div>
              <div>
                <h1 class="font-display tracking-tighter text-3xl md:text-5xl font-bold text-theme-fg mb-1 leading-tight">
                  Your Free Downloads
                </h1>
                <p class="text-[#111111]/60 font-medium text-sm md:text-base">
                  Access your free downloads below
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        @if (loading()) {
          <!-- Loading State -->
          <div class="bg-theme-surface border-2 border-theme-border p-6 shadow-[4px_4px_0px_0px_#000] animate-pulse space-y-4">
            <div class="h-5 bg-[#111111]/10 rounded w-1/3"></div>
            <div class="h-24 bg-[#111111]/10 rounded"></div>
            <div class="h-24 bg-[#111111]/10 rounded"></div>
          </div>

        } @else if (error()) {
          <!-- Error State -->
          <div class="bg-theme-surface border-2 border-theme-border p-10 md:p-14 text-center shadow-[6px_6px_0px_0px_#FA4B28]">
            <div class="w-16 h-16 bg-theme-danger border-2 border-theme-border flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 class="font-display text-xl md:text-2xl font-bold text-theme-fg mb-2">{{ error() }}</h2>
            <p class="text-[#111111]/60 font-medium mb-8 max-w-md mx-auto">
              This download link may be invalid or expired. Please check your email for the correct link.
            </p>
            <a routerLink="/" class="inline-flex items-center justify-center px-8 py-3 bg-theme-accent text-theme-fg border-2 border-theme-border font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
              Go to Homepage
            </a>
          </div>

        } @else if (order()) {
          <!-- Order Summary Card -->
          <div class="bg-theme-surface border-2 border-theme-border p-5 md:p-6 mb-6 shadow-[4px_4px_0px_0px_#000]">
            <div class="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p class="text-xs font-bold text-[#111111]/50 uppercase tracking-widest mb-1">Order ID</p>
                <p class="font-mono text-sm font-bold text-theme-fg">{{ order()!.id }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-[#111111]/50 uppercase tracking-widest mb-1">Total Paid</p>
                <p class="text-2xl font-display font-bold text-theme-fg">₹{{ order()!.totalAmount / 100 }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm font-bold text-theme-fg bg-theme-success border-2 border-theme-border px-3 py-2 w-fit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Payment Verified</span>
            </div>
          </div>

          <!-- Section Heading -->
          <h2 class="font-display tracking-tight text-xl font-bold text-theme-fg mb-4">Your Files</h2>

          <!-- Products -->
          <div class="space-y-4">
            @for (item of order()!.items; track item.id) {
              <div class="bg-theme-surface border-2 border-theme-border p-5 md:p-6 shadow-[4px_4px_0px_0px_#000]">
                <div class="flex items-start gap-4">
                  <!-- Product Image -->
                  @if (item.product.coverImageUrl) {
                    <img 
                      [src]="item.product.coverImageUrl" 
                      [alt]="item.product.title"
                      class="w-20 h-20 object-cover border-2 border-theme-border flex-shrink-0"
                    >
                  } @else {
                    <div class="w-20 h-20 bg-theme-secondary border-2 border-theme-border flex-shrink-0 flex items-center justify-center">
                      <svg class="w-8 h-8 text-[#111111]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  }

                  <!-- Product Details -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-display font-bold text-theme-fg text-base md:text-lg mb-1 leading-snug">{{ item.product.title }}</h3>

                    <!-- License Info -->
                    @if (getLicenseForProduct(item.product.id); as license) {
                      <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-theme-secondary border border-theme-border text-xs font-bold text-[#111111]/70 mb-3">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                        {{ license.downloadCount }} / {{ license.maxDownloads }} downloads used
                      </div>
                    }

                    <!-- Download Buttons -->
                    @if (item.product.files && item.product.files.length > 0) {
                      <div class="flex flex-wrap gap-2 mt-2">
                        @for (pf of item.product.files; track pf.id) {
                          <button 
                            (click)="downloadFile(item.product.id, pf.fileId, pf.file.filename)"
                            [disabled]="downloading() === pf.fileId"
                            class="inline-flex items-center gap-2 px-4 py-2.5 bg-theme-accent text-theme-fg border-2 border-theme-border text-sm font-bold shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[3px_3px_0px_0px_#000] transition-all"
                          >
                            @if (downloading() === pf.fileId) {
                              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Downloading...</span>
                            } @else {
                              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                              </svg>
                              <span class="truncate max-w-[160px]">{{ pf.file.filename }}</span>
                              <span class="text-xs font-medium text-[#111111]/60 whitespace-nowrap">{{ formatFileSize(pf.file.size) }}</span>
                            }
                          </button>
                        }
                      </div>
                    } @else {
                      <p class="text-sm font-medium text-[#111111]/50">No files available</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer CTA -->
          <div class="mt-8 bg-theme-secondary border-2 border-theme-border p-6 md:p-8 text-center shadow-[4px_4px_0px_0px_#000]">
            <p class="font-display font-bold text-theme-fg text-lg mb-1">Want to manage all your purchases?</p>
            <p class="text-[#111111]/60 text-sm font-medium mb-6">Create an account and keep track of everything in one place.</p>
            <a routerLink="/signup" class="inline-flex items-center justify-center px-8 py-3 bg-theme-accent text-theme-fg border-2 border-theme-border font-bold shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
              Create an Account
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class GuestDownloadsComponent implements OnInit {
  order = signal<GuestOrder | null>(null);
  loading = signal(true);
  error = signal<string>('');
  downloading = signal<string | null>(null);

  private downloadToken: string = '';
  private toaster = inject(ToasterService);

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
      this.toaster.handleError(error, 'Download failed. Please try again.');
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
