import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Main Wrapper -->
    <div class="page-wrapper">
      <!-- Hero Section -->
      <section class="section tags-hero">
        <div class="padding-global">
          <div class="container-large">
            <div class="margin-bottom margin-large">
              <div class="heading-container">
                <div class="max-width-xlarge">
                  <div class="text-align-center">
                    <h2 class="hero-heading">All the features you need</h2>
                  </div>
                </div>
                <div class="margin-top margin-xsmall">
                  <div class="max-width-medium align-center">
                    <div class="text-color-primary opac-80 text-align-center text-size-medium">
                      Build a store and start selling your products in minutes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tags Navigation -->
            <div class="tags-wrapper">
              <a href="#products" class="tag-anchor">
                <div class="tag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <div>Products</div>
              </a>
              <a href="#customization" class="tag-anchor">
                <div class="tag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                <div>Customization</div>
              </a>
              <a href="#marketing" class="tag-anchor">
                <div class="tag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div>Marketing</div>
              </a>
              <a href="#integrations" class="tag-anchor">
                <div class="tag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <div>Integrations</div>
              </a>
              <a href="#payments" class="tag-anchor">
                <div class="tag-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div>Payments &amp; Security</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Products Section -->
      <section id="products" class="section zero-padding z-index-1">
        <div class="padding-global">
          <div class="container-xlarge">
            <div class="feature-card products-variant">
              <div class="feature-info-wrapper">
                <div class="feature-content">
                  <div class="margin-bottom margin-small">
                    <div class="tag-anchor inline">
                      <div class="tag-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </div>
                      <div>Products</div>
                    </div>
                  </div>
                  <div class="margin-bottom margin-xxsmall">
                    <h3>Sell products and subscriptions</h3>
                  </div>
                  <p class="text-color-primary opac-80">Sell digital goods, print on demand products or earn recurring revenue with subscriptions.</p>
                </div>
                <div class="grid-2x3">
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Digital products of all types</div>
                    <p class="text-color-primary opac-80">Sell ebooks, videos, audio &amp; music, or any other files like PSD, AI and many more.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Physical products</div>
                    <p class="text-color-primary opac-80">Sell physical products &amp; tangible items from your storefront.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Video streaming</div>
                    <p class="text-color-primary opac-80">Offer your videos on demand, reduce the risk of piracy &amp; eliminate download issues with video streaming.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Subscriptions</div>
                    <p class="text-color-primary opac-80">Create digital subscription products and charge your customers on a weekly, monthly or yearly basis.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Print on demand</div>
                    <p class="text-color-primary opac-80">Sell t-shirts, hoodies, mugs &amp; hats using our built-in print on demand. We will automatically print incoming orders and send them to your customers.</p>
                  </div>
                  <div class="feature-item"></div>
                </div>
              </div>
              <div class="splash-files products-splash">
                <div class="splash-image-container">
                  <img src="https://cdn.prod.website-files.com/6811f03f14c47749be0f02d0/68418a87663ff66b2581fea5_splash-customization.webp" alt="Products showcase" class="splash-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customization Section -->
      <section id="customization" class="section zero-padding z-index-1">
        <div class="padding-global">
          <div class="container-xlarge">
            <div class="feature-card customization-variant">
              <div class="feature-info-wrapper">
                <div class="feature-content">
                  <div class="margin-bottom margin-small">
                    <div class="tag-anchor inline">
                      <div class="tag-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                          <path d="M2 2l7.586 7.586"></path>
                          <circle cx="11" cy="11" r="2"></circle>
                        </svg>
                      </div>
                      <div>Customisation</div>
                    </div>
                  </div>
                  <div class="margin-bottom margin-xxsmall">
                    <h3>Beautiful store in five minutes</h3>
                  </div>
                  <p class="text-color-primary opac-80">Effortlessly create a beautiful store that stands out and represents your brand in a unique way.</p>
                </div>
                <div class="grid-2x3">
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Customization</div>
                    <p class="text-color-primary opac-80">Add your logo, change colors and create the layout you want to match your brand.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Connect your own domain</div>
                    <p class="text-color-primary opac-80">Link your existing domain to your store to strengthen your brand.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Shopping cart</div>
                    <p class="text-color-primary opac-80">Earn more by letting your customers purchase multiple items at once with an online shopping cart.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Store language</div>
                    <p class="text-color-primary opac-80">Give your customers an automatically translated version of your store's interface based on their location.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Optimized for mobile devices</div>
                    <p class="text-color-primary opac-80">Create a mobile-optimized store and a flawless checkout experience for both desktop and mobile.</p>
                  </div>
                </div>
              </div>
              <div class="splash-files customization-splash">
                <div class="splash-image-container">
                  <img src="https://cdn.prod.website-files.com/6811f03f14c47749be0f02d0/68418a87663ff66b2581fea5_splash-customization.webp" alt="Customization showcase" class="splash-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section 1 -->
      <section class="section cta-section">
        <div class="padding-global">
          <div class="container-large">
            <div class="heading-container">
              <div class="max-width-xlarge">
                <div class="text-align-center">
                  <h2 class="cta-heading">Create a store that <em>represents</em> you</h2>
                </div>
              </div>
              <div class="margin-top margin-xsmall">
                <div class="max-width-medium align-center">
                  <div class="text-color-primary opac-80 text-align-center text-size-medium">
                    Beautiful store, tons of features and no ugly transaction fees. Sign up to start your 14-day free trial.
                  </div>
                </div>
              </div>
              <div class="margin-top margin-medium">
                <a routerLink="/become-creator" class="button-primary">Start free trial</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Marketing Section -->
      <section id="marketing" class="section zero-padding z-index-1">
        <div class="padding-global">
          <div class="container-xlarge">
            <div class="feature-card marketing-variant">
              <div class="feature-info-wrapper">
                <div class="feature-content">
                  <div class="margin-bottom margin-small">
                    <div class="tag-anchor inline">
                      <div class="tag-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                      <div>Marketing</div>
                    </div>
                  </div>
                  <div class="margin-bottom margin-xxsmall">
                    <h3>Built-in marketing features</h3>
                  </div>
                  <p class="text-color-primary opac-80">Market better, outrun the competition and grow your business with ease.</p>
                </div>
                <div class="grid-2x3">
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Discount codes</div>
                    <p class="text-color-primary opac-80">Use discount codes to engage with customers and increase your sales.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Email marketing</div>
                    <p class="text-color-primary opac-80">Send product updates to existing customers and collect newsletter subscribers on your store.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Upselling</div>
                    <p class="text-color-primary opac-80">Offer powerful upsells to users who complete their checkout, increasing your average order value.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Tracking pixels</div>
                    <p class="text-color-primary opac-80">Add Facebook and Twitter ad pixels to create ads for your store and track their performance.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Cart abandonment emails</div>
                    <p class="text-color-primary opac-80">Automatically send emails with special offers to customers who have added products to their shopping cart but have not completed the checkout process.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Affiliate marketing</div>
                    <p class="text-color-primary opac-80">Launch an affiliate program for your store: reward your affiliates with a commission for every sale they make on behalf of your store.</p>
                  </div>
                </div>
              </div>
              <div class="splash-files marketing-splash">
                <div class="splash-image-container">
                  <img src="https://cdn.prod.website-files.com/6811f03f14c47749be0f02d0/6842cabf49ac4f0dcd171ae9_splash-marketing.webp" alt="Marketing showcase" class="splash-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Integrations Section -->
      <section id="integrations" class="section zero-padding z-index-1">
        <div class="padding-global">
          <div class="container-xlarge">
            <div class="feature-card integrations-variant">
              <div class="feature-info-wrapper">
                <div class="feature-content">
                  <div class="margin-bottom margin-small">
                    <div class="tag-anchor inline">
                      <div class="tag-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </div>
                      <div>Integrations</div>
                    </div>
                  </div>
                  <div class="margin-bottom margin-xxsmall">
                    <h3>Embed</h3>
                  </div>
                  <p class="text-color-primary opac-80">Sell from your website, social media or anywhere else.</p>
                </div>
                <div class="grid-2x3">
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">"Buy now" buttons</div>
                    <p class="text-color-primary opac-80">Add "buy now" buttons for any website and turn your existing pages into a store.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Product links</div>
                    <p class="text-color-primary opac-80">Sell anywhere with just a link. Works great for social media, messaging or direct communication.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Product cards</div>
                    <p class="text-color-primary opac-80">Embed product cards to your website and monetize your existing content.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Store embed</div>
                    <p class="text-color-primary opac-80">Turn any website into a store by embedding your whole store with all of your products.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">YouTube end screens &amp; cards</div>
                    <p class="text-color-primary opac-80">Use our platform on cards and end screens within YouTube videos to increase traffic to your store.</p>
                  </div>
                </div>
              </div>
              <div class="splash-files integrations-splash">
                <div class="splash-image-container">
                  <img src="https://cdn.prod.website-files.com/6811f03f14c47749be0f02d0/6811f03f14c47749be0f04db_splash-embed2.avif" alt="Integrations showcase" class="splash-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section 2 -->
      <section class="section cta-section">
        <div class="padding-global">
          <div class="container-large">
            <div class="heading-container">
              <div class="max-width-xlarge">
                <div class="text-align-center">
                  <h2 class="cta-heading">Get all of the growth tools you need in one place</h2>
                </div>
              </div>
              <div class="margin-top margin-xsmall">
                <div class="max-width-medium align-center">
                  <div class="text-color-primary opac-80 text-align-center text-size-medium">
                    Market your products, sell them anywhere with one platform. Sign up to start your 14 day free trial.
                  </div>
                </div>
              </div>
              <div class="margin-top margin-medium">
                <a routerLink="/become-creator" class="button-primary">Start free trial</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Payments Section -->
      <section id="payments" class="section zero-padding z-index-1">
        <div class="padding-global">
          <div class="container-xlarge">
            <div class="feature-card payments-variant">
              <div class="feature-info-wrapper">
                <div class="feature-content">
                  <div class="margin-bottom margin-small">
                    <div class="tag-anchor inline">
                      <div class="tag-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                      </div>
                      <div>Payments &amp; Security</div>
                    </div>
                  </div>
                  <div class="margin-bottom margin-xxsmall">
                    <h3>Reliable payments and world-class security</h3>
                  </div>
                  <p class="text-color-primary opac-80">Accept payments worldwide, keep your store and your customers safe.</p>
                </div>
                <div class="grid-2x3">
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">PayPal</div>
                    <p class="text-color-primary opac-80">Use PayPal to accept payments from customers in over 200 countries.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Stripe</div>
                    <p class="text-color-primary opac-80">Offer a credit card payment option on your store with Stripe.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Secure payments</div>
                    <p class="text-color-primary opac-80">PCI-DSS-ready. Trusted payment processors handle buyer payment information.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">PDF stamping</div>
                    <p class="text-color-primary opac-80">Automatically add buyer email addresses to every page of your PDF product file, ensuring each customer gets a uniquely marked file.</p>
                  </div>
                  <div class="feature-item">
                    <div class="text-size-medium text-weight-medium">Limited downloads</div>
                    <p class="text-color-primary opac-80">Control the number of times your customers can download their purchased files to prevent unauthorized sharing.</p>
                  </div>
                </div>
              </div>
              <div class="splash-files payments-splash">
                <div class="splash-image-container">
                  <img src="https://cdn.prod.website-files.com/6811f03f14c47749be0f02d0/6811f03f14c47749be0f0453_splash-security.avif" alt="Payments showcase" class="splash-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Banner -->
      <section class="section cta-banner">
        <div class="padding-global">
          <div class="cta-banner-inner">
            <div class="badge">
              <div class="badge-text"><strong>30 day</strong> money-back guarantee</div>
              <div class="badge-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div class="margin-bottom margin-xsmall">
              <div class="max-width-xlarge">
                <div class="text-align-center">
                  <h2 class="cta-heading dark">Open <em>your</em> store today</h2>
                </div>
              </div>
            </div>
            <div class="max-width-small align-center">
              <div class="text-color-light opac-80 text-align-center text-size-medium">
                Try free for 14 days. No card needed.
              </div>
            </div>
            <div class="margin-top margin-medium">
              <a routerLink="/become-creator" class="button-secondary">Start free trial</a>
            </div>
            
            <!-- Background illustrations -->
            <div class="bg-illustrations">
              <div class="bg-ill-1">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                  <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
                  <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
                </svg>
              </div>
              <div class="bg-ill-2">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                  <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
                  <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .page-wrapper {
      font-family: 'DM Sans', 'Open Sans', system-ui, sans-serif;
      color: #111111;
      overflow-x: hidden;
    }

    /* Global Styles */
    .padding-global {
      padding-left: 2.5rem;
      padding-right: 2.5rem;
    }

    @media (max-width: 767px) {
      .padding-global {
        padding-left: 1.25rem;
        padding-right: 1.25rem;
      }
    }

    .container-large {
      max-width: 80rem;
      margin-left: auto;
      margin-right: auto;
    }

    .container-xlarge {
      max-width: 90rem;
      margin-left: auto;
      margin-right: auto;
    }

    .section {
      padding-top: 6rem;
      padding-bottom: 6rem;
    }

    @media (max-width: 767px) {
      .section {
        padding-top: 4rem;
        padding-bottom: 4rem;
      }
    }

    .section.zero-padding {
      padding-top: 0;
      padding-bottom: 1rem;
    }

    .z-index-1 {
      position: relative;
      z-index: 1;
    }

    /* Typography */
    .text-align-center {
      text-align: center;
    }

    .text-color-primary {
      color: #111111;
    }

    .text-color-light {
      color: #ffffff;
    }

    .opac-80 {
      opacity: 0.8;
    }

    .text-size-medium {
      font-size: 1rem;
      line-height: 1.5;
    }

    .text-weight-medium {
      font-weight: 500;
    }

    /* Margins */
    .margin-bottom.margin-large {
      margin-bottom: 4rem;
    }

    .margin-bottom.margin-small {
      margin-bottom: 1rem;
    }

    .margin-bottom.margin-xxsmall {
      margin-bottom: 0.5rem;
    }

    .margin-top.margin-xsmall {
      margin-top: 0.75rem;
    }

    .margin-top.margin-medium {
      margin-top: 2rem;
    }

    /* Layout */
    .max-width-xlarge {
      max-width: 64rem;
      margin-left: auto;
      margin-right: auto;
    }

    .max-width-medium {
      max-width: 40rem;
    }

    .max-width-small {
      max-width: 32rem;
    }

    .align-center {
      margin-left: auto;
      margin-right: auto;
    }

    .heading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Hero Section */
    .tags-hero {
      padding-top: 8rem;
      padding-bottom: 4rem;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }

    .hero-heading {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: #111111;
      margin: 0;
    }

    @media (max-width: 767px) {
      .hero-heading {
        font-size: 2.5rem;
      }
    }

    /* Tags Navigation */
    .tags-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .tag-anchor {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 9999px;
      color: #111111;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .tag-anchor:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
      transform: translateY(-1px);
    }

    .tag-anchor.inline {
      cursor: default;
    }

    .tag-anchor.inline:hover {
      transform: none;
    }

    .tag-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      color: #6b7280;
    }

    .tag-icon svg {
      width: 100%;
      height: 100%;
    }

    /* Feature Cards */
    .feature-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      padding: 3rem;
      background: #ffffff;
      border-radius: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 20px 40px rgba(0, 0, 0, 0.03);
      margin-bottom: 1rem;
      overflow: hidden;
    }

    @media (max-width: 991px) {
      .feature-card {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem;
      }
    }

    .feature-card.products-variant {
      background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #ffffff 100%);
    }

    .feature-card.customization-variant {
      background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #ffffff 100%);
    }

    .feature-card.marketing-variant {
      background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 50%, #ffffff 100%);
    }

    .feature-card.integrations-variant {
      background: linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #ffffff 100%);
    }

    .feature-card.payments-variant {
      background: linear-gradient(135deg, #e0e7ff 0%, #eef2ff 50%, #ffffff 100%);
    }

    .feature-info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .feature-content {
      display: flex;
      flex-direction: column;
    }

    .feature-info-wrapper h3 {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      color: #111111;
      margin: 0;
    }

    @media (max-width: 767px) {
      .feature-info-wrapper h3 {
        font-size: 1.5rem;
      }
    }

    .feature-info-wrapper p {
      margin: 0;
      line-height: 1.6;
    }

    /* Feature Grid */
    .grid-2x3 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    @media (max-width: 767px) {
      .grid-2x3 {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .feature-item .text-size-medium {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111111;
    }

    .feature-item p {
      font-size: 0.875rem;
      margin: 0;
    }

    /* Splash Images */
    .splash-files {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 400px;
      border-radius: 1rem;
      overflow: hidden;
    }

    @media (max-width: 991px) {
      .splash-files {
        min-height: 300px;
      }
    }

    .splash-image-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .splash-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 1rem;
    }

    /* CTA Sections */
    .cta-section {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }

    .cta-heading {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      color: #111111;
      margin: 0;
    }

    .cta-heading em {
      font-style: italic;
      color: #6366f1;
    }

    .cta-heading.dark {
      color: #ffffff;
    }

    .cta-heading.dark em {
      color: #a5b4fc;
    }

    @media (max-width: 767px) {
      .cta-heading {
        font-size: 2rem;
      }
    }

    /* Buttons */
    .button-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.875rem 2rem;
      background-color: #111111;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .button-primary:hover {
      background-color: #374151;
      transform: translateY(-1px);
    }

    .button-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1rem 2.5rem;
      background-color: #ffffff;
      color: #111111;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }

    .button-secondary:hover {
      background-color: #f3f4f6;
      transform: translateY(-1px);
    }

    /* CTA Banner */
    .cta-banner {
      padding: 0;
    }

    .cta-banner-inner {
      position: relative;
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      border-radius: 2rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      margin-bottom: 1.5rem;
    }

    .badge-text {
      color: #ffffff;
      font-size: 0.875rem;
    }

    .badge-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      background-color: #22c55e;
      border-radius: 9999px;
      color: #ffffff;
    }

    .badge-check svg {
      width: 0.75rem;
      height: 0.75rem;
    }

    /* Background Illustrations */
    .bg-illustrations {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .bg-ill-1 {
      position: absolute;
      top: -50px;
      left: -50px;
      opacity: 0.5;
    }

    .bg-ill-2 {
      position: absolute;
      bottom: -50px;
      right: -50px;
      opacity: 0.5;
    }

    /* Responsive Adjustments */
    @media (max-width: 479px) {
      .tags-hero {
        padding-top: 6rem;
      }

      .hero-heading {
        font-size: 2rem;
      }

      .feature-card {
        padding: 1.5rem;
      }

      .cta-banner-inner {
        padding: 3rem 1.5rem;
        border-radius: 1rem;
      }
    }
  `]
})
export class ExploreComponent {}
