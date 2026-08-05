import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Reservation Occasions — API slice
//
// Occasions are create/delete only; there is no update endpoint. Owns the
// wire format only — the view model and the mapping between the two live in
// `sections/reservation-modules/reservation-preferences/occasions`.
// ============================================================

export type ApiOccasionStatus = 'active' | 'inactive';

export interface ApiOccasion {
  _id: string;
  companyOrganizer?: string | null;
  organization: string;
  name: string;
  status: ApiOccasionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetOccasionsArgs {
  organization: string;
}

export interface CreateOccasionArgs {
  organization: string;
  companyOrganizer?: string;
  name: string;
}

export interface DeleteOccasionArgs {
  id: string;
}

export interface OccasionMutationResponse {
  message?: string;
  data?: ApiOccasion;
}

export const occasionsApi = createApi({
  reducerPath: 'occasionsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['occasions'],

  endpoints: (builder) => ({
    getOccasions: builder.query<ApiOccasion[], GetOccasionsArgs>({
      query: ({ organization }) => ({
        url: '',
        method: 'GET',
        params: { organization },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_OCCASIONS,
          organizerRoute: API_ROUTES.ORGANIZER_OCCASIONS,
        },
      }),
      // The list is unpaginated — the response carries no `meta`.
      transformResponse: (res: { data?: ApiOccasion[] }): ApiOccasion[] => res?.data ?? [],
      providesTags: ['occasions'],
    }),

    createOccasion: builder.mutation<OccasionMutationResponse, CreateOccasionArgs>({
      query: ({ organization, companyOrganizer, name }) => {
        const body: Record<string, unknown> = { organization, name };

        // Absent for organizers — the token already identifies the company.
        if (companyOrganizer) body.companyOrganizer = companyOrganizer;

        return {
          url: '',
          method: 'POST',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_OCCASIONS,
            organizerRoute: API_ROUTES.ORGANIZER_OCCASIONS,
          },
        };
      },
      invalidatesTags: ['occasions'],
    }),

    deleteOccasion: builder.mutation<OccasionMutationResponse, DeleteOccasionArgs>({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_OCCASION_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_OCCASION_BY_ID(id),
        },
      }),
      invalidatesTags: ['occasions'],
    }),
  }),
});

export const { useGetOccasionsQuery, useCreateOccasionMutation, useDeleteOccasionMutation } = occasionsApi;
