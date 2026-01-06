import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-become-creator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-2xl mx-auto px-4">
        <div class="card p-8 text-center">
          <div class="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </div>

          <h1 class="text-3xl font-display font-bold text-gray-900 mb-4">
            Become a Creator
          </h1>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Start selling your digital products to a global audience. 
            Create stores, upload files, and earn money from your creations.
          </p>

          <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 class="font-semibold text-gray-900 mb-4">What you get:</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Create unlimited stores</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Sell unlimited products</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Secure file delivery</span>
              </li>
              <li class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>Sales analytics dashboard</span>
              </li>
            </ul>
          </div>

          <button 
            (click)="upgrade()" 
            [disabled]="loading()"
            class="btn-primary text-lg px-8 py-3"
          >
            @if (loading()) {
              Processing...
            } @else {
              Activate Creator Account
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class BecomeCreatorComponent {
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async upgrade() {
    this.loading.set(true);
    const success = await this.authService.upgradeToCreator();
    this.loading.set(false);

    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Failed to upgrade. Please try again.');
    }
  }
}
