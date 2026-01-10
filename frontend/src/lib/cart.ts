import { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

class CartManager {
  private static instance: CartManager;
  private cart: Cart = { items: [], total: 0, itemCount: 0 };
  private listeners: ((cart: Cart) => void)[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.cart = {
            ...parsed,
            items: parsed.items.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt)
            }))
          };
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  private updateTotals() {
    this.cart.itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.total = this.cart.items.reduce((sum, item) => {
      const price = parseFloat((item.product.price || '0').toString());
      return sum + (price * item.quantity);
    }, 0);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.cart));
  }

  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.items.push({
        product,
        quantity,
        addedAt: new Date()
      });
    }

    this.updateTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  removeItem(productId: number): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.updateTotals();
    this.saveToStorage();
    this.notifyListeners();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.cart.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateTotals();
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearCart(): void {
    this.cart = { items: [], total: 0, itemCount: 0 };
    this.saveToStorage();
    this.notifyListeners();
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  subscribe(listener: (cart: Cart) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  isInCart(productId: number): boolean {
    return this.cart.items.some(item => item.product.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }
}

export const cartManager = CartManager.getInstance();