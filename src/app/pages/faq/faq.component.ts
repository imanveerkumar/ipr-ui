import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
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
            <span class="breadcrumb-current">FAQ</span>
          </nav>
          <h1 class="page-title">Frequently Asked Questions</h1>
          <p class="page-subtitle">Everything you need to know about StoresCraft.</p>
        </div>
      </section>

      <!-- Content -->
      <section class="content-section">
        <div class="container">
          @for (category of categories; track category.title) {
            <div class="card category-card">
              <h2 class="category-title">{{ category.title }}</h2>

              @for (item of category.items; track item.question) {
                <div class="faq-item" [class.open]="item.open">
                  <button class="faq-question" (click)="toggle(item)">
                    <span>{{ item.question }}</span>
                    <svg class="chevron" [class.rotated]="item.open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  @if (item.open) {
                    <div class="faq-answer">
                      <p>{{ item.answer }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Still have questions CTA -->
          <div class="card cta-card">
            <h2 class="cta-heading">Still have questions?</h2>
            <p class="cta-text">Can't find what you're looking for? Our team is here to help.</p>
            <a routerLink="/contact" class="btn btn-cta">Contact Us</a>
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

    .category-card {
      background: #fff;
      border: 2px solid #111;
      box-shadow: 4px 4px 0px 0px #111;
      padding: 0;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }

    .card {
      background: #fff;
      border: 2px solid #111;
      box-shadow: 4px 4px 0px 0px #111;
      margin-bottom: 1.5rem;
    }

    .category-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111;
      margin: 0;
      padding: 1.25rem 1.5rem;
      background: #FFC60B;
      border-bottom: 2px solid #111;
      letter-spacing: -0.01em;
    }

    /* FAQ Item */
    .faq-item {
      border-bottom: 2px solid #111;
    }

    .faq-item:last-child {
      border-bottom: none;
    }

    .faq-question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      font-size: 1rem;
      font-weight: 700;
      color: #111;
      text-align: left;
      cursor: pointer;
      font-family: inherit;
      gap: 1rem;
      transition: background-color 0.15s;
    }

    .faq-question:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    .chevron {
      flex-shrink: 0;
      transition: transform 0.25s;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    .faq-answer {
      padding: 0 1.5rem 1.25rem;
    }

    .faq-answer p {
      font-size: 0.975rem;
      line-height: 1.7;
      color: #111;
      opacity: 0.8;
      margin: 0;
    }

    /* CTA Card */
    .cta-card {
      text-align: center;
      padding: 2.5rem 2rem;
      background: #FA4B28;
    }

    .cta-heading {
      font-size: 1.5rem;
      font-weight: 900;
      color: #111;
      margin: 0 0 0.5rem;
    }

    .cta-text {
      font-size: 1rem;
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
      font-size: 1rem;
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
      .category-title { padding: 1rem 1.25rem; font-size: 1.1rem; }
      .faq-question { padding: 0.875rem 1.25rem; font-size: 0.95rem; }
      .faq-answer { padding: 0 1.25rem 1rem; }
    }
  `]
})
export class FaqComponent {
  categories: FaqCategory[] = [
    {
      title: 'Getting Started',
      icon: 'rocket',
      items: [
        {
          question: 'What is StoresCraft?',
          answer: 'StoresCraft is a digital product marketplace that lets creators build their own online stores and sell digital assets like templates, fonts, graphics, code, eBooks, and more. Buyers can explore products across the marketplace or visit individual creator storefronts.',
          open: false
        },
        {
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" in the navigation bar. We use Clerk for authentication, so you can sign up with your email address or a social login provider. Once signed up, you can start browsing and purchasing products immediately.',
          open: false
        },
        {
          question: 'Is it free to use StoresCraft?',
          answer: 'Yes! Creating an account and browsing the marketplace is completely free. If you want to become a creator and sell products, you can get started at no cost — sign up and create your first store for free.',
          open: false
        },
        {
          question: 'How do I become a creator?',
          answer: 'After creating an account, navigate to the "Become a Creator" page. Once you upgrade to a creator account, you can create stores, add products, upload files, set prices, and start selling.',
          open: false
        }
      ]
    },
    {
      title: 'Buying Products',
      icon: 'cart',
      items: [
        {
          question: 'How do I purchase a product?',
          answer: 'Browse the marketplace or visit a creator\'s store, find a product you like, and click "Buy Now" or add it to your cart. Complete the checkout using Razorpay, which supports credit/debit cards, UPI, net banking, and more.',
          open: false
        },
        {
          question: 'Can I buy products without creating an account?',
          answer: 'Yes! We support guest checkout. When you purchase as a guest, you\'ll provide your email address and receive a secure link to access your downloads. However, creating an account gives you access to your purchase history, library, and license management.',
          open: false
        },
        {
          question: 'How do I download my purchased products?',
          answer: 'After purchase, you can download products from your Library page. If you purchased as a guest, check your email for a download link. Each purchase generates a unique license key and download access.',
          open: false
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We use Razorpay for payment processing, which supports credit cards, debit cards, UPI, net banking, and various digital wallets commonly used in India.',
          open: false
        },
        {
          question: 'Can I get a refund?',
          answer: 'Due to the digital nature of products, all sales are generally final. However, we may issue refunds for duplicate charges, products significantly different from their description, or unresolvable download issues. Refund requests must be submitted within 7 days of purchase via our Contact page.',
          open: false
        }
      ]
    },
    {
      title: 'Selling & Creator Tools',
      icon: 'store',
      items: [
        {
          question: 'How do I create a store?',
          answer: 'After becoming a creator, go to your Dashboard and click "New Store." You can customize your store with a name, description, logo, and banner image. Each store gets a unique slug and can be accessed via a custom subdomain.',
          open: false
        },
        {
          question: 'Can I have multiple stores?',
          answer: 'Yes! Creators can create and manage multiple stores, each with its own branding and product catalog. This is great if you sell different types of products and want to keep them organized.',
          open: false
        },
        {
          question: 'What types of files can I upload?',
          answer: 'You can upload most common digital file formats. Files are securely stored on AWS S3. Each product listing can have one or more downloadable files associated with it.',
          open: false
        },
        {
          question: 'How do I track my sales?',
          answer: 'Your Creator Dashboard provides a sales overview with order history, revenue tracking, and product performance metrics. You can see which products are selling and manage your orders from one place.',
          open: false
        },
        {
          question: 'What happens when someone buys my product?',
          answer: 'When a purchase is made, the payment is processed through Razorpay, a license key is generated for the buyer, and they get immediate download access. You\'ll see the order appear in your Dashboard under Sales.',
          open: false
        }
      ]
    },
    {
      title: 'Accounts & Security',
      icon: 'shield',
      items: [
        {
          question: 'How is my data protected?',
          answer: 'We use Clerk for secure authentication, all connections use HTTPS encryption, and files are stored securely on AWS S3. We do not store your payment card details — those are handled exclusively by Razorpay under PCI-DSS standards.',
          open: false
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes. You can request account deletion by contacting our support team. Please note that this will permanently remove your profile, stores, and associated data. Orders and licenses already issued to buyers will remain active.',
          open: false
        },
        {
          question: 'What are user roles?',
          answer: 'StoresCraft has three roles: User (default — can browse and buy), Creator (can create stores and sell products), and Admin (platform administration). You start as a User and can upgrade to Creator from the "Become a Creator" page.',
          open: false
        }
      ]
    }
  ];

  toggle(item: FaqItem) {
    item.open = !item.open;
  }
}
