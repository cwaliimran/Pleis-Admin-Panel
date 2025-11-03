'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function DraggablePromoItemSkeleton() {
  return (
    <div className="dark:bg-secondary flex items-center justify-between rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white px-4 py-4 dark:border-gray-600">
      <div className="flex-1">
        <Skeleton className="h-7 w-32 rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
