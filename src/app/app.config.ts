import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SubdomainService } from './core/services/subdomain.service';

import { routes } from './app.routes';
import { storefrontRoutes } from './pages/storefront/storefront.routes';

/**
 * Factory to determine which routes to use based on subdomain
 */
function getRoutes(): typeof routes | typeof storefrontRoutes {
  const subdomainService = new SubdomainService();
  return subdomainService.isStorefront() ? storefrontRoutes : routes;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(getRoutes()),
  ]
};
