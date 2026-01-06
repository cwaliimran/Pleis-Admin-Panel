'use client';

import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';

interface CustomBadgeProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'info' | 'warning' | 'default';
  className?: string;
}

const CustomBadge: FC<CustomBadgeProps> = ({ children, variant = 'default', className }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-700 bg-green-100';
      case 'error':
        return 'text-red-700 bg-red-100';
      case 'info':
        return 'text-blue-700 bg-blue-100';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100';
      case 'default':
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'flex items-center rounded-full px-3 py-1 text-[12px] font-medium tracking-wide capitalize transition-colors',
        getVariantStyles(),
        className
      )}
    >
      {children}
    </button>
  );
};

export default CustomBadge;
