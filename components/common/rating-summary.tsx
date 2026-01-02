import React from 'react';
import { cn } from '@/lib/utils';

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingsSummaryProps {
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution[];
  title?: string;
  className?: string;
  compact?: boolean;
  hideTitle?: boolean;
}

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
};

const RatingsSummary: React.FC<RatingsSummaryProps> = ({
  averageRating,
  totalRatings,
  distribution,
  title = 'Ratings & Reviews',
  className = '',
  compact = false,
  hideTitle = false,
}) => {
  const sortedDistribution = [...distribution].sort((a, b) => b.stars - a.stars);

  return (
    <div className={cn('dark:bg-secondary w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700', className)}>
      {!hideTitle && <h2 className="mb-8 text-3xl font-bold text-gray-900 lg:text-2xl dark:text-gray-100">{title}</h2>}

      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Left side - Average rating */}
        <div className="flex flex-col items-start">
          <div className="mb-2 text-7xl leading-none font-bold text-gray-900 lg:text-8xl dark:text-gray-100">{averageRating.toFixed(1)}</div>
          <div className="text-lg text-gray-600 lg:text-xl dark:text-gray-400">out of 5</div>
        </div>

        {/* Right side - Distribution bars */}
        {!compact && (
          <div className="flex w-full max-w-2xl flex-1 flex-col gap-2">
            {sortedDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                {/* Stars */}
                <div className="flex min-w-[90px] gap-0.5 lg:min-w-[100px]">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'text-base lg:text-lg',
                        index < item.stars ? 'text-yellow-400 dark:text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-300 ease-in-out dark:bg-yellow-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {/* Review count */}
                <div className="min-w-[60px] text-right text-sm font-medium text-gray-700 dark:text-gray-300">{formatCount(item.count)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total ratings count */}
      <div className="mt-4 text-right text-lg text-gray-600 lg:text-lg dark:text-gray-400">{formatCount(totalRatings)} Ratings</div>
    </div>
  );
};

export default RatingsSummary;
