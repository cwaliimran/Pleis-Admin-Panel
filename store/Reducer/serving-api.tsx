import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const servingApi = createApi({
  reducerPath: 'servingApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['serving'],

  endpoints: (builder) => ({
    getServings: builder.query({
      query: ({ search, page, status, date, limit, summary, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (summary) params.summary = summary;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_PRESET_MENU_SERVING,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['serving'],
    }),

    getServingCode: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_SERVING_CODE,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['serving'],
    }),

    addServing: builder.mutation({
      query: (newServing) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_SERVING,
        method: 'POST',
        body: newServing,
      }),
      invalidatesTags: ['serving'],
    }),

    updateServing: builder.mutation({
      query: ({ id, ...updatedServing }) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_SERVING_BY_ID(id),
        method: 'PUT',
        body: updatedServing,
      }),
      invalidatesTags: ['serving'],
    }),

    deleteServing: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_SERVING_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['serving'],
    }),
  }),
});

export const { useGetServingsQuery, useGetServingCodeQuery, useAddServingMutation, useUpdateServingMutation, useDeleteServingMutation } =
  servingApi;
