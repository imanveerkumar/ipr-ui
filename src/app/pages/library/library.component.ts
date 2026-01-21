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
    <div class="page-wrapper">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="padding-global">
          <div class="hero-card">
            <div class="max-w-4xl mx-auto text-center py-12 md:py-16 lg:py-20 px-4">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm mb-6">
                <svg class="w-4 h-4 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
                <span class="text-sm font-medium text-gray-800">Your Digital Collection</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight uppercase tracking-tight">
                My Library
              </h1>
              
              <!-- Subtext -->
              <p class="text-base md:text-lg lg:text-xl text-gray-700/80 max-w-xl mx-auto">
                Access all your purchased products and downloads in one place. Your digital assets, always available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="content-section">
        <div class="padding-global">
          <div class="max-w-5xl mx-auto">
            @if (loading()) {
              <!-- Loading Skeletons -->
              <div class="space-y-4">
                @for (i of [1, 2, 3]; track i) {
                  <div class="product-card animate-pulse">
                    <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div class="w-full sm:w-32 h-48 sm:h-32 bg-gray-200/60 rounded-xl"></div>
                      <div class="flex-1 space-y-3">
                        <div class="h-6 bg-gray-200/60 rounded-lg w-2/3"></div>
                        <div class="h-4 bg-gray-200/60 rounded-lg w-1/3"></div>
                        <div class="h-4 bg-gray-200/60 rounded-lg w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (licenses().length === 0) {
              <!-- Empty State -->
              <div class="empty-state-card">
                <div class="text-center py-8 md:py-12 lg:py-16 px-4">
                  <div class="icon-container mx-auto mb-6">
                    <svg class="w-12 h-12 md:w-14 md:h-14 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <h2 class="font-dm-sans text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    No purchases yet
                  </h2>
                  <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-md mx-auto mb-8">
                    Products you purchase will appear here. Start exploring amazing digital products from creators around the world.
                  </p>
                  <a routerLink="/" class="btn-primary">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    Explore Products
                  </a>
                </div>
                
                <!-- Decorative elements -->
                <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl"></div>
                <div class="absolute -top-6 -right-6 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl"></div>
              </div>
            } @else {
              <!-- Products List -->
              <div class="space-y-4">
                @for (license of licenses(); track license.id) {
                  <div class="product-card group">
                    <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <!-- Product Image -->
                      @if (license.product.coverImageUrl) {
                        <img 
                          [src]="license.product.coverImageUrl" 
                          alt="" 
                          class="w-full sm:w-32 md:w-36 h-48 sm:h-32 md:h-36 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow shrink-0"
                        >
                      } @else {
                        <div class="w-full sm:w-32 md:w-36 h-48 sm:h-32 md:h-36 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center shrink-0">
                          <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </div>
                      }
                      
                      <!-- Product Info -->
                      <div class="flex-1 min-w-0 w-full">
                        <h3 class="font-dm-sans text-lg sm:text-xl font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                          {{ license.product.title }}
                        </h3>
                        @if (license.product.store) {
                          <p class="text-sm text-gray-500 mb-3">by {{ license.product.store.name }}</p>
                        }
                        
                        <!-- Meta Info -->
                        <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5">
                          <div class="license-key-badge">
                            <svg class="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                            </svg>
                            <span class="font-mono text-xs text-gray-500 truncate max-w-[200px]">{{ license.licenseKey }}</span>
                          </div>
                          <div class="download-status">
                            <div class="status-dot" [class]="license.downloadCount < license.maxDownloads ? 'bg-green-400' : 'bg-amber-400'"></div>
                            <span class="text-sm text-gray-600">{{ license.downloadCount }} / {{ license.maxDownloads }} downloads</span>
                          </div>
                        </div>
                      </div>

                      <!-- Download Buttons -->
                      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
                        @if (license.product.files && license.product.files.length > 0) {
                          @for (pf of license.product.files; track pf.id) {
                            <button 
                              (click)="download(license.productId, pf.fileId)"
                              [disabled]="downloading() === pf.fileId"
                              class="btn-download"
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
                                <span class="truncate max-w-[150px]">{{ pf.file.filename }}</span>
                              }
                            </button>
                          }
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
              
              <!-- Stats Summary -->
              <div class="stats-card mt-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div class="stat-item">
                    <div class="stat-value">{{ licenses().length }}</div>
                    <div class="stat-label">Total Products</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ getTotalDownloads() }}</div>
                    <div class="stat-label">Downloads Used</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ getTotalFiles() }}</div>
                    <div class="stat-label">Files Available</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ getActiveCount() }}</div>
                    <div class="stat-label">Active Licenses</div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="padding-global">
          <div class="cta-card">
            <div class="text-center relative z-10">
              <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Discover more amazing products
              </h2>
              <p class="text-gray-700/80 text-base md:text-lg max-w-lg mx-auto mb-6">
                Explore our marketplace and find digital products crafted by talented creators worldwide.
              </p>
              <a routerLink="/" class="btn-dark">
                Browse Marketplace
              </a>
            </div>
            
            <!-- Decorative elements -->
            <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/30 rounded-full blur-xl"></div>
            <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/20 rounded-full blur-xl"></div>
            <div class="absolute bottom-6 right-6 text-5xl md:text-6xl">📚</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .page-wrapper {
      font-family: 'DM Sans', system-ui, sans-serif;
      min-height: 100vh;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }

    .padding-global {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 640px) {
      .padding-global {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }

    @media (min-width: 1024px) {
      .padding-global {
        padding-left: 3rem;
        padding-right: 3rem;
      }
    }

    /* Hero Section */
    .hero-section {
      padding-top: 1.5rem;
      padding-bottom: 1rem;
    }

    @media (min-width: 768px) {
      .hero-section {
        padding-top: 2rem;
      }
    }

    .hero-card {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 30%, #6ee7b7 100%);
      border-radius: 1.5rem;
      transition: all 0.3s ease;
    }

    @media (min-width: 768px) {
      .hero-card {
        border-radius: 2rem;
      }
    }

    .hero-card:hover {
      transform: translateY(-2px);
    }

    /* Content Section */
    .content-section {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .content-section {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
    }

    /* Product Card */
    .product-card {
      background: #ffffff;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
    }

    @media (min-width: 640px) {
      .product-card {
        border-radius: 1.25rem;
        padding: 1.5rem;
      }
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);
      border-color: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    /* Empty State Card */
    .empty-state-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%);
      border-radius: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .empty-state-card {
        border-radius: 2rem;
      }
    }

    .icon-container {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    }

    @media (min-width: 768px) {
      .icon-container {
        width: 6rem;
        height: 6rem;
        border-radius: 1.5rem;
      }
    }

    /* License Key Badge */
    .license-key-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    /* Download Status */
    .download-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* Stats Card */
    .stats-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 1.25rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }

    @media (min-width: 768px) {
      .stats-card {
        padding: 2rem;
      }
    }

    .stat-item {
      text-align: center;
      padding: 0.5rem;
    }

    .stat-value {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      line-height: 1;
      margin-bottom: 0.375rem;
    }

    @media (min-width: 768px) {
      .stat-value {
        font-size: 2rem;
      }
    }

    .stat-label {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    @media (min-width: 768px) {
      .stat-label {
        font-size: 0.8125rem;
      }
    }

    /* CTA Section */
    .cta-section {
      padding-top: 2rem;
      padding-bottom: 4rem;
    }

    @media (min-width: 768px) {
      .cta-section {
        padding-top: 3rem;
        padding-bottom: 6rem;
      }
    }

    .cta-card {
      background: linear-gradient(135deg, #bfdbfe 0%, #ddd6fe 50%, #e9d5ff 100%);
      border-radius: 1.5rem;
      padding: 3rem 1.5rem;
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .cta-card {
        border-radius: 2rem;
        padding: 4rem 2rem;
      }
    }

    /* Buttons */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.875rem 1.75rem;
      background-color: #1f2937;
      color: #ffffff;
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: 0.625rem;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .btn-primary:hover {
      background-color: #374151;
      transform: translateY(-1px);
    }

    .btn-dark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 2rem;
      background-color: #1f2937;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-dark:hover {
      background-color: #374151;
      transform: translateY(-1px);
    }

    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: #1f2937;
      color: #ffffff;
      padding: 0.75rem 1.25rem;
      border-radius: 0.625rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
      min-height: 44px;
      width: 100%;
    }

    @media (min-width: 640px) {
      .btn-download {
        width: auto;
        padding: 0.75rem 1.5rem;
      }
    }

    .btn-download:hover:not(:disabled) {
      background-color: #374151;
      transform: translateY(-1px);
    }

    .btn-download:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .btn-download:active:not(:disabled) {
      background-color: #111827;
    }
  `]
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
