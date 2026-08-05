'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

interface SettingRowSkeletonProps {
  /** Matches `SettingRow` — the last row in a card leaves it off. */
  divider?: boolean;
  /** Lines of description copy to stand in for; `0` renders none. */
  descriptionLines?: number;
  className?: string;
}

/**
 * Placeholder for one `SettingRow`. Padding, spacing and the toggle
 * footprint mirror the real row, so the card keeps its height and nothing
 * shifts when the record lands.
 */
export const SettingRowSkeleton: React.FC<SettingRowSkeletonProps> = ({ divider = false, descriptionLines = 2, className }) => (
  <div className={cn('px-7 py-6', divider && 'border-b border-gray-200 dark:border-gray-800', className)}>
    <div className="flex items-start justify-between gap-5">
      <div className="flex-1">
        <Skeleton className="mb-3 h-4.5 w-44" />

        {descriptionLines > 0 && (
          <div className="max-w-2xl space-y-2.5">
            {Array.from({ length: descriptionLines }).map((_, index) => (
              // Last line runs short, the way a wrapped paragraph does.
              <Skeleton key={index} className={cn('h-3', index === descriptionLines - 1 ? 'w-2/3' : 'w-full')} />
            ))}
          </div>
        )}
      </div>

      {/* Same footprint as ToggleSwitch. */}
      <Skeleton className="h-8 w-14 shrink-0 rounded-full" />
    </div>
  </div>
);
