'use client';

import { Card } from '@/components/ui/card';
import React from 'react';
import { StreakRules, StreakStats } from '../types';
import { formatRulesSummary } from '../utils';

interface StreaksStatsCardsProps {
  stats: StreakStats;
  /** `null` until a rule set has been saved — the tile then reads "Not set". */
  rules: StreakRules | null;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  hint?: string;
  /** Tiles holding a phrase rather than a figure read better one size down. */
  compact?: boolean;
}

export const StreaksStatsCards: React.FC<StreaksStatsCardsProps> = ({ stats, rules, isLoading = false }) => {
  const tiles: Tile[] = [
    { label: 'Avg Streak / User', value: stats.avgStreakPerUser.toLocaleString() },
    // No hint: the API reports the figure without naming who holds it.
    { label: 'Longest Streak', value: stats.longestStreak.toLocaleString() },
    { label: 'Badges Awarded', value: stats.badgesAwarded.toLocaleString(), hint: 'all tiers combined' },
    // Reads live off the rules, so saving the modal updates it immediately.
    { label: 'Current Rules', value: formatRulesSummary(rules), compact: true },
    {
      label: 'Top Streaker',
      value: stats.topStreaker ? `${stats.topStreaker.username} · ${stats.topStreaker.visits.toLocaleString()} visits` : '—',
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

export default StreaksStatsCards;
