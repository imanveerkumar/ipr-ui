import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center gap-2">
              <span class="text-2xl font-display font-bold text-primary-600">Creator</span>
              <span class="text-2xl font-display font-bold text-gray-900">Market</span>
            </a>
          </div>

          <!-- Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" class="text-gray-600 hover:text-gray-900 transition-colors">Explore</a>
            @if (auth.isSignedIn()) {
              <a routerLink="/library" class="text-gray-600 hover:text-gray-900 transition-colors">Library</a>
              @if (auth.isCreator()) {
                <a routerLink="/dashboard" class="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
              }
            }
          </div>

          <!-- Auth -->
          <div class="flex items-center gap-4">
            @if (auth.isLoaded()) {
              @if (auth.isSignedIn()) {
                <div class="relative">
                  <button 
                    (click)="toggleMenu()"
                    class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    @if (auth.user()?.avatarUrl) {
                      <img 
                        [src]="auth.user()?.avatarUrl" 
                        alt="Profile" 
                        class="w-8 h-8 rounded-full object-cover"
                      >
                    } @else {
                      <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-primary-600">
                          {{ (auth.user()?.email?.charAt(0) || 'U').toUpperCase() }}
                        </span>
                      </div>
                    }
                  </button>
                  
                  @if (menuOpen) {
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-scale-in">
                      <a routerLink="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Settings</a>
                      <a routerLink="/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Orders</a>
                      @if (!auth.isCreator()) {
                        <a routerLink="/become-creator" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">Become a Creator</a>
                      }
                      <hr class="my-1">
                      <button 
                        (click)="signOut()" 
                        class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <button (click)="signIn()" class="btn-secondary text-sm">
                  Sign In
                </button>
                <button (click)="signUp()" class="btn-primary text-sm">
                  Get Started
                </button>
              }
            } @else {
              <div class="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  menuOpen = false;

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async signIn() {
    await this.auth.signIn();
  }

  async signUp() {
    await this.auth.signUp();
  }

  async signOut() {
    this.menuOpen = false;
    await this.auth.signOut();
  }
}
