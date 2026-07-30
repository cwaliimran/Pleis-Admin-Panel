'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { mockReservationApi } from './mock-data';
import {
  ConditionOption,
  DaySummary,
  Reservation,
  ReservationPayload,
  ReservationQuery,
  ReservationStatus,
  ReservationTypeOption,
  SlotSummary,
  TypeOccupancy,
  VenueOption,
} from './types';

// ============================================================
// API SEAM
//
// Deliberately shaped like the RTK Query hooks this module will use once
// the endpoints exist: `{ data, isFetching }` for reads and per-mutation
// pending flags for writes.
//
// Swapping to the real API means replacing the bodies below with
// `useGetReservationBoardQuery` / `useCreateReservationMutation` etc. —
// the components consuming this hook do not change.
// ============================================================

interface UseReservationViewArgs {
  organizationId?: string;
  /** The seven ISO dates rendered in the week strip. */
  weekDates: string[];
  query: ReservationQuery;
}

interface UseReservationViewReturn {
  days: DaySummary[];
  slots: SlotSummary[];
  types: TypeOccupancy[];
  reservations: Reservation[];
  venues: VenueOption[];
  reservationTypes: ReservationTypeOption[];
  conditions: ConditionOption[];
  isFetching: boolean;
  isMutating: boolean;
  pendingReservationId: string | null;
  createReservation: (payload: ReservationPayload) => Promise<void>;
  updateReservation: (id: string, payload: ReservationPayload) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  setStatus: (id: string, status: ReservationStatus) => Promise<void>;
}

export const useReservationView = ({ organizationId, weekDates, query }: UseReservationViewArgs): UseReservationViewReturn => {
  const [days, setDays] = useState<DaySummary[]>([]);
  const [slots, setSlots] = useState<SlotSummary[]>([]);
  const [types, setTypes] = useState<TypeOccupancy[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [reservationTypes, setReservationTypes] = useState<ReservationTypeOption[]>([]);
  const [conditions, setConditions] = useState<ConditionOption[]>([]);

  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [pendingReservationId, setPendingReservationId] = useState<string | null>(null);

  /** Guards against a slow response for a previous selection landing last. */
  const requestRef = useRef(0);
  /** Bumped by every mutation to force the board to re-read. */
  const [revision, setRevision] = useState(0);

  // Reference data never changes, so it is fetched once.
  useEffect(() => {
    Promise.all([mockReservationApi.getVenues(), mockReservationApi.getReservationTypes(), mockReservationApi.getConditions()]).then(
      ([nextVenues, nextTypes, nextConditions]) => {
        setVenues(nextVenues);
        setReservationTypes(nextTypes);
        setConditions(nextConditions);
      }
    );
  }, []);

  const weekKey = weekDates.join(',');

  useEffect(() => {
    if (!organizationId) {
      // Clearing here is what stops one organization's board showing under another.
      setDays([]);
      setSlots([]);
      setTypes([]);
      setReservations([]);
      setIsFetching(false);
      return;
    }

    const requestId = ++requestRef.current;
    setIsFetching(true);

    mockReservationApi
      .getBoard(organizationId, weekKey.split(','), query)
      .then((response) => {
        if (requestId !== requestRef.current) return;
        setDays(response.days);
        setSlots(response.slots);
        setTypes(response.types);
        setReservations(response.reservations);
      })
      .finally(() => {
        if (requestId !== requestRef.current) return;
        setIsFetching(false);
      });
  }, [organizationId, weekKey, query, revision]);

  const runMutation = useCallback(async (id: string | null, action: () => Promise<unknown>) => {
    setIsMutating(true);
    setPendingReservationId(id);
    try {
      await action();
      // Re-read rather than patch — a change can move a row in or out of the
      // current slot/type/status selection, and it shifts every summary.
      setRevision((current) => current + 1);
    } finally {
      setIsMutating(false);
      setPendingReservationId(null);
    }
  }, []);

  const createReservation = useCallback(
    async (payload: ReservationPayload) => {
      if (!organizationId) throw new Error('No organization selected');
      await runMutation(null, () => mockReservationApi.createReservation(organizationId, payload));
    },
    [organizationId, runMutation]
  );

  const updateReservation = useCallback(
    async (id: string, payload: ReservationPayload) => {
      if (!organizationId) throw new Error('No organization selected');
      await runMutation(id, () => mockReservationApi.updateReservation(organizationId, id, payload));
    },
    [organizationId, runMutation]
  );

  const deleteReservation = useCallback(
    async (id: string) => {
      if (!organizationId) throw new Error('No organization selected');
      await runMutation(id, () => mockReservationApi.deleteReservation(organizationId, id));
    },
    [organizationId, runMutation]
  );

  const setStatus = useCallback(
    async (id: string, status: ReservationStatus) => {
      if (!organizationId) throw new Error('No organization selected');
      await runMutation(id, () => mockReservationApi.setStatus(organizationId, id, status));
    },
    [organizationId, runMutation]
  );

  return {
    days,
    slots,
    types,
    reservations,
    venues,
    reservationTypes,
    conditions,
    isFetching,
    isMutating,
    pendingReservationId,
    createReservation,
    updateReservation,
    deleteReservation,
    setStatus,
  };
};
