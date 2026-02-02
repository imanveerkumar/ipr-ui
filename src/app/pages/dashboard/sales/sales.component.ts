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
    <!-- Hero Section -->
    <section class="bg-[#F9F4EB] border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 mb-4 flex-wrap">
          <a routerLink="/dashboard" class="text-sm font-medium text-black/70 hover:text-black transition-colors">
            Dashboard
          </a>
          <svg class="w-4 h-4 text-black/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span class="text-sm font-bold text-black">Sales</span>
        </nav>
        
        <!-- Header Content -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-1">Sales & Analytics</h1>
          <p class="text-[#111111]/70 font-medium">Track your product sales and revenue</p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="bg-[#F9F4EB] min-h-[60vh]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          <!-- Total Sales Card -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 sm:p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-bold text-[#111111]/60 uppercase tracking-wide mb-2">Total Sales</p>
                @if (statsLoading()) {
                  <div class="h-8 w-16 bg-black/10 animate-pulse"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-black text-[#111111]">{{ stats().totalSales }}</p>
                }
              </div>
              <div class="w-12 h-12 bg-[#7C3AED] border-2 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Revenue Card -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 sm:p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-bold text-[#111111]/60 uppercase tracking-wide mb-2">Total Revenue</p>
                @if (statsLoading()) {
                  <div class="h-8 w-24 bg-black/10 animate-pulse"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-black text-[#68E079]">₹{{ formatCurrency(stats().totalRevenue) }}</p>
                }
              </div>
              <div class="w-12 h-12 bg-[#68E079] border-2 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- This Month Card -->
          <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-5 sm:p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-bold text-[#111111]/60 uppercase tracking-wide mb-2">This Month</p>
                @if (statsLoading()) {
                  <div class="h-8 w-20 bg-black/10 animate-pulse"></div>
                } @else {
                  <p class="text-2xl sm:text-3xl font-black text-[#2B57D6]">₹{{ formatCurrency(stats().monthlyRevenue) }}</p>
                }
              </div>
              <div class="w-12 h-12 bg-[#2B57D6] border-2 border-black flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Sales Table Card -->
        <div class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <!-- Table Header -->
          <div class="p-5 sm:p-6 border-b-2 border-black">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 class="text-lg sm:text-xl font-black text-[#111111]">Recent Sales</h2>
                <p class="text-sm text-[#111111]/60 font-medium">View and manage all your sales transactions</p>
              </div>
              @if (pagination() && pagination()!.total > 0) {
                <span class="inline-flex items-center px-3 py-1.5 bg-[#F9F4EB] border-2 border-black text-sm font-bold">
                  {{ pagination()!.total }} transactions
                </span>
              }
            </div>
          </div>
          
          <!-- Data Grid -->
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
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Override data-grid styles for neo-brutalist look */
    ::ng-deep .data-grid-container {
      border: none !important;
      border-radius: 0 !important;
    }
    
    ::ng-deep .data-grid-search input {
      border: 2px solid #111 !important;
      border-radius: 0 !important;
    }
    
    ::ng-deep .data-grid-search input:focus {
      box-shadow: 4px 4px 0px 0px #000 !important;
    }
    
    ::ng-deep .data-grid-pagination button {
      border: 2px solid #111 !important;
      border-radius: 0 !important;
    }
    
    ::ng-deep .data-grid-pagination button:hover {
      box-shadow: 2px 2px 0px 0px #000 !important;
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
        'PAID': { bg: '#68E079', text: '#111111' },
        'FULFILLED': { bg: '#2B57D6', text: '#ffffff' },
        'PENDING': { bg: '#FFC60B', text: '#111111' },
        'FAILED': { bg: '#FA4B28', text: '#ffffff' },
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
