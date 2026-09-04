'use client';

import type { GetOrdersV2Args, UpdateOrderV2Args } from '@/store/Reducer/order-management-v2-api';
import {
  useGetOrderingStatusV2Query,
  useGetOrdersV2Query,
  useUpdateOrderDetailsV2Mutation,
  useUpdateOrderV2Mutation,
  useUpdateOrderingStatusV2Mutation,
} from '@/store/Reducer/order-management-v2-api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_PAGE_LIMIT, NEXT_STATUS_BY_ACTION, getRejectionReasonLabel } from './constants';
import { mapApiOrders, mapOrderingStatus, mapPagination, mapTabCounts } from './mappers';
import {
  DestructiveActionPayload,
  Order,
  OrderActionType,
  OrderFilters,
  OrderPagination,
  OrderSocketMessage,
  OrderSocketStatus,
  OrderTabCounts,
  OrderUpdatePayload,
  OrderingStatus,
  UserType,
} from './types';
import { ORDER_SOCKET_LOG_PREFIX, useOrderSocket } from './use-order-socket';

/**
 * Either a specific selection, or every outstanding item at once. A partial
 * delivery carries menu items and combos independently — either list may be
 * empty, but not both.
 */
export type DeliverItemsPayload = { all: true } | { all?: false; menuItemIds: string[]; comboIds: string[] };

interface UseOrderManagementArgs {
  userType: UserType;
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
   * socket-driven refetch, a manual refresh and a single-row write all
   * leave the rows on screen untouched.
   */
  isListLoading: boolean;
  /** The manual refresh button's own spinner. A socket refetch never sets it. */
  isRefreshing: boolean;
  isTogglingOrdering: boolean;
  updatingOrderId: string | null;
  pendingOrderId: string | null;
  /** Which action is running on `pendingOrderId` — lets one button spin, not all. */
  pendingAction: OrderActionType | null;
  deliveringOrderId: string | null;
  socketStatus: OrderSocketStatus;
  /** Orders that arrived over the socket this session. Only marks rows as new. */
  liveOrderIds: string[];
  clearLiveOrders: () => void;
  /** Resolves with the backend's message so the caller can surface it. */
  deliverItems: (order: Order, payload: DeliverItemsPayload) => Promise<string | undefined>;
  refetchOrders: () => void;
  toggleOrdering: (isOpen: boolean) => Promise<string | undefined>;
  runOrderAction: (order: Order, action: OrderActionType, payload?: DestructiveActionPayload) => Promise<string | undefined>;
  updateOrderDetails: (order: Order, payload: OrderUpdatePayload) => Promise<string | undefined>;
}

/**
 * A burst of socket events — an order placed, then immediately confirmed —
 * collapses into a single refetch fired at the end of this window.
 */
export const SOCKET_REFETCH_COALESCE_MS = 400;

/** `all` is a UI-only value — the param is simply left off. */
const omitAll = <T extends string>(value: T | 'all'): T | undefined => (value === 'all' ? undefined : (value as T));

export const useOrderManagement = ({ userType, organizationId, filters, page, limit }: UseOrderManagementArgs): UseOrderManagementReturn => {
  // ---- Live updates ----
  //
  // The socket is a signal, never a source of rows. Its payload is a
  // different serialisation of an order than the list endpoint's — see
  // `OrderSocketMessage` — so acting on it means re-reading the list, which
  // keeps one shape on screen and brings the tab counts and paging with it.
  const [liveOrderIds, setLiveOrderIds] = useState<string[]>([]);

  // The query is declared below, so its `refetch` is reached through a ref.
  const refetchRef = useRef<() => void>(() => {});
  const coalesceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // What the list held when the event arrived — how an arrival is told apart
  // from a change to something already on screen.
  const listedOrderIdsRef = useRef<Set<string>>(new Set());

  const scheduleRefetch = useCallback(() => {
    if (coalesceTimerRef.current) return;

    coalesceTimerRef.current = setTimeout(() => {
      coalesceTimerRef.current = null;
      refetchRef.current();
    }, SOCKET_REFETCH_COALESCE_MS);
  }, []);

  const handleSocketEvent = useCallback(
    (message: OrderSocketMessage) => {
      // The namespace is already scoped by organization; this only guards
      // against a frame arriving as the selection is being switched.
      if (message.organizationId && organizationId && message.organizationId !== organizationId) return;

      // `NEW_ORDER` does not always mean a new order. The backend also emits
      // it when an existing one changes hands — an `ORDER_UPDATE` for the
      // same id lands milliseconds earlier — so taking it at face value puts
      // a "NEW" badge, a toast and a chime on a row that has been on screen
      // for minutes. An id the list is already showing is therefore treated
      // as the update it is.
      if (message.event === 'NEW_ORDER' && message.orderId) {
        if (listedOrderIdsRef.current.has(message.orderId)) {
          console.log(`${ORDER_SOCKET_LOG_PREFIX} NEW_ORDER for an order already listed — treating as an update`, message.orderId);
        } else {
          setLiveOrderIds((current) => (current.includes(message.orderId) ? current : [...current, message.orderId]));
        }
      }

      scheduleRefetch();
    },
    [organizationId, scheduleRefetch]
  );

  const { status: socketStatus } = useOrderSocket({
    userType,
    organizationId,
    onEvent: handleSocketEvent,
  });

  const clearLiveOrders = useCallback(() => setLiveOrderIds([]), []);

  useEffect(
    () => () => {
      if (coalesceTimerRef.current) clearTimeout(coalesceTimerRef.current);
    },
    []
  );

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
  // filter must hit the API rather than replay a cached page. There is no
  // timed poll: the list moves only on a socket event, a write, or the
  // refresh button, which is what the "Offline" indicator is there to say.
  const { currentData, data, isLoading, isFetching, refetch } = useGetOrdersV2Query(queryArgs, {
    skip: !organizationId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // Only the refresh button's own spinner — a socket-driven refetch must
  // leave the screen still, so it never sets this.
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

  // Scoped to the page in view, so an order on another page or behind a
  // filter still counts as new — better a spurious badge than a missed order.
  useEffect(() => {
    listedOrderIdsRef.current = new Set(orders.map((order) => order.id));
  }, [orders]);
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
          // Empty strings are dropped by the slice.
          args.deliveredMenuItem = payload.menuItemIds.join(',');
          args.deliveredCombo = payload.comboIds.join(',');
        }

        // Once nothing is left to hand over the order moves on: `completed`
        // if it is already settled, otherwise `sent` to await payment.
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
        // the fresh list lands and the table never flashes its loader.
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
          items: payload.items.map((item) => ({ menuItem: item.menuItemId, quantity: item.quantity })),
          // Always sent, empty array included — the endpoint replaces the whole
          // list, so omitting it is how a removed combo would come back. The
          // backend wants `quantity` as a string here, unlike `items`.
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

      // Unwrapped so a failed request rejects and the view can toast it.
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
    socketStatus,
    liveOrderIds,
    clearLiveOrders,
    deliverItems,
    refetchOrders,
    toggleOrdering,
    runOrderAction,
    updateOrderDetails,
  };
};
