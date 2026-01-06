import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 text-balance">
              The marketplace for
              <span class="text-primary-600">digital creators</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Sell templates, courses, designs, and digital products to a global audience. 
              No coding required. Start earning in minutes.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a routerLink="/become-creator" class="btn-primary text-lg px-8 py-3">
                Start Selling
              </a>
              <a href="#explore" class="btn-outline text-lg px-8 py-3">
                Explore Products
              </a>
            </div>
          </div>
        </div>
        
        <!-- Background decoration -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div class="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div class="absolute bottom-20 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Everything you need to sell digital products
            </h2>
            <p class="text-xl text-gray-600">
              Built for creators who want to focus on creating, not managing infrastructure.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="card p-8 text-center">
              <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">Instant Setup</h3>
              <p class="text-gray-600">Create your store in minutes. Upload products and start selling immediately.</p>
            </div>

            <div class="card p-8 text-center">
              <div class="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg class="w-7 h-7 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">Secure Delivery</h3>
              <p class="text-gray-600">Files are protected with license-based access and secure download links.</p>
            </div>

            <div class="card p-8 text-center">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3">Easy Payments</h3>
              <p class="text-gray-600">Accept payments via Razorpay. Get paid directly to your account.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-24 bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to start selling?
          </h2>
          <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already earning on Creator Market.
          </p>
          <a routerLink="/become-creator" class="btn-primary text-lg px-8 py-3">
            Create Your Store
          </a>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  ngOnInit() {}
}
