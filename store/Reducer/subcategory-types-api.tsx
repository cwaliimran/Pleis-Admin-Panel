import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQuery } from '../customFetchBaseQuery';

export const subcategoryTypesApi = createApi({
  reducerPath: 'subcategoryTypesApi',
  baseQuery: customFetchBaseQuery(),
  tagTypes: ['subcategoryTypes'],

  endpoints: (builder) => ({
    getSubcategoryTypes: builder.query({
      query: ({ search, page, status, date, limit, subCategory, sortBy, sortOrder }) => {
        const params: any = {
          keyword: search,
          status,
          page: page + 1,
          limit,
        };
        if (date) params.date = date;
        if (subCategory) params.subCategory = subCategory;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        return {
          url: API_ROUTES.ADMIN_MENU_SUB_CATEGORY_TYPES,
          method: 'GET',
          params,
        };
      },
      transformResponse: (res: any) => ({
        data: res.data,
        meta: res.meta,
      }),
      providesTags: ['subcategoryTypes'],
    }),

    addSubcategoryType: builder.mutation({
      query: (newSubcategoryType) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORY_TYPES,
        method: 'POST',
        body: newSubcategoryType,
      }),
      invalidatesTags: ['subcategoryTypes'],
    }),

    updateSubcategoryType: builder.mutation({
      query: ({ id, ...updatedSubcategoryType }) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORY_TYPES_BY_ID(id),
        method: 'PUT',
        body: updatedSubcategoryType,
      }),
      invalidatesTags: ['subcategoryTypes'],
    }),

    deleteSubcategoryType: builder.mutation({
      query: (id) => ({
        url: API_ROUTES.ADMIN_MENU_SUB_CATEGORY_TYPES_BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['subcategoryTypes'],
    }),
  }),
});

export const {
  useGetSubcategoryTypesQuery,
  useAddSubcategoryTypeMutation,
  useUpdateSubcategoryTypeMutation,
  useDeleteSubcategoryTypeMutation,
} = subcategoryTypesApi;
