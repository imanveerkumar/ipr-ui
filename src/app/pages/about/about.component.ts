import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <!-- Hero -->
      <section class="hero-section">
        <div class="container">
          <nav class="breadcrumb">
            <a routerLink="/" class="breadcrumb-link">Home</a>
            <svg class="breadcrumb-sep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            <span class="breadcrumb-current">About</span>
          </nav>
          <h1 class="page-title">About StoresCraft</h1>
          <p class="page-subtitle">Empowering creators to sell digital products — without friction.</p>
        </div>
      </section>

      <!-- Content -->
      <section class="content-section">
        <div class="container">
          <!-- Mission Card -->
          <div class="card highlight-card">
            <div class="badge">Our Mission</div>
            <h2 class="card-heading">Build your store. Sell instantly.</h2>
            <p class="card-text">
              StoresCraft is a no-code digital product marketplace that lets anyone create a beautiful online store and start selling in minutes. Whether you're a designer selling templates, a developer sharing code, or an artist offering digital prints — we give you the tools to turn your creativity into income.
            </p>
          </div>

          <!-- What We Offer -->
          <div class="card">
            <h2 class="section-heading">What We Offer</h2>
            <div class="features-grid">
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <h3>Custom Storefronts</h3>
                <p>Each creator gets a personalized storefront with their own branding, logo, and product catalog — accessible via a unique subdomain.</p>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <h3>Digital Products</h3>
                <p>Sell templates, fonts, graphics, code snippets, eBooks, presets — any digital asset you can dream up. We handle secure file storage and delivery.</p>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <h3>Secure Payments</h3>
                <p>Powered by Razorpay, our payment system supports credit cards, debit cards, UPI, net banking, and more — so your customers can pay their way.</p>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3>License Management</h3>
                <p>Every purchase generates a unique license key. Creators and buyers can track licenses, ensuring proper usage and rights management.</p>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h3>Instant Downloads</h3>
                <p>After purchase, buyers get immediate access to download their digital products. Guest checkout with email-based download links is also supported.</p>
              </div>
              <div class="feature">
                <div class="feature-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <h3>Explore & Discover</h3>
                <p>Buyers can browse a curated marketplace of digital products across categories, find new creators, and discover unique digital assets.</p>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="card cta-card">
            <h2 class="cta-heading">Ready to start selling?</h2>
            <p class="cta-text">Join thousands of creators building their digital empires on StoresCraft. It's free to get started.</p>
            <a routerLink="/become-creator" class="btn btn-cta">Get Started Free</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #F9F4EB;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero */
    .hero-section {
      padding: 2rem 0 1.5rem;
      border-bottom: 2px solid #111;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .breadcrumb-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: #111;
      text-decoration: none;
    }

    .breadcrumb-link:hover { color: #2B57D6; }
    .breadcrumb-sep { color: #111; opacity: 0.4; }

    .breadcrumb-current {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: #111;
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #111;
      opacity: 0.7;
      margin: 0;
      font-weight: 500;
    }

    /* Content */
    .content-section {
      padding: 2rem 0 4rem;
    }

    .card {
      background: #fff;
      border: 2px solid #111;
      /* shadow removed per request */
      box-shadow: none;
      padding: 2.5rem 2rem;
      margin-bottom: 1.5rem;
    }

    .highlight-card {
      background: #FFC60B;
    }

    .badge {
      display: inline-block;
      background: #111;
      color: #FFC60B;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.35rem 0.75rem;
      margin-bottom: 1rem;
    }

    .card-heading {
      font-size: 1.75rem;
      font-weight: 900;
      color: #111;
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }

    .card-text {
      font-size: 1.05rem;
      line-height: 1.75;
      color: #111;
      opacity: 0.85;
      margin: 0 0 1rem;
    }

    .section-heading {
      font-size: 1.5rem;
      font-weight: 800;
      color: #111;
      margin: 0 0 1.5rem;
      letter-spacing: -0.02em;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .features-grid { grid-template-columns: 1fr 1fr; }
    }

    .feature {
      padding: 1.25rem;
      border: 2px solid #111;
      background: #F9F4EB;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: #FFC60B;
      border: 2px solid #111;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .feature h3 {
      font-size: 1.1rem;
      font-weight: 800;
      color: #111;
      margin: 0 0 0.5rem;
    }

    .feature p {
      font-size: 0.925rem;
      line-height: 1.6;
      color: #111;
      opacity: 0.8;
      margin: 0;
    }

    /* CTA Card */
    .cta-card {
      text-align: center;
      background: #FA4B28;
      border-color: #111;
    }

    .cta-heading {
      font-size: 1.75rem;
      font-weight: 900;
      color: #111;
      margin: 0 0 0.75rem;
    }

    .cta-text {
      font-size: 1.05rem;
      line-height: 1.6;
      color: #111;
      opacity: 0.9;
      margin: 0 0 1.5rem;
    }

    .btn-cta {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2.5rem;
      background: #FFC60B;
      color: #111;
      font-size: 1.05rem;
      font-weight: 800;
      border: 2px solid #111;
      box-shadow: 4px 4px 0px 0px #111;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
    }

    .btn-cta:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px 0px #111;
    }

    .btn-cta:active {
      transform: translate(0, 0);
      box-shadow: none;
    }

    @media (max-width: 640px) {
      .container { padding: 0 1rem; }
      .page-title { font-size: 1.75rem; }
      .card { padding: 1.5rem 1.25rem; }
      .card-heading { font-size: 1.4rem; }
    }
  `]
})
export class AboutComponent {}
