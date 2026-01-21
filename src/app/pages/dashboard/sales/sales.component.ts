import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { DataGridComponent, GridColumn, GridPagination, GridDataRequest } from '../../../shared/components/data-grid/data-grid.component';

interface Sale {
  id: string;
  productTitle: string;
  storeName: string;
  customerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, DataGridComponent, RouterLink],
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
                <span class="breadcrumb-current">Sales</span>
              </div>
              <h1 class="page-title">Sales</h1>
              <p class="page-subtitle">Track your product sales and revenue</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section class="content-section">
        <div class="container">
          <!-- Stats Grid -->
          <div class="stats-grid">
            <!-- Total Sales Card -->
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">Total Sales</p>
                  @if (statsLoading()) {
                    <div class="stat-skeleton"></div>
                  } @else {
                    <p class="stat-value">{{ stats().totalSales }}</p>
                  }
                </div>
                <div class="stat-icon stat-icon-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Total Revenue Card -->
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">Total Revenue</p>
                  @if (statsLoading()) {
                    <div class="stat-skeleton stat-skeleton-wide"></div>
                  } @else {
                    <p class="stat-value stat-value-success">₹{{ formatCurrency(stats().totalRevenue) }}</p>
                  }
                </div>
                <div class="stat-icon stat-icon-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- This Month Card -->
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-info">
                  <p class="stat-label">This Month</p>
                  @if (statsLoading()) {
                    <div class="stat-skeleton"></div>
                  } @else {
                    <p class="stat-value stat-value-primary">₹{{ formatCurrency(stats().monthlyRevenue) }}</p>
                  }
                </div>
                <div class="stat-icon stat-icon-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Sales Table Card -->
          <div class="table-card">
            <div class="table-header">
              <div class="table-header-content">
                <div class="table-header-text">
                  <h2 class="table-title">Recent Sales</h2>
                  <p class="table-subtitle">View and manage all your sales transactions</p>
                </div>
                @if (pagination() && pagination()!.total > 0) {
                  <div class="total-count">{{ pagination()!.total }} total transactions</div>
                }
              </div>
            </div>
            
            <div class="table-content">
              <app-data-grid
                [rowData]="sales"
                [columns]="columns"
                [loading]="loading"
                [pagination]="pagination"
                [showSearch]="true"
                [showExport]="true"
                [showPagination]="true"
                [searchPlaceholder]="'Search by product, store, or customer...'"
                [emptyTitle]="'No sales yet'"
                [emptyMessage]="'Your sales will appear here once customers start purchasing your products.'"
                [gridHeight]="'500px'"
                [pageSizeOptions]="[10, 20, 50, 100]"
                [defaultPageSize]="20"
                [rowClickable]="false"
                [idField]="'id'"
                (dataRequest)="onDataRequest($event)"
                (exportClicked)="onExport()"
              />
            </div>
          </div>
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

    /* Content Section */
    .content-section {
      padding: 2rem 0 4rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .stat-card {
      background: #ffffff;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      transition: all 0.2s;
    }

    .stat-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .stat-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .stat-info {
      flex: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      margin: 0 0 0.375rem;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .stat-value-success {
      color: #059669;
    }

    .stat-value-primary {
      color: #111827;
    }

    .stat-skeleton {
      height: 2rem;
      width: 4rem;
      background: #e5e7eb;
      border-radius: 0.375rem;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .stat-skeleton-wide {
      width: 6rem;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon-primary {
      background: #f3f4f6;
      color: #374151;
    }

    .stat-icon-success {
      background: #dcfce7;
      color: #16a34a;
    }

    @media (max-width: 640px) {
      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
      }

      .stat-icon svg {
        width: 20px;
        height: 20px;
      }
    }

    /* Table Card */
    .table-card {
      background: #ffffff;
      border-radius: 1rem;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .table-header-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .table-header-content {
        flex-direction: column;
      }
    }

    .table-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem;
    }

    .table-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .total-count {
      font-size: 0.875rem;
      color: #6b7280;
      white-space: nowrap;
    }

    .table-content {
      padding: 1.5rem;
    }

    @media (max-width: 640px) {
      .table-header {
        padding: 1rem;
      }

      .table-content {
        padding: 1rem;
      }
    }
  `]
})
export class SalesComponent implements OnInit {
  sales = signal<Sale[]>([]);
  loading = signal(true);
  statsLoading = signal(true);
  stats = signal<SalesStats>({ totalSales: 0, totalRevenue: 0, monthlyRevenue: 0 });
  pagination = signal<GridPagination | null>(null);

  // Column definitions for the data grid
  columns: GridColumn<Sale>[] = [
    {
      field: 'productTitle',
      headerName: 'Product',
      sortable: true,
      mobilePrimary: true,
      flex: 2,
      minWidth: 180,
    },
    {
      field: 'storeName',
      headerName: 'Store',
      sortable: true,
      mobileSecondary: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'customerEmail',
      headerName: 'Customer',
      sortable: true,
      mobileHidden: false,
      flex: 2,
      minWidth: 180,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      sortable: true,
      type: 'currency',
      currencySymbol: '₹',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params: any) => {
        if (params.value == null) return '-';
        // Amount is in paise, convert to rupees
        const value = params.value / 100;
        return `₹${value.toLocaleString('en-IN')}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      type: 'badge',
      flex: 1,
      minWidth: 100,
      badgeColors: {
        'PAID': { bg: '#dcfce7', text: '#166534' },
        'FULFILLED': { bg: '#dbeafe', text: '#1e40af' },
        'PENDING': { bg: '#fef3c7', text: '#92400e' },
        'FAILED': { bg: '#fee2e2', text: '#991b1b' },
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      sortable: true,
      type: 'date',
      flex: 1,
      minWidth: 110,
    },
  ];

  constructor(private api: ApiService) {}

  async ngOnInit() {
    // Load initial data
    await Promise.all([
      this.loadStats(),
      this.loadSales({ page: 1, limit: 20 }),
    ]);
  }

  async loadStats() {
    try {
      this.statsLoading.set(true);
      const response = await this.api.get<SalesStats>('/orders/sales/stats');
      if (response.data) {
        this.stats.set(response.data);
      }
    } catch (error) {
      console.error('Failed to load sales stats:', error);
    } finally {
      this.statsLoading.set(false);
    }
  }

  async loadSales(request: GridDataRequest) {
    try {
      this.loading.set(true);

      // Build query params
      const params = new URLSearchParams();
      params.set('page', String(request.page));
      params.set('limit', String(request.limit));
      
      if (request.sortField) {
        params.set('sortField', request.sortField);
      }
      if (request.sortOrder) {
        params.set('sortOrder', request.sortOrder);
      }
      if (request.search) {
        params.set('search', request.search);
      }

      const response = await this.api.get<PaginatedResponse<Sale>>(`/orders/sales?${params.toString()}`);
      
      if (response.data) {
        const paginatedData = response.data as PaginatedResponse<Sale>;
        this.sales.set(paginatedData.data);
        this.pagination.set({
          page: paginatedData.meta.page,
          limit: paginatedData.meta.limit,
          total: paginatedData.meta.total,
          totalPages: paginatedData.meta.totalPages,
        });
      }
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onDataRequest(request: GridDataRequest) {
    this.loadSales(request);
  }

  onExport() {
    // AG Grid handles CSV export internally through the data-grid component
    console.log('Export triggered');
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
}
