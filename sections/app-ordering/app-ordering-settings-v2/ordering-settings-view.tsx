'use client';

import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import React from 'react';
import { DeliveryOptionsSection } from './delivery-options';
import { OrderAcceptanceSection } from './order-acceptance';
import { OrderTimingSection } from './order-timing';
import { PaymentMethodsSection } from './payment-methods';
import { TipsSection } from './tips';
import { UserType } from './types';

interface OrderingSettingsViewProps {
  userType: UserType;
}

export const OrderingSettingsViewV2: React.FC<OrderingSettingsViewProps> = ({ userType }) => {
  // Single source of truth for the organization id — super-admin resolves it from the
  // company selector in the header, organizer from the dropdown this hook renders.
  //
  // Every section below loads and saves its own data from that id, and renders
  // its own skeleton while it waits, so there is no page-level loading gate.
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'ordering-settings-v2-organization',
  });

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

    return (
      <div className="flex flex-col gap-6">
        <PaymentMethodsSection organizationId={organizationId} />

        <OrderAcceptanceSection organizationId={organizationId} />

        <TipsSection organizationId={organizationId} />

        <DeliveryOptionsSection organizationId={organizationId} />

        <OrderTimingSection organizationId={organizationId} />
      </div>
    );
  };

  return (
    <div className="flex max-w-full flex-col gap-6 pb-10">
      {OrganizationDropdown && (
        <div className="flex justify-end rounded-2xl border border-gray-200 bg-white px-7 py-5 shadow-sm dark:border-gray-800 dark:bg-[#222121]">
          {OrganizationDropdown}
        </div>
      )}

      {renderBody()}
    </div>
  );
};
