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

/**
 * Either a specific selection, or every outstanding item at once. A partial
 * delivery carries menu items and combos independently — either list may be
 * empty, but not both.
 */
export type DeliverItemsPayload = { all: true } | { all?: false; menuItemIds: string[]; comboIds: string[] };

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
   * True only while there is nothing to show for the current filters — a
   * first load or a filter change. Drives the table's loading bar, so a
   * background poll, a manual refresh and a single-row write all leave the
   * rows on screen untouched.
   */
  isListLoading: boolean;
  /** The manual refresh button's own spinner. A poll never sets it. */
  isRefreshing: boolean;
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

/** How often the list re-reads itself while the tab is focused. */
export const ORDERS_POLL_INTERVAL_MS = 30_000;

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
  //
  // The poll keeps the board current without anyone touching it. It stops
  // while the tab is in the background, and `skip` already halts it when no
  // organization is selected.
  const { currentData, data, isLoading, isFetching, refetch } = useGetOrdersV2Query(queryArgs, {
    skip: !organizationId,
    refetchOnMountOrArgChange: true,
    pollingInterval: ORDERS_POLL_INTERVAL_MS,
    skipPollingIfUnfocused: true,
  });

  // Only the refresh button's own spinner — a background poll must leave the
  // screen completely still, so it never sets this.
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refetchOrders = useCallback(async () => {
    if (!organizationId) return;

    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
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
        const args: UpdateOrderV2Args = { id: order.id };

        if (payload.all) {
          // `deliveredall` settles the whole order — the backend works out
          // which items and combos are still outstanding.
          args.deliveredall = true;
        } else {
          // Combos go over as the order-combo line ids themselves — unlike
          // `deliveredMenuItem`, which is keyed on the menu item definition.
          //
          // Empty strings are dropped by the slice, so a combo-only delivery
          // sends `deliveredCombo` alone, and vice versa.
          args.deliveredMenuItem = payload.menuItemIds.join(',');
          args.deliveredCombo = payload.comboIds.join(',');
        }

        // Once nothing is left to hand over the order moves on: `completed`
        // if it is already settled, otherwise `sent` to await payment. Combos
        // count as outstanding until the API gives them a delivery state, so
        // a mixed order only advances when its combos are selected too.
        const outstandingItems = order.rounds.filter((round) => !round.isDelivered).flatMap((round) => round.items.map((item) => item.menuItemId));
        const outstandingCombos = order.combos.filter((combo) => !combo.isDelivered).map((combo) => combo.id);

        const deliversEverything =
          payload.all ||
          (outstandingItems.every((id) => payload.menuItemIds.includes(id)) &&
            outstandingCombos.every((id) => payload.comboIds.includes(id)));

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
          // Always sent, empty array included — the endpoint replaces the whole
          // list, so omitting it is how a removed combo would come back. Note
          // the backend wants `quantity` as a string here, unlike `items`.
          combos: payload.combos.map((combo) => ({
            combo: combo.comboId,
            items: combo.menuItemIds,
            quantity: String(combo.quantity),
          })),
          userId: order.customer.id || undefined,
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
    // `currentData` is undefined only until the current args have landed, so
    // it separates "nothing to show yet" from "re-reading what is already up".
    isListLoading: isFetching && !currentData,
    isRefreshing,
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
