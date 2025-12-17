import { cn } from '@/lib/utils';
import React from 'react';
import { ACTIVE_ORDER_SUB_TABS, DELIVERY_FILTER_BUTTONS, TAB_CONFIG } from './constants';
import { ActiveOrderSubTab, DeliveryFilterType, OrderTab } from './types';

interface OrderTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  orderCounts: Record<OrderTab, number>;
  activeOrderSubTab: ActiveOrderSubTab;
  onSubTabChange: (subTab: ActiveOrderSubTab) => void;
  subTabCounts: Record<ActiveOrderSubTab, number>;
  deliveryFilter: DeliveryFilterType;
  onDeliveryFilterChange: (filter: DeliveryFilterType) => void;
}

export const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  onTabChange,
  orderCounts,
  activeOrderSubTab,
  onSubTabChange,
  subTabCounts,
  deliveryFilter,
  onDeliveryFilterChange,
}) => {
  return (
    <div className="rounded-b-2xl dark:bg-[#222121]">
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

      {/* Active Order Sub-Tabs */}
      {activeTab === 'active' && (
        <div className="border-t border-gray-100 px-5 pt-4 pb-2 dark:border-gray-800">
          <div className="scrollbar-hide flex gap-4 overflow-x-auto">
            {ACTIVE_ORDER_SUB_TABS.map((subTab) => (
              <button
                key={subTab.id}
                type="button"
                onClick={() => onSubTabChange(subTab.id)}
                className={cn(
                  'shrink-0 cursor-pointer bg-transparent px-2 py-2',
                  'text-sm font-semibold whitespace-nowrap transition-all',
                  activeOrderSubTab === subTab.id
                    ? 'border-b-[3px] border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-b-[3px] border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
                )}
              >
                {subTab.label}
                {subTabCounts[subTab.id] > 0 && (
                  <span
                    className={cn(
                      'ml-2 inline-block min-w-5 rounded-full px-2 py-0.5 text-center text-xs font-bold',
                      activeOrderSubTab === subTab.id ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-red-500 text-white'
                    )}
                  >
                    {subTabCounts[subTab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Delivery Filter Buttons - Only show for New Order sub-tab */}
          {activeOrderSubTab === 'new-order' && (
            <div className="scrollbar-hide mt-4 flex gap-2 overflow-x-auto pb-1">
              {DELIVERY_FILTER_BUTTONS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => onDeliveryFilterChange(filter.id)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full px-5 py-2.5',
                    'text-sm font-semibold whitespace-nowrap transition-all',
                    deliveryFilter === filter.id
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-white dark:text-gray-900'
                      : 'bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
