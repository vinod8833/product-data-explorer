'use client';

import { useEffect, useState } from 'react';
import APITester from './APITester';
import APIDebugger from './APIDebugger';
import ProductListDebug from './ProductListDebug';
import ImageTester from './ImageTester';
import ImageDebugger from './ImageDebugger';
import { Product } from '@/lib/types';

interface ConditionalDebugComponentsProps {
  products: Product[];
  categoryId?: string | number;
  filters?: any;
  itemsPerPage?: number;
}

export default function ConditionalDebugComponents({ 
  products, 
  categoryId, 
  filters, 
  itemsPerPage 
}: ConditionalDebugComponentsProps) {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowDebug(window.location.search.includes('debug=components'));
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !showDebug) {
    return null;
  }

  return (
    <>
      <APITester />
      <APIDebugger 
        categoryId={typeof categoryId === 'string' ? parseInt(categoryId) : categoryId} 
        filters={filters} 
        itemsPerPage={itemsPerPage} 
      />
      <ProductListDebug products={products} />
      <ImageTester products={products.slice(0, 5)} />
      <ImageDebugger products={products} />
    </>
  );
}