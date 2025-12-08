import React from 'react';
import { cn } from '@/lib/utils';

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingsSummaryProps {
  /** Average rating value (0-5) */
  averageRating: number;
  /** Total number of ratings */
  totalRatings: number;
  /** Distribution of ratings by star level */
  distribution: RatingDistribution[];
  /** Optional title for the component */
  title?: string;
  /** Optional className for custom styling */
  className?: string;
  /** Show compact version without distribution bars */
  compact?: boolean;
  /** Hide title completely */
  hideTitle?: boolean;
}

/**
 * Format number to display with K, M suffixes
 */
const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
};

/**
 * RatingsSummary Component
 *
 * Displays an overview of ratings with average score, total count,
 * and distribution across star levels.
 *
 * @example
 * ```tsx
 * <RatingsSummary
 *   title="Customer Reviews"
 *   averageRating={4.5}
 *   totalRatings={24000}
 *   distribution={[
 *     { stars: 5, count: 20000, percentage: 83 },
 *     { stars: 4, count: 2000, percentage: 8 },
 *     { stars: 3, count: 1000, percentage: 4 },
 *     { stars: 2, count: 500, percentage: 2 },
 *     { stars: 1, count: 500, percentage: 3 },
 *   ]}
 * />
 * ```
 */
const RatingsSummary: React.FC<RatingsSummaryProps> = ({
  averageRating,
  totalRatings,
  distribution,
  title = 'Ratings & Reviews',
  className = '',
  compact = false,
  hideTitle = false,
}) => {
  // Sort distribution by stars descending (5 to 1)
  const sortedDistribution = [...distribution].sort((a, b) => b.stars - a.stars);

  return (
    <div className={cn('bg-secondary w-full rounded-xl border p-6', className)}>
      {!hideTitle && <h2 className="text-foreground mb-8 text-3xl font-bold lg:text-2xl">{title}</h2>}

      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Left side - Average rating */}
        <div className="flex flex-col items-start">
          <div className="text-foreground mb-2 text-7xl leading-none font-bold lg:text-8xl">{averageRating.toFixed(1)}</div>
          <div className="text-muted-foreground text-lg lg:text-xl">out of 5</div>
        </div>

        {/* Right side - Distribution bars */}
        {!compact && (
          <div className="flex w-full max-w-2xl flex-1 flex-col gap-2">
            {sortedDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                {/* Stars */}
                <div className="flex min-w-[90px] gap-0.5 lg:min-w-[100px]">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className={cn('text-base lg:text-lg', index < item.stars ? 'text-foreground' : 'text-muted-foreground/30')}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-foreground h-full rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total ratings count */}
      <div className="text-muted-foreground mt-4 text-right text-lg lg:text-lg">{formatCount(totalRatings)} Ratings</div>
    </div>
  );
};

export default RatingsSummary;
