'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { CATEGORY_ICONS } from './constants';
import DescModal from './modals/desc-modal';
import { MenuItemCardProps } from './types';

const DESCRIPTION_MAX_LENGTH = 100;

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onEdit, onToggleStock }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysUntilEnd = item.limitedTimeEnd ? Math.ceil((item.limitedTimeEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
  const categoryIcon = CATEGORY_ICONS[item.category] || '🍽️';
  const shouldTruncate = item.description && item.description.length > DESCRIPTION_MAX_LENGTH;

  return (
    <>
      <div
        className={cn(
          'group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#222121]',
          !item.isInStock && 'opacity-60'
        )}
      >
        <div className="relative flex h-44 shrink-0 items-center justify-center bg-linear-to-br from-[#2a599b] to-[#1300FF] text-6xl">
          {categoryIcon}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.isLimitedTime && (
              <span className="rounded-md bg-orange-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">Limited Time</span>
            )}
            {item.isUpsell && <span className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">Upsell</span>}
            {!item.isInStock && (
              <span className="rounded-md bg-red-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">Out of Stock</span>
            )}
            {item.isPreorder && item.isInStock && (
              <span className="rounded-md bg-green-600 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">Preorder</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex grow flex-col p-5">
          <div className="flex grow flex-col">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
                <div className="text-sm font-semibold text-gray-500 capitalize dark:text-gray-500">
                  {item.category}
                  {item.isLimitedTime && ' • Promotional'}
                </div>
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">€{item.price.toFixed(2)}</div>
            </div>

            {/* Description Handling */}
            {item.description && (
              <div className="mb-4 flex flex-col">
                <p className={cn('text-sm leading-relaxed text-gray-600 dark:text-gray-400', shouldTruncate && 'line-clamp-2 overflow-hidden')}>
                  {item.description}
                </p>

                {shouldTruncate && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-1 cursor-pointer self-start text-xs font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-400"
                  >
                    See more →
                  </button>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="mb-4 flex gap-4 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>{item.isInStock ? '📦' : '❌'}</span>
                <span>{item.isInStock ? 'In Stock' : 'Currently Unavailable'}</span>
              </div>

              {item.isLimitedTime && item.limitedTimeEnd && (
                <div className="flex items-center gap-1.5">
                  <span>⏰</span>
                  <span>Ends in {daysUntilEnd} days</span>
                </div>
              )}

              {!item.isLimitedTime && (
                <div className="flex items-center gap-1.5">
                  <span>📊</span>
                  <span>{item.soldCount} sold</span>
                </div>
              )}
            </div>

            {/* Special Status for Preorder Unlock */}
            {item.availabilityType === 'preorder-unlock' && (
              <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
                <span>🔒</span>
                <span>Preorder Exclusive</span>
              </div>
            )}
          </div>

          {/* Out of Stock Toggle */}
          <div className="mb-0 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Out of Stock</span>
            <button
              title="Out of stock"
              type="button"
              // role="switch"
              // aria-checked={!item.isInStock}
              onClick={() => onToggleStock(item)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
                !item.isInStock ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  !item.isInStock ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            <Button variant="default" onClick={() => onEdit(item)} className="h-10 gap-1.5 font-semibold">
              Edit
            </Button>
            <Button
              variant={item.isInStock ? 'default' : 'destructive'}
              onClick={() => onToggleStock(item)}
              className={cn(
                'h-10 gap-1.5 font-semibold',
                item.isInStock && 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
              )}
            >
              {item.isInStock ? <>In Stock</> : <>Restock</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal component */}
      <DescModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={item.name}>
        {item.description}
      </DescModal>
    </>
  );
};
