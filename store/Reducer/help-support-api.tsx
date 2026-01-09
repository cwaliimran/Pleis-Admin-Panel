import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const helpSupportApi = createApi({
  reducerPath: 'helpSupportApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['help-support'],

  endpoints: (builder) => ({
    getHelpSupport: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_HELP_SUPPORT,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['help-support'],
    }),

    addHelpSupport: builder.mutation({
      query: (newHelpSupport) => ({
        url: API_ROUTES.ADMIN_HELP_SUPPORT,
        method: 'POST',
        body: newHelpSupport,
      }),
      invalidatesTags: ['help-support'],
    }),

    updateHelpSupport: builder.mutation({
      query: ({ id, ...updatedHelpSupport }) => ({
        url: API_ROUTES.ADMIN_HELP_SUPPORT_BY_ID(id),
        method: 'PUT',
        body: updatedHelpSupport,
      }),
      invalidatesTags: ['help-support'],
    }),

    deleteHelpSupport: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_HELP_SUPPORT_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['help-support'],
    }),
  }),
});

export const { useGetHelpSupportQuery, useAddHelpSupportMutation, useUpdateHelpSupportMutation, useDeleteHelpSupportMutation } = helpSupportApi;
