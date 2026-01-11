'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, TrendingUp, Users, Star, ArrowRight, Filter, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/lib/hooks/useApi';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { useRouter } from 'next/navigation';
import { useSuccessToast } from '@/components/ui/Toast';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const successToast = useSuccessToast();

  const { products: featuredProducts, isLoading: featuredLoading } = useProducts(
    undefined, 
    1, 
    8, 
    { sortBy: 'id', sortOrder: 'DESC' }
  );

  const { products: popularProducts, isLoading: popularLoading } = useProducts(
    undefined, 
    1, 
    4, 
    { sortBy: 'id', sortOrder: 'ASC' }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      successToast('Search initiated', `Searching for "${searchQuery.trim()}"`);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Products', value: '2,500+', description: 'Curated collection' },
    { icon: Users, label: 'Categories', value: '12+', description: 'Diverse selection' },
    { icon: Star, label: 'Reviews', value: '12K+', description: 'Customer feedback' },
    { icon: TrendingUp, label: 'Updated', value: 'Daily', description: 'Fresh content' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find exactly what you\'re looking for with powerful filters and search capabilities.',
      href: '/search'
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Filter by price, author, category, availability, and more to narrow down results.',
      href: '/products'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get the latest product information with our live data synchronization.',
      href: '/live-books'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Next
              <span className="text-blue-600 block">Great Read</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive collection of books with advanced search, 
              detailed information, and real-time availability updates.
            </p>

            {/* Hero Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 transition-colors ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <Input
                  type="text"
                  placeholder="Search for books, authors, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-13 pr-4 py-5 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-lg"
                  aria-label="Search products"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-0.5 bottom-2 px-5 rounded-lg"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button variant="outline" size="lg" className="rounded-xl">
                  Browse All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="ghost" size="lg" className="rounded-xl">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-lg font-medium text-gray-700 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find and explore products efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4 group-hover:bg-blue-200 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Link href={feature.href}>
                      <Button variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Discover our latest and most popular items
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts?.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.data.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Choices
            </h2>
            <p className="text-xl text-gray-600">
              See what others are reading
            </p>
          </div>

          {popularLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : popularProducts?.data ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.data.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No popular products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Exploring?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of readers who have discovered their next favorite book through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50 rounded-xl">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="ghost" className="text-white border-white hover:bg-blue-700 rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}