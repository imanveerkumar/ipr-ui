import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalLoaderService } from '../../../core/services/global-loader.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      @if (isInitialLoad()) {
        <!-- Minimal Full Page Loader for Initial App Load -->
        <div class="loader-overlay-initial" [class.fade-out]="isFadingOut()" (animationend)="onFadeOutEnd()">
          <div class="initial-loading-text">
            Loading
            <div class="dots-container">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Transparent Full-Screen Overlay for Auth Operations (Login/Logout) -->
        <div class="loader-overlay-auth" [class.fade-out]="isFadingOut()" (animationend)="onFadeOutEnd()">
          <div class="auth-loading-text">
            {{ statusText() }}
            <div class="dots-container">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    :host {
      --loader-bg-cream: #F9F4EB;
      --loader-black: #111111;
      --loader-blue: #2B57D6;
      --loader-green: #68E079;
      --loader-purple: #7C3AED;
      --loader-yellow: #FFC60B;
    }

    /* ============================================
       INITIAL LOADER (Minimal Loading Text)
       ============================================ */
    .loader-overlay-initial {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background-color: var(--loader-bg-cream);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .loader-overlay-initial.fade-out {
      animation: fade-out 0.3s ease-out forwards;
    }

    .initial-loading-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--loader-black);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (min-width: 768px) {
      .initial-loading-text {
        font-size: 36px;
        gap: 10px;
      }
    }

    /* ============================================
       AUTH LOADER (Login/Logout - Very Transparent)
       ============================================ */
    .loader-overlay-auth {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background-color: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      animation: fade-in 0.15s ease-out;
    }

    .loader-overlay-auth.fade-out {
      animation: fade-out 0.15s ease-out forwards;
    }

    .auth-loading-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--loader-black);
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.7);
      padding: 16px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      .auth-loading-text {
        font-size: 32px;
        padding: 20px 36px;
        gap: 10px;
      }
    }

    /* ============================================
       SHARED STYLES
       ============================================ */
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    /* Loading Text */
    .loader-card .loading-text {
      margin-top: 24px;
    }

    @media (min-width: 768px) {
      .loader-card .loading-text {
        margin-top: 30px;
      }
    }

    .loading-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--loader-black);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    @media (min-width: 768px) {
      .loading-text {
        font-size: 28px;
        gap: 8px;
      }
    }

    .dots-container {
      display: flex;
      gap: 4px;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: var(--loader-blue);
      border: 1.5px solid var(--loader-black);
      border-radius: 50%;
      animation: dot-pulse 1.4s infinite;
    }

    @media (min-width: 768px) {
      .dot {
        width: 8px;
        height: 8px;
        border: 2px solid var(--loader-black);
      }
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dot-pulse {
      0%, 100% { 
        transform: scale(1); 
        background: var(--loader-blue); 
      }
      50% { 
        transform: scale(1.5); 
        background: var(--loader-yellow); 
      }
    }
  `]
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {
  private loaderService = inject(GlobalLoaderService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private routerSubscription?: Subscription;

  isVisible = signal(false);
  isFadingOut = signal(false);
  statusText = signal('Loading');
  
  /** Track if this is the initial app load or auth operation */
  isInitialLoad = signal(true);

  private hideTimeout?: ReturnType<typeof setTimeout>;
  private hasCompletedFirstNavigation = false;
  private navCompleted = signal(false);

  constructor() {
    // React to service loading state changes (only for auth operations)
    effect(() => {
      const isServiceLoading = this.loaderService.isLoading();
      const serviceStatusText = this.loaderService.statusText();
      
      if (isServiceLoading) {
        // Auth operations use the transparent overlay (not initial load)
        this.showAuthLoader(serviceStatusText);
      } else {
        // Only hide if we are not waiting for initial load
        // But the service controls explicit shows/hides.
        // If service goes false, we generally hide.
        // However, if we are in initial load state, and service wasn't the one keeping it open...
        // Actually, existing code says: if serviceLoading is false -> hideLoader().
        // This might conflict with our initial load logic if serviceLoading flickers?
        // But service is for explicit calls. Initial load is implicit.
        
        // Wait, the existing code forces hideLoader() if serviceLoading becomes false.
        // If we are showing initial loader, and serviceLoading is false (default), this effect runs on init?
        // On init: serviceLoading = false. hideLoader() called.
        // But showInitialLoader() is called in ngOnInit.
        // If effect runs after ngOnInit?
        
        // The existing effect is dangerous if it runs on valid initial load.
        // Let's modify it to respect initial load state.
        
         if (!this.isInitialLoad()) {
            this.hideLoader();
         }
      }
    });

    // New effect for initial load synchronization
    effect(() => {
      // Check if we can hide the initial loader
      // Requirements:
      // 1. Initial navigation complete
      // 2. Auth service loaded
      // 3. No explicit loader service request active
      if (
        this.navCompleted() && 
        this.authService.isLoaded() && 
        !this.loaderService.isLoading()
      ) {
         if (this.isVisible() && this.isInitialLoad() && !this.isFadingOut()) {
            // Use longer delay for logged in users to allow header to settle
            const delay = this.authService.isSignedIn() ? 300 : 10;
            this.hideLoaderWithDelay(delay);
         }
      }
    });
  }

  ngOnInit() {
    // Subscribe to router events ONLY for initial app load
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Only show loader for the very first navigation (initial app load)
        if (!this.hasCompletedFirstNavigation) {
          this.showInitialLoader('Loading');
        }
        // No loader for subsequent route changes - let the app flow naturally
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        const wasFirstNavigation = !this.hasCompletedFirstNavigation;
        // Mark first navigation as complete
        this.hasCompletedFirstNavigation = true;
        
        // Hide only if service is not loading (auth operation in progress)
        if (!this.loaderService.isLoading()) {
          if (wasFirstNavigation) {
            // Signal that navigation is done - let the effect handle hiding when auth is also ready
            this.navCompleted.set(true);
          } else {
            this.hideLoader();
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  /**
   * Show the minimal loader for initial app load
   */
  showInitialLoader(status: string = 'Loading') {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    
    this.isFadingOut.set(false);
    this.statusText.set(status);
    this.isInitialLoad.set(true);
    this.isVisible.set(true);
  }

  /**
   * Show the transparent auth loader for login/logout
   */
  showAuthLoader(status: string = 'Loading...') {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    
    this.isFadingOut.set(false);
    this.statusText.set(status);
    this.isInitialLoad.set(false);
    this.isVisible.set(true);
  }

  /**
   * Hide loader with a delay (used for initial load to let header settle)
   */
  hideLoaderWithDelay(delay: number) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    
    this.hideTimeout = setTimeout(() => {
      this.hideTimeout = undefined;
      this.hideLoader();
    }, delay);
  }

  hideLoader() {
    // Clear any pending hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    
    // If not visible, nothing to hide
    if (!this.isVisible()) {
      return;
    }
    
    // Fade out
    this.isFadingOut.set(true);
  }

  onFadeOutEnd() {
    if (this.isFadingOut()) {
      this.isVisible.set(false);
      this.isFadingOut.set(false);
    }
  }
}
