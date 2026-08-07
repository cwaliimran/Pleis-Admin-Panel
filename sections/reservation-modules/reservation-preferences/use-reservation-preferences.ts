'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetReservationPreferencesQuery, useUpdateReservationPreferencesMutation } from '@/store/Reducer/reservation-preferences-api';
import { useCallback, useMemo } from 'react';
import { mapApiReservationPreferences, toReservationPreferencesBody } from './mappers';
import { ReservationPreferences } from './types';

// ============================================================
// The page's data seam.
//
// Covers the page-level settings only — reservation types and occasions
// each load and write their own data.
//
// One document per organization, saved whole by the page's "Save settings"
// button. The PUT upserts, so an organization with no document yet saves
// through exactly the same call.
// ============================================================

interface UseReservationPreferencesReturn {
  /** `null` until the first load lands — the view shows its loader on that. */
  preferences: ReservationPreferences | null;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  savePreferences: (next: ReservationPreferences) => Promise<string | undefined>;
}

export const useReservationPreferences = (organizationId?: string): UseReservationPreferencesReturn => {
  // Admin picks the company in the header; organizers have none.
  const { companyId } = useCompanySelectionState();

  const { data, isLoading, isFetching } = useGetReservationPreferencesQuery(
    { organization: organizationId as string },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  // Held at `null` while the first request is in flight, so the view never
  // briefly renders defaults as though they were the saved settings.
  const preferences = useMemo(() => {
    if (!organizationId || isLoading) return null;
    return mapApiReservationPreferences(data);
  }, [organizationId, isLoading, data]);

  const [updatePreferences, { isLoading: isSaving }] = useUpdateReservationPreferencesMutation();

  const savePreferences = useCallback(
    async (next: ReservationPreferences) => {
      if (!organizationId) throw new Error('No organization selected');

      // Unwrapped so a failed request rejects and the view can toast it;
      // the mutation invalidates the tag, which refetches the saved document.
      const response = await updatePreferences({
        organization: organizationId,
        companyOrganizer: companyId ?? undefined,
        ...toReservationPreferencesBody(next),
      }).unwrap();

      return response?.message;
    },
    [organizationId, companyId, updatePreferences]
  );

  return { preferences, isFetching, isSaving, savePreferences };
};
