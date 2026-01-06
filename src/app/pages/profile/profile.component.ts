import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <p class="text-center text-gray-600">Profile page - Coming soon</p>
      </div>
    </div>
  `,
})
export class ProfileComponent {}
