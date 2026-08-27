import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const tiersApi = createApi({
  reducerPath: 'tiersApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['tier'],

  endpoints: (builder) => ({
    getTiers: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.TIERS,
            organizerRoute: API_ROUTES.ORGANIZER_GENERAL_TIERS,
          },
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['tier'],
    }),

    addTier: builder.mutation({
      query: (newTier) => ({
        url: API_ROUTES.TIERS,
        method: 'POST',
        body: newTier,
      }),
      invalidatesTags: ['tier'],
    }),

    updateTier: builder.mutation({
      query: ({ id, ...updatedTier }) => ({
        url: API_ROUTES.TIERS_BY_ID(id),
        method: 'PUT',
        body: updatedTier,
      }),
      invalidatesTags: ['tier'],
    }),

    deleteTier: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.TIERS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['tier'],
    }),
  }),
});

export const { useGetTiersQuery, useAddTierMutation, useUpdateTierMutation, useDeleteTierMutation } = tiersApi;
