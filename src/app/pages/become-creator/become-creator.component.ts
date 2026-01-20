import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-become-creator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <!-- Hero Section -->
      <section class="py-10 sm:py-16 lg:py-24 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Unlock Your Potential
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Become a <span class="text-primary-600">Creator</span>
          </h1>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
            Start selling your digital products to a global audience. 
            Create stores, upload files, and earn money from your creations.
          </p>
        </div>
      </section>

      <!-- Features Card Section -->
      <section class="pb-12 sm:pb-16 lg:pb-20 px-4">
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 text-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
              <h2 class="text-xl sm:text-2xl font-display font-bold text-white mb-2">Creator Account</h2>
              <p class="text-sm sm:text-base text-primary-100">Everything you need to sell digital products</p>
            </div>

            <!-- Features List -->
            <div class="p-6 sm:p-8 lg:p-10">
              <h3 class="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5 sm:mb-6">What's included</h3>
              <ul class="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                <li class="flex items-start gap-3 sm:gap-4">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm sm:text-base font-medium text-gray-900">Create unlimited stores</span>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Build multiple storefronts for different brands or niches</p>
                  </div>
                </li>
                <li class="flex items-start gap-3 sm:gap-4">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm sm:text-base font-medium text-gray-900">Sell unlimited products</span>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">No restrictions on the number of products you can list</p>
                  </div>
                </li>
                <li class="flex items-start gap-3 sm:gap-4">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm sm:text-base font-medium text-gray-900">Secure file delivery</span>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Protected downloads with license key authentication</p>
                  </div>
                </li>
                <li class="flex items-start gap-3 sm:gap-4">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <span class="text-sm sm:text-base font-medium text-gray-900">Sales analytics dashboard</span>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Track revenue, customers, and product performance</p>
                  </div>
                </li>
              </ul>

              <!-- CTA Button -->
              <button 
                (click)="upgrade()" 
                [disabled]="loading()"
                class="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-950 disabled:bg-gray-400 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/25 flex items-center justify-center gap-2 sm:gap-3 min-h-[52px] sm:min-h-[56px]"
              >
                @if (loading()) {
                  <svg class="w-5 h-5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                } @else {
                  <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Activate Creator Account</span>
                }
              </button>

              <p class="text-center text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
                Free to get started • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class BecomeCreatorComponent {
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async upgrade() {
    this.loading.set(true);
    const result = await this.authService.upgradeToCreator();
    this.loading.set(false);

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert(result.message || 'Failed to upgrade. Please try again.');
    }
  }
}
