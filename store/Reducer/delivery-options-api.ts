import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Delivery Options — API slice
//
// Owns the wire format only. The view model and the mapping between the
// two live in `sections/app-ordering/app-ordering-settings-v2/delivery-options`.
// ============================================================

// ---------- Wire enums ----------

export type ApiDeliveryMethod = 'counterPickup' | 'tableDelivery' | 'toGo';

export type ApiDeliveryOptionStatus = 'active' | 'inactive';

// ---------- Wire shapes ----------

export interface ApiDeliveryOption {
  _id: string;
  organization: string;
  title: string;
  deliveryMethod: ApiDeliveryMethod;
  status: ApiDeliveryOptionStatus;
  /** Backend-generated public identifier — what a customer-facing QR link resolves to. */
  publicId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Create sends every field; update accepts any subset of them. */
export interface DeliveryOptionBody {
  title: string;
  deliveryMethod: ApiDeliveryMethod;
  status: ApiDeliveryOptionStatus;
}

// ---------- Endpoint args ----------

export interface GetDeliveryOptionsArgs {
  organizationId: string;
}

export interface CreateDeliveryOptionArgs {
  organizationId: string;
  body: DeliveryOptionBody;
}

export interface UpdateDeliveryOptionArgs {
  organizationId: string;
  id: string;
  body: Partial<DeliveryOptionBody>;
}

export interface DeleteDeliveryOptionArgs {
  organizationId: string;
  id: string;
}

/** Every write answers with the backend's own message; create/update also echo the record. */
export interface DeliveryOptionMutationResponse {
  message?: string;
  data?: ApiDeliveryOption;
}

export const deliveryOptionsApi = createApi({
  reducerPath: 'deliveryOptionsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['delivery-options'],

  endpoints: (builder) => ({
    getDeliveryOptions: builder.query<ApiDeliveryOption[], GetDeliveryOptionsArgs>({
      query: ({ organizationId }) => ({
        url: '',
        method: 'GET',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_DELIVERY_OPTIONS(organizationId),
          organizerRoute: API_ROUTES.ORGANIZER_DELIVERY_OPTIONS(organizationId),
        },
      }),
      // The list is unpaginated — the response carries no `meta`.
      transformResponse: (res: { data?: ApiDeliveryOption[] }): ApiDeliveryOption[] => res?.data ?? [],
      providesTags: ['delivery-options'],
    }),

    createDeliveryOption: builder.mutation<DeliveryOptionMutationResponse, CreateDeliveryOptionArgs>({
      query: ({ organizationId, body }) => ({
        url: '',
        method: 'POST',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_DELIVERY_OPTIONS(organizationId),
          organizerRoute: API_ROUTES.ORGANIZER_DELIVERY_OPTIONS(organizationId),
        },
      }),
      invalidatesTags: ['delivery-options'],
    }),

    updateDeliveryOption: builder.mutation<DeliveryOptionMutationResponse, UpdateDeliveryOptionArgs>({
      query: ({ organizationId, id, body }) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_DELIVERY_OPTION_BY_ID(organizationId, id),
          organizerRoute: API_ROUTES.ORGANIZER_DELIVERY_OPTION_BY_ID(organizationId, id),
        },
      }),
      invalidatesTags: ['delivery-options'],
    }),

    deleteDeliveryOption: builder.mutation<DeliveryOptionMutationResponse, DeleteDeliveryOptionArgs>({
      query: ({ organizationId, id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_DELIVERY_OPTION_BY_ID(organizationId, id),
          organizerRoute: API_ROUTES.ORGANIZER_DELIVERY_OPTION_BY_ID(organizationId, id),
        },
      }),
      invalidatesTags: ['delivery-options'],
    }),
  }),
});

export const {
  useGetDeliveryOptionsQuery,
  useCreateDeliveryOptionMutation,
  useUpdateDeliveryOptionMutation,
  useDeleteDeliveryOptionMutation,
} = deliveryOptionsApi;
