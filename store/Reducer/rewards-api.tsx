import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const rewardsApi = createApi({
  reducerPath: 'rewardsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reward'],

  endpoints: (builder) => ({
    getRewards: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_LOYALTY_REWARDS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['reward'],
    }),

    addReward: builder.mutation({
      query: (newReward) => ({
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS,
        method: 'POST',
        body: newReward,
      }),
      invalidatesTags: ['reward'],
    }),

    updateReward: builder.mutation({
      query: ({ id, ...updatedReward }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id),
        method: 'PUT',
        body: updatedReward,
      }),
      invalidatesTags: ['reward'],
    }),

    deleteReward: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['reward'],
    }),
  }),
});

export const { useGetRewardsQuery, useAddRewardMutation, useUpdateRewardMutation, useDeleteRewardMutation } = rewardsApi;
