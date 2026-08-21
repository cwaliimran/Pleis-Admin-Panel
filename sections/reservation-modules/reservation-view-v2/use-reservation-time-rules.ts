'use client';

import type { ApiOperatingHours } from '@/store/Reducer/organization';
import { useGetOrganizationByIdQuery } from '@/store/Reducer/organization';
import { useGetReservationPreferencesQuery } from '@/store/Reducer/reservation-preferences-api';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { AVERAGE_SLOT_DURATION_MINUTES, MINUTES_PER_DAY, WEEKDAY_KEYS, WEEKDAY_LABELS, formatDuration, fromMinutes, toMinutes } from './constants';

interface UseReservationTimeRulesArgs {
  organizationId?: string;
  date: string;
  enabled: boolean;
}

export interface ReservationTimeRules {
  slotsEnabled: boolean;
  isSettingKnown: boolean;
  isLoading: boolean;
  isReady: boolean;
  isOpenDay: boolean;
  hasWorkingHours: boolean;
  isWindowUsable: boolean;
  dayLabel: string;
  openTime: string;
  closeTime: string;
  earliestStartTime: string;
  latestStartTime: string;
  maxDurationMinutes: number;
  signature: string;
  isStartTimeAllowed: (value: string) => boolean;
  checkStartTime: (value: string) => string | null;
  checkEndTime: (startValue: string, endValue: string) => string | null;
}

export const useReservationTimeRules = ({ organizationId, date, enabled }: UseReservationTimeRulesArgs): ReservationTimeRules => {
  const skip = !enabled || !organizationId;

  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    isFetching: isFetchingPreferences,
    isSuccess: isPreferencesSuccess,
    isError: isPreferencesError,
  } = useGetReservationPreferencesQuery({ organization: organizationId as string }, { skip, refetchOnMountOrArgChange: true });

  const {
    data: organization,
    isLoading: isLoadingOrganization,
    isFetching: isFetchingOrganization,
    isSuccess: isOrganizationSuccess,
    isError: isOrganizationError,
  } = useGetOrganizationByIdQuery({ id: organizationId as string }, { skip, refetchOnMountOrArgChange: true });

  const operatingHours = organization?.data?.operatingHours as ApiOperatingHours | undefined;

  return useMemo<ReservationTimeRules>(() => {
    const isLoading = isLoadingPreferences || isFetchingPreferences || isLoadingOrganization || isFetchingOrganization;

    const isPreferencesSettled = !skip && !isFetchingPreferences && (isPreferencesSuccess || isPreferencesError);
    const isOrganizationSettled = !skip && !isFetchingOrganization && (isOrganizationSuccess || isOrganizationError);

    const timeSlotsSetting = preferences?.timeSlotsSetting;
    const slotsEnabled = isPreferencesSettled && timeSlotsSetting?.status === 'enabled';
    const isReady = isPreferencesSettled && isOrganizationSettled;

    const weekdayKey = date ? WEEKDAY_KEYS[parseISO(date).getDay()] : undefined;
    const day = weekdayKey ? operatingHours?.[weekdayKey] : undefined;
    const dayLabel = weekdayKey ? WEEKDAY_LABELS[weekdayKey] : 'this day';

    const hasWorkingHours = Boolean(day);
    const isOpenDay = hasWorkingHours ? day?.isOpen !== false : true;

    const openMinutes = toMinutes(day?.from);
    const rawCloseMinutes = toMinutes(day?.to);
    const closeMinutes =
      openMinutes === null || rawCloseMinutes === null ? null : rawCloseMinutes <= openMinutes ? rawCloseMinutes + MINUTES_PER_DAY : rawCloseMinutes;

    const opensAfterMinutes = timeSlotsSetting?.bookingOpensAfterMinutes ?? 0;
    const closesBeforeMinutes = timeSlotsSetting?.bookingClosesBeforeMinutes ?? 0;

    const earliestStartMinutes = openMinutes === null ? null : openMinutes + opensAfterMinutes;
    const latestStartMinutes = closeMinutes === null ? null : closeMinutes - closesBeforeMinutes;

    const hasWindow = earliestStartMinutes !== null && latestStartMinutes !== null;
    const isWindowUsable = hasWindow && (earliestStartMinutes as number) <= (latestStartMinutes as number);

    const averageSlotDuration = timeSlotsSetting?.averageSlotDurationInMinutes;
    const maxDurationMinutes = averageSlotDuration && averageSlotDuration > 0 ? averageSlotDuration : AVERAGE_SLOT_DURATION_MINUTES;

    const openTime = openMinutes === null ? '' : fromMinutes(openMinutes);
    const closeTime = closeMinutes === null ? '' : fromMinutes(closeMinutes);
    const earliestStartTime = earliestStartMinutes === null ? '' : fromMinutes(earliestStartMinutes);
    const latestStartTime = latestStartMinutes === null ? '' : fromMinutes(latestStartMinutes);

    const isStartMinutesAllowed = (minutes: number) => {
      if (!isWindowUsable) return true;
      return [minutes, minutes + MINUTES_PER_DAY].some(
        (candidate) => candidate >= (earliestStartMinutes as number) && candidate <= (latestStartMinutes as number)
      );
    };

    const isStartTimeAllowed = (value: string) => {
      const minutes = toMinutes(value);
      if (minutes === null) return false;
      if (!isReady || !isOpenDay) return false;
      return isStartMinutesAllowed(minutes);
    };

    const checkStartTime = (value: string): string | null => {
      if (!slotsEnabled) return null;
      if (!value) return 'Time is required';

      const minutes = toMinutes(value);
      if (minutes === null) return 'Use 24h time, e.g. 19:30';

      if (!isReady) return null;
      if (!isOpenDay) return `The organization is closed on ${dayLabel} — pick another date`;
      if (!hasWindow) return null;

      if (!isWindowUsable) {
        return `No booking window is available on ${dayLabel} — working hours are ${openTime} – ${closeTime}`;
      }

      if (!isStartMinutesAllowed(minutes)) {
        return `Time must be between ${earliestStartTime} and ${latestStartTime} on ${dayLabel} (working hours ${openTime} – ${closeTime})`;
      }

      return null;
    };

    const checkEndTime = (startValue: string, endValue: string): string | null => {
      if (!slotsEnabled) return null;
      if (!endValue) return 'End time is required';

      const endMinutes = toMinutes(endValue);
      if (endMinutes === null) return 'Use 24h time, e.g. 21:00';

      const startMinutes = toMinutes(startValue);
      if (startMinutes === null) return null;

      if (endMinutes === startMinutes) return 'End time must be after the start time';

      const durationMinutes = endMinutes > startMinutes ? endMinutes - startMinutes : endMinutes + MINUTES_PER_DAY - startMinutes;

      if (!isReady) return null;

      if (durationMinutes > maxDurationMinutes) {
        return `A reservation can last at most ${formatDuration(maxDurationMinutes)} — this one is ${formatDuration(durationMinutes)}`;
      }

      return null;
    };

    return {
      slotsEnabled,
      isSettingKnown: isPreferencesSettled,
      isLoading,
      isReady,
      isOpenDay,
      hasWorkingHours,
      isWindowUsable: Boolean(isWindowUsable),
      dayLabel,
      openTime,
      closeTime,
      earliestStartTime,
      latestStartTime,
      maxDurationMinutes,
      signature: [slotsEnabled, isReady, isOpenDay, earliestStartMinutes, latestStartMinutes, maxDurationMinutes, dayLabel].join('|'),
      isStartTimeAllowed,
      checkStartTime,
      checkEndTime,
    };
  }, [
    skip,
    date,
    preferences,
    operatingHours,
    isLoadingPreferences,
    isFetchingPreferences,
    isPreferencesSuccess,
    isPreferencesError,
    isLoadingOrganization,
    isFetchingOrganization,
    isOrganizationSuccess,
    isOrganizationError,
  ]);
};
