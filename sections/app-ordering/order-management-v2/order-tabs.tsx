import { cn } from '@/lib/utils';
import React from 'react';
import { SUB_FILTER_CONFIG, TAB_CONFIG } from './constants';
import { OrderTab, SubFilter } from './types';

interface OrderTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  orderCounts: Record<OrderTab, number>;
  activeSubFilter?: SubFilter;
  onSubFilterChange?: (filter: SubFilter) => void;
}

export const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, orderCounts, activeSubFilter = 'all', onSubFilterChange }) => {
  return (
    <div className="bg-white dark:bg-[#222121]">
      {/* Main Tabs */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-5 pt-2">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'shrink-0 cursor-pointer border-b-[3px] border-transparent bg-transparent px-5 py-3',
              'min-h-11 text-sm font-semibold whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
            )}
          >
            {tab.label}
            {orderCounts[tab.id] > 0 && (
              <span
                className={cn(
                  'ml-2 inline-block min-w-5 rounded-full px-2 py-0.5 text-center text-xs font-bold',
                  activeTab === tab.id ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-red-500 text-white'
                )}
              >
                {orderCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sub-filter buttons - Only show for "New Orders" tab */}
      {activeTab === 'new-orders' && onSubFilterChange && (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-5 py-4">
          {SUB_FILTER_CONFIG.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onSubFilterChange(filter.id)}
              className={cn(
                'shrink-0 cursor-pointer rounded-full px-5 py-2.5',
                'text-sm font-semibold whitespace-nowrap transition-all',
                activeSubFilter === filter.id
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
