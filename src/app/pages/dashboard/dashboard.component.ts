import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';
import { ApiService } from '../../core/services/api.service';
import { ToasterService } from '../../core/services/toaster.service';
import { AuthService } from '../../core/services/auth.service';
import { UiMessageService } from '../../core/services/ui-message.service';
import { Store, Product, UiMessage } from '../../core/models/index';

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
    <div class="min-h-screen bg-theme-surface font-sans antialiased">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="bg-theme-secondary border-b-2 border-theme-border">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 md:pt-6 md:pb-8 lg:pt-8 lg:pb-12">
            <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-8">

              <!-- Left: Heading + subtitle -->
              <div>
                <h1 class="font-display tracking-tighter text-2xl md:text-4xl lg:text-5xl font-bold text-theme-fg mb-2 leading-tight">
                  Welcome, <span class="text-[rgb(124_58_237_/_var(--tw-bg-opacity,_1))]">{{ auth.user()?.firstName || auth.user()?.displayName || 'Creator' }}</span>
                </h1>
                <p class="text-sm md:text-base text-theme-muted">
                  Manage your stores, products, and track your earnings.
                </p>
              </div>

              <!-- Right: Tip + Action buttons -->
              @if (loading()) {
                <div class="flex flex-col sm:flex-row gap-3 shrink-0">
                  <div class="h-11 w-full sm:w-40 bg-theme-fg/10 border-2 border-theme-border animate-pulse"></div>
                  <div class="h-11 w-full sm:w-40 bg-theme-fg/10 border-2 border-theme-border animate-pulse"></div>
                </div>
              } @else {
                <div class="flex flex-col gap-3 shrink-0">
                  @if (stores().length === 0) {
                    <div class="flex items-center gap-2 px-3 py-2 bg-theme-accent/20 border border-theme-border/50 text-sm font-medium text-theme-fg">
                      <svg class="w-4 h-4 shrink-0 text-theme-fg/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                      <span>Tip: Start by creating your store first</span>
                    </div>
                  }
                  <div class="flex flex-col sm:flex-row gap-3">
                    <a routerLink="/dashboard/stores/new" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-theme-accent text-[var(--on-accent)] border-2 border-theme-border font-bold text-sm shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:bg-[#ffdb4d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      @if (stores().length === 0) {
                        Create your first store
                      } @else {
                        Create Store
                      }
                    </a>
                    <button type="button" (click)="handleCreateProduct()" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-theme-surface text-theme-fg border-2 border-theme-border font-bold text-sm shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] transition-all">
                      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      Create Product
                    </button>
                  </div>
                </div>
              }

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
            <a routerLink="/dashboard/stores" class="group bg-theme-surface border-2 border-theme-border p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-theme-primary border-2 border-theme-border flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-theme-muted font-medium mb-1">Total Stores</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-theme-secondary animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-theme-fg">{{ stores().length }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-theme-success border border-theme-border text-[10px] md:text-xs font-bold text-[var(--on-success)]">
                <span class="w-1.5 h-1.5 bg-[var(--on-success)] rounded-full"></span>
                Active
              </div>
            </a>

            <!-- Products Card -->
            <a routerLink="/dashboard/products" class="group bg-theme-surface border-2 border-theme-border p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-theme-muted font-medium mb-1">Total Products</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-theme-secondary animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-theme-fg">{{ totalProducts() }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-theme-secondary border border-theme-border text-[10px] md:text-xs font-bold text-theme-muted">
                Listed
              </div>
            </a>

            <!-- Sales Card -->
            <a routerLink="/dashboard/sales" class="group bg-theme-surface border-2 border-theme-border p-4 md:p-5 hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-theme-accent border-2 border-theme-border flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--on-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <p class="text-xs md:text-sm text-theme-muted font-medium mb-1">Total Sales</p>
              @if (loading()) {
                <div class="h-8 w-16 bg-theme-secondary animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-theme-fg">{{ totalSales() }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-theme-success border border-theme-border text-[10px] md:text-xs font-bold text-[var(--on-success)]">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                Completed
              </div>
            </a>

            <!-- Revenue Card -->
            <div class="bg-theme-surface border-2 border-theme-border p-4 md:p-5">
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-theme-success border-2 border-theme-border flex items-center justify-center">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-[var(--on-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <p class="text-xs md:text-sm text-theme-muted font-medium mb-1">Total Revenue</p>
              @if (loading()) {
                <div class="h-8 w-24 bg-theme-secondary animate-pulse"></div>
              } @else {
                <p class="text-2xl md:text-3xl font-bold text-theme-fg">₹{{ formatRevenue(totalRevenue()) }}</p>
              }
              <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-theme-success border border-theme-border text-[10px] md:text-xs font-bold text-[var(--on-success)]">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                Earned
              </div>
            </div>
          </div>

          <!-- Quick Actions Section -->
          <div class="mb-8 md:mb-12">
            <h2 class="font-dm-sans text-lg md:text-xl font-bold text-theme-fg mb-1">Quick Actions</h2>
            <p class="text-sm text-theme-muted font-medium mb-4 md:mb-6">Get started with these common tasks</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <!-- Create Store Action -->
              <a routerLink="/dashboard/stores/new" class="group flex items-center gap-4 p-4 md:p-5 bg-theme-secondary border-2 border-theme-border hover:shadow-[4px_4px_0px_0px_#68E079] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-theme-success border-2 border-theme-border flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-theme-fg text-sm md:text-base mb-0.5">
                    @if (stores().length === 0) {
                      Create your first store
                    } @else {
                      Create Store
                    }
                  </h3>
                  <p class="text-xs md:text-sm text-theme-muted truncate">Launch a new storefront</p>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <!-- Add Product Action -->
              <button type="button" (click)="handleCreateProduct()" class="w-full text-left group flex items-center gap-4 p-4 md:p-5 bg-theme-secondary border-2 border-theme-border hover:shadow-[4px_4px_0px_0px_rgb(124_58_237_/_var(--tw-bg-opacity,_1))] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-theme-fg text-sm md:text-base mb-0.5">Add Product</h3>
                  <p class="text-xs md:text-sm text-theme-muted truncate">Upload digital assets</p>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <!-- View Analytics Action -->
              <a routerLink="/dashboard/sales" class="group flex items-center gap-4 p-4 md:p-5 bg-theme-secondary border-2 border-theme-border hover:shadow-[4px_4px_0px_0px_#FFC60B] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-theme-accent border-2 border-theme-border flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-[var(--on-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-theme-fg text-sm md:text-base mb-0.5">View Analytics</h3>
                  <p class="text-xs md:text-sm text-theme-muted truncate">Track sales & performance</p>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <!-- Quick Sell Action -->
              <a routerLink="/dashboard/quick-sell/new" class="group flex items-center gap-4 p-4 md:p-5 bg-theme-secondary border-2 border-theme-border hover:shadow-[4px_4px_0px_0px_#7C3AED] hover:-translate-y-1 transition-all duration-200">
                <div class="w-12 h-12 md:w-14 md:h-14 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 200 200">
                    <ellipse cx="100" cy="90" rx="60" ry="60"/>
                    <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                    <circle cx="80" cy="85" r="5" opacity="0.4"/>
                    <circle cx="120" cy="85" r="5" opacity="0.4"/>
                    <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-theme-fg text-sm md:text-base mb-0.5">Quick Sell</h3>
                  <p class="text-xs md:text-sm text-theme-muted truncate">Sell in seconds — file + price</p>
                </div>
                <svg class="w-5 h-5 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Content Grid: Stores and Products -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4">
            <!-- Stores Section -->
            <div class="bg-theme-surface border-2 border-theme-border">
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 border-theme-border bg-theme-secondary">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-theme-primary border-2 border-theme-border flex items-center justify-center">
                    <svg class="w-4 h-4 text-[var(--on-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-theme-fg text-base md:text-lg">Your Stores</h3>
                </div>
                <a routerLink="/dashboard/stores" class="flex items-center gap-1 text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors">
                  View All
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="p-3 md:p-4">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="flex items-center gap-3 p-3 mb-2 bg-theme-secondary/50 animate-pulse">
                      <div class="w-10 h-10 bg-theme-secondary"></div>
                      <div class="flex-1">
                        <div class="h-4 w-24 bg-theme-secondary mb-2"></div>
                        <div class="h-3 w-16 bg-theme-secondary"></div>
                      </div>
                    </div>
                  }
                } @else if (stores().length === 0) {
                  <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-theme-secondary border-2 border-theme-border flex items-center justify-center transform rotate-3">
                      <svg class="w-8 h-8 text-theme-fg/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-theme-fg mb-1">No stores yet</h4>
                    <p class="text-sm text-theme-muted mb-4">Create your first store to start selling!</p>
                    <a routerLink="/dashboard/stores/new" class="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent border-2 border-theme-border font-bold text-sm text-[var(--on-accent)] hover:bg-[#ffdb4d] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Create Store
                    </a>
                  </div>
                } @else {
                  <div class="space-y-2">
                    @for (store of stores().slice(0, 5); track store.id) {
                      <a [routerLink]="['/dashboard/stores', store.id]" class="group flex items-center gap-3 p-3 border border-theme-border/30 hover:border-theme-border hover:bg-theme-secondary/50 transition-all">
                        <div class="w-10 h-10 bg-theme-primary border border-theme-border flex items-center justify-center text-[var(--on-primary)] font-bold text-lg shrink-0">
                          {{ getStoreInitial(store.name) }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-bold text-theme-fg text-sm truncate">{{ store.name }}</h4>
                          <p class="text-xs text-theme-muted truncate">{{ store.slug }}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                          <span class="px-2 py-1 bg-theme-secondary border border-theme-border/30 text-[10px] md:text-xs font-medium text-theme-muted">
                            {{ store._count?.products || 0 }} products
                          </span>
                          <svg class="w-4 h-4 text-theme-fg/30 group-hover:text-theme-fg group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div class="bg-theme-surface border-2 border-theme-border">
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 border-theme-border bg-theme-secondary">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-theme-fg text-base md:text-lg">Your Products</h3>
                </div>
                <a routerLink="/dashboard/products" class="flex items-center gap-1 text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors">
                  View All
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="p-3 md:p-4">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="flex items-center gap-3 p-3 mb-2 bg-theme-secondary/50 animate-pulse">
                      <div class="w-10 h-10 bg-theme-secondary"></div>
                      <div class="flex-1">
                        <div class="h-4 w-24 bg-theme-secondary mb-2"></div>
                        <div class="h-3 w-16 bg-theme-secondary"></div>
                      </div>
                    </div>
                  }
                } @else if (products().length === 0) {
                  <div class="text-center py-8 md:py-12">
                    <div class="w-16 h-16 mx-auto mb-4 bg-theme-secondary border-2 border-theme-border flex items-center justify-center transform -rotate-3">
                      <svg class="w-8 h-8 text-theme-fg/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    <h4 class="font-bold text-theme-fg mb-1">No products yet</h4>
                    <p class="text-sm text-theme-muted mb-4">Add your first product to start earning!</p>
                    <a routerLink="/dashboard/products/new" class="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent border-2 border-theme-border font-bold text-sm text-[var(--on-accent)] hover:bg-[#ffdb4d] transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Add Product
                    </a>
                  </div>
                } @else {
                  <div class="space-y-2">
                    @for (product of products().slice(0, 5); track product.id) {
                      <a [routerLink]="['/dashboard/products', product.id]" class="group flex items-center gap-3 p-3 border border-theme-border/30 hover:border-theme-border hover:bg-theme-secondary/50 transition-all">
                        <div class="w-10 h-10 bg-theme-secondary border border-theme-border overflow-hidden shrink-0">
                          @if (product.coverImageUrl) {
                            <img [src]="product.coverImageUrl" [alt]="product.title" class="w-full h-full object-cover">
                          } @else {
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-5 h-5 text-theme-fg/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-bold text-theme-fg text-sm truncate">{{ product.title }}</h4>
                          <p class="text-xs text-theme-muted truncate">{{ product.store?.name }}</p>
                        </div>
                        <div class="flex flex-col items-end gap-1 shrink-0">
                          <span class="font-bold text-sm text-theme-fg">₹{{ product.price / 100 }}</span>
                          <span class="px-2 py-0.5 text-[10px] font-bold uppercase"
                            [class.bg-theme-success]="product.status === 'PUBLISHED'"
                            [class.text-theme-fg]="product.status === 'PUBLISHED'"
                            [class.border]="product.status === 'PUBLISHED'"
                            [class.border-theme-border]="product.status === 'PUBLISHED'"
                            [class.bg-theme-secondary]="product.status !== 'PUBLISHED'"
                            [class.text-theme-muted]="product.status !== 'PUBLISHED'">
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

          <!-- Quick Sell Products Section -->
          @if (!loading() && quickProducts().length > 0) {
            <div class="bg-theme-surface border-2 border-theme-border mb-8">
              <div class="flex items-center justify-between p-4 md:p-5 border-b-2 border-theme-border bg-theme-secondary">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-[#7C3AED] border-2 border-theme-border flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 200 200">
                      <ellipse cx="100" cy="90" rx="60" ry="60"/>
                      <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                      <circle cx="80" cy="85" r="5" opacity="0.4"/>
                      <circle cx="120" cy="85" r="5" opacity="0.4"/>
                      <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
                    </svg>
                  </div>
                  <h3 class="font-bold text-theme-fg text-base md:text-lg">Quick Sell Products</h3>
                </div>
                <a routerLink="/dashboard/quick-sell" class="flex items-center gap-1 text-sm font-bold text-theme-muted hover:text-theme-fg transition-colors">
                  View All
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              <div class="p-3 md:p-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  @for (qp of quickProducts().slice(0, 6); track qp.id) {
                    <div class="flex items-center gap-3 p-3 border border-theme-border/30 hover:border-theme-border hover:bg-theme-secondary/50 transition-all">
                      <div class="w-10 h-10 bg-[#7C3AED]/10 border border-theme-border flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-[#7C3AED]" fill="currentColor" viewBox="0 0 200 200">
                          <ellipse cx="100" cy="90" rx="60" ry="60"/>
                          <rect x="130" y="130" width="40" height="15" rx="10" transform="rotate(45 150 137.5)"/>
                          <circle cx="80" cy="85" r="5" opacity="0.4"/>
                          <circle cx="120" cy="85" r="5" opacity="0.4"/>
                          <path d="M 90 105 Q 100 115 110 105" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-theme-fg text-sm truncate">{{ qp.title }}</h4>
                        <p class="text-xs text-theme-muted">₹{{ (qp.price / 100).toFixed(qp.price % 100 === 0 ? 0 : 2) }}</p>
                      </div>
                      <button type="button" (click)="copyQuickUrl(qp.productUrl, qp.id)" class="px-2 py-1 bg-theme-surface border border-theme-border text-[10px] font-bold text-theme-fg hover:bg-theme-secondary transition-colors shrink-0">
                        {{ copiedQuickId() === qp.id ? '✓ Copied' : 'Copy link' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Dynamic UI Messages Section -->
          @if (uiMessages.loading()) {
            <div class="border-2 border-theme-border p-4 md:p-5 bg-theme-secondary animate-pulse">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-theme-fg/10 border-2 border-theme-border shrink-0"></div>
                <div class="flex-1">
                  <div class="h-4 w-32 bg-theme-fg/10 mb-2"></div>
                  <div class="h-3 w-64 bg-theme-fg/10"></div>
                </div>
              </div>
            </div>
          } @else {
            @for (msg of uiMessages.inlineTips(); track msg.id) {
              <div [class]="getMessageBgClass(msg.type) + ' border-2 border-theme-border p-4 md:p-5 shadow-[4px_4px_0px_0px_#000] mb-4'">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="flex items-start gap-3 flex-1 min-w-0">
                    <div [class]="getMessageIconBgClass(msg.type) + ' w-10 h-10 border-2 border-theme-border flex items-center justify-center shrink-0'">
                      <svg class="w-5 h-5" [class]="getMessageIconColorClass(msg.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        @switch (msg.type) {
                          @case ('TIP') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                          }
                          @case ('SALE') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                          }
                          @case ('ANNOUNCEMENT') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                          }
                          @default {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          }
                        }
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 [class]="'font-bold mb-0.5 ' + getMessageTextClass(msg.type)">{{ msg.title }}</h3>
                      @if (msg.body) {
                        <p [class]="'text-sm ' + getMessageBodyClass(msg.type)">{{ msg.body }}</p>
                      }
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    @if (msg.ctaText && msg.ctaUrl) {
                      @if (isExternalUrl(msg.ctaUrl!)) {
                        <a [href]="msg.ctaUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-theme-surface border-2 border-theme-border font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap">
                          {{ msg.ctaText }}
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </a>
                      } @else {
                        <a [routerLink]="msg.ctaUrl" class="inline-flex items-center gap-2 px-4 py-2 bg-theme-surface border-2 border-theme-border font-bold text-sm text-theme-fg hover:bg-theme-secondary transition-colors shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-nowrap">
                          {{ msg.ctaText }}
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                          </svg>
                        </a>
                      }
                    }
                    @if (msg.dismissible) {
                      <button type="button" (click)="uiMessages.dismiss(msg.id)" class="w-8 h-8 flex items-center justify-center border-2 border-theme-border bg-theme-surface hover:bg-theme-secondary transition-colors" aria-label="Dismiss">
                        <svg class="w-4 h-4 text-theme-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          }
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
  uiMessages = inject(UiMessageService);
  stores = signal<Store[]>([]);
  products = signal<Product[]>([]);
  quickProducts = signal<(Product & { productUrl: string })[]>([]);
  loading = signal(true);
  totalProducts = signal(0);
  totalSales = signal(0);
  totalRevenue = signal(0);
  copiedQuickId = signal<string | null>(null);

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private api: ApiService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.uiMessages.loadMessages('dashboard');
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

      // Load quick sell products (non-blocking)
      this.productService.getMyQuickProducts({ page: 1, limit: 6 }).then(result => {
        this.quickProducts.set(result.data || []);
      }).catch(() => {});
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

  async copyQuickUrl(url: string, productId: string) {
    try {
      await navigator.clipboard.writeText(url);
      this.copiedQuickId.set(productId);
      setTimeout(() => this.copiedQuickId.set(null), 2000);
    } catch {
      this.toaster.error('Failed to copy');
    }
  }

  formatRevenue(value: number): string {
    if (value >= 100000) {
      return (value / 100000).toFixed(1) + 'L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  isExternalUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  getStoreInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'S';
  }

  getMessageBgClass(type: UiMessage['type']): string {
    const map: Record<string, string> = {
      TIP: 'bg-theme-accent',
      SALE: 'bg-theme-success',
      ANNOUNCEMENT: 'bg-theme-primary',
      BANNER: 'bg-[#7C3AED]',
      NOTE: 'bg-theme-secondary',
    };
    return map[type] ?? 'bg-theme-secondary';
  }

  getMessageIconBgClass(type: UiMessage['type']): string {
    const map: Record<string, string> = {
      TIP: 'bg-theme-surface',
      SALE: 'bg-theme-surface',
      ANNOUNCEMENT: 'bg-theme-surface',
      BANNER: 'bg-theme-surface',
      NOTE: 'bg-theme-surface',
    };
    return map[type] ?? 'bg-theme-surface';
  }

  getMessageIconColorClass(type: UiMessage['type']): string {
    return 'text-theme-fg';
  }

  getMessageTextClass(type: UiMessage['type']): string {
    const map: Record<string, string> = {
      TIP: 'text-[var(--on-accent)]',
      SALE: 'text-[var(--on-success)]',
      ANNOUNCEMENT: 'text-[var(--on-primary)]',
      BANNER: 'text-white',
      NOTE: 'text-theme-fg',
    };
    return map[type] ?? 'text-theme-fg';
  }

  getMessageBodyClass(type: UiMessage['type']): string {
    const map: Record<string, string> = {
      TIP: 'text-[var(--on-accent)] opacity-80',
      SALE: 'text-[var(--on-success)] opacity-80',
      ANNOUNCEMENT: 'text-[var(--on-primary)] opacity-80',
      BANNER: 'text-white/80',
      NOTE: 'text-theme-muted',
    };
    return map[type] ?? 'text-theme-muted';
  }

  navigateTo(path: string): void {
    window.location.href = path;
  }
}
