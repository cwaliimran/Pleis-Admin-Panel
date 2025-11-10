import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const highlightsApi = createApi({
  reducerPath: 'highlightsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['highlights'],

  endpoints: (builder) => ({
    getHighlights: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_HIGHLIGHT_LIST,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['highlights'],
    }),

    addHighlights: builder.mutation({
      query: (newHighlight) => ({
        url: API_ROUTES.ADMIN_HIGHLIGHT_LIST,
        method: 'POST',
        body: newHighlight,
      }),
      // invalidatesTags: ['highlights'],
    }),

    updateHighlights: builder.mutation({
      query: ({ id, ...updatedHighlight }) => ({
        url: API_ROUTES.ADMIN_HIGHLIGHT_LIST_BY_ID(id),
        method: 'PUT',
        body: updatedHighlight,
      }),
    }),

    deleteHighlights: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_HIGHLIGHT_LIST_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['highlights'],
    }),
  }),
});

export const { useGetHighlightsQuery, useAddHighlightsMutation, useUpdateHighlightsMutation, useDeleteHighlightsMutation } = highlightsApi;
