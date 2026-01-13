import { Routes } from '@angular/router';

export const storefrontRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./storefront-home.component').then(m => m.StorefrontHomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./storefront-products.component').then(m => m.StorefrontProductsComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./storefront-product.component').then(m => m.StorefrontProductComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
