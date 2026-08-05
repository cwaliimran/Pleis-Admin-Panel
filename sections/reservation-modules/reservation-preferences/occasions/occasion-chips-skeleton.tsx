'use client';

import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

/** Chip-shaped placeholders in mixed widths, so the row reads as a list of labels. */
const CHIP_WIDTHS = ['w-24', 'w-32', 'w-28', 'w-20', 'w-36', 'w-24'];

export const OccasionChipsSkeleton: React.FC = () => (
  <div className="flex flex-wrap gap-2">
    {CHIP_WIDTHS.map((width, index) => (
      <Skeleton key={index} className={`h-8 rounded-full ${width}`} />
    ))}
  </div>
);
