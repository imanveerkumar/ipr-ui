import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    /* Navbar container */
    .navbar-container {
      padding: 0 2rem;
    }
    
    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }
    
    /* Logo styling - side by side */
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      text-decoration: none;
    }
    
    .navbar-logo-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.2;
    }
    
    .navbar-logo-primary {
      color: #6366f1;
    }
    
    .navbar-logo-dark {
      color: #080b17;
    }
    
    /* Pill-style tab navigation */
    .nav-tabs {
      display: flex;
      align-items: center;
      gap: 0;
      background-color: rgb(240, 241, 242);
      border-radius: 999px;
      opacity: 0.9;
      padding: 4px;
    }
    
    .nav-tab {
      display: flex;
      align-items: center;
      padding: 8px 18px;
      text-decoration: none;
      border-radius: 999px;
      transition: all 0.2s ease;
    }
    
    .nav-tab:hover {
      background-color: rgba(99, 102, 241, 0.15);
    }
    
    .nav-tab:hover .nav-tab-text {
      color: #6366f1;
    }
    
    .nav-tab.active {
      background-color: #6366f1;
    }
    
    .nav-tab.active .nav-tab-text {
      color: #ffffff;
    }
    
    .nav-tab-text {
      font-family: 'Hind Madurai', 'DM Sans', sans-serif;
      font-weight: 500;
      letter-spacing: 0.5px;
      line-height: 21px;
      color: rgb(8, 11, 23);
      margin: 0;
      font-size: 14px;
      transition: color 0.2s ease;
    }
    
    /* Auth actions */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .btn-nav-secondary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #080b17;
      padding: 0.625rem 1.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .btn-nav-secondary:hover {
      color: #6366f1;
    }
    
    .btn-nav-primary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #ffffff;
      padding: 0.625rem 1.5rem;
      background: #080b17;
      border: none;
      border-radius: 999px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    
    .btn-nav-primary:hover {
      background: #1f2937;
      transform: translateY(-1px);
    }
    
    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem;
      border-radius: 9999px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .profile-btn:hover {
      background: #f3f4f6;
    }
    
    .profile-avatar {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 9999px;
      object-fit: cover;
    }
    
    .profile-avatar-placeholder {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 9999px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 0.5rem;
      width: 12rem;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      padding: 0.5rem 0;
      animation: dropdown-enter 0.15s ease-out;
    }
    
    @keyframes dropdown-enter {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.625rem 1rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #374151;
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    
    .dropdown-item:hover {
      background: #f9fafb;
      color: #080b17;
    }
    
    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }
    
    .skeleton-loader {
      width: 6rem;
      height: 2.25rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 9999px;
    }
    
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    @media (max-width: 768px) {
      .nav-tabs {
        display: none;
      }
      
      .navbar-container {
        padding: 0 1rem;
      }
    }
  `],
  template: `
    <nav class="bg-white sticky top-0 z-50" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
      <div class="navbar-container">
        <div class="navbar-inner">
          <!-- Logo -->
          <a routerLink="/" class="navbar-logo">
            <span class="navbar-logo-text navbar-logo-primary">Stores</span>
            <span class="navbar-logo-text navbar-logo-dark">Craft</span>
          </a>

          <!-- Pill-style Tab Navigation -->
          <div class="nav-tabs">
            <a routerLink="/explore" routerLinkActive="active" class="nav-tab">
              <p class="nav-tab-text">Explore</p>
            </a>
            @if (auth.isSignedIn()) {
              <a routerLink="/library" routerLinkActive="active" class="nav-tab">
                <p class="nav-tab-text">Library</p>
              </a>
              @if (auth.isCreator()) {
                <a routerLink="/dashboard" routerLinkActive="active" class="nav-tab">
                  <p class="nav-tab-text">Dashboard</p>
                </a>
              }
            }
          </div>

          <!-- Auth Actions -->
          <div class="navbar-actions">
            @if (auth.isLoaded()) {
              @if (auth.isSignedIn()) {
                <div class="relative">
                  <button (click)="toggleMenu()" class="profile-btn">
                    @if (auth.user()?.avatarUrl) {
                      <img [src]="auth.user()?.avatarUrl" alt="Profile" class="profile-avatar">
                    } @else {
                      <div class="profile-avatar-placeholder">
                        {{ (auth.user()?.email?.charAt(0) || 'U').toUpperCase() }}
                      </div>
                    }
                  </button>
                  
                  @if (menuOpen) {
                    <div class="dropdown-menu">
                      <a routerLink="/settings" class="dropdown-item">Settings</a>
                      <a routerLink="/orders" class="dropdown-item">Orders</a>
                      @if (!auth.isCreator()) {
                        <a routerLink="/become-creator" class="dropdown-item">Become a Creator</a>
                      }
                      <div class="dropdown-divider"></div>
                      <button (click)="signOut()" class="dropdown-item">Sign Out</button>
                    </div>
                  }
                </div>
              } @else {
                <button (click)="signIn()" class="btn-nav-secondary">Log in</button>
                <button (click)="signUp()" class="btn-nav-primary">Start free trial</button>
              }
            } @else {
              <div class="skeleton-loader"></div>
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
