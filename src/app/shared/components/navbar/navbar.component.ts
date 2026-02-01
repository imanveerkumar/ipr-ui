import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    :host{display:block}
    .promo-banner{background:linear-gradient(135deg,#1a1a2e,#16213e);color:#fff;text-align:center;padding:10px 1rem;font-size:.8125rem;letter-spacing:.3px;position:relative;overflow:hidden}
    .promo-banner::before{content:'';position:absolute;top:0;left:-100%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent);animation:shimmer-banner 8s infinite}
    @keyframes shimmer-banner{0%{transform:translateX(-50%)}100%{transform:translateX(50%)}}
    .promo-text{position:relative;z-index:1}
    .promo-highlight{color:#a78bfa;font-weight:600}
    .promo-link{color:#c4b5fd;text-decoration:none;font-weight:500;margin-left:8px;transition:color .2s}
    .promo-link:hover{color:#fff;text-decoration:underline}
    .promo-close{position:absolute;right:1rem;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:all .2s}
    .promo-close:hover{color:#fff;background:rgba(255,255,255,.1)}
    .promo-close svg{width:16px;height:16px}
    .header{position:sticky;top:0;z-index:50;background:#fff;transition:all .3s}
    .header.scrolled{box-shadow:0 2px 20px rgba(0,0,0,.08)}
    .header-main{border-bottom:1px solid #f0f0f0}
    .header-container{max-width:1400px;margin:0 auto;padding:0 1.5rem}
    .header-inner{display:flex;align-items:center;justify-content:space-between;height:72px;gap:2rem}
    .logo-section{display:flex;align-items:center;gap:3rem;flex-shrink:0}
    .logo{display:flex;align-items:center;gap:.5rem;text-decoration:none}
    .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(99,102,241,.3)}
    .logo-icon svg{width:20px;height:20px;color:#fff}
    .logo-text{font-size:1.375rem;font-weight:700;letter-spacing:-.5px}
    .logo-primary{color:#1a1a2e}
    .logo-accent{color:#6366f1}
    .nav-desktop{display:none;align-items:center;gap:.5rem}
    .nav-link{position:relative;display:flex;align-items:center;gap:6px;padding:10px 16px;font-size:.9375rem;font-weight:500;color:#4b5563;text-decoration:none;border-radius:8px;transition:all .2s}
    .nav-link:hover{color:#1a1a2e;background:#f8f9fa}
    .nav-link.active{color:#6366f1;background:rgba(99,102,241,.08)}
    .nav-link.active::after{content:'';position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);width:20px;height:2px;background:#6366f1;border-radius:2px}
    .search-section{flex:1;max-width:480px;display:none}
    .search-container{position:relative;width:100%}
    .search-input{width:100%;padding:12px 16px 12px 44px;font-size:.9375rem;color:#1a1a2e;background:#f8f9fa;border:2px solid transparent;border-radius:12px;outline:none;transition:all .25s}
    .search-input::placeholder{color:#9ca3af}
    .search-input:hover{background:#f3f4f6}
    .search-input:focus{background:#fff;border-color:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,.1)}
    .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:20px;height:20px;color:#9ca3af;pointer-events:none;transition:color .2s}
    .search-input:focus~.search-icon{color:#6366f1}
    .search-shortcut{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:none;align-items:center;gap:4px;padding:4px 8px;background:#e5e7eb;border-radius:6px;font-size:.75rem;color:#6b7280;pointer-events:none}
    .actions-section{display:flex;align-items:center;gap:.5rem}
    .icon-btn{position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:transparent;border:none;border-radius:12px;cursor:pointer;color:#4b5563;transition:all .2s;text-decoration:none}
    .icon-btn:hover{background:#f8f9fa;color:#1a1a2e}
    .icon-btn svg{width:22px;height:22px}
    .icon-btn-badge{position:absolute;top:6px;right:6px;min-width:18px;height:18px;padding:0 5px;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:.6875rem;font-weight:600;border-radius:9px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(239,68,68,.3)}
    .header-divider{width:1px;height:28px;background:#e5e7eb;margin:0 .5rem;display:none}
    .auth-buttons{display:none;align-items:center;gap:.75rem}
    .btn-login{font-size:.9375rem;font-weight:500;color:#4b5563;padding:10px 20px;background:transparent;border:none;border-radius:10px;cursor:pointer;transition:all .2s}
    .btn-login:hover{color:#1a1a2e;background:#f8f9fa}
    .btn-signup{font-size:.9375rem;font-weight:600;color:#fff;padding:10px 24px;background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;border-radius:10px;cursor:pointer;transition:all .25s;box-shadow:0 4px 12px rgba(99,102,241,.25)}
    .btn-signup:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.35)}
    .btn-signup:active{transform:translateY(0)}
    .profile-container{position:relative}
    .profile-btn{display:flex;align-items:center;gap:10px;padding:6px 12px 6px 6px;background:#f8f9fa;border:2px solid transparent;border-radius:50px;cursor:pointer;transition:all .2s}
    .profile-btn:hover{background:#f3f4f6;border-color:#e5e7eb}
    .profile-btn.active{border-color:#6366f1;background:rgba(99,102,241,.08)}
    .profile-avatar,.profile-avatar-placeholder{width:32px;height:32px;border-radius:50%}
    .profile-avatar{object-fit:cover}
    .profile-avatar-placeholder{background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.875rem;font-weight:600}
    .profile-info{display:none;flex-direction:column;align-items:flex-start;line-height:1.2}
    .profile-greeting{font-size:.6875rem;color:#9ca3af}
    .profile-name{font-size:.875rem;font-weight:600;color:#1a1a2e}
    .profile-chevron{width:16px;height:16px;color:#9ca3af;transition:transform .2s}
    .profile-btn.active .profile-chevron{transform:rotate(180deg)}
    .mobile-search-btn{display:flex}
    .hamburger-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:none;background:transparent;cursor:pointer;border-radius:12px;transition:all .2s}
    .hamburger-btn:hover{background:#f8f9fa}
    .hamburger-icon{width:22px;height:16px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
    .hamburger-line{width:100%;height:2px;background:#1a1a2e;border-radius:2px;transition:all .3s cubic-bezier(.4,0,.2,1);transform-origin:center}
    .hamburger-btn.active .hamburger-line:nth-child(1){transform:translateY(7px) rotate(45deg)}
    .hamburger-btn.active .hamburger-line:nth-child(2){opacity:0;transform:scaleX(0)}
    .hamburger-btn.active .hamburger-line:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
    .dropdown-overlay{position:fixed;inset:0;z-index:40}
    .dropdown-menu{position:absolute;right:0;top:calc(100% + 8px);width:240px;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.05);padding:8px;z-index:50;animation:dropdown-enter .25s cubic-bezier(.16,1,.3,1);transform-origin:top right}
    @keyframes dropdown-enter{from{opacity:0;transform:scale(.95) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .dropdown-header{padding:12px;border-bottom:1px solid #f0f0f0;margin-bottom:8px}
    .dropdown-user-email{font-size:.8125rem;color:#6b7280;margin:0;word-break:break-word}
    .dropdown-item{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;font-size:.9375rem;font-weight:500;color:#374151;text-decoration:none;background:none;border:none;border-radius:10px;cursor:pointer;transition:all .15s}
    .dropdown-item:hover{background:#f8f9fa;color:#1a1a2e}
    .dropdown-item svg{width:20px;height:20px;color:#9ca3af;flex-shrink:0;transition:color .15s}
    .dropdown-item:hover svg{color:#6366f1}
    .dropdown-divider{height:1px;background:#f0f0f0;margin:8px 0}
    .dropdown-item.danger{color:#dc2626}
    .dropdown-item.danger:hover{background:#fef2f2}
    .dropdown-item.danger svg{color:#dc2626}
    .mobile-menu-overlay{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:45;opacity:0;visibility:hidden;transition:all .3s;backdrop-filter:blur(4px)}
    .mobile-menu-overlay.active{opacity:1;visibility:visible}
    .mobile-menu{display:block;position:fixed;top:0;right:0;bottom:0;width:320px;max-width:90vw;background:#fff;z-index:55;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);box-shadow:-10px 0 40px rgba(0,0,0,.1);overflow-y:auto}
    .mobile-menu.active{transform:translateX(0)}
    .mobile-menu-header{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #f0f0f0}
    .mobile-menu-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:#f8f9fa;border-radius:12px;cursor:pointer;transition:all .2s}
    .mobile-menu-close:hover{background:#f3f4f6}
    .mobile-menu-close svg{width:20px;height:20px;color:#4b5563}
    .mobile-search{padding:1rem 1.5rem;border-bottom:1px solid #f0f0f0}
    .mobile-search-input{width:100%;padding:14px 16px 14px 44px;font-size:1rem;color:#1a1a2e;background:#f8f9fa;border:2px solid transparent;border-radius:12px;outline:none;transition:all .2s}
    .mobile-search-input:focus{background:#fff;border-color:#6366f1}
    .mobile-search-container{position:relative}
    .mobile-search-container .search-icon{left:14px}
    .mobile-user-info{padding:1.5rem;background:linear-gradient(135deg,#f8f9fa,#f3f4f6);border-bottom:1px solid #f0f0f0;display:flex;align-items:center;gap:1rem}
    .mobile-user-avatar{width:52px;height:52px;border-radius:50%;object-fit:cover}
    .mobile-user-avatar-placeholder{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.25rem;font-weight:600;flex-shrink:0}
    .mobile-user-details{flex:1;min-width:0}
    .mobile-user-greeting{font-size:.8125rem;color:#9ca3af;margin:0 0 4px}
    .mobile-user-email{font-size:.9375rem;font-weight:500;color:#1a1a2e;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mobile-nav{padding:1rem}
    .mobile-nav-section{margin-bottom:1rem}
    .mobile-nav-section-title{font-size:.6875rem;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:#9ca3af;padding:.75rem 1rem;margin:0}
    .mobile-nav-link{display:flex;align-items:center;gap:14px;padding:14px 16px;text-decoration:none;font-size:1rem;font-weight:500;color:#374151;border-radius:12px;margin:4px 0;transition:all .2s;background:none;border:none;width:100%;text-align:left;cursor:pointer}
    .mobile-nav-link:hover,.mobile-nav-link:active{background:#f8f9fa;color:#1a1a2e}
    .mobile-nav-link.active{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;box-shadow:0 4px 12px rgba(99,102,241,.3)}
    .mobile-nav-link.active svg{color:#fff}
    .mobile-nav-link svg{width:22px;height:22px;color:#9ca3af;flex-shrink:0;transition:color .2s}
    .mobile-nav-link:hover svg{color:#6366f1}
    .mobile-nav-divider{height:1px;background:#f0f0f0;margin:1rem .5rem}
    .mobile-nav-link.danger{color:#dc2626}
    .mobile-nav-link.danger:hover{background:#fef2f2}
    .mobile-nav-link.danger svg{color:#dc2626}
    .mobile-auth-section{padding:1.5rem;display:flex;flex-direction:column;gap:.875rem;border-top:1px solid #f0f0f0;margin-top:auto}
    .mobile-auth-btn-primary{font-size:1rem;font-weight:600;color:#fff;padding:1rem 1.5rem;background:linear-gradient(135deg,#6366f1,#4f46e5);border:none;border-radius:14px;cursor:pointer;transition:all .25s;box-shadow:0 4px 12px rgba(99,102,241,.3);text-align:center}
    .mobile-auth-btn-primary:hover{box-shadow:0 6px 20px rgba(99,102,241,.4)}
    .mobile-auth-btn-secondary{font-size:1rem;font-weight:500;color:#374151;padding:1rem 1.5rem;background:#f8f9fa;border:none;border-radius:14px;cursor:pointer;transition:all .2s;text-align:center}
    .mobile-auth-btn-secondary:hover{background:#f3f4f6}
    .skeleton-loader{width:40px;height:40px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:50%}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @media(min-width:640px){
      .header-container{padding:0 2rem}
      .auth-buttons,.search-section,.header-divider,.profile-info{display:flex}
      .mobile-search-btn{display:none}
      .mobile-menu{width:360px}
    }
    @media(min-width:1024px){
      .header-inner{height:76px}
      .nav-desktop,.search-shortcut{display:flex}
      .hamburger-btn,.mobile-menu,.mobile-menu-overlay{display:none!important}
      .search-section{max-width:400px}
    }
    @media(min-width:1280px){
      .header-container{padding:0 3rem}
      .search-section{max-width:480px}
      .logo-section{gap:4rem}
    }
  `],
  template: `
    <!-- Promo Banner -->
    @if (showPromoBanner()) {
      <div class="promo-banner">
        <span class="promo-text">
          🎉 <span class="promo-highlight">New Year Sale!</span> Get 30% off on premium products
          <a routerLink="/explore" class="promo-link">Shop Now →</a>
        </span>
        <button class="promo-close" (click)="closePromoBanner()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    }
    
    <!-- Main Header -->
    <header class="header" [class.scrolled]="isScrolled()">
      <div class="header-main">
        <div class="header-container">
          <div class="header-inner">
            <!-- Logo & Navigation Section -->
            <div class="logo-section">
              <!-- Logo -->
              <a routerLink="/" class="logo" (click)="closeAllMenus()">
                <div class="logo-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                </div>
                <span class="logo-text">
                  <span class="logo-primary">Stores</span><span class="logo-accent">Craft</span>
                </span>
              </a>
              
              <!-- Desktop Navigation -->
              <nav class="nav-desktop">
                <a routerLink="/explore" routerLinkActive="active" class="nav-link">
                  Explore
                </a>
                @if (auth.isSignedIn()) {
                  <a routerLink="/library" routerLinkActive="active" class="nav-link">
                    Library
                  </a>
                  @if (auth.isCreator()) {
                    <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
                      Dashboard
                    </a>
                  }
                }
              </nav>
            </div>
            
            <!-- Search Section -->
            <div class="search-section">
              <div class="search-container">
                <input 
                  type="text" 
                  class="search-input" 
                  placeholder="Search products, creators..."
                >
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <span class="search-shortcut">⌘K</span>
              </div>
            </div>
            
            <!-- Actions Section -->
            <div class="actions-section">
              <!-- Mobile Search Button -->
              <button class="icon-btn mobile-search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
              
              @if (auth.isLoaded()) {
                @if (auth.isSignedIn()) {
                  <!-- Favorites -->
                  <a class="icon-btn" routerLink="/library">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </a>
                  
                  <!-- Cart -->
                  <button class="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span class="icon-btn-badge">3</span>
                  </button>
                  
                  <div class="header-divider"></div>
                  
                  <!-- Profile -->
                  <div class="profile-container">
                    <button 
                      (click)="toggleProfileMenu($event)" 
                      class="profile-btn"
                      [class.active]="profileMenuOpen()">
                      @if (auth.user()?.avatarUrl) {
                        <img [src]="auth.user()?.avatarUrl" alt="Profile" class="profile-avatar">
                      } @else {
                        <div class="profile-avatar-placeholder">
                          {{ getUserInitial() }}
                        </div>
                      }
                      <div class="profile-info">
                        <span class="profile-greeting">Welcome back</span>
                        <span class="profile-name">{{ getUserName() }}</span>
                      </div>
                      <svg class="profile-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    
                    @if (profileMenuOpen()) {
                      <div class="dropdown-overlay" (click)="closeProfileMenu()"></div>
                      <div class="dropdown-menu">
                        <div class="dropdown-header">
                          <p class="dropdown-user-email">{{ auth.user()?.email }}</p>
                        </div>
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
                  <div class="auth-buttons">
                    <button (click)="signIn()" class="btn-login">Log in</button>
                    <button (click)="signUp()" class="btn-signup">Get Started</button>
                  </div>
                }
                
                <!-- Hamburger Menu (Mobile) -->
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
      </div>
    </header>
    
    <!-- Mobile Menu Overlay -->
    <div 
      class="mobile-menu-overlay" 
      [class.active]="mobileMenuOpen()"
      (click)="closeMobileMenu()">
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" [class.active]="mobileMenuOpen()">
      <div class="mobile-menu-header">
        <a routerLink="/" class="logo" (click)="closeMobileMenu()">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <span class="logo-text">
            <span class="logo-primary">Stores</span><span class="logo-accent">Craft</span>
          </span>
        </a>
        <button class="mobile-menu-close" (click)="closeMobileMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Search -->
      <div class="mobile-search">
        <div class="mobile-search-container">
          <input 
            type="text" 
            class="mobile-search-input" 
            placeholder="Search products..."
          >
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      
      @if (auth.isSignedIn()) {
        <!-- User Info -->
        <div class="mobile-user-info">
          @if (auth.user()?.avatarUrl) {
            <img [src]="auth.user()?.avatarUrl" alt="Profile" class="mobile-user-avatar">
          } @else {
            <div class="mobile-user-avatar-placeholder">
              {{ getUserInitial() }}
            </div>
          }
          <div class="mobile-user-details">
            <p class="mobile-user-greeting">Welcome back! 👋</p>
            <p class="mobile-user-email">{{ auth.user()?.email }}</p>
          </div>
        </div>
      }
      
      <div class="mobile-nav">
        <!-- Navigation Section -->
        <div class="mobile-nav-section">
          <p class="mobile-nav-section-title">Browse</p>
          <a routerLink="/explore" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Explore
          </a>
          @if (auth.isSignedIn()) {
            <a routerLink="/library" routerLinkActive="active" class="mobile-nav-link" (click)="closeMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              My Library
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
  showPromoBanner = signal(true);

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

  getUserInitial(): string {
    const email = this.auth.user()?.email;
    return email ? email.charAt(0).toUpperCase() : 'U';
  }

  getUserName(): string {
    const email = this.auth.user()?.email;
    return email ? email.split('@')[0] : 'User';
  }

  closePromoBanner() {
    this.showPromoBanner.set(false);
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
