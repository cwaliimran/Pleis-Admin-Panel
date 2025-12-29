import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const giveawaysApi = createApi({
  reducerPath: 'giveawaysApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['giveaway'],

  endpoints: (builder) => ({
    getGiveaways: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_GIVEAWAYS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['giveaway'],
    }),

    addGiveaway: builder.mutation({
      query: (newGiveaway) => ({
        url: API_ROUTES.ADMIN_GIVEAWAYS,
        method: 'POST',
        body: newGiveaway,
      }),
      invalidatesTags: ['giveaway'],
    }),

    updateGiveaway: builder.mutation({
      query: ({ id, ...updatedGiveaway }) => ({
        url: API_ROUTES.ADMIN_GIVEAWAYS_BY_ID(id),
        method: 'PUT',
        body: updatedGiveaway,
      }),
      invalidatesTags: ['giveaway'],
    }),

    deleteGiveaway: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_GIVEAWAYS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['giveaway'],
    }),
  }),
});

export const { useGetGiveawaysQuery, useAddGiveawayMutation, useUpdateGiveawayMutation, useDeleteGiveawayMutation } = giveawaysApi;
