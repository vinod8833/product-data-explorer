import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    loadingText,
    fullWidth = false,
    children, 
    disabled, 
    type = 'button',
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-lg font-medium',
      'transition-all duration-200 ease-in-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
      'active:scale-[0.98]',
      fullWidth && 'w-full'
    ].filter(Boolean).join(' ');
    
    const variants = {
      primary: [
        'bg-blue-600 text-white shadow-sm',
        'hover:bg-blue-700 hover:shadow-md',
        'focus-visible:ring-blue-500',
        'active:bg-blue-800'
      ].join(' '),
      secondary: [
        'bg-gray-600 text-white shadow-sm',
        'hover:bg-gray-700 hover:shadow-md',
        'focus-visible:ring-gray-500',
        'active:bg-gray-800'
      ].join(' '),
      outline: [
        'border-2 border-gray-300 bg-white text-gray-700 shadow-sm',
        'hover:bg-gray-50 hover:border-gray-400',
        'focus-visible:ring-gray-500',
        'active:bg-gray-100'
      ].join(' '),
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100',
        'focus-visible:ring-gray-500',
        'active:bg-gray-200'
      ].join(' '),
      destructive: [
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 hover:shadow-md',
        'focus-visible:ring-red-500',
        'active:bg-red-800'
      ].join(' ')
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 py-2 gap-2',
      lg: 'h-12 px-6 text-lg gap-2.5',
    };

    const content = isLoading ? (
      <>
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>{loadingText || 'Loading...'}</span>
      </>
    ) : (
      children
    );

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        type={type}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;