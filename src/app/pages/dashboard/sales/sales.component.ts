import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, DataGridComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 class="text-xl sm:text-2xl font-display font-bold text-gray-900">Sales</h1>
          <p class="text-sm text-gray-500 mt-1 hidden sm:block">Track your product sales and revenue</p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <!-- Total Sales Card -->
          <div class="card p-4 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Sales</p>
                @if (statsLoading()) {
                  <div class="h-8 sm:h-9 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{{ stats().totalSales }}</p>
                }
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Revenue Card -->
          <div class="card p-4 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500">Total Revenue</p>
                @if (statsLoading()) {
                  <div class="h-8 sm:h-9 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">₹{{ formatCurrency(stats().totalRevenue) }}</p>
                }
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- This Month Card -->
          <div class="card p-4 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm font-medium text-gray-500">This Month</p>
                @if (statsLoading()) {
                  <div class="h-8 sm:h-9 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">₹{{ formatCurrency(stats().monthlyRevenue) }}</p>
                }
              </div>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Table Section -->
        <div class="card overflow-hidden">
          <div class="p-4 sm:p-6 border-b border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 class="text-base sm:text-lg font-semibold text-gray-900">Recent Sales</h2>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5">View and manage all your sales transactions</p>
              </div>
              @if (pagination() && pagination()!.total > 0) {
                <div class="text-xs sm:text-sm text-gray-500">
                  {{ pagination()!.total }} total transactions
                </div>
              }
            </div>
          </div>
          
          <div class="p-4 sm:p-6">
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
    </div>
  `,
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
