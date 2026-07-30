'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import React from 'react';
import { DeliveryOptionsSection } from './delivery-options-section';
import { OrderTimingSection } from './order-timing-section';
import { PaymentMethodsSection } from './payment-methods-section';
import { TipsSection } from './tips-section';
import { UserType } from './types';
import { useOrderingSettings } from './use-ordering-settings';

interface OrderingSettingsViewProps {
  userType: UserType;
}

export const OrderingSettingsViewV2: React.FC<OrderingSettingsViewProps> = ({ userType }) => {
  // Single source of truth for the organization id — super-admin resolves it from the
  // company selector in the header, organizer from the dropdown this hook renders.
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'ordering-settings-v2-organization',
  });

  const {
    settings,
    isFetching,
    isSavingPayment,
    isSavingTips,
    isSavingOrderTiming,
    isMutatingDeliveryOptions,
    savePayment,
    saveTips,
    saveOrderTiming,
    createDeliveryOption,
    updateDeliveryOption,
    deleteDeliveryOption,
    generateDeliveryOptionQrCode,
  } = useOrderingSettings(organizationId);

  const renderBody = () => {
    if (!organizationId) {
      return (
        <div className="py-24 text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            {userType === 'organizer' ? 'Select an Organization' : 'No Company Selected'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userType === 'organizer'
              ? 'Choose an organization from the dropdown above to manage ordering settings'
              : 'Please select a company to manage ordering settings'}
          </p>
        </div>
      );
    }

    if (!settings) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <AppLoading />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <PaymentMethodsSection value={settings.payment} onSave={savePayment} isSaving={isSavingPayment} disabled={isFetching} />

        <TipsSection value={settings.tips} onSave={saveTips} isSaving={isSavingTips} disabled={isFetching} />

        <DeliveryOptionsSection
          options={settings.deliveryOptions}
          isLoading={isFetching}
          isMutating={isMutatingDeliveryOptions}
          onCreate={createDeliveryOption}
          onUpdate={updateDeliveryOption}
          onDelete={deleteDeliveryOption}
          onGenerateQrCode={generateDeliveryOptionQrCode}
        />

        <OrderTimingSection value={settings.orderTiming} onSave={saveOrderTiming} isSaving={isSavingOrderTiming} disabled={isFetching} />
      </div>
    );
  };

  return (
    <div className="flex max-w-[70%] flex-col gap-6 pb-10">
      {OrganizationDropdown && (
        <div className="flex justify-end rounded-2xl border border-gray-200 bg-white px-7 py-5 shadow-sm dark:border-gray-800 dark:bg-[#222121]">
          {OrganizationDropdown}
        </div>
      )}

      {renderBody()}
    </div>
  );
};
