import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const thirdPartyApi = createApi({
  reducerPath: 'thirdPartyApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['third-party'],

  endpoints: (builder) => ({
    getThirdParty: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_THIRD_PARTY,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['third-party'],
    }),

    addThirdParty: builder.mutation({
      query: (newThirdParty) => ({
        url: API_ROUTES.ADMIN_THIRD_PARTY,
        method: 'POST',
        body: newThirdParty,
      }),
      invalidatesTags: ['third-party'],
    }),

    updateThirdParty: builder.mutation({
      query: ({ id, ...updatedThirdParty }) => ({
        url: API_ROUTES.ADMIN_THIRD_PARTY_BY_ID(id),
        method: 'PUT',
        body: updatedThirdParty,
      }),
      invalidatesTags: ['third-party'],
    }),

    deleteThirdParty: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_THIRD_PARTY_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['third-party'],
    }),
  }),
});

export const { useGetThirdPartyQuery, useAddThirdPartyMutation, useUpdateThirdPartyMutation, useDeleteThirdPartyMutation } = thirdPartyApi;
