import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store, Product } from '../../core/models/index';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { SubdomainService } from '../../core/services/subdomain.service';
import { MasonryGridComponent } from '../../shared/components/masonry-grid/masonry-grid.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink, MasonryGridComponent],
  template: `
    <div class="min-h-screen bg-[#F9F4EB] font-sans antialiased">
      @if (loading()) {
        <!-- Loading Skeleton -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="h-4 w-40 bg-[#111111]/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="h-40 md:h-56 bg-white border-2 border-black rounded-b-2xl animate-pulse"></div>
          <div class="flex items-end gap-4 -mt-10 ml-6">
            <div class="w-20 h-20 md:w-24 md:h-24 bg-white border-2 border-black rounded-xl animate-pulse"></div>
            <div class="pb-2 space-y-2">
              <div class="h-6 w-48 bg-[#111111]/10 rounded animate-pulse"></div>
              <div class="h-4 w-32 bg-[#111111]/5 rounded animate-pulse"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            <div class="h-64 bg-white border-2 border-black rounded-2xl animate-pulse" *ngFor="let i of [1,2,3]"></div>
          </div>
        </div>
      } @else if (store()) {
        <!-- Breadcrumb -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <nav class="flex items-center gap-2 text-sm font-medium text-[#111111]/60 overflow-x-auto">
              <a routerLink="/" class="hover:text-[#111111] transition-colors whitespace-nowrap">Home</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <a routerLink="/explore" [queryParams]="{tab: 'stores'}" class="hover:text-[#111111] transition-colors whitespace-nowrap">Stores</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span class="text-[#111111] truncate">{{ store()?.name }}</span>
            </nav>
          </div>
        </div>

        <!-- Banner -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="relative rounded-b-2xl overflow-hidden border-2 border-t-0 border-black">
            @if (store()?.bannerUrl) {
              <div class="bg-cover bg-center" [style.aspect-ratio]="getBannerAspectRatio()" style="min-height: 120px; max-height: 320px;" [style.background-image]="'url(' + store()?.bannerUrl + ')'"></div>
            } @else {
              <div class="h-40 md:h-56 bg-gradient-to-br from-[#2B57D6] to-[#FA4B28]"></div>
            }
          </div>
        </div>

        <!-- Store Info -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-12 relative z-10">
          <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <!-- Logo -->
            <div class="w-20 h-20 md:w-24 md:h-24 bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
              @if (store()?.logoUrl) {
                <img [src]="store()?.logoUrl" [alt]="store()?.name" class="w-full h-full object-cover">
              } @else {
                <div class="w-full h-full bg-[#F9F4EB] flex items-center justify-center">
                  <span class="text-2xl md:text-3xl font-bold text-[#111111]">{{ store()?.name?.charAt(0) }}</span>
                </div>
              }
            </div>

            <!-- Name & Meta -->
            <div class="flex-1 min-w-0 pt-0 sm:pt-12">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div class="min-w-0">
                  <h1 class="font-display text-2xl md:text-3xl font-bold text-[#111111] leading-tight truncate">{{ store()?.name }}</h1>
                  @if (store()?.tagline) {
                    <p class="text-sm md:text-base text-[#111111]/60 font-medium mt-1 line-clamp-2">{{ store()?.tagline }}</p>
                  }
                </div>

                <!-- Share Buttons -->
                <div class="flex gap-2 flex-shrink-0">
                  <button
                    (click)="copyUrl()"
                    class="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold text-[#111111] hover:bg-[#FFC60B] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    @if (copied()) {
                      <svg class="w-3.5 h-3.5 text-[#68E079]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      Copied!
                    } @else {
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                      Copy Link
                    }
                  </button>
                  <button
                    (click)="shareUrl()"
                    class="flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold text-[#111111] hover:bg-[#2B57D6] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    Share
                  </button>
                  @if (store()?.slug) {
                    <a
                      [href]="getStorefrontUrl()"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-1.5 px-3 py-2 bg-[#68E079] border-2 border-black rounded-lg text-xs font-bold text-[#111111] shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      Visit Storefront
                    </a>
                  }
                </div>
              </div>

              <!-- Creator & Stats Row -->
              <div class="flex flex-wrap items-center gap-4 mt-4">
                @if (store()?.user) {
                  <a [routerLink]="['/creator', store()?.user?.id]" class="flex items-center gap-2 group">
                    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFC60B] to-[#FA4B28] border border-black overflow-hidden flex-shrink-0">
                      @if (store()?.user?.avatarUrl) {
                        <img [src]="store()?.user?.avatarUrl" class="w-full h-full object-cover" />
                      } @else {
                        <div class="w-full h-full flex items-center justify-center">
                          <span class="text-[10px] font-bold text-white">{{ (store()?.user?.displayName || store()?.user?.username || '?').charAt(0).toUpperCase() }}</span>
                        </div>
                      }
                    </div>
                    <span class="text-sm font-medium text-[#111111]/60 group-hover:text-[#2B57D6] transition-colors">
                      {{ store()?.user?.displayName || store()?.user?.username }}
                    </span>
                  </a>
                }
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <span class="text-sm font-medium text-[#111111]/60">{{ products().length }} products</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          @if (store()?.description) {
            <div class="mt-6 bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000]">
              <div class="prose prose-sm max-w-none text-[#111111]/80 prose-headings:text-[#111111] prose-a:text-[#2B57D6]" [innerHTML]="store()?.description"></div>
            </div>
          }
        </div>

        <!-- Products Section -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display text-xl md:text-2xl font-bold text-[#111111]">Products</h2>
            <span class="text-sm font-medium text-[#111111]/50">{{ products().length }} items</span>
          </div>

          @if (products().length === 0) {
            <div class="text-center py-16 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <div class="w-16 h-16 mx-auto mb-4 bg-[#F9F4EB] border-2 border-black rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <p class="text-[#111111]/60 font-medium">No products available yet.</p>
            </div>
          } @else {
            <app-masonry-grid
              [items]="products()"
              [gap]="12"
              [colsMobile]="2"
              [colsTablet]="3"
              [colsDesktop]="4"
              [getItemRatio]="getItemRatio"
            >
              <ng-template let-product>
                <a [routerLink]="['/product', product.id]"
                  class="group bg-white border-2 border-black rounded-xl md:rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div class="relative overflow-hidden bg-[#F9F4EB]" [style.aspect-ratio]="getProductAspectRatio(product)">
                    @if (product.coverImageUrl) {
                      <div class="overflow-hidden w-full h-full">
                        <img [src]="product.coverImageUrl" [alt]="product.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    } @else {
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-[#111111]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </div>
                    }

                    <!-- Discount Badge -->
                    @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                      <div class="absolute top-2 left-2 px-1.5 py-0.5 bg-[#FA4B28] border border-black rounded text-[10px] md:text-xs font-bold text-white">
                        -{{ getProductDiscount(product) }}%
                      </div>
                    }

                    <!-- Desktop hover overlay -->
                    <div *ngIf="product.price > 0" class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 hidden md:flex items-end justify-center opacity-0 group-hover:opacity-100 p-3">
                      <div class="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                        <button *ngIf="product.price > 0"
                          (click)="cartService.isInCart(product.id) ? removeFromCart(product, $event) : addToCart(product, $event); $event.stopPropagation()"
                          class="px-3 py-2 border-2 border-black rounded-lg text-xs font-bold text-[#111111] shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          [class.bg-[#68E079]]="cartService.isInCart(product.id)"
                          [class.bg-[#FFC60B]]="!cartService.isInCart(product.id)"
                        >
                          {{ cartService.isInCart(product.id) ? '&#10003; In Cart' : '+ Add to Cart' }}
                        </button>
                        <button *ngIf="product.price > 0"
                          (click)="buyNow(product, $event)"
                          class="px-3 py-2 bg-[#111111] text-white border-2 border-black rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#FFC60B] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>

                    <!-- Mobile cart button -->
                    <button *ngIf="product.price > 0"
                      (click)="cartService.isInCart(product.id) ? removeFromCart(product, $event) : addToCart(product, $event); $event.stopPropagation()"
                      class="md:hidden absolute bottom-2 right-2 p-2 rounded-lg border-2 border-black transition-all duration-200 shadow-[2px_2px_0px_0px_#000]"
                      [class.bg-[#68E079]]="cartService.isInCart(product.id)"
                      [class.bg-[#FFC60B]]="!cartService.isInCart(product.id)"
                    >
                      <svg *ngIf="!cartService.isInCart(product.id)" class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <svg *ngIf="cartService.isInCart(product.id)" class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </button>
                  </div>
                  <div class="p-2.5 md:p-4 flex-1 flex flex-col">
                    <h3 class="font-bold text-[#111111] text-xs md:text-sm line-clamp-2 mb-auto group-hover:text-[#2B57D6] transition-colors leading-tight">
                      {{ product.title }}
                    </h3>
                    <div class="flex items-center gap-1.5 mt-2">
                      <span class="font-bold text-[#111111] text-xs md:text-base">₹{{ product.price / 100 }}</span>
                      @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                        <span class="text-[10px] md:text-xs text-[#111111]/40 line-through">₹{{ product.compareAtPrice / 100 }}</span>
                      }
                    </div>
                  </div>
                </a>
              </ng-template>
            </app-masonry-grid>
          }
        </div>
      } @else {
        <!-- Not Found -->
        <div class="min-h-[60vh] flex items-center justify-center px-4">
          <div class="text-center bg-white border-2 border-black rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#000] max-w-md w-full">
            <div class="w-20 h-20 mx-auto mb-6 bg-[#FA4B28]/10 border-2 border-black rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-[#FA4B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h1 class="text-2xl font-display font-bold text-[#111111] mb-2">Store not found</h1>
            <p class="text-[#111111]/60 mb-6">The store you're looking for doesn't exist or has been removed.</p>
            <a routerLink="/explore" [queryParams]="{tab: 'stores'}" class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Browse Stores
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class StoreComponent implements OnInit {
  store = signal<Store | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  copied = signal(false);

  getItemRatio = (product: Product): number => {
    if (product.coverImageWidth && product.coverImageHeight && product.coverImageWidth > 0 && product.coverImageHeight > 0) {
      return product.coverImageWidth / product.coverImageHeight;
    }
    return 1;
  };

  cartService = inject(CartService);
  auth = inject(AuthService);
  private toaster = inject(ToasterService);
  private subdomainService = inject(SubdomainService);

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      // attempt load by slug first; if not found treat value as an ID
      let store = await this.storeService.getStoreBySlug(slug);
      if (!store) {
        store = await this.storeService.getStoreById(slug);
      }
      this.store.set(store);

      if (store) {
        const products = await this.productService.getProductsByStore(store.id);
        this.products.set(products);
      }
    }
    this.loading.set(false);
  }

  getStorefrontUrl(): string {
    const store = this.store();
    if (!store?.slug) return '';
    return this.subdomainService.getStoreUrl(store.slug);
  }

  getProductDiscount(product: Product): number {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }

  getBannerAspectRatio(): string {
    const s = this.store();
    if (s?.bannerWidth && s?.bannerHeight && s.bannerWidth > 0 && s.bannerHeight > 0) {
      return `${s.bannerWidth} / ${s.bannerHeight}`;
    }
    return '16 / 5';
  }

  getProductAspectRatio(product: Product): string {
    if (product.coverImageWidth && product.coverImageHeight && product.coverImageWidth > 0 && product.coverImageHeight > 0) {
      return `${product.coverImageWidth} / ${product.coverImageHeight}`;
    }
    return '1 / 1';
  }

  toggleCart(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (product.price === 0) {
      // free items shouldn't be toggled from listing cards
      return;
    }
    if (this.cartService.isInCart(product.id)) {
      this.cartService.removeItem(product.id);
    } else {
      this.cartService.addItem(product);
      // don't auto-open sidebar here; only open when user explicitly chooses "Buy Now"
    }
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    if (product.price === 0) return;
    this.cartService.addItem(product);
  }

  removeFromCart(product: Product, event: Event) {
    event.stopPropagation();
    if (product.price === 0) return;
    this.cartService.removeItem(product.id);
  }

  buyNow(product: Product, event: Event) {
    event.stopPropagation();
    if (product.price === 0) return;
    this.cartService.addItem(product);
    this.cartService.open();
  }

  async copyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.copied.set(true);
      this.toaster.success({ title: 'Link Copied', message: 'URL copied to clipboard' });
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      this.toaster.error({ title: 'Copy Failed', message: 'Could not copy URL' });
    }
  }

  async shareUrl() {
    const store = this.store();
    if (navigator.share) {
      try {
        await navigator.share({
          title: store?.name || 'Store',
          text: `Check out ${store?.name || 'this store'} on StoresCraft`,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await this.copyUrl();
    }
  }
}
