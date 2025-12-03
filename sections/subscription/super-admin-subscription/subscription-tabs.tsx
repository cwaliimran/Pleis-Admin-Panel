'use client';

import { DollarSign, Users } from 'lucide-react';
import React from 'react';
import { TabType } from './types';

interface SubscriptionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const SubscriptionTabs: React.FC<SubscriptionTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'subscriptions' as TabType, label: 'Manage Subscriptions', icon: Users },
    { id: 'pricing' as TabType, label: 'Price Management', icon: DollarSign },
  ];

  return (
    <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            type="button"
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
