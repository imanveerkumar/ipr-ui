import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
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
            <span class="breadcrumb-current">Privacy Policy</span>
          </nav>
          <h1 class="page-title">Privacy Policy</h1>
          <p class="page-subtitle">Last updated: March 9, 2026</p>
        </div>
      </section>

      <!-- Content -->
      <section class="content-section">
        <div class="container">
          <div class="card">
            <div class="prose">
              <h2>1. Introduction</h2>
              <p>Welcome to StoresCraft. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital marketplace platform.</p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>When you register for an account, we collect information provided through our authentication partner Clerk, including:</p>
              <ul>
                <li>Name and display name</li>
                <li>Email address</li>
                <li>Username</li>
                <li>Profile avatar</li>
                <li>Website URL and social media handles (optional)</li>
              </ul>

              <h3>2.2 Store & Creator Information</h3>
              <p>If you become a creator on StoresCraft, we additionally collect:</p>
              <ul>
                <li>Store name, description, and branding assets (logo, banner images)</li>
                <li>Product details including titles, descriptions, pricing, and categories</li>
                <li>Digital product files you upload for sale</li>
              </ul>

              <h3>2.3 Payment Information</h3>
              <p>We use Razorpay as our payment processor. We do not store your full credit card or debit card details on our servers. Payment information is processed and stored securely by Razorpay in accordance with their privacy policy and PCI-DSS standards.</p>

              <h3>2.4 Usage Data</h3>
              <p>We automatically collect certain information when you visit our platform, including:</p>
              <ul>
                <li>Browser type and version</li>
                <li>Pages you visit and features you use</li>
                <li>Date, time, and duration of your visits</li>
                <li>Download and purchase history</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Create and manage your account</li>
                <li>Process transactions and deliver purchased digital products</li>
                <li>Enable creators to set up and manage their online stores</li>
                <li>Generate and manage product licenses</li>
                <li>Send transactional emails (order confirmations, download links)</li>
                <li>Improve and optimize our platform</li>
                <li>Detect and prevent fraud or abuse</li>
              </ul>

              <h2>4. Data Storage & Security</h2>
              <p>Your data is stored on secure PostgreSQL databases. Digital product files are stored on Amazon Web Services (AWS) S3 with appropriate access controls. We implement industry-standard security measures including encrypted connections (HTTPS), secure authentication via Clerk, and regular security audits.</p>

              <h2>5. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with:</p>
              <ul>
                <li><strong>Clerk</strong> — for authentication and identity management</li>
                <li><strong>Razorpay</strong> — for payment processing</li>
                <li><strong>Amazon Web Services</strong> — for file storage and hosting</li>
                <li><strong>Creators</strong> — order details for products you purchase from their stores</li>
              </ul>

              <h2>6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h2>7. Cookies</h2>
              <p>We use essential cookies for authentication and session management. We do not currently use third-party tracking or advertising cookies.</p>

              <h2>8. Guest Purchases</h2>
              <p>If you purchase products as a guest (without creating an account), we collect only your email address to deliver download access links and order information. Guest data is retained for the duration required to fulfill the transaction and provide download access.</p>

              <h2>9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.</p>

              <h2>10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please <a routerLink="/contact">contact us</a>.</p>
            </div>
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
      max-width: 800px;
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
      font-size: 1rem;
      color: #111;
      opacity: 0.6;
      margin: 0;
    }

    /* Content */
    .content-section {
      padding: 2rem 0 4rem;
    }

    .card {
      background: #fff;
      border: 2px solid #111;
      box-shadow: 4px 4px 0px 0px #111;
      padding: 2.5rem 2rem;
    }

    /* Prose */
    .prose h2 {
      font-size: 1.375rem;
      font-weight: 800;
      color: #111;
      margin: 2rem 0 0.75rem;
      letter-spacing: -0.02em;
    }

    .prose h2:first-child { margin-top: 0; }

    .prose h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111;
      margin: 1.5rem 0 0.5rem;
    }

    .prose p {
      font-size: 1rem;
      line-height: 1.7;
      color: #111;
      opacity: 0.85;
      margin: 0 0 1rem;
    }

    .prose ul {
      margin: 0 0 1rem;
      padding-left: 1.5rem;
    }

    .prose li {
      font-size: 1rem;
      line-height: 1.7;
      color: #111;
      opacity: 0.85;
      margin-bottom: 0.35rem;
    }

    .prose a {
      color: #2B57D6;
      text-decoration: underline;
      font-weight: 600;
    }

    .prose a:hover { color: #FA4B28; }

    .prose strong { font-weight: 700; opacity: 1; }

    @media (max-width: 640px) {
      .container { padding: 0 1rem; }
      .page-title { font-size: 1.75rem; }
      .card { padding: 1.5rem 1.25rem; }
      .prose h2 { font-size: 1.2rem; }
    }
  `]
})
export class PrivacyPolicyComponent {}
