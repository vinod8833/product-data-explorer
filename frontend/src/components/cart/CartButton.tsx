'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Product } from '@/lib/types';
import { cartManager, Cart } from '@/lib/cart';

interface CartButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
}

export default function CartButton({ 
  product, 
  variant = 'primary', 
  size = 'md',
  showQuantity = false 
}: CartButtonProps) {
  const [cart, setCart] = useState<Cart>(cartManager.getCart());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = cartManager.subscribe(setCart);
    return unsubscribe;
  }, []);

  const isInCart = cartManager.isInCart(product.id);
  const quantity = cartManager.getItemQuantity(product.id);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      cartManager.addItem(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    cartManager.updateQuantity(product.id, newQuantity);
  };

  const handleRemoveFromCart = () => {
    cartManager.removeItem(product.id);
  };

  if (isInCart && showQuantity) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={isLoading}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateQuantity(quantity + 1)}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveFromCart}
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </Button>
      </div>
    );
  }

  if (isInCart) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleRemoveFromCart}
        disabled={isLoading}
        className="border-green-500 text-green-600 hover:bg-green-50"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        In Cart ({quantity})
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading || !product.inStock}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  );
}