import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface StoreGroup {
  storeId: string;
  storeName: string;
  storeSlug: string;
  colorIndex: number;
  items: CartItem[];
  totalPrice: number;
}

// Store color palette - soft, pastel colors for visual differentiation
export const STORE_COLORS = [
  { bg: 'bg-sky-50/80', border: 'border-sky-100', text: 'text-sky-600', badge: 'bg-sky-100/80 text-sky-700', accent: 'bg-sky-400' },
  { bg: 'bg-violet-50/80', border: 'border-violet-100', text: 'text-violet-600', badge: 'bg-violet-100/80 text-violet-700', accent: 'bg-violet-400' },
  { bg: 'bg-teal-50/80', border: 'border-teal-100', text: 'text-teal-600', badge: 'bg-teal-100/80 text-teal-700', accent: 'bg-teal-400' },
  { bg: 'bg-rose-50/80', border: 'border-rose-100', text: 'text-rose-600', badge: 'bg-rose-100/80 text-rose-700', accent: 'bg-rose-400' },
  { bg: 'bg-amber-50/80', border: 'border-amber-100', text: 'text-amber-600', badge: 'bg-amber-100/80 text-amber-700', accent: 'bg-amber-400' },
  { bg: 'bg-lime-50/80', border: 'border-lime-100', text: 'text-lime-600', badge: 'bg-lime-100/80 text-lime-700', accent: 'bg-lime-400' },
  { bg: 'bg-fuchsia-50/80', border: 'border-fuchsia-100', text: 'text-fuchsia-600', badge: 'bg-fuchsia-100/80 text-fuchsia-700', accent: 'bg-fuchsia-400' },
  { bg: 'bg-cyan-50/80', border: 'border-cyan-100', text: 'text-cyan-600', badge: 'bg-cyan-100/80 text-cyan-700', accent: 'bg-cyan-400' },
];

const CART_STORAGE_KEY = 'storefront_cart';
// Separate storage for store info cache
const STORE_CACHE_KEY = 'storefront_store_cache';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _isOpen = signal(false);
  
  // Cache for store info (storeId -> Store)
  private _storeCache = new Map<string, { id: string; name: string; slug: string }>();

  /** Cart items */
  readonly items = this._items.asReadonly();

  /** Whether cart sidebar is open */
  readonly isOpen = this._isOpen.asReadonly();

  /** Total number of items in cart */
  readonly itemCount = computed(() => 
    this._items().reduce((total, item) => total + item.quantity, 0)
  );

  /** Total price of items in cart (in paise) */
  readonly totalPrice = computed(() => 
    this._items().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  /** Whether cart has items */
  readonly hasItems = computed(() => this._items().length > 0);

  /** Get all product IDs in cart */
  readonly productIds = computed(() => 
    this._items().map(item => item.product.id)
  );

  /** Check if cart has products from multiple stores */
  readonly hasMultipleStores = computed(() => {
    const storeIds = new Set(this._items().map(item => item.product.storeId));
    return storeIds.size > 1;
  });

  /** Get unique store count */
  readonly storeCount = computed(() => {
    const storeIds = new Set(this._items().map(item => item.product.storeId));
    return storeIds.size;
  });

  /** Group cart items by store */
  readonly storeGroups = computed((): StoreGroup[] => {
    const items = this._items();
    const groups = new Map<string, StoreGroup>();
    let colorIndex = 0;

    items.forEach(item => {
      const storeId = item.product.storeId;
      if (!groups.has(storeId)) {
        // Try to get store name from product, then from cache
        const storeName = item.product.store?.name 
          || this._storeCache.get(storeId)?.name 
          || 'Store';
        const storeSlug = item.product.store?.slug 
          || this._storeCache.get(storeId)?.slug 
          || '';
        
        groups.set(storeId, {
          storeId,
          storeName,
          storeSlug,
          colorIndex: colorIndex++,
          items: [],
          totalPrice: 0,
        });
      }
      const group = groups.get(storeId)!;
      group.items.push(item);
      group.totalPrice += item.product.price * item.quantity;
    });

    return Array.from(groups.values());
  });

  /** Get color scheme for a store by index */
  getStoreColor(colorIndex: number) {
    return STORE_COLORS[colorIndex % STORE_COLORS.length];
  }

  /** Get color scheme for a store by ID */
  getStoreColorById(storeId: string) {
    const groups = this.storeGroups();
    const group = groups.find(g => g.storeId === storeId);
    if (group) {
      return this.getStoreColor(group.colorIndex);
    }
    return STORE_COLORS[0];
  }

  /**
   * Cache store info for later retrieval
   */
  cacheStoreInfo(store: { id: string; name: string; slug: string }): void {
    this._storeCache.set(store.id, store);
    this.saveStoreCacheToStorage();
  }

  /**
   * Get cached store info
   */
  getCachedStoreInfo(storeId: string): { id: string; name: string; slug: string } | undefined {
    return this._storeCache.get(storeId);
  }

  constructor() {
    // Load cart and store cache from storage on init
    this.loadFromStorage();
    this.loadStoreCacheFromStorage();

    // Auto-save to storage when cart changes
    effect(() => {
      const items = this._items();
      this.saveToStorage(items);
    });
  }

  /**
   * Open the cart sidebar
   */
  open(): void {
    this._isOpen.set(true);
  }

  /**
   * Close the cart sidebar
   */
  close(): void {
    this._isOpen.set(false);
  }

  /**
   * Toggle cart sidebar
   */
  toggle(): void {
    this._isOpen.update(v => !v);
  }

  /**
   * Add a product to the cart
   */
  addItem(product: Product, quantity: number = 1): void {
    // Cache store info if available on the product
    if (product.store && product.storeId) {
      this.cacheStoreInfo({
        id: product.storeId,
        name: product.store.name,
        slug: product.store.slug,
      });
    }

    const items = this._items();
    const existingIndex = items.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      // Update quantity for existing item
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
      this._items.set(updatedItems);
    } else {
      // Add new item
      this._items.set([...items, { product, quantity, addedAt: new Date() }]);
    }
  }

  /**
   * Remove a product from the cart
   */
  removeItem(productId: string): void {
    this._items.update(items => items.filter(item => item.product.id !== productId));
  }

  /**
   * Update quantity of a product in the cart
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this._items.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  /**
   * Increment quantity of a product
   */
  incrementQuantity(productId: string): void {
    const item = this._items().find(i => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  /**
   * Decrement quantity of a product
   */
  decrementQuantity(productId: string): void {
    const item = this._items().find(i => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  /**
   * Check if a product is in the cart
   */
  isInCart(productId: string): boolean {
    return this._items().some(item => item.product.id === productId);
  }

  /**
   * Get cart item by product ID
   */
  getItem(productId: string): CartItem | undefined {
    return this._items().find(item => item.product.id === productId);
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this._items.set([]);
  }

  /**
   * Load cart from local storage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Restore date objects
        const items = data.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
        this._items.set(items);
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }

  /**
   * Save cart to local storage
   */
  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  /**
   * Load store cache from local storage
   */
  private loadStoreCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORE_CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this._storeCache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load store cache from storage:', error);
    }
  }

  /**
   * Save store cache to local storage
   */
  private saveStoreCacheToStorage(): void {
    try {
      const cacheObj = Object.fromEntries(this._storeCache);
      localStorage.setItem(STORE_CACHE_KEY, JSON.stringify(cacheObj));
    } catch (error) {
      console.error('Failed to save store cache to storage:', error);
    }
  }
}
