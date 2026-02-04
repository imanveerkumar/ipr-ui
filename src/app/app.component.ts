import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { CartSidebarComponent } from './pages/storefront/cart-sidebar.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';
import { AuthService, SubdomainService, StoreContextService } from './core/services';
import { StorefrontLayoutComponent } from './pages/storefront/storefront-layout.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, StorefrontLayoutComponent, CartSidebarComponent, ToasterComponent, GlobalLoaderComponent, ConfirmModalComponent],
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
    
    <!-- Global Toaster Component -->
    <app-toaster />
    
    <!-- Global Loader Component -->
    <app-global-loader />

    <!-- Global Confirm Modal (reusable) -->
    <app-confirm-modal />
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
