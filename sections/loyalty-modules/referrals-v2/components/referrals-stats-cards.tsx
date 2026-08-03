'use client';

import { Card } from '@/components/ui/card';
import React from 'react';
import { ReferralSettings, ReferralStats } from '../types';
import { formatSettingsSummary } from '../utils';

interface ReferralsStatsCardsProps {
  stats: ReferralStats;
  settings: ReferralSettings;
  isLoading?: boolean;
}

interface Tile {
  label: string;
  value: string;
  hint?: string;
  /** Tiles holding a phrase rather than a figure read better one size down. */
  compact?: boolean;
}

export const ReferralsStatsCards: React.FC<ReferralsStatsCardsProps> = ({ stats, settings, isLoading = false }) => {
  const tiles: Tile[] = [
    { label: 'Referrals Completed', value: stats.completed.toLocaleString() },
    { label: 'Pending', value: stats.pending.toLocaleString() },
    { label: 'Points Given', value: stats.pointsGiven.toLocaleString(), hint: 'both parties combined' },
    {
      label: 'Top Referrer',
      value: stats.topReferrer ? `${stats.topReferrer.username} · ${stats.topReferrer.referrals.toLocaleString()} referrals` : '—',
      compact: true,
    },
    { label: 'Current Settings', value: formatSettingsSummary(settings), compact: true },
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

export default ReferralsStatsCards;
