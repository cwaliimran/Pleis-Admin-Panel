'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { BADGE_METRIC_CLASS, STREAK_BADGE_DOT_CLASS, STREAK_BADGE_LABELS } from '../constants';
import { StreakBadge } from '../types';

interface StreakBadgeLabelProps {
  badge: StreakBadge | null;
  className?: string;
}

/** Tier-coloured dot plus the badge name. Renders "—" before the first badge. */
export const StreakBadgeLabel: React.FC<StreakBadgeLabelProps> = ({ badge, className }) => {
  if (!badge) return <span className="text-gray-400 dark:text-gray-500">—</span>;

  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium', BADGE_METRIC_CLASS, className)}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', STREAK_BADGE_DOT_CLASS[badge])} />
      {STREAK_BADGE_LABELS[badge]}
    </span>
  );
};

export default StreakBadgeLabel;
