'use client';

import LiveProductSearch from '@/components/product/LiveProductSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Zap, Shield, Clock, TrendingUp } from 'lucide-react';

export default function LiveSearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <Zap className="mr-3 h-8 w-8 text-yellow-500" />
          Live Product Search
        </h1>
        <p className="text-gray-600 text-lg">
          Search real-time product data directly from World of Books with live pricing and availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              Real-time Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Live product information with current pricing and stock levels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              Rate Limited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Ethical API usage with built-in rate limiting and caching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              Cached Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Smart caching reduces API calls and improves performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-purple-500" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">
              Filter by author, publisher, price range, and book condition
            </p>
          </CardContent>
        </Card>
      </div>

      <LiveProductSearch />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Ethical Usage</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Rate limiting: Max 60 requests per minute</li>
                  <li>• Minimum 1 second between requests</li>
                  <li>• Automatic retry with exponential backoff</li>
                  <li>• Respectful of World of Books' resources</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5-minute cache for repeated searches</li>
                  <li>• Compressed API responses</li>
                  <li>• Optimized query parameters</li>
                  <li>• Error handling and fallbacks</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                This integration uses World of Books' public Algolia search API in compliance with their terms of service.
                All requests are rate-limited and cached to minimize server load.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}