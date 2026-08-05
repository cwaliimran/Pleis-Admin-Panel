'use client';

import {
  useCreateDeliveryOptionMutation,
  useDeleteDeliveryOptionMutation,
  useGetDeliveryOptionsQuery,
  useUpdateDeliveryOptionMutation,
} from '@/store/Reducer/delivery-options-api';
import { useCallback, useMemo } from 'react';
import { mapApiDeliveryOptions, toDeliveryOptionBody } from './mappers';
import { DeliveryOption, DeliveryOptionPayload } from './types';

// ============================================================
// The section's own data seam.
//
// Everything here is served by RTK Query; the mutations invalidate the
// list tag, so the table refreshes itself after every write. Components
// work with the view model only and never see the wire shape.
// ============================================================

interface UseDeliveryOptionsReturn {
  options: DeliveryOption[];
  /** First load only — a refetch after a write keeps the current rows on screen. */
  isLoading: boolean;
  isFetching: boolean;
  isMutating: boolean;
  /** Each resolves with the backend's own message so the caller can surface it. */
  createOption: (payload: DeliveryOptionPayload) => Promise<string | undefined>;
  updateOption: (id: string, payload: DeliveryOptionPayload) => Promise<string | undefined>;
  deleteOption: (id: string) => Promise<string | undefined>;
}

export const useDeliveryOptions = (organizationId?: string): UseDeliveryOptionsReturn => {
  const { data, isLoading, isFetching } = useGetDeliveryOptionsQuery(
    { organizationId: organizationId as string },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const options = useMemo(() => mapApiDeliveryOptions(data ?? []), [data]);

  const [createDeliveryOption, { isLoading: isCreating }] = useCreateDeliveryOptionMutation();
  const [updateDeliveryOption, { isLoading: isUpdating }] = useUpdateDeliveryOptionMutation();
  const [deleteDeliveryOption, { isLoading: isDeleting }] = useDeleteDeliveryOptionMutation();

  const createOption = useCallback(
    async (payload: DeliveryOptionPayload) => {
      if (!organizationId) throw new Error('No organization selected');

      // Unwrapped so a failed request rejects and the caller can toast it.
      const response = await createDeliveryOption({ organizationId, body: toDeliveryOptionBody(payload) }).unwrap();
      return response?.message;
    },
    [organizationId, createDeliveryOption]
  );

  const updateOption = useCallback(
    async (id: string, payload: DeliveryOptionPayload) => {
      if (!organizationId) throw new Error('No organization selected');

      const response = await updateDeliveryOption({ organizationId, id, body: toDeliveryOptionBody(payload) }).unwrap();
      return response?.message;
    },
    [organizationId, updateDeliveryOption]
  );

  const deleteOption = useCallback(
    async (id: string) => {
      if (!organizationId) throw new Error('No organization selected');

      const response = await deleteDeliveryOption({ organizationId, id }).unwrap();
      return response?.message;
    },
    [organizationId, deleteDeliveryOption]
  );

  return {
    options,
    isLoading: isLoading && !data,
    isFetching,
    isMutating: isCreating || isUpdating || isDeleting,
    createOption,
    updateOption,
    deleteOption,
  };
};
