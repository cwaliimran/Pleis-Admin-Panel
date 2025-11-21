import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const statusApi = createApi({
  reducerPath: 'statusApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['status'],

  endpoints: (builder) => ({
    getStatus: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.STATUS_BADGE,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['status'],
    }),

    addStatus: builder.mutation({
      query: (newStatus) => ({
        url: API_ROUTES.STATUS_BADGE,
        method: 'POST',
        body: newStatus,
      }),
      invalidatesTags: ['status'],
    }),

    reOrderStatus: builder.mutation({
      query: (data) => ({
        url: API_ROUTES.STATUS_BADGE_REORDER,
        method: 'POST',
        body: data,
      }),
      // invalidatesTags: ['status'],
    }),

    updateStatus: builder.mutation({
      query: ({ id, ...updatedStatus }) => ({
        url: API_ROUTES.STATUS_BADGE_BY_ID(id),
        method: 'PUT',
        body: updatedStatus,
      }),
      invalidatesTags: ['status'],
    }),

    deleteStatus: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.STATUS_BADGE_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['status'],
    }),
  }),
});

export const { useGetStatusQuery, useAddStatusMutation, useReOrderStatusMutation, useUpdateStatusMutation, useDeleteStatusMutation } = statusApi;
