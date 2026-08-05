'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useCreateOccasionMutation, useDeleteOccasionMutation, useGetOccasionsQuery } from '@/store/Reducer/occasions-api';
import { useCallback, useMemo, useState } from 'react';
import { mapApiOccasions } from './mappers';
import { Occasion } from './types';

// ============================================================
// The section's own data seam.
//
// Occasions persist immediately rather than through the page-level "Save
// settings" button — there is one endpoint per action and no update. Both
// mutations invalidate the list tag, so the chips refresh themselves.
// ============================================================

interface UseOccasionsReturn {
  occasions: Occasion[];
  /** First load only — the refetch after a write keeps the chips on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isMutating: boolean;
  /** Split out from `isMutating` so the Add button spins only on its own write. */
  isCreating: boolean;
  /** The occasion currently being deleted, so only that chip shows as busy. */
  pendingDeleteId: string | null;
  /** Each resolves with the backend's own message so the caller can surface it. */
  createOccasion: (label: string) => Promise<string | undefined>;
  deleteOccasion: (id: string) => Promise<string | undefined>;
}

export const useOccasions = (organizationId?: string): UseOccasionsReturn => {
  // Admin picks the company in the header; organizers have none.
  const { companyId } = useCompanySelectionState();

  const { data, isLoading, isFetching } = useGetOccasionsQuery(
    { organization: organizationId as string },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const occasions = useMemo(() => mapApiOccasions(data ?? []), [data]);

  const [createOccasionMutation, { isLoading: isCreating }] = useCreateOccasionMutation();
  const [deleteOccasionMutation, { isLoading: isDeleting }] = useDeleteOccasionMutation();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const createOccasion = useCallback(
    async (label: string) => {
      if (!organizationId) throw new Error('No organization selected');

      // Unwrapped so a failed request rejects and the caller can toast it.
      const response = await createOccasionMutation({
        organization: organizationId,
        companyOrganizer: companyId ?? undefined,
        name: label,
      }).unwrap();

      return response?.message;
    },
    [organizationId, companyId, createOccasionMutation]
  );

  const deleteOccasion = useCallback(
    async (id: string) => {
      setPendingDeleteId(id);
      try {
        const response = await deleteOccasionMutation({ id }).unwrap();
        return response?.message;
      } finally {
        setPendingDeleteId(null);
      }
    },
    [deleteOccasionMutation]
  );

  return {
    occasions,
    isLoading: isLoading && !data,
    isFetching,
    isMutating: isCreating || isDeleting,
    isCreating,
    pendingDeleteId,
    createOccasion,
    deleteOccasion,
  };
};
