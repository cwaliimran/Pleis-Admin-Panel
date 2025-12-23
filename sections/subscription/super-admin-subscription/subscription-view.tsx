'use client';

import { useGetSubscriptionsPricingQuery } from '@/store/Reducer/subscriptions-api';
import React, { useState } from 'react';
import { PricingSection } from './pricing-section';
import SubscriptionTableView from './subscription-table/subscription-table-view';
import { SubscriptionTabs } from './subscription-tabs';
import { TabType } from './types';

export const SubscriptionManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');

  const { data: apiData, isLoading, isFetching } = useGetSubscriptionsPricingQuery({});

  return (
    <>
      <section className="min-h-screen">
        {/* Header */}
        <div className="dark:bg-secondary rounded-t-2xl bg-white shadow-sm">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-500">Manage organizer subscriptions and pricing</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <SubscriptionTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-b-2xl px-0 py-6">
          {activeTab === 'subscriptions' && <SubscriptionTableView pricingData={apiData?.data} />}

          {activeTab === 'pricing' && <PricingSection apiData={apiData} isLoading={isLoading} isFetching={isFetching} />}
        </div>
      </section>
    </>
  );
};
