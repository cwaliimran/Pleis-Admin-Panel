'use client';

import type { ApiReservationListItem, ApiReservationTypeCapacityStat } from '@/store/Reducer/user-reservations-api';
import { useGetReservationsV2Query } from '@/store/Reducer/user-reservations-api';
import { useMemo } from 'react';
import { DEFAULT_PAGE_LIMIT, fromIsoDate, fromIsoTime } from './constants';
import { ListFilters, PaymentState, Reservation, ReservationPagination, TypeOccupancy } from './types';

interface UseReservationListArgs {
  organizationId?: string;
  date?: string;
  slot: string | null;
  typeId: string | null;
  filters: ListFilters;
  page: number;
  limit?: number;
}

interface UseReservationListReturn {
  reservations: Reservation[];
  types: TypeOccupancy[];
  pagination: ReservationPagination;
  /** New reservations within the other filters, shown beside the New filter. */
  newCount: number;
  isLoading: boolean;
  isFetching: boolean;
}

/** Payment is derived from condition, status and capture (prototype v3.2), never stored. */
const derivePayment = (item: ApiReservationListItem): PaymentState => {
  if (!((item.amount ?? 0) > 0)) return 'free';

  const paymentStatus = item.paymentDetails?.paymentStatus;
  const wasPaid = paymentStatus === 'paid' || paymentStatus === 'refunded';

  if (item.status === 'pendingPayment') return 'awaiting';
  if (item.status === 'noShow') return wasPaid || item.voucher?.status === 'forfeited' ? 'forfeited' : 'none';
  if (item.status === 'cancelled') return wasPaid ? 'refunded' : 'none';
  if (paymentStatus === 'paid') return 'paid';
  return 'none';
};

const toReservation = (item: ApiReservationListItem): Reservation => {
  const dateSlot = item.timingSlots?.dateTimeSlots?.[0];
  const timeSlot = dateSlot?.timeSlots?.[0];

  const firstName = item.firstName ?? '';
  const lastName = item.lastName ?? '';

  const reservationType = item.reservationType;
  const isTypeRef = typeof reservationType === 'object' && reservationType !== null;

  return {
    id: item._id,
    userId: item.userId ?? undefined,
    guestName: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    email: item.email ?? undefined,
    phoneCode: item.phoneNumber?.code ?? undefined,
    phoneNumber: item.phoneNumber?.number ?? undefined,
    sourceLabel: item.bookingId ?? undefined,
    venueId: item.organizationId?._id ?? '',
    venueName: item.organizationId?.basicInfo?.name ?? '',
    reservationTypeId: (isTypeRef ? reservationType._id : reservationType) ?? '',
    reservationTypeName: isTypeRef ? reservationType.name : undefined,
    seats: item.partySize ?? 0,
    quantity: item.numberOfTables ?? 1,
    date: fromIsoDate(dateSlot?.date),
    time: fromIsoTime(timeSlot?.startTime),
    endTime: fromIsoTime(timeSlot?.endTime),
    conditionId: '',
    occasion: item.occasion?.name ?? '',
    occasionId: item.occasion?._id ?? undefined,
    amount: item.amount,
    note: item.notes ?? '',
    status: item.status,
    payment: derivePayment(item),
    canMarkNoShow: item.canMarkNoShow,
    noShowAvailableTime: fromIsoTime(item.noShowAvailableAt ?? undefined) || undefined,
    noShowGraceMinutes: item.noShowGraceMinutes,
  };
};

const toTypeOccupancy = (stat: ApiReservationTypeCapacityStat): TypeOccupancy => ({
  typeId: stat._id,
  name: stat.reservationTypeName,
  bookedSeats: stat.bookedCapacity ?? 0,
  totalSeats: stat.maxCapacity ?? 0,
  ageRestricted: !!stat.ageRestricted,
});

export const useReservationList = ({
  organizationId,
  date,
  slot,
  typeId,
  filters,
  page,
  limit = DEFAULT_PAGE_LIMIT,
}: UseReservationListArgs): UseReservationListReturn => {
  const { data, isLoading, isFetching } = useGetReservationsV2Query(
    {
      organizationsId: organizationId as string,
      date: date || undefined,
      page: page - 1,
      limit,
      startTime: slot || undefined,
      reservationType: typeId || undefined,
      statuses: filters.statuses,
      isNew: filters.isNew,
    },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  const reservations = useMemo(() => (data?.data ?? []).map(toReservation), [data]);

  const types = useMemo(() => (data?.meta?.reservationTypeCapacityStats ?? []).map(toTypeOccupancy), [data]);

  const pagination = useMemo<ReservationPagination>(
    () => ({
      page: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? 0,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit]
  );

  return { reservations, types, pagination, newCount: data?.meta?.newCount ?? 0, isLoading, isFetching };
};
