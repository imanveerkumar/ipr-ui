import { Injectable, signal, computed, effect } from '@angular/core';
import { Store, Product } from '../models';
import { ApiService } from './api.service';
import { SubdomainService } from './subdomain.service';

export interface StoreContext {
  store: Store | null;
  products: Product[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {
  private _store = signal<Store | null>(null);
  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _initialized = signal(false);

  /** Current store in context */
  readonly store = this._store.asReadonly();

  /** Products of current store */
  readonly products = this._products.asReadonly();

  /** Loading state */
  readonly loading = this._loading.asReadonly();

  /** Error message if any */
  readonly error = this._error.asReadonly();

  /** Whether store context has been initialized */
  readonly initialized = this._initialized.asReadonly();

  /** Whether we're in storefront mode with a valid store */
  readonly hasStore = computed(() => this._store() !== null);

  /** Store name for display */
  readonly storeName = computed(() => this._store()?.name ?? '');

  /** Store slug */
  readonly storeSlug = computed(() => this._store()?.slug ?? '');

  /** Whether store is published */
  readonly isPublished = computed(() => this._store()?.status === 'PUBLISHED');

  constructor(
    private api: ApiService,
    private subdomainService: SubdomainService
  ) {}

  /**
   * Initialize the store context based on subdomain
   * Called from app initializer or app component
   */
  async initialize(): Promise<void> {
    if (this._initialized()) return;

    const subdomainInfo = this.subdomainService.subdomainInfo();
    
    if (!subdomainInfo.isStorefront || !subdomainInfo.subdomain) {
      this._initialized.set(true);
      return;
    }

    await this.loadStore(subdomainInfo.subdomain);
    this._initialized.set(true);
  }

  /**
   * Load store by slug
   */
  async loadStore(slug: string): Promise<Store | null> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await this.api.get<Store>(`/stores/slug/${slug}`);
      
      if (response.success && response.data) {
        const store = response.data;
        
        // Check if store is published (for public access)
        if (store.status !== 'PUBLISHED') {
          this._error.set('This store is not available');
          this._store.set(null);
          return null;
        }

        this._store.set(store);
        
        // Load products if not included
        if (!store.products) {
          await this.loadProducts(store.id);
        } else {
          this._products.set(store.products);
        }

        return store;
      } else {
        this._error.set('Store not found');
        this._store.set(null);
        return null;
      }
    } catch (err: any) {
      this._error.set(err.message || 'Failed to load store');
      this._store.set(null);
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Load products for current store
   */
  async loadProducts(storeId?: string): Promise<Product[]> {
    const id = storeId || this._store()?.id;
    if (!id) return [];

    try {
      const response = await this.api.get<Product[]>(`/products/store/${id}`);
      const products = response.data || [];
      this._products.set(products);
      return products;
    } catch {
      return [];
    }
  }

  /**
   * Get a specific product from the store
   */
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const response = await this.api.get<Product>(`/products/${productId}`);
      return response.data || null;
    } catch {
      return null;
    }
  }

  /**
   * Clear the store context
   */
  clear(): void {
    this._store.set(null);
    this._products.set([]);
    this._error.set(null);
    this._initialized.set(false);
  }

  /**
   * Refresh store data
   */
  async refresh(): Promise<void> {
    const slug = this._store()?.slug || this.subdomainService.storeSlug();
    if (slug) {
      await this.loadStore(slug);
    }
  }
}
