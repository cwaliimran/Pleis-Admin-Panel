'use client';

import React from 'react';
import { Send, Clock, Users, Target } from 'lucide-react';
import { NotificationStats } from './types';

interface StatsCardsProps {
  stats: NotificationStats;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      icon: Send,
      value: stats?.sent || 0,
      label: 'Sent',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Clock,
      value: stats?.scheduled || 0,
      label: 'Scheduled',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: Users,
      value: stats?.totalReached || 0,
      label: 'Total Reach',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Target,
      value: stats?.activeFilters || 0,
      label: 'Active Filters',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#222121]">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
                  ) : (
                    card?.value
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
