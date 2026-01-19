import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    /* ========================================
       MOBILE-FIRST NAVBAR STYLES
       ======================================== */
    
    /* Base navbar */
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      transition: box-shadow 0.3s ease;
    }
    
    .navbar.scrolled {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    
    .navbar-container {
      padding: 0 1rem;
    }
    
    .navbar-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    
    /* Logo styling */
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      text-decoration: none;
      z-index: 60;
    }
    
    .navbar-logo-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      line-height: 1.2;
    }
    
    .navbar-logo-primary {
      color: #6366f1;
    }
    
    .navbar-logo-dark {
      color: #080b17;
    }
    
    /* Desktop nav tabs - hidden on mobile */
    .nav-tabs {
      display: none;
      align-items: center;
      gap: 0;
      background-color: #f3f4f6;
      border-radius: 999px;
      padding: 4px;
    }
    
    .nav-tab {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 999px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .nav-tab:hover {
      background-color: rgba(99, 102, 241, 0.12);
    }
    
    .nav-tab:hover .nav-tab-text {
      color: #6366f1;
    }
    
    .nav-tab.active {
      background-color: #6366f1;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }
    
    .nav-tab.active .nav-tab-text {
      color: #ffffff;
    }
    
    .nav-tab-text {
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      letter-spacing: 0.3px;
      line-height: 1;
      color: #374151;
      margin: 0;
      font-size: 14px;
      transition: color 0.25s ease;
    }
    
    /* Right side actions */
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    /* Hamburger menu button */
    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 10px;
      transition: background-color 0.2s ease;
    }
    
    .hamburger-btn:hover {
      background: #f3f4f6;
    }
    
    .hamburger-btn:active {
      background: #e5e7eb;
    }
    
    .hamburger-icon {
      width: 20px;
      height: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    
    .hamburger-line {
      width: 100%;
      height: 2px;
      background: #374151;
      border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
    }
    
    .hamburger-btn.active .hamburger-line:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }
    
    .hamburger-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    
    .hamburger-btn.active .hamburger-line:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }
    
    /* Auth buttons */
    .btn-nav-secondary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: none;
    }
    
    .btn-nav-secondary:hover {
      color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
    }
    
    .btn-nav-primary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #ffffff;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
    }
    
    .btn-nav-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }
    
    .btn-nav-primary:active {
      transform: translateY(0);
    }
    
    /* Profile section */
    .profile-container {
      position: relative;
    }
    
    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 4px;
      border-radius: 9999px;
      border: 2px solid transparent;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .profile-btn:hover {
      background: #f3f4f6;
    }
    
    .profile-btn.active {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
    }
    
    .profile-avatar {
      width: 34px;
      height: 34px;
      border-radius: 9999px;
      object-fit: cover;
    }
    
    .profile-avatar-placeholder {
      width: 34px;
      height: 34px;
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
    
    /* Dropdown overlay for click outside */
    .dropdown-overlay {
      position: fixed;
      inset: 0;
      z-index: 40;
    }
    
    /* Dropdown menu */
    .dropdown-menu {
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      width: 200px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
      padding: 6px;
      z-index: 50;
      animation: dropdown-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      transform-origin: top right;
    }
    
    @keyframes dropdown-enter {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #374151;
      text-decoration: none;
      background: none;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    
    .dropdown-item:hover {
      background: #f3f4f6;
      color: #111827;
    }
    
    .dropdown-item:active {
      background: #e5e7eb;
    }
    
    .dropdown-item svg {
      width: 18px;
      height: 18px;
      color: #6b7280;
      flex-shrink: 0;
    }
    
    .dropdown-item:hover svg {
      color: #6366f1;
    }
    
    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 6px 0;
    }
    
    .dropdown-item.danger {
      color: #dc2626;
    }
    
    .dropdown-item.danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }
    
    .dropdown-item.danger svg {
      color: #dc2626;
    }
    
    /* Mobile menu overlay */
    .mobile-menu-overlay {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 45;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    
    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    /* Mobile slide-out menu */
    .mobile-menu {
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      max-width: 85vw;
      background: white;
      z-index: 55;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
      overflow-y: auto;
    }
    
    .mobile-menu.active {
      transform: translateX(0);
    }
    
    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .mobile-menu-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: #f3f4f6;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .mobile-menu-close:hover {
      background: #e5e7eb;
    }
    
    .mobile-menu-close svg {
      width: 20px;
      height: 20px;
      color: #374151;
    }
    
    /* Mobile user info */
    .mobile-user-info {
      padding: 1.25rem 1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e5e7eb;
    }
    
    .mobile-user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 9999px;
      object-fit: cover;
      margin-bottom: 0.75rem;
    }
    
    .mobile-user-avatar-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'DM Sans', sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    
    .mobile-user-email {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      word-break: break-word;
    }
    
    /* Mobile nav links */
    .mobile-nav {
      padding: 0.75rem 0.5rem;
    }
    
    .mobile-nav-section {
      margin-bottom: 0.5rem;
    }
    
    .mobile-nav-section-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #9ca3af;
      padding: 0.5rem 0.75rem;
      margin: 0;
    }
    
    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
      border-radius: 10px;
      margin: 2px 0;
      transition: all 0.2s ease;
    }
    
    .mobile-nav-link:hover,
    .mobile-nav-link:active {
      background: #f3f4f6;
      color: #111827;
    }
    
    .mobile-nav-link.active {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }
    
    .mobile-nav-link.active svg {
      color: white;
    }
    
    .mobile-nav-link svg {
      width: 20px;
      height: 20px;
      color: #6b7280;
      flex-shrink: 0;
    }
    
    .mobile-nav-link:hover svg {
      color: #6366f1;
    }
    
    .mobile-nav-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.75rem 0.5rem;
    }
    
    .mobile-nav-link.danger {
      color: #dc2626;
    }
    
    .mobile-nav-link.danger:hover {
      background: #fef2f2;
    }
    
    .mobile-nav-link.danger svg {
      color: #dc2626;
    }
    
    /* Mobile auth buttons */
    .mobile-auth-section {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .mobile-auth-btn-primary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #ffffff;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
      text-align: center;
    }
    
    .mobile-auth-btn-primary:hover {
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    
    .mobile-auth-btn-secondary {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
      padding: 0.875rem 1.5rem;
      background: #f3f4f6;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    
    .mobile-auth-btn-secondary:hover {
      background: #e5e7eb;
    }
    
    /* Skeleton loader */
    .skeleton-loader {
      width: 36px;
      height: 36px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 9999px;
    }
    
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* ========================================
       TABLET BREAKPOINT (640px+)
       ======================================== */
    @media (min-width: 640px) {
      .navbar-container {
        padding: 0 1.5rem;
      }
      
      .navbar-inner {
        height: 64px;
      }
      
      .navbar-logo-text {
        font-size: 1.4rem;
      }
      
      .btn-nav-secondary {
        display: block;
      }
      
      .btn-nav-primary {
        padding: 0.5rem 1.25rem;
      }
      
      .mobile-menu {
        width: 320px;
      }
    }
    
    /* ========================================
       DESKTOP BREAKPOINT (1024px+)
       ======================================== */
    @media (min-width: 1024px) {
      .navbar-container {
        padding: 0 2rem;
      }
      
      .navbar-inner {
        height: 72px;
      }
      
      .navbar-logo-text {
        font-size: 1.5rem;
      }
      
      /* Show desktop nav, hide hamburger */
      .nav-tabs {
        display: flex;
      }
      
      .hamburger-btn {
        display: none;
      }
      
      .mobile-menu,
      .mobile-menu-overlay {
        display: none !important;
      }
      
      /* Desktop buttons */
      .btn-nav-secondary {
        padding: 0.625rem 1.25rem;
        font-size: 0.9375rem;
      }
      
      .btn-nav-primary {
        padding: 0.625rem 1.5rem;
        font-size: 0.9375rem;
      }
      
      .profile-avatar,
      .profile-avatar-placeholder {
        width: 38px;
        height: 38px;
      }
    }
  `],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()">
      <div class="navbar-container">
        <div class="navbar-inner">
          <!-- Logo -->
          <a routerLink="/" class="navbar-logo" (click)="closeAllMenus()">
            <span class="navbar-logo-text navbar-logo-primary">Stores</span>
            <span class="navbar-logo-text navbar-logo-dark">Craft</span>
          </a>

          <!-- Desktop Pill-style Tab Navigation -->
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

          <!-- Right Side Actions -->
          <div class="navbar-actions">
            @if (auth.isLoaded()) {
              @if (auth.isSignedIn()) {
                <!-- Desktop Profile Dropdown -->
                <div class="profile-container">
                  <button 
                    (click)="toggleProfileMenu($event)" 
                    class="profile-btn"
                    [class.active]="profileMenuOpen()">
                    @if (auth.user()?.avatarUrl) {
                      <img [src]="auth.user()?.avatarUrl" alt="Profile" class="profile-avatar">
                    } @else {
                      <div class="profile-avatar-placeholder">
                        {{ (auth.user()?.email?.charAt(0) || 'U').toUpperCase() }}
                      </div>
                    }
                  </button>
                  
                  @if (profileMenuOpen()) {
                    <div class="dropdown-overlay" (click)="closeProfileMenu()"></div>
                    <div class="dropdown-menu">
                      <a routerLink="/settings" class="dropdown-item" (click)="closeProfileMenu()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Settings
                      </a>
                      <a routerLink="/orders" class="dropdown-item" (click)="closeProfileMenu()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        Orders
                      </a>
                      @if (!auth.isCreator()) {
                        <a routerLink="/become-creator" class="dropdown-item" (click)="closeProfileMenu()">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                          </svg>
                          Become a Creator
                        </a>
                      }
                      <div class="dropdown-divider"></div>
                      <button (click)="signOut()" class="dropdown-item danger">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <button (click)="signIn()" class="btn-nav-secondary">Log in</button>
                <button (click)="signUp()" class="btn-nav-primary">Get Started</button>
              }
              
              <!-- Hamburger Menu Button (Mobile) -->
              <button 
                class="hamburger-btn" 
                [class.active]="mobileMenuOpen()"
                (click)="toggleMobileMenu()">
                <div class="hamburger-icon">
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                  <span class="hamburger-line"></span>
                </div>
              </button>
            } @else {
              <div class="skeleton-loader"></div>
            }
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Mobile Menu Overlay -->
    <div 
      class="mobile-menu-overlay" 
      [class.active]="mobileMenuOpen()"
      (click)="closeMobileMenu()">
    </div>
    
    <!-- Mobile Slide-out Menu -->
    <div class="mobile-menu" [class.active]="mobileMenuOpen()">
      <div class="mobile-menu-header">
        <a routerLink="/" class="navbar-logo" (click)="closeMobileMenu()">
          <span class="navbar-logo-text navbar-logo-primary">Stores</span>
          <span class="navbar-logo-text navbar-logo-dark">Craft</span>
        </a>
        <button class="mobile-menu-close" (click)="closeMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      @if (auth.isSignedIn()) {
        <!-- User Info Section -->
        <div class="mobile-user-info">
          @if (auth.user()?.avatarUrl) {
            <img [src]="auth.user()?.avatarUrl" alt="Profile" class="mobile-user-avatar">
          } @else {
            <div class="mobile-user-avatar-placeholder">
              {{ (auth.user()?.email?.charAt(0) || 'U').toUpperCase() }}
            </div>
          }
          <p class="mobile-user-email">{{ auth.user()?.email }}</p>
        </div>
      }
      
      <div class="mobile-nav">
        <!-- Navigation Section -->
        <div class="mobile-nav-section">
          <p class="mobile-nav-section-title">Navigation</p>
          <a routerLink="/explore" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Explore
          </a>
          @if (auth.isSignedIn()) {
            <a routerLink="/library" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
              </svg>
              Library
            </a>
            @if (auth.isCreator()) {
              <a routerLink="/dashboard" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                Dashboard
              </a>
            }
          }
        </div>
        
        @if (auth.isSignedIn()) {
          <div class="mobile-nav-divider"></div>
          
          <!-- Account Section -->
          <div class="mobile-nav-section">
            <p class="mobile-nav-section-title">Account</p>
            <a routerLink="/settings" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Settings
            </a>
            <a routerLink="/orders" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Orders
            </a>
            @if (!auth.isCreator()) {
              <a routerLink="/become-creator" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                Become a Creator
              </a>
            }
          </div>
          
          <div class="mobile-nav-divider"></div>
          
          <button (click)="signOut()" class="mobile-nav-link danger">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        } @else {
          <div class="mobile-auth-section">
            <button (click)="signUpMobile()" class="mobile-auth-btn-primary">Get Started Free</button>
            <button (click)="signInMobile()" class="mobile-auth-btn-secondary">Log in</button>
          </div>
        }
      </div>
    </div>
  `,
})
export class NavbarComponent {
  profileMenuOpen = signal(false);
  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  constructor(
    public auth: AuthService,
    private elementRef: ElementRef
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeAllMenus();
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.profileMenuOpen.update(v => !v);
  }

  closeProfileMenu() {
    this.profileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
    // Prevent body scroll when mobile menu is open
    if (this.mobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  closeAllMenus() {
    this.closeProfileMenu();
    this.closeMobileMenu();
  }

  async signIn() {
    await this.auth.signIn();
  }

  async signUp() {
    await this.auth.signUp();
  }

  async signInMobile() {
    this.closeMobileMenu();
    await this.auth.signIn();
  }

  async signUpMobile() {
    this.closeMobileMenu();
    await this.auth.signUp();
  }

  async signOut() {
    this.closeAllMenus();
    await this.auth.signOut();
  }
}
