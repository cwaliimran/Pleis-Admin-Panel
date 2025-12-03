'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useState } from 'react';
import { DEFAULT_PRICING, MOCK_SUBSCRIPTIONS } from './constants';
import { EditSubscriptionModal } from './edit-subscription-modal';
import { PricingSection } from './pricing-section';
// import { SubscriptionTableV2 } from './subscription-table';
import { SubscriptionTabs } from './subscription-tabs';
import { PricingConfig, Subscription, SubscriptionFormData, TabType } from './types';
import SubscriptionTableView from './subscription-table/subscription-table-view';

export const SubscriptionManagementView: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modals
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Handlers
  //   const handleEditSubscription = (subscription: Subscription) => {
  //     setSelectedSubscription(subscription);
  //     editModal.onTrue();
  //   };

  //   const handleDeleteClick = (id: string) => {
  //     setSelectedId(id);
  //     deleteModal.onTrue();
  //   };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSubscriptions((prev) => prev.filter((s) => s.id !== selectedId));
      showSuccess('Subscription canceled successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleSaveSubscription = async (data: SubscriptionFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (selectedSubscription) {
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.id === selectedSubscription.id
              ? {
                  ...s,
                  modules: data.modules,
                  organizations: data.organizations,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  billing: data.billing,
                  commissions: data.commissions,
                }
              : s
          )
        );
        showSuccess('Subscription updated successfully');
      }

      editModal.onFalse();
      setSelectedSubscription(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleSavePricing = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('Saving pricing configuration:', pricing);
      showSuccess('Pricing configuration saved successfully!');
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
                <>
                  <SubscriptionTableView />
                  {/* <SubscriptionTableV2 subscriptions={subscriptions} onEdit={handleEditSubscription} onDelete={handleDeleteClick} /> */}
                </>
              )}
            </div>
          )}

          {activeTab === 'pricing' && <PricingSection pricing={pricing} onPricingChange={setPricing} onSave={handleSavePricing} />}
        </div>
      </section>

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        isOpen={editModal.value}
        onClose={() => {
          editModal.onFalse();
          setSelectedSubscription(null);
        }}
        subscription={selectedSubscription}
        onSave={handleSaveSubscription}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Cancel Subscription"
        content="Are you sure you want to cancel this subscription?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={false}
      />
    </>
  );
};
