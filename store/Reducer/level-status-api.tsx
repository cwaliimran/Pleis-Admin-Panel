import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const levelStatusApi = createApi({
  reducerPath: 'levelStatusApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['level-statu'],

  endpoints: (builder) => ({
    getLevelStatus: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['level-statu'],
    }),

    addLevelStatus: builder.mutation({
      query: (newLevelStatu) => ({
        url: API_ROUTES.ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL,
        method: 'POST',
        body: newLevelStatu,
      }),
      invalidatesTags: ['level-statu'],
    }),

    updateLevelStatus: builder.mutation({
      query: ({ id, ...updatedLevelStatu }) => ({
        url: API_ROUTES.ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL_BY_ID(id),
        method: 'PUT',
        body: updatedLevelStatu,
      }),
      invalidatesTags: ['level-statu'],
    }),

    deleteLevelStatus: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_GLOBAL_LOYALTY_STATUS_LEVEL_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['level-statu'],
    }),
  }),
});

export const { useGetLevelStatusQuery, useAddLevelStatusMutation, useUpdateLevelStatusMutation, useDeleteLevelStatusMutation } = levelStatusApi;
