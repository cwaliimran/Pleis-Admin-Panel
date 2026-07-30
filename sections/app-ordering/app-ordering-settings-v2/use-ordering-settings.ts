'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mockOrderingSettingsApi } from './mock-data';
import { DeliveryOption, DeliveryOptionPayload, OrderTimingSettings, OrderingSettings, PaymentSettings, TipSettings } from './types';

// ============================================================
// API SEAM
//
// Deliberately shaped like the RTK Query hooks this module will use once
// the endpoints exist: `{ data, isLoading, isFetching }` for reads and
// `[trigger, { isLoading }]`-style flags for writes.
//
// Swapping to the real API means replacing the bodies below with
// `useGetOrderingSettingsQuery` / `useUpdate*Mutation` — the components
// consuming this hook do not change.
// ============================================================

type MutationKey = 'payment' | 'tips' | 'orderTiming' | 'deliveryOptions';

interface UseOrderingSettingsReturn {
  settings: OrderingSettings | null;
  isLoading: boolean;
  isFetching: boolean;
  isSavingPayment: boolean;
  isSavingTips: boolean;
  isSavingOrderTiming: boolean;
  isMutatingDeliveryOptions: boolean;
  savePayment: (payment: PaymentSettings) => Promise<void>;
  saveTips: (tips: TipSettings) => Promise<void>;
  saveOrderTiming: (orderTiming: OrderTimingSettings) => Promise<void>;
  createDeliveryOption: (payload: DeliveryOptionPayload) => Promise<void>;
  updateDeliveryOption: (id: string, payload: DeliveryOptionPayload) => Promise<void>;
  deleteDeliveryOption: (id: string) => Promise<void>;
  generateDeliveryOptionQrCode: (id: string) => Promise<void>;
}

export const useOrderingSettings = (organizationId?: string): UseOrderingSettingsReturn => {
  const [settings, setSettings] = useState<OrderingSettings | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [pending, setPending] = useState<Record<MutationKey, boolean>>({
    payment: false,
    tips: false,
    orderTiming: false,
    deliveryOptions: false,
  });

  /** Guards against a slow response for a previously selected organization landing last. */
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!organizationId) {
      // Clearing here is what stops one organization's values leaking into another's form.
      setSettings(null);
      setHasLoadedOnce(false);
      setIsFetching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsFetching(true);
    setSettings(null);

    mockOrderingSettingsApi
      .get(organizationId)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setSettings(data);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setIsFetching(false);
        setHasLoadedOnce(true);
      });
  }, [organizationId]);

  const runMutation = useCallback(
    async <T>(key: MutationKey, mutation: (orgId: string) => Promise<T>, apply: (result: T) => void) => {
      if (!organizationId) throw new Error('No organization selected');

      const requestId = requestIdRef.current;
      setPending((prev) => ({ ...prev, [key]: true }));
      try {
        const result = await mutation(organizationId);
        // Drop the result if the user switched organizations mid-flight.
        if (requestId === requestIdRef.current) apply(result);
      } finally {
        setPending((prev) => ({ ...prev, [key]: false }));
      }
    },
    [organizationId]
  );

  const savePayment = useCallback(
    (payment: PaymentSettings) =>
      runMutation(
        'payment',
        (orgId) => mockOrderingSettingsApi.updatePayment(orgId, payment),
        (result) => setSettings((prev) => (prev ? { ...prev, payment: result } : prev))
      ),
    [runMutation]
  );

  const saveTips = useCallback(
    (tips: TipSettings) =>
      runMutation(
        'tips',
        (orgId) => mockOrderingSettingsApi.updateTips(orgId, tips),
        (result) => setSettings((prev) => (prev ? { ...prev, tips: result } : prev))
      ),
    [runMutation]
  );

  const saveOrderTiming = useCallback(
    (orderTiming: OrderTimingSettings) =>
      runMutation(
        'orderTiming',
        (orgId) => mockOrderingSettingsApi.updateOrderTiming(orgId, orderTiming),
        (result) => setSettings((prev) => (prev ? { ...prev, orderTiming: result } : prev))
      ),
    [runMutation]
  );

  const applyDeliveryOptions = useCallback(
    (deliveryOptions: DeliveryOption[]) => setSettings((prev) => (prev ? { ...prev, deliveryOptions } : prev)),
    []
  );

  const createDeliveryOption = useCallback(
    (payload: DeliveryOptionPayload) =>
      runMutation('deliveryOptions', (orgId) => mockOrderingSettingsApi.createDeliveryOption(orgId, payload), applyDeliveryOptions),
    [runMutation, applyDeliveryOptions]
  );

  const updateDeliveryOption = useCallback(
    (id: string, payload: DeliveryOptionPayload) =>
      runMutation('deliveryOptions', (orgId) => mockOrderingSettingsApi.updateDeliveryOption(orgId, id, payload), applyDeliveryOptions),
    [runMutation, applyDeliveryOptions]
  );

  const deleteDeliveryOption = useCallback(
    (id: string) => runMutation('deliveryOptions', (orgId) => mockOrderingSettingsApi.deleteDeliveryOption(orgId, id), applyDeliveryOptions),
    [runMutation, applyDeliveryOptions]
  );

  const generateDeliveryOptionQrCode = useCallback(
    (id: string) => runMutation('deliveryOptions', (orgId) => mockOrderingSettingsApi.generateDeliveryOptionQrCode(orgId, id), applyDeliveryOptions),
    [runMutation, applyDeliveryOptions]
  );

  return {
    settings,
    isLoading: isFetching && !hasLoadedOnce,
    isFetching,
    isSavingPayment: pending.payment,
    isSavingTips: pending.tips,
    isSavingOrderTiming: pending.orderTiming,
    isMutatingDeliveryOptions: pending.deliveryOptions,
    savePayment,
    saveTips,
    saveOrderTiming,
    createDeliveryOption,
    updateDeliveryOption,
    deleteDeliveryOption,
    generateDeliveryOptionQrCode,
  };
};
