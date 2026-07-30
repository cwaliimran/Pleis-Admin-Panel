'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mockReservationPreferencesApi } from './mock-data';
import { ReservationPreferences, ReservationType, ReservationTypePayload } from './types';

// ============================================================
// API SEAM
//
// Deliberately shaped like the RTK Query hooks this module will use once
// the endpoints exist: `{ data, isFetching }` for reads and per-mutation
// pending flags for writes.
//
// Swapping to the real API means replacing the bodies below with
// `useGetReservationPreferencesQuery` / `useUpdateReservationTypeMutation`
// etc. — the components consuming this hook do not change.
// ============================================================

interface UseReservationPreferencesReturn {
  preferences: ReservationPreferences | null;
  reservationTypes: ReservationType[];
  isFetching: boolean;
  isSaving: boolean;
  /** Id of the type currently being created/updated/deleted, if any. */
  pendingTypeId: string | null;
  isMutatingTypes: boolean;
  savePreferences: (next: ReservationPreferences) => Promise<void>;
  createReservationType: (payload: ReservationTypePayload) => Promise<void>;
  updateReservationType: (id: string, payload: ReservationTypePayload) => Promise<void>;
  deleteReservationType: (id: string) => Promise<void>;
}

export const useReservationPreferences = (organizationId?: string): UseReservationPreferencesReturn => {
  const [preferences, setPreferences] = useState<ReservationPreferences | null>(null);
  const [reservationTypes, setReservationTypes] = useState<ReservationType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingTypeId, setPendingTypeId] = useState<string | null>(null);
  const [isMutatingTypes, setIsMutatingTypes] = useState(false);

  /** Guards against a slow response for a previous organization landing last. */
  const requestRef = useRef(0);

  useEffect(() => {
    if (!organizationId) {
      // Clearing here is what stops one organization's settings showing under another.
      setPreferences(null);
      setReservationTypes([]);
      setIsFetching(false);
      return;
    }

    const requestId = ++requestRef.current;
    setIsFetching(true);

    Promise.all([
      mockReservationPreferencesApi.getPreferences(organizationId),
      mockReservationPreferencesApi.getReservationTypes(organizationId),
    ])
      .then(([nextPreferences, nextTypes]) => {
        if (requestId !== requestRef.current) return;
        setPreferences(nextPreferences);
        setReservationTypes(nextTypes);
      })
      .finally(() => {
        if (requestId !== requestRef.current) return;
        setIsFetching(false);
      });
  }, [organizationId]);

  const savePreferences = useCallback(
    async (next: ReservationPreferences) => {
      if (!organizationId) throw new Error('No organization selected');

      setIsSaving(true);
      try {
        const saved = await mockReservationPreferencesApi.savePreferences(organizationId, next);
        setPreferences(saved);
      } finally {
        setIsSaving(false);
      }
    },
    [organizationId]
  );

  const createReservationType = useCallback(
    async (payload: ReservationTypePayload) => {
      if (!organizationId) throw new Error('No organization selected');

      setIsMutatingTypes(true);
      try {
        const created = await mockReservationPreferencesApi.createReservationType(organizationId, payload);
        setReservationTypes((current) => [...current, created]);
      } finally {
        setIsMutatingTypes(false);
      }
    },
    [organizationId]
  );

  const updateReservationType = useCallback(
    async (id: string, payload: ReservationTypePayload) => {
      if (!organizationId) throw new Error('No organization selected');

      setIsMutatingTypes(true);
      setPendingTypeId(id);
      try {
        const updated = await mockReservationPreferencesApi.updateReservationType(organizationId, id, payload);
        setReservationTypes((current) => current.map((type) => (type.id === id ? updated : type)));
      } finally {
        setIsMutatingTypes(false);
        setPendingTypeId(null);
      }
    },
    [organizationId]
  );

  const deleteReservationType = useCallback(
    async (id: string) => {
      if (!organizationId) throw new Error('No organization selected');

      setIsMutatingTypes(true);
      setPendingTypeId(id);
      try {
        await mockReservationPreferencesApi.deleteReservationType(organizationId, id);
        setReservationTypes((current) => current.filter((type) => type.id !== id));
      } finally {
        setIsMutatingTypes(false);
        setPendingTypeId(null);
      }
    },
    [organizationId]
  );

  return {
    preferences,
    reservationTypes,
    isFetching,
    isSaving,
    pendingTypeId,
    isMutatingTypes,
    savePreferences,
    createReservationType,
    updateReservationType,
    deleteReservationType,
  };
};
