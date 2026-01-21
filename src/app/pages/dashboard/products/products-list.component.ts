import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Store } from '../../../core/models/index';

@Component({
  selector: 'app-products-list',
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
                <span class="breadcrumb-current">Products</span>
              </div>
              <h1 class="page-title">My Products</h1>
              <p class="page-subtitle">Manage and organize your digital products</p>
            </div>
            <a routerLink="/dashboard/products/new" class="primary-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Product
            </a>
          </div>
          
          <!-- Stats Bar -->
          <div class="stats-bar">
            <div class="stat-item">
              <span class="stat-value">{{ products().length }}</span>
              <span class="stat-label">Total Products</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ getPublishedCount() }}</span>
              <span class="stat-label">Published</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ getDraftCount() }}</span>
              <span class="stat-label">Drafts</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="content-section">
        <div class="container">
          @if (loading()) {
            <div class="products-grid">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="product-card skeleton-card">
                  <div class="skeleton-image"></div>
                  <div class="skeleton-content">
                    <div class="skeleton-line w-70"></div>
                    <div class="skeleton-line w-40"></div>
                    <div class="skeleton-line w-50"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (products().length === 0) {
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3 class="empty-state-title">No products yet</h3>
              <p class="empty-state-text">Create your first digital product and start selling to customers worldwide.</p>
              <a routerLink="/dashboard/products/new" class="primary-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Your First Product
              </a>
            </div>
          } @else {
            <div class="products-grid">
              @for (product of products(); track product.id) {
                <a [routerLink]="['/dashboard/products', product.id]" class="product-card">
                  <div class="product-image-wrapper">
                    @if (product.coverImageUrl) {
                      <img [src]="product.coverImageUrl" [alt]="product.title" class="product-image">
                    } @else {
                      <div class="product-image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    }
                    <div class="product-status" [class.status-published]="product.status === 'PUBLISHED'" [class.status-draft]="product.status !== 'PUBLISHED'">
                      {{ product.status === 'PUBLISHED' ? 'Live' : 'Draft' }}
                    </div>
                  </div>
                  <div class="product-content">
                    <h3 class="product-title">{{ product.title }}</h3>
                    <p class="product-store">{{ product.store?.name || 'No store' }}</p>
                    <div class="product-footer">
                      <span class="product-price">₹{{ product.price / 100 }}</span>
                      <span class="product-edit-btn">
                        Edit
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
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
      max-width: 1280px;
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
      padding: 1.5rem 0 2rem;
    }

    .header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
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
    }

    .breadcrumb-current {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 500;
    }

    .page-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    @media (max-width: 640px) {
      .page-title {
        font-size: 1.5rem;
      }
      .page-subtitle {
        font-size: 0.875rem;
      }
    }

    /* Primary Button */
    .primary-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #111827;
      color: #ffffff;
      font-size: 0.9375rem;
      font-weight: 600;
      border-radius: 0.75rem;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .primary-button:hover {
      background: #1f2937;
      transform: translateY(-1px);
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-radius: 0.75rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .stat-label {
      font-size: 0.8125rem;
      color: #6b7280;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: #e5e7eb;
    }

    @media (max-width: 640px) {
      .stats-bar {
        gap: 1.25rem;
        padding: 0.875rem 1rem;
      }
      .stat-value {
        font-size: 1.125rem;
      }
      .stat-label {
        font-size: 0.75rem;
      }
    }

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .products-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    /* Product Card */
    .product-card {
      background: #ffffff;
      border-radius: 1rem;
      overflow: hidden;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e5e7eb;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
      border-color: #d1d5db;
    }

    .product-image-wrapper {
      position: relative;
      height: 180px;
      background: #f3f4f6;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .product-status {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: 9999px;
    }

    .status-published {
      background: #dcfce7;
      color: #166534;
    }

    .status-draft {
      background: #fef3c7;
      color: #92400e;
    }

    .product-content {
      padding: 1.25rem;
    }

    .product-title {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-store {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0 0 1rem;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .product-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
    }

    .product-edit-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #6b7280;
      transition: color 0.2s;
    }

    .product-card:hover .product-edit-btn {
      color: #111827;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e5e7eb;
    }

    .empty-state-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #9ca3af;
    }

    .empty-state-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.5rem;
    }

    .empty-state-text {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
      max-width: 400px;
    }

    /* Skeleton Loading */
    .skeleton-card {
      pointer-events: none;
    }

    .skeleton-image {
      height: 180px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    .skeleton-line.w-70 { width: 70%; }
    .skeleton-line.w-50 { width: 50%; }
    .skeleton-line.w-40 { width: 40%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Touch feedback for mobile */
    @media (hover: none) and (pointer: coarse) {
      .product-card:active {
        transform: scale(0.98);
      }
    }
  `]
})
export class ProductsListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    const products = await this.productService.getMyProducts();
    this.products.set(products);
    this.loading.set(false);
  }

  getPublishedCount(): number {
    return this.products().filter(p => p.status === 'PUBLISHED').length;
  }

  getDraftCount(): number {
    return this.products().filter(p => p.status !== 'PUBLISHED').length;
  }
}
