'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProductImage from '@/components/ui/ProductImage';
import { Product, ProductDetail } from '@/lib/types';
import { formatPrice, truncateText, cn, generateId } from '@/lib/utils';
import { useViewHistory } from '@/hooks/useViewHistory';
import { BookOpen, ExternalLink, Star, Heart, Share2, Eye } from 'lucide-react';

interface ResponsiveProductCardProps {
  product: Product | ProductDetail;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  onQuickView?: (product: Product | ProductDetail) => void;
  onAddToWishlist?: (product: Product | ProductDetail) => void;
  className?: string;
}

export default function ResponsiveProductCard({
  product,
  variant = 'default',
  showQuickActions = true,
  onQuickView,
  onAddToWishlist,
  className,
}: ResponsiveProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useViewHistory();

  const productData = product as any;
  const detail = productData.detail || {};

  const titleId = generateId('product-title');
  const descriptionId = generateId('product-description');
  const priceId = generateId('product-price');

  const handleCardClick = () => {
    addToHistory({
      id: product.id.toString(),
      title: product.title,
      url: `/products/${product.id}`,
      type: 'product',
      metadata: {
        author: product.author,
        price: product.price,
        imageUrl: product.imageUrl,
        category: productData.category?.title,
      },
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out "${product.title}" by ${product.author}`,
          url: `/products/${product.id}`,
        });
      } catch (error) {
        navigator.clipboard?.writeText(`${window.location.origin}/products/${product.id}`);
      }
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/products/${product.id}`);
    }
  };

 