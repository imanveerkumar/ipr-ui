import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="hero-card bg-[#F9F4EB] border-2 border-black rounded-[2rem] mx-4 md:mx-8 lg:mx-12 mt-4 relative">
          <!-- Decorative grid pattern -->
          <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
          
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 relative z-10">
            <div class="text-center">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-[#2B57D6] border-2 border-black mb-6 transform -rotate-2 hover:rotate-0 transition-transform">
                <span class="text-sm font-bold text-white uppercase tracking-wider">Your smart online shop creator</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#111111] mb-6 leading-tight uppercase tracking-tight">
                Build your online shop.<br class="hidden sm:block">Sell instantly.
              </h1>
              
              <!-- Subtext -->
              <p class="text-lg md:text-xl text-[#111111]/80 max-w-2xl mx-auto mb-8 font-medium">
                A no-code online shop builder to convert visitors into buyers. Sell digital goods, memberships, and merchandise, all without any charges or complications.
              </p>
              
              <!-- CTA Button -->
              <div class="mb-4">
                <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                  Begin free trial
                </a>
              </div>
              
              <!-- Trial note -->
              <p class="text-sm text-[#111111]/60 font-medium">14-day free trial, no payment info needed.</p>
            </div>
            
            <!-- Hero Images -->
            <div class="mt-12 relative">
              <div class="flex justify-center items-end gap-4">
                <!-- Left floating card -->
                <div class="hidden md:block w-24 lg:w-32 transform hover:-translate-y-2 transition-transform duration-300">
                  <div class="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] p-3">
                    <div class="text-xs font-bold text-[#111111] mb-1">Create my store</div>
                    <div class="h-2 bg-gray-100 rounded border border-black/10"></div>
                  </div>
                </div>
                
                <!-- Main center image placeholder -->
                <div class="w-full max-w-3xl bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden">
                  <div class="bg-gray-50 h-64 md:h-80 lg:h-96 flex items-center justify-center border-b-2 border-black">
                    <div class="text-center p-8">
                      <div class="w-16 h-16 bg-[#F9F4EB] border-2 border-black rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-8 h-8 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 22V12h6v10" />
                        </svg>
                      </div>
                      <p class="text-[#111111] font-bold">Your store preview</p>
                    </div>
                  </div>
                </div>
                
                <!-- Right floating card -->
                <div class="hidden md:block w-32 lg:w-40 transform hover:-translate-y-2 transition-transform duration-300">
                  <div class="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] p-3">
                    <div class="text-xs font-bold text-[#111111] mb-2">Upload new product</div>
                    <div class="flex gap-1">
                      <div class="w-8 h-8 bg-gray-100 rounded border border-black/10"></div>
                      <div class="w-8 h-8 bg-gray-100 rounded border border-black/10"></div>
                      <div class="w-8 h-8 bg-[#68E079] rounded border border-black flex items-center justify-center">
                        <svg class="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-6xl mx-auto text-center">
          <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-12">
            Join over 80K+ makers who've generated $180M+ in sales online <span class="relative inline-block px-2"><span class="absolute inset-0 bg-[#FFC60B] transform -rotate-2 -z-10 rounded border border-black"></span><em class="font-normal not-italic relative z-10">with no transaction fees.</em></span>
          </h2>
          
          <!-- Creators showcase -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <div *ngFor="let creator of creators" class="bg-white border-2 border-black rounded-2xl aspect-[4/5] overflow-hidden hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-300">
              <div class="h-full w-full" [ngStyle]="{'background-color': creator.color || '#F9F4EB'}"></div>
            </div>
          </div>
          
          <!-- Trust indicators -->
          <div class="flex justify-center items-center gap-2">
            <div class="flex -space-x-1">
              <div class="w-7 h-7 rounded-full bg-[#68E079] border-2 border-black"></div>
              <div class="w-7 h-7 rounded-full bg-[#68E079] border-2 border-black"></div>
              <div class="w-7 h-7 rounded-full bg-[#68E079] border-2 border-black"></div>
            </div>
            <span class="text-sm font-bold text-[#111111]">Excellent on Trustpilot</span>
          </div>
        </div>
      </section>

      <!-- How to Create Section -->
      <section class="py-8 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-6xl mx-auto">
          <div class="border-t-2 border-dashed border-black pt-16"></div>
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 class="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] uppercase tracking-tight">
              How to set up an<br>online shop
            </h2>
            <div class="w-16 h-16 transform hover:rotate-12 transition-transform text-[#111111]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Templates Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="hero-card bg-[#FA4B28] border-2 border-black rounded-[2rem] overflow-hidden">
            <div class="p-8 md:p-12 lg:p-16 text-center">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Launch with ready-made designs<br>for quick online shops.
              </h3>
              <p class="text-lg text-white/90 max-w-xl mx-auto mb-8 font-medium">
                Pick from complimentary online shop designs. Customize as you like or launch immediately.
              </p>
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Build your shop
              </a>
            </div>
            
            <!-- Template previews slider effect -->
            <div class="relative h-64 md:h-80 bg-gradient-to-t from-[#FA4B28] to-transparent">
              <div class="absolute inset-0 flex items-end justify-center gap-4 pb-8 overflow-hidden">
                <div class="w-48 h-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transform -rotate-6 translate-y-8"></div>
                <div class="w-48 h-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transform translate-y-4"></div>
                <div class="w-48 h-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] transform rotate-6 translate-y-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customization Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="hero-card bg-[#2B57D6] border-2 border-black rounded-[2rem] overflow-hidden">
            <div class="p-8 md:p-12 lg:p-16 text-center">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Personalize with our drag-and-drop<br>shop editor.
              </h3>
              <p class="text-lg text-white/90 max-w-xl mx-auto mb-8 font-medium">
                Design a unique shop that looks great on desktop and mobile, piece by piece like building blocks. Drag, drop, done, zero coding.
              </p>
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Build your shop
              </a>
            </div>
            
            <!-- Builder preview -->
            <div class="relative h-48 md:h-64 bg-gradient-to-t from-[#2B57D6] to-transparent">
              <div class="absolute inset-0 flex items-end justify-center pb-8">
                <div class="w-3/4 max-w-2xl h-40 bg-[#F9F4EB] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] flex overflow-hidden">
                  <div class="w-1/4 bg-white border-r-2 border-black p-4">
                    <div class="space-y-2">
                      <div class="h-3 bg-black/10 rounded w-3/4"></div>
                      <div class="h-3 bg-black/10 rounded w-1/2"></div>
                      <div class="h-3 bg-black/10 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div class="flex-1 p-4 bg-[#F9F4EB]">
                    <div class="h-full bg-white border-2 border-black/10 border-dashed rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Digital Products Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-6xl mx-auto text-center">
          <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
            Upload your digital items...
          </h3>
          <p class="text-lg text-[#111111]/80 max-w-lg mx-auto mb-8 font-medium">
            Offer eBooks, music, videos, graphics, and more.<br>Up to 20GB per file. Your massive, beautiful files.
          </p>
          <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] mb-12">
            Build your shop
          </a>
          
          <!-- Products gallery -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div *ngFor="let product of digitalProducts" 
                 class="bg-white border-2 border-black rounded-2xl aspect-square overflow-hidden hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-300 hover:-translate-y-1">
              <div class="h-full flex items-center justify-center p-4">
                <div [innerHTML]="getSafeSvg(product.icon)" class="w-12 h-12 text-[#111111]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Subscription Products Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Content -->
            <div class="order-2 lg:order-1 text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
                ... membership<br>products
              </h3>
              <p class="text-lg text-[#111111]/80 mb-8 font-medium">
                Convert fans into members with monthly, yearly, or one-time plans, featuring automated billing. Ideal for newsletters, fitness programs, exclusive content, and recurring digital goods. Steady revenue for you, seamless for them.
              </p>
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Build your shop
              </a>
              
              <!-- Loved by creators -->
              <div class="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-[#FA4B28] border-2 border-black"></div>
                  <div class="w-8 h-8 rounded-full bg-[#2B57D6] border-2 border-black"></div>
                  <div class="w-8 h-8 rounded-full bg-[#68E079] border-2 border-black"></div>
                </div>
                <div class="text-sm text-[#111111]">
                  <span class="font-bold">Loved by 60,000+</span><br>
                  <span class="text-[#111111]/80 font-medium">creators and entrepreneurs</span>
                </div>
              </div>
            </div>
            
            <!-- Image -->
            <div class="order-1 lg:order-2">
              <div class="bg-[#F9F4EB] border-2 border-black rounded-2xl p-8 aspect-square flex items-center justify-center relative">
                 <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
                <div class="text-center relative z-10 flex flex-col items-center">
                  <div class="w-16 h-16 mb-4 text-[#111111]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <p class="text-[#111111] font-bold">Subscription preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Physical Products Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Image -->
            <div>
              <div class="bg-[#FFC60B] border-2 border-black rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div class="text-center flex flex-col items-center">
                  <div class="w-16 h-16 mb-4 text-[#111111]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <p class="text-[#111111] font-bold">Physical products preview</p>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
                ... or even tangible products.
              </h3>
              <p class="text-lg text-[#111111]/80 mb-8 font-medium">
                Books, posters, stickers, decor, whatever!<br>Macaroni art? Absolutely!
              </p>
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Build your shop
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Print on Demand Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-6xl mx-auto text-center">
          <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
            Produce print-on-demand apparel.
          </h3>
          <p class="text-lg text-[#111111]/80 max-w-xl mx-auto mb-12 font-medium">
            Custom print-on-demand without initial costs, shipped quickly from one of our <strong>11 distribution hubs</strong>.<br>They'll POD the speed and excellence.
          </p>
          
          <!-- Merch carousel -->
          <div class="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8">
            <div *ngFor="let merch of merchItems" class="text-center group">
              <div class="bg-white border-2 border-black rounded-2xl aspect-square mb-2 flex items-center justify-center group-hover:shadow-[4px_4px_0px_0px_#000] group-hover:-translate-y-1 transition-all duration-300">
                <div [innerHTML]="getSafeSvg(merch.icon)" class="w-10 h-10 text-[#111111]"></div>
              </div>
              <span class="text-sm font-bold text-[#111111]">{{ merch.name }}</span>
            </div>
          </div>
          
          <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
            Create your store
          </a>
        </div>
      </section>

      <!-- Marketing Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="hero-card bg-[#F9F4EB] border-2 border-black rounded-[2rem] overflow-hidden">
            <div class="grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
              <!-- Content -->
              <div class="text-center lg:text-left">
                <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
                  Automate your<br>promotion.
                </h3>
                <p class="text-lg text-[#111111]/80 mb-8 font-medium">
                  Put promotion on auto-pilot, concentrate more on your passion.
                </p>
                
                <!-- Features grid -->
                <div class="grid grid-cols-2 gap-6 mb-8">
                  <div *ngFor="let feature of marketingFeatures" class="text-left">
                    <div class="w-10 h-10 bg-[#FA4B28] text-white border border-black rounded-lg flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_#000]">
                      <div [innerHTML]="getSafeSvg(feature.icon)" class="w-6 h-6"></div>
                    </div>
                    <h4 class="font-bold text-[#111111] mb-1">{{ feature.title }}</h4>
                    <p class="text-sm text-[#111111]/70 font-medium">{{ feature.description }}</p>
                  </div>
                </div>
                
                    <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                  Create your store
                </a>
              </div>
              
              <!-- Visual -->
              <div class="flex items-center justify-center">
                <div class="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] p-6">
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-[#2B57D6] rounded-lg border border-black"></div>
                      <div class="flex-1">
                        <div class="h-3 bg-gray-200 rounded w-3/4 mb-2 border border-black/10"></div>
                        <div class="h-2 bg-gray-200 rounded w-1/2 border border-black/10"></div>
                      </div>
                    </div>
                    <div class="h-32 bg-[#F9F4EB] rounded-xl border border-black flex items-center justify-center">
                        <div class="w-12 h-12 text-[#111111]">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                    </div>
                    <div class="flex gap-2">
                      <div class="flex-1 h-3 bg-gray-200 rounded border border-black/10"></div>
                      <div class="w-16 h-3 bg-[#FFC60B] rounded border border-black"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Checkout Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <!-- Image -->
            <div>
              <div class="bg-[#2B57D6] border-2 border-black rounded-2xl p-4 md:p-8 aspect-square flex items-center justify-center relative">
                 <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
                <div class="w-full max-w-xs bg-white border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] p-4 md:p-6 relative z-10 scale-90 md:scale-100 origin-center">
                  <div class="text-center mb-4 flex flex-col items-center">
                    <div class="w-12 h-12 mb-2 text-[#111111]">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p class="font-bold text-[#111111]">Checkout</p>
                  </div>
                  <div class="space-y-3">
                    <div class="flex gap-2 justify-center">
                      <div class="w-12 h-8 bg-[#2B57D6] rounded border border-black flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <div class="w-12 h-8 bg-[#FA4B28] rounded border border-black flex items-center justify-center text-white text-xs font-bold">MC</div>
                      <div class="w-12 h-8 bg-[#00457C] rounded border border-black flex items-center justify-center text-white text-xs font-bold">PP</div>
                    </div>
                    <div class="h-10 bg-gray-100 rounded border border-black/10"></div>
                    <div class="h-10 bg-[#111111] rounded border border-black text-white flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_0px_#666]">
                      Pay Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Content -->
            <div class="text-center lg:text-left">
              <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
                Implement a conversion-optimized checkout.
              </h3>
              <p class="text-lg text-[#111111]/80 mb-8 font-medium">
                Accelerate purchases with streamlined checkout. PayPal, Stripe, Apple Pay, Google Pay, and cards supported.
              </p>
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Build your shop
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Support Section -->
      <section class="py-12 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="bg-[#68E079] border-2 border-black rounded-[2rem] overflow-hidden">
            <div class="grid lg:grid-cols-2 gap-8 p-6 md:p-12 lg:p-16">
              <!-- Content -->
              <div class="text-center lg:text-left order-2 lg:order-1">
                <h3 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
                  Need assistance? We're available around the clock!
                </h3>
                <p class="text-lg text-[#111111] mb-8 font-medium">
                  Got queries, require help, or just a gentle push to launch your dream online shop? Our experts and support team are here day and night!
                </p>
                
                <!-- Support links -->
                <div class="space-y-3 mb-8">
                  <a href="#" class="group flex items-center justify-between p-4 bg-white border-2 border-black rounded-xl hover:bg-[#F9F4EB] transition-colors duration-200 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]">
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 text-[#111111] flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                      <span class="font-bold text-[#111111] text-left">Expert assistance</span>
                    </div>
                    <div class="w-5 h-5 text-[#111111] flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </a>
                  <a href="#" class="group flex items-center justify-between p-4 bg-white border-2 border-black rounded-xl hover:bg-[#F9F4EB] transition-colors duration-200 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]">
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 text-[#111111] flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <span class="font-bold text-[#111111] text-left">Video tutorials</span>
                    </div>
                    <div class="w-5 h-5 text-[#111111] flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </a>
                  <a href="#" class="group flex items-center justify-between p-4 bg-white border-2 border-black rounded-xl hover:bg-[#F9F4EB] transition-colors duration-200 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]">
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 text-[#111111] flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <span class="font-bold text-[#111111] text-left">Guides & Resources</span>
                    </div>
                    <div class="w-5 h-5 text-[#111111] flex-shrink-0">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </a>
                </div>
              </div>
              
              <!-- Image -->
              <div class="flex items-center justify-center order-1 lg:order-2">
                <div class="relative scale-90 md:scale-100">
                  <div class="w-48 h-48 md:w-64 md:h-64 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_#000]">
                    <div class="w-24 h-24 md:w-32 md:h-32 text-[#111111]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Comparison Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111]">
              Launch for free today. Upgrade when ready.<br>No transaction fees ever.
            </h2>
          </div>
          
          <!-- Pricing table -->
          <div class="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            <!-- Header -->
            <div class="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-6 bg-[#F9F4EB] border-b-2 border-black">
              <div></div>
              <div class="text-center">
                <div class="w-full md:w-24 h-6 md:h-8 bg-[#111111] text-white rounded mx-auto mb-2 flex items-center justify-center font-bold text-[10px] md:text-xs uppercase px-1">StoresCraft</div>
                <span class="hidden md:inline text-xs font-bold text-[#111111] uppercase tracking-wider">Our Platform</span>
              </div>
              <div class="text-center">
                <span class="text-[10px] md:text-xs font-bold text-[#111111]/60 uppercase tracking-wider">Alternatives</span>
              </div>
            </div>
            
            <!-- Total costs row -->
            <div class="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-6 border-b border-gray-200 items-center bg-white">
              <div class="font-bold text-[#111111] text-sm md:text-base leading-tight">Total costs</div>
              <div class="text-center">
                <div class="flex flex-col md:block">
                  <span class="text-[#111111] text-xs md:text-sm font-medium">From </span>
                  <span class="text-lg md:text-2xl font-bold text-[#111111]">$22</span>
                  <span class="text-[#111111] font-medium text-xs md:text-base">/mo</span>
                </div>
                <div class="text-[10px] md:text-sm font-bold text-[#68E079] mt-1 line-clamp-2">0% fees</div>
              </div>
              <div class="text-center opacity-60">
                <div class="flex flex-col md:block">
                  <span class="text-gray-500 text-xs md:text-sm">From </span>
                  <span class="text-lg md:text-2xl font-bold text-gray-400 line-through">$290</span>
                  <span class="text-gray-500 text-xs md:text-base">/mo</span>
                </div>
                <div class="text-[10px] md:text-sm text-gray-500 mt-1 line-clamp-2">+10% fees</div>
              </div>
            </div>
            
            <!-- Feature rows -->
            <div *ngFor="let row of pricingRows" class="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-6 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors">
              <div class="font-medium text-[#111111] text-xs md:text-base pr-1">{{ row.feature }}</div>
              <div class="text-center flex justify-center">
                <div class="w-5 h-5 md:w-6 md:h-6 text-[#68E079]">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div class="text-center opacity-60">
                <div class="text-[10px] md:text-sm text-[#111111] leading-tight mb-1">{{ row.alternative }}</div>
                <div class="font-semibold text-[#111111] text-xs md:text-base">{{ row.altPrice }}</div>
              </div>
            </div>
            
            <!-- CTA -->
            <div class="p-8 text-center bg-[#F9F4EB]">
              <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                Start free trial
              </a>
              <p class="text-sm text-[#111111]/60 mt-4 font-medium">14-day free trial, no card required.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111]">
              Cherished by makers
            </h2>
          </div>
          
          <!-- Testimonials grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div *ngFor="let testimonial of testimonials" 
                 class="bg-white rounded-2xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-transform duration-300"
                 [ngClass]="{'lg:col-span-1': !testimonial.featured, 'bg-[#111111] text-white': testimonial.featured}">
              <div class="flex items-center gap-3 mb-4" *ngIf="!testimonial.featured">
                <div class="w-12 h-12 rounded-full border border-black bg-gray-200 overflow-hidden">
                    <div class="w-full h-full" [style.background-color]="testimonial.color"></div>
                </div>
                <div class="font-bold text-[#111111]">{{ testimonial.name }}</div>
              </div>
              <p class="" [ngClass]="{'text-[#111111]/80': !testimonial.featured, 'text-gray-300 text-center text-xl font-dm-sans font-bold': testimonial.featured}">
                {{ testimonial.quote }}
              </p>
              <div class="mt-4 text-center" *ngIf="testimonial.featured">
                <div class="font-bold text-white">{{ testimonial.name }}</div>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <a routerLink="/explore" class="inline-flex items-center px-6 py-3 border-2 border-black text-[#111111] rounded-lg font-bold hover:bg-[#111111] hover:text-white transition-colors duration-200">
              Read success stories
            </a>
          </div>
        </div>
      </section>

      <!-- Media Section -->
      <section class="py-16 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="bg-[#F9F4EB] border-2 border-black rounded-[2rem] p-8 md:p-12 text-center shadow-[4px_4px_0px_0px_#000]">
            <h3 class="font-dm-sans text-xl md:text-2xl font-bold text-[#111111] mb-8">
              Shoutouts by media
            </h3>
            <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80">
              <span class="text-xl md:text-2xl font-extrabold text-[#111111]">Forbes</span>
              <span class="text-xl md:text-2xl font-extrabold text-[#111111]">Metro</span>
              <span class="text-xl md:text-2xl font-extrabold text-[#111111]">Inc.</span>
              <span class="text-xl md:text-2xl font-extrabold text-[#111111]">WIRED</span>
              <span class="text-xl md:text-2xl font-extrabold text-[#111111]">Observer</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-3 gap-8">
            <div>
              <h2 class="font-dm-sans text-3xl md:text-4xl font-bold text-[#111111] sticky top-24">
                FAQs
              </h2>
            </div>
            <div class="md:col-span-2 space-y-4">
              <div *ngFor="let faq of faqs" class="border-b-2 border-dashed border-black pb-4">
                <button 
                  (click)="toggleFaq(faq.id)"
                  class="w-full text-left py-4 flex items-center justify-between font-bold text-[#111111] hover:text-[#FFC60B] transition-colors duration-200 text-lg">
                  {{ faq.question }}
                  <div class="w-6 h-6 transform transition-transform duration-200" [class.rotate-180]="faq.isOpen">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                <div class="overflow-hidden transition-all duration-300" [class.max-h-0]="!faq.isOpen" [class.max-h-96]="faq.isOpen">
                  <p class="text-[#111111]/80 pb-4 font-medium">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="py-16 md:py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div class="max-w-4xl mx-auto">
          <div class="bg-[#68E079] border-2 border-black rounded-[2rem] p-8 md:p-12 lg:p-16 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_#000]">
            <h2 class="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-4 relative z-10">
              Ready to launch a shop?<br>Why wait!
            </h2>
            <a routerLink="/become-creator" (click)="handleCreatorCtaClick($event)" class="relative z-10 inline-flex items-center px-8 py-4 bg-[#111111] text-white border-2 border-black rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors duration-200 mt-6 shadow-[4px_4px_0px_0px_#fff]">
              Start free
            </a>
            
            <!-- Decorative elements -->
            <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-white/30 rounded-full border-2 border-black"></div>
            <div class="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full border-2 border-black"></div>
            <div class="absolute bottom-8 right-8 w-24 h-24 transform rotate-12 text-[#111111] opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
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
  private sanitizer = inject(DomSanitizer);
  authService = inject(AuthService);

  async handleCreatorCtaClick(event: Event) {
    if (this.authService.isSignedIn()) return;
    event.preventDefault();
    await this.authService.openCreatorSignup();
  }

  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  creators = [
    { color: '#FA4B28' },
    { color: '#2B57D6' },
    { color: '#68E079' },
    { color: '#FFC60B' },
    { color: '#FA4B28' },
    { color: '#2B57D6' },
  ];

  digitalProducts = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>', bg: 'bg-blue-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>', bg: 'bg-purple-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>', bg: 'bg-red-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>', bg: 'bg-pink-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>', bg: 'bg-yellow-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>', bg: 'bg-green-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>', bg: 'bg-indigo-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>', bg: 'bg-orange-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>', bg: 'bg-teal-50' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-1.432c.617-4.333 3.236-7.514 6.89-8.412" /></svg>', bg: 'bg-cyan-50' },
  ];

  merchItems = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10H5a2 2 0 0 1-2-2V6z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 4c0 1.5 1.5 3 3 3s3-1.5 3-3" /></svg>', name: 'T-shirt' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4 14C4 9.582 7.582 6 12 6s8 3.582 8 8" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4a2 2 0 0 0-2-2" /><path stroke-linecap="round" stroke-linejoin="round" d="M22 14c0 1.105-1.343 2-3 2H5c-1.657 0-3-.895-3-2" /></svg>', name: 'Cap' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19 19H5a2 2 0 0 1-2-2v-4a6 6 0 0 1 6-6h4.18a3 3 0 0 1 2.82 2.09l.8 2.4" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 19a2 2 0 0 0 2-2v-2.36a2 2 0 0 0-.58-1.4l-3.42-3.42" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 14h4" /><path stroke-linecap="round" stroke-linejoin="round" d="M5 13v6" /></svg>', name: 'Shoes' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 10V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4" /><path stroke-linecap="round" stroke-linejoin="round" d="M5 10h14l-1.5 11h-11L5 10z" /><circle cx="12" cy="15" r="1" /></svg>', name: 'Bag' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8h1a4 4 0 1 1 0 8h-1" /><path stroke-linecap="round" stroke-linejoin="round" d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 3v2" /><path stroke-linecap="round" stroke-linejoin="round" d="M10 3v2" /><path stroke-linecap="round" stroke-linejoin="round" d="M14 3v2" /></svg>', name: 'Mug' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8 8h8v12H8z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v4" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 4a3 3 0 0 1 6 0" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 20l-1 3" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 20v3" /><path stroke-linecap="round" stroke-linejoin="round" d="M16 20l1 3" /></svg>', name: 'Scarf' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2l-4 4-2-2V6a2 2 0 0 1 2-2z" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 8h8" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h5" /></svg>', name: 'Socks' },
  ];

  marketingFeatures = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>', title: 'Affiliate marketing', description: 'Promote your products through affiliates to reach a larger audience at scale.' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>', title: 'Email marketing', description: 'Create email campaigns to drive more sales.' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>', title: 'SEO', description: 'Boost your search visibility so more customers can find your store.' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>', title: 'Product upselling', description: 'Never let a customer leave without considering your upsell offer.' },
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
      color: '#FA4B28',
      featured: false
    },
    { 
      name: 'Brayden McPhee', 
      quote: 'The UI is simple enough that my mum could use it.',
      color: '#2B57D6',
      featured: true
    },
    { 
      name: 'David Killingsworth', 
      quote: 'I started selling digital products on the platform and couldn\'t be happier. It has really changed my life!',
      color: '#68E079',
      featured: false
    },
    { 
      name: 'Austin Newman', 
      quote: 'This platform allowed me to transition to doing content creation and selling my assets full-time.',
      color: '#FFC60B',
      featured: false
    },
    { 
      name: 'Christian Maté Grab', 
      quote: 'These tools turned my hobby into a six-figure business.',
      color: '#FA4B28',
      featured: true
    },
    { 
      name: 'EfikZara', 
      quote: 'The user experience is so effortless that it\'s easy to get a high conversion rate.',
      color: '#2B57D6',
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
