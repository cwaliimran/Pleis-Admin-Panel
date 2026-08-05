'use client';

import { useCallback, useMemo } from 'react';
import { useOrderingSettingsRecord } from '../use-ordering-settings-record';
import { mapApiPaymentMethods } from './mappers';
import { PaymentSettings } from './types';

// ============================================================
// The section's own data seam.
//
// Payment methods are one slice of the shared settings document, so the
// save goes through `useOrderingSettingsRecord`, which carries the other
// sections' values over untouched.
// ============================================================

interface UsePaymentMethodsReturn {
  settings: PaymentSettings;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  save: (values: PaymentSettings) => Promise<string | undefined>;
}

export const usePaymentMethods = (organizationId?: string): UsePaymentMethodsReturn => {
  const { record, isLoading, isFetching, isSaving, saveRecord } = useOrderingSettingsRecord(organizationId);

  const settings = useMemo(() => mapApiPaymentMethods(record), [record]);

  const save = useCallback((values: PaymentSettings) => saveRecord({ paymentMethod: values }), [saveRecord]);

  return { settings, isLoading, isFetching, isSaving, save };
};
