import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { ProductService } from '../../core/services/product.service';
import { ApiService } from '../../core/services/api.service';
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
    <div class="dashboard-wrapper">
      <!-- Hero Header Section -->
      <section class="hero-section">
        <div class="hero-gradient">
          <div class="container">
            <!-- Welcome Badge -->
            <div class="welcome-badge animate-fade-in">
              <span class="badge-dot"></span>
              <span>Creator Dashboard</span>
            </div>
            
            <!-- Main Heading -->
            <h1 class="hero-title animate-slide-up">
              Welcome back, <span class="highlight-text">Creator</span>
            </h1>
            
            <p class="hero-subtitle animate-slide-up delay-100">
              Manage your stores, track sales, and grow your digital empire from one powerful dashboard.
            </p>
            
            <!-- Quick Stats Summary -->
            <div class="hero-stats animate-slide-up delay-200">
              <div class="hero-stat-item">
                <span class="hero-stat-value">{{ stores().length }}</span>
                <span class="hero-stat-label">Active Stores</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">{{ totalProducts() }}</span>
                <span class="hero-stat-label">Products</span>
              </div>
              <div class="hero-stat-divider"></div>
              <div class="hero-stat-item">
                <span class="hero-stat-value">₹{{ formatRevenue(totalRevenue()) }}</span>
                <span class="hero-stat-label">Total Revenue</span>
              </div>
            </div>
          </div>
          
          <!-- Decorative Elements -->
          <div class="decorative-elements">
            <div class="decor-circle decor-1"></div>
            <div class="decor-circle decor-2"></div>
            <div class="decor-circle decor-3"></div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="content-section">
        <div class="container">
          <!-- Stats Cards Grid -->
          <div class="stats-grid animate-slide-up delay-300">
            <!-- Stores Card -->
            <div class="stat-card" (click)="navigateTo('/dashboard/stores')">
              <div class="stat-card-inner">
                <div class="stat-icon-wrapper stores-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Total Stores</span>
                  <div class="stat-value-wrapper">
                    @if (loading()) {
                      <div class="skeleton-loader stat-skeleton"></div>
                    } @else {
                      <span class="stat-value">{{ stores().length }}</span>
                    }
                    <span class="stat-trend positive">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Active
                    </span>
                  </div>
                </div>
                <div class="stat-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Products Card -->
            <div class="stat-card" (click)="navigateTo('/dashboard/products')">
              <div class="stat-card-inner">
                <div class="stat-icon-wrapper products-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Total Products</span>
                  <div class="stat-value-wrapper">
                    @if (loading()) {
                      <div class="skeleton-loader stat-skeleton"></div>
                    } @else {
                      <span class="stat-value">{{ totalProducts() }}</span>
                    }
                    <span class="stat-trend neutral">Listed</span>
                  </div>
                </div>
                <div class="stat-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Sales Card -->
            <div class="stat-card" (click)="navigateTo('/dashboard/sales')">
              <div class="stat-card-inner">
                <div class="stat-icon-wrapper sales-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Total Sales</span>
                  <div class="stat-value-wrapper">
                    @if (loading()) {
                      <div class="skeleton-loader stat-skeleton"></div>
                    } @else {
                      <span class="stat-value">{{ totalSales() }}</span>
                    }
                    <span class="stat-trend positive">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Completed
                    </span>
                  </div>
                </div>
                <div class="stat-card-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Revenue Card -->
            <div class="stat-card">
              <div class="stat-card-inner">
                <div class="stat-icon-wrapper revenue-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Total Revenue</span>
                  <div class="stat-value-wrapper">
                    @if (loading()) {
                      <div class="skeleton-loader stat-skeleton"></div>
                    } @else {
                      <span class="stat-value revenue-value">₹{{ formatRevenue(totalRevenue()) }}</span>
                    }
                    <span class="stat-trend positive">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 9V3M6 3L3 6M6 3L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      Earned
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions Section -->
          <div class="section-header animate-slide-up delay-400">
            <h2 class="section-title">Quick Actions</h2>
            <p class="section-subtitle">Get started with these common tasks</p>
          </div>
          
          <div class="quick-actions-grid animate-slide-up delay-400">
            <!-- Create Store Action -->
            <a routerLink="/dashboard/stores/new" class="action-card action-card-store">
              <div class="action-card-content">
                <div class="action-icon-wrapper">
                  <div class="action-icon store-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                  <div class="action-icon-ring"></div>
                </div>
                <div class="action-text">
                  <h3 class="action-title">Create Store</h3>
                  <p class="action-description">Launch a new storefront and start selling</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
              <div class="action-card-bg"></div>
            </a>

            <!-- Add Product Action -->
            <a routerLink="/dashboard/products/new" class="action-card action-card-product">
              <div class="action-card-content">
                <div class="action-icon-wrapper">
                  <div class="action-icon product-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div class="action-icon-ring"></div>
                </div>
                <div class="action-text">
                  <h3 class="action-title">Add Product</h3>
                  <p class="action-description">Upload digital assets and start earning</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
              <div class="action-card-bg"></div>
            </a>

            <!-- View Analytics Action -->
            <a routerLink="/dashboard/sales" class="action-card action-card-analytics">
              <div class="action-card-content">
                <div class="action-icon-wrapper">
                  <div class="action-icon analytics-action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div class="action-icon-ring"></div>
                </div>
                <div class="action-text">
                  <h3 class="action-title">View Analytics</h3>
                  <p class="action-description">Track sales and monitor performance</p>
                </div>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
              <div class="action-card-bg"></div>
            </a>
          </div>

          <!-- Content Grid: Stores and Products -->
          <div class="content-grid animate-slide-up delay-500">
            <!-- Stores Section -->
            <div class="content-card stores-card">
              <div class="content-card-header">
                <div class="content-card-title-wrapper">
                  <div class="content-card-icon stores-title-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <h3 class="content-card-title">Your Stores</h3>
                </div>
                <a routerLink="/dashboard/stores" class="view-all-link">
                  View All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="content-card-body">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="list-item-skeleton">
                      <div class="skeleton-avatar"></div>
                      <div class="skeleton-content">
                        <div class="skeleton-line w-60"></div>
                        <div class="skeleton-line w-40"></div>
                      </div>
                    </div>
                  }
                } @else if (stores().length === 0) {
                  <div class="empty-state">
                    <div class="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <h4 class="empty-state-title">No stores yet</h4>
                    <p class="empty-state-text">Create your first store to start selling!</p>
                    <a routerLink="/dashboard/stores/new" class="empty-state-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Create Store
                    </a>
                  </div>
                } @else {
                  <div class="list-items">
                    @for (store of stores().slice(0, 5); track store.id) {
                      <a [routerLink]="['/dashboard/stores', store.id]" class="list-item store-item">
                        <div class="list-item-avatar store-avatar">
                          <span>{{ getStoreInitial(store.name) }}</span>
                        </div>
                        <div class="list-item-content">
                          <h4 class="list-item-title">{{ store.name }}</h4>
                          <p class="list-item-subtitle">{{ store.slug }}</p>
                        </div>
                        <div class="list-item-meta">
                          <span class="product-count-badge">
                            {{ store._count?.products || 0 }} products
                          </span>
                          <svg class="list-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </div>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Products Section -->
            <div class="content-card products-card">
              <div class="content-card-header">
                <div class="content-card-title-wrapper">
                  <div class="content-card-icon products-title-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>
                  <h3 class="content-card-title">Your Products</h3>
                </div>
                <a routerLink="/dashboard/products" class="view-all-link">
                  View All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
              
              <div class="content-card-body">
                @if (loading()) {
                  @for (i of [1, 2, 3]; track i) {
                    <div class="list-item-skeleton">
                      <div class="skeleton-image"></div>
                      <div class="skeleton-content">
                        <div class="skeleton-line w-60"></div>
                        <div class="skeleton-line w-40"></div>
                      </div>
                    </div>
                  }
                } @else if (products().length === 0) {
                  <div class="empty-state">
                    <div class="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </div>
                    <h4 class="empty-state-title">No products yet</h4>
                    <p class="empty-state-text">Add your first product to start earning!</p>
                    <a routerLink="/dashboard/products/new" class="empty-state-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                      Add Product
                    </a>
                  </div>
                } @else {
                  <div class="list-items">
                    @for (product of products().slice(0, 5); track product.id) {
                      <a [routerLink]="['/dashboard/products', product.id]" class="list-item product-item">
                        <div class="list-item-image">
                          @if (product.coverImageUrl) {
                            <img [src]="product.coverImageUrl" [alt]="product.title">
                          } @else {
                            <div class="image-placeholder">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            </div>
                          }
                        </div>
                        <div class="list-item-content">
                          <h4 class="list-item-title">{{ product.title }}</h4>
                          <p class="list-item-subtitle">{{ product.store?.name }}</p>
                        </div>
                        <div class="list-item-meta">
                          <span class="product-price">₹{{ product.price }}</span>
                          <span class="product-status" [class.status-active]="product.status === 'PUBLISHED'" [class.status-draft]="product.status !== 'PUBLISHED'">
                            {{ product.status === 'PUBLISHED' ? 'Active' : 'Draft' }}
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
          <div class="tips-section animate-slide-up delay-600">
            <div class="tips-card">
              <div class="tips-content">
                <div class="tips-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="tips-text">
                  <h3>Pro Tip</h3>
                  <p>Add high-quality cover images to your products to increase conversions by up to 40%!</p>
                </div>
              </div>
              <a routerLink="/dashboard/products" class="tips-action">
                Update Products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .dashboard-wrapper {
      font-family: 'DM Sans', system-ui, sans-serif;
      min-height: 100vh;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
      overflow-x: hidden;
    }

    /* Container */
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    @media (max-width: 640px) {
      .container {
        padding: 0 1rem;
      }
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      overflow: hidden;
    }

    .hero-gradient {
      background: linear-gradient(135deg, #c8f4d1 0%, #d4f8dd 25%, #e8fbee 50%, #f0fdf4 75%, #ffffff 100%);
      padding: 3rem 0 4rem;
      position: relative;
      border-radius: 0 0 2rem 2rem;
      margin: 0 1rem;
    }

    @media (max-width: 640px) {
      .hero-gradient {
        padding: 2rem 0 3rem;
        margin: 0 0.5rem;
        border-radius: 0 0 1.5rem 1.5rem;
      }
    }

    /* Welcome Badge */
    .welcome-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    /* Hero Title */
    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: 3rem;
      }
    }

    .highlight-text {
      color: #059669;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: #4b5563;
      margin: 0 0 2rem;
      max-width: 500px;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .hero-subtitle {
        font-size: 1rem;
      }
    }

    /* Hero Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .hero-stat-item {
      display: flex;
      flex-direction: column;
    }

    .hero-stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .hero-stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .hero-stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 480px) {
      .hero-stats {
        gap: 1rem;
      }
      .hero-stat-value {
        font-size: 1.25rem;
      }
      .hero-stat-divider {
        height: 30px;
      }
    }

    /* Decorative Elements */
    .decorative-elements {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .decor-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.08);
    }

    .decor-1 {
      width: 200px;
      height: 200px;
      top: -50px;
      right: -50px;
    }

    .decor-2 {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 10%;
    }

    .decor-3 {
      width: 80px;
      height: 80px;
      top: 30%;
      right: 25%;
    }

    @media (max-width: 768px) {
      .decorative-elements {
        display: none;
      }
    }

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
      margin-top: -1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 3rem;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }

    /* Stat Card */
    .stat-card {
      position: relative;
      background: #ffffff;
      border-radius: 1.25rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .stat-card-inner {
      position: relative;
      z-index: 1;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stores-icon { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669; }
    .products-icon { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); color: #7c3aed; }
    .sales-icon { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #d97706; }
    .revenue-icon { background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); color: #db2777; }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      display: block;
      margin-bottom: 0.25rem;
    }

    .stat-value-wrapper {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }

    .revenue-value {
      font-size: 1.5rem;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
    }

    .stat-trend.positive {
      background: #d1fae5;
      color: #059669;
    }

    .stat-trend.neutral {
      background: #f3f4f6;
      color: #6b7280;
    }

    .stat-card-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #d1d5db;
      transition: all 0.3s;
    }

    .stat-card:hover .stat-card-arrow {
      color: #9ca3af;
      transform: translateY(-50%) translateX(4px);
    }

    /* Section Header */
    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem;
    }

    .section-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    /* Quick Actions Grid */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 3rem;
    }

    @media (max-width: 768px) {
      .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }

    /* Action Card */
    .action-card {
      position: relative;
      display: block;
      border-radius: 1.25rem;
      overflow: hidden;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .action-card:hover {
      transform: translateY(-4px);
    }

    .action-card-store { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }
    .action-card-product { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }
    .action-card-analytics { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }

    .action-card-content {
      position: relative;
      z-index: 1;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .action-icon-wrapper {
      position: relative;
      flex-shrink: 0;
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .store-action-icon { background: #10b981; color: white; }
    .product-action-icon { background: #8b5cf6; color: white; }
    .analytics-action-icon { background: #f59e0b; color: white; }

    .action-icon-ring {
      position: absolute;
      inset: -4px;
      border-radius: 20px;
      border: 2px dashed currentColor;
      opacity: 0.2;
    }

    .action-card-store .action-icon-ring { color: #10b981; }
    .action-card-product .action-icon-ring { color: #8b5cf6; }
    .action-card-analytics .action-icon-ring { color: #f59e0b; }

    .action-text {
      flex: 1;
      min-width: 0;
    }

    .action-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem;
    }

    .action-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .action-arrow {
      color: #9ca3af;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .action-card:hover .action-arrow {
      color: #6b7280;
      transform: translateX(4px);
    }

    .action-card-bg {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .action-card-store .action-card-bg { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
    .action-card-product .action-card-bg { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); }
    .action-card-analytics .action-card-bg { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }

    .action-card:hover .action-card-bg {
      opacity: 1;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Content Card */
    .content-card {
      background: #ffffff;
      border-radius: 1.25rem;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .content-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .content-card-title-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .content-card-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stores-title-icon { background: #d1fae5; color: #059669; }
    .products-title-icon { background: #ede9fe; color: #7c3aed; }

    .content-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .view-all-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s;
    }

    .view-all-link:hover {
      color: #111827;
    }

    .content-card-body {
      padding: 0.5rem;
    }

    /* List Items */
    .list-items {
      display: flex;
      flex-direction: column;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.75rem;
      text-decoration: none;
      transition: all 0.2s;
    }

    .list-item:hover {
      background: #f9fafb;
    }

    .list-item-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .store-avatar {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
    }

    .list-item-image {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
      background: #f3f4f6;
    }

    .list-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .list-item-content {
      flex: 1;
      min-width: 0;
    }

    .list-item-title {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #111827;
      margin: 0 0 0.125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .list-item-subtitle {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .list-item-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .product-count-badge {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
    }

    .list-item-arrow {
      color: #d1d5db;
      transition: all 0.2s;
    }

    .list-item:hover .list-item-arrow {
      color: #9ca3af;
      transform: translateX(2px);
    }

    .product-price {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111827;
    }

    .product-status {
      font-size: 0.6875rem;
      font-weight: 500;
      padding: 0.1875rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .status-active {
      background: #d1fae5;
      color: #059669;
    }

    .status-draft {
      background: #f3f4f6;
      color: #6b7280;
    }

    /* Empty State */
    .empty-state {
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .empty-state-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      color: #9ca3af;
    }

    .empty-state-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem;
    }

    .empty-state-text {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
    }

    .empty-state-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #111827;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.625rem;
      text-decoration: none;
      transition: all 0.2s;
    }

    .empty-state-button:hover {
      background: #1f2937;
      transform: translateY(-2px);
    }

    /* Skeleton Loaders */
    .skeleton-loader {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 0.5rem;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .stat-skeleton {
      width: 60px;
      height: 32px;
    }

    .list-item-skeleton {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .skeleton-avatar,
    .skeleton-image {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skeleton-line {
      height: 12px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-line.w-60 { width: 60%; }
    .skeleton-line.w-40 { width: 40%; }

    /* Tips Section */
    .tips-section {
      margin-top: 1rem;
    }

    .tips-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border-radius: 1rem;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .tips-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .tips-icon {
      width: 40px;
      height: 40px;
      background: rgba(146, 64, 14, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #92400e;
    }

    .tips-text h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #92400e;
      margin: 0 0 0.25rem;
    }

    .tips-text p {
      font-size: 0.875rem;
      color: #b45309;
      margin: 0;
    }

    .tips-action {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: rgba(255, 255, 255, 0.8);
      color: #92400e;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .tips-action:hover {
      background: #ffffff;
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      .tips-card {
        flex-direction: column;
        text-align: center;
      }

      .tips-content {
        flex-direction: column;
      }
    }

    /* Animations */
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }

    .animate-slide-up {
      animation: slideUp 0.6s ease-out forwards;
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-600 { animation-delay: 0.6s; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Touch Feedback for Mobile */
    @media (hover: none) and (pointer: coarse) {
      .stat-card:active,
      .action-card:active,
      .list-item:active {
        transform: scale(0.98);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stores = signal<Store[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);
  totalProducts = signal(0);
  totalSales = signal(0);
  totalRevenue = signal(0);

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private api: ApiService
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
      
      // Calculate total products
      let totalProducts = 0;
      stores.forEach(s => {
        totalProducts += s._count?.products || 0;
      });
      this.totalProducts.set(totalProducts);
      
      // Get stats from API response
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
