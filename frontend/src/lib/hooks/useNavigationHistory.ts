import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NavigationState {
  path: string;
  query: Record<string, string>;
  timestamp: number;
  title?: string;
}

const HISTORY_KEY = 'navigation_history';
const MAX_HISTORY_ITEMS = 50;

export function useNavigationHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<NavigationState[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load navigation history:', error);
      }
    }
  }, []);

  const saveCurrentState = useCallback((title?: string) => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const currentQuery: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      currentQuery[key] = value;
    });

    const newState: NavigationState = {
      path: currentPath,
      query: currentQuery,
      timestamp: Date.now(),
      title: title || document.title
    };

    setHistory(prev => {
      if (prev.length > 0 && prev[0].path === currentPath) {
        const prevQuery = JSON.stringify(prev[0].query);
        const currentQueryStr = JSON.stringify(currentQuery);
        if (prevQuery === currentQueryStr) {
          return prev;
        }
      }

      const updated = [newState, ...prev].slice(0, MAX_HISTORY_ITEMS);
      
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save navigation history:', error);
      }
      
      return updated;
    });
  }, [searchParams]);

  const navigateToState = useCallback((state: NavigationState) => {
    const queryString = new URLSearchParams(state.query).toString();
    const fullPath = queryString ? `${state.path}?${queryString}` : state.path;
    router.push(fullPath);
  }, [router]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const getRecentSearches = useCallback(() => {
    return history
      .filter(item => item.query.q || item.query.search)
      .slice(0, 10)
      .map(item => ({
        query: item.query.q || item.query.search || '',
        timestamp: item.timestamp,
        path: item.path
      }));
  }, [history]);

  const getRecentCategories = useCallback(() => {
    return history
      .filter(item => item.path.includes('/categories/') || item.query.category)
      .slice(0, 10)
      .map(item => ({
        category: item.query.category || item.path.split('/').pop() || '',
        timestamp: item.timestamp,
        path: item.path
      }));
  }, [history]);

  return {
    history,
    saveCurrentState,
    navigateToState,
    clearHistory,
    getRecentSearches,
    getRecentCategories
  };
}