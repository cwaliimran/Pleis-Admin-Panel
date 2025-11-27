import { cn } from '@/lib/utils';
import React from 'react';
import { TAB_CONFIG } from './constants';
import { MenuTab } from './types';

interface MenuTabsProps {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
  itemCounts: Record<MenuTab, number>;
}

export const MenuTabs: React.FC<MenuTabsProps> = ({ activeTab, onTabChange, itemCounts }) => {
  return (
    <div className="flex gap-2 border-b-2 border-gray-200 bg-white dark:border-gray-800 dark:bg-[#222121]">
      {TAB_CONFIG.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'shrink-0 cursor-pointer border-b-3 border-transparent bg-transparent px-6 py-3',
            '-mb-0.5 text-sm font-semibold whitespace-nowrap transition-all',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
          )}
          style={{
            borderBottomWidth: activeTab === tab.id ? '3px' : '0px',
          }}
        >
          {tab.label}
          {itemCounts[tab.id] > 0 && (
            <span
              className={cn(
                'ml-2 inline-block min-w-5 rounded-full px-2 py-0.5 text-center text-xs font-bold',
                activeTab === tab.id ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-red-500 text-white'
              )}
            >
              {itemCounts[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
