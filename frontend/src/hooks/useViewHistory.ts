'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFromStorage, setToStorage } from '@/lib/utils';

interface ViewHistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
  type: 'product' | 'category' | 'search';
  metadata?: {
    author?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    searchQuery?: string;
  };
}

interface UseViewHistoryReturn {
  history: ViewHistoryItem[];
  addToHistory: (item: Omit<ViewHistoryItem, 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getRecentItems: (count?: number) => ViewHistoryItem[];
  getItemsByType: (type: ViewHistoryItem['type']) => ViewHistoryItem[];
}

const HISTORY_KEY = 'browsing-history';
const MAX_HISTORY_ITEMS = 100;

export function useViewHistory(): UseViewHistoryReturn {
  const [history, setHistory] = useState<ViewHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = getFromStorage<ViewHistoryItem[]>(HISTORY_KEY, []);
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    setToStorage(HISTORY_KEY, history);
  }, [history]);

  const addToHistory = useCallback((item: Omit<ViewHistoryItem, 'timestamp'>) => {
    setHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(historyItem => historyItem.id !== item.id);
      
      const newHistory = [
        {
          ...item,
          timestamp: Date.now(),
        },
        ...filteredHistory,
      ];

      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getRecentItems = useCallback((count: number = 10) => {
    return history.slice(0, count);
  }, [history]);

  const getItemsByType = useCallback((type: ViewHistoryItem['type']) => {
    return history.filter(item => item.type === type);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentItems,
    getItemsByType,
  };
}

interface NavigationState {
  currentPage: number;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  searchQuery: string;
}

interface UseNavigationStateReturn {
  navigationState: NavigationState;
  updateNavigationState: (updates: Partial<NavigationState>) => void;
  resetNavigationState: () => void;
}

const NAVIGATION_KEY = 'navigation-state';

const defaultNavigationState: NavigationState = {
  currentPage: 1,
  filters: {},
  sortBy: 'id',
  sortOrder: 'DESC',
  searchQuery: '',
};

export function useNavigationState(): UseNavigationStateReturn {
  const [navigationState, setNavigationState] = useState<NavigationState>(defaultNavigationState);

  useEffect(() => {
    const savedState = getFromStorage<NavigationState>(NAVIGATION_KEY, defaultNavigationState);
    setNavigationState(savedState);
  }, []);

  useEffect(() => {
    setToStorage(NAVIGATION_KEY, navigationState);
  }, [navigationState]);

  const updateNavigationState = useCallback((updates: Partial<NavigationState>) => {
    setNavigationState(prevState => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  const resetNavigationState = useCallback(() => {
    setNavigationState(defaultNavigationState);
  }, []);

  return {
    navigationState,
    updateNavigationState,
    resetNavigationState,
  };
}

interface UseScrollPositionReturn {
  saveScrollPosition: (key: string) => void;
  restoreScrollPosition: (key: string) => void;
  clearScrollPosition: (key: string) => void;
}

const SCROLL_KEY_PREFIX = 'scroll-position-';

export function useScrollPosition(): UseScrollPositionReturn {
  const saveScrollPosition = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY;
      setToStorage(`${SCROLL_KEY_PREFIX}${key}`, scrollY);
    }
  }, []);

  const restoreScrollPosition = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      const scrollY = getFromStorage<number>(`${SCROLL_KEY_PREFIX}${key}`, 0);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
  }, []);

  const clearScrollPosition = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${SCROLL_KEY_PREFIX}${key}`);
    }
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
  };
}