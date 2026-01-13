import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="hero-card bg-gradient-to-br from-[#b8e6c9] via-[#c8f0d0] to-[#d8f8e0] rounded-[2rem] mx-4 md:mx-8 lg:mx-12 mt-4">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
            <div class="text-center">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm mb-6">
                <span class="text-sm font-medium text-gray-800">Your smart online shop creator</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight uppercase tracking-tight">
                Build your online shop.<br class="hidden sm:block">Sell instantly.
              </h1>
              
              <!-- Subtext -->
              <p class="text-lg md:text-xl text-gray-700/80 max-w-2xl mx-auto mb-8">
                A no-code online shop builder to convert visitors into buyers. Sell digital goods, memberships, and merchandise, all without any charges or complications.
              </p>
              
              <!-- CTA Button -->
              <div class="mb-4">
                <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Begin free trial
                </a>
              </div>
              
              <!-- Trial note -->
              <p class="text-sm text-gray-600/60">14-day free trial, no payment info needed.</p>
            </div>
            
            <!-- Hero Images -->
            <div class="mt-12 relative">
              <div class="flex justify-center items-end gap-4">
                <!-- Left floating card -->
                <div class="hidden md:block w-24 lg:w-32 transform hover:-translate-y-2 transition-transform duration-300">
                  <div class="bg-white rounded-xl shadow-lg p-3">
                    <div class="text-xs text-gray-500 mb-1">Create my store</div>
                    <div class="h-2 bg-gray-100 rounded"></div>
                  </div>
                </div>
                
                <!-- Main center image placeholder -->
                <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div class="bg-gray-100 h-64 md:h-80 lg:h-96 flex items-center justify-center">
                    <div class="text-center p-8">
                      <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <p class="text-gray-500 font-medium">Your store preview</p>
                    </div>
                  </div>
                </div>
                
                <!-- Right floating card -->
                <div class="hidden md:block w-32 lg:w-40 transform hover:-translate-y-2 transition-transform duration-300">
                  <div class="bg-white rounded-xl shadow-lg p-3">
                    <div class="text-xs text-gray-500 mb-2">Upload new product</div>
                    <div class="flex gap-1">
                      <div class="w-8 h-8 bg-gray-100 rounded"></div>
                      <div class="w-8 h-8 bg-gray-100 rounded"></div>
                      <div class="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Creators Stats Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-6xl mx-auto text-center">
          <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-12">
            Join over 80K+ makers who've generated $180M+ in sales online <em class="font-normal">with no transaction fees.</em>
          </h2>
          
          <!-- Creators showcase -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <div *ngFor="let creator of creators" class="bg-gray-100 rounded-2xl aspect-[4/5] overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div class="h-full bg-gradient-to-br" [ngClass]="creator.gradient"></div>
            </div>
          </div>
          
          <!-- Trust indicators -->
          <div class="flex justify-center items-center gap-2">
            <div class="flex -space-x-1">
              <div class="w-6 h-6 rounded-full bg-green-500"></div>
              <div class="w-6 h-6 rounded-full bg-green-400"></div>
              <div class="w-6 h-6 rounded-full bg-green-300"></div>
            </div>
            <span class="text-sm text-gray-600">Excellent on Trustpilot</span>
          </div>
        </div>
      </section>

      <!-- How to Create Section -->
      <section class="py-8 px-4 md:px-8 lg:px-12">
        <div class="max-w-6xl mx-auto">
          <div class="border-t border-gray-200 pt-16"></div>
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 class="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-tight">
              How to set up an<br>online shop
            </h2>
            <div class="text-6xl">✨</div>
          </div>
        </div>
      </section>

      <!-- Templates Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="hero-card bg-gradient-to-br from-[#fff3d0] via-[#fff7e0] to-[#fffbeb] rounded-[2rem] overflow-hidden">
            <div class="p-8 md:p-12 lg:p-16 text-center">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Launch with ready-made designs<br>for quick online shops.
              </h3>
              <p class="text-lg text-gray-700/80 max-w-xl mx-auto mb-8">
                Pick from complimentary online shop designs. Customize as you like or launch immediately.
              </p>
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200">
                Build your shop
              </a>
            </div>
            
            <!-- Template previews slider effect -->
            <div class="relative h-64 md:h-80 bg-gradient-to-t from-white/50 to-transparent">
              <div class="absolute inset-0 flex items-end justify-center gap-4 pb-8 overflow-hidden">
                <div class="w-48 h-56 bg-white rounded-xl shadow-lg transform -rotate-6 translate-y-8"></div>
                <div class="w-48 h-56 bg-white rounded-xl shadow-xl transform translate-y-4"></div>
                <div class="w-48 h-56 bg-white rounded-xl shadow-lg transform rotate-6 translate-y-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customization Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="hero-card bg-gradient-to-br from-[#e0e0ff] via-[#ebebff] to-[#f5f2ff] rounded-[2rem] overflow-hidden">
            <div class="p-8 md:p-12 lg:p-16 text-center">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Personalize with our drag-and-drop<br>shop editor.
              </h3>
              <p class="text-lg text-gray-700/80 max-w-xl mx-auto mb-8">
                Design a unique shop that looks great on desktop and mobile, piece by piece like building blocks. Drag, drop, done, zero coding.
              </p>
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200">
                Build your shop
              </a>
            </div>
            
            <!-- Builder preview -->
            <div class="relative h-48 md:h-64 bg-gradient-to-t from-white/50 to-transparent">
              <div class="absolute inset-0 flex items-end justify-center pb-8">
                <div class="w-3/4 max-w-2xl h-40 bg-white rounded-xl shadow-xl flex">
                  <div class="w-1/4 bg-gray-50 rounded-l-xl p-4">
                    <div class="space-y-2">
                      <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div class="flex-1 p-4">
                    <div class="h-full bg-gray-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Digital Products Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-6xl mx-auto text-center">
          <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Upload your digital items...
          </h3>
          <p class="text-lg text-gray-700/80 max-w-lg mx-auto mb-8">
            Offer eBooks, music, videos, graphics, and more.<br>Up to 20GB per file. Your massive, beautiful files.
          </p>
          <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200 mb-12">
            Build your shop
          </a>
          
          <!-- Products gallery -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div *ngFor="let product of digitalProducts" 
                 class="bg-gray-100 rounded-2xl aspect-square overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                 [ngClass]="product.bg">
              <div class="h-full flex items-center justify-center p-4">
                <span class="text-3xl">{{ product.icon }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Subscription Products Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Content -->
            <div class="order-2 lg:order-1 text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ... membership<br>products
              </h3>
              <p class="text-lg text-gray-700/80 mb-8">
                Convert fans into members with monthly, yearly, or one-time plans, featuring automated billing. Ideal for newsletters, fitness programs, exclusive content, and recurring digital goods. Steady revenue for you, seamless for them.
              </p>
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200">
                Build your shop
              </a>
              
              <!-- Loved by creators -->
              <div class="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 border-2 border-white"></div>
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white"></div>
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 border-2 border-white"></div>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">Loved by 60,000+</span><br>
                  <span class="text-gray-600">creators and entrepreneurs</span>
                </div>
              </div>
            </div>
            
            <!-- Image -->
            <div class="order-1 lg:order-2">
              <div class="bg-gradient-to-br from-[#fce7f3] via-[#fdf2f8] to-[#fef7fa] rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div class="text-center">
                  <div class="text-6xl mb-4">💳</div>
                  <p class="text-gray-600">Subscription preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Physical Products Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Image -->
            <div>
              <div class="bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#f0f9ff] rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div class="text-center">
                  <div class="text-6xl mb-4">📦</div>
                  <p class="text-gray-600">Physical products preview</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ... or even tangible products.
              </h3>
              <p class="text-lg text-gray-700/80 mb-8">
                Books, posters, stickers, decor, whatever!<br>Macaroni art? Absolutely!
              </p>
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200">
                Build your shop
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Print on Demand Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-6xl mx-auto text-center">
          <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Produce print-on-demand apparel.
          </h3>
          <p class="text-lg text-gray-700/80 max-w-xl mx-auto mb-12">
            Custom print-on-demand without initial costs, shipped quickly from one of our <strong>11 distribution hubs</strong>.<br>They'll POD the speed and excellence.
          </p>
          
          <!-- Merch carousel -->
          <div class="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8">
            <div *ngFor="let merch of merchItems" class="text-center">
              <div class="bg-gray-100 rounded-2xl aspect-square mb-2 flex items-center justify-center text-4xl hover:shadow-lg transition-shadow duration-300">
                {{ merch.icon }}
              </div>
              <span class="text-sm text-gray-600">{{ merch.name }}</span>
            </div>
          </div>
          
          <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200">
            Create your store
          </a>
        </div>
      </section>

      <!-- Marketing Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="bg-gradient-to-br from-[#fef2c7] via-[#fef9c3] to-[#fefce8] rounded-[2rem] overflow-hidden">
            <div class="grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
              <!-- Content -->
              <div class="text-center lg:text-left">
                <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Automate your<br>promotion.
                </h3>
                <p class="text-lg text-gray-700/80 mb-8">
                  Put promotion on auto-pilot, concentrate more on your passion.
                </p>
                
                <!-- Features grid -->
                <div class="grid grid-cols-2 gap-6 mb-8">
                  <div *ngFor="let feature of marketingFeatures" class="text-left">
                    <div class="w-10 h-10 bg-white/60 rounded-lg flex items-center justify-center mb-3">
                      <span class="text-xl">{{ feature.icon }}</span>
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-1">{{ feature.title }}</h4>
                    <p class="text-sm text-gray-600">{{ feature.description }}</p>
                  </div>
                </div>
                
                <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200">
                  Create your store
                </a>
              </div>
              
              <!-- Visual -->
              <div class="flex items-center justify-center">
                <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-lg"></div>
                      <div class="flex-1">
                        <div class="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
                        <div class="h-2 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div class="h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl"></div>
                    <div class="flex gap-2">
                      <div class="flex-1 h-3 bg-gray-100 rounded"></div>
                      <div class="w-16 h-3 bg-amber-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Checkout Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Image -->
            <div>
              <div class="bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#f8fafc] rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div class="w-full max-w-xs bg-white rounded-xl shadow-lg p-6">
                  <div class="text-center mb-4">
                    <div class="text-4xl mb-2">💰</div>
                    <p class="font-semibold text-gray-900">Checkout</p>
                  </div>
                  <div class="space-y-3">
                    <div class="flex gap-2">
                      <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">VISA</div>
                      <div class="w-12 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">MC</div>
                      <div class="w-12 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">PP</div>
                    </div>
                    <div class="h-10 bg-gray-100 rounded"></div>
                    <div class="h-10 bg-gray-900 rounded text-white flex items-center justify-center text-sm font-medium">
                      Pay Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Implement a conversion-optimized checkout.
              </h3>
              <p class="text-lg text-gray-700/80 mb-8">
                Accelerate purchases with streamlined checkout. PayPal, Stripe, Apple Pay, Google Pay, and cards supported.
              </p>
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200">
                Build your shop
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Support Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="bg-gradient-to-br from-[#d1fae5] via-[#ecfdf5] to-[#f0fdf4] rounded-[2rem] overflow-hidden">
            <div class="grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
              <!-- Content -->
              <div class="text-center lg:text-left">
                <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Need assistance? We're available around the clock!
                </h3>
                <p class="text-lg text-gray-700/80 mb-8">
                  Got queries, require help, or just a gentle push to launch your dream online shop? Our experts and support team are here day and night!
                </p>
                
                <!-- Support links -->
                <div class="space-y-3 mb-8">
                  <a href="#" class="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">💬</span>
                      <span class="font-medium">Expert assistance</span>
                    </div>
                    <span>→</span>
                  </a>
                  <a href="#" class="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">🎬</span>
                      <span class="font-medium">Video tutorials</span>
                    </div>
                    <span>→</span>
                  </a>
                  <a href="#" class="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white transition-colors duration-200">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">📚</span>
                      <span class="font-medium">Guides & Resources</span>
                    </div>
                    <span>→</span>
                  </a>
                </div>
              </div>
              
              <!-- Image -->
              <div class="flex items-center justify-center">
                <div class="relative">
                  <div class="w-64 h-64 bg-white rounded-full flex items-center justify-center">
                    <span class="text-8xl">🤗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Comparison Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Launch for free today. Upgrade when ready.<br>No transaction fees ever.
            </h2>
          </div>
          
          <!-- Pricing table -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
              <div></div>
              <div class="text-center">
                <div class="w-24 h-8 bg-gray-900 rounded mx-auto mb-2"></div>
                <span class="text-sm text-gray-600">Our Platform</span>
              </div>
              <div class="text-center">
                <span class="text-sm text-gray-600">Alternatives</span>
              </div>
            </div>
            
            <!-- Total costs row -->
            <div class="grid grid-cols-3 gap-4 p-6 border-b items-center">
              <div class="font-medium">Total costs</div>
              <div class="text-center">
                <span class="text-gray-500 text-sm">From </span>
                <span class="text-2xl font-bold">$22</span>
                <span class="text-gray-500">/mo</span>
                <div class="text-sm text-gray-500">0% Transaction fees</div>
              </div>
              <div class="text-center">
                <span class="text-gray-500 text-sm">From </span>
                <span class="text-2xl font-bold text-gray-400 line-through">$290</span>
                <span class="text-gray-500">/mo</span>
                <div class="text-sm text-gray-500">+10% Transaction fees</div>
              </div>
            </div>
            
            <!-- Feature rows -->
            <div *ngFor="let row of pricingRows" class="grid grid-cols-3 gap-4 p-6 border-b items-center">
              <div class="font-medium">{{ row.feature }}</div>
              <div class="text-center">
                <span class="text-2xl text-green-500">✓</span>
              </div>
              <div class="text-center">
                <div class="text-sm text-gray-500">{{ row.alternative }}</div>
                <div class="font-semibold">{{ row.altPrice }}</div>
              </div>
            </div>
            
            <!-- CTA -->
            <div class="p-6 text-center bg-gray-50">
              <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors duration-200">
                Start free trial
              </a>
              <p class="text-sm text-gray-500 mt-2">14-day free trial, no card required.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              Cherished by makers
            </h2>
          </div>
          
          <!-- Testimonials grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div *ngFor="let testimonial of testimonials" 
                 class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                 [ngClass]="{'lg:col-span-1': !testimonial.featured, 'bg-gray-900 text-white': testimonial.featured}">
              <div class="flex items-center gap-3 mb-4" *ngIf="!testimonial.featured">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br" [ngClass]="testimonial.avatarGradient"></div>
                <div class="font-semibold">{{ testimonial.name }}</div>
              </div>
              <p class="text-gray-600" [ngClass]="{'text-gray-300': testimonial.featured, 'text-center text-xl font-dm-sans font-bold': testimonial.featured}">
                {{ testimonial.quote }}
              </p>
              <div class="mt-4 text-center" *ngIf="testimonial.featured">
                <div class="font-semibold">{{ testimonial.name }}</div>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <a routerLink="/explore" class="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors duration-200">
              Read success stories
            </a>
          </div>
        </div>
      </section>

      <!-- Media Section -->
      <section class="py-16 px-4 md:px-8 lg:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-br from-[#fce7f3] via-[#fdf2f8] to-[#fef7fa] rounded-[2rem] p-8 md:p-12 text-center">
            <h3 class="font-dm-sans text-xl md:text-2xl font-semibold text-gray-900 mb-8">
              Shoutouts by media
            </h3>
            <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <span class="text-xl md:text-2xl font-bold text-gray-700">Forbes</span>
              <span class="text-xl md:text-2xl font-bold text-gray-700">Metro</span>
              <span class="text-xl md:text-2xl font-bold text-gray-700">Inc.</span>
              <span class="text-xl md:text-2xl font-bold text-gray-700">WIRED</span>
              <span class="text-xl md:text-2xl font-bold text-gray-700">Observer</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-3 gap-8">
            <div>
              <h2 class="font-dm-sans text-3xl md:text-4xl font-bold text-gray-900 sticky top-24">
                FAQs
              </h2>
            </div>
            <div class="md:col-span-2 space-y-4">
              <div *ngFor="let faq of faqs" class="border-b border-gray-200 pb-4">
                <button 
                  (click)="toggleFaq(faq.id)"
                  class="w-full text-left py-4 flex items-center justify-between font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200">
                  {{ faq.question }}
                  <span class="text-2xl transform transition-transform duration-200" [class.rotate-180]="faq.isOpen">
                    ▼
                  </span>
                </button>
                <div class="overflow-hidden transition-all duration-300" [class.max-h-0]="!faq.isOpen" [class.max-h-96]="faq.isOpen">
                  <p class="text-gray-600 pb-4">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12">
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-br from-[#c6f4d1] via-[#d0f7dc] to-[#e8fbee] rounded-[2rem] p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
            <h2 class="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ready to launch a shop?<br>Why wait!
            </h2>
            <a routerLink="/become-creator" class="inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors duration-200 mt-6">
              Start free
            </a>
            
            <!-- Decorative elements -->
            <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-white/30 rounded-full"></div>
            <div class="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full"></div>
            <div class="absolute bottom-8 right-8 text-6xl">🙋</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }
    
    .hero-card {
      transition: all 0.3s ease;
    }
    
    .hero-card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class HomeComponent implements OnInit {
  creators = [
    { gradient: 'from-pink-200 to-pink-300' },
    { gradient: 'from-blue-200 to-blue-300' },
    { gradient: 'from-green-200 to-green-300' },
    { gradient: 'from-purple-200 to-purple-300' },
    { gradient: 'from-yellow-200 to-yellow-300' },
    { gradient: 'from-indigo-200 to-indigo-300' },
  ];

  digitalProducts = [
    { icon: '📚', bg: 'bg-blue-50' },
    { icon: '🎵', bg: 'bg-purple-50' },
    { icon: '🎬', bg: 'bg-red-50' },
    { icon: '🎨', bg: 'bg-pink-50' },
    { icon: '📝', bg: 'bg-yellow-50' },
    { icon: '💻', bg: 'bg-green-50' },
    { icon: '📷', bg: 'bg-indigo-50' },
    { icon: '🎮', bg: 'bg-orange-50' },
    { icon: '📊', bg: 'bg-teal-50' },
    { icon: '🎯', bg: 'bg-cyan-50' },
  ];

  merchItems = [
    { icon: '👕', name: 'T-shirt' },
    { icon: '🧢', name: 'Cap' },
    { icon: '👟', name: 'Shoes' },
    { icon: '🎒', name: 'Bag' },
    { icon: '☕', name: 'Mug' },
    { icon: '🧣', name: 'Scarf' },
    { icon: '🧦', name: 'Socks' },
  ];

  marketingFeatures = [
    { icon: '👥', title: 'Affiliate marketing', description: 'Promote your products through affiliates to reach a larger audience at scale.' },
    { icon: '📧', title: 'Email marketing', description: 'Create email campaigns to drive more sales.' },
    { icon: '🌐', title: 'SEO', description: 'Boost your search visibility so more customers can find your store.' },
    { icon: '🏷️', title: 'Product upselling', description: 'Never let a customer leave without considering your upsell offer.' },
  ];

  pricingRows = [
    { feature: 'Online store', alternative: 'Shopify', altPrice: '$29/mo' },
    { feature: 'Monetize digital goods', alternative: 'Gumroad', altPrice: '10% transaction fee' },
    { feature: 'Print-on-demand', alternative: 'Printful', altPrice: 'Free' },
    { feature: 'Subscriptions', alternative: 'Subbly', altPrice: '$39/mo' },
    { feature: 'Email marketing', alternative: 'Kit', altPrice: '$0-$1000/mo' },
    { feature: 'Affiliate marketing', alternative: 'Refersion', altPrice: '$99/mo' },
  ];

  testimonials = [
    { 
      name: 'Linda Skuja', 
      quote: 'I really like the easy and user-friendly checkout process—it\'s literally just two clicks and it\'s done.',
      avatarGradient: 'from-pink-400 to-rose-500',
      featured: false
    },
    { 
      name: 'Brayden McPhee', 
      quote: 'The UI is simple enough that my mum could use it.',
      avatarGradient: 'from-blue-400 to-indigo-500',
      featured: true
    },
    { 
      name: 'David Killingsworth', 
      quote: 'I started selling digital products on the platform and couldn\'t be happier. It has really changed my life!',
      avatarGradient: 'from-green-400 to-emerald-500',
      featured: false
    },
    { 
      name: 'Austin Newman', 
      quote: 'This platform allowed me to transition to doing content creation and selling my assets full-time.',
      avatarGradient: 'from-purple-400 to-violet-500',
      featured: false
    },
    { 
      name: 'Christian Maté Grab', 
      quote: 'These tools turned my hobby into a six-figure business.',
      avatarGradient: 'from-amber-400 to-orange-500',
      featured: true
    },
    { 
      name: 'EfikZara', 
      quote: 'The user experience is so effortless that it\'s easy to get a high conversion rate.',
      avatarGradient: 'from-teal-400 to-cyan-500',
      featured: false
    },
  ];

  faqs = [
    { 
      id: 1,
      question: 'What is this online store builder?',
      answer: 'Our online store builder is a tool for creating a digital store without having to code anything. The builder comes with free templates, product management features, marketing tools, and payment integrations.',
      isOpen: false
    },
    { 
      id: 2,
      question: 'What payment methods are available?',
      answer: 'You can use both Stripe and PayPal. This means customers can pay with a credit/debit card, Apple Pay, Google Pay, or a PayPal account. Best of all, this money goes straight to you.',
      isOpen: false
    },
    { 
      id: 3,
      question: 'Are there any transaction fees?',
      answer: 'We don\'t take a cut of your sales, and fees are not a part of your subscription cost. You\'ll only pay for a monthly or yearly plan that matches your store\'s revenue.',
      isOpen: false
    },
    { 
      id: 4,
      question: 'Can I build a free online store?',
      answer: 'Yes, you can create a free online store with our 14-day trial. You can customize the store\'s design and add digital, physical, subscription, or print-on-demand products.',
      isOpen: false
    },
    { 
      id: 5,
      question: 'What\'s the digital file size limit?',
      answer: 'The maximum file size of your digital product depends on your plan. It ranges from 10GB for our Starter plan up to 20GB for the Premium plan. As for overall storage, there are no limits.',
      isOpen: false
    },
    { 
      id: 6,
      question: 'Do I need coding skills?',
      answer: 'No coding needed. You can create and customize your store with an easy drag-and-drop builder, so you can launch your online business in minutes.',
      isOpen: false
    },
  ];

  ngOnInit() {}

  toggleFaq(id: number) {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      faq.isOpen = !faq.isOpen;
    }
  }
}
