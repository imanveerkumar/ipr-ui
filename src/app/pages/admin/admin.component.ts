import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-theme-bg">
      <div class="bg-theme-surface border-b">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-display font-bold text-theme-fg">Admin Dashboard</h1>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="card p-12 text-center">
          <h2 class="text-xl font-semibold text-theme-fg mb-4">Admin Panel</h2>
          <p class="text-theme-muted">Admin features coming soon...</p>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent {}
