'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { PROMOTION_TYPE_LABELS, isDeprecatedType } from '../constants';
import { PromotionType } from '../types';

interface PromotionTypeBadgeProps {
  type: PromotionType;
  className?: string;
}

/**
 * The type pill. A deprecated type is struck through and paired with a
 * DEPRECATED marker, so a legacy record reads as legacy at a glance.
 */
export const PromotionTypeBadge: React.FC<PromotionTypeBadgeProps> = ({ type, className }) => {
  const deprecated = isDeprecatedType(type);

  return (
    <span className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <span
        className={cn(
          'rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
          deprecated && 'line-through'
        )}
      >
        {PROMOTION_TYPE_LABELS[type]}
      </span>

      {deprecated && (
        <span className="rounded-md border border-amber-500/60 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 uppercase dark:text-amber-400">
          Deprecated
        </span>
      )}
    </span>
  );
};

export default PromotionTypeBadge;
