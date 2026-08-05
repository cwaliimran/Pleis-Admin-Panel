import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// In-app Ordering Settings — API slice
//
// The backend keeps ONE settings document per organization, so every
// sub-setting (payment methods, order acceptance, …) is read and written
// together. Sections still save independently: each merges its own slice
// into the loaded document and sends the whole thing back.
//
// Owns the wire format only. The view models and the mapping between the
// two live in `sections/app-ordering/app-ordering-settings-v2`.
// ============================================================

export interface ApiPaymentMethod {
  inAppPayment: boolean;
  payNow: boolean;
  cash: boolean;
}

export interface ApiOrderingSettings {
  _id: string;
  /** Owning company. Admin-side selection; the update expects it echoed back. */
  companyOrganizer?: string | null;
  organization: string;
  paymentMethod?: ApiPaymentMethod | null;
  automaticOrderAcceptance?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetOrderingSettingsArgs {
  organization: string;
}

/**
 * Sent whole on every save — the caller merges its section's values into
 * the loaded document first, so an untouched section keeps its value.
 */
export interface UpdateOrderingSettingsArgs {
  organization: string;
  companyOrganizer?: string;
  paymentMethod: ApiPaymentMethod;
  automaticOrderAcceptance: boolean;
}

export interface OrderingSettingsMutationResponse {
  message?: string;
  data?: ApiOrderingSettings;
}

export const orderingSettingsApi = createApi({
  reducerPath: 'orderingSettingsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['ordering-settings'],

  endpoints: (builder) => ({
    getOrderingSettings: builder.query<ApiOrderingSettings | null, GetOrderingSettingsArgs>({
      query: ({ organization }) => ({
        url: '',
        method: 'GET',
        params: { organization },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORDERING_SETTINGS,
          organizerRoute: API_ROUTES.ORGANIZER_ORDERING_SETTINGS,
        },
      }),
      // `null` for an organization that has never saved — callers fall back to defaults.
      transformResponse: (res: { data?: ApiOrderingSettings }): ApiOrderingSettings | null => res?.data ?? null,
      providesTags: ['ordering-settings'],
    }),

    updateOrderingSettings: builder.mutation<OrderingSettingsMutationResponse, UpdateOrderingSettingsArgs>({
      query: ({ organization, companyOrganizer, paymentMethod, automaticOrderAcceptance }) => {
        const body: Record<string, unknown> = { organization, paymentMethod, automaticOrderAcceptance };

        // Absent for organizers — the token already identifies the company.
        if (companyOrganizer) body.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'PUT',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDERING_SETTINGS,
            organizerRoute: API_ROUTES.ORGANIZER_ORDERING_SETTINGS,
          },
        };
      },
      invalidatesTags: ['ordering-settings'],
    }),
  }),
});

export const { useGetOrderingSettingsQuery, useUpdateOrderingSettingsMutation } = orderingSettingsApi;
