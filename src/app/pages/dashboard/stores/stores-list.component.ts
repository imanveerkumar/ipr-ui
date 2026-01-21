import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { Store } from '../../../core/models/index';

@Component({
  selector: 'app-stores-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <!-- Header Section -->
      <section class="header-section">
        <div class="container">
          <div class="header-content">
            <div class="header-text">
              <div class="breadcrumb">
                <a routerLink="/dashboard" class="breadcrumb-link">Dashboard</a>
                <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
                <span class="breadcrumb-current">Stores</span>
              </div>
              <h1 class="page-title">My Stores</h1>
              <p class="page-subtitle">Create and manage your online storefronts</p>
            </div>
            <a routerLink="/dashboard/stores/new" class="primary-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Store
            </a>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      @if (!loading() && stores().length > 0) {
        <section class="stats-bar">
          <div class="container">
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-number">{{ stores().length }}</span>
                <span class="stat-label">Total Stores</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number stat-published">{{ publishedCount() }}</span>
                <span class="stat-label">Published</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number stat-draft">{{ draftCount() }}</span>
                <span class="stat-label">Draft</span>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Content Section -->
      <section class="content-section">
        <div class="container">
          @if (loading()) {
            <!-- Loading Skeleton -->
            <div class="stores-grid">
              @for (i of [1, 2, 3]; track i) {
                <div class="store-card">
                  <div class="store-banner skeleton-banner"></div>
                  <div class="store-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-url"></div>
                    <div class="skeleton-footer"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (stores().length === 0) {
            <!-- Empty State -->
            <div class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 class="empty-title">No stores yet</h3>
              <p class="empty-text">Create your first store to start selling digital products</p>
              <a routerLink="/dashboard/stores/new" class="primary-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Your First Store
              </a>
            </div>
          } @else {
            <!-- Stores Grid -->
            <div class="stores-grid">
              @for (store of stores(); track store.id) {
                <div class="store-card">
                  @if (store.bannerUrl) {
                    <img [src]="store.bannerUrl" alt="" class="store-banner">
                  } @else {
                    <div class="store-banner store-banner-default">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                  }
                  <div class="store-content">
                    <div class="store-header">
                      <h3 class="store-name">{{ store.name }}</h3>
                      <span class="status-badge" [class.status-published]="store.status === 'PUBLISHED'" [class.status-draft]="store.status === 'DRAFT'" [class.status-suspended]="store.status === 'SUSPENDED'">
                        {{ store.status }}
                      </span>
                    </div>
                    
                    <div class="store-url">
                      @if (store.status === 'PUBLISHED') {
                        <a [href]="storeService.getStoreUrl(store)" target="_blank" class="store-url-link">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          {{ store.slug }}.yoursite.com
                        </a>
                      } @else {
                        <span class="store-url-draft">{{ store.slug }}.yoursite.com</span>
                      }
                    </div>
                    
                    <div class="store-footer">
                      <span class="product-count">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        {{ store._count?.products || 0 }} products
                      </span>
                      <a [routerLink]="['/dashboard/stores', store.id]" class="manage-button">
                        Manage
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .page-wrapper {
      font-family: 'DM Sans', system-ui, sans-serif;
      min-height: 100vh;
      background: #f8fafc;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    @media (max-width: 640px) {
      .container {
        padding: 0 1rem;
      }
    }

    /* Header Section */
    .header-section {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem 0;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .header-content {
        flex-direction: column;
      }
    }

    .header-text {
      flex: 1;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb-link:hover {
      color: #111827;
    }

    .breadcrumb-separator {
      color: #d1d5db;
      flex-shrink: 0;
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 500;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0;
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 1.25rem;
      }
    }

    .primary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #111827;
      color: #ffffff;
      font-size: 0.9375rem;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      font-family: inherit;
      white-space: nowrap;
    }

    .primary-button:hover {
      background: #1f2937;
    }

    @media (max-width: 640px) {
      .primary-button {
        width: 100%;
        justify-content: center;
      }
    }

    /* Stats Bar */
    .stats-bar {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 0;
    }

    .stats-row {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    @media (max-width: 640px) {
      .stats-row {
        gap: 1rem;
      }
    }

    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .stat-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .stat-published {
      color: #059669;
    }

    .stat-draft {
      color: #d97706;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .stat-divider {
      width: 1px;
      height: 24px;
      background: #e5e7eb;
    }

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
    }

    /* Stores Grid */
    .stores-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .stores-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stores-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Store Card */
    .store-card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      transition: all 0.2s;
    }

    .store-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .store-banner {
      width: 100%;
      height: 120px;
      object-fit: cover;
    }

    .store-banner-default {
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .store-content {
      padding: 1.25rem;
    }

    .store-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .store-name {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
      line-height: 1.3;
    }

    .status-badge {
      padding: 0.25rem 0.625rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
      flex-shrink: 0;
    }

    .status-published {
      background: #dcfce7;
      color: #166534;
    }

    .status-draft {
      background: #fef3c7;
      color: #92400e;
    }

    .status-suspended {
      background: #fee2e2;
      color: #991b1b;
    }

    .store-url {
      margin-bottom: 1rem;
    }

    .store-url-link {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #059669;
      text-decoration: none;
      transition: color 0.2s;
    }

    .store-url-link:hover {
      color: #047857;
    }

    .store-url-draft {
      font-size: 0.8125rem;
      color: #9ca3af;
    }

    .store-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .product-count {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #6b7280;
    }

    .manage-button {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      text-decoration: none;
      transition: color 0.2s;
    }

    .manage-button:hover {
      color: #111827;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e5e7eb;
      text-align: center;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      margin-bottom: 1.5rem;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem;
    }

    .empty-text {
      font-size: 0.9375rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
      max-width: 300px;
    }

    /* Skeleton Loading */
    .skeleton-banner {
      background: #e5e7eb;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-title {
      height: 1.25rem;
      width: 60%;
      background: #e5e7eb;
      border-radius: 0.375rem;
      margin-bottom: 0.75rem;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-url {
      height: 0.875rem;
      width: 75%;
      background: #e5e7eb;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-footer {
      height: 0.875rem;
      width: 40%;
      background: #e5e7eb;
      border-radius: 0.375rem;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class StoresListComponent implements OnInit {
  stores = signal<Store[]>([]);
  loading = signal(true);
  storeService = inject(StoreService);

  publishedCount = computed(() => this.stores().filter(s => s.status === 'PUBLISHED').length);
  draftCount = computed(() => this.stores().filter(s => s.status === 'DRAFT').length);

  async ngOnInit() {
    const stores = await this.storeService.getMyStores();
    this.stores.set(stores);
    this.loading.set(false);
  }
}
