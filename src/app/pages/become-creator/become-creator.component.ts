import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-become-creator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen font-sans antialiased text-[#111111]">
      <!-- CTA Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 mb-12">
        <div class="max-w-7xl mx-auto">
          <div class="bg-[#2B57D6] border-2 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_#000]">
            <div class="px-6 py-16 md:px-12 md:py-20 text-center relative z-10">
               <!-- Decorative elements -->
               <div class="absolute top-10 left-10 w-16 h-16 bg-[#FFC60B] border-2 border-black rounded-full hidden md:block opacity-80 animate-bounce"></div>
               <div class="absolute bottom-10 right-10 w-12 h-12 bg-[#FA4B28] border-2 border-black transform rotate-12 hidden md:block opacity-80"></div>

              <h2 class="font-dm-sans text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                Ready to start your journey?
              </h2>
              <p class="text-xl text-white/90 max-w-2xl mx-auto mb-10 font-medium">
                Join the platform that puts creators first. No hidden fees, just tools to help you grow.
              </p>
              
              <button (click)="upgrade()" [disabled]="loading()" class="inline-flex items-center px-10 py-5 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-xl font-bold text-xl hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0">
                <span *ngIf="!loading()">Start Selling Now</span>
                <span *ngIf="loading()" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upgrading...
                </span>
                <svg *ngIf="!loading()" class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      <!-- Features Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] uppercase tracking-tight mb-4">
              Everything you need<br>to scale your business
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <!-- Feature 1 -->
            <div class="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-[#2B57D6] border-2 border-black rounded-lg flex items-center justify-center mb-4 text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 class="font-dm-sans text-xl font-bold mb-2">Unlimited Stores</h3>
              <p class="text-[#111111]/70 font-medium">Build multiple storefronts for different brands or niches under one account.</p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-[#FA4B28] border-2 border-black rounded-lg flex items-center justify-center mb-4 text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3 class="font-dm-sans text-xl font-bold mb-2">Unlimited Products</h3>
              <p class="text-[#111111]/70 font-medium">No restrictions on the number of products you can list and sell.</p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-[#68E079] border-2 border-black rounded-lg flex items-center justify-center mb-4 text-[#111111]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="font-dm-sans text-xl font-bold mb-2">Secure Delivery</h3>
              <p class="text-[#111111]/70 font-medium">Protected downloads with license key authentication and fraud prevention.</p>
            </div>

            <!-- Feature 4 -->
            <div class="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform duration-300">
              <div class="w-12 h-12 bg-[#FFC60B] border-2 border-black rounded-lg flex items-center justify-center mb-4 text-[#111111]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 class="font-dm-sans text-xl font-bold mb-2">Sales Analytics</h3>
              <p class="text-[#111111]/70 font-medium">Track revenue, customers, and product performance with detailed insights.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class BecomeCreatorComponent {
    private router = inject(Router);
  private authService = inject(AuthService);
  private toaster = inject(ToasterService);
  loading = signal(false);


  async upgrade() {
    this.loading.set(true);
    const result = await this.authService.upgradeToCreator();
    this.loading.set(false);

    if (result.success) {
      this.toaster.success({
        title: 'Welcome, Creator!',
        message: 'Your account has been upgraded. Start creating your store!',
      });
      this.router.navigate(['/dashboard']);
    } else {
      this.toaster.error({
        title: 'Upgrade Failed',
        message: result.message || 'Failed to upgrade. Please try again.',
      });
    }
  }
}
