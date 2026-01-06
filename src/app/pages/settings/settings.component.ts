import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl font-display font-bold text-gray-900 mb-8">Settings</h1>
        <div class="card p-6">
          <p class="text-gray-600">Settings page - Coming soon</p>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {}
