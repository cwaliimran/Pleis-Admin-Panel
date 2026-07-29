import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const brandsApi = createApi({
  reducerPath: 'brandsApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['brands'],

  endpoints: (builder) => ({
    getBrands: builder.query({
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
          url: API_ROUTES.ADMIN_PRESET_MENU_BRAND,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['brands'],
    }),

    addBrand: builder.mutation({
      query: (newBrand) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_BRAND,
        method: 'POST',
        body: newBrand,
      }),
      invalidatesTags: ['brands'],
    }),

    updateBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_BRAND_BY_ID(id),
        method: 'PUT',
        body: updatedBrand,
      }),
      invalidatesTags: ['brands'],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_PRESET_MENU_BRAND_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['brands'],
    }),
  }),
});

export const { useGetBrandsQuery, useAddBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = brandsApi;
