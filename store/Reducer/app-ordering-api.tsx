import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const appOrderingApi = createApi({
  reducerPath: 'appOrderingApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['app-ordering'],

  endpoints: (builder) => ({
    getAppOrdering: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_GET,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['app-ordering'],
    }),

    updateAppOrdering: builder.mutation({
      query: ({ id, ...updatedAppOrdering }) => ({
        url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE(id),
        method: 'PUT',
        body: updatedAppOrdering,
      }),
      invalidatesTags: ['app-ordering'],
    }),

    getAppOrderingStatus: builder.query({
      query: ({ companyOrganizer }) => {
        const params: any = {};
        if (companyOrganizer) (params as any).companyOrganizer = companyOrganizer;
        return {
          url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
      }),
      providesTags: ['app-ordering'],
    }),

    updateAppOrderingStatus: builder.mutation({
      query: ({ id, ...updatedAppOrdering }) => ({
        url: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID(id),
        method: 'PUT',
        body: updatedAppOrdering,
      }),
      invalidatesTags: ['app-ordering'],
    }),
  }),
});

export const { useGetAppOrderingQuery, useUpdateAppOrderingMutation, useGetAppOrderingStatusQuery, useUpdateAppOrderingStatusMutation } =
  appOrderingApi;
