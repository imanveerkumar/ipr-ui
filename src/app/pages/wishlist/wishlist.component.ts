import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div class="text-left">
              <!-- Badge -->
              <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#FA4B28] border-2 border-black mb-4 transform -rotate-1">
                <span class="text-xs font-bold text-white uppercase tracking-wider">Coming Soon</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-3xl md:text-5xl lg:text-6xl font-bold text-[#111111] mb-1 md:mb-2 leading-tight">
                Wishlist
              </h1>
              
              <!-- Subtext -->
              <p class="text-base md:text-xl text-[#111111]/70 max-w-2xl mb-6 font-medium leading-relaxed">
                We're crafting a beautiful space for you to save your favorites. <br class="hidden md:block">
                This feature is currently under development.
              </p>

              <!-- Action Button -->
              <a routerLink="/library" class="inline-flex items-center px-8 py-4 bg-[#FFC60B] text-[#111111] border-2 border-black rounded-lg font-bold text-lg hover:bg-[#ffdb4d] transition-all duration-200 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Go to Library
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Placeholder Graphic/Empty State -->
        <div class="py-12 md:py-20 px-4 flex justify-center">
            <div class="w-full max-w-sm opacity-50">
                <div class="aspect-[4/3] bg-[#F9F4EB] rounded-2xl flex items-center justify-center p-8 dashed-border">
                    <svg class="w-24 h-24 text-[#111111]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .dashed-border {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23000000FF' stroke-width='2' stroke-dasharray='12%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    }
  `]
})
export class WishlistComponent {}
