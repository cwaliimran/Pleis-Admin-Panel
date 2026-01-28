import React from 'react';

export const SaleItemCardSkeleton: React.FC = () => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#222121]">
      {/* Image skeleton */}
      <div className="relative h-44 shrink-0 animate-pulse bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-20 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
        </div>
        {/* Item count skeleton */}
        <div className="absolute right-3 bottom-3">
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex grow flex-col p-5">
        {/* Title skeleton */}
        <div className="mb-3">
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Price skeleton */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Date skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>

        {/* Status skeleton */}
        <div className="mt-auto flex h-12 animate-pulse items-center rounded-lg bg-gray-100 dark:bg-gray-800"></div>
      </div>
    </div>
  );
};

interface SaleItemSkeletonGridProps {
  count?: number;
}

export const SaleItemSkeletonGrid: React.FC<SaleItemSkeletonGridProps> = ({ count = 3 }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SaleItemCardSkeleton key={index} />
      ))}
    </div>
  );
};
