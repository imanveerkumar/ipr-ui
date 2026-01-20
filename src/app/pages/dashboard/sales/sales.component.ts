import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

interface Sale {
  id: string;
  productTitle: string;
  storeName: string;
  customerEmail: string;
  amount: number;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-gray-900">Sales</h1>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Sales</p>
            <p class="text-3xl font-bold text-gray-900">{{ sales().length }}</p>
          </div>
          <div class="card p-6">
            <p class="text-sm text-gray-500">Total Revenue</p>
            <p class="text-3xl font-bold text-green-600">₹{{ totalRevenue() }}</p>
          </div>
          <div class="card p-6">
            <p class="text-sm text-gray-500">This Month</p>
            <p class="text-3xl font-bold text-primary-600">₹{{ monthlyRevenue() }}</p>
          </div>
        </div>

        <!-- Sales Table -->
        <div class="card overflow-hidden">
          <div class="p-6 border-b">
            <h2 class="text-lg font-semibold text-gray-900">Recent Sales</h2>
          </div>
          
          @if (loading()) {
            <div class="p-12 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          } @else if (sales().length === 0) {
            <div class="p-12 text-center text-gray-500">
              <p>No sales yet. Keep promoting your products!</p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  @for (sale of sales(); track sale.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sale.productTitle }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.storeName }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.customerEmail }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{{ sale.amount / 100 }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 text-xs rounded-full"
                          [class]="sale.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                        >
                          {{ sale.status }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.createdAt | date:'short' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SalesComponent implements OnInit {
  sales = signal<Sale[]>([]);
  loading = signal(true);
  totalRevenue = signal(0);
  monthlyRevenue = signal(0);

  constructor(private api: ApiService) {}

  async ngOnInit() {
    try {
      const response = await this.api.get<Sale[]>('/orders/sales');
      const salesData: Sale[] = response.data || [];
      this.sales.set(salesData);

      // Calculate totals (include both PAID and FULFILLED)
      const total = salesData
        .filter((s: Sale) => s.status === 'PAID' || s.status === 'FULFILLED')
        .reduce((sum: number, s: Sale) => sum + s.amount, 0);
      this.totalRevenue.set(total / 100);

      // Calculate monthly
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthly = salesData
        .filter((s: Sale) => (s.status === 'PAID' || s.status === 'FULFILLED') && new Date(s.createdAt) >= startOfMonth)
        .reduce((sum: number, s: Sale) => sum + s.amount, 0);
      this.monthlyRevenue.set(monthly / 100);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
