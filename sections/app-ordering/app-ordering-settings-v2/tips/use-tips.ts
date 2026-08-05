'use client';

import { useCallback, useMemo } from 'react';
import { useOrganizationOrderingSettings } from '../use-organization-ordering-settings';
import { mapApiTips, toApiTips } from './mappers';
import { TipSettings } from './types';

// ============================================================
// The section's own data seam.
//
// Tips are one branch of the organization's `inAppOrderingSettings`, so
// the save goes through `useOrganizationOrderingSettings`, which carries
// the session timer over untouched.
// ============================================================

interface UseTipsReturn {
  settings: TipSettings;
  /** First load only — the refetch after a save keeps the form on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;
  /** Resolves with the backend's own message so the caller can surface it. */
  save: (values: TipSettings) => Promise<string | undefined>;
}

export const useTips = (organizationId?: string): UseTipsReturn => {
  const { settings: apiSettings, isLoading, isFetching, isSaving, saveSettings } = useOrganizationOrderingSettings(organizationId);

  const settings = useMemo(() => mapApiTips(apiSettings), [apiSettings]);

  const save = useCallback((values: TipSettings) => saveSettings({ tips: toApiTips(values) }), [saveSettings]);

  return { settings, isLoading, isFetching, isSaving, save };
};
