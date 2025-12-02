import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const rewardsApi = createApi({
  reducerPath: 'rewardsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reward', 'globalReward'],

  endpoints: (builder) => ({
    getRewards: builder.query({
      query: ({ search, page, status, date, limit, companyOrganizer, isGlobal = false }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        // if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        if (!isGlobal && companyOrganizer) params.companyOrganizer = companyOrganizer;
        return {
          // url: API_ROUTES.ADMIN_LOYALTY_REWARDS,
          url: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      // providesTags: ['reward'],
      providesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    addReward: builder.mutation({
      query: ({ isGlobal = false, ...newReward }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS(isGlobal),
        method: 'POST',
        body: newReward,
      }),
      // invalidatesTags: ['reward'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    updateReward: builder.mutation({
      query: ({ id, isGlobal = false, ...updatedReward }) => ({
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
        method: 'PUT',
        body: updatedReward,
      }),
      // invalidatesTags: ['reward'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),

    deleteReward: builder.mutation({
      query: ({ id, isGlobal = false }) => ({
        // url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id),
        url: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, isGlobal),
        method: 'DELETE',
      }),
      // invalidatesTags: ['reward'],
      invalidatesTags: (result, error, arg) => (arg.isGlobal ? ['globalReward'] : ['reward']),
    }),
  }),
});

export const { useGetRewardsQuery, useAddRewardMutation, useUpdateRewardMutation, useDeleteRewardMutation } = rewardsApi;
