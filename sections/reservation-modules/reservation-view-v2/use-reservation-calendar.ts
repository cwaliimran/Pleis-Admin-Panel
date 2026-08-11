'use client';

import type { ApiCalendarDay } from '@/store/Reducer/user-reservations-api';
import { useGetReservationCalendarQuery } from '@/store/Reducer/user-reservations-api';
import { useMemo } from 'react';
import { TIME_SLOTS, fromIsoTime, toSlotKey } from './constants';
import { DaySummary, SlotSummary } from './types';

interface UseReservationCalendarArgs {
  organizationId?: string;
  date: string;
  weekDates: string[];
}

interface UseReservationCalendarReturn {
  days: DaySummary[];
  slots: SlotSummary[];
  totalReservations: number;
  hasDataForDate: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

export const useReservationCalendar = ({ organizationId, date, weekDates }: UseReservationCalendarArgs): UseReservationCalendarReturn => {
  const { data, isLoading, isFetching } = useGetReservationCalendarQuery(
    { organization: organizationId as string, date },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const daysByDate = useMemo(() => {
    const map = new Map<string, ApiCalendarDay>();
    (data?.data ?? []).forEach((entry) => map.set(entry.date, entry));
    return map;
  }, [data]);

  const days = useMemo<DaySummary[]>(
    () => weekDates.map((weekDate) => ({ date: weekDate, reservationCount: daysByDate.get(weekDate)?.totalReservations ?? 0 })),
    [weekDates, daysByDate]
  );

  const selectedDay = daysByDate.get(date);
  const capacity = data?.meta?.totalMaxCapacity ?? 0;

  const slots = useMemo<SlotSummary[]>(() => {
    const bookedBySlot = new Map<string, number>();

    (selectedDay?.timeSlots ?? []).forEach((reservation) => {
      (reservation.timeSlots ?? []).forEach((slot) => {
        const time = fromIsoTime(slot.startTime);
        if (!time) return;

        const key = toSlotKey(time);
        bookedBySlot.set(key, (bookedBySlot.get(key) ?? 0) + (reservation.partySize || 0));
      });
    });

    return TIME_SLOTS.map((time) => ({ time, bookedSeats: bookedBySlot.get(time) ?? 0, capacity }));
  }, [selectedDay, capacity]);

  return {
    days,
    slots,
    totalReservations: selectedDay?.totalReservations ?? 0,
    hasDataForDate: Boolean(selectedDay),
    isLoading,
    isFetching,
  };
};
