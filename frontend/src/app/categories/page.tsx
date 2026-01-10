'use client';

import { useNavigation, useCategories } from '@/lib/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { CategoryCardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CategoriesPage() {
  const { navigation, isLoading: navLoading, isError: navError } = useNavigation();
  const { categories, isLoading: catLoading, isError: catError } = useCategories();

  if (navError || catError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load categories
          </h2>
          <p className="text-gray-600 mb-8">
            There was an error loading the categories. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Browse Categories
        </h1>
        <p className="text-gray-600">
          Explore our extensive collection of books organized by categories from World of Books.
        </p>
      </div>

      {/* Navigation Items */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Main Categories
        </h2>
        
        {navLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : navigation && navigation.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigation
              .filter((item) => item.title !== 'Books')
              .map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>
                    Explore {item.title.toLowerCase()} collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Link href={`/products?navigation=${item.slug}`}>
                      <Button variant="outline" size="sm">
                        View Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories available
            </h3>
            <p className="text-gray-600 mb-6">
              Categories will appear here once data is loaded.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Categories
        </h2>
        
        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories && categories.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.data.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.productCount} products available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/products?category=${category.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subcategories available
            </h3>
            <p className="text-gray-600 mb-6">
              Subcategories will appear here once data is loaded.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}