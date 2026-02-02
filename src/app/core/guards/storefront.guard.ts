import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { SubdomainService } from '../services/subdomain.service';

/**
 * Guard that only allows access to routes when on a storefront subdomain.
 * Redirects to /explore when accessed from the main site.
 */
export const storefrontGuard: CanActivateFn = (): boolean | UrlTree => {
  const subdomainService = inject(SubdomainService);
  const router = inject(Router);

  // Check if we're on a storefront subdomain
  if (subdomainService.isStorefront()) {
    return true;
  }

  // Redirect to explore page on main site
  return router.createUrlTree(['/explore']);
};
