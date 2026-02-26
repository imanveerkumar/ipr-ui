import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/index';
import { ProductService } from '../../core/services/product.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToasterService } from '../../core/services/toaster.service';
import { SubdomainService } from '../../core/services/subdomain.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F9F4EB] font-sans antialiased">
      @if (loading()) {
        <!-- Loading Skeleton -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="h-4 w-48 bg-[#111111]/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            <div class="lg:col-span-3">
              <div class="bg-white border-2 border-black rounded-2xl animate-pulse" [style.aspect-ratio]="'4/3'"></div>
            </div>
            <div class="lg:col-span-2 space-y-4">
              <div class="h-8 bg-[#111111]/10 rounded w-3/4 animate-pulse"></div>
              <div class="h-6 bg-[#111111]/10 rounded w-1/3 animate-pulse"></div>
              <div class="h-4 bg-[#111111]/5 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-[#111111]/5 rounded w-2/3 animate-pulse"></div>
              <div class="h-14 bg-[#111111]/10 rounded-xl animate-pulse mt-6"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <!-- Breadcrumb -->
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <nav class="flex items-center gap-2 text-sm font-medium text-[#111111]/60 overflow-x-auto">
              <a routerLink="/" class="hover:text-[#111111] transition-colors whitespace-nowrap">Home</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <a routerLink="/explore" class="hover:text-[#111111] transition-colors whitespace-nowrap">Explore</a>
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              <span class="text-[#111111] truncate">{{ product()?.title }}</span>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
            <!-- Left Column: Image -->
            <div class="lg:col-span-3">
              <div class="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_#000]">
                @if (product()?.coverImageUrl) {
                  <img [src]="product()?.coverImageUrl" [alt]="product()?.title" class="w-full object-cover" [style.aspect-ratio]="getCoverAspectRatio()">
                } @else {
                  <div class="w-full aspect-[4/3] bg-gradient-to-br from-[#2B57D6]/10 to-[#FA4B28]/10 flex items-center justify-center">
                    <svg class="w-20 h-20 text-[#111111]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                }
              </div>

              <!-- Description (desktop) -->
              <div class="hidden lg:block mt-8">
                @if (product()?.description) {
                  <div class="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000]">
                    <h2 class="font-display text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-[#2B57D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      Description
                    </h2>
                    <div class="prose prose-sm max-w-none text-[#111111]/80 prose-headings:text-[#111111] prose-a:text-[#2B57D6]" [innerHTML]="product()?.description"></div>
                  </div>
                }
              </div>
            </div>

            <!-- Right Column: Details -->
            <div class="lg:col-span-2 space-y-5">
              <!-- Title & Price Card -->
              <div class="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000]">
                <h1 class="font-display text-xl md:text-2xl font-bold text-[#111111] leading-tight">{{ product()?.title }}</h1>

                <!-- Store & Creator -->
                @if (product()?.store) {
                  <a [routerLink]="['/store', product()?.store?.slug]" class="flex items-center gap-2.5 mt-3 group">
                    <div class="w-8 h-8 rounded-lg bg-[#2B57D6] border border-black overflow-hidden flex-shrink-0 flex items-center justify-center">
                      @if (product()?.store?.logoUrl) {
                        <img [src]="product()?.store?.logoUrl" class="w-full h-full object-cover" />
                      } @else {
                        <span class="text-xs font-bold text-white">{{ product()?.store?.name?.charAt(0) }}</span>
                      }
                    </div>
                    <span class="text-sm font-medium text-[#111111]/60 group-hover:text-[#2B57D6] transition-colors">{{ product()?.store?.name }}</span>
                  </a>
                  @if (product()?.store?.slug) {
                    <a
                      [href]="getStorefrontUrl()"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-[#68E079] text-[#111111] border-2 border-black rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      Visit Storefront
                      <!-- clicking will open this product within the store -->
                    </a>
                  }
                }

                <!-- Price -->
                <div class="mt-5 flex items-end gap-3">
                  <span class="text-3xl md:text-4xl font-bold text-[#111111]">₹{{ (product()?.price || 0) / 100 }}</span>
                  @if (product()?.compareAtPrice && product()!.compareAtPrice! > product()!.price) {
                    <span class="text-lg text-[#111111]/40 line-through mb-1">₹{{ product()!.compareAtPrice! / 100 }}</span>
                    <span class="px-2 py-0.5 bg-[#FA4B28] text-white text-xs font-bold rounded-md border border-black mb-1">
                      -{{ getDiscount() }}%
                    </span>
                  }
                </div>

                <!-- CTA Buttons -->
                <div class="mt-6 space-y-3">
                  @if ((product()?.price || 0) === 0) {
                    <!-- Free product: choose free download or support creator -->
                    <div class="bg-[#F9F4EB] border-2 border-black rounded-xl p-4 space-y-3">
                      <p class="text-sm font-bold text-[#111111]">This product is free! Choose how to get it:</p>

                      <!-- Free download button -->
                      <button
                        (click)="downloadForFree()"
                        [disabled]="purchasing()"
                        class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#68E079] text-[#111111] border-2 border-black rounded-xl font-bold text-base shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        @if (purchasing() && selectedFreeOption() === 'free') {
                          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Processing...
                        } @else {
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download for Free
                        }
                      </button>

                      <!-- Divider -->
                      <div class="flex items-center gap-2 text-xs text-[#111111]/40">
                        <div class="flex-1 h-px bg-[#111111]/15"></div>
                        <span class="font-medium">or support the creator</span>
                        <div class="flex-1 h-px bg-[#111111]/15"></div>
                      </div>

                      <!-- Custom amount input -->
                      <div class="flex gap-2">
                        <div class="relative flex-1">
                          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/50 font-bold text-sm">₹</span>
                          <input
                            type="number"
                            [(ngModel)]="customAmount"
                            min="1"
                            placeholder="Enter amount"
                            class="w-full pl-7 pr-3 py-2.5 border-2 border-black rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#2B57D6]/30"
                          />
                        </div>
                        <button
                          (click)="payCustomAmount()"
                          [disabled]="purchasing() || !customAmount || customAmount < 1"
                          class="px-4 py-2.5 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          @if (purchasing() && selectedFreeOption() === 'custom') {
                            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          } @else {
                            Pay ₹{{ customAmount || 0 }}
                          }
                        </button>
                      </div>

                      <!-- Guest email for free download -->
                      @if (!auth.isSignedIn() && showGuestEmailInput()) {
                        <div class="space-y-2 pt-1">
                          <p class="text-xs text-[#111111]/60">Enter your email to receive the download link:</p>
                          <input
                            type="email"
                            [(ngModel)]="guestEmail"
                            placeholder="your@email.com"
                            class="w-full px-3 py-2.5 border-2 border-black rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#2B57D6]/30"
                          />
                          <button
                            (click)="confirmGuestFreeDownload()"
                            [disabled]="purchasing() || !guestEmail"
                            class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#68E079] text-[#111111] border-2 border-black rounded-xl font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            @if (purchasing()) {
                              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              Processing...
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                              Get Free Download
                            }
                          </button>
                        </div>
                      }
                    </div>
                  } @else {
                    <!-- Paid product: standard buy/cart flow -->
                    <button
                      (click)="purchase()"
                      [disabled]="purchasing()"
                      class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-xl font-bold text-base shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      @if (purchasing()) {
                        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Processing...
                      } @else {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Buy Now — ₹{{ (product()?.price || 0) / 100 }}
                      }
                    </button>
                    <button
                      (click)="addToCart()"
                      class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#111111] border-2 border-black rounded-xl font-bold text-sm shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                      [class.bg-[#68E079]]="isInCart()"
                    >
                      @if (isInCart()) {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        In Cart
                      } @else {
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                        Add to Cart
                      }
                    </button>
                  }
                  @if (!auth.isSignedIn() && (product()?.price || 0) > 0) {
                    <p class="text-center text-xs text-[#111111]/50 mt-1">
                      No account needed &mdash; guest checkout available
                    </p>
                  }
                </div>
              </div>

              <!-- Share & Copy -->
              <div class="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
                <div class="flex gap-2">
                  <button
                    (click)="copyUrl()"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F9F4EB] border-2 border-black rounded-lg text-sm font-bold text-[#111111] hover:bg-[#FFC60B] transition-colors"
                  >
                    @if (copied()) {
                      <svg class="w-4 h-4 text-[#68E079]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                      Copied!
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                      Copy Link
                    }
                  </button>
                  <button
                    (click)="shareUrl()"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F9F4EB] border-2 border-black rounded-lg text-sm font-bold text-[#111111] hover:bg-[#2B57D6] hover:text-white transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    Share
                  </button>
                </div>
              </div>

              <!-- Files Included -->
              @if (product()?.files && product()!.files!.length > 0) {
                <div class="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000]">
                  <h3 class="font-display text-sm font-bold text-[#111111] mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#68E079]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Files Included ({{ product()!.files!.length }})
                  </h3>
                  <ul class="space-y-2">
                    @for (pf of product()?.files; track pf.id) {
                      <li class="flex items-center gap-3 p-2.5 bg-[#F9F4EB] rounded-lg border border-black/10">
                        <div class="w-8 h-8 bg-[#2B57D6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg class="w-4 h-4 text-[#2B57D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <div class="min-w-0 flex-1">
                          <p class="text-sm font-medium text-[#111111] truncate">{{ pf.file.filename }}</p>
                          <p class="text-xs text-[#111111]/50">{{ formatFileSize(pf.file.size) }}</p>
                        </div>
                      </li>
                    }
                  </ul>
                </div>
              }

              <!-- Trust Badges -->
              <div class="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000]">
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#68E079]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-[#68E079]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-[#111111]">Secure Payment</p>
                      <p class="text-xs text-[#111111]/50">Powered by Razorpay</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#2B57D6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-[#2B57D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-[#111111]">Instant Access</p>
                      <p class="text-xs text-[#111111]/50">Download immediately after purchase</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#FFC60B]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-[#FFC60B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                    </div>
                    <div>
                      <p class="text-sm font-bold text-[#111111]">License Key</p>
                      <p class="text-xs text-[#111111]/50">Unique license included with purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description (mobile) -->
          <div class="lg:hidden mt-6">
            @if (product()?.description) {
              <div class="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_#000]">
                <h2 class="font-display text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#2B57D6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Description
                </h2>
                <div class="prose prose-sm max-w-none text-[#111111]/80 prose-headings:text-[#111111] prose-a:text-[#2B57D6]" [innerHTML]="product()?.description"></div>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- Not Found -->
        <div class="min-h-[60vh] flex items-center justify-center px-4">
          <div class="text-center bg-white border-2 border-black rounded-2xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#000] max-w-md w-full">
            <div class="w-20 h-20 mx-auto mb-6 bg-[#FA4B28]/10 border-2 border-black rounded-2xl flex items-center justify-center">
              <svg class="w-10 h-10 text-[#FA4B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h1 class="text-2xl font-display font-bold text-[#111111] mb-2">Product not found</h1>
            <p class="text-[#111111]/60 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <a routerLink="/explore" class="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Explore Products
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ProductComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  purchasing = signal(false);
  copied = signal(false);

  // Free / pay-what-you-want state
  customAmount = 0;
  guestEmail = '';
  showGuestEmailInput = signal(false);
  selectedFreeOption = signal<'free' | 'custom' | null>(null);

  cartService = inject(CartService);
  private toaster = inject(ToasterService);
  private subdomainService = inject(SubdomainService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private checkoutService: CheckoutService,
    public auth: AuthService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const product = await this.productService.getProductById(id);
        this.product.set(product);
      } catch (err: any) {
        // if there's an unexpected error we still want to hide the loader
        // and let Angular's global error handler take care of it.
        if (err && err.status !== 404) {
          throw err;
        }
        this.product.set(null);
      }
    }
    this.loading.set(false);
  }

  getStorefrontUrl(): string {
    const product = this.product();
    const store = product?.store;
    if (!store?.slug || !product?.id) {
      return '';
    }

    // When viewing an individual product we want to land directly on that
    // product within the storefront rather than just the store homepage.
    // The storefront routing understands `/product/:id` paths so we append
    // the product ID as the path parameter.
    return this.subdomainService.getStoreUrl(store.slug, `/product/${product.id}`);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getDiscount(): number {
    const p = this.product();
    if (!p || !p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }

  getCoverAspectRatio(): string {
    const p = this.product();
    if (p?.coverImageWidth && p?.coverImageHeight && p.coverImageWidth > 0 && p.coverImageHeight > 0) {
      return `${p.coverImageWidth} / ${p.coverImageHeight}`;
    }
    return '4 / 3';
  }

  addToCart() {
    const product = this.product();
    if (!product) return;

    if (this.isInCart()) {
      this.cartService.removeItem(product.id);
    } else {
      this.cartService.addItem(product);
      // sidebar remains closed for quick‑add
    }
  }

  isInCart(): boolean {
    const product = this.product();
    return product ? this.cartService.isInCart(product.id) : false;
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
    const product = this.product();
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title || 'Product',
          text: `Check out ${product?.title || 'this product'} on StoresCraft`,
          url: window.location.href,
        });
      } catch { /* user cancelled */ }
    } else {
      await this.copyUrl();
    }
  }

  async purchase() {
    const product = this.product();
    if (!product) return;

    // guest users just add item and open cart for checkout
    if (!this.auth.isSignedIn()) {
      this.cartService.addItem(product);
      this.cartService.open();
      return;
    }

    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({ title: 'Order Failed', message: 'Failed to create order. Please try again.' });
        return;
      }

      const paymentData = await this.checkoutService.initiatePayment(order.id);
      if (!paymentData) {
        this.toaster.error({ title: 'Payment Failed', message: 'Failed to initiate payment. Please try again.' });
        return;
      }

      const userEmail = this.auth.user()?.email || '';
      const result = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);

      if (result.success) {
        this.toaster.success({ title: 'Purchase Successful!', message: 'Check your library to access your files.' });
      } else if (result.cancelled) {
        this.toaster.error({ title: 'Payment Cancelled', message: 'You closed the payment window. Please try again when ready.' });
      } else {
        this.toaster.error({ title: 'Payment Failed', message: result.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      this.toaster.handleError(error, 'Purchase failed. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  /** Handle "Download for Free" click on a ₹0 product */
  async downloadForFree() {
    const product = this.product();
    if (!product) return;

    // Guest: show email input first
    if (!this.auth.isSignedIn()) {
      this.showGuestEmailInput.set(true);
      this.selectedFreeOption.set('free');
      return;
    }

    this.selectedFreeOption.set('free');
    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({ title: 'Error', message: 'Failed to create order. Please try again.' });
        return;
      }

      const result = await this.checkoutService.completeFreeOrder(order.id);
      if (result?.success) {
        this.toaster.success({ title: 'Download Ready!', message: 'The product has been added to your library.' });
        this.router.navigate(['/library']);
      } else {
        this.toaster.error({ title: 'Error', message: 'Failed to process free download. Please try again.' });
      }
    } catch (error) {
      console.error('Free download failed:', error);
      this.toaster.handleError(error, 'Failed to process free download. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  /** Handle guest free download after email is entered */
  async confirmGuestFreeDownload() {
    const product = this.product();
    if (!product || !this.guestEmail) return;

    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createGuestOrder([product.id], this.guestEmail);
      if (!order) {
        this.toaster.error({ title: 'Error', message: 'Failed to create order. Please try again.' });
        return;
      }

      const result = await this.checkoutService.completeGuestFreeOrder(order.id, this.guestEmail);
      if (result?.success) {
        this.toaster.success({ title: 'Download Ready!', message: 'A download link has been sent to your email.' });
        if (result.downloadToken) {
          this.router.navigate(['/guest/downloads', result.downloadToken]);
        }
      } else {
        this.toaster.error({ title: 'Error', message: 'Failed to process free download. Please try again.' });
      }
    } catch (error) {
      console.error('Guest free download failed:', error);
      this.toaster.handleError(error, 'Failed to process free download. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }

  /** Handle "Pay custom amount" on a ₹0 product */
  async payCustomAmount() {
    const product = this.product();
    if (!product || !this.customAmount || this.customAmount < 1) return;

    // Guest: add to cart and open sidebar (handles guest email collection)
    if (!this.auth.isSignedIn()) {
      this.cartService.addItem(product);
      this.cartService.open();
      return;
    }

    this.selectedFreeOption.set('custom');
    this.purchasing.set(true);

    try {
      const order = await this.checkoutService.createOrder([product.id]);
      if (!order) {
        this.toaster.error({ title: 'Order Failed', message: 'Failed to create order. Please try again.' });
        return;
      }

      const paymentData = await this.checkoutService.initiatePayment(order.id, this.customAmount);
      if (!paymentData) {
        this.toaster.error({ title: 'Payment Failed', message: 'Failed to initiate payment. Please try again.' });
        return;
      }

      const userEmail = this.auth.user()?.email || '';
      const result = await this.checkoutService.openRazorpayCheckout(paymentData, userEmail);

      if (result.success) {
        this.toaster.success({ title: 'Thank you for your support!', message: 'Check your library to access your files.' });
      } else if (result.cancelled) {
        this.toaster.error({ title: 'Payment Cancelled', message: 'You closed the payment window. Please try again when ready.' });
      } else {
        this.toaster.error({ title: 'Payment Failed', message: result.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Custom amount payment failed:', error);
      this.toaster.handleError(error, 'Payment failed. Please try again.');
    } finally {
      this.purchasing.set(false);
    }
  }}