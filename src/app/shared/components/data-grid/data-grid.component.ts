import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  SortChangedEvent,
  PaginationChangedEvent,
  ModuleRegistry,
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule,
  RowSelectionModule,
} from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule,
  RowSelectionModule,
]);

export interface GridPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GridDataRequest {
  page: number;
  limit: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface GridColumn<T = any> extends Omit<ColDef<T>, 'field'> {
  field: keyof T | string;
  headerName: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge' | 'custom';
  currencySymbol?: string;
  badgeColors?: Record<string, { bg: string; text: string }>;
  mobileHidden?: boolean;
  mobilePrimary?: boolean;
  mobileSecondary?: boolean;
  dateFormat?: string;
  cellRenderer?: any;
  valueFormatter?: (params: any) => string;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile Card View -->
    <div class="block lg:hidden">
      <!-- Mobile Search -->
      @if (showSearch) {
        <div class="mb-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="searchValue"
              (ngModelChange)="onSearch($event)"
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm transition-all bg-white shadow-sm"
            />
          </div>
        </div>
      }

      <!-- Mobile Cards -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of skeletonRows; track i) {
            <div class="bg-white rounded-xl border border-gray-100 p-4 animate-pulse shadow-sm">
              <div class="flex items-start justify-between mb-3">
                <div class="space-y-2 flex-1">
                  <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-gray-50">
                <div class="h-4 bg-gray-100 rounded w-24"></div>
                <div class="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          }
        </div>
      } @else if (rowData().length === 0) {
        <div class="bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ emptyTitle }}</h3>
          <p class="text-gray-500 text-sm">{{ emptyMessage }}</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (row of paginatedMobileData(); track trackByFn(row)) {
            <div 
              class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-[0.99]"
              (click)="onRowClick(row)"
              [class.cursor-pointer]="rowClickable"
            >
              <!-- Primary Row -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  @if (getPrimaryColumn()) {
                    <div class="font-semibold text-gray-900 truncate">
                      {{ formatCellValue(row, getPrimaryColumn()!) }}
                    </div>
                  }
                  @if (getSecondaryColumn()) {
                    <div class="text-sm text-gray-500 truncate mt-0.5">
                      {{ formatCellValue(row, getSecondaryColumn()!) }}
                    </div>
                  }
                </div>
                @if (getBadgeColumn()) {
                  <span 
                    class="ml-3 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                    [style.backgroundColor]="getBadgeColor(row, getBadgeColumn()!).bg"
                    [style.color]="getBadgeColor(row, getBadgeColumn()!).text"
                  >
                    {{ getCellValue(row, getBadgeColumn()!) }}
                  </span>
                }
              </div>

              <!-- Secondary Info -->
              <div class="flex flex-wrap gap-x-4 gap-y-2 pt-3 border-t border-gray-50">
                @for (col of getMobileVisibleColumns(); track col.field) {
                  <div class="flex items-center text-sm">
                    <span class="text-gray-400 mr-1.5">{{ col.headerName }}:</span>
                    <span class="text-gray-700 font-medium">{{ formatCellValue(row, col) }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Mobile Pagination -->
        @if (showPagination && pagination()) {
          <div class="mt-6 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-gray-500">
                {{ getMobilePaginationText() }}
              </span>
              <select 
                [(ngModel)]="pageSize"
                (ngModelChange)="onPageSizeChange($event)"
                class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
              >
                @for (size of pageSizeOptions; track size) {
                  <option [value]="size">{{ size }} / page</option>
                }
              </select>
            </div>
            <div class="flex items-center justify-center gap-2">
              <button 
                (click)="goToFirstPage()"
                [disabled]="!pagination()?.page || pagination()!.page <= 1"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                (click)="goToPreviousPage()"
                [disabled]="!pagination()?.page || pagination()!.page <= 1"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <div class="flex items-center gap-1 px-2">
                @for (pageNum of getVisiblePageNumbers(); track pageNum) {
                  @if (pageNum === -1) {
                    <span class="px-2 text-gray-400">...</span>
                  } @else {
                    <button
                      (click)="goToPage(pageNum)"
                      [class]="pageNum === pagination()?.page 
                        ? 'w-8 h-8 rounded-lg bg-primary-600 text-white font-medium text-sm' 
                        : 'w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 text-sm transition-colors'"
                    >
                      {{ pageNum }}
                    </button>
                  }
                }
              </div>

              <button 
                (click)="goToNextPage()"
                [disabled]="!pagination()?.page || pagination()!.page >= pagination()!.totalPages"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button 
                (click)="goToLastPage()"
                [disabled]="!pagination()?.page || pagination()!.page >= pagination()!.totalPages"
                class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        }
      }
    </div>

    <!-- Desktop AG Grid View -->
    <div class="hidden lg:block">
      <!-- Desktop Search & Controls -->
      @if (showSearch || showExport) {
        <div class="flex items-center justify-between mb-4 gap-4">
          @if (showSearch) {
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                [placeholder]="searchPlaceholder"
                [(ngModel)]="searchValue"
                (ngModelChange)="onSearch($event)"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm transition-all"
              />
            </div>
          }
          @if (showExport) {
            <button 
              (click)="exportData()"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </button>
          }
        </div>
      }

      <!-- AG Grid -->
      <div class="ag-theme-custom rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        @if (loading()) {
          <div class="p-8">
            <div class="animate-pulse space-y-4">
              <div class="h-10 bg-gray-100 rounded"></div>
              @for (i of skeletonRows; track i) {
                <div class="h-14 bg-gray-50 rounded"></div>
              }
            </div>
          </div>
        } @else {
          <ag-grid-angular
            class="w-full"
            [style.height]="gridHeight"
            [rowData]="rowData()"
            [columnDefs]="agColumnDefs()"
            [defaultColDef]="defaultColDef"
            [pagination]="useClientPagination"
            [paginationPageSize]="pageSize"
            [paginationPageSizeSelector]="pageSizeOptions"
            [suppressPaginationPanel]="!useClientPagination"
            [animateRows]="true"
            [rowSelection]="rowSelection"
            [suppressRowClickSelection]="true"
            [suppressCellFocus]="true"
            (gridReady)="onGridReady($event)"
            (sortChanged)="onSortChanged($event)"
            (paginationChanged)="onPaginationChanged($event)"
            (rowClicked)="onRowClick($event.data)"
          />
        }
      </div>

      <!-- Custom Pagination for Server-Side -->
      @if (showPagination && !useClientPagination && pagination()) {
        <div class="flex items-center justify-between mt-4 px-2">
          <div class="text-sm text-gray-500">
            Showing {{ getStartRecord() }} to {{ getEndRecord() }} of {{ pagination()!.total }} results
          </div>
          
          <div class="flex items-center gap-4">
            <select 
              [(ngModel)]="pageSize"
              (ngModelChange)="onPageSizeChange($event)"
              class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
            >
              @for (size of pageSizeOptions; track size) {
                <option [value]="size">{{ size }} per page</option>
              }
            </select>

            <div class="flex items-center gap-1">
              <button 
                (click)="goToFirstPage()"
                [disabled]="pagination()!.page <= 1"
                class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                (click)="goToPreviousPage()"
                [disabled]="pagination()!.page <= 1"
                class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              @for (pageNum of getVisiblePageNumbers(); track pageNum) {
                @if (pageNum === -1) {
                  <span class="px-2 text-gray-400">...</span>
                } @else {
                  <button
                    (click)="goToPage(pageNum)"
                    [class]="pageNum === pagination()!.page 
                      ? 'min-w-[36px] h-9 rounded-lg bg-primary-600 text-white font-medium text-sm' 
                      : 'min-w-[36px] h-9 rounded-lg hover:bg-gray-100 text-gray-600 text-sm transition-colors'"
                  >
                    {{ pageNum }}
                  </button>
                }
              }

              <button 
                (click)="goToNextPage()"
                [disabled]="pagination()!.page >= pagination()!.totalPages"
                class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button 
                (click)="goToLastPage()"
                [disabled]="pagination()!.page >= pagination()!.totalPages"
                class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* AG Grid Custom Theme - Consistent with app design */
    .ag-theme-custom {
      --ag-background-color: #ffffff;
      --ag-foreground-color: #111827;
      --ag-header-background-color: #f9fafb;
      --ag-header-foreground-color: #6b7280;
      --ag-border-color: #f3f4f6;
      --ag-row-hover-color: #f9fafb;
      --ag-selected-row-background-color: #eff6ff;
      --ag-font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
      --ag-font-size: 14px;
      --ag-row-border-color: #f3f4f6;
      --ag-cell-horizontal-padding: 16px;
      --ag-header-height: 48px;
      --ag-row-height: 56px;
      --ag-borders: none;
      --ag-border-radius: 0;
      --ag-wrapper-border-radius: 12px;

      font-family: var(--ag-font-family);
    }

    .ag-theme-custom .ag-root-wrapper {
      border: none;
    }

    .ag-theme-custom .ag-header {
      border-bottom: 1px solid #e5e7eb;
    }

    .ag-theme-custom .ag-header-cell {
      font-weight: 500;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .ag-theme-custom .ag-header-cell-text {
      color: #6b7280;
    }

    .ag-theme-custom .ag-row {
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.15s ease;
    }

    .ag-theme-custom .ag-row:last-child {
      border-bottom: none;
    }

    .ag-theme-custom .ag-row:hover {
      background-color: #f9fafb;
    }

    .ag-theme-custom .ag-cell {
      display: flex;
      align-items: center;
      color: #374151;
    }

    .ag-theme-custom .ag-header-cell-sortable:hover {
      background-color: #f3f4f6;
    }

    .ag-theme-custom .ag-icon-asc,
    .ag-theme-custom .ag-icon-desc {
      color: #0284c7;
    }

    .ag-theme-custom .ag-paging-panel {
      border-top: 1px solid #e5e7eb;
      padding: 12px 16px;
      color: #6b7280;
      font-size: 14px;
    }

    /* Badge styles for status cells */
    :host ::ng-deep .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
    }

    :host ::ng-deep .badge-success {
      background-color: #dcfce7;
      color: #166534;
    }

    :host ::ng-deep .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    :host ::ng-deep .badge-error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    :host ::ng-deep .badge-info {
      background-color: #dbeafe;
      color: #1e40af;
    }

    :host ::ng-deep .badge-default {
      background-color: #f3f4f6;
      color: #374151;
    }
  `],
})
export class DataGridComponent<T = any> implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  // Inputs
  @Input() rowData = signal<T[]>([]);
  @Input() columns: GridColumn<T>[] = [];
  @Input() loading = signal(false);
  @Input() pagination = signal<GridPagination | null>(null);
  @Input() showSearch = true;
  @Input() showExport = false;
  @Input() showPagination = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyTitle = 'No data found';
  @Input() emptyMessage = 'There are no records to display.';
  @Input() gridHeight = '500px';
  @Input() pageSizeOptions = [10, 20, 50, 100];
  @Input() defaultPageSize = 20;
  @Input() rowClickable = false;
  @Input() rowSelection: 'single' | 'multiple' | undefined = undefined;
  @Input() useClientPagination = false;
  @Input() idField: keyof T = 'id' as keyof T;

  // Outputs
  @Output() dataRequest = new EventEmitter<GridDataRequest>();
  @Output() rowClicked = new EventEmitter<T>();
  @Output() selectionChanged = new EventEmitter<T[]>();
  @Output() exportClicked = new EventEmitter<void>();

  // Internal state
  gridApi: GridApi | null = null;
  searchValue = '';
  pageSize = this.defaultPageSize;
  currentSort: { field: string; order: 'asc' | 'desc' } | null = null;
  skeletonRows = Array(5).fill(0).map((_, i) => i);
  private searchTimeout: any;

  // Computed AG Grid column definitions
  agColumnDefs = computed<ColDef[]>(() => {
    return this.columns
      .filter(col => !col.mobileHidden || window.innerWidth >= 1024)
      .map(col => this.mapToAgColDef(col));
  });

  // Computed mobile data with client-side pagination
  paginatedMobileData = computed(() => {
    const data = this.rowData();
    const pag = this.pagination();
    
    if (!pag || this.useClientPagination) {
      return data;
    }
    
    return data;
  });

  defaultColDef: ColDef = {
    resizable: true,
    minWidth: 100,
    sortable: true,
    suppressMovable: true,
  };

  ngOnInit() {
    this.pageSize = this.defaultPageSize;
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private mapToAgColDef(col: GridColumn<T>): ColDef {
    const colDef: ColDef = {
      field: col.field as string,
      headerName: col.headerName,
      sortable: col.sortable !== false,
      flex: col.flex ?? 1,
      minWidth: col.minWidth ?? 100,
      maxWidth: col.maxWidth,
      hide: col.hide,
      pinned: col.pinned,
    };

    // Apply formatters based on type
    switch (col.type) {
      case 'currency':
        colDef.valueFormatter = (params) => {
          if (params.value == null) return '-';
          const symbol = col.currencySymbol || '₹';
          const value = typeof params.value === 'number' ? params.value : parseFloat(params.value);
          return `${symbol}${value.toLocaleString('en-IN')}`;
        };
        colDef.cellClass = 'font-medium';
        break;

      case 'date':
        colDef.valueFormatter = (params) => {
          if (!params.value) return '-';
          const date = new Date(params.value);
          return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        };
        break;

      case 'badge':
        colDef.cellRenderer = (params: any) => {
          if (!params.value) return '';
          const colors = this.getBadgeColorForValue(params.value, col.badgeColors);
          return `<span class="badge" style="background-color: ${colors.bg}; color: ${colors.text}">${params.value}</span>`;
        };
        break;

      case 'number':
        colDef.valueFormatter = (params) => {
          if (params.value == null) return '-';
          return Number(params.value).toLocaleString();
        };
        break;
    }

    // Apply custom formatter if provided
    if (col.valueFormatter) {
      colDef.valueFormatter = col.valueFormatter;
    }

    // Apply custom cell renderer if provided
    if (col.cellRenderer) {
      colDef.cellRenderer = col.cellRenderer;
    }

    return colDef;
  }

  private getBadgeColorForValue(value: string, colors?: Record<string, { bg: string; text: string }>): { bg: string; text: string } {
    const defaultColors: Record<string, { bg: string; text: string }> = {
      'PAID': { bg: '#dcfce7', text: '#166534' },
      'FULFILLED': { bg: '#dbeafe', text: '#1e40af' },
      'PENDING': { bg: '#fef3c7', text: '#92400e' },
      'FAILED': { bg: '#fee2e2', text: '#991b1b' },
      'CANCELLED': { bg: '#f3f4f6', text: '#374151' },
      'ACTIVE': { bg: '#dcfce7', text: '#166534' },
      'INACTIVE': { bg: '#f3f4f6', text: '#374151' },
      'PUBLISHED': { bg: '#dcfce7', text: '#166534' },
      'DRAFT': { bg: '#fef3c7', text: '#92400e' },
    };

    const allColors = { ...defaultColors, ...colors };
    return allColors[value] || { bg: '#f3f4f6', text: '#374151' };
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

    // Handle window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.gridApi?.sizeColumnsToFit();
      }, 100);
    });
  }

  onSortChanged(event: SortChangedEvent) {
    const sortModel = event.api.getColumnState().filter(col => col.sort);
    
    if (sortModel.length > 0) {
      this.currentSort = {
        field: sortModel[0].colId,
        order: sortModel[0].sort as 'asc' | 'desc',
      };
    } else {
      this.currentSort = null;
    }

    this.emitDataRequest();
  }

  onPaginationChanged(event: PaginationChangedEvent) {
    if (this.useClientPagination) {
      // AG Grid handles pagination internally
    }
  }

  onSearch(value: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.emitDataRequest();
    }, 300);
  }

  onRowClick(row: T) {
    if (this.rowClickable) {
      this.rowClicked.emit(row);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.emitDataRequest(1); // Reset to first page
  }

  goToPage(page: number) {
    this.emitDataRequest(page);
  }

  goToFirstPage() {
    this.goToPage(1);
  }

  goToPreviousPage() {
    const current = this.pagination()?.page || 1;
    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  goToNextPage() {
    const current = this.pagination()?.page || 1;
    const total = this.pagination()?.totalPages || 1;
    if (current < total) {
      this.goToPage(current + 1);
    }
  }

  goToLastPage() {
    const total = this.pagination()?.totalPages || 1;
    this.goToPage(total);
  }

  private emitDataRequest(page?: number) {
    const pag = this.pagination();
    this.dataRequest.emit({
      page: page ?? pag?.page ?? 1,
      limit: this.pageSize,
      sortField: this.currentSort?.field,
      sortOrder: this.currentSort?.order,
      search: this.searchValue || undefined,
    });
  }

  exportData() {
    this.exportClicked.emit();
    
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: 'export.csv',
      });
    }
  }

  // Mobile helper methods
  getPrimaryColumn(): GridColumn<T> | undefined {
    return this.columns.find(c => c.mobilePrimary);
  }

  getSecondaryColumn(): GridColumn<T> | undefined {
    return this.columns.find(c => c.mobileSecondary);
  }

  getBadgeColumn(): GridColumn<T> | undefined {
    return this.columns.find(c => c.type === 'badge');
  }

  getMobileVisibleColumns(): GridColumn<T>[] {
    return this.columns.filter(c => 
      !c.mobileHidden && 
      !c.mobilePrimary && 
      !c.mobileSecondary && 
      c.type !== 'badge'
    );
  }

  getCellValue(row: T, col: GridColumn<T>): any {
    const field = col.field as string;
    return (row as any)[field];
  }

  formatCellValue(row: T, col: GridColumn<T>): string {
    const value = this.getCellValue(row, col);
    
    if (value == null) return '-';

    // Use custom valueFormatter if provided
    if (col.valueFormatter) {
      return col.valueFormatter({ value, data: row });
    }

    switch (col.type) {
      case 'currency':
        const symbol = col.currencySymbol || '₹';
        return `${symbol}${Number(value).toLocaleString('en-IN')}`;
      case 'date':
        return new Date(value).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      case 'number':
        return Number(value).toLocaleString();
      default:
        return String(value);
    }
  }

  getBadgeColor(row: T, col: GridColumn<T>): { bg: string; text: string } {
    const value = this.getCellValue(row, col);
    return this.getBadgeColorForValue(value, col.badgeColors);
  }

  trackByFn(row: T): any {
    return (row as any)[this.idField];
  }

  getStartRecord(): number {
    const pag = this.pagination();
    if (!pag) return 0;
    return (pag.page - 1) * pag.limit + 1;
  }

  getEndRecord(): number {
    const pag = this.pagination();
    if (!pag) return 0;
    return Math.min(pag.page * pag.limit, pag.total);
  }

  getMobilePaginationText(): string {
    const pag = this.pagination();
    if (!pag) return '';
    return `${this.getStartRecord()}-${this.getEndRecord()} of ${pag.total}`;
  }

  getVisiblePageNumbers(): number[] {
    const pag = this.pagination();
    if (!pag) return [];

    const current = pag.page;
    const total = pag.totalPages;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1); // Ellipsis
      }

      pages.push(total);
    }

    return pages;
  }
}
