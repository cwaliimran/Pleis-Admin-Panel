import React from 'react';

export const OrderCardSkeleton: React.FC = () => {
  return (
    <div className="dark:bg-secondary relative rounded-2xl bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          {/* Icon + Location */}
          <div className="mb-1 flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* User name */}
          <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          {/* Items + Price */}
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          {/* Order number */}
          <div className="mt-1 h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {/* Status badge */}
          <div className="h-7 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          {/* Order type badge */}
          <div className="h-6 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

interface OrderSkeletonGridProps {
  count?: number;
}

export const OrderSkeletonGrid: React.FC<OrderSkeletonGridProps> = ({ count = 6 }) => {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
};
