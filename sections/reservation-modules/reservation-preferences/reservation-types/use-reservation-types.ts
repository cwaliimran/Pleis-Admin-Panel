'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import {
  useCreateReservationTypeMutation,
  useDeleteReservationTypeMutation,
  useGetReservationTypesQuery,
  useUpdateReservationTypeMutation,
} from '@/store/Reducer/reservation-types-api';
import type { GetReservationTypesArgs } from '@/store/Reducer/reservation-types-api';
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT } from './constants';
import { mapApiReservationTypes, mapPagination, toReservationTypeBody } from './mappers';
import { ReservationType, ReservationTypeFilters, ReservationTypePagination, ReservationTypePayload } from './types';

// ============================================================
// The section's own data seam.
//
// Reservation types persist immediately through their own endpoints rather
// than the page-level "Save settings" button. Filtering and paging are done
// by the backend; every mutation invalidates the list tag, so the table
// refreshes itself.
// ============================================================

interface UseReservationTypesArgs {
  organizationId?: string;
  filters: ReservationTypeFilters;
  /** 1-based, as shown in the UI. */
  page: number;
  limit?: number;
}

interface UseReservationTypesReturn {
  reservationTypes: ReservationType[];
  pagination: ReservationTypePagination;
  /** First load only — the refetch after a write keeps the rows on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isMutating: boolean;
  /** The type currently being updated or deleted, so only that row reads as busy. */
  pendingTypeId: string | null;
  /** Each resolves with the backend's own message so the caller can surface it. */
  createReservationType: (payload: ReservationTypePayload) => Promise<string | undefined>;
  updateReservationType: (id: string, payload: ReservationTypePayload) => Promise<string | undefined>;
  deleteReservationType: (id: string) => Promise<string | undefined>;
}

/** `all` is a UI-only value — the param is simply left off. */
const omitAll = <T extends string>(value: T | 'all'): T | undefined => (value === 'all' ? undefined : (value as T));

export const useReservationTypes = ({
  organizationId,
  filters,
  page,
  limit = DEFAULT_PAGE_LIMIT,
}: UseReservationTypesArgs): UseReservationTypesReturn => {
  // Admin picks the company in the header; organizers have none.
  const { companyId } = useCompanySelectionState();

  const queryArgs: GetReservationTypesArgs = useMemo(
    () => ({
      organization: organizationId as string,
      page: page - 1, // the slice re-adds the offset; the API is 1-based
      limit,
      status: omitAll(filters.status),
      conditionType: omitAll(filters.conditionType),
    }),
    [organizationId, page, limit, filters]
  );

  const { data, isLoading, isFetching } = useGetReservationTypesQuery(queryArgs, {
    skip: !organizationId,
    refetchOnMountOrArgChange: true,
  });

  const reservationTypes = useMemo(() => mapApiReservationTypes(data?.data ?? []), [data]);
  const pagination = useMemo(() => mapPagination(data?.meta, page, limit), [data, page, limit]);

  const [createMutation, { isLoading: isCreating }] = useCreateReservationTypeMutation();
  const [updateMutation, { isLoading: isUpdating }] = useUpdateReservationTypeMutation();
  const [deleteMutation, { isLoading: isDeleting }] = useDeleteReservationTypeMutation();

  const [pendingTypeId, setPendingTypeId] = useState<string | null>(null);

  const createReservationType = useCallback(
    async (payload: ReservationTypePayload) => {
      if (!organizationId) throw new Error('No organization selected');

      // Unwrapped so a failed request rejects and the caller can toast it.
      const response = await createMutation({
        organization: organizationId,
        companyOrganizer: companyId ?? undefined,
        ...toReservationTypeBody(payload),
      }).unwrap();

      return response?.message;
    },
    [organizationId, companyId, createMutation]
  );

  const updateReservationType = useCallback(
    async (id: string, payload: ReservationTypePayload) => {
      setPendingTypeId(id);
      try {
        const response = await updateMutation({ id, ...toReservationTypeBody(payload) }).unwrap();
        return response?.message;
      } finally {
        setPendingTypeId(null);
      }
    },
    [updateMutation]
  );

  const deleteReservationType = useCallback(
    async (id: string) => {
      setPendingTypeId(id);
      try {
        const response = await deleteMutation({ id }).unwrap();
        return response?.message;
      } finally {
        setPendingTypeId(null);
      }
    },
    [deleteMutation]
  );

  return {
    reservationTypes,
    pagination,
    isLoading: isLoading && !data,
    isFetching,
    isMutating: isCreating || isUpdating || isDeleting,
    pendingTypeId,
    createReservationType,
    updateReservationType,
    deleteReservationType,
  };
};
