import { Routes } from '@angular/router';
import { authGuard, creatorGuard, adminGuard, nonCreatorGuard, storefrontGuard } from './core/guards';

// Dummy component for storefront routes - actual rendering handled by StorefrontLayoutComponent
const StorefrontPassthrough = () => import('./pages/storefront/storefront-layout.component').then(m => m.StorefrontLayoutComponent);

export const routes: Routes = [
  // Storefront routes - these are handled by StorefrontLayoutComponent when on subdomain
  // but we need them in the router so navigation doesn't get redirected to '/'
  {
    path: 'purchases',
    loadComponent: StorefrontPassthrough,
    canActivate: [storefrontGuard],
  },
  {
    path: 'products',
    loadComponent: StorefrontPassthrough,
    canActivate: [storefrontGuard],
  },
  
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent),
  },
  {
    path: 'store/:slug',
    loadComponent: () => import('./pages/store/store.component').then(m => m.StoreComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent),
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
  },
  // Guest download access (no auth required)
  {
    path: 'guest/downloads/:token',
    loadComponent: () => import('./pages/guest/guest-downloads.component').then(m => m.GuestDownloadsComponent),
  },
  // Guest purchases page (no auth required - uses guest auth)
  {
    path: 'guest/purchases',
    loadComponent: () => import('./pages/guest/guest-purchases.component').then(m => m.GuestPurchasesComponent),
  },

  // Auth required routes
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard],
  },
  {
    path: 'library',
    loadComponent: () => import('./pages/library/library.component').then(m => m.LibraryComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'become-creator',
    loadComponent: () => import('./pages/become-creator/become-creator.component').then(m => m.BecomeCreatorComponent),
    canActivate: [authGuard, nonCreatorGuard],
  },

  // Creator routes
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/stores',
    loadComponent: () => import('./pages/dashboard/stores/stores-list.component').then(m => m.StoresListComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/stores/new',
    loadComponent: () => import('./pages/dashboard/stores/store-form.component').then(m => m.StoreFormComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/stores/:id',
    loadComponent: () => import('./pages/dashboard/stores/store-form.component').then(m => m.StoreFormComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/products',
    loadComponent: () => import('./pages/dashboard/products/products-list.component').then(m => m.ProductsListComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/products/new',
    loadComponent: () => import('./pages/dashboard/products/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/products/:id',
    loadComponent: () => import('./pages/dashboard/products/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [creatorGuard],
  },
  {
    path: 'dashboard/sales',
    loadComponent: () => import('./pages/dashboard/sales/sales.component').then(m => m.SalesComponent),
    canActivate: [creatorGuard],
  },

  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],
  },

  // Fallback
  {
    path: '**',
    redirectTo: '',
  },
];
