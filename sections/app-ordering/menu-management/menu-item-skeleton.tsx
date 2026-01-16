import React from 'react';

export const MenuItemCardSkeleton: React.FC = () => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#222121]">
      {/* Image skeleton */}
      <div className="relative h-44 shrink-0 animate-pulse bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        {/* Badge skeletons */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="h-6 w-20 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex grow flex-col p-5">
        <div className="flex grow flex-col">
          {/* Header skeleton */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="text-right">
              <div className="h-7 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>

          {/* Description skeleton */}
          <div className="mb-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Meta info skeleton */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Toggle skeleton */}
        <div className="mb-0 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-6 w-11 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Actions skeleton */}
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="h-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

interface MenuItemSkeletonGridProps {
  count?: number;
}

export const MenuItemSkeletonGrid: React.FC<MenuItemSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemCardSkeleton key={index} />
      ))}
    </div>
  );
};
