import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Reservation Preferences — API slice
//
// One document per organization, holding the page-level settings only;
// reservation types and occasions have their own endpoints.
//
// The PUT is an upsert keyed by organization id in the path, so the same
// call saves an existing document and creates a missing one. `organization`
// is therefore not repeated in the body.
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/reservation-modules/reservation-preferences`.
// ============================================================

/** The backend spells its sub-setting toggles as a status string, not a boolean. */
export type ApiPreferenceStatus = 'enabled' | 'disabled';

export interface ApiTimeSlotsSetting {
  status?: ApiPreferenceStatus;
  /** Offset from opening time before the first slot starts. */
  bookingOpensAfterMinutes?: number;
  /** Offset before closing time after which no slot starts. */
  bookingClosesBeforeMinutes?: number;
  averageSlotDurationInMinutes?: number;
}

export interface ApiAutomaticResponse {
  autoAccept?: boolean;
  autoReject?: boolean;
  maxGuestPerReservationForAutoAccept?: number;
}

export interface ApiCancellationPolicy {
  status?: ApiPreferenceStatus;
  hoursBeforeReservation?: number;
}

export interface ApiReservationPreferences {
  /** Absent when the organization has never been saved — the GET returns `{}`. */
  _id?: string;
  companyOrganizer?: string | null;
  organization?: string;
  isReservationEnabled?: boolean;
  timeSlotsSetting?: ApiTimeSlotsSetting | null;
  automaticResponse?: ApiAutomaticResponse | null;
  cancellationPolicy?: ApiCancellationPolicy | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetReservationPreferencesArgs {
  organization: string;
}

/** Sent whole on every save — the page has a single "Save settings" button. */
export interface UpdateReservationPreferencesArgs {
  /** Goes in the path, not the body: it is what the upsert keys on. */
  organization: string;
  companyOrganizer?: string;
  isReservationEnabled: boolean;
  timeSlotsSetting: Required<ApiTimeSlotsSetting>;
  automaticResponse: Required<ApiAutomaticResponse>;
  cancellationPolicy: Required<ApiCancellationPolicy>;
}

export interface ReservationPreferencesMutationResponse {
  message?: string;
  data?: ApiReservationPreferences;
}

export const reservationPreferencesApi = createApi({
  reducerPath: 'reservationPreferencesApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['reservation-preferences'],

  endpoints: (builder) => ({
    getReservationPreferences: builder.query<ApiReservationPreferences | null, GetReservationPreferencesArgs>({
      query: ({ organization }) => ({
        url: '',
        method: 'GET',
        params: { organization },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_RESERVATION_PREFERENCES,
          organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_PREFERENCES,
        },
      }),
      // `null` for an organization that has never saved — callers fall back to defaults.
      transformResponse: (res: { data?: ApiReservationPreferences }): ApiReservationPreferences | null => res?.data ?? null,
      providesTags: ['reservation-preferences'],
    }),

    updateReservationPreferences: builder.mutation<ReservationPreferencesMutationResponse, UpdateReservationPreferencesArgs>({
      query: ({ organization, companyOrganizer, ...settings }) => {
        const body: Record<string, unknown> = { ...settings };

        // Absent for organizers — the token already identifies the company.
        if (companyOrganizer) body.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'PUT',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_RESERVATION_PREFERENCES_BY_ORGANIZATION(organization),
            organizerRoute: API_ROUTES.ORGANIZER_RESERVATION_PREFERENCES_BY_ORGANIZATION(organization),
          },
        };
      },
      invalidatesTags: ['reservation-preferences'],
    }),
  }),
});

export const { useGetReservationPreferencesQuery, useUpdateReservationPreferencesMutation } = reservationPreferencesApi;
