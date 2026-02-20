import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface SubdomainInfo {
  isStorefront: boolean;
  subdomain: string | null;
  fullHost: string;
  baseDomain: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  private _subdomainInfo = signal<SubdomainInfo>(this.parseSubdomain());

  /** Current subdomain info */
  readonly subdomainInfo = this._subdomainInfo.asReadonly();

  /** Whether we're on a store subdomain */
  readonly isStorefront = computed(() => this._subdomainInfo().isStorefront);

  /** The store slug from subdomain */
  readonly storeSlug = computed(() => this._subdomainInfo().subdomain);

  /** Base domain for building URLs */
  readonly baseDomain = computed(() => this._subdomainInfo().baseDomain);

  constructor() {
    // Re-parse on navigation (for SPAs with dynamic subdomain handling)
    this.refresh();
  }

  /**
   * Parse the current hostname to extract subdomain info
   */
  private parseSubdomain(): SubdomainInfo {
    const host = window.location.hostname;
    const baseDomain = this.getBaseDomain();
    
    // Default result
    const result: SubdomainInfo = {
      isStorefront: false,
      subdomain: null,
      fullHost: host,
      baseDomain,
    };

    // If subdomain routing is disabled via configuration, only use ?_store query param (works on any host)
    if ((environment as any).subdomain === false) {
      const urlParams = new URLSearchParams(window.location.search);
      const devStore = urlParams.get('_store');
      if (devStore) {
        result.isStorefront = true;
        result.subdomain = devStore;
      }
      return result;
    }

    // Handle localhost development
    if (host === 'localhost' || host === '127.0.0.1') {
      // Check for subdomain in localhost (e.g., store.localhost)
      // Most browsers don't support this, so we use query param in dev
      const urlParams = new URLSearchParams(window.location.search);
      const devStore = urlParams.get('_store');
      if (devStore) {
        result.isStorefront = true;
        result.subdomain = devStore;
      }
      return result;
    }

    // For production domains
    // Extract subdomain by removing the base domain
    if (host.endsWith(baseDomain) && host !== baseDomain) {
      const subdomain = host.replace(`.${baseDomain}`, '');
      
      // Ignore www and other reserved subdomains
      const reservedSubdomains = ['www', 'api', 'admin', 'app', 'dashboard', 'mail', 'ftp'];
      
      if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
        result.isStorefront = true;
        result.subdomain = subdomain;
      }
    }

    return result;
  }

  /**
   * Get the base domain from environment or current host
   */
  private getBaseDomain(): string {
    // You can configure this in environment
    if ((environment as any).baseDomain) {
      return (environment as any).baseDomain;
    }

    const host = window.location.hostname;

    // For localhost
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'localhost';
    }

    // Extract base domain (last 2 parts for most TLDs)
    const parts = host.split('.');
    if (parts.length >= 2) {
      // Handle co.in, co.uk etc.
      const knownTwoPartTlds = ['co.in', 'co.uk', 'com.au', 'org.uk'];
      const lastTwo = parts.slice(-2).join('.');
      
      if (knownTwoPartTlds.some(tld => host.endsWith(tld))) {
        return parts.slice(-3).join('.');
      }
      
      return parts.slice(-2).join('.');
    }

    return host;
  }

  /**
   * Refresh subdomain info (useful after navigation)
   */
  refresh(): void {
    this._subdomainInfo.set(this.parseSubdomain());
  }

  /**
   * Build a URL for a specific store subdomain
   */
  getStoreUrl(storeSlug: string, path: string = ''): string {
    const protocol = window.location.protocol;
    const port = window.location.port;
    const baseDomain = this.baseDomain();

    // If subdomain routing is disabled via configuration, always use main site with ?_store query param
    if ((environment as any).subdomain === false) {
      const portPart = port ? `:${port}` : '';
      return `${protocol}//${baseDomain}${portPart}${path}${path.includes('?') ? '&' : '?'}_store=${storeSlug}`;
    }

    // For localhost development, use query param
    if (baseDomain === 'localhost') {
      const portPart = port ? `:${port}` : '';
      return `${protocol}//localhost${portPart}${path}?_store=${storeSlug}`;
    }

    // For production, use actual subdomain
    const portPart = port && port !== '80' && port !== '443' ? `:${port}` : '';
    return `${protocol}//${storeSlug}.${baseDomain}${portPart}${path}`;
  }

  /**
   * Build a URL for the main site
   */
  getMainSiteUrl(path: string = ''): string {
    const protocol = window.location.protocol;
    const port = window.location.port;
    const baseDomain = this.baseDomain();

    // For localhost
    if (baseDomain === 'localhost') {
      const portPart = port ? `:${port}` : '';
      return `${protocol}//localhost${portPart}${path}`;
    }

    // For production
    const portPart = port && port !== '80' && port !== '443' ? `:${port}` : '';
    return `${protocol}//${baseDomain}${portPart}${path}`;
  }

  /**
   * Check if a slug is available for use as subdomain
   */
  isValidSubdomain(slug: string): boolean {
    // Must be lowercase alphanumeric with hyphens
    const pattern = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
    if (!pattern.test(slug)) return false;

    // Cannot be reserved
    const reserved = [
      'api', 'www', 'app', 'admin', 'auth', 'cdn', 'static', 'assets', 'media',
      'files', 'upload', 'uploads', 'img', 'images', 'js', 'css', 'fonts',
      'dev', 'test', 'staging', 'stage', 'prod', 'production', 'qa', 'uat',
      'beta', 'alpha', 'sandbox', 'preview', 'mail', 'smtp', 'imap', 'pop',
      'ftp', 'sftp', 'ssh', 'ns1', 'ns2', 'ns3', 'dns', 'mx', 'cpanel',
      'webmail', 'autodiscover', 'autoconfig', 'dashboard', 'status', 'support',
      'help', 'docs', 'documentation', 'blog', 'careers', 'jobs', 'legal',
      'privacy', 'terms', 'billing', 'payments', 'checkout', 'account',
      'accounts', 'settings', 'profile', 'profiles', 'system', 'internal',
      'root', 'null', 'undefined', 'localhost', 'whatsapp', 'instagram',
      'meta', 'mcp', 'ai', 'auto'
    ];
    return !reserved.includes(slug.toLowerCase());
  }
}
