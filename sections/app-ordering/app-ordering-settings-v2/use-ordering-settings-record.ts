'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiOrderingSettings, ApiPaymentMethod, UpdateOrderingSettingsArgs } from '@/store/Reducer/ordering-settings-api';
import { useGetOrderingSettingsQuery, useUpdateOrderingSettingsMutation } from '@/store/Reducer/ordering-settings-api';
import { useCallback } from 'react';
import { DEFAULT_ORDER_ACCEPTANCE_SETTINGS } from './order-acceptance/constants';
import { DEFAULT_PAYMENT_SETTINGS } from './payment-methods/constants';

// ============================================================
// The settings document seam.
//
// The backend stores every sub-setting in one record, so a section cannot
// save in isolation — it has to send the whole document back. This hook
// owns that: a section passes only the slice it changed, and the rest is
// carried over from the loaded record.
//
// Each section calls this hook itself. RTK Query dedupes the read into a
// single request, while the mutations stay per-section so one card's save
// spinner never lights up the others.
// ============================================================

/** The keys a section may change; anything omitted keeps its loaded value. */
type SettingsPatch = Partial<Pick<UpdateOrderingSettingsArgs, 'paymentMethod' | 'automaticOrderAcceptance'>>;

interface UseOrderingSettingsRecordReturn {
  record: ApiOrderingSettings | null;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  saveRecord: (patch: SettingsPatch) => Promise<string | undefined>;
}

export const useOrderingSettingsRecord = (organizationId?: string): UseOrderingSettingsRecordReturn => {
  // Admin picks the company in the header; organizers have none.
  const { companyId } = useCompanySelectionState();

  const { data, isLoading, isFetching } = useGetOrderingSettingsQuery(
    { organization: organizationId as string },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const [updateOrderingSettings, { isLoading: isSaving }] = useUpdateOrderingSettingsMutation();

  const saveRecord = useCallback(
    async (patch: SettingsPatch) => {
      if (!organizationId) throw new Error('No organization selected');

      // `??` rather than `||` throughout — `false` is a value to preserve,
      // not a missing one.
      const paymentMethod: ApiPaymentMethod = patch.paymentMethod ?? data?.paymentMethod ?? DEFAULT_PAYMENT_SETTINGS;

      const automaticOrderAcceptance =
        patch.automaticOrderAcceptance ?? data?.automaticOrderAcceptance ?? DEFAULT_ORDER_ACCEPTANCE_SETTINGS.automaticOrderAcceptance;

      const response = await updateOrderingSettings({
        organization: organizationId,
        // Falls back to the record's own value so an organizer save keeps the
        // attribution the backend already made.
        companyOrganizer: companyId ?? data?.companyOrganizer ?? undefined,
        paymentMethod,
        automaticOrderAcceptance,
      }).unwrap();

      return response?.message;
    },
    [organizationId, companyId, data, updateOrderingSettings]
  );

  return {
    record: data ?? null,
    isLoading: isLoading && !data,
    isFetching,
    isSaving,
    saveRecord,
  };
};
