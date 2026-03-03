import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ExploreService,
  ExploreCreator,
  ExploreStore,
} from '../../core/services/explore.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#F9F4EB] font-sans antialiased">
      @if (loading()) {
        <!-- Loading Skeleton -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="h-4 w-40 bg-[#111111]/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <!-- Avatar skeleton -->
          <div class="flex flex-col items-center">
            <div class="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white border-2 border-black animate-pulse"></div>
            <div class="h-7 w-48 bg-[#111111]/10 rounded animate-pulse mt-5"></div>
            <div class="h-4 w-24 bg-[#111111]/5 rounded animate-pulse mt-2"></div>
            <div class="h-4 w-64 bg-[#111111]/5 rounded animate-pulse mt-4"></div>
          </div>
          <!-- Stats skeleton -->
          <div class="flex justify-center gap-8 mt-8">
            <div class="text-center">
              <div class="h-6 w-8 bg-[#111111]/10 rounded animate-pulse mx-auto mb-1"></div>
              <div class="h-3 w-12 bg-[#111111]/5 rounded animate-pulse mx-auto"></div>
            </div>
            <div class="w-px bg-black/10"></div>
            <div class="text-center">
              <div class="h-6 w-8 bg-[#111111]/10 rounded animate-pulse mx-auto mb-1"></div>
              <div class="h-3 w-12 bg-[#111111]/5 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
          <!-- Stores skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            <div *ngFor="let i of [1,2,3]" class="h-48 bg-white border-2 border-black rounded-2xl animate-pulse"></div>
          </div>
        </div>
      } @else if (creator()) {
        <!-- Breadcrumb -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <nav class="flex items-center gap-2 text-sm font-medium text-[#111111]/60 overflow-x-auto">
              <a routerLink="/" class="hover:text-[#111111] transition-colors whitespace-nowrap">Home</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <a routerLink="/explore" [queryParams]="{tab: 'creators'}" class="hover:text-[#111111] transition-colors whitespace-nowrap">Creators</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span class="text-[#111111] truncate">{{ creator()?.displayName || creator()?.username }}</span>
            </nav>
          </div>
        </div>

        <!-- Creator Profile Header -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div class="bg-white border-2 border-black rounded-[2rem] p-6 md:p-10 shadow-[6px_6px_0px_0px_#000] text-center relative overflow-hidden">
            <!-- Decorative BG -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #111111 1px, transparent 1px); background-size: 20px 20px;"></div>

            <!-- Avatar -->
            <div class="relative z-10">
              <div class="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full bg-gradient-to-br from-[#FFC60B] to-[#FA4B28] border-3 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000]" style="border-width: 3px;">
                @if (creator()?.avatarUrl) {
                  <img [src]="creator()?.avatarUrl" [alt]="creator()?.displayName || creator()?.username" class="w-full h-full object-cover" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-4xl md:text-5xl font-bold text-white">{{ (creator()?.displayName || creator()?.username || '?').charAt(0).toUpperCase() }}</span>
                  </div>
                }
              </div>

              <!-- Name -->
              <h1 class="font-display text-2xl md:text-3xl font-bold text-[#111111] mt-5">
                {{ creator()?.displayName || creator()?.username }}
              </h1>
              <p class="text-sm md:text-base text-[#111111]/50 font-medium mt-1">&#64;{{ creator()?.username }}</p>

              <!-- Bio -->
              @if (creator()?.bio) {
                <p class="text-sm md:text-base text-[#111111]/70 mt-4 max-w-lg mx-auto leading-relaxed">{{ creator()?.bio }}</p>
              }

              <!-- Social Links -->
              @if (creator()?.websiteUrl || creator()?.twitterHandle) {
                <div class="flex items-center justify-center gap-3 mt-5">
                  @if (creator()?.websiteUrl) {
                    <a [href]="creator()?.websiteUrl" target="_blank" rel="noopener noreferrer"
                      class="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F4EB] border-2 border-black rounded-lg text-xs font-bold text-[#111111] hover:bg-[#2B57D6] hover:text-white transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      Website
                    </a>
                  }
                  @if (creator()?.twitterHandle) {
                    <a [href]="'https://x.com/' + creator()?.twitterHandle" target="_blank" rel="noopener noreferrer"
                      class="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9F4EB] border-2 border-black rounded-lg text-xs font-bold text-[#111111] hover:bg-[#111111] hover:text-white transition-colors">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      &#64;{{ creator()?.twitterHandle }}
                    </a>
                  }
                </div>
              }

              <!-- Stats -->
              <div class="flex justify-center gap-8 mt-6">
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-[#111111]">{{ creator()?.storeCount }}</div>
                  <div class="text-xs md:text-sm text-[#111111]/50 font-medium">Stores</div>
                </div>
                <div class="w-px bg-black/15 self-stretch"></div>
                <div class="text-center">
                  <div class="text-2xl md:text-3xl font-bold text-[#111111]">{{ creator()?.productCount }}</div>
                  <div class="text-xs md:text-sm text-[#111111]/50 font-medium">Products</div>
                </div>
              </div>

              <!-- Member Since -->
              <div class="mt-5 text-xs text-[#111111]/40 font-medium">
                Member since {{ formatDate(creator()?.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Stores Section -->
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div class="flex items-center justify-between mb-6">
            <h2 class="font-display text-xl md:text-2xl font-bold text-[#111111] flex items-center gap-2">
              <div class="w-8 h-8 bg-[#FA4B28] border border-black rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              Stores
            </h2>
            <span class="text-sm font-medium text-[#111111]/50">{{ stores().length }} stores</span>
          </div>

          @if (storesLoading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div *ngFor="let i of [1,2,3]" class="bg-white border-2 border-black rounded-2xl overflow-hidden">
                <div class="h-24 md:h-32 bg-[#F9F4EB] animate-pulse relative">
                  <div class="absolute -bottom-6 left-4 w-14 h-14 bg-white border-2 border-black rounded-xl animate-pulse"></div>
                </div>
                <div class="p-4 pt-10">
                  <div class="h-5 bg-[#111111]/10 rounded animate-pulse mb-2 w-1/2"></div>
                  <div class="h-3 bg-[#111111]/5 rounded animate-pulse w-full mb-4"></div>
                  <div class="h-4 bg-[#111111]/10 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          } @else if (stores().length === 0) {
            <div class="text-center py-12 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_#000]">
              <div class="w-16 h-16 mx-auto mb-4 bg-[#F9F4EB] border-2 border-black rounded-xl flex items-center justify-center">
                <svg class="w-8 h-8 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <p class="text-[#111111]/60 font-medium">This creator hasn't published any stores yet.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              @for (store of stores(); track store.id) {
                <a [routerLink]="['/store', store.slug]"
                  class="group bg-white border-2 border-black rounded-2xl overflow-hidden hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300"
                >
                  <!-- Banner -->
                  <div class="bg-gradient-to-br from-[#2B57D6] to-[#FA4B28] relative" [style.aspect-ratio]="getStoreBannerRatio(store)" style="min-height: 80px; max-height: 160px;">
                    @if (store.bannerUrl) {
                      <img [src]="store.bannerUrl" [alt]="store.name" class="w-full h-full object-cover" loading="lazy" />
                    }
                    <!-- Logo -->
                    <div class="absolute -bottom-6 left-4 w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                      @if (store.logoUrl) {
                        <img [src]="store.logoUrl" [alt]="store.name" class="w-full h-full object-cover" />
                      } @else {
                        <div class="w-full h-full bg-[#F9F4EB] flex items-center justify-center">
                          <span class="text-lg md:text-xl font-bold text-[#111111]">{{ store.name.charAt(0) }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Info -->
                  <div class="p-4 pt-10">
                    <h3 class="font-bold text-[#111111] text-base md:text-lg mb-1 group-hover:text-[#2B57D6] transition-colors truncate">
                      {{ store.name }}
                    </h3>
                    @if (store.tagline) {
                      <p class="text-sm text-[#111111]/60 font-medium line-clamp-2 mb-3">{{ store.tagline }}</p>
                    }
                    <div class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-[#111111]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      <span class="text-sm font-medium text-[#111111]/60">{{ store.productCount }} products</span>
                    </div>
                  </div>
                </a>
              }
            </div>
          }
        </div>
      } @else {
        <!-- Not Found -->
        <div class="min-h-[60vh] flex items-center justify-center px-4">
          <div class="text-center bg-white border-2 border-black rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#000] max-w-md w-full">
            <div class="w-20 h-20 mx-auto mb-6 bg-[#FA4B28]/10 border-2 border-black rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-[#FA4B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h1 class="text-2xl font-display font-bold text-[#111111] mb-2">Creator not found</h1>
            <p class="text-[#111111]/60 mb-6">The creator you're looking for doesn't exist or has been removed.</p>
            <a routerLink="/explore" [queryParams]="{tab: 'creators'}" class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Browse Creators
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
export class CreatorComponent implements OnInit {
  creator = signal<ExploreCreator | null>(null);
  stores = signal<ExploreStore[]>([]);
  loading = signal(true);
  storesLoading = signal(true);

  private exploreService = inject(ExploreService);
  private toaster = inject(ToasterService);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadCreator(id);
    }
    this.loading.set(false);
  }

  async loadCreator(id: string) {
    try {
      const creator = await this.exploreService.getCreatorById(id);
      this.creator.set(creator);

      if (creator) {
        this.storesLoading.set(true);
        const stores = await this.exploreService.getCreatorStores(id);
        this.stores.set(stores);
        this.storesLoading.set(false);
      }
    } catch (error) {
      console.error('Failed to load creator:', error);
      this.toaster.error({ title: 'Error', message: 'Failed to load creator details.' });
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  getStoreBannerRatio(store: ExploreStore): string {
    if (store.bannerWidth && store.bannerHeight && store.bannerWidth > 0 && store.bannerHeight > 0) {
      return `${store.bannerWidth} / ${store.bannerHeight}`;
    }
    return '16 / 5';
  }
}
