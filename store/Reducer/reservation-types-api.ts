import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Reservation Types — API slice
//
// Owns the wire format only. The view model and the mapping between the
// two live in `sections/reservation-modules/reservation-preferences/reservation-types`.
//
// Note the backend's own spellings: `bonosPoints`, `numberOfTables`,
// `isVisibleToGuest`, `occasionRequired`. They are kept verbatim here and
// renamed once, in the mappers.
// ============================================================

export type ApiConditionType = 'free' | 'minimumSpend';

/** `deleted` is a filter value only — the UI never writes it. */
export type ApiReservationTypeStatus = 'active' | 'inactive' | 'deleted';

export interface ApiReservationType {
  _id: string;
  companyOrganizer?: string | null;
  organization: string;
  name: string;
  description?: string;
  /** Tax percentage, not an amount. */
  tax?: number;
  /** Number of tables/booths of this type. */
  numberOfTables?: number;
  maxCapacity?: number;
  maxPartySize?: number;
  conditionType?: ApiConditionType;
  /** Amount the guest must spend. Only sent/returned for `minimumSpend` types. */
  minimumSpend?: number;
  /** Backend spelling of "bonus points". */
  bonosPoints?: number;
  isVisibleToGuest?: boolean;
  /** Plain strings on the wire; the view model wraps them with local ids. */
  notes?: string[];
  requireConfirmationToApprove?: boolean;
  occasionRequired?: boolean;
  status?: ApiReservationTypeStatus;
  createdAt?: string;
  updatedAt?: string;

  // ---- summary mode only (`?summary=true`) ----
  // The backend returns a trimmed record carrying live availability instead of
  // the full configuration. Both are optional here because the paginated list
  // never includes them.

  /** Tables of this type still free to book. */
  availableTables?: number;
  /** Seats of this type still free to book. */
  availableCapacity?: number;
}

export interface ApiReservationTypesMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  /** Seats across the organization's types — computed by the backend. */
  totalMaxCapacity?: number;
}

export interface GetReservationTypesResponse {
  data: ApiReservationType[];
  meta: ApiReservationTypesMeta | null;
}

export interface GetReservationTypesArgs {
  organization: string;
  /** 0-based; the offset is re-added below so the API receives a 1-based page.
   *  Omitted in summary mode, which is unpaginated. */
  page?: number;
  limit?: number;
  status?: ApiReservationTypeStatus;
  conditionType?: ApiConditionType;
  /**
   * Returns every type for the organization as a trimmed record carrying live
   * `availableTables` / `availableCapacity`. Used by the reservation form to
   * bound party size, table count, and seats.
   */
  summary?: boolean;
}

/** Every writable field. Create sends them all; update sends them all too. */
export interface ReservationTypeBody {
  name: string;
  description: string;
  numberOfTables: number;
  maxPartySize: number;
  maxCapacity: number;
  tax: number;
  conditionType: ApiConditionType;
  /** Required when `conditionType` is `minimumSpend`; omitted entirely for `free`. */
  minimumSpend?: number;
  bonosPoints: number;
  requireConfirmationToApprove: boolean;
  occasionRequired: boolean;
  isVisibleToGuest: boolean;
  status: Exclude<ApiReservationTypeStatus, 'deleted'>;
  notes: string[];
}

export interface CreateReservationTypeArgs extends ReservationTypeBody {
  organization: string;
  companyOrganizer?: string;
}

export interface UpdateReservationTypeArgs extends ReservationTypeBody {
  id: string;
}

export interface DeleteReservationTypeArgs {
  id: string;
}

export interface ReservationTypeMutationResponse {
  message?: string;
  data?: ApiReservationType;
}

export const reservationTypesApi = createApi({
  reducerPath: 'reservationTypesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['reservation-types'],

  endpoints: (builder) => ({
    getReservationTypes: builder.query<GetReservationTypesResponse, GetReservationTypesArgs>({
      query: ({ organization, page, limit, status, conditionType, summary }) => {
        const params: Record<string, string | number | boolean> = { organization };

        if (summary) {
          // Summary mode is unpaginated — sending page/limit would truncate it.
          params.summary = true;
        } else {
          if (page !== undefined) params.page = page + 1;
          if (limit !== undefined) params.limit = limit;
        }

        // Left off entirely when the filter is "all".
        if (status) params.status = status;
        if (conditionType) params.conditionType = conditionType;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_TYPES,
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_TYPES,
          },
        };
      },
      transformResponse: (res: { data?: ApiReservationType[]; meta?: ApiReservationTypesMeta }): GetReservationTypesResponse => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['reservation-types'],
    }),

    createReservationType: builder.mutation<ReservationTypeMutationResponse, CreateReservationTypeArgs>({
      query: ({ organization, companyOrganizer, ...fields }) => {
        const body: Record<string, unknown> = { organization, ...fields };

        // Absent for organizers — the token already identifies the company.
        if (companyOrganizer) body.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'POST',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_TYPES,
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_TYPES,
          },
        };
      },
      invalidatesTags: ['reservation-types'],
    }),

    updateReservationType: builder.mutation<ReservationTypeMutationResponse, UpdateReservationTypeArgs>({
      // The whole record goes over on every save — the modal always submits a
      // complete form, so there is no partial-update case to preserve.
      // `organization` is not resent; the id already identifies the record.
      query: ({ id, ...fields }) => ({
        url: '',
        method: 'PUT',
        body: { ...fields },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_TYPE_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_TYPE_BY_ID(id),
        },
      }),
      invalidatesTags: ['reservation-types'],
    }),

    deleteReservationType: builder.mutation<ReservationTypeMutationResponse, DeleteReservationTypeArgs>({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_TYPE_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_TYPE_BY_ID(id),
        },
      }),
      invalidatesTags: ['reservation-types'],
    }),
  }),
});

export const {
  useGetReservationTypesQuery,
  useCreateReservationTypeMutation,
  useUpdateReservationTypeMutation,
  useDeleteReservationTypeMutation,
} = reservationTypesApi;
