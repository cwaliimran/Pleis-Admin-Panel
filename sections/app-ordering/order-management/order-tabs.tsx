import { cn } from '@/lib/utils';
import React from 'react';
import { TAB_CONFIG } from './constants';
import { OrderTab } from './types';

interface OrderTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  orderCounts: Record<OrderTab, number>;
}

export const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, orderCounts }) => {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto bg-white px-5 pt-2 dark:bg-[#222121]">
      {TAB_CONFIG.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-shrink-0 cursor-pointer border-b-[3px] border-transparent bg-transparent px-5 py-3',
            'min-h-[44px] text-sm font-semibold whitespace-nowrap transition-all',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
          )}
        >
          {tab.label}
          {orderCounts[tab.id] > 0 && (
            <span
              className={cn(
                'ml-2 inline-block min-w-[20px] rounded-full px-2 py-0.5 text-center text-xs font-bold',
                activeTab === tab.id ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-red-500 text-white'
              )}
            >
              {orderCounts[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
