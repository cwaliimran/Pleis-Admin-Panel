import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// User Reservations — API slice
//
// Reservations staff create or edit on a guest's behalf, used by the
// Reservation Management (v2) form modal. Owns the wire format only; the
// form's own value shape and the mapping between the two live in
// `sections/reservation-modules/reservation-view-v2/modals`.
//
// Create and update take the same body apart from three fields:
// `organizationId` / `companyOrganizer` are sent on create only — on update
// the record already belongs to an organization and the ids in the path
// identify it — while `status` is sent on update only, since a new
// reservation opens on a status the backend assigns.
// ============================================================

export type ApiReservationCondition = 'free' | 'minimumSpend';

/** The full lifecycle a reservation moves through. */
export type ApiUserReservationStatus =
  | 'pendingPayment'
  | 'needsConfirmation'
  | 'confirmed'
  | 'checkedIn'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export const USER_RESERVATION_STATUSES: ApiUserReservationStatus[] = [
  'pendingPayment',
  'needsConfirmation',
  'confirmed',
  'checkedIn',
  'rejected',
  'cancelled',
  'completed',
];

/** A single start/end pair. Both are full ISO-8601 UTC strings. */
export interface ApiTimeSlot {
  startTime: string;
  endTime: string;
}

export interface ApiDateTimeSlot {
  /** ISO `yyyy-MM-dd`. */
  date: string;
  timeSlots: ApiTimeSlot[];
}

/**
 * The API models a reservation as many days each holding many slots. The form
 * only ever books one slot on one day, so this always carries a single entry —
 * the nesting is kept so the shape matches what the API returns.
 */
export interface ApiTimingSlots {
  dateTimeSlots: ApiDateTimeSlot[];
}

export interface ApiPhoneNumber {
  /** Dial code including the plus, e.g. "+385". */
  code: string;
  /** National number without the dial code. */
  number: string;
}

/** Every field both create and update send. */
export interface UserReservationBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: ApiPhoneNumber;
  /** Reservation type `_id`. */
  reservationType: string;
  /** Number of guests. */
  partySize: number;
  numberOfTables: number;
  timingSlots: ApiTimingSlots;
  /** Mirrors the chosen reservation type's own condition. */
  conditionType: ApiReservationCondition;
  /** Required when `conditionType` is `minimumSpend`, omitted otherwise. */
  amount?: number;
  /** Occasion `_id`. Omitted when the guest picked none. */
  occasion?: string;
  /** Backend spelling — plural, unlike the singular label in the UI. */
  notes?: string;
}

export interface CreateUserReservationArgs extends UserReservationBody {
  organizationId: string;
  companyOrganizer?: string;
}

export interface UpdateUserReservationArgs extends UserReservationBody {
  /** The reservation `_id` — addressed in the path, not the body. */
  id: string;
  /**
   * Update only. A new reservation has no status to choose — the backend
   * assigns the opening one — so create leaves the field off entirely.
   */
  status: ApiUserReservationStatus;
}

export interface UserReservationMutationResponse {
  message?: string;
  data?: unknown;
}

/** Status-only transition. Both ids travel in the path; there is no body. */
export interface UpdateUserReservationStatusArgs {
  id: string;
  status: ApiUserReservationStatus;
}

// ============================================================
// Calendar (board) read
//
// One entry per day that has reservations — a day with none is simply absent
// from `data`, it is not returned as an empty record.
//
// Note the inner naming: a day's `timeSlots` is the list of reservations, and
// each reservation carries its own `timeSlots` holding the actual start/end
// pairs. Both are kept verbatim and renamed once, in the view hook.
// ============================================================

export interface ApiCalendarTimeSlot {
  /** ISO-8601 with the venue's offset, e.g. `2026-08-10T20:00:00.000+05:00`. */
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface ApiCalendarReservation {
  reservationId: string;
  bookingId: string;
  firstName: string;
  lastName: string;
  partySize: number;
  status: string;
  timeSlots: ApiCalendarTimeSlot[];
}

export interface ApiCalendarDay {
  /** ISO `yyyy-MM-dd`. */
  date: string;
  totalReservations: number;
  /** The day's reservations, despite the name. */
  timeSlots: ApiCalendarReservation[];
}

export interface ApiCalendarMeta {
  /** Seats available per slot across the organization. */
  totalMaxCapacity?: number;
}

export interface GetReservationCalendarArgs {
  organization: string;
  /** ISO `yyyy-MM-dd`. */
  date: string;
}

export interface GetReservationCalendarResponse {
  data: ApiCalendarDay[];
  meta: ApiCalendarMeta | null;
}

// ============================================================
// Reservation list read
//
// Feeds both the reservation table (`data`) and the reservation-type
// occupancy cards (`meta.reservationTypeCapacityStats`). The stats always
// cover every type, regardless of the `reservationType` filter.
// ============================================================

export interface ApiReservationTypeCapacityStat {
  _id: string;
  reservationTypeName: string;
  bookedCapacity: number;
  maxCapacity: number;
}

export interface ApiReservationOccasion {
  _id: string;
  name: string;
}

export interface ApiReservationOrganization {
  _id: string;
  basicInfo?: { name?: string };
}

export interface ApiReservationDateTimeSlot {
  date: string;
  timeSlots?: ApiCalendarTimeSlot[];
  _id?: string;
}

export interface ApiReservationTypeRef {
  _id: string;
  name?: string;
}

export interface ApiReservationListItem {
  _id: string;
  /** `null` for reservations staff entered by phone or walk-in. */
  userId: string | null;
  /** Populated to `{ _id, name }`; older records may still carry a bare id. */
  reservationType: ApiReservationTypeRef | string;
  partySize: number;
  numberOfTables: number;
  occasion?: ApiReservationOccasion | null;
  amount?: number;
  organizationId?: ApiReservationOrganization | null;
  timingSlots?: { dateTimeSlots?: ApiReservationDateTimeSlot[] };
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: { code?: string; number?: string } | null;
  notes?: string;
  status: ApiUserReservationStatus;
  bookingId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiReservationListMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  reservationTypeCapacityStats?: ApiReservationTypeCapacityStat[];
}

export interface GetReservationsV2Args {
  /** Backend spelling — plural `organizations`, singular id. */
  organizationsId: string;
  /** ISO `yyyy-MM-dd`. */
  date: string;
  /** 0-based; the offset is re-added below so the API receives a 1-based page. */
  page: number;
  limit: number;
  /** 24h `HH:mm`. Sent only when a time slot is selected on the board. */
  startTime?: string;
  /** Reservation type `_id`. Sent only when a type is selected on the board. */
  reservationType?: string;
  status?: ApiUserReservationStatus;
}

export interface GetReservationsV2Response {
  data: ApiReservationListItem[];
  meta: ApiReservationListMeta | null;
}

export const userReservationsApi = createApi({
  reducerPath: 'userReservationsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['user-reservations'],

  endpoints: (builder) => ({
    getReservationCalendar: builder.query<GetReservationCalendarResponse, GetReservationCalendarArgs>({
      query: ({ organization, date }) => ({
        url: '',
        method: 'GET',
        params: { organization, date },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_CALENDAR_V2,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_CALENDAR_V2,
        },
      }),
      transformResponse: (res: { data?: ApiCalendarDay[]; meta?: ApiCalendarMeta }): GetReservationCalendarResponse => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['user-reservations'],
    }),

    getReservationsV2: builder.query<GetReservationsV2Response, GetReservationsV2Args>({
      query: ({ organizationsId, date, page, limit, startTime, reservationType, status }) => {
        const params: Record<string, string | number> = {
          organizationsId,
          date,
          page: page + 1,
          limit,
        };

        // Each is left off entirely when the board has no such selection.
        if (startTime) params.startTime = startTime;
        if (reservationType) params.reservationType = reservationType;
        if (status) params.status = status;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_LIST_V2,
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_LIST_V2,
          },
        };
      },
      transformResponse: (res: { data?: ApiReservationListItem[]; meta?: ApiReservationListMeta }): GetReservationsV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['user-reservations'],
    }),

    createUserReservation: builder.mutation<UserReservationMutationResponse, CreateUserReservationArgs>({
      query: ({ organizationId, companyOrganizer, ...fields }) => {
        const body: Record<string, unknown> = { organizationId, ...fields };

        // Absent for organizers — the token already identifies the company.
        if (companyOrganizer) body.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'POST',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_CREATE_USER_RESERVATION,
            organizerRoute: API_ROUTES.ORGANIZER_CREATE_USER_RESERVATION,
          },
        };
      },
      invalidatesTags: ['user-reservations'],
    }),

    updateUserReservationStatus: builder.mutation<UserReservationMutationResponse, UpdateUserReservationStatusArgs>({
      query: ({ id, status }) => ({
        url: '',
        method: 'PUT',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATE_RESERVATION_STATUS(id, status),
          organizerRoute: API_ROUTES.ORGANIZER_UPDATE_RESERVATION_STATUS(id, status),
        },
      }),
      invalidatesTags: ['user-reservations'],
    }),

    updateUserReservationV2: builder.mutation<UserReservationMutationResponse, UpdateUserReservationArgs>({
      // The whole record goes over on every save — the modal always submits a
      // complete form, so there is no partial-update case to preserve.
      query: ({ id, ...fields }) => ({
        url: '',
        method: 'PUT',
        body: { ...fields },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_UPDATE_USER_RESERVATION_V2(id),
          organizerRoute: API_ROUTES.ORGANIZER_UPDATE_USER_RESERVATION_V2(id),
        },
      }),
      invalidatesTags: ['user-reservations'],
    }),
  }),
});

export const {
  useGetReservationCalendarQuery,
  useGetReservationsV2Query,
  useCreateUserReservationMutation,
  useUpdateUserReservationStatusMutation,
  useUpdateUserReservationV2Mutation,
} = userReservationsApi;
