import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../core/models/index';
import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-8">Order History</h1>

        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1, 2]; track i) {
              <div class="card p-6 animate-pulse">
                <div class="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else if (orders().length === 0) {
          <div class="card p-12 text-center">
            <p class="text-gray-600">No orders yet.</p>
            <a routerLink="/" class="btn-primary mt-4 inline-block">Start Shopping</a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (order of orders(); track order.id) {
              <div class="card p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="text-sm text-gray-500">Order #{{ order.id.slice(0, 8) }}</p>
                    <p class="text-sm text-gray-500">{{ order.createdAt | date:'medium' }}</p>
                  </div>
                  <span 
                    class="px-3 py-1 text-sm rounded-full"
                    [class]="getStatusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </div>

                <div class="border-t pt-4">
                  @for (item of order.items; track item.id) {
                    <div class="flex justify-between py-2">
                      <span>{{ item.titleSnapshot }}</span>
                      <span class="font-medium">₹{{ item.priceAtPurchase / 100 }}</span>
                    </div>
                  }
                  <div class="flex justify-between pt-2 border-t mt-2 font-bold">
                    <span>Total</span>
                    <span>₹{{ order.totalAmount / 100 }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private checkoutService: CheckoutService) {}

  async ngOnInit() {
    const orders = await this.checkoutService.getMyOrders();
    this.orders.set(orders);
    this.loading.set(false);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAID':
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
