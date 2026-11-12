import type { ApiReservationCondition, ApiUserReservationStatus } from '@/store/Reducer/user-reservations-api';

export type UserType = 'organizer' | 'super-admin';

export type ReservationStatus = ApiUserReservationStatus;

export type ListFilter = 'all' | ReservationStatus;

/** Derived, never stored on the reservation (prototype v3.2 "Minimum spend payment and voucher"). */
export type PaymentState = 'free' | 'awaiting' | 'paid' | 'refunded' | 'forfeited' | 'none';

export type CapacityLevel = 'empty' | 'low' | 'medium' | 'high';

export interface DaySummary {
  date: string;
  reservationCount: number;
}

export interface SlotSummary {
  time: string;
  bookedSeats: number;
  capacity: number;
}

export interface TypeOccupancy {
  typeId: string;
  name: string;
  bookedSeats: number;
  totalSeats: number;
  ageRestricted?: boolean;
}

export interface GuestProfile {
  fullName: string;
  email: string;
  phoneNumber?: string;
  accountStatus?: string;
  loyaltyTier?: string;
  reservationsMade?: number;
  reservationsUsed?: number;
}

export interface Reservation {
  id: string;
  userId?: string;
  guestName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneCode?: string;
  pleisId?: string;
  sourceLabel?: string;
  phoneNumber?: string;
  venueId: string;
  venueName: string;
  reservationTypeId: string;
  reservationTypeName?: string;
  seats: number;
  quantity: number;
  date: string;
  time: string;
  endTime: string;
  conditionId: string;
  occasion: string;
  occasionId?: string;
  conditionType?: ApiReservationCondition;
  amount?: number;
  note: string;
  status: ReservationStatus;
  payment: PaymentState;
  /** Confirmed only (#93): "Mark as no-show" is allowed from slot start + grace period. */
  canMarkNoShow?: boolean;
  noShowAvailableTime?: string;
  noShowGraceMinutes?: number;
  eventName?: string;
  guestProfile?: GuestProfile;
}

export interface ReservationPagination {
  page: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
