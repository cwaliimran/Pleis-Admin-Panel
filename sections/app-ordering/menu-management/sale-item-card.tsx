'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { SaleItem } from './types';

interface SaleItemCardProps {
  sale: SaleItem;
}

/**
 * Renders images in a bento grid layout (1, 2, or max 3 images)
 */
const ImageGrid: React.FC<{ images: string[]; title: string }> = ({ images, title }) => {
  const displayImages = images.slice(0, 3);
  const count = displayImages.length;

  if (count === 0) {
    return <div className="flex h-44 w-full items-center justify-center bg-linear-to-br from-pink-500 to-purple-600 text-6xl">🏷️</div>;
  }

  if (count === 1) {
    return (
      <div className="relative h-44 w-full">
        <Image src={displayImages[0]} alt={title} fill className="object-cover" unoptimized />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex h-44 w-full">
        <div className="relative h-full w-1/2 border-r border-white/20">
          <Image src={displayImages[0]} alt={`${title} 1`} fill className="object-cover" unoptimized />
        </div>
        <div className="relative h-full w-1/2">
          <Image src={displayImages[1]} alt={`${title} 2`} fill className="object-cover" unoptimized />
        </div>
      </div>
    );
  }

  // 3 or more images - show first large, other two stacked
  return (
    <div className="flex h-44 w-full">
      <div className="relative h-full w-1/2 border-r border-white/20">
        <Image src={displayImages[0]} alt={`${title} 1`} fill className="object-cover" unoptimized />
      </div>
      <div className="flex h-full w-1/2 flex-col">
        <div className="relative h-1/2 border-b border-white/20">
          <Image src={displayImages[1]} alt={`${title} 2`} fill className="object-cover" unoptimized />
        </div>
        <div className="relative h-1/2">
          <Image src={displayImages[2]} alt={`${title} 3`} fill className="object-cover" unoptimized />
        </div>
      </div>
    </div>
  );
};

export const SaleItemCard: React.FC<SaleItemCardProps> = ({ sale }) => {
  const images = sale.menuItems.map((item) => item.image).filter(Boolean);

  // Calculate discount display
  const discountDisplay = sale.discountType === 'percentage' ? `${sale.discountValue}% OFF` : `€${sale.discountValue.toFixed(2)} OFF`;

  // Calculate time remaining
  const now = new Date();
  const endDate = sale.endDateTime;
  const isActive = sale.status === 'active' && endDate > now;
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#222121]',
        !isActive && 'opacity-60'
      )}
    >
      {/* Image Grid */}
      <div className="relative shrink-0">
        <ImageGrid images={images} title={sale.title} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="rounded-md bg-pink-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase shadow-lg">{discountDisplay}</span>
          {!isActive && <span className="rounded-md bg-gray-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">Inactive</span>}
        </div>

        {/* Item count badge */}
        <div className="absolute right-3 bottom-3">
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            {sale.itemCount} item{sale.itemCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">{sale.title}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{sale.menuItems.map((item) => item.title).join(', ')}</div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">€{sale.totalPrice.toFixed(2)}</span>
          <span className="text-lg text-gray-400 line-through">€{sale.totalPriceBeforeDiscount.toFixed(2)}</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Save €{(sale.totalPriceBeforeDiscount - sale.totalPrice).toFixed(2)}
          </span>
        </div>

        {/* Date Range */}
        <div className="mb-4 space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>
              {formatDate(sale.startDateTime)} - {formatDate(sale.endDateTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>
              {formatTime(sale.startDateTime)} - {formatTime(sale.endDateTime)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-auto flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <span className={cn('h-2.5 w-2.5 rounded-full', isActive ? 'bg-green-500' : 'bg-gray-400')}></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isActive ? 'Active' : 'Inactive'}</span>
          </div>
          {isActive && daysRemaining > 0 && (
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleItemCard;
