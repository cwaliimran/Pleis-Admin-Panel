'use client';

import { AppLoading } from '@/components/atoms/app-loading';
import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useEffect, useMemo, useState } from 'react';
import { AutomaticResponseSection } from './automatic-response-section';
import { CancellationPolicySection } from './cancellation-policy-section';
import { OccasionsSection } from './occasions';
import { ReservationSystemCard } from './reservation-system-card';
import { ReservationTypesSection } from './reservation-types';
import { TimeSlotsSection } from './time-slots-section';
import { ReservationPreferences, UserType } from './types';
import { useReservationPreferences } from './use-reservation-preferences';

interface ReservationPreferencesViewProps {
  userType?: UserType;
}

export const ReservationPreferencesView: React.FC<ReservationPreferencesViewProps> = ({ userType = 'super-admin' }) => {
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'reservation-preferences-organization',
  });

  const { preferences, isSaving, savePreferences } = useReservationPreferences(organizationId);

  const [draft, setDraft] = useState<ReservationPreferences | null>(null);

  useEffect(() => {
    setDraft(preferences ? structuredClone(preferences) : null);
  }, [preferences]);

  const isDirty = useMemo(() => {
    if (!draft || !preferences) return false;
    return JSON.stringify(draft) !== JSON.stringify(preferences);
  }, [draft, preferences]);

  const patch = (partial: Partial<ReservationPreferences>) => setDraft((current) => (current ? { ...current, ...partial } : current));

  const handleCancel = () => setDraft(preferences ? structuredClone(preferences) : null);

  const handleSave = async () => {
    if (!draft) return;

    try {
      const message = await savePreferences(draft);
      showSuccess(message || 'Reservation preferences saved');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

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
              ? 'Choose an organization from the dropdown above to manage reservation preferences'
              : 'Please select a company to manage reservation preferences'}
          </p>
        </div>
      );
    }

    if (!draft) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <AppLoading />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <ReservationSystemCard
          enabled={draft.reservationSystemEnabled}
          disabled={isSaving}
          onChange={(enabled) => patch({ reservationSystemEnabled: enabled })}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <TimeSlotsSection value={draft.timeSlots} disabled={isSaving} onChange={(timeSlots) => patch({ timeSlots })} />

          <AutomaticResponseSection
            value={draft.automaticResponse}
            disabled={isSaving}
            onChange={(automaticResponse) => patch({ automaticResponse })}
          />
        </div>

        {/* Half-width pair, matching the prototype's layout. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:w-1/2 lg:pr-3">
          <OccasionsSection organizationId={organizationId} />

          <CancellationPolicySection
            value={draft.cancellationPolicy}
            disabled={isSaving}
            onChange={(cancellationPolicy) => patch({ cancellationPolicy })}
          />
        </div>

        <ReservationTypesSection organizationId={organizationId} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reservation Preferences</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Configure reservation rules for this location — time slots, automatic responses, and reservation types.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {OrganizationDropdown}

          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!isDirty || isSaving}
            className="h-10 cursor-pointer font-semibold disabled:cursor-not-allowed"
          >
            Cancel
          </Button>

          {isSaving ? (
            <Button type="button" disabled className="h-10 cursor-not-allowed font-semibold">
              <ButtonLoading title="Saving" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} disabled={!isDirty} className="h-10 cursor-pointer font-semibold disabled:cursor-not-allowed">
              Save settings
            </Button>
          )}
        </div>
      </div>

      {renderBody()}
    </div>
  );
};

export default ReservationPreferencesView;
