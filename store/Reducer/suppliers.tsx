import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const suppliersApi = createApi({
  reducerPath: 'suppliersApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['supplier'],

  endpoints: (builder) => ({
    getSuppliers: builder.query({
      query: ({ search, page, status, date, limit }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) (params as any).date = date;
        return {
          url: API_ROUTES.SUPPLIERS,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['supplier'],
    }),

    addSupplier: builder.mutation({
      query: (newSupplier) => ({
        url: API_ROUTES.SUPPLIERS,
        method: 'POST',
        body: newSupplier,
      }),
      invalidatesTags: ['supplier'],
    }),

    updateSupplier: builder.mutation({
      query: ({ id, ...updatedSupplier }) => ({
        url: API_ROUTES.SUPPLIERS_BY_ID(id),
        method: 'PUT',
        body: updatedSupplier,
      }),
    }),

    deleteSupplier: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.SUPPLIERS_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['supplier'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = suppliersApi;
