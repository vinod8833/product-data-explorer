'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Product } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

export interface WishlistItem extends Product {
  addedAt: number;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product, priority?: 'low' | 'medium' | 'high') => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
  clearWishlist: () => void;
  updatePriority: (productId: number, priority: 'low' | 'medium' | 'high') => void;
  updateNotes: (productId: number, notes: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_KEY = 'product-wishlist';

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addToast } = useToast();
  
  const isUpdatingFromStorage = useRef(false);
  const lastActionRef = useRef<{ type: string; productId?: number; timestamp: number } | null>(null);
  const pendingActionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem(WISHLIST_KEY);
        if (saved) {
          const items = JSON.parse(saved);
          isUpdatingFromStorage.current = true;
          setWishlistItems(items);
        }
      } catch (error) {
        console.warn('Failed to load wishlist from localStorage:', error);
      } finally {
        setIsInitialized(true);
        setTimeout(() => {
          isUpdatingFromStorage.current = false;
        }, 100);
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      if (wishlistItems.length > 0) {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
      } else {
        localStorage.removeItem(WISHLIST_KEY);
      }
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }, [wishlistItems, isInitialized]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_KEY) {
        try {
          const newItems = e.newValue ? JSON.parse(e.newValue) : [];
          isUpdatingFromStorage.current = true;
          setWishlistItems(newItems);
          setTimeout(() => {
            isUpdatingFromStorage.current = false;
          }, 100);
        } catch (error) {
          console.warn('Failed to sync wishlist from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const shouldShowToast = useCallback((actionType: string, productId?: number) => {
    const now = Date.now();
    const lastAction = lastActionRef.current;
    
    if (isUpdatingFromStorage.current) {
      console.log('[WishlistContext] Skipping toast - updating from storage');
      return false;
    }
    
    if (lastAction && 
        lastAction.type === actionType && 
        lastAction.productId === productId && 
        now - lastAction.timestamp < 1000) {
      console.log('[WishlistContext] Skipping toast - duplicate action within 1s');
      return false;
    }
    
    lastActionRef.current = { type: actionType, productId, timestamp: now };
    console.log('[WishlistContext] Showing toast for action:', actionType, productId);
    return true;
  }, []);

  const addToWishlist = useCallback((product: Product, priority: 'low' | 'medium' | 'high' = 'medium') => {
    console.log('[WishlistContext] addToWishlist called for product:', product.id, product.title);
    
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        console.log('[WishlistContext] Product already exists in wishlist');
        if (shouldShowToast('already-exists', product.id)) {
          addToast({
            type: 'info',
            title: 'Already in wishlist',
            description: `"${product.title}" is already in your wishlist`,
            duration: 3000
          });
        }
        return prev;
      }

      const newItem: WishlistItem = {
        ...product,
        addedAt: Date.now(),
        priority,
        notes: ''
      };

      const updated = [newItem, ...prev];
      console.log('[WishlistContext] Adding product to wishlist, new count:', updated.length);
      
      if (shouldShowToast('add', product.id)) {
        addToast({
          type: 'success',
          title: 'Added to wishlist',
          description: `"${product.title}" `,
          duration: 3000,
        });
      }
      
      return updated;
    });
  }, [addToast, shouldShowToast]);

  const removeFromWishlist = useCallback((productId: number) => {
    console.log('[WishlistContext] removeFromWishlist called for product:', productId);
    
    setWishlistItems(prev => {
      const itemToRemove = prev.find(item => item.id === productId);
      const updated = prev.filter(item => item.id !== productId);
      
      console.log('[WishlistContext] Removing product from wishlist, new count:', updated.length);
      
      if (itemToRemove && shouldShowToast('remove', productId)) {
        addToast({
          type: 'success',
          title: 'Removed from wishlist',
          description: `"${itemToRemove.title}" `,
          duration: 3000
        });
      }
      
      return updated;
    });
  }, [addToast, shouldShowToast]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    const count = wishlistItems.length;
    setWishlistItems([]);
    
    if (count > 0 && shouldShowToast('clear')) {
      addToast({
        type: 'success',
        title: 'Wishlist cleared',
        description: `Removed ${count} ${count === 1 ? 'item' : 'items'} from your wishlist`,
        duration: 3000
      });
    }
  }, [wishlistItems.length, addToast, shouldShowToast]);

  const updatePriority = useCallback((productId: number, priority: 'low' | 'medium' | 'high') => {
    setWishlistItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, priority } : item
      )
    );
  }, []);

  const updateNotes = useCallback((productId: number, notes: string) => {
    setWishlistItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, notes } : item
      )
    );
  }, []);

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    updatePriority,
    updateNotes,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}