'use client';

import type { GetOrdersV2Args, UpdateOrderV2Args } from '@/store/Reducer/order-management-v2-api';
import {
  useGetOrderingStatusV2Query,
  useGetOrdersV2Query,
  useUpdateOrderDetailsV2Mutation,
  useUpdateOrderV2Mutation,
  useUpdateOrderingStatusV2Mutation,
} from '@/store/Reducer/order-management-v2-api';
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT, NEXT_STATUS_BY_ACTION, getRejectionReasonLabel } from './constants';
import { mapApiOrders, mapOrderingStatus, mapPagination, mapTabCounts } from './mappers';
import {
  DestructiveActionPayload,
  Order,
  OrderActionType,
  OrderFilters,
  OrderPagination,
  OrderTabCounts,
  OrderUpdatePayload,
  OrderingStatus,
} from './types';

// ============================================================
// The module's single data seam.
//
// Everything here is served by RTK Query. Components consuming this hook
// work with the view model only and never see the wire shape.
// ============================================================

/** Either a specific set of menu items, or every outstanding one. */
export type DeliverItemsPayload = { all: true } | { all?: false; menuItemIds: string[] };

interface UseOrderManagementArgs {
  organizationId?: string;
  filters: OrderFilters;
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
}

interface UseOrderManagementReturn {
  orders: Order[];
  counts: OrderTabCounts;
  pagination: OrderPagination;
  orderingStatus: OrderingStatus | null;
  isLoading: boolean;
  isFetching: boolean;
  /**
   * `isFetching` minus the refetch that follows a write. Drives the table's
   * loading bar, so a single-row update never blanks the whole list.
   */
  isListLoading: boolean;
  isTogglingOrdering: boolean;
  /** The order currently being rewritten by the update modal, if any. */
  updatingOrderId: string | null;
  pendingOrderId: string | null;
  /** Which action is running on `pendingOrderId` — lets one button spin, not all. */
  pendingAction: OrderActionType | null;
  /** The order currently having items marked delivered, if any. */
  deliveringOrderId: string | null;
  /**
   * Marks specific menu items delivered, or the whole order at once.
   * Resolves with the backend's message so the caller can surface it.
   */
  deliverItems: (order: Order, payload: DeliverItemsPayload) => Promise<string | undefined>;
  /** Re-reads the current page without changing any filter state. */
  refetchOrders: () => void;
  toggleOrdering: (isOpen: boolean) => Promise<string | undefined>;
  runOrderAction: (order: Order, action: OrderActionType, payload?: DestructiveActionPayload) => Promise<string | undefined>;
  /** Rewrites a still-pending order's items and pickup details. */
  updateOrderDetails: (order: Order, payload: OrderUpdatePayload) => Promise<string | undefined>;
}

/** `all` is a UI-only value — the param is simply left off. */
const omitAll = <T extends string>(value: T | 'all'): T | undefined => (value === 'all' ? undefined : (value as T));

export const useOrderManagement = ({ organizationId, filters, page, limit }: UseOrderManagementArgs): UseOrderManagementReturn => {
  // ---- Orders list ----
  const queryArgs: GetOrdersV2Args = useMemo(
    () => ({
      organization: organizationId,
      status: filters.tab,
      page: page - 1, // the slice re-adds the offset; the API is 1-based
      limit,
      keyword: filters.search.trim() || undefined,
      orderStatus: omitAll(filters.status),
      pickupFilter: omitAll(filters.deliveryType),
      paymentMethod: omitAll(filters.paymentType),
      range: omitAll(filters.dateRange),
    }),
    [organizationId, filters, page, limit]
  );

  // `refetchOnMountOrArgChange` because orders are live — switching tab or
  // filter must hit the API rather than replay a cached page.
  const { data, isLoading, isFetching, refetch } = useGetOrdersV2Query(queryArgs, {
    skip: !organizationId,
    refetchOnMountOrArgChange: true,
  });

  const refetchOrders = useCallback(() => {
    if (!organizationId) return;
    refetch();
  }, [organizationId, refetch]);

  const orders = useMemo(() => mapApiOrders(data?.data ?? []), [data]);
  const counts = useMemo(() => mapTabCounts(data?.meta), [data]);
  const pagination = useMemo(() => mapPagination(data?.meta, page, limit || DEFAULT_PAGE_LIMIT), [data, page, limit]);

  // ---- Item delivery ----
  const [updateOrder] = useUpdateOrderV2Mutation();
  const [deliveringOrderId, setDeliveringOrderId] = useState<string | null>(null);

  const deliverItems = useCallback(
    async (order: Order, payload: DeliverItemsPayload) => {
      setDeliveringOrderId(order.id);
      try {
        // One field at a time: `deliveredall` for the whole order, otherwise
        // just the id list. The backend derives the new status from either.
        const args: UpdateOrderV2Args = {
          id: order.id,
          ...(payload.all ? { deliveredall: true } : { deliveredMenuItem: payload.menuItemIds.join(',') }),
        };

        // Once nothing is left to hand over the order moves on: `completed`
        // if it is already settled, otherwise `sent` to await payment.
        const outstanding = order.rounds.filter((round) => !round.isDelivered).flatMap((round) => round.items.map((item) => item.menuItemId));
        const deliversEverything = payload.all || outstanding.every((id) => payload.menuItemIds.includes(id));

        if (deliversEverything) {
          args.status = order.paymentStatus === 'paid' ? 'completed' : 'sent';
        }

        const response = await updateOrder(args).unwrap();

        // Awaited inside the pending window, so the button stays busy until
        // the fresh list has landed and the table never flashes its loader.
        await refetch();

        return response?.message;
      } finally {
        setDeliveringOrderId(null);
      }
    },
    [updateOrder, refetch]
  );

  // ---- Rewriting a pending order ----
  const [updateOrderDetailsMutation] = useUpdateOrderDetailsV2Mutation();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const updateOrderDetails = useCallback(
    async (order: Order, payload: OrderUpdatePayload) => {
      setUpdatingOrderId(order.id);
      try {
        const response = await updateOrderDetailsMutation({
          id: order.id,
          // The endpoint keys lines on the menu item, so the draft maps
          // straight across.
          items: payload.items.map((item) => ({ menuItem: item.menuItemId, quantity: item.quantity })),
          userId: order.customer.id || undefined,
          pickupType: payload.deliveryType,
          // Blanked by the modal for every pickup type other than table service.
          tableNumber: payload.tableNumber || undefined,
        }).unwrap();

        await refetch();

        return response?.message;
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [updateOrderDetailsMutation, refetch]
  );

  // ---- Ordering switch (per organization) ----
  const { data: orderingStatusData } = useGetOrderingStatusV2Query({ organization: organizationId }, { skip: !organizationId });

  const [updateOrderingStatus, { isLoading: isTogglingOrdering }] = useUpdateOrderingStatusV2Mutation();

  const orderingStatus = useMemo(() => mapOrderingStatus(orderingStatusData), [orderingStatusData]);

  const toggleOrdering = useCallback(
    async (isOpen: boolean) => {
      if (!organizationId) throw new Error('No organization selected');

      // Unwrapped so a failed request rejects and the view can toast it;
      // the mutation invalidates the status tag, which refetches the switch.
      const response = await updateOrderingStatus({ organization: organizationId, isOrderingEnabled: isOpen }).unwrap();

      return response?.message;
    },
    [organizationId, updateOrderingStatus]
  );

  // ---- Status actions ----
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<OrderActionType | null>(null);

  const runOrderAction: UseOrderManagementReturn['runOrderAction'] = useCallback(
    async (order, action, payload) => {
      const nextStatus = NEXT_STATUS_BY_ACTION[action];

      if (action !== 'markAsPaid' && !nextStatus) {
        throw new Error('This action is not connected yet.');
      }

      setPendingOrderId(order.id);
      setPendingAction(action);
      try {
        // `markAsPaid` settles payment; everything else writes the status.
        const args: UpdateOrderV2Args = action === 'markAsPaid' ? { id: order.id, paymentStatus: 'paid' } : { id: order.id, status: nextStatus };

        // A `sent` order has nothing left to hand over, so settling the
        // payment is the last step — it completes the order outright.
        if (action === 'markAsPaid' && order.status === 'sent') {
          args.status = 'completed';
        }

        // The two destructive actions carry the same pair of fields under
        // different names, so only the matching pair is ever sent. The reason
        // goes over as the label the user picked, not its key.
        const reasonText = payload?.reason ? getRejectionReasonLabel(payload.reason) : '';
        const noteText = payload?.note?.trim() ?? '';

        if (action === 'reject') {
          args.reasonForRejection = reasonText;
          args.noteForRejection = noteText;
        } else if (action === 'cancel') {
          args.reasonForCancellation = reasonText;
          args.noteForCancellation = noteText;
        }

        const response = await updateOrder(args).unwrap();
        await refetch();

        return response?.message;
      } finally {
        setPendingOrderId(null);
        setPendingAction(null);
      }
    },
    [updateOrder, refetch]
  );

  return {
    orders,
    counts,
    pagination,
    orderingStatus,
    isLoading: isLoading && !data,
    isFetching,
    isListLoading: isFetching && !deliveringOrderId && !pendingOrderId && !updatingOrderId,
    isTogglingOrdering,
    updatingOrderId,
    pendingOrderId,
    pendingAction,
    deliveringOrderId,
    deliverItems,
    refetchOrders,
    toggleOrdering,
    runOrderAction,
    updateOrderDetails,
  };
};
