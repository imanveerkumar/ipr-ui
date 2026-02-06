import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';
import { ApiService } from '../../core/services/api.service';
import { ToasterService } from '../../core/services/toaster.service';
import { AuthService } from '../../core/services/auth.service';
import { Store, Product } from '../../core/models/index';

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-[#F9F4EB] border-b-2 border-black">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6 md:pt-4 md:pb-8 lg:pt-6 lg:pb-12">
            <div class="text-left">

              
              <!-- Main Heading -->
              <h1 class="font-display tracking-tighter mt-0 text-2xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-1 md:mb-2 leading-tight">
                Welcome, <span class="text-[rgb(124_58_237_/_var(--tw-bg-opacity,_1))]">{{ auth.user()?.firstName || auth.user()?.displayName || 'Creator' }}</span>
              </h1>
              


              <!-- Stats and Quick Actions Row -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 md:gap-8 mb-8">
                <!-- Hero Stats -->
                <div class="flex-1 flex justify-center lg:justify-start">
                  <div class="grid grid-cols-3 gap-2 md:flex md:justify-center lg:justify-start md:gap-8 max-w-2xl lg:max-w-none">
                    <!-- Stores stat -->
                    <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 md:bg-transparent border border-black/10 md:border-0">
                      <div class="w-6 h-6 md:w-8 md:h-8 bg-[#2B57D6] border border-black flex items-center justify-center">
                        <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div class="text-center md:text-left">
                        @if (!loading()) {
                          <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ stores().length }}</div>
                        } @else {
                          <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                        }
                        <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Stores</div>
                      </div>
                    </div>
                    <!-- Products stat -->
                    <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 md:bg-transparent border border-black/10 md:border-0">
                      <div class="w-6 h-6 md:w-8 md:h-8 bg-[#7C3AED] border border-black flex items-center justify-center">
                        <svg class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                      <div class="text-center md:text-left">
                        @if (!loading()) {
                          <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">{{ totalProducts() }}</div>
                        } @else {
                          <div class="h-4 md:h-6 w-8 md:w-12 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                        }
                        <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Products</div>
                      </div>
                    </div>
                    <!-- Revenue stat -->
                    <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 bg-white/50 md:bg-transparent border border-black/10 md:border-0">
                      <div class="w-6 h-6 md:w-8 md:h-8 bg-[#68E079] border border-black flex items-center justify-center">
                        <svg class="w-3 h-3 md:w-4 md:h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div class="text-center md:text-left">
                        @if (!loading()) {
                          <div class="text-sm md:text-xl font-bold text-[#111111] leading-none">₹{{ formatRevenue(totalRevenue()) }}</div>
                        } @else {
                          <div class="h-4 md:h-6 w-10 md:w-16 bg-[#111111]/10 rounded animate-pulse mb-0.5"></div>
                        }
                        <div class="text-[10px] md:text-xs text-[#111111]/60 font-medium">Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick Actions -->
                @if (loading()) {
                  <div class="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-3 w-full">
                    <div class="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-0 sm:mr-3">
                      <div class="h-12 w-full sm:w-64 bg-[#FFC60B] border-2 border-black animate-pulse"></div>
                    </div>

                    <div class="h-12 w-full sm:w-auto bg-[#111111]/10 border-2 border-black animate-pulse"></div>
                    <div class="h-12 w-full sm:w-auto bg-[#111111]/10 border-2 border-black animate-pulse"></div>
                  </div>
                } @else {
                  <div class="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-3">
                    @if (stores().length === 0) {
                      <div class="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 mb-3 sm:mb-0 sm:mr-3">
                        <div class="flex items-center gap-3 bg-[#FFC60B] border-2 border-black px-3 py-2 shadow-[2px_2px_0px_0px_#000]">
                          <div class="w-9 h-9 bg-white border-2 border-black flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                          </div>
                          <div class="text-sm font-bold text-[#111111]">Tip: Start by creating your store first.</div>
                        </div>
                      </div>
                    }

                    <a routerLink="/dashboard/stores/new" class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#111111] text-white border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      @if (stores().length === 0) {
                        Create your first store
                      } @else {
                        Create Store
                      }
                    </a>

                    <button type="button" (click)="handleCreateProduct()" class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-[#111111] border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      Create Product
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <!-- Stats Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
            <!-- Stores Card -->
            <a routerLink="/dashboard/stores" class="group bg-white border-2 border-black p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#2B57D6] border-2 border-black flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-[#111111]/60 font-medium mb-1">Total Stores</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-[#F9F4EB] animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-[#111111]">{{ stores().length }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#68E079] border border-black text-[10px] md:text-xs font-bold text-[#111111]">
                <span class="w-1.5 h-1.5 bg-[#111111] rounded-full"></span>
                Active
              </div>
            </a>

            <!-- Products Card -->
            <a routerLink="/dashboard/products" class="group bg-white border-2 border-black p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#7C3AED] border-2 border-black flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-[#111111]/60 font-medium mb-1">Total Products</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-[#F9F4EB] animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-[#111111]">{{ totalProducts() }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#F9F4EB] border border-black text-[10px] md:text-xs font-bold text-[#111111]/70">
                Listed
              </div>
            </a>

            <!-- Sales Card -->
            <a routerLink="/dashboard/sales" class="group bg-white border-2 border-black p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#FFC60B] border-2 border-black flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-[#111111]/60 font-medium mb-1">Total Sales</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-[#F9F4EB] animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-[#111111]">{{ totalSales() }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#68E079] border border-black text-[10px] md:text-xs font-bold text-[#111111]">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                Completed
              </div>
            </a>

            <!-- Revenue Card -->
            <div class="bg-white border-2 border-black p-4 md:p-5">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#68E079] border-2 border-black flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <p class="text-xs md:text-sm text-[#111111]/60 font-medium mb-1">Total Revenue</p>
              @if (loading()) {
                <div class="h-8 w-24 bg-[#F9F4EB] animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-[#111111]">₹{{ formatRevenue(totalRevenue()) }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-[#68E079] border border-black text-[10px] md:text-xs font-bold text-[#111111]">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                Earned
              </div>
            </div>
          </div>

          <!-- Quick Actions Section -->
          <div class="mb-8 md:mb-12">
            <h2 class="font-dm-sans text-lg md:text-xl font-bold text-[#111111] mb-1">Quick Actions</h2>
            <p class="text-sm text-[#111111]/60 font-medium mb-4 md:mb-6">Get started with these common tasks</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <!-- Create Store Action -->
              <a routerLink="/dashboard/stores/new" class="group flex items-center gap-4 p-4 md:p-5 bg-[#F9F4EB] border-2 border-black hover:shadow-[4px_4px_0px_0px_#68E079] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-[#68E079] border-2 border-black flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-[#111111] text-sm md:text-base mb-0.5">
                    @if (stores().length === 0) {
                      Create your first store
                    } @else {
                      Create Store
                    }
                  </h3>
                  <p class="text-xs md:text-sm text-[#111111]/60 truncate">Launch a new storefront</p>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <!-- Add Product Action -->
              <button type="button" (click)="handleCreateProduct()" class="w-full text-left group flex items-center gap-4 p-4 md:p-5 bg-[#F9F4EB] border-2 border-black hover:shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-[#7C3AED] border-2 border-black flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-[#111111] text-sm md:text-base mb-0.5">Add Product</h3>
                  <p class="text-xs md:text-sm text-[#111111]/60 truncate">Upload digital assets</p>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- View Analytics Action -->
              <a routerLink="/dashboard/sales" class="group flex items-center gap-4 p-4 md:p-5 bg-[#F9F4EB] border-2 border-black hover:shadow-[4px_4px_0px_0px_#FFC60B] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-[#FFC60B] border-2 border-black flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-[#111111] text-sm md:text-base mb-0.5">View Analytics</h3>
                  <p class="text-xs md:text-sm text-[#111111]/60 truncate">Track sales & performance</p>
                </div>
                <svg class="w-5 h-5 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Content Grid: Stores and Products -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
            <!-- Stores Section -->
            <div class="bg-white border-2 border-black">
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 border-black bg-[#F9F4EB]">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-[#2B57D6] border-2 border-black flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-[#111111] text-base md:text-lg">Your Stores</h3>
                </div>
                <a routerLink="/dashboard/stores" class="flex items-center gap-1 text-sm font-bold text-[#111111]/70 hover:text-[#111111] transition-colors">
                  View All
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="p-3 md:p-4">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="flex items-center gap-3 p-3 mb-2 bg-[#F9F4EB]/50 animate-pulse">
                      <div class="w-10 h-10 bg-[#F9F4EB]"></div>
                      <div class="flex-1">
                        <div class="h-4 w-24 bg-[#F9F4EB] mb-2"></div>
                        <div class="h-3 w-16 bg-[#F9F4EB]"></div>
                      </div>
                    </div>
                  }
                } @else if (stores().length === 0) {
                  <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-[#F9F4EB] border-2 border-black flex items-center justify-center transform rotate-3">
                      <svg class="w-8 h-8 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-[#111111] mb-1">No stores yet</h4>
                    <p class="text-sm text-[#111111]/60 mb-4">Create your first store to start selling!</p>
                    <a routerLink="/dashboard/stores/new" class="inline-flex items-center gap-2 px-4 py-2 bg-[#FFC60B] border-2 border-black font-bold text-sm text-[#111111] hover:bg-[#ffdb4d] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Create Store
                    </a>
                  </div>
                } @else {
                  <div class="space-y-2">
                    @for (store of stores().slice(0, 5); track store.id) {
                      <a [routerLink]="['/dashboard/stores', store.id]" class="group flex items-center gap-3 p-3 border border-black/10 hover:border-black hover:bg-[#F9F4EB]/50 transition-all">
                        <div class="w-10 h-10 bg-[#2B57D6] border border-black flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {{ getStoreInitial(store.name) }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-bold text-[#111111] text-sm truncate">{{ store.name }}</h4>
                          <p class="text-xs text-[#111111]/60 truncate">{{ store.slug }}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="px-2 py-1 bg-[#F9F4EB] border border-black/10 text-[10px] md:text-xs font-medium text-[#111111]/70">
                            {{ store._count?.products || 0 }} products
                          </span>
                          <svg class="w-4 h-4 text-[#111111]/30 group-hover:text-[#111111] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Products Section -->
            <div class="bg-white border-2 border-black">
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 border-black bg-[#F9F4EB]">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-[#7C3AED] border-2 border-black flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-[#111111] text-base md:text-lg">Your Products</h3>
                </div>
                <a routerLink="/dashboard/products" class="flex items-center gap-1 text-sm font-bold text-[#111111]/70 hover:text-[#111111] transition-colors">
                  View All
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="p-3 md:p-4">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="flex items-center gap-3 p-3 mb-2 bg-[#F9F4EB]/50 animate-pulse">
                      <div class="w-10 h-10 bg-[#F9F4EB]"></div>
                      <div class="flex-1">
                        <div class="h-4 w-24 bg-[#F9F4EB] mb-2"></div>
                        <div class="h-3 w-16 bg-[#F9F4EB]"></div>
                      </div>
                    </div>
                  }
                } @else if (products().length === 0) {
                  <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-[#F9F4EB] border-2 border-black flex items-center justify-center transform -rotate-3">
                      <svg class="w-8 h-8 text-[#111111]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-[#111111] mb-1">No products yet</h4>
                    <p class="text-sm text-[#111111]/60 mb-4">Add your first product to start earning!</p>
                    <a routerLink="/dashboard/products/new" class="inline-flex items-center gap-2 px-4 py-2 bg-[#FFC60B] border-2 border-black font-bold text-sm text-[#111111] hover:bg-[#ffdb4d] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Product
                    </a>
                  </div>
                } @else {
                  <div class="space-y-2">
                    @for (product of products().slice(0, 5); track product.id) {
                      <a [routerLink]="['/dashboard/products', product.id]" class="group flex items-center gap-3 p-3 border border-black/10 hover:border-black hover:bg-[#F9F4EB]/50 transition-all">
                        <div class="w-10 h-10 bg-[#F9F4EB] border border-black overflow-hidden shrink-0">
                          @if (product.coverImageUrl) {
                            <img [src]="product.coverImageUrl" [alt]="product.title" class="w-full h-full object-cover">
                          } @else {
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-[#111111]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-bold text-[#111111] text-sm truncate">{{ product.title }}</h4>
                          <p class="text-xs text-[#111111]/60 truncate">{{ product.store?.name }}</p>
                        </div>
                        <div class="flex flex-col items-end gap-1 shrink-0">
                          <span class="font-bold text-sm text-[#111111]">₹{{ product.price }}</span>
                          <span class="px-2 py-0.5 text-[10px] font-bold uppercase"
                            [class.bg-[#68E079]]="product.status === 'PUBLISHED'"
                            [class.text-[#111111]]="product.status === 'PUBLISHED'"
                            [class.border]="product.status === 'PUBLISHED'"
                            [class.border-black]="product.status === 'PUBLISHED'"
                            [class.bg-[#F9F4EB]]="product.status !== 'PUBLISHED'"
                            [class.text-[#111111]/60]="product.status !== 'PUBLISHED'">
                            {{ product.status === 'PUBLISHED' ? 'Live' : 'Draft' }}
                          </span>
                        </div>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Tips Section -->
          <div class="bg-[#FFC60B] border-2 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_#000]">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-[#111111] mb-0.5">Pro Tip</h3>
                  <p class="text-sm text-[#111111]/80">Add high-quality cover images to your products to increase conversions by up to 40%!</p>
                </div>
              </div>
              <a routerLink="/dashboard/products" class="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold text-sm text-[#111111] hover:bg-[#F9F4EB] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap">
                Update Products
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  stores = signal<Store[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);
  totalProducts = signal(0);
  totalSales = signal(0);
  totalRevenue = signal(0);

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private api: ApiService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const [stores, products, statsResponse] = await Promise.all([
        this.storeService.getMyStores(),
        this.productService.getMyProducts(),
        this.api.get<SalesStats>('/orders/sales/stats')
      ]);
      
      this.stores.set(stores);
      this.products.set(products);
      
      let totalProducts = 0;
      stores.forEach(s => {
        totalProducts += s._count?.products || 0;
      });
      this.totalProducts.set(totalProducts);
      
      const stats = statsResponse.data;
      if (stats) {
        this.totalSales.set(stats.totalSales);
        this.totalRevenue.set(stats.totalRevenue);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  handleCreateProduct() {
    if (this.stores().length === 0) {
      this.toaster.warning('No store is created. Please create a store first to add products.');
    }
    this.router.navigate(['/dashboard/products/new']);
  }

  formatRevenue(value: number): string {
    if (value >= 100000) {
      return (value / 100000).toFixed(1) + 'L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  getStoreInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'S';
  }

  navigateTo(path: string): void {
    window.location.href = path;
  }
}
