'use client';

import { Calendar, Package, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const PricingSectionSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Module Pricing Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Commission Settings Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Discounts Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="mb-4 h-4 w-full max-w-md" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Organization Pricing Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <Skeleton className="h-6 w-52" />
        </div>
        <Skeleton className="mb-4 h-4 w-full max-w-xs" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Discount Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-[#1a1a1a]">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-600" />
          <Skeleton className="h-6 w-56" />
        </div>
        <Skeleton className="mb-4 h-4 w-full max-w-sm" />
        <div className="max-w-xs space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>

      {/* Save Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  );
};
