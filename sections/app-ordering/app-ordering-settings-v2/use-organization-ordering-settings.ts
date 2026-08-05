'use client';

import type { ApiInAppOrderingSettings } from '@/store/Reducer/organization';
import { useGetOrganizationByIdQuery, useUpdateOrganizationV2Mutation } from '@/store/Reducer/organization';
import { useCallback } from 'react';
import { DISABLED_SESSION_TIMER_LENGTH } from './order-timing/constants';
import { toApiTips } from './tips/mappers';
import { DEFAULT_TIP_SETTINGS } from './tips/constants';

// ============================================================
// The organization-document seam.
//
// Tips and the session timer live together under `inAppOrderingSettings`
// on the organization, so a section cannot save in isolation — it sends
// the whole subtree. This hook owns that: a section passes only the key it
// changed, and the rest is carried over from the loaded organization.
//
// Each section calls this hook itself. RTK Query dedupes the read into a
// single request, while the mutations stay per-section so one card's save
// spinner never lights up the other's.
// ============================================================

/** The keys a section may change; anything omitted keeps its loaded value. */
type InAppOrderingSettingsPatch = Partial<Pick<ApiInAppOrderingSettings, 'tips' | 'sessionTimerLength'>>;

interface UseOrganizationOrderingSettingsReturn {
  settings: ApiInAppOrderingSettings | null;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  saveSettings: (patch: InAppOrderingSettingsPatch) => Promise<string | undefined>;
}

export const useOrganizationOrderingSettings = (organizationId?: string): UseOrganizationOrderingSettingsReturn => {
  const { data, isLoading, isFetching } = useGetOrganizationByIdQuery(
    { id: organizationId as string },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const settings: ApiInAppOrderingSettings | null = data?.data?.inAppOrderingSettings ?? null;

  const [updateOrganizationV2, { isLoading: isSaving }] = useUpdateOrganizationV2Mutation();

  const saveSettings = useCallback(
    async (patch: InAppOrderingSettingsPatch) => {
      if (!organizationId) throw new Error('No organization selected');

      // `??` rather than `||` — a stored `0` length is a value to preserve,
      // not a missing one.
      const response = await updateOrganizationV2({
        id: organizationId,
        inAppOrderingSettings: {
          tips: patch.tips ?? settings?.tips ?? toApiTips(DEFAULT_TIP_SETTINGS),
          sessionTimerLength: patch.sessionTimerLength ?? settings?.sessionTimerLength ?? DISABLED_SESSION_TIMER_LENGTH,
        },
      }).unwrap();

      return response?.message;
    },
    [organizationId, settings, updateOrganizationV2]
  );

  return {
    settings,
    isLoading: isLoading && !data,
    isFetching,
    isSaving,
    saveSettings,
  };
};
