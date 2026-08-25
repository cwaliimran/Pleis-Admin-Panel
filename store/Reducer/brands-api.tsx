import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

export const brandsApi = createApi({
  reducerPath: 'brandsApi',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
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
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_PRESET_MENU_BRAND,
            organizerRoute: API_ROUTES.ORGANIZER_PRESET_MENU_BRAND,
          },
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
