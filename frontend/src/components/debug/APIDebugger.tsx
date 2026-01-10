import { useEffect } from 'react';
import { useProducts } from '@/lib/hooks/useApi';
import { SearchFilters } from '@/lib/types';

interface APIDebuggerProps {
  categoryId?: number;
  filters: SearchFilters;
  itemsPerPage?: number;
}

export default function APIDebugger({ categoryId, filters, itemsPerPage = 20 }: APIDebuggerProps) {
  const { products, isLoading, isError } = useProducts(categoryId, 1, itemsPerPage, filters);

  useEffect(() => {
    if (products) {
      console.log(' API Debug - Products received:', {
        total: products.total,
        page: products.page,
        dataLength: products.data.length,
        hasNext: products.hasNext,
        filters,
        categoryId,
        firstFiveProducts: products.data.slice(0, 5).map(p => ({
          id: p.id,
          title: p.title,
          author: p.author,
          price: p.price,
          imageUrl: p.imageUrl,
          hasDetail: !!(p as any).detail
        }))
      });

      const ids = products.data.map(p => p.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn(' Duplicate product IDs found!', {
          totalProducts: ids.length,
          uniqueIds: uniqueIds.size,
          duplicates: ids.filter((id, index) => ids.indexOf(id) !== index)
        });
      }

      const titles = products.data.map(p => p.title);
      const titleCounts = titles.reduce((acc, title) => {
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const duplicateTitles = Object.entries(titleCounts).filter(([_, count]) => count > 1);
      if (duplicateTitles.length > 0) {
        console.log(' Title distribution:', titleCounts);
        console.log(' Duplicate titles (normal for bookstore):', duplicateTitles);
      }

      products.data.slice(0, 3).forEach(async (product, index) => {
        if (product.imageUrl) {
          try {
            const img = new Image();
            img.onload = () => console.log(` Image ${index + 1} loaded:`, product.imageUrl);
            img.onerror = () => console.error(` Image ${index + 1} failed:`, product.imageUrl);
            img.src = product.imageUrl;
          } catch (error) {
            console.error(` Image ${index + 1} error:`, error);
          }
        }
      });
    }

    if (isError) {
      console.error(' API Error:', isError);
    }

    if (isLoading) {
      console.log(' Loading products...');
    }
  }, [products, isError, isLoading, categoryId, filters]);

  return null;
}