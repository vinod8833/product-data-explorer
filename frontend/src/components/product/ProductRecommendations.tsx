'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Sparkles, RefreshCw, TrendingUp, Users, BookOpen } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProduct?: Product;
  userId?: string;
  limit?: number;
}

interface RecommendationSection {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  type: 'similar' | 'trending' | 'popular' | 'author';
}

export default function ProductRecommendations({ 
  currentProduct, 
  userId, 
  limit = 8 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('similar');

  useEffect(() => {
    fetchRecommendations();
  }, [currentProduct, userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const [similarProducts, trendingProducts, popularProducts, authorProducts] = await Promise.all([
        fetchSimilarProducts(currentProduct, limit),
        fetchTrendingProducts(limit),
        fetchPopularProducts(limit),
        fetchAuthorProducts(currentProduct?.author, limit),
      ]);

      const sections: RecommendationSection[] = [
        {
          title: 'Similar Books',
          icon: <BookOpen className="h-4 w-4" />,
          products: similarProducts,
          type: 'similar',
        },
        {
          title: 'Trending Now',
          icon: <TrendingUp className="h-4 w-4" />,
          products: trendingProducts,
          type: 'trending',
        },
        {
          title: 'Popular Choices',
          icon: <Users className="h-4 w-4" />,
          products: popularProducts,
          type: 'popular',
        },
      ];

      if (authorProducts.length > 0) {
        sections.push({
          title: `More by ${currentProduct?.author}`,
          icon: <Sparkles className="h-4 w-4" />,
          products: authorProducts,
          type: 'author',
        });
      }

      setRecommendations(sections);
      setActiveTab(sections[0]?.type || 'similar');
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeSection = recommendations.find(section => section.type === activeTab);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-md mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Recommendations
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchRecommendations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {recommendations.map((section) => (
            <Button
              key={section.type}
              variant={activeTab === section.type ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab(section.type)}
              className="flex items-center"
            >
              {section.icon}
              <span className="ml-1">{section.title}</span>
              <span className="ml-1 text-xs opacity-70">
                ({section.products.length})
              </span>
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {activeSection && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeSection.products.map((product) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        {activeSection && activeSection.products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recommendations available for this category.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function fetchSimilarProducts(product?: Product, limit: number = 8): Promise<Product[]> {
  if (!product) return [];
  
  try {
    const response = await fetch(`/api/products?author=${encodeURIComponent(product.author || '')}&limit=${limit}`);
    const data = await response.json();
    return data.data?.filter((p: Product) => p.id !== product.id).slice(0, limit) || [];
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
}

async function fetchTrendingProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?sortBy=id&sortOrder=DESC&limit=${limit}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}

async function fetchPopularProducts(limit: number = 8): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?sortBy=rating&sortOrder=DESC&limit=${limit}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

async function fetchAuthorProducts(author?: string, limit: number = 8): Promise<Product[]> {
  if (!author) return [];
  
  try {
    const response = await fetch(`/api/products?author=${encodeURIComponent(author)}&limit=${limit}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching author products:', error);
    return [];
  }
}