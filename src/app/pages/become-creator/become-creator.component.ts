import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-become-creator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-wrapper">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="padding-global">
          <div class="hero-card">
            <div class="max-w-4xl mx-auto text-center py-12 md:py-16 lg:py-20 px-4">
              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm mb-6">
                <svg class="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span class="text-sm font-medium text-gray-800">Unlock Your Potential</span>
              </div>
              
              <!-- Main Heading -->
              <h1 class="font-dm-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight uppercase tracking-tight">
                Become a <span class="text-gradient">Creator</span>
              </h1>
              
              <!-- Subtext -->
              <p class="text-base md:text-lg lg:text-xl text-gray-700/80 max-w-2xl mx-auto">
                Start selling your digital products to a global audience. 
                Create stores, upload files, and earn money from your creations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="padding-global">
          <div class="max-w-5xl mx-auto">
            <div class="feature-grid">
              <!-- Feature 1 -->
              <div class="feature-card">
                <div class="feature-icon stores-icon">
                  <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h3 class="feature-title">Unlimited Stores</h3>
                <p class="feature-description">Build multiple storefronts for different brands or niches</p>
              </div>

              <!-- Feature 2 -->
              <div class="feature-card">
                <div class="feature-icon products-icon">
                  <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <h3 class="feature-title">Unlimited Products</h3>
                <p class="feature-description">No restrictions on the number of products you can list</p>
              </div>

              <!-- Feature 3 -->
              <div class="feature-card">
                <div class="feature-icon security-icon">
                  <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 class="feature-title">Secure Delivery</h3>
                <p class="feature-description">Protected downloads with license key authentication</p>
              </div>

              <!-- Feature 4 -->
              <div class="feature-card">
                <div class="feature-icon analytics-icon">
                  <svg class="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h3 class="feature-title">Sales Analytics</h3>
                <p class="feature-description">Track revenue, customers, and product performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Card Section -->
      <section class="cta-section">
        <div class="padding-global">
          <div class="max-w-xl mx-auto">
            <div class="cta-card">
              <!-- Header -->
              <div class="cta-header">
                <div class="cta-icon">
                  <svg class="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </div>
                <h2 class="font-dm-sans text-xl sm:text-2xl font-bold text-white mb-2">Creator Account</h2>
                <p class="text-sm sm:text-base text-white/80">Everything you need to sell digital products</p>
              </div>

              <!-- Content -->
              <div class="cta-content">
                <!-- Benefits List -->
                <div class="benefits-list">
                  <div class="benefit-item">
                    <div class="benefit-check">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="benefit-text">No monthly fees to start</span>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-check">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="benefit-text">Instant store creation</span>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-check">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="benefit-text">Secure payment processing</span>
                  </div>
                  <div class="benefit-item">
                    <div class="benefit-check">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <span class="benefit-text">24/7 creator support</span>
                  </div>
                </div>

                <!-- CTA Button -->
                <button 
                  (click)="upgrade()" 
                  [disabled]="loading()"
                  class="cta-button"
                >
                  @if (loading()) {
                    <svg class="w-5 h-5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  } @else {
                    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    <span>Activate Creator Account</span>
                  }
                </button>

                <p class="text-center text-xs sm:text-sm text-gray-500 mt-4">
                  Free to get started • No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof Section -->
      <section class="social-proof-section">
        <div class="padding-global">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="font-dm-sans text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-8">
              Join over 80K+ makers who've generated $180M+ in sales
            </h2>
            
            <!-- Creator avatars -->
            <div class="creator-avatars">
              <div class="avatar avatar-1"></div>
              <div class="avatar avatar-2"></div>
              <div class="avatar avatar-3"></div>
              <div class="avatar avatar-4"></div>
              <div class="avatar avatar-5"></div>
              <div class="avatar-more">+80K</div>
            </div>
            
            <!-- Trust indicators -->
            <div class="trust-badges">
              <div class="trust-badge">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>No transaction fees</span>
              </div>
              <div class="trust-badge">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Secure payments</span>
              </div>
              <div class="trust-badge">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Instant payouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Banner -->
      <section class="banner-section">
        <div class="padding-global">
          <div class="banner-card">
            <div class="text-center relative z-10">
              <h2 class="font-dm-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to start selling?
              </h2>
              <p class="text-white/80 text-base md:text-lg max-w-lg mx-auto mb-6">
                Turn your passion into profit. Create your first store in minutes.
              </p>
              <button 
                (click)="upgrade()" 
                [disabled]="loading()"
                class="banner-button"
              >
                @if (loading()) {
                  <span>Processing...</span>
                } @else {
                  <span>Get Started Free</span>
                }
              </button>
            </div>
            
            <!-- Background decorations -->
            <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            <div class="absolute bottom-6 right-6 text-5xl md:text-6xl opacity-80">🚀</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .page-wrapper {
      font-family: 'DM Sans', system-ui, sans-serif;
      min-height: 100vh;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-dm-sans {
      font-family: 'DM Sans', sans-serif;
    }

    .padding-global {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    @media (min-width: 640px) {
      .padding-global {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }

    @media (min-width: 1024px) {
      .padding-global {
        padding-left: 3rem;
        padding-right: 3rem;
      }
    }

    /* Text Gradient */
    .text-gradient {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Hero Section */
    .hero-section {
      padding-top: 1.5rem;
      padding-bottom: 1rem;
    }

    @media (min-width: 768px) {
      .hero-section {
        padding-top: 2rem;
      }
    }

    .hero-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fcd34d 100%);
      border-radius: 1.5rem;
      transition: all 0.3s ease;
    }

    @media (min-width: 768px) {
      .hero-card {
        border-radius: 2rem;
      }
    }

    .hero-card:hover {
      transform: translateY(-2px);
    }

    /* Features Section */
    .features-section {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .features-section {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .feature-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
      }
    }

    .feature-card {
      background: #ffffff;
      border-radius: 1rem;
      padding: 1.25rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
    }

    @media (min-width: 768px) {
      .feature-card {
        padding: 1.5rem;
        border-radius: 1.25rem;
      }
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);
    }

    .feature-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
    }

    @media (min-width: 768px) {
      .feature-icon {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 1rem;
        margin-bottom: 1rem;
      }
    }

    .stores-icon {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #2563eb;
    }

    .products-icon {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #16a34a;
    }

    .security-icon {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
    }

    .analytics-icon {
      background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
      color: #db2777;
    }

    .feature-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 0.375rem;
    }

    @media (min-width: 768px) {
      .feature-title {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
    }

    .feature-description {
      font-size: 0.75rem;
      color: #6b7280;
      line-height: 1.4;
    }

    @media (min-width: 768px) {
      .feature-description {
        font-size: 0.8125rem;
      }
    }

    /* CTA Section */
    .cta-section {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .cta-section {
        padding-top: 2rem;
        padding-bottom: 3rem;
      }
    }

    .cta-card {
      background: #ffffff;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.04);
    }

    @media (min-width: 768px) {
      .cta-card {
        border-radius: 2rem;
      }
    }

    .cta-header {
      background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
      padding: 2rem 1.5rem;
      text-align: center;
    }

    @media (min-width: 768px) {
      .cta-header {
        padding: 2.5rem 2rem;
      }
    }

    .cta-icon {
      width: 4rem;
      height: 4rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    @media (min-width: 768px) {
      .cta-icon {
        width: 5rem;
        height: 5rem;
        border-radius: 1.25rem;
      }
    }

    .cta-content {
      padding: 1.5rem;
    }

    @media (min-width: 768px) {
      .cta-content {
        padding: 2rem;
      }
    }

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
      .benefits-list {
        gap: 1rem;
        margin-bottom: 2rem;
      }
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .benefit-check {
      width: 1.5rem;
      height: 1.5rem;
      background: #f0fdf4;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .benefit-text {
      font-size: 0.9375rem;
      color: #374151;
      font-weight: 500;
    }

    .cta-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      background-color: #1f2937;
      color: #ffffff;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 52px;
    }

    @media (min-width: 768px) {
      .cta-button {
        padding: 1.125rem 2rem;
        min-height: 56px;
      }
    }

    .cta-button:hover:not(:disabled) {
      background-color: #374151;
      transform: translateY(-1px);
    }

    .cta-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    /* Social Proof Section */
    .social-proof-section {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .social-proof-section {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
    }

    .creator-avatars {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      border: 3px solid #ffffff;
      margin-left: -0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      .avatar {
        width: 3rem;
        height: 3rem;
        margin-left: -0.625rem;
      }
    }

    .avatar:first-child {
      margin-left: 0;
    }

    .avatar-1 { background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%); }
    .avatar-2 { background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%); }
    .avatar-3 { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); }
    .avatar-4 { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); }
    .avatar-5 { background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); }

    .avatar-more {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #1f2937;
      color: #ffffff;
      font-size: 0.625rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -0.5rem;
      border: 3px solid #ffffff;
    }

    @media (min-width: 768px) {
      .avatar-more {
        width: 3rem;
        height: 3rem;
        font-size: 0.75rem;
        margin-left: -0.625rem;
      }
    }

    .trust-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
    }

    @media (min-width: 768px) {
      .trust-badges {
        gap: 1.5rem;
      }
    }

    .trust-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: #374151;
      font-weight: 500;
    }

    @media (min-width: 768px) {
      .trust-badge {
        font-size: 0.875rem;
        gap: 0.5rem;
      }
    }

    /* Banner Section */
    .banner-section {
      padding-top: 1rem;
      padding-bottom: 4rem;
    }

    @media (min-width: 768px) {
      .banner-section {
        padding-top: 2rem;
        padding-bottom: 6rem;
      }
    }

    .banner-card {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      border-radius: 1.5rem;
      padding: 3rem 1.5rem;
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .banner-card {
        border-radius: 2rem;
        padding: 4rem 2rem;
      }
    }

    .banner-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 2rem;
      background-color: #ffffff;
      color: #1f2937;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .banner-button:hover:not(:disabled) {
      background-color: #f3f4f6;
      transform: translateY(-1px);
    }

    .banner-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `],
})
export class BecomeCreatorComponent {
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async upgrade() {
    this.loading.set(true);
    const result = await this.authService.upgradeToCreator();
    this.loading.set(false);

    if (result.success) {
      this.router.navigate(['/dashboard']);
    } else {
      alert(result.message || 'Failed to upgrade. Please try again.');
    }
  }
}
