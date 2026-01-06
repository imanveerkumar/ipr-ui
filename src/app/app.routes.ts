import { Routes } from '@angular/router';
import { authGuard, creatorGuard, adminGuard } from './core/guards';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
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

  // Auth required routes
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
    canActivate: [authGuard],
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
