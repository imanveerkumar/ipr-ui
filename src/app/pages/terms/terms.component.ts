import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
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
            <span class="breadcrumb-current">Terms of Service</span>
          </nav>
          <h1 class="page-title">Terms of Service</h1>
          <p class="page-subtitle">Last updated: March 9, 2026</p>
        </div>
      </section>

      <!-- Content -->
      <section class="content-section">
        <div class="container">
          <div class="card">
            <div class="prose">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using TheBlueMustard ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all users, including buyers, creators (sellers), and visitors.</p>

              <h2>2. Definitions</h2>
              <ul>
                <li><strong>"Platform"</strong> refers to TheBlueMustard website, application, and all related services.</li>
                <li><strong>"Creator"</strong> refers to a user who creates a store and lists digital products for sale.</li>
                <li><strong>"Buyer"</strong> refers to a user who purchases digital products on the platform.</li>
                <li><strong>"Digital Product"</strong> refers to any digital asset listed for sale, including but not limited to templates, fonts, graphics, code, eBooks, and presets.</li>
                <li><strong>"Store"</strong> refers to a creator's customized storefront on the platform.</li>
              </ul>

              <h2>3. Account Registration</h2>
              <p>To access certain features, you must create an account through our authentication provider Clerk. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>

              <h2>4. Creator Terms</h2>
              <h3>4.1 Store Creation</h3>
              <p>Creators may create one or more stores on the platform. Each store receives a unique slug and may be accessed via a custom subdomain. Creators are responsible for all content in their stores.</p>

              <h3>4.2 Product Listings</h3>
              <p>Creators may list digital products for sale. You represent and warrant that:</p>
              <ul>
                <li>You own or have the right to sell the digital products you list</li>
                <li>Your products do not infringe on any third-party intellectual property rights</li>
                <li>Product descriptions are accurate and not misleading</li>
                <li>Products do not contain malware, viruses, or harmful code</li>
              </ul>

              <h3>4.3 Pricing</h3>
              <p>Creators set their own prices for products. Prices must be listed in Indian Rupees (INR). Free products (price of ₹0) are permitted.</p>

              <h2>5. Buyer Terms</h2>
              <h3>5.1 Purchases</h3>
              <p>When you purchase a digital product, you receive a license to use that product according to the license terms specified by the creator. A purchase does not transfer ownership or intellectual property rights of the digital product to you.</p>

              <h3>5.2 Licenses</h3>
              <p>Each purchase generates a unique license key. License terms are set by the creator. Licenses may be active, revoked, or expired. You must comply with the license terms associated with your purchase.</p>

              <h3>5.3 Downloads</h3>
              <p>After a successful purchase, you will receive access to download the digital product. Guest buyers receive download access via a secure email link. We reserve the right to limit the number or frequency of downloads to prevent abuse.</p>

              <h2>6. Payments</h2>
              <p>All payments are processed through Razorpay. By making a purchase, you agree to Razorpay's terms of service. We support various payment methods including credit/debit cards, UPI, and net banking.</p>

              <h2>7. Refunds</h2>
              <p>Due to the nature of digital products, all sales are generally final. Refunds may be issued at our discretion in cases of:</p>
              <ul>
                <li>Duplicate charges</li>
                <li>Products that are materially different from their description</li>
                <li>Technical issues preventing download access that cannot be resolved</li>
              </ul>
              <p>Refund requests must be submitted within 7 days of purchase.</p>

              <h2>8. Intellectual Property</h2>
              <p>TheBlueMustard platform, including its design, code, logos, and branding, is owned by TheBlueMustard and protected by intellectual property laws. Creators retain ownership of their digital products. Buyers receive only the usage rights granted by the product license.</p>

              <h2>9. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the platform for any illegal purpose</li>
                <li>Upload or sell content that is harmful, offensive, or violates any laws</li>
                <li>Attempt to circumvent payment systems or download protections</li>
                <li>Scrape, copy, or redistribute platform content without authorization</li>
                <li>Impersonate another person or entity</li>
                <li>Interfere with or disrupt the platform's infrastructure</li>
                <li>Share, resell, or redistribute purchased products beyond license terms</li>
              </ul>

              <h2>10. Content Moderation</h2>
              <p>We reserve the right to review, reject, or remove any product listing or store that violates these terms. Stores may be suspended, and accounts may be terminated for repeated violations.</p>

              <h2>11. Limitation of Liability</h2>
              <p>TheBlueMustard is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>

              <h2>12. Indemnification</h2>
              <p>You agree to indemnify and hold harmless TheBlueMustard, its operators, and affiliates from any claims, damages, or expenses arising from your use of the platform or violation of these terms.</p>

              <h2>13. Changes to Terms</h2>
              <p>We may update these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the updated terms. We will notify users of significant changes via email or platform notifications.</p>

              <h2>14. Governing Law</h2>
              <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in the relevant jurisdiction.</p>

              <h2>15. Contact</h2>
              <p>For questions about these Terms of Service, please visit our <a routerLink="/contact">Contact page</a>.</p>
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
      background: var(--background);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero */
    .hero-section {
      padding: 2rem 0 1.5rem;
      border-bottom: 2px solid var(--border);
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
      color: var(--foreground);
      text-decoration: none;
    }

    .breadcrumb-link:hover { color: var(--primary); }
    .breadcrumb-sep { color: var(--foreground); opacity: 0.4; }

    .breadcrumb-current {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--foreground);
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--foreground);
      letter-spacing: -0.03em;
      margin: 0 0 0.5rem;
    }

    .page-subtitle {
      font-size: 1rem;
      color: var(--muted);
      margin: 0;
    }

    /* Content */
    .content-section {
      padding: 2rem 0 4rem;
    }

    .card {
      background: var(--surface);
      border: 2px solid var(--border);
      box-shadow: 4px 4px 0px 0px var(--border);
      padding: 2.5rem 2rem;
    }

    /* Prose */
    .prose h2 {
      font-size: 1.375rem;
      font-weight: 800;
      color: var(--foreground);
      margin: 2rem 0 0.75rem;
      letter-spacing: -0.02em;
    }

    .prose h2:first-child { margin-top: 0; }

    .prose h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--foreground);
      margin: 1.5rem 0 0.5rem;
    }

    .prose p {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--muted);
      margin: 0 0 1rem;
    }

    .prose ul {
      margin: 0 0 1rem;
      padding-left: 1.5rem;
    }

    .prose li {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--muted);
      margin-bottom: 0.35rem;
    }

    .prose a {
      color: var(--primary);
      text-decoration: underline;
      font-weight: 600;
    }

    .prose a:hover { color: var(--foreground); }

    .prose strong { font-weight: 700; opacity: 1; }

    @media (max-width: 640px) {
      .container { padding: 0 1rem; }
      .page-title { font-size: 1.75rem; }
      .card { padding: 1.5rem 1.25rem; }
      .prose h2 { font-size: 1.2rem; }
    }
  `]
})
export class TermsComponent {}
