'use client';

import { Card } from '@/components/ui/card';
import React from 'react';
import { ChallengeStats } from '../types';

interface ChallengesStatsCardsProps {
  stats: ChallengeStats;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  hint?: string;
  /** The "most completed" tile reads as a name, not a figure. */
  compact?: boolean;
}

export const ChallengesStatsCards: React.FC<ChallengesStatsCardsProps> = ({ stats, isLoading = false }) => {
  const tiles: Tile[] = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString() },
    { label: 'Total Favorites', value: stats.totalFavorites.toLocaleString() },
    { label: 'Total Participants', value: stats.totalParticipants.toLocaleString(), hint: 'started at least one' },
    { label: 'Total Completions', value: stats.totalCompletions.toLocaleString() },
    {
      label: 'Most Completed',
      value: stats.mostCompleted ? `${stats.mostCompleted.name} · ${stats.mostCompleted.completions.toLocaleString()}` : '—',
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

export default ChallengesStatsCards;
