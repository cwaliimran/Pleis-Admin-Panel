import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const bundlesApi = createApi({
  reducerPath: 'bundlesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['bundle'],

  endpoints: (builder) => ({
    getBundles: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.ADMIN_BUNDLES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data.bundles,
        meta: res.meta,
      }),
      providesTags: ['bundle'],
    }),

    addBundle: builder.mutation({
      query: (newBundle) => ({
        url: API_ROUTES.ADMIN_BUNDLES,
        method: 'POST',
        body: newBundle,
      }),
      invalidatesTags: ['bundle'],
    }),

    updateBundle: builder.mutation({
      query: ({ id, ...updatedBundle }) => ({
        url: API_ROUTES.ADMIN_BUNDLES_BY_ID(id),
        method: 'PUT',
        body: updatedBundle,
      }),
      invalidatesTags: ['bundle'],
    }),

    deleteBundle: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_BUNDLES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['bundle'],
    }),
  }),
});

export const {
  useGetBundlesQuery,
  useAddBundleMutation,
  useUpdateBundleMutation,
  useDeleteBundleMutation,
} = bundlesApi;
