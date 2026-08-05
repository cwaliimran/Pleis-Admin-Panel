'use client';

import { useCallback, useMemo } from 'react';
import { useOrderingSettingsRecord } from '../use-ordering-settings-record';
import { mapApiOrderAcceptance } from './mappers';
import { OrderAcceptanceSettings } from './types';

// ============================================================
// The section's own data seam.
//
// Order acceptance is one flag on the shared settings document, so the
// save goes through `useOrderingSettingsRecord`, which carries the other
// sections' values over untouched.
// ============================================================

interface UseOrderAcceptanceReturn {
  settings: OrderAcceptanceSettings;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  save: (values: OrderAcceptanceSettings) => Promise<string | undefined>;
}

export const useOrderAcceptance = (organizationId?: string): UseOrderAcceptanceReturn => {
  const { record, isLoading, isFetching, isSaving, saveRecord } = useOrderingSettingsRecord(organizationId);

  const settings = useMemo(() => mapApiOrderAcceptance(record), [record]);

  const save = useCallback(
    (values: OrderAcceptanceSettings) => saveRecord({ automaticOrderAcceptance: values.automaticOrderAcceptance }),
    [saveRecord]
  );

  return { settings, isLoading, isFetching, isSaving, save };
};
