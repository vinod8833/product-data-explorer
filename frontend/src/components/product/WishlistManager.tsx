'use client';

import { useState, useEffect, useCallback } from 'react';
import { Heart, X, Share2, ShoppingCart, Filter, SortAsc, Grid, List } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import ProductImage from '@/components/ui/ProductImage';
import Button from '@/components/ui/Button';
import { useViewHistory } from '@/hooks/useViewHistory';
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';

interface WishlistManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortOption = 'addedAt' | 'title' | 'author' | 'price' | 'priority';
type ViewMode = 'grid' | 'list';

export default function WishlistManager({ isOpen, onClose }: WishlistManagerProps) {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    clearWishlist, 
    updatePriority, 
    updateNotes 
  } = useWishlist();
  
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const { addToHistory } = useViewHistory();

  useEffect(() => {
    let filtered = [...wishlistItems];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query)
      );
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    filtered = filtered.filter(item => {
      if (!item.price) return true;
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return price >= priceRange.min && price <= priceRange.max;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'addedAt':
          aValue = a.addedAt;
          bValue = b.addedAt;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author?.toLowerCase() || '';
          bValue = b.author?.toLowerCase() || '';
          break;
        case 'price':
          aValue = typeof a.price === 'string' ? parseFloat(a.price) || 0 : a.price || 0;
          bValue = typeof b.price === 'string' ? parseFloat(b.price) || 0 : b.price || 0;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          aValue = a.addedAt;
          bValue = b.addedAt;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredItems(filtered);
  }, [wishlistItems, searchQuery, sortBy, sortOrder, priorityFilter, priceRange]);

  const handleClearWishlist = useCallback(() => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  }, [clearWishlist]);

  const shareWishlist = useCallback(async () => {
    const wishlistData = {
      items: wishlistItems.map(item => ({
        id: item.id,
        title: item.title,
        author: item.author,
        price: item.price,
        currency: item.currency,
        priority: item.priority,
        notes: item.notes
      })),
      createdAt: Date.now()
    };

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Book Wishlist',
          text: `Check out my wishlist of ${wishlistItems.length} books!`,
          url: window.location.origin + '/wishlist?shared=' + btoa(JSON.stringify(wishlistData))
        });
      } else {
        const shareUrl = window.location.origin + '/wishlist?shared=' + btoa(JSON.stringify(wishlistData));
        await navigator.clipboard.writeText(shareUrl);
        alert('Wishlist link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share wishlist:', error);
      alert('Failed to share wishlist. Please try again.');
    }
  }, [wishlistItems]);

  const viewProduct = useCallback((item: WishlistItem) => {
    addToHistory({
      id: item.id.toString(),
      title: item.title,
      url: `/products/${item.id}`,
      type: 'product',
      metadata: {
        author: item.author,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        imageUrl: item.imageUrl
      }
    });
    window.open(`/products/${item.id}`, '_blank');
  }, [addToHistory]);

  const startEditingNotes = (item: WishlistItem) => {
    setEditingNotes(item.id);
    setTempNotes(item.notes || '');
  };

  const saveNotes = () => {
    if (editingNotes) {
      updateNotes(editingNotes, tempNotes);
      setEditingNotes(null);
      setTempNotes('');
    }
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setTempNotes('');
  };

  if (!isOpen) return null;

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return '';
      case 'medium': return '';
      case 'low': return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Heart className="h-6 w-6 mr-3 text-red-500 fill-current" />
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              {wishlistItems.length} items
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {wishlistItems.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={shareWishlist}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearWishlist}>
                  Clear All
                </Button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {wishlistItems.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="addedAt">Date Added</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="price">Price</option>
                  <option value="priority">Priority</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high"> High Priority</option>
                <option value="medium"> Medium Priority</option>
                <option value="low"> Low Priority</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} transition-colors`}
                  title="Grid View"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} transition-colors`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {wishlistItems.length === 0 ? 'Your wishlist is empty' : 'No items match your filters'}
              </h3>
              <p className="text-gray-600">
                {wishlistItems.length === 0 
                  ? 'Start adding books you love to your wishlist!'
                  : 'Try adjusting your search or filters to find items.'
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-[3/4] relative mb-4 bg-gray-100 rounded-md overflow-hidden">
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                          {getPriorityIcon(item.priority)} {item.priority}
                        </div>
                        
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 p-1 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full text-red-500 hover:text-red-700 transition-colors"
                          title="Remove from wishlist"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.author && (
                          <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
                        )}
                        
                        {item.price && (
                          <p className="text-lg font-semibold text-green-600 mb-3">
                            {formatPrice(typeof item.price === 'string' ? parseFloat(item.price) : item.price, item.currency)}
                          </p>
                        )}

                        <div className="mb-3">
                          {editingNotes === item.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Add notes..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={saveNotes}>Save</Button>
                                <Button size="sm" variant="outline" onClick={cancelEditingNotes}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditingNotes(item)}
                              className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded border border-dashed border-gray-300 min-h-[2.5rem] flex items-center"
                            >
                              {item.notes || 'Click to add notes...'}
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <select
                            value={item.priority}
                            onChange={(e) => updatePriority(item.id, e.target.value as any)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="low"> Low Priority</option>
                            <option value="medium"> Medium Priority</option>
                            <option value="high"> High Priority</option>
                          </select>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => viewProduct(item)}
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          {item.sourceUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(item.sourceUrl, '_blank')}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0">
                        <ProductImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            {item.author && (
                              <p className="text-sm text-gray-600">by {item.author}</p>
                            )}
                            {item.price && (
                              <p className="text-lg font-semibold text-green-600">
                                {formatPrice(typeof item.price === 'string' ? parseFloat(item.price) : item.price, item.currency)}
                              </p>
                            )}
                            {item.notes && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.notes}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                              {getPriorityIcon(item.priority)}
                            </span>
                            
                            <Button size="sm" onClick={() => viewProduct(item)}>
                              View
                            </Button>
                            
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Remove from wishlist"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}