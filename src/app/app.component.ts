import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartSidebarComponent } from './pages/storefront/cart-sidebar.component';
import { AuthService, SubdomainService, StoreContextService } from './core/services';
import { StorefrontLayoutComponent } from './pages/storefront/storefront-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, StorefrontLayoutComponent, CartSidebarComponent],
  template: `
    @if (subdomainService.isStorefront()) {
      <!-- Storefront Mode: Show store-specific layout -->
      <app-storefront-layout />
    } @else {
      <!-- Main Site Mode: Show normal layout -->
      <div class="min-h-screen flex flex-col">
        <app-navbar />
        <main class="flex-1">
          <router-outlet />
        </main>
        <app-footer />
      </div>
      <!-- Cart Sidebar (reuses storefront cart component) -->
      <app-cart-sidebar />
    }
  `,
})
export class AppComponent implements OnInit {
  subdomainService = inject(SubdomainService);
  storeContext = inject(StoreContextService);
  private authService = inject(AuthService);

  async ngOnInit() {
    // Initialize auth state
    this.authService.init();

    // If on storefront, initialize store context
    if (this.subdomainService.isStorefront()) {
      await this.storeContext.initialize();
    }
  }
}
