import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const presetTypeApi = createApi({
  reducerPath: 'presetTypeApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['presetType'],

  endpoints: (builder) => ({
    getPresetTypes: builder.query({
      query: ({ search, page, status, date, limit, category, subCategory, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (category) params.category = category;
        if (subCategory) params.subCategory = subCategory;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_MENU_PRESET_TYPE,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['presetType'],
    }),

    getPresetTypeCode: builder.query({
      query: () => ({
        url: API_ROUTES.ADMIN_MENU_PRESET_TYPE_CODE,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
      providesTags: ['presetType'],
    }),

    addPresetType: builder.mutation({
      query: (newPresetType) => ({
        url: API_ROUTES.ADMIN_MENU_PRESET_TYPE,
        method: 'POST',
        body: newPresetType,
      }),
      invalidatesTags: ['presetType'],
    }),

    updatePresetType: builder.mutation({
      query: ({ id, ...updatedPresetType }) => ({
        url: API_ROUTES.ADMIN_MENU_PRESET_TYPE_BY_ID(id),
        method: 'PUT',
        body: updatedPresetType,
      }),
      invalidatesTags: ['presetType'],
    }),

    deletePresetType: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_MENU_PRESET_TYPE_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['presetType'],
    }),
  }),
});

export const {
  useGetPresetTypesQuery,
  useGetPresetTypeCodeQuery,
  useAddPresetTypeMutation,
  useUpdatePresetTypeMutation,
  useDeletePresetTypeMutation,
} = presetTypeApi;
