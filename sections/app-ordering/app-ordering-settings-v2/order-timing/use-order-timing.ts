'use client';

import { useCallback, useMemo } from 'react';
import { useOrganizationOrderingSettings } from '../use-organization-ordering-settings';
import { mapApiOrderTiming, toApiSessionTimerLength } from './mappers';
import { OrderTimingSettings } from './types';

// ============================================================
// The section's own data seam.
//
// The session timer is one key of the organization's `inAppOrderingSettings`,
// so the save goes through `useOrganizationOrderingSettings`, which carries
// the tip settings over untouched.
// ============================================================

interface UseOrderTimingReturn {
  settings: OrderTimingSettings;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  save: (values: OrderTimingSettings) => Promise<string | undefined>;
}

export const useOrderTiming = (organizationId?: string): UseOrderTimingReturn => {
  const { settings: apiSettings, isLoading, isFetching, isSaving, saveSettings } = useOrganizationOrderingSettings(organizationId);

  const settings = useMemo(() => mapApiOrderTiming(apiSettings), [apiSettings]);

  const save = useCallback(
    (values: OrderTimingSettings) => saveSettings({ sessionTimerLength: toApiSessionTimerLength(values) }),
    [saveSettings]
  );

  return { settings, isLoading, isFetching, isSaving, save };
};
