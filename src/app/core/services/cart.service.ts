import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

const CART_STORAGE_KEY = 'storefront_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<CartItem[]>([]);
  private _isOpen = signal(false);

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

  constructor() {
    // Load cart from storage on init
    this.loadFromStorage();

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
}
