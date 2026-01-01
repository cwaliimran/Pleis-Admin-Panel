'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const QRCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border-2 border-transparent bg-white p-7 shadow-sm dark:bg-[#222121]">
      {/* Icon skeleton */}
      <Skeleton className="mb-4 h-14 w-14 rounded-lg" />

      {/* Title skeleton */}
      <Skeleton className="mb-2 h-7 w-3/4" />

      {/* Description skeleton */}
      <div className="mb-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Features skeleton */}
      <ul className="mb-5 space-y-2">
        {[1, 2, 3].map((index) => (
          <li key={index} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </li>
        ))}
      </ul>

      {/* Button skeleton */}
      <Skeleton className="h-11 w-full rounded-md" />
    </div>
  );
};

export const QRCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <QRCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const SavedQRCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm dark:bg-[#222121]">
      {/* QR Code Image skeleton */}
      <Skeleton className="mb-4 h-48 w-full rounded-lg" />

      {/* Label skeleton */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Type skeleton */}
      <Skeleton className="mb-4 h-4 w-1/2" />

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  );
};

export const SavedQRCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SavedQRCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const EmptyState: React.FC = () => (
  <div className="py-16 text-center">
    <div className="mb-4 text-6xl opacity-30" aria-hidden="true">
      📦
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No QR Codes Yet</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">Generate your first QR code using the cards above</p>
  </div>
);
