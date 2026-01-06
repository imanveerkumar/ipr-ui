import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="card p-12 text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Admin Panel</h2>
          <p class="text-gray-600">Admin features coming soon...</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent {}
