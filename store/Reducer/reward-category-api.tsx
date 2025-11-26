import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const rewardCategoryApi = createApi({
  reducerPath: 'rewardCategoryApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['reward-category'],

  endpoints: (builder) => ({
    getRewardCategory: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_GLOBAL_REWARD_CATEGORIES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['reward-category'],
    }),

    addRewardCategory: builder.mutation({
      query: (newRewardCategory) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REWARD_CATEGORIES,
        method: 'POST',
        body: newRewardCategory,
      }),
      invalidatesTags: ['reward-category'],
    }),

    updateRewardCategory: builder.mutation({
      query: ({ id, ...updatedRewardCategory }) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REWARD_CATEGORIES_BY_ID(id),
        method: 'PUT',
        body: updatedRewardCategory,
      }),
      invalidatesTags: ['reward-category'],
    }),

    deleteRewardCategory: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_GLOBAL_REWARD_CATEGORIES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['reward-category'],
    }),
  }),
});

export const { useGetRewardCategoryQuery, useAddRewardCategoryMutation, useUpdateRewardCategoryMutation, useDeleteRewardCategoryMutation } =
  rewardCategoryApi;
