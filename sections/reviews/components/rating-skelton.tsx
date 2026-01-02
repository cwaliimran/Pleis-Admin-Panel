import React from 'react';
import { cn } from '@/lib/utils';

interface RatingsSummarySkeletonProps {
  className?: string;
  compact?: boolean;
  hideTitle?: boolean;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)} />
);

const RatingsSummarySkeleton: React.FC<RatingsSummarySkeletonProps> = ({ className = '', compact = false, hideTitle = false }) => {
  return (
    <div className={cn('dark:bg-secondary w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700', className)}>
      {/* Title */}
      {!hideTitle && <Skeleton className="mb-8 h-8 w-56" />}

      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Left side – Average rating */}
        <div className="flex flex-col items-start">
          <Skeleton className="mb-3 h-20 w-32 lg:h-24 lg:w-36" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Right side – Distribution */}
        {!compact && (
          <div className="flex w-full max-w-2xl flex-1 flex-col gap-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                {/* Stars */}
                <Skeleton className="h-5 w-[90px] lg:w-[100px]" />

                {/* Progress bar */}
                <Skeleton className="h-3 flex-1 rounded-full" />

                {/* Count */}
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total ratings */}
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
};

export default RatingsSummarySkeleton;
