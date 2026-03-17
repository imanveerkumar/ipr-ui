import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  coverImageUrl?: string;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  store: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

export interface WishlistPaginatedResponse {
  data: WishlistItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const WISHLIST_STORAGE_KEY = 'wishlist_product_ids';
const WISHLIST_PRODUCTS_KEY = 'wishlist_products';

/** Minimal product data stored in localStorage for anonymous wishlist page */
export interface WishlistLocalProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  coverImageUrl?: string;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  store: { id: string; name: string; slug: string };
}

// ─── Service ────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private api = inject(ApiService);

  // Reactive state: set of wishlisted product IDs for fast O(1) lookups
  private _wishlistedIds = signal<Set<string>>(new Set());

  // Tracks in-flight toggle operations to prevent duplicate requests
  private _pendingToggles = new Set<string>();

  // Local product data cache for anonymous wishlist page
  private _localProducts = new Map<string, WishlistLocalProduct>();

  /** Read-only signal of wishlisted product IDs */
  readonly wishlistedIds = this._wishlistedIds.asReadonly();

  /** Total number of wishlisted items */
  readonly count = computed(() => this._wishlistedIds().size);

  constructor() {
    // Load local wishlist on init (works for both anonymous & authenticated users)
    this.loadFromStorage();
    this.loadProductsFromStorage();
  }

  // ─── Public API ─────────────────────────────────────────────────────────

  /** Check if a product is in the wishlist (synchronous, from local state) */
  isWishlisted(productId: string): boolean {
    return this._wishlistedIds().has(productId);
  }

  /**
   * Toggle wishlist state for a product.
   * Uses optimistic UI: updates state immediately, reverts on failure.
   * Debounces rapid clicks by ignoring toggles while one is in-flight for the same product.
   */
  async toggle(productId: string, productData?: Record<string, any>): Promise<boolean> {
    // Prevent concurrent toggles for the same product
    if (this._pendingToggles.has(productId)) return this.isWishlisted(productId);
    this._pendingToggles.add(productId);

    const wasWishlisted = this.isWishlisted(productId);
    const newState = !wasWishlisted;

    // Optimistic update
    this.updateLocalState(productId, newState);

    // Cache product data for anonymous wishlist page
    if (newState && productData) {
      this.cacheProductData(productId, productData);
    } else if (!newState) {
      this.removeCachedProduct(productId);
    }

    try {
      if (newState) {
        await this.api.post(`/wishlist/${encodeURIComponent(productId)}`, {}, { skipAuthErrorHandling: true });
      } else {
        await this.api.delete(`/wishlist/${encodeURIComponent(productId)}`, { skipAuthErrorHandling: true });
      }
      // For anonymous users, localStorage is already updated
      return newState;
    } catch (error: any) {
      // 401 = anonymous user; keep the optimistic localStorage state — do not revert
      if (error?.status === 401) {
        return newState;
      }
      // Any other error (5xx, network): revert optimistic update
      console.error('Wishlist toggle failed, reverting:', error);
      this.updateLocalState(productId, wasWishlisted);
      // Revert product data cache
      if (newState && productData) {
        this.removeCachedProduct(productId);
      }
      return wasWishlisted;
    } finally {
      this._pendingToggles.delete(productId);
    }
  }

  /** Add a product to the wishlist */
  async add(productId: string): Promise<void> {
    if (this.isWishlisted(productId)) return;
    await this.toggle(productId);
  }

  /** Remove a product from the wishlist */
  async remove(productId: string): Promise<void> {
    if (!this.isWishlisted(productId)) return;
    await this.toggle(productId);
  }

  /** Get paginated wishlist from server (authenticated only) */
  async getWishlist(page = 1, limit = 20): Promise<WishlistPaginatedResponse> {
    const response = await this.api.get<WishlistPaginatedResponse>(
      `/wishlist?page=${page}&limit=${limit}`,
    );
    return (
      response.data || {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    );
  }

  /**
   * Batch check which products are wishlisted.
   * Updates internal state with server-side truth.
   * Use this when rendering product listings.
   */
  async batchCheck(productIds: string[]): Promise<Record<string, boolean>> {
    if (productIds.length === 0) return {};

    try {
      const response = await this.api.get<{ results: Record<string, boolean> }>(
        `/wishlist/check?productIds=${productIds.join(',')}`,
        { skipAuthErrorHandling: true },
      );
      const results = response.data?.results || {};

      // Merge server state into local state
      const current = new Set(this._wishlistedIds());
      for (const [id, wishlisted] of Object.entries(results)) {
        if (wishlisted) {
          current.add(id);
        } else {
          current.delete(id);
        }
      }
      this._wishlistedIds.set(current);
      this.saveToStorage();

      return results;
    } catch (error: any) {
      // 401 = anonymous user — fall back to local state
      if (error?.status !== 401) {
        console.error('Wishlist batch check failed:', error);
      }
      const results: Record<string, boolean> = {};
      for (const id of productIds) {
        results[id] = this.isWishlisted(id);
      }
      return results;
    }
  }

  /**
   * Sync local anonymous wishlist to server after login.
   * Should be called once after authentication completes.
   */
  async syncAfterLogin(): Promise<void> {
    const localIds = this.getLocalStorageIds();
    try {
      if (localIds.length > 0) {
        await this.api.post('/wishlist/sync', { productIds: localIds }, { skipAuthErrorHandling: true });
      }
      // Reload full server state to hydrate local signals
      await this.loadServerState();
    } catch (error: any) {
      if (error?.status !== 401) {
        console.error('Wishlist sync failed:', error);
      }
    }
  }

  /**
   * Load the full set of wishlisted product IDs from the server.
   * Called after login/sync to hydrate local state.
   */
  async loadServerState(): Promise<void> {
    try {
      // Fetch all wishlisted IDs (not paginated — just IDs for state)
      const response = await this.api.get<WishlistPaginatedResponse>(
        '/wishlist?page=1&limit=50',
        { skipAuthErrorHandling: true },
      );
      const items = response.data?.data || [];
      const ids = new Set(items.map((item) => item.productId));

      // If the server has more, fetch remaining pages
      const meta = response.data?.meta;
      if (meta && meta.totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= meta.totalPages; p++) {
          promises.push(
            this.api.get<WishlistPaginatedResponse>(`/wishlist?page=${p}&limit=50`, {
              skipAuthErrorHandling: true,
            }),
          );
        }
        const pages = await Promise.all(promises);
        for (const page of pages) {
          const pageItems = page.data?.data || [];
          pageItems.forEach((item) => ids.add(item.productId));
        }
      }

      this._wishlistedIds.set(ids);
      this.saveToStorage();
    } catch (error: any) {
      if (error?.status !== 401) {
        console.error('Failed to load wishlist state:', error);
      }
    }
  }

  /** Get locally cached wishlist items (for anonymous wishlist page) */
  getLocalWishlistItems(): WishlistLocalProduct[] {
    const ids = this._wishlistedIds();
    const items: WishlistLocalProduct[] = [];
    for (const id of ids) {
      const product = this._localProducts.get(id);
      if (product) items.push(product);
    }
    return items;
  }

  /** Clear all wishlist state (call on sign out) */
  clear(): void {
    this._wishlistedIds.set(new Set());
    this._localProducts.clear();
    this.removeFromStorage();
    this.removeProductsFromStorage();
  }

  // ─── Private Helpers ────────────────────────────────────────────────────

  private updateLocalState(productId: string, wishlisted: boolean): void {
    const current = new Set(this._wishlistedIds());
    if (wishlisted) {
      current.add(productId);
    } else {
      current.delete(productId);
    }
    this._wishlistedIds.set(current);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (Array.isArray(ids)) {
          this._wishlistedIds.set(new Set(ids));
        }
      }
    } catch {
      // Corrupted storage — reset
      this.removeFromStorage();
    }
  }

  private saveToStorage(): void {
    try {
      const ids = Array.from(this._wishlistedIds());
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage full or unavailable — ignore
    }
  }

  private removeFromStorage(): void {
    try {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private cacheProductData(productId: string, data: Record<string, any>): void {
    const product: WishlistLocalProduct = {
      id: productId,
      title: data['title'] || '',
      slug: data['slug'] || productId,
      price: data['price'] || 0,
      compareAtPrice: data['compareAtPrice'],
      currency: data['currency'] || 'INR',
      coverImageUrl: data['coverImageUrl'],
      coverImageWidth: data['coverImageWidth'],
      coverImageHeight: data['coverImageHeight'],
      store: data['store'] || { id: '', name: '', slug: '' },
    };
    this._localProducts.set(productId, product);
    this.saveProductsToStorage();
  }

  private removeCachedProduct(productId: string): void {
    this._localProducts.delete(productId);
    this.saveProductsToStorage();
  }

  private loadProductsFromStorage(): void {
    try {
      const raw = localStorage.getItem(WISHLIST_PRODUCTS_KEY);
      if (raw) {
        const products: WishlistLocalProduct[] = JSON.parse(raw);
        if (Array.isArray(products)) {
          for (const p of products) {
            this._localProducts.set(p.id, p);
          }
        }
      }
    } catch {
      localStorage.removeItem(WISHLIST_PRODUCTS_KEY);
    }
  }

  private saveProductsToStorage(): void {
    try {
      const products = Array.from(this._localProducts.values());
      localStorage.setItem(WISHLIST_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // Storage full or unavailable
    }
  }

  private removeProductsFromStorage(): void {
    try {
      localStorage.removeItem(WISHLIST_PRODUCTS_KEY);
    } catch {
      // ignore
    }
  }

  private getLocalStorageIds(): string[] {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const ids = JSON.parse(raw);
        return Array.isArray(ids) ? ids : [];
      }
    } catch {
      // ignore
    }
    return [];
  }
}
