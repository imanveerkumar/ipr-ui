import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalLoaderService } from '../../../core/services/global-loader.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      @if (isInitialLoad()) {
        <!-- Full Page Loader for Initial App Load -->
        <div class="loader-overlay-full" [class.fade-out]="isFadingOut()" (animationend)="onFadeOutEnd()">
          <!-- Ambient Background -->
          <div class="ambient-scene">
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
          </div>

          <!-- Main Loader Card -->
          <div class="loader-card">
            <div class="status-badge">{{ statusText() }}</div>

            <!-- Windmill SVG -->
            <svg class="windmill-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <!-- Ground shadow -->
              <ellipse cx="100" cy="190" rx="70" ry="15" fill="rgba(0,0,0,0.05)" />
              
              <!-- Tree on left -->
              <rect x="35" y="160" width="8" height="30" fill="#8B4513" stroke="var(--loader-black)" stroke-width="3"/>
              <circle cx="39" cy="150" r="22" fill="var(--loader-purple)" stroke="var(--loader-black)" stroke-width="3"/>

              <!-- Windmill tower -->
              <path d="M80 190 L120 190 L110 80 L90 80 Z" fill="var(--loader-blue)" stroke="var(--loader-black)" stroke-width="4"/>
              <line x1="90" y1="140" x2="110" y2="140" stroke="var(--loader-black)" stroke-width="3"/>
              
              <!-- Fan group (rotating) -->
              <g class="fan-group">
                <g stroke="var(--loader-black)" stroke-width="3">
                  <path d="M100 80 L100 20 L120 20 L110 80 Z" fill="var(--loader-yellow)"/>
                  <path d="M100 80 L160 80 L160 100 L100 90 Z" fill="var(--loader-yellow)"/>
                  <path d="M100 80 L100 140 L80 140 L90 80 Z" fill="var(--loader-yellow)"/>
                  <path d="M100 80 L40 80 L40 60 L100 70 Z" fill="var(--loader-yellow)"/>
                </g>
                <circle cx="100" cy="80" r="10" fill="white" stroke="var(--loader-black)" stroke-width="4"/>
                <circle cx="100" cy="80" r="4" fill="var(--loader-black)"/>
              </g>

              <!-- Tree on right -->
              <rect x="155" y="170" width="8" height="20" fill="#8B4513" stroke="var(--loader-black)" stroke-width="3"/>
              <path d="M145 140 L175 140 L160 175 H145 Z" fill="var(--loader-green)" stroke="var(--loader-black)" stroke-width="3"/>
            </svg>

            <!-- Loading Text with Dots -->
            <div class="loading-text">
              LOADING
              <div class="dots-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Minimal Blurred Overlay for Route Switching -->
        <div class="loader-overlay-minimal" [class.fade-out]="isFadingOut()" (animationend)="onFadeOutEnd()">
          <div class="loading-text">
            LOADING
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
       FULL PAGE LOADER (Initial App Load)
       ============================================ */
    .loader-overlay-full {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background-color: var(--loader-bg-cream);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      /* No fade-in for initial load - appears immediately */
    }

    .loader-overlay-full.fade-out {
      animation: fade-out 0.3s ease-out forwards;
    }

    /* Ambient Scene - Clouds */
    .ambient-scene {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .cloud {
      position: absolute;
      background: white;
      border: 3px solid var(--loader-black);
      height: 30px;
      width: 80px;
      border-radius: 50px;
      box-shadow: 4px 4px 0px var(--loader-black);
      animation: drift linear infinite;
    }

    @media (min-width: 768px) {
      .cloud {
        height: 40px;
        width: 100px;
      }
    }

    .cloud-1 {
      top: 15%;
      animation-duration: 25s;
      opacity: 0.8;
    }

    .cloud-2 {
      top: 25%;
      animation-duration: 40s;
      opacity: 0.5;
      transform: scale(0.7);
    }

    .cloud-3 {
      top: 10%;
      animation-duration: 30s;
      animation-delay: -10s;
    }

    @keyframes drift {
      from { transform: translateX(-150px); }
      to { transform: translateX(calc(100vw + 150px)); }
    }

    /* Loader Card */
    .loader-card {
      position: relative;
      z-index: 10;
      background: white;
      border: 3px solid var(--loader-black);
      padding: 30px 40px;
      box-shadow: 8px 8px 0px var(--loader-black);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: card-entry 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      max-width: 90vw;
    }

    @media (min-width: 768px) {
      .loader-card {
        border: 4px solid var(--loader-black);
        padding: 50px;
        box-shadow: 12px 12px 0px var(--loader-black);
      }
    }

    @keyframes card-entry {
      0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }

    /* Status Badge */
    .status-badge {
      position: absolute;
      top: -16px;
      background: var(--loader-green);
      border: 2px solid var(--loader-black);
      padding: 4px 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      box-shadow: 3px 3px 0px var(--loader-black);
      transform: rotate(-2deg);
      white-space: nowrap;
    }

    @media (min-width: 768px) {
      .status-badge {
        top: -20px;
        border: 3px solid var(--loader-black);
        padding: 6px 15px;
        font-size: 14px;
        box-shadow: 4px 4px 0px var(--loader-black);
      }
    }

    /* Windmill SVG */
    .windmill-svg {
      width: 140px;
      height: auto;
      overflow: visible;
      animation: windmill-bounce 2s ease-in-out infinite;
    }

    @media (min-width: 768px) {
      .windmill-svg {
        width: 180px;
      }
    }

    @keyframes windmill-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .fan-group {
      transform-box: fill-box;
      transform-origin: center;
      animation: fan-spin 3s linear infinite;
    }

    @keyframes fan-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ============================================
       MINIMAL LOADER (Route Switching)
       ============================================ */
    .loader-overlay-minimal {
      position: fixed;
      /* Position between header and footer */
      top: 64px;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9998;
      background-color: rgba(249, 244, 235, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      animation: fade-in 0.2s ease-out;
    }

    @media (min-width: 768px) {
      .loader-overlay-minimal {
        top: 72px;
      }
    }

    .loader-overlay-minimal.fade-out {
      animation: fade-out 0.2s ease-out forwards;
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
  private routerSubscription?: Subscription;

  isVisible = signal(false);
  isFadingOut = signal(false);
  statusText = signal('Processing');
  
  /** Track if this is the initial app load (show full windmill) or route switching (show minimal) */
  isInitialLoad = signal(true);

  private hideTimeout?: ReturnType<typeof setTimeout>;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private navigationInProgress = false;
  private hasCompletedFirstNavigation = false;
  
  /** Delay in ms before showing loader (prevents flash for fast navigations) */
  private readonly SHOW_DELAY = 300;

  constructor() {
    // React to service loading state changes
    effect(() => {
      const isServiceLoading = this.loaderService.isLoading();
      const serviceStatusText = this.loaderService.statusText();
      
      if (isServiceLoading) {
        this.showLoaderWithDelay(serviceStatusText, false);
      } else if (!this.navigationInProgress) {
        this.hideLoader();
      }
    });
  }

  ngOnInit() {
    // Subscribe to router events for navigation loading
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigationInProgress = true;
        // After first navigation, use minimal loader for subsequent navigations
        const useFullLoader = !this.hasCompletedFirstNavigation;
        
        if (useFullLoader) {
          // Show immediately for initial URL load (no delay)
          this.showLoaderImmediately('Loading', true);
        } else {
          // Use delay for route switching
          this.showLoaderWithDelay('Loading', false);
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navigationInProgress = false;
        // Mark first navigation as complete
        this.hasCompletedFirstNavigation = true;
        
        // Only hide if service is not loading
        if (!this.loaderService.isLoading()) {
          this.hideLoader();
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
  }

  /**
   * Show loader immediately without any delay (for initial URL load)
   */
  showLoaderImmediately(status: string = 'Processing', fullLoader: boolean = true) {
    // Clear any pending hide or show
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    
    this.isFadingOut.set(false);
    this.statusText.set(status);
    this.isInitialLoad.set(fullLoader);
    this.isVisible.set(true);
  }

  /**
   * Show loader only after a delay - prevents flash for fast navigations
   */
  showLoaderWithDelay(status: string = 'Processing', fullLoader: boolean = false) {
    // Clear any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
    
    // If already visible, just update status
    if (this.isVisible()) {
      this.statusText.set(status);
      return;
    }
    
    // If already pending show, don't create another timeout
    if (this.showTimeout) {
      return;
    }
    
    // Delay showing the loader
    this.showTimeout = setTimeout(() => {
      this.showTimeout = undefined;
      this.isFadingOut.set(false);
      this.statusText.set(status);
      this.isInitialLoad.set(fullLoader);
      this.isVisible.set(true);
    }, this.SHOW_DELAY);
  }

  hideLoader() {
    // Cancel pending show if navigation completed quickly
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    
    // If not visible, nothing to hide
    if (!this.isVisible()) {
      return;
    }
    
    // Fade out immediately (no additional delay since we already delayed showing)
    this.isFadingOut.set(true);
  }

  onFadeOutEnd() {
    if (this.isFadingOut()) {
      this.isVisible.set(false);
      this.isFadingOut.set(false);
    }
  }
}
