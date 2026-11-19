'use client';

import { useGetReservationsV2Query } from '@/store/Reducer/user-reservations-api';
import { useMemo } from 'react';
import { toSlotKey } from './constants';
import { toReservation } from './use-reservation-list';

/** Backend page cap (parsePaginationParams). Enough for the action dots. */
const NEED_CONFIRMATION_LIMIT = 100;

export interface NeedConfirmationItem {
  /** `yyyy-MM-dd` */
  date: string;
  /** Hourly slot key (`HH:00`) the request starts in, as on the time-slot board */
  slot: string;
  reservationTypeId: string;
}

/**
 * Reservations waiting in Need confirmation across all dates (prototype v3.2
 * "action dot"). Feeds the dots on the week days, the time slots, "Pick a
 * date" (requests outside the shown week) and the days of the date picker.
 * Refetched with the list whenever a reservation changes (shared tag).
 */
export const useNeedsConfirmation = (organizationId?: string) => {
  const { data } = useGetReservationsV2Query(
    {
      organizationsId: organizationId as string,
      page: 0,
      limit: NEED_CONFIRMATION_LIMIT,
      statuses: ['needsConfirmation'],
    },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  return useMemo<NeedConfirmationItem[]>(
    () =>
      (data?.data ?? [])
        .map(toReservation)
        .filter((reservation) => reservation.status === 'needsConfirmation' && reservation.date)
        .map((reservation) => ({
          date: reservation.date,
          slot: reservation.time ? toSlotKey(reservation.time) : '',
          reservationTypeId: reservation.reservationTypeId,
        })),
    [data]
  );
};
