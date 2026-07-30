'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mockOrderManagementApi } from './mock-data';
import { DestructiveActionPayload, Order, OrderActionType, OrderFilters, OrderTabCounts, OrderingStatus } from './types';

// ============================================================
// API SEAM
//
// Deliberately shaped like the RTK Query hooks this module will use once
// the endpoints exist: `{ data, isLoading, isFetching }` for reads and
// per-mutation pending flags for writes.
//
// Swapping to the real API means replacing the bodies below with
// `useGetOrdersQuery` / `useUpdateOrderMutation` etc. — the components
// consuming this hook do not change.
// ============================================================

const EMPTY_COUNTS: OrderTabCounts = { active: 0, past: 0 };

interface UseOrderManagementArgs {
  organizationId?: string;
  filters: OrderFilters;
  /** Recorded as who opened in-app ordering. */
  actorName: string;
}

interface UseOrderManagementReturn {
  orders: Order[];
  counts: OrderTabCounts;
  orderingStatus: OrderingStatus | null;
  isLoading: boolean;
  isFetching: boolean;
  isTogglingOrdering: boolean;
  pendingOrderId: string | null;
  toggleOrdering: (isOpen: boolean) => Promise<void>;
  runOrderAction: (orderId: string, action: OrderActionType, payload?: DestructiveActionPayload) => Promise<void>;
}

export const useOrderManagement = ({ organizationId, filters, actorName }: UseOrderManagementArgs): UseOrderManagementReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<OrderTabCounts>(EMPTY_COUNTS);
  const [orderingStatus, setOrderingStatus] = useState<OrderingStatus | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isTogglingOrdering, setIsTogglingOrdering] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  /** Guards against a slow response for a previous organization landing last. */
  const organizationRequestRef = useRef(0);
  /** Same guard for the list, which also re-runs on every filter change. */
  const ordersRequestRef = useRef(0);

  // ---- Ordering status (per organization) ----
  useEffect(() => {
    if (!organizationId) {
      setOrderingStatus(null);
      return;
    }

    const requestId = ++organizationRequestRef.current;

    mockOrderManagementApi.getOrderingStatus(organizationId).then((status) => {
      if (requestId !== organizationRequestRef.current) return;
      setOrderingStatus(status);
    });
  }, [organizationId]);

  // ---- Orders list (per organization + filters) ----
  useEffect(() => {
    if (!organizationId) {
      // Clearing here is what stops one venue's orders showing under another.
      setOrders([]);
      setCounts(EMPTY_COUNTS);
      setHasLoadedOnce(false);
      setIsFetching(false);
      return;
    }

    const requestId = ++ordersRequestRef.current;
    setIsFetching(true);

    mockOrderManagementApi
      .getOrders(organizationId, filters)
      .then((response) => {
        if (requestId !== ordersRequestRef.current) return;
        setOrders(response.orders);
        setCounts(response.counts);
      })
      .finally(() => {
        if (requestId !== ordersRequestRef.current) return;
        setIsFetching(false);
        setHasLoadedOnce(true);
      });
  }, [organizationId, filters]);

  const refetchOrders = useCallback(async () => {
    if (!organizationId) return;

    const requestId = ++ordersRequestRef.current;
    const response = await mockOrderManagementApi.getOrders(organizationId, filters);
    if (requestId !== ordersRequestRef.current) return;

    setOrders(response.orders);
    setCounts(response.counts);
  }, [organizationId, filters]);

  const toggleOrdering = useCallback(
    async (isOpen: boolean) => {
      if (!organizationId) throw new Error('No organization selected');

      setIsTogglingOrdering(true);
      try {
        const status = await mockOrderManagementApi.setOrderingOpen(organizationId, isOpen, actorName);
        setOrderingStatus(status);
      } finally {
        setIsTogglingOrdering(false);
      }
    },
    [organizationId, actorName]
  );

  const runOrderAction = useCallback(
    async (orderId: string, action: OrderActionType, payload?: DestructiveActionPayload) => {
      if (!organizationId) throw new Error('No organization selected');

      setPendingOrderId(orderId);
      try {
        await mockOrderManagementApi.runOrderAction(organizationId, orderId, action, payload);
        // Re-read so the row drops out of the tab when it changes lifecycle stage.
        await refetchOrders();
      } finally {
        setPendingOrderId(null);
      }
    },
    [organizationId, refetchOrders]
  );

  return {
    orders,
    counts,
    orderingStatus,
    isLoading: isFetching && !hasLoadedOnce,
    isFetching,
    isTogglingOrdering,
    pendingOrderId,
    toggleOrdering,
    runOrderAction,
  };
};
