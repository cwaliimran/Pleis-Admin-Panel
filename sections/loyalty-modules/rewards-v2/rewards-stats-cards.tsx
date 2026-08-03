'use client';

import { Card } from '@/components/ui/card';
import React from 'react';
import { RewardStats } from './types';

interface RewardsStatsCardsProps {
  stats: RewardStats;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  hint?: string;
  /** The "most claimed" tile reads as a name, not a figure. */
  compact?: boolean;
}

export const RewardsStatsCards: React.FC<RewardsStatsCardsProps> = ({ stats, isLoading = false }) => {
  const tiles: Tile[] = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), hint: 'across all rewards' },
    { label: 'Total Favorites', value: stats.totalFavorites.toLocaleString() },
    { label: 'Total Claims', value: stats.totalClaims.toLocaleString() },
    { label: 'Total Redemptions', value: stats.totalRedemptions.toLocaleString(), hint: 'QR scanned at venue' },
    {
      label: 'Most Claimed',
      value: stats.mostClaimed ? `${stats.mostClaimed.name} · ${stats.mostClaimed.claims.toLocaleString()} claims` : '—',
      compact: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tiles.map((tile) => (
        <Card key={tile.label} className="dark:bg-secondary gap-0 px-4 py-3 shadow-sm">
          <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{tile.label}</p>

          {isLoading ? (
            <div className="mt-1.5 h-5 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p
              className={
                tile.compact
                  ? 'mt-1 text-sm leading-snug font-semibold wrap-break-word text-gray-900 dark:text-gray-100'
                  : 'mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100'
              }
            >
              {tile.value}
            </p>
          )}

          {tile.hint && <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{tile.hint}</p>}
        </Card>
      ))}
    </div>
  );
};

export default RewardsStatsCards;
