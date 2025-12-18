'use client';

import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useState } from 'react';
import { DEFAULT_PRICING, MOCK_SUBSCRIPTIONS } from './constants';
import { PricingSection } from './pricing-section';
import SubscriptionTableView from './subscription-table/subscription-table-view';
import { SubscriptionTabs } from './subscription-tabs';
import { PricingConfig, Subscription, TabType } from './types';

export const SubscriptionManagementView: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);

  const handleSavePricing = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Saving pricing configuration:', pricing);
      showSuccess('Pricing configuration saved successfully!');
      setSubscriptions((prev) => [...prev]);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

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
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {subscriptions.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mb-4 text-6xl opacity-30">📦</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Subscriptions Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Create your first subscription to get started</p>
                </div>
              ) : (
                <SubscriptionTableView />
              )}
            </div>
          )}

          {activeTab === 'pricing' && <PricingSection pricing={pricing} onPricingChange={setPricing} onSave={handleSavePricing} />}
        </div>
      </section>
    </>
  );
};
